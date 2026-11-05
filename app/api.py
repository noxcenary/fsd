"""
FastAPI REST API Endpoints for ReliefNet Platform
"""

from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List, Dict, Any
from app.data_loader import db
import time
import hashlib

router = APIRouter(prefix="/api")

# --- TELEMETRY & SYSTEM STATUS ---

@router.get("/telemetry")
def get_telemetry():
    total_surplus_kg = sum(item["available"] for item in db.inventory if item["unit"] == "kg")
    total_fulfilled = sum(req["quantity_fulfilled"] for req in db.requests)
    critical_reqs = sum(1 for req in db.requests if req["urgency"] == "CRITICAL")
    
    return {
        "emergency_mode": db.emergency_mode,
        "crisis_node": "Karnataka Regional Operational Node",
        "theater_lat_lon": "LAT 12.9716° N, LON 77.5946° E",
        "mesh_health": "99.8% Online (1,402 Peer Nodes Active)",
        "protocol": "RFC-8212 Deterministic Matching Engine",
        "total_ngos": len(db.ngos),
        "total_surplus_kg": total_surplus_kg,
        "total_fulfilled_kg": total_fulfilled,
        "critical_requisitions_count": critical_reqs,
        "active_transfers_count": len(db.transfers),
        "open_disputes_count": len([d for d in db.disputes if d["status_code"] == "under_review"]),
        "latest_block_height": db.ledger_blocks[0]["block_height"] if db.ledger_blocks else 884216
    }

@router.post("/telemetry/toggle-emergency")
def toggle_emergency():
    db.emergency_mode = not db.emergency_mode
    return {"emergency_mode": db.emergency_mode, "status": "Emergency mode toggled successfully"}

# --- NGOS & DISCOVERY ---

@router.get("/ngos")
def list_ngos(
    q: Optional[str] = None,
    district: Optional[str] = None,
    tier: Optional[str] = None,
    sector: Optional[str] = None,
    page: int = 1,
    limit: int = 12
):
    results = db.ngos
    if q:
        q_lower = q.lower()
        results = [n for n in results if q_lower in n["name"].lower() or q_lower in n["description"].lower() or q_lower in n["darpan_id"].lower()]
    if district and district != "all":
        results = [n for n in results if district.lower() in n["district"].lower()]
    if tier and tier != "all":
        results = [n for n in results if tier.lower() in n["tier_code"].lower()]
    if sector and sector != "all":
        results = [n for n in results if any(sector.lower() in s.lower() for s in n["sectors"])]

    total = len(results)
    start = (page - 1) * limit
    paginated = results[start:start + limit]

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit if limit else 1,
        "data": paginated
    }

@router.get("/ngos/{ngo_id}")
def get_ngo_profile(ngo_id: str):
    for ngo in db.ngos:
        if ngo["id"] == ngo_id or ngo["darpan_id"] == ngo_id:
            # Attach active inventory & requests
            org_inventory = [item for item in db.inventory if item["owner_id"] == ngo["id"]]
            org_requests = [req for req in db.requests if req["requester_id"] == ngo["id"]]
            return {
                "ngo": ngo,
                "inventory": org_inventory,
                "requests": org_requests
            }
    raise HTTPException(status_code=404, detail="Organization not found")

# --- VERIFICATION & ONBOARDING ---

@router.post("/verification/darpan/verify")
def verify_darpan(payload: Dict[str, Any] = Body(...)):
    darpan_id = payload.get("darpan_id", "").strip().upper()
    org_name = payload.get("org_name", "").strip()

    if not darpan_id:
        raise HTTPException(status_code=400, detail="Darpan ID is required")

    # Match in database or synthesize official Darpan record
    found = None
    for n in db.ngos:
        if n["darpan_id"].upper() == darpan_id:
            found = n
            break

    if not found:
        # Generate simulated verified record for testing any ID
        h = int(hashlib.md5(darpan_id.encode()).hexdigest(), 16)
        found = {
            "name": org_name or f"Karnataka Relief Foundation #{h % 1000}",
            "darpan_id": darpan_id,
            "state": "Karnataka",
            "district": "Bengaluru Urban",
            "pan": f"AAATK{str(h % 9000 + 1000)}B",
            "fcra_status": "Active / Validated",
            "registration_date": f"14-Jul-{2014 + (h % 9)}",
            "status": "VALID_ACTIVE_REGISTRY"
        }

    return {
        "status": "SUCCESS",
        "darpan_id": darpan_id,
        "organization_name": found["name"],
        "state_registry": "Karnataka State Disaster Management Portal (KSDMA Linked)",
        "pan_verified": True,
        "fcra_status": "Compliant",
        "authorized_signatory": "Chief Functionary / Executive Trustee",
        "masked_mobile": "+91 ******8841",
        "message": "DARPAN ID successfully validated against National NGO Darpan database."
    }

@router.post("/verification/darpan/otp")
def verify_darpan_otp(payload: Dict[str, Any] = Body(...)):
    otp = payload.get("otp", "").strip()
    if otp == "123456" or len(otp) == 6:
        return {
            "status": "ACCREDITED",
            "verification_tier": "Tier-1 Sovereign Verified",
            "certificate_hash": "0x89f2a01948c7e091b28174a90184c7e091",
            "message": "Tier-1 Sovereign DARPAN Accreditation granted. Smart Contract certificate minted."
        }
    raise HTTPException(status_code=400, detail="Invalid OTP. Use demo OTP 123456.")

@router.post("/verification/peer-endorsement")
def submit_peer_endorsement(payload: Dict[str, Any] = Body(...)):
    applicant_name = payload.get("applicant_name")
    endorsing_ngo = payload.get("endorsing_ngo")
    statement = payload.get("statement")

    endorsement = {
        "id": f"ENDORSE-{int(time.time())}",
        "applicant_name": applicant_name,
        "endorsing_ngo": endorsing_ngo,
        "statement": statement,
        "timestamp": "Just now",
        "status": "Attested & Logged on Ledger"
    }
    return {
        "status": "SUCCESS",
        "endorsement": endorsement,
        "message": "Peer endorsement recorded. Tier-2 Community Attestation updated."
    }

@router.get("/verification/triage")
def get_triage_queue():
    return {"queue": db.triage_queue}

@router.post("/verification/triage/{docket_id}/action")
def triage_action(docket_id: str, payload: Dict[str, Any] = Body(...)):
    action = payload.get("action") # approve, reject, flag
    note = payload.get("note", "")

    for item in db.triage_queue:
        if item["id"] == docket_id:
            if action == "approve":
                item["status"] = "Approved — Tier-1 Sovereign Certificate Minted"
            elif action == "reject":
                item["status"] = "Rejected — Inconsistent Documentation"
            elif action == "flag":
                item["status"] = "Quarantined for Sybil Cluster Audit"
            item["admin_note"] = note
            return {"status": "SUCCESS", "docket": item}

    raise HTTPException(status_code=404, detail="Docket not found")

# --- INVENTORY & SURPLUS ---

@router.get("/inventory")
def list_inventory(
    category: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None
):
    items = db.inventory
    if category and category != "all":
        items = [i for i in items if category.lower() in i["category"].lower()]
    if district and district != "all":
        items = [i for i in items if district.lower() in i["district"].lower()]
    if status and status != "all":
        items = [i for i in items if status.lower() in i["status"].lower()]
    return {"items": items, "total": len(items)}

@router.post("/inventory/publish")
def publish_inventory(payload: Dict[str, Any] = Body(...)):
    new_id = f"RES-INV-{len(db.inventory) + 101}"
    qty = float(payload.get("quantity", 100))
    
    item = {
        "id": new_id,
        "title": payload.get("title", "Surplus Resource Batch"),
        "category": payload.get("category", "General Supplies"),
        "quantity": qty,
        "unit": payload.get("unit", "units"),
        "allocated": 0,
        "available": qty,
        "location": payload.get("location", "Bengaluru Central Depot"),
        "district": payload.get("district", "Bengaluru Urban"),
        "owner_id": payload.get("owner_id", "NGO-KA-2021-8841"),
        "owner_name": payload.get("owner_name", "Grama Seva Federation"),
        "expiry_days": int(payload.get("expiry_days", 45)),
        "expiry_date": payload.get("expiry_date", "2026-12-20"),
        "status": "Available",
        "batch_no": f"BATCH-{int(time.time())}",
        "specs": payload.get("specs", "Standard humanitarian relief grade"),
        "storage_cert": payload.get("storage_cert", "FSSAI-COMPLIANT-2026"),
        "transfer_radius_km": int(payload.get("transfer_radius_km", 300)),
        "min_claim_qty": int(payload.get("min_claim_qty", 10))
    }
    db.inventory.insert(0, item)
    return {"status": "SUCCESS", "item": item, "message": "Surplus manifest published successfully"}

# --- SERVICES ---

@router.get("/services")
def list_services():
    return {"services": db.services, "total": len(db.services)}

# --- EMERGENCY REQUISITIONS ---

@router.get("/requests")
def list_requests(
    urgency: Optional[str] = None,
    category: Optional[str] = None,
    district: Optional[str] = None
):
    reqs = db.requests
    if urgency and urgency != "all":
        reqs = [r for r in reqs if urgency.lower() in r["urgency"].lower()]
    if category and category != "all":
        reqs = [r for r in reqs if category.lower() in r["category"].lower()]
    if district and district != "all":
        reqs = [r for r in reqs if district.lower() in r["district"].lower()]
    return {"requests": reqs, "total": len(reqs)}

@router.get("/requests/{req_id}")
def get_request(req_id: str):
    for r in db.requests:
        if r["id"] == req_id:
            return {"request": r}
    raise HTTPException(status_code=404, detail="Requisition not found")

@router.post("/requests")
def create_request(payload: Dict[str, Any] = Body(...)):
    new_id = f"REQ-{len(db.requests) + 1050}"
    qty = float(payload.get("quantity_needed", 500))
    urgency = payload.get("urgency", "HIGH").upper()
    urgency_badge = "red" if urgency == "CRITICAL" else ("yellow" if urgency == "HIGH" else "blue")

    req = {
        "id": new_id,
        "title": payload.get("title", "Emergency Relief Requisition"),
        "category": payload.get("category", "Emergency Food & Grains"),
        "requester_id": payload.get("requester_id", "NGO-KA-2021-8841"),
        "requester_name": payload.get("requester_name", "Grama Seva Federation"),
        "location": payload.get("location", "Belagavi Operational Depot"),
        "district": payload.get("district", "Belagavi"),
        "urgency": urgency,
        "urgency_badge": urgency_badge,
        "quantity_needed": qty,
        "unit": payload.get("unit", "kg"),
        "quantity_fulfilled": 0,
        "deficit": qty,
        "progress_pct": 0,
        "beneficiaries": int(payload.get("beneficiaries", 300)),
        "required_by": payload.get("required_by", "2026-11-12"),
        "sla_countdown": "24 hrs 00 min",
        "status": "Matching Active",
        "status_code": "open",
        "pledges": [],
        "purpose": payload.get("purpose", "Urgent disaster relief supplies"),
        "receiving_bay": payload.get("receiving_bay", "Unloading ramp, all-weather covered shed"),
        "ai_matched_count": 3,
        "best_match_score": 92.0
    }
    db.requests.insert(0, req)
    return {"status": "SUCCESS", "request": req, "message": "Emergency requisition published"}

@router.post("/requests/{req_id}/pledge")
def pledge_to_request(req_id: str, payload: Dict[str, Any] = Body(...)):
    donor_name = payload.get("donor_name", "Grama Seva Federation")
    qty = float(payload.get("quantity", 100))

    for r in db.requests:
        if r["id"] == req_id:
            new_fulfilled = min(r["quantity_needed"], r["quantity_fulfilled"] + qty)
            r["quantity_fulfilled"] = new_fulfilled
            r["deficit"] = max(0, r["quantity_needed"] - new_fulfilled)
            r["progress_pct"] = int((new_fulfilled / r["quantity_needed"]) * 100) if r["quantity_needed"] else 100
            
            pledge_entry = {
                "donor": donor_name,
                "qty": qty,
                "unit": r["unit"],
                "status": "Stock Reserved (Waybill Pending)"
            }
            r["pledges"].append(pledge_entry)

            # Record in Ledger
            db.ledger_blocks.insert(0, {
                "block_height": db.ledger_blocks[0]["block_height"] + 1 if db.ledger_blocks else 884217,
                "hash": f"0x{(hashlib.sha256(f'{req_id}-{qty}-{time.time()}'.encode()).hexdigest())}",
                "prev_hash": db.ledger_blocks[0]["hash"] if db.ledger_blocks else "0x00",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
                "event_type": "EMERGENCY_REQUISITION_PLEDGE",
                "entity": f"{donor_name} -> {req_id}",
                "payload_summary": f"Pledged {qty} {r['unit']} for {r['title']}",
                "validator": "Karnataka Sovereign State Consensus Validator #01",
                "status": "CONFIRMED_FINAL"
            })

            return {"status": "SUCCESS", "request": r, "message": f"Successfully pledged {qty} {r['unit']} to {req_id}"}

    raise HTTPException(status_code=404, detail="Requisition not found")

# --- AI MATCHING & EXPLAINABILITY ---

@router.get("/matching/candidates/{req_id}")
def get_matching_candidates(req_id: str):
    target_req = None
    for r in db.requests:
        if r["id"] == req_id:
            target_req = r
            break
            
    if not target_req:
        target_req = db.requests[0] # Default to REQ-1049

    candidates = [
        {
            "id": "MATCH-001",
            "ngo_id": "NGO-KA-2021-8841",
            "ngo_name": "Grama Seva Federation",
            "score": 94.2,
            "rating": "Grade A Recommendation",
            "quantity_available": 8300,
            "unit": target_req["unit"],
            "distance_km": 412,
            "est_hours": 7.2,
            "corridor": "NH-48 Express Freightway",
            "verification_tier": "Tier-1 Sovereign Verified",
            "trust_score": 98.4,
            "completed_transfers": 142,
            "dispute_rate": "0.0%",
            "factors": {
                "quantity_coverage": {"weight": 30, "score": 98, "detail": "Full deficit coverage (100% capacity)"},
                "logistics_distance": {"weight": 25, "score": 89, "detail": "Direct highway route, high-clearance fleet available"},
                "verification_level": {"weight": 25, "score": 100, "detail": "Tier-1 Sovereign State Accreditated"},
                "settlement_reliability": {"weight": 20, "score": 92, "detail": "Zero open weighbridge disputes"}
            }
        },
        {
            "id": "MATCH-002",
            "ngo_id": "NGO-KA-0004",
            "ngo_name": "Agastya International Foundation",
            "score": 88.6,
            "rating": "Grade B Recommendation",
            "quantity_available": 1200,
            "unit": target_req["unit"],
            "distance_km": 94,
            "est_hours": 2.1,
            "corridor": "Hubballi-Belagavi State Highway",
            "verification_tier": "Tier-1 Sovereign Verified",
            "trust_score": 94.0,
            "completed_transfers": 48,
            "dispute_rate": "0.5%",
            "factors": {
                "quantity_coverage": {"weight": 30, "score": 85, "detail": "Partial lot reservation available"},
                "logistics_distance": {"weight": 25, "score": 96, "detail": "Close proximity (under 100km)"},
                "verification_level": {"weight": 25, "score": 95, "detail": "Verified State Partner"},
                "settlement_reliability": {"weight": 20, "score": 88, "detail": "48 completed transfers"}
            }
        },
        {
            "id": "MATCH-003",
            "ngo_id": "NGO-KA-0010",
            "ngo_name": "Animal Aid Unlimited / Logistics Hub",
            "score": 79.1,
            "rating": "Grade B Recommendation",
            "quantity_available": 600,
            "unit": target_req["unit"],
            "distance_km": 360,
            "est_hours": 8.0,
            "corridor": "Coastal Ghats Bypass",
            "verification_tier": "Tier-2 Community Attested",
            "trust_score": 84.5,
            "completed_transfers": 22,
            "dispute_rate": "1.2%",
            "factors": {
                "quantity_coverage": {"weight": 30, "score": 75, "detail": "Can supply 100% of remaining deficit"},
                "logistics_distance": {"weight": 25, "score": 72, "detail": "Ghat road transit delay risk"},
                "verification_level": {"weight": 25, "score": 85, "detail": "Community peer vouching certified"},
                "settlement_reliability": {"weight": 20, "score": 86, "detail": "22 verified receipts"}
            }
        }
    ]

    return {
        "request": target_req,
        "algorithm": "Deterministic Multi-Factor Weighted Euclidean Distance (RFC-8212)",
        "weights": {
            "quantity_readiness": 0.30,
            "distance_logistics": 0.25,
            "verification_tier": 0.25,
            "reliability_settlement": 0.20
        },
        "candidates": candidates
    }

# --- TRANSFERS & DIGITAL WAYBILLS ---

@router.get("/transfers")
def list_transfers():
    return {"transfers": db.transfers}

@router.get("/transfers/{transfer_id}")
def get_transfer(transfer_id: str):
    for t in db.transfers:
        if t["id"] == transfer_id or t["waybill_id"] == transfer_id:
            return {"transfer": t}
    raise HTTPException(status_code=404, detail="Transfer not found")

@router.post("/transfers/{transfer_id}/status")
def update_transfer_status(transfer_id: str, payload: Dict[str, Any] = Body(...)):
    new_stage = int(payload.get("stage", 4))
    checkpoint_idx = payload.get("checkpoint_idx")

    for t in db.transfers:
        if t["id"] == transfer_id or t["waybill_id"] == transfer_id:
            t["stage"] = new_stage
            if new_stage == 4:
                t["status"] = "At Weighbridge - Inspection Ongoing"
            elif new_stage == 5:
                t["status"] = "Delivered - Inward Receipt Verified"
            if checkpoint_idx is not None and 0 <= checkpoint_idx < len(t["checkpoints"]):
                t["checkpoints"][checkpoint_idx]["done"] = True
                t["checkpoints"][checkpoint_idx]["status"] = "Verified " + time.strftime("%H:%M IST")

            return {"status": "SUCCESS", "transfer": t}

    raise HTTPException(status_code=404, detail="Transfer not found")

# --- DISPUTES & ARBITRATION ---

@router.get("/disputes/{dispute_id}")
def get_dispute(dispute_id: str):
    for d in db.disputes:
        if d["id"] == dispute_id or d["waybill_id"] == dispute_id:
            return {"dispute": d}
    return {"dispute": db.disputes[0]}

@router.post("/disputes/{dispute_id}/ruling")
def issue_dispute_ruling(dispute_id: str, payload: Dict[str, Any] = Body(...)):
    ruling = payload.get("ruling", "Variance Accepted - Adjustment Debit Note Issued")
    penalty = payload.get("penalty", "Carrier SLA docked by 1.2%")

    for d in db.disputes:
        if d["id"] == dispute_id:
            d["status"] = "Resolved — Statutory Ruling Final"
            d["status_code"] = "resolved"
            d["statutory_ruling"] = ruling
            d["penalty_applied"] = penalty
            return {"status": "SUCCESS", "dispute": d}

    raise HTTPException(status_code=404, detail="Dispute docket not found")

# --- COMMS & LIVE CHAT ---

@router.get("/comms/channels")
def list_comms_channels():
    return {
        "channels": [
            {"id": "DISPATCH-KA-1049", "name": "Bellandur & Gokak Flood Corridor (#REQ-1049)", "active": True, "members": 8},
            {"id": "THEATER-KARNATAKA", "name": "Karnataka Disaster Management Emergency Net", "active": True, "members": 142},
            {"id": "LOGISTICS-HUBBALLI", "name": "Hubballi Weighbridge Dispatch & Escort", "active": True, "members": 24}
        ]
    }

@router.get("/comms/messages/{channel_id}")
def get_channel_messages(channel_id: str):
    msgs = db.messages.get(channel_id, [])
    return {"channel": channel_id, "messages": msgs}

@router.post("/comms/messages/{channel_id}")
def send_channel_message(channel_id: str, payload: Dict[str, Any] = Body(...)):
    text = payload.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message text is required")

    sender = payload.get("sender", "Vikram Nadgowda")
    role = payload.get("sender_role", "Executive Trustee")
    org = payload.get("org", "Grama Seva Federation")
    msg_type = payload.get("type", "coordination")

    msg = {
        "id": f"MSG-{int(time.time() * 1000) % 100000}",
        "sender": sender,
        "sender_role": role,
        "org": org,
        "time": time.strftime("%H:%M IST"),
        "text": text,
        "type": msg_type
    }
    if channel_id not in db.messages:
        db.messages[channel_id] = []
    db.messages[channel_id].append(msg)

    return {"status": "SUCCESS", "message": msg}

# --- ADMIN: SYBIL GRAPH & LEDGER ---

@router.get("/admin/sybil")
def get_sybil_graph():
    return {
        "clusters": db.sybil_nodes,
        "graph_nodes": [
            {"id": "N1", "label": "Kalyana Aid Trust", "risk": 89.4, "group": "quarantine"},
            {"id": "N2", "label": "Cauvery Vikas Samiti", "risk": 82.1, "group": "quarantine"},
            {"id": "N3", "label": "Deccan Flood Logistics", "risk": 78.4, "group": "quarantine"},
            {"id": "N4", "label": "Tungabhadra Relief Enclave", "risk": 91.0, "group": "quarantine"},
            {"id": "N5", "label": "Grama Seva Federation", "risk": 2.1, "group": "verified"},
            {"id": "N6", "label": "Agastya Foundation", "risk": 4.5, "group": "verified"}
        ],
        "graph_edges": [
            {"from": "N1", "to": "N2", "label": "Shared IFSC"},
            {"from": "N1", "to": "N3", "label": "Shared Mobile"},
            {"from": "N1", "to": "N4", "label": "Shared IP Subnet"},
            {"from": "N2", "to": "N4", "label": "Duplicate PAN OCR"}
        ]
    }

@router.post("/admin/sybil/quarantine")
def toggle_sybil_quarantine(payload: Dict[str, Any] = Body(...)):
    entity = payload.get("entity", "Kalyana Aid Trust (Focal Node)")
    for n in db.sybil_nodes:
        if entity in n["entity"]:
            n["status"] = "ENCLAVE QUARANTINED — All Gate Access Suspended"
            return {"status": "SUCCESS", "node": n}
    return {"status": "SUCCESS", "message": "Quarantine action enforced across 4 cluster nodes"}

@router.get("/admin/ledger")
def get_ledger_stream():
    return {
        "merkle_root": "0x7f4e92a819b0284c17290184b81920e812903847581920a",
        "state_consensus": "BFT-Sovereign (3/3 Consensus)",
        "blocks": db.ledger_blocks
    }

