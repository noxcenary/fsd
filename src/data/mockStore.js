/**
 * Reactive In-Memory Data Store for NGO ResourceLink
 * Implements a lightweight observer pattern for responsive UI state changes.
 * Sourced directly from cleaned Indian NGO & Disaster datasets.
 * Provides session-local interactive state for the frontend prototype.
 */

import {
  currentUser as initialCurrentUser,
  emergencyAlert as initialEmergencyAlert,
  dashboardStats as initialDashboardStats,
  inventoryAllocations as initialInventoryAllocations,
  aiMatches as initialAiMatches,
  resourceRequests as initialResourceRequests,
  recentTransfers as initialRecentTransfers
} from './mockData';

import { datasetNgos } from './datasetNgos';
import { datasetDisasters } from './datasetDisasters';

// Platform Administrator user profile
export const adminUser = {
  name: "R. Ramanathan",
  role: "Platform Verification Officer",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
  organization: "NGO ResourceLink Central Administration",
  accreditation: "Platform Administrator • Review Clearance",
  accessLevel: "Platform Administrator"
};

// Realistic surplus listings (aligned with the 6 core resource categories)
const initialResources = [
  // Current user's listed resources (Oliyagam Trust)
  {
    id: "RES-101",
    name: "Drinking Water Chlorination & Filter Units",
    category: "Water & Sanitation",
    quantity: 120,
    unit: "units",
    depot: "Madurai Coordination Depot",
    condition: "Factory Sealed",
    status: "Available",
    owner: "Oliyagam Trust",
    isOwn: true,
    expiryDate: "N/A (Equipment)",
    weightKg: 480,
    transportRequired: "Light Commercial Vehicle (Pickup)",
    notes: "Gravity-based multi-stage community filtration units ready for flood-affected villages."
  },
  {
    id: "RES-102",
    name: "Essential Emergency Antibiotics & First-Aid Packs",
    category: "Medicines & First Aid",
    quantity: 350,
    unit: "kits",
    depot: "Madurai Health Storage Cell",
    condition: "Medical Grade",
    status: "Reserved",
    owner: "Oliyagam Trust",
    isOwn: true,
    expiryDate: "2027-08-31",
    weightKg: 420,
    transportRequired: "Temperature Managed Van",
    notes: "Allocated as emergency buffer for disaster relief operations."
  },
  {
    id: "RES-103",
    name: "High-Protein Nutritional Pulses & Grains (Toor Dal & Rice)",
    category: "Food & Nutrition",
    quantity: 1800,
    unit: "kg",
    depot: "Theni Storage Outpost",
    condition: "Dry Vacuum Sealed",
    status: "Available",
    owner: "Oliyagam Trust",
    isOwn: true,
    expiryDate: "2026-12-15",
    weightKg: 1800,
    transportRequired: "Standard Covered Truck",
    notes: "Packaged in 25kg bags ready for inter-agency disaster food distribution."
  },
  {
    id: "RES-104",
    name: "Heavy-Duty Tarpaulin Ground & Roof Sheets (18x12 ft)",
    category: "Shelter Materials",
    quantity: 280,
    unit: "sheets",
    depot: "Dindigul Field Centre",
    condition: "New Packaged",
    status: "Available",
    owner: "Oliyagam Trust",
    isOwn: true,
    expiryDate: "N/A",
    weightKg: 840,
    transportRequired: "Small Truck / Tempo",
    notes: "High-density waterproof polyethylene sheets with eyelets for temporary shelter."
  },
  {
    id: "RES-105",
    name: "Thermal Woolen Blankets & Shawls",
    category: "Clothing & Blankets",
    quantity: 450,
    unit: "sets",
    depot: "Madurai Central Point",
    condition: "Clean Packaged",
    status: "Available",
    owner: "Oliyagam Trust",
    isOwn: true,
    expiryDate: "N/A",
    weightKg: 675,
    transportRequired: "Delivery Van",
    notes: "Warm thermal sets suitable for cold nights and exposed relief camps."
  },
  // Peer NGO surplus listings (sourced from dataset NGOs)
  {
    id: "RES-201",
    name: "Dry Rice Rations & Pulses (25kg Sacks)",
    category: "Food & Nutrition",
    quantity: 2500,
    unit: "kg",
    depot: "Krishnagiri Main Depot",
    condition: "Sealed Sacks",
    status: "Surplus Available",
    owner: "Integrated Social Service Organization",
    darpanId: "TN/2011/0042860",
    state: "Tamil Nadu",
    district: "Krishnagiri",
    isOwn: false,
    expiryDate: "2027-03-31",
    weightKg: 2500,
    transportRequired: "Medium Truck (3T)",
    notes: "Surplus from agricultural cooperative distribution ready for immediate transfer."
  },
  {
    id: "RES-202",
    name: "Trauma Dressing & Antiseptic Wound Care Kits",
    category: "Medicines & First Aid",
    quantity: 400,
    unit: "kits",
    depot: "Kattumannarkoil Medical Centre",
    condition: "Hospital Sterile",
    status: "Surplus Available",
    owner: "Vinayagar Perarasar Trust",
    darpanId: "TN/2010/0035348",
    state: "Tamil Nadu",
    district: "Cuddalore",
    isOwn: false,
    expiryDate: "2027-11-30",
    weightKg: 320,
    transportRequired: "Standard Delivery Van",
    notes: "Prepared for emergency flood health camp deployment."
  },
  {
    id: "RES-203",
    name: "Portable Oxygen Concentrators (5L/min)",
    category: "Medical Equipment",
    quantity: 12,
    unit: "units",
    depot: "Theni Health Cluster Hub",
    condition: "Certified Calibrated",
    status: "Surplus Available",
    owner: "Amuthasurabi Women Development Society",
    darpanId: "TN/2009/0007763",
    state: "Tamil Nadu",
    district: "Theni",
    isOwn: false,
    expiryDate: "N/A (Equipment)",
    weightKg: 180,
    transportRequired: "Light Vehicle",
    notes: "Clean backup units available for primary healthcare centres in relief corridors."
  },
  {
    id: "RES-204",
    name: "Raincoats & Industrial Gumboots (Relief Worker Sets)",
    category: "Clothing & Blankets",
    quantity: 300,
    unit: "pairs",
    depot: "Kozhikode Relief Store",
    condition: "New Packaged",
    status: "Surplus Available",
    owner: "South Indian Federation of Fishermen Societies",
    state: "Kerala",
    district: "Kozhikode",
    isOwn: false,
    expiryDate: "N/A",
    weightKg: 450,
    transportRequired: "Delivery Van",
    notes: "Heavy protective footwear and waterproof coats for search and relief volunteers."
  }
];

// Peer NGO-to-NGO communication threads
const initialMessages = [
  {
    id: "CONV-1",
    partnerOrg: "Integrated Social Service Organization",
    darpanId: "TN/2011/0042860",
    location: "Krishnagiri, Tamil Nadu",
    partnerLead: "Resource Coordinator",
    linkedRequestId: "#REQ-104",
    topic: "Rice and pulses for Wayanad",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
    role: "Resource Coordinator",
    lastUpdated: "12 mins ago",
    unread: true,
    messages: [
      {
        id: "m-1",
        sender: "Integrated Social Service Organization",
        text: "Thank you for the active request. We reviewed the Wayanad relief coordination needs and have 500 kg of rice and pulses ready to dispatch from Krishnagiri.",
        time: "10:15 AM",
        isOwn: false
      },
      {
        id: "m-2",
        sender: "Oliyagam Trust",
        text: "Thank you for reaching out. We can coordinate a suitable transport route to the Meppadi camp and share the confirmed itinerary once arranged.",
        time: "10:22 AM",
        isOwn: true
      },
      {
        id: "m-3",
        sender: "Integrated Social Service Organization",
        text: "Excellent. Transfer manifest #TR-1082 has been generated on the platform. Our team has completed vehicle loading.",
        time: "10:28 AM",
        isOwn: false
      }
    ]
  },
  {
    id: "CONV-2",
    partnerOrg: "Amuthasurabi Women Development Society",
    darpanId: "TN/2009/0007763",
    location: "Theni District, Tamil Nadu",
    partnerLead: "Secretary",
    linkedRequestId: "#REQ-108",
    topic: "Water purification units",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    role: "Secretary",
    lastUpdated: "2 hours ago",
    unread: false,
    messages: [
      {
        id: "m-201",
        sender: "Amuthasurabi Women Development Society",
        text: "Hello team Oliyagam Trust. We noticed you listed 120 community water chlorination units. 3 panchayats in our coastal block have reported brackish water contamination.",
        time: "08:45 AM",
        isOwn: false
      },
      {
        id: "m-202",
        sender: "Oliyagam Trust",
        text: "We can allocate 60 units immediately from our Theni outpost. Let us coordinate dispatch confirmation.",
        time: "09:05 AM",
        isOwn: true
      }
    ]
  },
  ...datasetNgos
    .filter((ngo) => ![
      "Integrated Social Service Organization",
      "Amuthasurabi Women Development Society"
    ].includes(ngo.name))
    .map((ngo) => ({
      id: `CONV-${ngo.id}`,
      partnerOrg: ngo.name,
      darpanId: ngo.darpanId,
      location: [ngo.district, ngo.state].filter(Boolean).join(", "),
      partnerLead: "Partner coordination team",
      linkedRequestId: "General coordination",
      topic: "Resource coordination",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
      role: "Resource Coordinator",
      lastUpdated: "Organization listed",
      unread: false,
      messages: []
    }))
];

// Document verification queue for Platform Administrator (populated from datasetNgos)
const initialVerificationQueue = [
  {
    id: "VRF-010",
    ngoId: "NGO010",
    orgName: "B.T.R Memorial Trust",
    darpanId: "TN/2012/0055104",
    state: "Tamil Nadu",
    district: "Thoothukkudi",
    regNumber: "135/2007",
    actName: "TAMILNADU GOVERMENT",
    ngoType: "Trust (Non-Government)",
    submittedAt: "3 hours ago",
    status: "Pending Review",
    documents: [
      { name: "Registration_Trust_Deed.pdf", size: "3.2 MB", verified: true },
      { name: "PAN_Card_Copy.pdf", size: "840 KB", verified: true },
      { name: "Annual_Activity_Report_2024.pdf", size: "4.5 MB", verified: false }
    ],
    aiRiskAnalysis: {
      overallRisk: "High Risk Indicator (72%)",
      riskScore: 72,
      riskLevel: "danger", // safe | warning | danger
      flags: [
        {
          type: "danger",
          text: "Flagged: Act Name entered as 'TAMILNADU GOVERMENT'. Does not match recognized statutory acts (e.g. Indian Trusts Act 1882 or TN Societies Registration Act 1975)."
        },
        {
          type: "neutral",
          text: "Registration authority listed as 'Sub-Registrar'. Standard trust deed documentation uploaded."
        }
      ],
      aiRecommendation: "Admin scrutiny required: Verify whether the Trust Deed is properly registered under the Indian Trusts Act before granting verification approval."
    }
  },
  {
    id: "VRF-011",
    ngoId: "NGO011",
    orgName: "Sri Kothandaramasamy Educational Trust",
    darpanId: "TN/2012/0056157",
    state: "Tamil Nadu",
    district: "Ramanathapuram",
    regNumber: "32/BK4/2005",
    actName: "Indian Trust Act 1882",
    ngoType: "Trust (Non-Government)",
    submittedAt: "Yesterday",
    status: "Flagged for Review",
    documents: [
      { name: "Trust_Deed_Certificate.pdf", size: "2.1 MB", verified: true },
      { name: "Audited_Accounts_2024.pdf", size: "5.1 MB", verified: true }
    ],
    aiRiskAnalysis: {
      overallRisk: "Medium Risk Indicator (45%)",
      riskScore: 45,
      riskLevel: "warning",
      flags: [
        {
          type: "warning",
          text: "Flagged: Missing Fields of Work. The registration record has no listed sectors of activity."
        },
        {
          type: "success",
          text: "Act Name validated: 'Indian Trust Act 1882' is an authentic legal statute."
        }
      ],
      aiRecommendation: "Request clarification: Ask the applicant organization to provide documented primary focus areas before final approval."
    }
  },
  {
    id: "VRF-001",
    ngoId: "NGO001",
    orgName: "Integrated Social Service Organization",
    darpanId: "TN/2011/0042860",
    state: "Tamil Nadu",
    district: "Krishnagiri",
    regNumber: "162-2006",
    actName: "society act",
    ngoType: "Registered Societies (Non-Government)",
    submittedAt: "2 days ago",
    status: "Approved",
    documents: [
      { name: "Society_Registration_Certificate.pdf", size: "1.9 MB", verified: true },
      { name: "PAN_and_12A_Certification.pdf", size: "1.4 MB", verified: true },
      { name: "Annual_Audit_2024.pdf", size: "3.8 MB", verified: true }
    ],
    aiRiskAnalysis: {
      overallRisk: "Low Risk (12%)",
      riskScore: 12,
      riskLevel: "safe",
      flags: [
        { type: "success", text: "NGO Darpan ID format valid (TN/2011/0042860)." },
        { type: "success", text: "21 verified fields of work documented with high community activity." },
        { type: "success", text: "No duplicate registration numbers or suspicious contact patterns detected." }
      ],
      aiRecommendation: "Approved for full platform coordination privileges. Trust score: 92/100."
    }
  },
  {
    id: "VRF-002",
    ngoId: "NGO002",
    orgName: "Vinayagar Perarasar Trust",
    darpanId: "TN/2010/0035348",
    state: "Tamil Nadu",
    district: "Kattumannarkoil",
    regNumber: "50",
    actName: "INDIAN TRUST 1882",
    ngoType: "Trust (Non-Government)",
    submittedAt: "3 days ago",
    status: "Pending Review",
    documents: [
      { name: "Trust_Charter_Copy.pdf", size: "2.7 MB", verified: true },
      { name: "FCRA_Certificate_076010200.pdf", size: "1.1 MB", verified: true }
    ],
    aiRiskAnalysis: {
      overallRisk: "Low Risk (15%)",
      riskScore: 15,
      riskLevel: "safe",
      flags: [
        { type: "success", text: "FCRA Registration (076010200) verified active." },
        { type: "success", text: "Governing Act: INDIAN TRUST 1882 verified." }
      ],
      aiRecommendation: "Recommended for Government-Verified status approval."
    }
  }
];

// Disaster Resource Analysis Data (backed directly by datasetDisasters.js)
export const disasterInsightsData = {
  activeCrises: datasetDisasters.slice(0, 5).map((d) => ({
    id: d.id,
    title: `${d.name} (${d.year})`,
    year: d.year,
    severity: d.type,
    state: d.state,
    reportedImpact: d.reportedImpact,
    shortageCause: d.shortageCause,
    dataBasis: d.dataBasis,
    sources: d.sources,
    isResearched: d.isResearched,
    shortageIsInferred: d.shortageIsInferred,
    criticalShortages: d.shortageItems.map((item) => ({
      item,
      category: d.resourceCategories[0] || "Essential Supplies",
      evidence: d.shortageIsInferred ? "Inferred from event context" : "Reported in source material"
    })),
    resourceCategories: d.resourceCategories,
    districts: d.districts,
    contributingAgencies: d.contributingNgos,
    dataSource: d.sources
  }))
};

// System Notifications
const initialNotifications = [
  {
    id: "notif-1",
    type: "emergency",
    title: "Emergency Alert: Wayanad Landslide Relief",
    message: "Critical shortage of drinking water and medical packs reported in Meppadi camp. AI matched your surplus.",
    time: "15 mins ago",
    read: false,
    urgent: true,
    actionPath: "disaster-insights"
  },
  {
    id: "notif-2",
    type: "match",
    title: "AI Match Found for Food Request #REQ-104",
    message: "Integrated Social Service Organization in Krishnagiri has 500 kg rice surplus available (94% match).",
    time: "40 mins ago",
    read: false,
    urgent: false,
    actionPath: "ai-recommendations"
  },
  {
    id: "notif-3",
    type: "transfer",
    title: "Transfer #TR-1082 In Transit",
    message: "Sample transfer record for 500 kg of rice and pulses. Live vehicle location and ETA are unavailable.",
    time: "2 hours ago",
    read: true,
    urgent: false,
    actionPath: "transfers"
  },
  {
    id: "notif-4",
    type: "verification",
    title: "NGO Verification Status Confirmed",
    message: "Oliyagam Trust is registered and verified under Darpan ID TN/2009/0015152.",
    time: "Yesterday",
    read: true,
    urgent: false,
    actionPath: "organisation-profile"
  }
];

class MockStore {
  constructor() {
    this.state = {
      activeRole: 'ngo', // 'ngo' | 'admin'
      currentUser: initialCurrentUser,
      adminUser: adminUser,
      emergencyAlert: initialEmergencyAlert,
      dashboardStats: initialDashboardStats,
      inventoryAllocations: initialInventoryAllocations,
      resources: initialResources,
      requests: initialResourceRequests,
      transfers: initialRecentTransfers,
      aiMatches: initialAiMatches,
      messages: initialMessages,
      verificationQueue: initialVerificationQueue,
      notifications: initialNotifications,
      disasterInsights: disasterInsightsData,
      datasetNgosList: datasetNgos,
      datasetDisastersList: datasetDisasters
    };
    this.subscribers = new Set();
  }

  // State Subscription
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  }

  getState() {
    return this.state;
  }

  // Role Switching
  setRole(role) {
    this.state.activeRole = role;
    this.notify();
  }

  setAuthenticatedUser(user) {
    if (user.isAdmin) {
      this.state.adminUser = { ...this.state.adminUser, ...user };
      this.state.activeRole = 'admin';
    } else {
      this.state.currentUser = {
        ...this.state.currentUser,
        ...user,
        verificationLevel: user.accreditation
      };
      this.state.activeRole = 'ngo';
    }
    this.notify();
  }

  clearAuthenticatedUser() {
    this.state.currentUser = { ...initialCurrentUser };
    this.state.adminUser = { ...adminUser };
    this.state.activeRole = 'ngo';
    this.notify();
  }

  // --- NGO Actions ---

  // Add Resource to Surplus Catalog
  addResource(newResource) {
    const resource = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      status: "Available",
      isOwn: true,
      owner: this.state.currentUser.organization,
      ...newResource
    };
    this.state.resources = [resource, ...this.state.resources];

    // Increment available resources count
    this.state.dashboardStats = this.state.dashboardStats.map((stat) => {
      if (stat.id === "available-resources") {
        const currentVal = parseInt(stat.value, 10) || 28;
        return {
          ...stat,
          value: (currentVal + 1).toString()
        };
      }
      return stat;
    });

    this.notify();
    return resource;
  }

  // Update an existing resource listing and re-render the UI immediately.
  updateResource(resourceId, updates = {}) {
    const resourceIndex = this.state.resources.findIndex((resource) => resource.id === resourceId);
    if (resourceIndex === -1) return null;

    const updatedResource = {
      ...this.state.resources[resourceIndex],
      ...updates
    };

    this.state.resources = this.state.resources.map((resource) =>
      resource.id === resourceId ? updatedResource : resource
    );

    this.notify();
    return updatedResource;
  }

  // Create Resource Request
  createRequest(newReq) {
    const request = {
      id: `#REQ-${Math.floor(100 + Math.random() * 900)}`,
      partner: this.state.currentUser.organization,
      location: `${this.state.currentUser.district}, ${this.state.currentUser.state}`,
      status: "Open",
      statusIcon: "schedule",
      action: "View Details",
      isPrimaryAction: false,
      ...newReq
    };
    this.state.requests = [request, ...this.state.requests];

    // Increment active requests
    this.state.dashboardStats = this.state.dashboardStats.map((stat) => {
      if (stat.id === "active-requests") {
        const currentVal = parseInt(stat.value, 10) || 12;
        return {
          ...stat,
          value: (currentVal + 1).toString()
        };
      }
      return stat;
    });

    this.notify();
    return request;
  }

  // Initiate Transfer from an AI Match or Listing
  initiateTransfer({ title, destination, quantity, partnerOrg }) {
    const transferId = `#TR-${Math.floor(1000 + Math.random() * 900)}`;
    const newTransfer = {
      id: transferId,
      summary: `${quantity} ${title} → ${destination || partnerOrg}`,
      status: "Awaiting allocation",
      statusType: "amber",
      startLocation: `Proposed by ${this.state.currentUser.organization}`,
      currentLocation: "Awaiting resource allocation",
      endLocation: destination || partnerOrg,
      icon: "local_shipping",
      recipientOrg: destination || partnerOrg,
      dispatchedDate: "Just now"
    };

    this.state.transfers = [newTransfer, ...this.state.transfers];

    // Increment pending transfers
    this.state.dashboardStats = this.state.dashboardStats.map((stat) => {
      if (stat.id === "pending-transfers") {
        const currentVal = parseInt(stat.value, 10) || 5;
        return {
          ...stat,
          value: (currentVal + 1).toString()
        };
      }
      return stat;
    });

    this.notify();
    return newTransfer;
  }

  updateTransferStatus(transferId, status) {
    const updatesByStatus = {
      Allocated: {
        status: "Allocated",
        currentLocation: "Resources allocated; awaiting dispatch",
        statusType: "amber",
        icon: "inventory_2"
      },
      Dispatched: {
        status: "Dispatched",
        currentLocation: "Dispatch recorded; awaiting transit update",
        statusType: "amber",
        icon: "outbox"
      },
      "In Transit": {
        status: "In Transit",
        currentLocation: "Transfer marked in transit; live GPS unavailable",
        statusType: "amber",
        icon: "local_shipping"
      },
      "Delivered & Confirmed": {
        status: "Delivered & Confirmed",
        currentLocation: "Delivery recorded in this session",
        statusType: "sage",
        icon: "task_alt",
        signature: "Delivery recorded in local preview",
        podCode: `Transfer Record ${transferId} · local preview`
      }
    };
    const updates = updatesByStatus[status];
    if (!updates) return null;

    let updatedTransfer = null;
    this.state.transfers = this.state.transfers.map((transfer) => {
      if (transfer.id !== transferId) return transfer;
      updatedTransfer = { ...transfer, ...updates };
      return updatedTransfer;
    });
    if (updatedTransfer) this.notify();
    return updatedTransfer;
  }

  // Send a message in a conversation
  sendMessage(conversationId, text) {
    this.state.messages = this.state.messages.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastUpdated: "Just now",
          messages: [
            ...conv.messages,
            {
              id: `m-${Date.now()}`,
              sender: this.state.currentUser.organization,
              text,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: true
            }
          ]
        };
      }
      return conv;
    });
    this.notify();
  }

  // Mark notification as read
  markNotificationAsRead(notifId) {
    this.state.notifications = this.state.notifications.map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    this.notify();
  }

  // Mark all notifications read
  markAllNotificationsRead() {
    this.state.notifications = this.state.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
  }

  // Dismiss emergency banner
  dismissAlert() {
    this.state.emergencyAlert = null;
    this.notify();
  }

  // --- Platform Administrator Actions ---

  // Approve / Reject / Flag NGO Verification
  reviewVerification(verificationId, newStatus, adminNotes = '') {
    this.state.verificationQueue = this.state.verificationQueue.map((item) => {
      if (item.id === verificationId) {
        return {
          ...item,
          status: newStatus,
          reviewedBy: this.state.adminUser.name,
          reviewedAt: "Just now",
          adminNotes
        };
      }
      return item;
    });
    this.notify();
  }

  // Broadcast Emergency Priority
  broadcastEmergencyPriority(newEmergency) {
    this.state.emergencyAlert = {
      id: "emergencyAlertCard",
      ref: `DIS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      priority: "Emergency Priority",
      ...newEmergency
    };
    this.notify();
  }
}

export const mockStore = new MockStore();
