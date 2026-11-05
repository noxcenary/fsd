/**
 * Embedded Pre-baked Mock Database
 * Guarantees 100% functionality even in offline or direct file preview mode
 */

window.RELIEFNET_MOCK = {
  telemetry: {
    emergency_mode: true,
    crisis_node: "Karnataka Regional Operational Node",
    theater_lat_lon: "LAT 12.9716° N, LON 77.5946° E",
    mesh_health: "99.8% Online (1,402 Peer Nodes Active)",
    protocol: "RFC-8212 Deterministic Matching Engine",
    total_ngos: 196,
    total_surplus_kg: 8300,
    total_fulfilled_kg: 480,
    critical_requisitions_count: 2,
    active_transfers_count: 1,
    open_disputes_count: 1,
    latest_block_height: 884216
  },
  ngos: [
    {
      id: "NGO-KA-2021-8841",
      name: "Grama Seva Federation",
      description: "State Disaster Management Partner specializing in logistics networks, emergency nutrition dispatch, and multi-district supply chain staging.",
      state: "Karnataka",
      district: "Bengaluru Urban",
      darpan_id: "KA/2021/8841",
      verification_tier: "Tier-1 Sovereign Verified",
      tier_code: "tier_1",
      trust_score: 98.4,
      sla_adherence: "99.2%",
      completed_transfers: 142,
      dispute_rate: "0.0%",
      sectors: ["Disaster Relief", "Logistics & Fleets", "Community Kitchens"],
      established_year: 2012
    },
    {
      id: "NGO-KA-0004",
      name: "Agastya International Foundation",
      description: "Hands-on mobile education and disaster response units operating across Karnataka rural clusters.",
      state: "Karnataka",
      district: "Hubballi-Dharwad",
      darpan_id: "KA/2016/0019482",
      verification_tier: "Tier-1 Sovereign Verified",
      tier_code: "tier_1",
      trust_score: 94.0,
      sla_adherence: "96.5%",
      completed_transfers: 48,
      dispute_rate: "0.5%",
      sectors: ["Shelter & Settlement", "Education", "Disaster Comms"],
      established_year: 1999
    },
    {
      id: "NGO-KA-0010",
      name: "Animal Aid Unlimited / Logistics Division",
      description: "Emergency animal rescue and human relief support fleet in disaster zones.",
      state: "Karnataka",
      district: "Mangaluru",
      darpan_id: "REF-COMM-4819",
      verification_tier: "Tier-2 Community Attested",
      tier_code: "tier_2",
      trust_score: 84.5,
      sla_adherence: "91.0%",
      completed_transfers: 22,
      dispute_rate: "1.2%",
      sectors: ["Medical Supplies", "First Aid", "Mobile Healthcare"],
      established_year: 2002
    },
    {
      id: "NGO-KA-0042",
      name: "Kaveri Basin Relief Coalition",
      description: "River basin flood mitigation and emergency de-watering operations collective.",
      state: "Karnataka",
      district: "Mysuru",
      darpan_id: "KA/2018/0091823",
      verification_tier: "Tier-1 Sovereign Verified",
      tier_code: "tier_1",
      trust_score: 92.1,
      sla_adherence: "94.8%",
      completed_transfers: 64,
      dispute_rate: "0.8%",
      sectors: ["Disaster Relief", "Flood Operations", "Infrastructure"],
      established_year: 2018
    }
  ],
  inventory: [
    {
      id: "RES-INV-101",
      title: "Sona Masoori Rice (Grade A)",
      category: "Emergency Food & Grains",
      quantity: 12500,
      unit: "kg",
      available: 8300,
      allocated: 4200,
      location: "Bengaluru Central Depot (Bay 4)",
      district: "Bengaluru Urban",
      owner_name: "Grama Seva Federation",
      expiry_days: 18,
      status: "Priority Allocation"
    },
    {
      id: "RES-INV-102",
      title: "Heavy-Duty Waterproof Tarpaulins (24x20ft)",
      category: "Shelter & Settlement",
      quantity: 850,
      unit: "units",
      available: 600,
      allocated: 250,
      location: "Hubballi Forward Logistics Hub",
      district: "Hubballi-Dharwad",
      owner_name: "Agastya International Foundation",
      expiry_days: 180,
      status: "Available"
    }
  ],
  requests: [
    {
      id: "REQ-1049",
      title: "500 kg Non-Perishable Rice (Sona Masoori)",
      category: "Emergency Food & Grains",
      requester_name: "Belagavi Flood Relief Taskforce",
      district: "Belagavi",
      urgency: "CRITICAL",
      quantity_needed: 500,
      quantity_fulfilled: 350,
      deficit: 150,
      unit: "kg",
      beneficiaries: 850,
      sla_countdown: "14 hrs 32 min"
    }
  ],
  matching: {
    request_id: "REQ-1049",
    candidates: [
      {
        ngo_name: "Grama Seva Federation",
        score: 94.2,
        rating: "Grade A Recommendation",
        distance_km: 412,
        est_hours: 7.2,
        verification_tier: "Tier-1 Sovereign Verified"
      },
      {
        ngo_name: "Agastya International Foundation",
        score: 88.6,
        rating: "Grade B Recommendation",
        distance_km: 94,
        est_hours: 2.1,
        verification_tier: "Tier-1 Sovereign Verified"
      }
    ]
  }
};

