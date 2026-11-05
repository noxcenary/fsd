/**
 * Centralised Mock Data for NGO ResourceLink
 * Backed by cleaned Indian NGO & Disaster datasets.
 * Aligned with official project documentation and Google Stitch design system.
 */

// Primary active NGO profile (backed by cleaned dataset: NGO003)
export const currentUser = {
  name: "P. Ganesan",
  role: "Field Coordination Lead",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
  organization: "Oliyagam Trust",
  accreditation: "Govt Verified NGO • Darpan ID: TN/2009/0015152",
  regNumber: "TN/2009/0015152",
  verificationLevel: "Government-Verified",
  state: "Tamil Nadu",
  district: "Madurai",
  ngoType: "Trust (Non-Government)",
  establishedYear: 1995,
  trustScore: 94,
  disasterCapable: true,
  contactEmail: "oliganesh@yahoo.com",
  contactPhone: "+91 94432 18920",
  serviceAreas: ["Madurai", "Dindigul", "Theni", "Virudhunagar"],
  resourceCategories: [
    "Food & Nutrition",
    "Medicines & First Aid",
    "Medical Equipment",
    "Clothing & Blankets",
    "Shelter Materials",
    "Water & Sanitation",
    "Education Supplies"
  ]
};

// Emergency Priority Alert (derived from historical disaster dataset: Wayanad Landslides)
export const emergencyAlert = {
  id: "emergencyAlertCard",
  ref: "DIS-2024-WYND",
  priority: "Emergency Priority",
  title: "Disaster Coordination: Wayanad Relief Zone (Kerala)",
  description: "Urgent shortage of drinking water bottles, trauma medical supplies, gumboots, and temporary family shelter kits in Meppadi & Vythiri taluks following severe debris flow.",
  disasterId: "DIS001",
  state: "Kerala",
  district: "Wayanad"
};

// Clean, honest dashboard statistics (no invented impact numbers)
export const dashboardStats = [
  {
    id: "available-resources",
    title: "Surplus Resources Listed",
    value: "28",
    unit: "listings",
    icon: "inventory_2",
    iconColor: "text-brand-sage",
    footerText: "Across 6 essential categories",
    trend: "Active Surplus",
    trendIcon: "check_circle",
    badgeType: "sage"
  },
  {
    id: "active-requests",
    title: "Active Resource Requests",
    value: "12",
    unit: "requests",
    icon: "swap_horiz",
    iconColor: "text-brand-amber",
    footerText: "3 Emergency Priority",
    trend: "3 Emergency",
    pulse: true,
    badgeType: "amber"
  },
  {
    id: "pending-transfers",
    title: "Resource Transfers",
    value: "5",
    unit: "in progress",
    icon: "local_shipping",
    iconColor: "text-brand-walnut",
    footerText: "3 Completed & Verified",
    trend: "Coordinating",
    trendIcon: "schedule",
    badgeType: "ivory"
  },
  {
    id: "network-ngos",
    title: "Verified Partner NGOs",
    value: "No data yet",
    unit: "organizations",
    icon: "verified_user",
    iconColor: "text-brand-sage",
    footerText: "Calculated from live platform records",
    trend: "Live data",
    trendIcon: "database",
    badgeType: "sage"
  }
];

// Essential Category Inventory Overview (matching project requirements)
export const inventoryAllocations = [
  {
    id: "inv-food",
    name: "Food & Nutrition",
    icon: "nutrition",
    quantity: "3,200",
    unit: "kg",
    allocatedPercentage: 55,
    reservedNote: "1,440 kg surplus ready for inter-agency transfer",
    location: "Madurai Coordination Depot"
  },
  {
    id: "inv-med",
    name: "Medicines & First Aid",
    icon: "medical_services",
    quantity: "650",
    unit: "kits",
    allocatedPercentage: 70,
    reservedNote: "195 trauma packs allocated for disaster relief",
    location: "Regional Medical Store"
  },
  {
    id: "inv-water",
    name: "Water & Sanitation",
    icon: "water_drop",
    quantity: "1,200",
    unit: "units",
    allocatedPercentage: 85,
    reservedNote: "Purification units dispatched for flood buffer",
    location: "Theni Storage Point"
  },
  {
    id: "inv-shelter",
    name: "Shelter Materials",
    icon: "home",
    quantity: "480",
    unit: "sets",
    allocatedPercentage: 40,
    reservedNote: "288 heavy tarpaulin sheets available",
    location: "Dindigul Warehouse"
  },
  {
    id: "inv-clothing",
    name: "Clothing & Blankets",
    icon: "checkroom",
    quantity: "850",
    unit: "packs",
    allocatedPercentage: 30,
    reservedNote: "595 winter thermal blanket packs surplus",
    location: "Madurai Central Point"
  }
];

// AI-Assisted Smart Matches (transparent recommendation ranking)
export const aiMatches = [
  {
    id: "match-1",
    orgName: "Integrated Social Service Organization",
    darpanId: "TN/2011/0042860",
    hub: "Krishnagiri, Tamil Nadu",
    type: "Surplus Available",
    highlight: "500 kg Rice & Grain Rations",
    matchRate: "94% Match",
    description: "High category compatibility with your active request #REQ-104. Distance: ~260 km. High trust score (92%).",
    primaryAction: "Request Transfer",
    secondaryAction: "Contact NGO"
  },
  {
    id: "match-2",
    orgName: "Amuthasurabi Women Development Society",
    darpanId: "TN/2009/0007763",
    hub: "Aundipatty / Theni, Tamil Nadu",
    type: "Urgent Need",
    highlight: "Water Purification & Sanitation Units",
    matchRate: "91% Match",
    description: "Proximity match (54 km). Immediate need for 120 community chlorination units in flood-affected pockets.",
    primaryAction: "Offer Surplus",
    secondaryAction: "View Request"
  },
  {
    id: "match-3",
    orgName: "Vinayagar Perarasar Trust",
    darpanId: "TN/2010/0035348",
    hub: "Kattumannarkoil, Tamil Nadu",
    type: "Surplus Available",
    highlight: "200 Trauma First-Aid & Dressing Kits",
    matchRate: "87% Match",
    description: "Complementary pharmaceutical inventory ready for coordinated dispatch to disaster relief zones.",
    primaryAction: "Request Transfer",
    secondaryAction: null
  }
];

// Realistic Active Resource Requests (representing NGOs with shortages)
export const resourceRequests = [
  {
    id: "#REQ-101",
    title: "Drinking Water Bottles & Filter Units",
    subtitle: "Packaged safe drinking water & 20L community cans",
    quantity: "1,500 units",
    urgency: "Emergency",
    partner: "Sphere India / Wayanad Relief Group",
    location: "Meppadi, Wayanad (Kerala)",
    status: "AI Match Found",
    statusIcon: "auto_awesome",
    action: "Review Match",
    isPrimaryAction: true
  },
  {
    id: "#REQ-102",
    title: "Trauma First Aid Kits & Medical Supplies",
    subtitle: "Antiseptics, bandages, suture kits & ORS sachets",
    quantity: "350 kits",
    urgency: "Emergency",
    partner: "Integrated Social Service Organization",
    location: "Krishnagiri (Tamil Nadu)",
    status: "In Transit",
    statusIcon: "local_shipping",
    action: "Track Transfer",
    isPrimaryAction: false
  },
  {
    id: "#REQ-103",
    title: "Heavy Waterproof Tarpaulins (18x12 ft)",
    subtitle: "High-density polyethylene shelter sheets for displaced families",
    quantity: "400 sheets",
    urgency: "High",
    partner: "ActionAid India Partner Hub",
    location: "South 24 Parganas (West Bengal)",
    status: "Pending Review",
    statusIcon: "hourglass_empty",
    action: "Review",
    isPrimaryAction: false
  },
  {
    id: "#REQ-104",
    title: "Nutritional Dry Rations & Rice Bags (25kg)",
    subtitle: "For community relief kitchens in cyclone-affected coastal blocks",
    quantity: "2,000 kg",
    urgency: "High",
    partner: "Amuthasurabi Women Development Society",
    location: "Theni District (Tamil Nadu)",
    status: "AI Match Found",
    statusIcon: "auto_awesome",
    action: "Review Match",
    isPrimaryAction: true
  },
  {
    id: "#REQ-105",
    title: "Thermal Blankets & Children Woolens",
    subtitle: "Winter protection kits for exposed temporary camps",
    quantity: "600 sets",
    urgency: "Normal",
    partner: "Gram Vikas Relief Unit",
    location: "Shimla District (Himachal Pradesh)",
    status: "Open",
    statusIcon: "schedule",
    action: "View Details",
    isPrimaryAction: false
  }
];

// Realistic Resource Transfers (demonstrating NGO-to-NGO coordination)
export const recentTransfers = [
  {
    id: "#TR-1082",
    summary: "500 kg Rice & Pulses → Wayanad Landslide Relief Camp",
    status: "In Transit · Sample Record",
    statusType: "amber",
    startLocation: "Dispatched from Madurai Depot",
    currentLocation: "No live vehicle location available",
    endLocation: "Meppadi Distribution Hub, Wayanad",
    icon: "local_shipping",
    recipientOrg: "Wayanad Inter-Agency Group",
    dispatchedDate: "Today, 06:30 AM"
  },
  {
    id: "#TR-1074",
    summary: "200 Trauma Medical Kits → Cuddalore Flood Centre",
    status: "Delivered & Confirmed",
    statusType: "sage",
    signature: "Receipt Confirmed by Dr. K. Meenakshi • Acknowledgement Code #ACK-4418",
    podCode: "Transfer Record #TR-1074-ACK",
    icon: "task_alt",
    recipientOrg: "Integrated Social Service Org",
    dispatchedDate: "Yesterday"
  },
  {
    id: "#TR-1061",
    summary: "150 Tarpaulin Shelter Sheets → Nagapattinam Relief Depot",
    status: "Delivered & Confirmed",
    statusType: "sage",
    signature: "Receipt Confirmed by S. Murugan • Store In-Charge",
    podCode: "Transfer Record #TR-1061-ACK",
    icon: "task_alt",
    recipientOrg: "Coastal Community Aid",
    dispatchedDate: "3 days ago"
  }
];
