"""
Cleans non_profit.csv (Wikipedia-sourced Indian non-profits) and extracts structured features.
Input : non_profit.csv   Output: non_profit_clean.csv, non_profit_focus_areas.csv, non_profit_summary.txt
Run   : python clean_nonprofit.py
"""
import re, os
import pandas as pd

BASE = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(BASE, "non_profit.csv"), dtype=str, encoding="utf-8-sig").fillna("")
df.columns = ["organization", "wikipedia_url", "description_raw", "description_plain"]

# ---- 1. basic cleaning ----
def clean(t):
    t = re.sub(r"\[[^\]]*\]", "", t)          # remove [1], [citation needed] etc.
    t = re.sub(r"\s+", " ", t).strip()
    return t
df["organization"] = df["organization"].str.strip()
df["org_name_clean"] = df["organization"].str.replace(r"\s*\((organisation|organization|India|NGO|technical summit)\)", "", regex=True, flags=re.I).str.strip()
df["description"] = df["description_raw"].map(clean)
df["summary"] = df["description"].str.split(r"(?<=[.!?])\s+(?=[A-Z])", n=1, regex=True).str[0]
df["word_count"] = df["description"].str.split().str.len()
df = df.drop(columns=["description_raw", "description_plain"]).drop_duplicates("wikipedia_url")

low = df["description"].str.lower()

# ---- 2. founding year ----
def founded(t):
    m = re.search(r"(founded|established|formed|incorporated|registered|started|set up|launched|inception|created)[^.]{0,80}?\b(1[89]\d\d|20[0-2]\d)\b", t, re.I)
    if m: return int(m.group(2)), "high"
    m = re.search(r"\b(?:in|since)\s+(1[89]\d\d|20[0-2]\d)\b", t)
    if m: return int(m.group(1)), "low"
    return None, ""
fy = df["description"].map(founded)
df["founded_year"] = [x[0] for x in fy]
df["founded_year_confidence"] = [x[1] for x in fy]

# ---- 3. location (state / city mentioned) ----
STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
 "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya",
 "Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
 "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Puducherry","Chandigarh"]
CITY_STATE = {"Mumbai":"Maharashtra","Pune":"Maharashtra","Nagpur":"Maharashtra","Bangalore":"Karnataka","Bengaluru":"Karnataka",
 "Mysore":"Karnataka","Chennai":"Tamil Nadu","Coimbatore":"Tamil Nadu","Madurai":"Tamil Nadu","Hyderabad":"Telangana",
 "Kolkata":"West Bengal","Calcutta":"West Bengal","New Delhi":"Delhi","Ahmedabad":"Gujarat","Surat":"Gujarat",
 "Jaipur":"Rajasthan","Lucknow":"Uttar Pradesh","Varanasi":"Uttar Pradesh","Patna":"Bihar","Bhopal":"Madhya Pradesh",
 "Indore":"Madhya Pradesh","Kochi":"Kerala","Thiruvananthapuram":"Kerala","Trivandrum":"Kerala","Kozhikode":"Kerala",
 "Bhubaneswar":"Odisha","Guwahati":"Assam","Chandigarh":"Chandigarh","Dehradun":"Uttarakhand","Ranchi":"Jharkhand",
 "Raipur":"Chhattisgarh","Visakhapatnam":"Andhra Pradesh","Vijayawada":"Andhra Pradesh","Gurgaon":"Haryana","Gurugram":"Haryana","Noida":"Uttar Pradesh"}
def find_loc(t):
    hq = re.search(r"(?:headquarter\w*|based|head office|registered office|located)\s+(?:primarily\s+)?(?:in|at)\s+([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)?)", t)
    city = hq.group(1) if hq else ""
    counts = {s: len(re.findall(r"\b%s\b" % s, t)) for s in STATES}
    for c, s in CITY_STATE.items():
        counts[s] = counts.get(s, 0) + len(re.findall(r"\b%s\b" % c, t))
    state = max(counts, key=counts.get) if max(counts.values()) > 0 else ""
    if city in CITY_STATE: state = CITY_STATE[city]
    elif city in STATES: state, city = city, ""
    n_states = sum(1 for v in counts.values() if v > 0)
    return city, state, n_states
loc = df["description"].map(find_loc)
df["hq_city_guess"] = [x[0] for x in loc]
df["primary_state_guess"] = [x[1] for x in loc]
df["states_mentioned_count"] = [x[2] for x in loc]
df["operates_pan_india"] = df["description"].str.contains(r"\b(?:across India|all over India|pan-India|nationwide|throughout India|national level|states of India)\b", case=False, regex=True) | (df["states_mentioned_count"] >= 6)

# ---- 4. focus areas ----
FOCUS = {
 "Education": r"educat|school|literacy|college|student|scholarship|learning|library|libraries",
 "Health": r"health|medical|hospital|medicine|patient|disease|cancer|hiv|nutrition|blood|clinic|doctor",
 "Women & Girls": r"\bwomen\b|\bgirl|gender|female",
 "Children & Youth": r"child|youth|\bkids\b|adolescent|orphan",
 "Environment & Wildlife": r"environment|climate|forest|wildlife|biodiversity|pollution|conservation|water|ecolog",
 "Rural Development & Livelihood": r"rural|village|farmer|agricultur|livelihood|poverty|skill|vocational|self-help|microfinance",
 "Disaster Relief": r"disaster|flood|earthquake|tsunami|cyclone|relief|rehabilitat|emergency|pandemic|covid",
 "Food & Nutrition": r"\bfood|hunger|meal|nutrition|midday|ration",
 "Animal Welfare": r"animal|dog|cattle|stray",
 "Human Rights & Governance": r"human rights|democra|governance|election|transparen|advocacy|legal aid|rights",
 "Arts & Culture": r"\bart\b|\barts\b|culture|music|dance|theatre|literature|heritage",
 "Science & Technology": r"science|technolog|research|engineer|astronom|innovation",
 "Professional / Industry Body": r"industry|industries|trade|chamber|professional|members|operators|practitioners|association of",
}
focus_rows = []
for i, t in low.items():
    for name, pat in FOCUS.items():
        n = len(re.findall(pat, t))
        if n >= 2:
            focus_rows.append((df.at[i, "organization"], name, n))
focus = pd.DataFrame(focus_rows, columns=["organization", "focus_area", "keyword_hits"])
focus["rank"] = focus.groupby("organization")["keyword_hits"].rank(ascending=False, method="first")
top = focus[focus["rank"] <= 3].sort_values(["organization", "rank"])
df["top_focus_areas"] = df["organization"].map(top.groupby("organization")["focus_area"].apply("; ".join)).fillna("")
df["primary_focus"] = df["organization"].map(top[top["rank"] == 1].set_index("organization")["focus_area"]).fillna("Unclassified")

# ---- 5. resource types the org mentions handling ----
RES = {"Food": r"\bfood|\bmeals?\b|\brations?\b|\bgrains?\b|mid-day meal", "Medicines": r"\bmedicines?\b|\bdrugs?\b|medical suppl",
       "Blood": r"\bblood (bank|donation|donor)", "Clothing": r"\bclothes\b|\bclothing\b|\bgarments?\b",
       "Books": r"\bbooks?\b|\blibrar", "Water": r"drinking water|water supply|water purif",
       "Shelter": r"\bshelter|\bhousing\b|\bhomes? for\b", "Funds": r"\bfunds?\b|\bgrants?\b|\bdonations?\b"}
df["resource_types_mentioned"] = [
    "; ".join(k for k, p in RES.items() if re.search(p, t)) for t in low]

# ---- 6. disaster experience ----
df["disaster_experience"] = low.str.contains(r"disaster|\bfloods?\b|earthquake|tsunami|cyclone|relief (?:work|operation|camp|material|effort|activit)|covid-19 relief|pandemic relief|flood relief")

# ---- 7. scale (largest beneficiary count mentioned) ----
MULT = {"lakh": 1e5, "million": 1e6, "crore": 1e7, "thousand": 1e3, "billion": 1e9}
def scale(t):
    best = 0
    for m in re.finditer(r"(\d[\d,]*\.?\d*)\s*(lakh|million|crore|thousand|billion)?\s+(children|people|beneficiaries|students|women|villages|patients|families|farmers|households|lives|schools|members)", t, re.I):
        try: v = float(m.group(1).replace(",", ""))
        except ValueError: continue
        v *= MULT.get((m.group(2) or "").lower(), 1)
        best = max(best, v)
    return int(best) if best else None
df["max_reach_mentioned"] = df["description"].map(scale)

# ---- 8. relevance to a resource-sharing platform ----
SERVICE = ["Health", "Disaster Relief", "Food & Nutrition", "Rural Development & Livelihood", "Education", "Children & Youth", "Women & Girls"]
NOT_AN_ORG = {"Non-profit laws of India", "Amalthea (technical summit)", "Books on the Delhi Metro"}
INDUSTRY_NAME = re.compile(r"(chamber|confederation|federation of|operators|audit bureau|audience research|data security|mills association|tax practitioners|tie |phdcci|industry)", re.I)
df["record_type"] = df["organization"].map(lambda n: "Not an organization (article/event/project)" if n in NOT_AN_ORG else "Organization")
INSTITUTION = re.compile(r"\b(school|college|university|institute of|public school)\b", re.I)
def relevance(r):
    if r["record_type"] != "Organization": return "Exclude (not an organization)"
    if INDUSTRY_NAME.search(r["organization"]): return "Low (industry/professional body)"
    if r["primary_focus"] == "Professional / Industry Body": return "Medium"
    if INSTITUTION.search(r["org_name_clean"]) and not r["disaster_experience"]: return "Medium"
    if r["primary_focus"] in SERVICE or r["disaster_experience"]: return "High"
    return "Medium"
df["platform_relevance"] = df.apply(relevance, axis=1)
df["suggested_role"] = df.apply(lambda r:
    "Possible resource provider/requester (field NGO)" if r["platform_relevance"] == "High" else
    "Partner / information only" if r["platform_relevance"] == "Medium" else "Exclude from matching", axis=1)

df = df.sort_values("organization").reset_index(drop=True)
df.insert(0, "np_id", [f"NP{i:03d}" for i in range(1, len(df) + 1)])
df.to_csv(os.path.join(BASE, "non_profit_clean.csv"), index=False)
focus.drop(columns="rank").merge(df[["np_id", "organization"]], on="organization")[["np_id", "organization", "focus_area", "keyword_hits"]] \
    .to_csv(os.path.join(BASE, "non_profit_focus_areas.csv"), index=False)

# ---- summary ----
S = []
S.append(f"Organizations: {len(df)}")
S.append("\nPlatform relevance:\n" + df.platform_relevance.value_counts().to_string())
S.append("\nPrimary focus:\n" + df.primary_focus.value_counts().to_string())
S.append("\nOrgs with disaster experience: %d" % df.disaster_experience.sum())
S.append("Orgs operating pan-India: %d" % df.operates_pan_india.sum())
S.append("Founded year found: %d / %d" % (df.founded_year.notna().sum(), len(df)))
S.append("\nBy primary state (guess):\n" + df[df.primary_state_guess != ""].primary_state_guess.value_counts().head(10).to_string())
S.append("\nResource types mentioned:\n" + df.resource_types_mentioned.str.split("; ").explode().replace("", pd.NA).dropna().value_counts().to_string())
S.append("\nDisaster-experienced orgs:\n" + "\n".join(df[df.disaster_experience].organization.tolist()))
open(os.path.join(BASE, "non_profit_summary.txt"), "w").write("\n".join(S))
print("\n".join(S))