import pandas as pd

# Load original dataset
df = pd.read_csv("disaster_data.csv")

# Display dataset dimensions
print("Dataset shape:", df.shape)
"""
Cleaning pipeline for the NGO Resource Sharing platform.
Input : ngo_data.csv, disaster_data.csv  (same folder as this script)
Output: processed/  (normalized tables ready to load into SQL/Mongo) + validation_report.txt
Run   : python clean_data.py
"""
import re, os
import pandas as pd

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "processed")
os.makedirs(OUT, exist_ok=True)
report = []

def split_top(s, sep):
    """Split on sep, ignoring separators inside parentheses."""
    if pd.isna(s) or not str(s).strip():
        return []
    parts, depth, cur = [], 0, ""
    for ch in str(s):
        if ch == "(": depth += 1
        if ch == ")": depth -= 1
        if ch == sep and depth == 0:
            parts.append(cur.strip()); cur = ""
        else:
            cur += ch
    parts.append(cur.strip())
    return [p for p in parts if p]

def to_iso(s):
    d = pd.to_datetime(s, format="%d-%m-%Y", errors="coerce")
    return d.dt.strftime("%Y-%m-%d")

# Map NGO fields of work -> platform resource categories (derived, review before relying on it)
CATEGORY_MAP = {
    "Food": ["Nutrition", "Food Processing", "Agriculture", "Animal Husbandry - Dairying & Fisheries",
             "Animal Husbandry, Dairying & Fisheries"],
    "Medicines": ["Health & Family Welfare", "HIV/AIDS"],
    "Water & Sanitation": ["Drinking Water", "Water Resources"],
    "Shelter": ["Housing", "Urban Development & Poverty Alleviation"],
    "Education Supplies": ["Education & Literacy", "Children"],
    "Livelihood": ["Vocational Training", "Skill Development", "Micro Finance (SHGs)",
                   "Micro Small & Medium Enterprises", "Labour & Employment"],
}
FIELD_TO_CAT = {f: c for c, fs in CATEGORY_MAP.items() for f in fs}

# ---------------- NGOs ----------------
ngo = pd.read_csv(os.path.join(BASE, "ngo_data.csv"), dtype=str).fillna("")
ngo = ngo.apply(lambda c: c.str.strip())

ngo["ngo_email"] = ngo["ngo_email"].str.lower()
ngo["date_of_registration"] = to_iso(ngo["date_of_registration"])
ngo["data_as_on"] = to_iso(ngo["data_as_on"])
ngo["ngo_name"] = ngo["ngo_name"].str.replace(r"\s+", " ", regex=True).str.title()
ngo["fcra_registration_number"] = ngo["fcra_registration_number"].replace({"Nil": "", "NIL": ""})
ngo["has_fcra"] = ngo["fcra_registration_number"].ne("")

# validation flags
email_ok = ngo["ngo_email"].str.match(r"^[\w.+-]+@[\w-]+(\.[\w-]+)+$")
ngo["flag_invalid_email"] = ~email_ok
ngo["flag_missing_fields_of_work"] = ngo["fields_of_work"].eq("")
ngo["flag_future_registration"] = pd.to_datetime(ngo["date_of_registration"]) > pd.Timestamp.today()
# Delhi/Dhruvh style bad values: act_name that is a person's/entity's own name
ngo["flag_suspect_act_name"] = ngo.apply(
    lambda r: bool(r["act_name"]) and ("act" not in r["act_name"].lower()
              and "trust" not in r["act_name"].lower() and "compan" not in r["act_name"].lower()
              and "society" not in r["act_name"].lower()), axis=1)
ngo["flag_duplicate_email"] = ngo.duplicated("ngo_email", keep=False)
ngo["flag_duplicate_reg_no"] = ngo.duplicated(["registration_number", "state"], keep=False)

report.append(f"NGO rows: {len(ngo)}")
for col in [c for c in ngo.columns if c.startswith("flag_")]:
    n = int(ngo[col].sum())
    report.append(f"  {col}: {n}")
    if n:
        report.append("    -> " + "; ".join(ngo.loc[ngo[col], "ngo_id"].tolist()))

# many-to-many tables
fw = [(r.ngo_id, f) for r in ngo.itertuples() for f in split_top(r.fields_of_work, ";")]
ngo_fields = pd.DataFrame(fw, columns=["ngo_id", "field_of_work"])
ngo_fields["resource_category"] = ngo_fields["field_of_work"].map(FIELD_TO_CAT).fillna("Other")

sa = [(r.ngo_id, d) for r in ngo.itertuples() for d in split_top(r.districts_of_operation, ";") or
      split_top(r.districts_of_operation, ",")]
ngo_areas = pd.DataFrame(sa, columns=["ngo_id", "district"])
ngo_areas["state"] = ngo_areas["ngo_id"].map(ngo.set_index("ngo_id")["state"])

# summary columns on main table (handy for the matching engine)
cats = ngo_fields[ngo_fields.resource_category != "Other"].groupby("ngo_id")["resource_category"] \
    .apply(lambda s: "; ".join(sorted(set(s))))
ngo["resource_categories"] = ngo["ngo_id"].map(cats).fillna("")
ngo["num_fields_of_work"] = ngo["ngo_id"].map(ngo_fields.groupby("ngo_id").size()).fillna(0).astype(int)

# Platform columns that the backend will fill later (kept empty on purpose, not invented)
ngo["trust_score"] = ""
ngo["ai_risk_flag"] = ""
ngo["latitude"] = ""
ngo["longitude"] = ""

ngo.drop(columns=["fields_of_work", "districts_of_operation"]).to_csv(
    os.path.join(OUT, "ngos.csv"), index=False)
ngo_fields.to_csv(os.path.join(OUT, "ngo_fields.csv"), index=False)
ngo_areas.to_csv(os.path.join(OUT, "ngo_service_areas.csv"), index=False)

# ---------------- Disasters ----------------
dis = pd.read_csv(os.path.join(BASE, "disaster_data.csv"), dtype=str).fillna("")
dis["start_date"] = to_iso(dis["start_date"]).fillna("")
dis["ncrb_deaths_2024"] = pd.to_numeric(dis["ncrb_deaths_2024"], errors="coerce")
dis["is_researched"] = dis["data_basis"].str.contains("Researched|researched", regex=True)
dis["shortage_is_inferred"] = dis["data_basis"].str.contains("INFERRED")

def explode(col, name, split_char):
    rows = [(r.disaster_id, v) for r in dis.itertuples() for v in split_top(getattr(r, col), split_char)]
    return pd.DataFrame(rows, columns=["disaster_id", name])

d_res = explode("priority_resource_category", "resource_category", ";")
d_items = explode("resources_in_shortage", "shortage_item", ";")
d_ngos = explode("ngos_contributing", "ngo_name", ";")
d_dist = explode("districts_affected", "district", ",")
d_ngos["linked_ngo_id"] = d_ngos["ngo_name"].str.title().map(
    ngo.set_index("ngo_name")["ngo_id"]).fillna("")

report.append(f"\nDisaster rows: {len(dis)}  (researched: {int(dis.is_researched.sum())}, "
              f"shortage inferred: {int(dis.shortage_is_inferred.sum())})")
report.append(f"Shortage items: {len(d_items)}, resource category links: {len(d_res)}, "
              f"contributing NGOs: {len(d_ngos)}, districts: {len(d_dist)}")
report.append("Disaster NGOs matched to your NGO table: " +
              str(int((d_ngos.linked_ngo_id != '').sum())) + " (expected 0 - these are national NGOs, not in your sample)")

dis.drop(columns=["priority_resource_category", "resources_in_shortage", "ngos_contributing",
                  "districts_affected"]).to_csv(os.path.join(OUT, "disasters.csv"), index=False)
d_res.to_csv(os.path.join(OUT, "disaster_resource_categories.csv"), index=False)
d_items.to_csv(os.path.join(OUT, "disaster_shortage_items.csv"), index=False)
d_ngos.to_csv(os.path.join(OUT, "disaster_ngo_contributions.csv"), index=False)
d_dist.to_csv(os.path.join(OUT, "disaster_districts.csv"), index=False)

with open(os.path.join(OUT, "validation_report.txt"), "w") as f:
    f.write("\n".join(report))
print("\n".join(report))
print("\nFiles written to", OUT)