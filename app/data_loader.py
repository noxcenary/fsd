"""
Data Loader and Mock Database Initializer for ReliefNet
Loads real NGOs from dataset/Non Profit Org.csv and augments them with realistic
operational metadata, verification tiers, inventory, services, and transactions.
"""

import csv
import os
import random
import hashlib
from typing import List, Dict, Any, Optional

class ReliefNetDatabase:
    def __init__(self, csv_path: str = "dataset/Non Profit Org.csv"):
        self.csv_path = csv_path
        self.ngos: List[Dict[str, Any]] = []
        self.inventory: List[Dict[str, Any]] = []
        self.services: List[Dict[str, Any]] = []
        self.requests: List[Dict[str, Any]] = []
        self.transfers: List[Dict[str, Any]] = []
        self.disputes: List[Dict[str, Any]] = []
        self.triage_queue: List[Dict[str, Any]] = []
        self.sybil_nodes: List[Dict[str, Any]] = []
        self.ledger_blocks: List[Dict[str, Any]] = []
        self.messages: Dict[str, List[Dict[str, Any]]] = {}
        self.emergency_mode: bool = True
        self.load_data()

    def load_data(self):
        # 1. Load NGOs from CSV
        karnataka_districts = [
            "Bengaluru Urban", "Bengaluru Rural", "Belagavi", "Mysuru", 
            "Hubballi-Dharwad", "Mangaluru", "Kalaburagi", "Ballari", 
            "Shivamogga", "Tumakuru", "Udupi", "Davangere", "Raichur", "Hassan"
        ]
        
        sectors_pool = [
            ["Disaster Relief", "Emergency Food", "Flood Operations"],
            ["Medical Trauma", "First Aid", "Mobile Healthcare"],
            ["Shelter & Tarpaulins", "Sanitation", "Water Purification"],
            ["Logistics & Fleets", "Warehousing", "Cold Chain"],
            ["Community Kitchens", "Nutrition", "Child Relief"],
            ["Search & Rescue", "Ambulance Corps", "Disaster Comms"]
        ]

        if os.path.exists(self.csv_path):
            with open(self.csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
                reader = csv.DictReader(f)
                idx = 1
                for row in reader:
                    name = (row.get("\ufeffOrganization") or row.get("Organization") or "").strip()
                    desc = (row.get("Clean Description") or row.get("Description") or "").strip()
                    link = (row.get("Link") or "").strip()
                    if not name:
                        continue
                    
                    # Consistent hashing for deterministic attributes
                    h = int(hashlib.md5(name.encode("utf-8")).hexdigest(), 16)
                    district = karnataka_districts[h % len(karnataka_districts)]
                    sectors = sectors_pool[h % len(sectors_pool)]
                    
                    # Verification Tier
                    # 60% Tier-1 Sovereign Govt Verified, 30% Tier-2 Community Attested, 10% Pending Review
                    rand_tier = h % 100
                    if rand_tier < 60:
                        tier = "Tier-1 Sovereign Verified"
                        tier_code = "tier_1"
                        badge_color = "green"
                        darpan_id = f"KA/{2015 + (h % 9)}/{str(h % 90000 + 10000).zfill(7)}"
                        trust_score = 90 + (h % 10)
                    elif rand_tier < 90:
                        tier = "Tier-2 Community Attested"
                        tier_code = "tier_2"
                        badge_color = "blue"
                        darpan_id = f"REF-COMM-{h % 8000 + 1000}"
                        trust_score = 75 + (h % 15)
                    else:
                        tier = "Under Governance Review"
                        tier_code = "pending"
                        badge_color = "yellow"
                        darpan_id = f"APP-PEND-{h % 5000 + 1000}"
                        trust_score = 60 + (h % 15)

                    ngo = {
                        "id": f"NGO-KA-{str(idx).zfill(4)}",
                        "name": name,
                        "description": desc[:350] + ("..." if len(desc) > 350 else ""),
                        "full_description": desc,
                        "link": link,
                        "state": "Karnataka",
                        "district": district,
                        "darpan_id": darpan_id,
                        "verification_tier": tier,
                        "tier_code": tier_code,
                        "badge_color": badge_color,
                        "trust_score": trust_score,
                        "sla_adherence": f"{92 + (h % 8)}.{h % 10}%",
                        "completed_transfers": 12 + (h % 85),
                        "dispute_rate": f"{round((h % 15) * 0.1, 1)}%",
                        "sectors": sectors,
                        "contact_officer": f"Coordination Officer #{100 + (h % 900)}",
                        "phone": f"+91 98{str(h % 90000000 + 10000000)[:8]}",
                        "address": f"Plot {12 + (h % 200)}, Industrial Area, {district}, Karnataka",
                        "established_year": 1995 + (h % 28),
                        "public_key": f"0x{(hashlib.sha256(name.encode()).hexdigest())[:24]}...",
                        "active_surplus_items": h % 5 + 1,
                        "open_needs": h % 4
                    }
                    self.ngos.append(ngo)
                    idx += 1

        # Seed specific canonical organizations from the design specifications
        self._seed_canonical_entities()
        self._seed_inventory()
        self._seed_services()
        self._seed_requests()
        self._seed_transfers()
        self._seed_disputes()
        self._seed_triage_queue()
        self._seed_sybil_intelligence()
        self._seed_ledger_stream()
        self._seed_comms()

    def _seed_canonical_entities(self):
        # Grama Seva Federation (Logged in User Organization)
        grama = {
            "id": "NGO-KA-2021-8841",
            "name": "Grama Seva Federation",
            "description": "State Disaster Management Partner specializing in logistics networks, emergency nutrition dispatch, and multi-district supply chain staging in Karnataka.",
            "full_description": "Grama Seva Federation is an accredited Tier-1 humanitarian entity authorized under the Karnataka State Disaster Management Framework. Operates 3 central warehousing hubs in Bengaluru, Tumakuru, and Belagavi with dedicated cold storage and fleet logistics.",
            "link": "https://gramaseva.org.in",
            "state": "Karnataka",
            "district": "Bengaluru Urban",
            "darpan_id": "KA/2021/8841",
            "verification_tier": "Tier-1 Sovereign Verified",
            "tier_code": "tier_1",
            "badge_color": "green",
            "trust_score": 98.4,
            "sla_adherence": "99.2%",
            "completed_transfers": 142,
            "dispute_rate": "0.0%",
            "sectors": ["Disaster Relief", "Logistics & Fleets", "Community Kitchens"],
            "contact_officer": "Vikram Nadgowda (Executive Trustee)",
            "phone": "+91 98450 12890",
            "address": "Sector 4, Central Humanitarian Depot, Peenya, Bengaluru Urban, Karnataka",
            "established_year": 2012,
            "public_key": "0x7F4B92A8E1C2...9841",
            "active_surplus_items": 4,
            "open_needs": 1
        }
        # Insert or update at index 0
        self.ngos.insert(0, grama)

    def _seed_inventory(self):
        self.inventory = [
            {
                "id": "RES-INV-101",
                "title": "Sona Masoori Rice (Grade A)",
                "category": "Emergency Food & Grains",
                "quantity": 12500,
                "unit": "kg",
                "allocated": 4200,
                "available": 8300,
                "location": "Bengaluru Central Depot (Bay 4)",
                "district": "Bengaluru Urban",
                "owner_id": "NGO-KA-2021-8841",
                "owner_name": "Grama Seva Federation",
                "expiry_days": 18,
                "expiry_date": "2026-11-23",
                "status": "Priority Allocation",
                "batch_no": "BATCH-KA-2026-R12",
                "specs": "Moisture < 12%, Non-GMO, Jute Bagging (50kg)",
                "storage_cert": "FSSAI-REG-9812904-A",
                "transfer_radius_km": 450,
                "min_claim_qty": 250
            },
            {
                "id": "RES-INV-102",
                "title": "Heavy-Duty Waterproof Tarpaulins (24x20ft)",
                "category": "Shelter & Settlement",
                "quantity": 850,
                "unit": "units",
                "allocated": 250,
                "available": 600,
                "location": "Hubballi Forward Logistics Hub",
                "district": "Hubballi-Dharwad",
                "owner_id": "NGO-KA-0004",
                "owner_name": "Agastya International Foundation",
                "expiry_days": 180,
                "expiry_date": "2027-05-04",
                "status": "Available",
                "batch_no": "BATCH-TAR-882",
                "specs": "250 GSM High-Density Polyethylene, UV-treated, Brass Eyelets",
                "storage_cert": "ISO-9001-SHE-441",
                "transfer_radius_km": 600,
                "min_claim_qty": 25
            },
            {
                "id": "RES-INV-103",
                "title": "Emergency Trauma Care & Surgical Kits",
                "category": "Medical Supplies",
                "quantity": 420,
                "unit": "kits",
                "allocated": 110,
                "available": 310,
                "location": "Mangaluru Coastal Medical Staging Hub",
                "district": "Mangaluru",
                "owner_id": "NGO-KA-0010",
                "owner_name": "Animal Aid Unlimited / Health Division",
                "expiry_days": 42,
                "expiry_date": "2026-12-17",
                "status": "Expedited Transfer",
                "batch_no": "MED-TR-0941",
                "specs": "Sterile sutures, gauze, IV saline, tourniquets, burn dressings",
                "storage_cert": "CDSCO-DIS-8812-B",
                "transfer_radius_km": 300,
                "min_claim_qty": 10
            },
            {
                "id": "RES-INV-104",
                "title": "Reverse Osmosis Rapid Water Purification Skids",
                "category": "Water & Sanitation (WASH)",
                "quantity": 18,
                "unit": "skids",
                "allocated": 6,
                "available": 12,
                "location": "Belagavi Flood Operational Depot",
                "district": "Belagavi",
                "owner_id": "NGO-KA-0001",
                "owner_name": "A.P.J. Abdul Kalam Centre",
                "expiry_days": 365,
                "expiry_date": "2027-11-05",
                "status": "Available",
                "batch_no": "WASH-RO-500LPH",
                "specs": "500 Liters/hour potable output, Diesel generator powered",
                "storage_cert": "BIS-10500-COMPLIANT",
                "transfer_radius_km": 500,
                "min_claim_qty": 1
            },
            {
                "id": "RES-INV-105",
                "title": "Baby Nutrition Formula & High-Energy Biscuits",
                "category": "Emergency Food & Grains",
                "quantity": 3400,
                "unit": "packs",
                "allocated": 1200,
                "available": 2200,
                "location": "Tumakuru Regional Depot",
                "district": "Tumakuru",
                "owner_id": "NGO-KA-2021-8841",
                "owner_name": "Grama Seva Federation",
                "expiry_days": 26,
                "expiry_date": "2026-12-01",
                "status": "Priority Allocation",
                "batch_no": "NUT-BP5-2026",
                "specs": "Fortified Ready-to-Use Supplementary Food, WHO certified",
                "storage_cert": "FSSAI-LIC-1092-2024",
                "transfer_radius_km": 400,
                "min_claim_qty": 100
            }
        ]

    def _seed_services(self):
        self.services = [
            {
                "id": "SRV-DEP-201",
                "name": "Mobile Disaster Field Clinic & Paramedic Crew",
                "category": "Medical Emergency Teams",
                "provider": "Karuna Medical Relief Corps",
                "capacity": "4 Ambulances + 12 Trauma EMTs",
                "district": "Belagavi",
                "status": "Deployed - Active Shift",
                "response_time": "Under 2 Hours",
                "certifications": "National Disaster Response Force (NDRF) Level 2 Attested"
            },
            {
                "id": "SRV-DEP-202",
                "name": "Heavy 4x4 Inundation Cargo Transport Fleet",
                "category": "Specialized Logistics & Fleet",
                "provider": "Grama Seva Federation",
                "capacity": "6 All-Terrain 10-Ton Trucks + Snorkel Air Intake",
                "district": "Bengaluru Urban",
                "status": "Available on Standby",
                "response_time": "1 Hour",
                "certifications": "State Emergency Transport Protocol Authorized"
            },
            {
                "id": "SRV-DEP-203",
                "name": "Rapid Deployable Community Kitchen Unit",
                "category": "Emergency Nutrition",
                "provider": "Akshaya Seva Sangha",
                "capacity": "15,000 Hot Meals / 24hr Cycle",
                "district": "Hubballi-Dharwad",
                "status": "Deployed - Camp Stage 2",
                "response_time": "4 Hours",
                "certifications": "FSSAI Mobile Food Safety License Tier-A"
            },
            {
                "id": "SRV-DEP-204",
                "name": "High-Volume Flood De-Watering & Pumping Asset",
                "category": "Infrastructure Stabilization",
                "provider": "Kaveri Basin Technical Relief",
                "capacity": "8 High-Head Submersible Pumps (100 HP)",
                "district": "Mysuru",
                "status": "Available on Standby",
                "response_time": "3 Hours",
                "certifications": "Irrigation & Drainage Board Engineering Clearance"
            }
        ]

    def _seed_requests(self):
        self.requests = [
            {
                "id": "REQ-1049",
                "title": "500 kg Non-Perishable Rice (Sona Masoori)",
                "category": "Emergency Food & Grains",
                "requester_id": "NGO-KA-0088",
                "requester_name": "Belagavi Flood Relief Taskforce",
                "location": "Relief Staging Camp #3, Gokak Taluk, Belagavi",
                "district": "Belagavi",
                "urgency": "CRITICAL",
                "urgency_badge": "red",
                "quantity_needed": 500,
                "unit": "kg",
                "quantity_fulfilled": 350,
                "deficit": 150,
                "progress_pct": 70,
                "beneficiaries": 850,
                "required_by": "2026-11-08",
                "sla_countdown": "14 hrs 32 min",
                "status": "Multi-Provider Allocation",
                "status_code": "in_progress",
                "pledges": [
                    {"donor": "Grama Seva Federation", "qty": 250, "unit": "kg", "status": "In Transit (#WB-2023-8821A)"},
                    {"donor": "Agastya Foundation", "qty": 100, "unit": "kg", "status": "Ready for Dispatch"}
                ],
                "purpose": "Emergency food distribution to 320 marooned flood victim families in Gokak basin.",
                "receiving_bay": "High-clearance bay, forklift available, dry shed verified",
                "ai_matched_count": 4,
                "best_match_score": 94.2
            },
            {
                "id": "REQ-1050",
                "title": "120 Waterproof Tarpaulins (24x20ft) for Temporary Shelters",
                "category": "Shelter & Settlement",
                "requester_id": "NGO-KA-0042",
                "requester_name": "Kaveri Basin Relief Coalition",
                "location": "Nanjangud Inundation Shelter Point, Mysuru",
                "district": "Mysuru",
                "urgency": "HIGH",
                "urgency_badge": "yellow",
                "quantity_needed": 120,
                "unit": "units",
                "quantity_fulfilled": 120,
                "deficit": 0,
                "progress_pct": 100,
                "beneficiaries": 480,
                "required_by": "2026-11-10",
                "sla_countdown": "36 hrs 00 min",
                "status": "Fully Pledged - Dispatched",
                "status_code": "dispatched",
                "pledges": [
                    {"donor": "Grama Seva Federation", "qty": 120, "unit": "units", "status": "Consignment Dispatched"}
                ],
                "purpose": "Rooftop sealing for breached community halls sheltering displaced elderly.",
                "receiving_bay": "Ground floor staging ramp, hand-unloading crew ready",
                "ai_matched_count": 2,
                "best_match_score": 98.0
            },
            {
                "id": "REQ-1051",
                "title": "50 Emergency Surgical & Trauma Packs",
                "category": "Medical Supplies",
                "requester_id": "NGO-KA-0019",
                "requester_name": "Hubballi Rural Health Collective",
                "location": "Kundgol Primary Health Center, Dharwad",
                "district": "Hubballi-Dharwad",
                "urgency": "CRITICAL",
                "urgency_badge": "red",
                "quantity_needed": 50,
                "unit": "packs",
                "quantity_fulfilled": 10,
                "deficit": 40,
                "progress_pct": 20,
                "beneficiaries": 200,
                "required_by": "2026-11-06",
                "sla_countdown": "05 hrs 15 min",
                "status": "Urgent Matching",
                "status_code": "open",
                "pledges": [
                    {"donor": "Karuna Medical Corps", "qty": 10, "unit": "packs", "status": "Pledged"}
                ],
                "purpose": "Treating waterborne lacerations and trauma cases post-flash flood.",
                "receiving_bay": "Cold-chain medical reception dock",
                "ai_matched_count": 3,
                "best_match_score": 87.5
            }
        ]

    def _seed_transfers(self):
        self.transfers = [
            {
                "id": "TRF-2026-8821",
                "waybill_id": "WB-2023-8821A",
                "requisition_id": "REQ-1049",
                "provider": "Grama Seva Federation (Bangalore Central Warehouse)",
                "provider_id": "NGO-KA-2021-8841",
                "receiver": "Belagavi District Flood Relief Taskforce",
                "receiver_id": "NGO-KA-0088",
                "items": [
                    {"item": "Sona Masoori Rice (Grade A)", "qty": "250 kg", "bags": "5 Jute Sacks (50kg)"},
                    {"item": "Heavy Tarpaulins 24x20ft", "qty": "120 units", "packs": "12 Bundles (10/pkg)"}
                ],
                "carrier": "Karnataka SDRF Transport Unit #TRK-KA-22-9014",
                "driver": "Suresh Gowda (DL: KA04-201800291)",
                "status": "In Transit - Approaching Weighbridge",
                "status_code": "in_transit",
                "stage": 3, # 1: Pledged, 2: Loading, 3: In-Transit, 4: Weighbridge, 5: Confirmed
                "departure_time": "2026-11-05 06:30 IST",
                "eta": "2026-11-05 18:45 IST",
                "gps_lat": 14.4521,
                "gps_lon": 75.9214,
                "distance_km": 412,
                "distance_completed_km": 285,
                "checkpoints": [
                    {"name": "Peenya Central Warehouse Bay", "status": "Departed 06:30", "done": True},
                    {"name": "Tumakuru Toll Plaza", "status": "Logged 08:15", "done": True},
                    {"name": "Chitradurga Relay Station", "status": "Logged 12:40", "done": True},
                    {"name": "Hubballi Bypass Weighbridge", "status": "Expected 16:15", "done": False},
                    {"name": "Belagavi Inward Receiving Dock", "status": "Destination ETA 18:45", "done": False}
                ],
                "sha256_seal": "8f3b20d91c7849e8a0021b3490fd381e92d8374902183cde9102837482910fed"
            }
        ]

    def _seed_disputes(self):
        self.disputes = [
            {
                "id": "DISP-2023-049",
                "waybill_id": "WB-HUB-8812",
                "title": "Weighbridge Tare Variance Dispute - Consignment #WB-HUB-8812",
                "claimant": "Belagavi Inward Receiving Depot",
                "respondent": "Kalyana Logistics Syndicate",
                "manifest_weight": 8500,
                "recorded_weight": 7880,
                "variance_kg": -620,
                "variance_pct": -7.3,
                "tolerance_pct": 2.0,
                "status": "Active Conciliation Bench",
                "status_code": "under_review",
                "evidence": [
                    {"title": "Hubballi Highway Weighbridge Slip #WB-8812", "file": "weighbridge_slip_8812.pdf", "verified": True},
                    {"title": "Receiving Bay Digital Scale Photo", "file": "scale_photo_bay3.jpg", "verified": True},
                    {"title": "Truck Bed En-Route Moisture Damage Affidavit", "file": "driver_deposition.pdf", "verified": False}
                ],
                "statutory_recommendation": "Debit note issued for 620 kg deficit. Suspension of carrier priority token pending weighbridge calibration review."
            }
        ]

    def _seed_triage_queue(self):
        self.triage_queue = [
            {
                "id": "TRG-DOC-9021",
                "ngo_name": "Sahyadri Bio-Shield Foundation",
                "submitted_date": "2026-11-04 14:20 IST",
                "track": "Track 1: Sovereign DARPAN Registry",
                "darpan_claimed": "KA/2022/0319482",
                "ocr_confidence": 99.4,
                "pan_match": True,
                "fcra_status": "Active (Standard Operations)",
                "ai_risk_score": 12.4, # Low Risk
                "ai_verdict": "LOW RISK - Verified Match",
                "status": "Awaiting Senior Officer Sign-off",
                "primary_document": "Darpan_Registration_Certificate_2022.pdf",
                "key_officer": "Dr. Prathima Hegde (Chairperson)"
            },
            {
                "id": "TRG-DOC-9022",
                "ngo_name": "Dharwad Farmers Mutual Support Network",
                "submitted_date": "2026-11-04 18:05 IST",
                "track": "Track 2: Community Reference Endorsement",
                "darpan_claimed": "N/A (Co-operative Act Reg #DRW-441)",
                "ocr_confidence": 94.1,
                "pan_match": True,
                "fcra_status": "Exempt / Domestic Only",
                "ai_risk_score": 28.5, # Moderate Risk
                "ai_verdict": "MODERATE RISK - 2 Verified Peer Vouchers Received",
                "status": "Under Peer Review Verification",
                "primary_document": "Cooperative_Societies_Bylaws_2019.pdf",
                "key_officer": "Shivanand Patil (Secretary)"
            },
            {
                "id": "TRG-DOC-9023",
                "ngo_name": "Tungabhadra Relief Enclave (Shell Warning)",
                "submitted_date": "2026-11-05 09:12 IST",
                "track": "Track 1: Sovereign DARPAN Registry",
                "darpan_claimed": "KA/2026/0991823",
                "ocr_confidence": 78.2,
                "pan_match": False,
                "fcra_status": "Non-Compliant / Address Discrepancy",
                "ai_risk_score": 89.2, # High Risk
                "ai_verdict": "HIGH RISK - Suspicious Cluster Node",
                "status": "Flagged for Sybil Investigation",
                "primary_document": "Submitted_PAN_Scan_Disputed.pdf",
                "key_officer": "R. K. Verma"
            }
        ]

    def _seed_sybil_intelligence(self):
        self.sybil_nodes = [
            {
                "entity": "Kalyana Aid Trust (Focal Node)",
                "risk_score": 89.4,
                "cluster_size": 4,
                "status": "Quarantine Action Recommended",
                "shared_identifiers": [
                    {"type": "Bank Account IFSC", "value": "SBIN004021 - Shared with 3 shell orgs"},
                    {"type": "Contact Mobile", "value": "+91 99019 44102 - Registered across 4 applications"},
                    {"type": "Common IP Subnet", "value": "103.21.58.0/24 - Automated script signature"}
                ],
                "allied_entities": [
                    "Cauvery Vikas Samiti (Dormant 4 yrs, reactivated 2 days ago)",
                    "Deccan Flood Logistics Pvt Trust (Registered same postal pincode)",
                    "Tungabhadra Relief Enclave (Duplicate PAN OCR hash match)"
                ]
            }
        ]

    def _seed_ledger_stream(self):
        self.ledger_blocks = [
            {
                "block_height": 884216,
                "hash": "0x4a9e218fcb01948d7e21a8309b1f028148b8120e83019284910293847581920a",
                "prev_hash": "0x3b8d107eba90184c6d1098270a0e917037a7019d7290192830192837482910fe",
                "timestamp": "2026-11-05 17:28:44 UTC",
                "event_type": "CONSIGNMENT_WAYBILL_SIGN",
                "entity": "Grama Seva Federation -> SDRF Transport #9014",
                "payload_summary": "Digital Custody Release 250kg Rice + 120 Tarpaulins (#WB-2023-8821A)",
                "validator": "Karnataka Sovereign State Consensus Validator #01",
                "status": "CONFIRMED_FINAL"
            },
            {
                "block_height": 884215,
                "hash": "0x3b8d107eba90184c6d1098270a0e917037a7019d7290192830192837482910fe",
                "prev_hash": "0x1a7c094d9a8e017b5c0981728a9b801726a6018c61801827291827384718012e",
                "timestamp": "2026-11-05 16:45:12 UTC",
                "event_type": "EMERGENCY_REQUISITION_PLEDGE",
                "entity": "Grama Seva Federation -> Requisition #REQ-1049",
                "payload_summary": "Pledged 250 kg Sona Masoori Rice allocation",
                "validator": "SDRF Operations Node #04",
                "status": "CONFIRMED_FINAL"
            },
            {
                "block_height": 884214,
                "hash": "0x1a7c094d9a8e017b5c0981728a9b801726a6018c61801827291827384718012e",
                "prev_hash": "0x096b912c8a7e916a4b9812617a8c791615a5017b51790172618273645617029d",
                "timestamp": "2026-11-05 15:10:02 UTC",
                "event_type": "WEIGHBRIDGE_DISPUTE_OPEN",
                "entity": "Belagavi Inward Receiving Dock -> Docket #DISP-2023-049",
                "payload_summary": "Recorded Tare Weight Variance -620 kg on Consignment #WB-HUB-8812",
                "validator": "Belagavi Municipal Gate Node #02",
                "status": "CONFIRMED_FINAL"
            },
            {
                "block_height": 884213,
                "hash": "0x096b912c8a7e916a4b9812617a8c791615a5017b51790172618273645617029d",
                "prev_hash": "0x9812847581920a4a9e218fcb01948d7e21a8309b1f028148b8120e8301928491",
                "timestamp": "2026-11-05 14:02:18 UTC",
                "event_type": "TIER1_DARPAN_ACCREDITATION",
                "entity": "State Governance Desk -> Sahyadri Bio-Shield Foundation",
                "payload_summary": "Government Darpan Registry Accreditation Sign-off KA/2022/0319482",
                "validator": "Karnataka Sovereign State Consensus Validator #01",
                "status": "CONFIRMED_FINAL"
            }
        ]

    def _seed_comms(self):
        self.messages["DISPATCH-KA-1049"] = [
            {
                "id": "MSG-001",
                "sender": "Suresh Gowda (SDRF Fleet Driver #9014)",
                "sender_role": "Carrier Driver",
                "org": "SDRF Transport Fleet",
                "time": "06:32 IST",
                "text": "Departure confirmed from Peenya Central Warehouse. Manifest loaded: 5 Jute bags (250kg rice) and 12 bundles tarpaulin. Tamper seal #TS-884 applied.",
                "type": "logistics"
            },
            {
                "id": "MSG-002",
                "sender": "Vikram Nadgowda",
                "sender_role": "Executive Trustee",
                "org": "Grama Seva Federation",
                "time": "06:35 IST",
                "text": "Waybill #WB-2023-8821A cryptographically signed on-chain. Proceed via NH-48 corridor to bypass Tumakuru toll bottleneck.",
                "type": "coordination"
            },
            {
                "id": "MSG-003",
                "sender": "Manjunath Hegde",
                "sender_role": "Relief Officer",
                "org": "Belagavi Flood Relief Taskforce",
                "time": "11:20 IST",
                "text": "Receiving Bay 3 prepped at Gokak camp. Forklift and weighing scale calibrated. Flash flood waters receding slowly along Ghataprabha bridge.",
                "type": "status"
            },
            {
                "id": "MSG-004",
                "sender": "Suresh Gowda (SDRF Fleet Driver #9014)",
                "sender_role": "Carrier Driver",
                "org": "SDRF Transport Fleet",
                "time": "12:45 IST",
                "text": "Crossed Chitradurga relay station. Speed maintained at 60 km/h. ETA at Hubballi weighbridge updated to 16:15 IST.",
                "type": "logistics"
            }
        ]

# Global database instance
db = ReliefNetDatabase()

