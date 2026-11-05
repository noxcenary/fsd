import { mockStore } from '../data/mockStore';

let previewUser = null;
let nextDocumentId = 1;
const applications = [];

function requireAdmin() {
  if (!previewUser?.isAdmin) {
    const error = new Error('Administrator access is required.');
    error.status = 403;
    throw error;
  }
}

function applicationForUser(user) {
  return {
    id: user.id,
    organizationName: user.organization,
    email: user.email || user.contactEmail || '',
    ngoType: user.ngoType || 'Not provided',
    registrationNumber: user.registrationNumber || '',
    darpanId: user.darpanId || user.regNumber || '',
    state: user.state || '',
    district: user.district || '',
    leadName: user.name,
    role: user.role || '',
    verificationLevel: user.verificationLevel || '',
    establishedYear: user.establishedYear || null,
    serviceAreas: user.serviceAreas || [],
    resourceCategories: user.resourceCategories || [],
    contactPhone: user.contactPhone || '',
    contactEmail: user.contactEmail || user.email || '',
    status: 'approved',
    reviewNotes: '',
    isLocalPreviewSample: true,
    referralCode: '',
    shareContact: false,
    createdAt: new Date().toISOString(),
    documents: []
  };
}

function getApplicationForPreviewUser() {
  if (!previewUser || previewUser.isAdmin) throw new Error('Sign in as an NGO to view its profile.');
  return applications.find((application) => application.id === previewUser.id)
    || applicationForUser(previewUser);
}

function toDirectoryOrganization(application) {
  return {
    id: application.id,
    name: application.organizationName,
    ngoType: application.ngoType,
    darpanId: application.darpanId,
    regNumber: application.registrationNumber,
    state: application.state,
    district: application.district,
    email: application.shareContact ? application.email : null,
    verificationStatus: 'Platform approved',
    source: 'platform'
  };
}

function localRulesAnalysis({ event, inventory }) {
  const needs = event.resourceCategories?.length
    ? event.resourceCategories
    : event.reportedNeeds?.length
      ? event.reportedNeeds
      : event.inferredNeeds || [];
  const categoryAliases = {
    'Food & Water': ['Food & Nutrition', 'Water & Sanitation'],
    'Food and water': ['Food & Nutrition', 'Water & Sanitation'],
    Food: ['Food & Nutrition'],
    Medical: ['Medicines & First Aid', 'Medical Equipment'],
    'Rescue equipment': ['Medical Equipment'],
    Shelter: ['Shelter Materials'],
    'Shelter & Household items': ['Shelter Materials'],
    'Clothing & Bedding': ['Clothing & Blankets']
  };
  const categories = [...new Set(needs.flatMap((need) => categoryAliases[need] || [need]))];
  const planningSignals = categories.map((category) => {
    const matches = inventory
      .filter((item) => item.category === category && ['Available', 'Surplus Available'].includes(item.listingStatus))
      .map((item) => item.itemName);
    return {
      need: category,
      evidence: matches.length
        ? `Historical resource category with ${matches.length} matching sample listing(s). Availability is not independently confirmed.`
        : 'No matching sample listing. This is not evidence of a current shortage.',
      listedMatches: matches.slice(0, 8)
    };
  });

  return {
    model: 'Transparent local rules check',
    summary: `Compared ${categories.length} historical resource categories with sample listings for ${event.title}. This is a preparedness check, not a live forecast or trained AI model.`,
    planningSignals,
    followUpQuestions: [
      'Confirm current need and quantity with field responders.',
      'Contact listing owners to verify stock, condition, and location before arranging a transfer.'
    ]
  };
}

function withDelay(fn) {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), 150));
}

export const api = {
  login: async ({ role, email }) => {
    const state = mockStore.getState();
    if (role === 'admin') {
      previewUser = {
        ...state.adminUser,
        email,
        accreditation: 'Local preview administrator · not authenticated',
        isAdmin: true,
        isLocalPreview: true
      };
      return { user: previewUser };
    }

    const application = applications.find((entry) => entry.email.toLowerCase() === email?.toLowerCase());
    previewUser = application
      ? {
        id: application.id,
        email: application.email,
        name: application.leadName,
        organization: application.organizationName,
        role: 'NGO Representative',
        accreditation: 'Local preview account · not government verified',
        verificationStatus: application.status,
        regNumber: application.darpanId || application.registrationNumber,
        ngoType: application.ngoType,
        state: application.state,
        district: application.district,
        isAdmin: false,
        isLocalPreview: true
      }
      : {
        ...state.currentUser,
        accreditation: 'Local preview account',
        verificationStatus: 'approved',
        isAdmin: false,
        isLocalPreview: true
      };
    return { user: previewUser };
  },

  getCurrentUser: async () => ({ user: previewUser }),

  logout: async () => {
    previewUser = null;
  },

  register: async ({ application, documents }) => {
    const registered = {
      id: `local-app-${Date.now()}-${applications.length}`,
      organizationName: application.organizationName,
      email: application.email,
      ngoType: application.ngoType,
      registrationNumber: application.registrationNumber,
      darpanId: application.darpanId,
      state: application.state,
      district: application.district,
      leadName: application.leadName,
      referralCodeSubmitted: application.referralCode,
      status: 'pending_review',
      reviewNotes: '',
      shareContact: application.shareContact,
      referralCode: '',
      createdAt: new Date().toISOString(),
      documents: documents.map((file) => ({
        id: `local-doc-${nextDocumentId++}`,
        name: file.name,
        byteSize: file.size,
        status: 'pending',
        notes: '',
        file
      }))
    };
    applications.unshift(registered);
    return {
      status: 'pending_review',
      message: 'Saved for this app session only. Sign in with Local Preview as an administrator to review; nothing was sent to a server.'
    };
  },

  getNgoApplication: async () => ({ application: getApplicationForPreviewUser() }),

  uploadNgoDocuments: async (documents) => {
    const application = getApplicationForPreviewUser();
    let storedApplication = applications.find((entry) => entry.id === application.id);
    if (!storedApplication) {
      storedApplication = application;
      applications.unshift(storedApplication);
    }
    storedApplication.documents.push(...documents.map((file) => ({
      id: `local-doc-${nextDocumentId++}`,
      name: file.name,
      byteSize: file.size,
      status: 'pending',
      notes: '',
      file
    })));
    if (storedApplication.status === 'clarification_requested') {
      storedApplication.status = 'pending_review';
    }
    return { message: 'Selected document names are available in this app session only; nothing was uploaded to a server.' };
  },

  getApprovedNgos: async () => ({
    organizations: applications
      .filter((application) => application.status === 'approved' && !application.isLocalPreviewSample)
      .map(toDirectoryOrganization)
  }),

  getRegistrations: async (status = 'pending_review') => {
    requireAdmin();
    return {
      registrations: applications
        .filter((application) => status === 'all' || application.status === status)
        .map(({ documents, ...application }) => ({
          ...application,
          documentCount: documents.length
        }))
    };
  },

  getRegistration: async (id) => {
    requireAdmin();
    const application = applications.find((entry) => entry.id === id);
    if (!application) throw new Error('Registration not found in this app session.');
    return {
      registration: {
        ...application,
        documents: application.documents.map(({ file: _file, ...document }) => document)
      }
    };
  },

  reviewRegistration: async (id, decision) => {
    requireAdmin();
    const application = applications.find((entry) => entry.id === id);
    if (!application) throw new Error('Registration not found in this app session.');
    application.status = decision.status;
    application.reviewNotes = decision.notes;
    if (decision.status === 'approved') {
      application.referralCode = `LOCAL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      application.documents.forEach((document) => {
        document.status = 'accepted';
        document.notes = 'Recorded in local preview; not an actual verification.';
      });
    } else if (decision.status === 'rejected') {
      application.documents.forEach((document) => {
        document.status = 'rejected';
        document.notes = decision.notes;
      });
    }
    return { status: application.status, referralCode: application.referralCode || undefined };
  },

  getDocumentDownloadUrl: (id) => {
    const document = applications.flatMap((application) => application.documents)
      .find((entry) => entry.id === id);
    if (!document?.file) throw new Error('This sample document is no longer available in this app session.');
    return URL.createObjectURL(document.file);
  },

  analyzeShortage: async (analysis) => ({ advisory: localRulesAnalysis(analysis) }),

  switchRole: (role) => withDelay(() => mockStore.setRole(role)),
  getResources: () => withDelay(() => mockStore.getState().resources),
  addResource: (resource) => withDelay(() => mockStore.addResource(resource)),
  getRequests: () => withDelay(() => mockStore.getState().requests),
  createRequest: (requestData) => withDelay(() => mockStore.createRequest(requestData)),
  getAiMatches: () => withDelay(() => mockStore.getState().aiMatches),
  getTransfers: () => withDelay(() => mockStore.getState().transfers),
  initiateTransfer: (transferData) => withDelay(() => mockStore.initiateTransfer(transferData)),
  getConversations: () => withDelay(() => mockStore.getState().messages),
  sendMessage: (convoId, text) => withDelay(() => mockStore.sendMessage(convoId, text)),
  getDisasterInsights: () => withDelay(() => mockStore.getState().disasterInsights),
  getNotifications: () => withDelay(() => mockStore.getState().notifications),
  markNotificationRead: (id) => withDelay(() => mockStore.markNotificationAsRead(id)),
  markAllNotificationsRead: () => withDelay(() => mockStore.markAllNotificationsRead()),
  broadcastEmergency: (alertData) => withDelay(() => mockStore.broadcastEmergencyPriority(alertData))
};
