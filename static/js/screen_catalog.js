/**
 * Screen Catalog & Route Inventory
 * Maps all 29 distinct screens from the ui/ directory to their corresponding routes.
 */

window.RELIEFNET_SCREENS = [
  {
    id: "public-portal",
    route: "#/portal",
    title: "Public Portal & Inter-NGO Coordination",
    stage: "Stage 1: Public",
    shell: "public",
    uiFolder: "reliefnet_public_portal_inter_ngo_coordination_alexandria",
    description: "Decentralized Inter-NGO humanitarian resource network homepage, live corridor metrics, pillars, active dispatches."
  },
  {
    id: "how-it-works",
    route: "#/how-it-works",
    title: "How It Works & Trust Verification",
    stage: "Stage 1: Public",
    shell: "public",
    uiFolder: "reliefnet_how_it_works_trust_verification_2",
    description: "4-stage governance protocol, RFC-8212 deterministic matching engine, cryptographic transfer audit trail."
  },
  {
    id: "discover-ngos",
    route: "#/discover",
    title: "Public NGO Discovery Transparency Directory",
    stage: "Stage 1: Public",
    shell: "public",
    uiFolder: "reliefnet_public_ngo_discovery_transparency_directory_alexandria",
    description: "Public transparency directory, state & district filters, verified organization accreditation drawers."
  },
  {
    id: "faceted-directory",
    route: "#/directory",
    title: "Advanced NGO Directory (Faceted Discovery)",
    stage: "Stage 1: Public",
    shell: "public",
    uiFolder: "reliefnet_advanced_ngo_directory_faceted_discovery_alexandria",
    description: "Faceted search across 195+ real Indian NGOs, grid/table/map modes, deep trust dossiers, and live CSV export."
  },
  {
    id: "sign-in",
    route: "#/auth/signin",
    title: "Organization Sign In & Portal Access",
    stage: "Stage 1: Auth",
    shell: "public",
    uiFolder: "reliefnet_organization_sign_in_portal_access_alexandria",
    description: "Institutional enclave authentication, DARPAN SSO, hardware FIDO2 token verification, role switching."
  },
  {
    id: "registration",
    route: "#/auth/register",
    title: "Organization Registration & Track Selection",
    stage: "Stage 2: Onboard",
    shell: "public",
    uiFolder: "reliefnet_organization_registration_track_selection_2",
    description: "3-track accreditation selector: Sovereign DARPAN, Peer Reference Endorsement, and Ad-Hoc Emergency Relief."
  },
  {
    id: "darpan-verification",
    route: "#/verification/darpan",
    title: "Government DARPAN State Registry Verification",
    stage: "Stage 2: Onboard",
    shell: "public",
    uiFolder: "reliefnet_government_darpan_state_registry_verification_2",
    description: "Live DARPAN API validator, state database key-value match panel, PAN check, and SMS 2FA."
  },
  {
    id: "peer-endorsement",
    route: "#/verification/peer-endorsement",
    title: "Community Peer Reference Endorsement",
    stage: "Stage 2: Onboard",
    shell: "public",
    uiFolder: "reliefnet_community_peer_reference_endorsement",
    description: "Peer endorsement workflow, vouching requests, multi-signature attestations, and vouching audit history."
  },
  {
    id: "document-vault",
    route: "#/verification/vault",
    title: "Document Vault & AI Risk Status",
    stage: "Stage 2: Onboard",
    shell: "dashboard",
    uiFolder: "reliefnet_document_vault_ai_risk_analysis_verification_status_2",
    description: "Forensic OCR vault, AI explainability matrix, suspicious duplicate pattern indicators, and accreditation rail."
  },
  {
    id: "operations-dashboard",
    route: "#/dashboard",
    title: "Operations Mission Console Dashboard",
    stage: "Stage 3: Operations",
    shell: "dashboard",
    uiFolder: "reliefnet_operations_dashboard",
    description: "Mission console, Karnataka node telemetry, quick action triggers, trust ribbon, live requisitions, surplus alerts."
  },
  {
    id: "surplus-inventory",
    route: "#/inventory/surplus",
    title: "Surplus Inventory & Expiry Watchtower",
    stage: "Stage 3: Operations",
    shell: "dashboard",
    uiFolder: "reliefnet_surplus_inventory_expiry_control_2",
    description: "Inventory levels, 18-day perishable countdown watchtower, batch deductions, and priority allocation triggers."
  },
  {
    id: "publish-surplus",
    route: "#/inventory/publish",
    title: "Publish Surplus Resource Manifest",
    stage: "Stage 3: Operations",
    shell: "dashboard",
    uiFolder: "reliefnet_publish_surplus_resource_manifest_alexandria",
    description: "4-step wizard: Category & specs, storage certificates, delivery radius, and instant algorithmic match preview."
  },
  {
    id: "resource-directory",
    route: "#/resources",
    title: "Resource Directory Surplus Exchange",
    stage: "Stage 3: Operations",
    shell: "dashboard",
    uiFolder: "reliefnet_resource_directory_surplus_exchange",
    description: "Surplus marketplace: food grains, medical kits, temporary shelters, water purification skids."
  },
  {
    id: "humanitarian-services",
    route: "#/services",
    title: "Humanitarian Services Directory & Deployment",
    stage: "Stage 3: Operations",
    shell: "dashboard",
    uiFolder: "reliefnet_humanitarian_services_directory_deployment_2",
    description: "Deployable human & mechanical assets: Mobile trauma EMTs, 4x4 flood trucks, rapid kitchen units, de-watering pumps."
  },
  {
    id: "emergency-requests",
    route: "#/requests",
    title: "Emergency Requests & Shortage Directory",
    stage: "Stage 4: Requisitions",
    shell: "dashboard",
    uiFolder: "reliefnet_emergency_requests_shortage_directory_2",
    description: "Priority master requisition ledger, deficit countdown, SLA countdown, and multi-pledge action buttons."
  },
  {
    id: "create-request",
    route: "#/requests/create",
    title: "Create Emergency Resource Requisition",
    stage: "Stage 4: Requisitions",
    shell: "dashboard",
    uiFolder: "reliefnet_create_emergency_resource_request_2",
    description: "Requisition creator: SLA urgency matrix, receiving bay specifications, solver forecast."
  },
  {
    id: "requisition-details",
    route: "#/requests/REQ-1049",
    title: "Requisition Details & Split Fulfillment (#REQ-1049)",
    stage: "Stage 4: Requisitions",
    shell: "dashboard",
    uiFolder: "reliefnet_requisition_details_multi_provider_fulfillment",
    description: "Requisition #REQ-1049 (500 kg rice): Multi-provider progress bar, live pledges, donor split allocation, dispatch schedule."
  },
  {
    id: "ai-matching",
    route: "#/matching",
    title: "AI Resource Matching & Allocation Engine",
    stage: "Stage 4: Requisitions",
    shell: "dashboard",
    uiFolder: "reliefnet_ai_matching_shortage_allocation",
    description: "Intelligent matching engine, bilateral & multilateral solver, shortage allocation, distance vs urgency trade-off."
  },
  {
    id: "match-explainability",
    route: "#/matching/explainability",
    title: "AI Match Score Mathematical Explainability",
    stage: "Stage 4: Requisitions",
    shell: "dashboard",
    uiFolder: "reliefnet_ai_match_breakdown_mathematical_explainability",
    description: "Deep factor weights: Euclidean distance, trust coefficient, perishable shelf-life, and formula view."
  },
  {
    id: "consignment-workspace",
    route: "#/transfers/workspace",
    title: "Consignment Collaboration Workspace & Live Handshake",
    stage: "Stage 5: Logistics",
    shell: "dashboard",
    uiFolder: "reliefnet_consignment_collaboration_workspace_live_handshake_alexandria",
    description: "Channel #DISPATCH-KA-1049: Dual-pane signed coordination chat, milestone checklist, cryptographic handshake protocol."
  },
  {
    id: "digital-waybill",
    route: "#/transfers/waybill",
    title: "Digital Waybill & Custody Verification (#WB-2023-8821A)",
    stage: "Stage 5: Logistics",
    shell: "dashboard",
    uiFolder: "reliefnet_digital_waybill_consignment_chain_of_custody_alexandria",
    description: "Official printable waybill #WB-2023-8821A, QR code, cryptographic signatures, multi-checkpoint chain of custody."
  },
  {
    id: "transfer-tracking",
    route: "#/transfers",
    title: "Transfer Lifecycle & Transaction Tracking",
    stage: "Stage 5: Logistics",
    shell: "dashboard",
    uiFolder: "reliefnet_transfer_tracking_transaction_lifecycle",
    description: "End-to-end transaction state machine: Requisition -> Pledge -> Waybill -> Weighbridge -> Verified Receipt."
  },
  {
    id: "weighbridge-dispute",
    route: "#/disputes/weighbridge",
    title: "Consignment Dispute & Weighbridge Mediation",
    stage: "Stage 5: Logistics",
    shell: "dashboard",
    uiFolder: "reliefnet_consignment_dispute_reporting_weighbridge_mediation_alexandria",
    description: "Tare weight dispute docket #DISP-2023-049 (-620 kg deficit), weighbridge slip, photo vault, statutory conciliation form."
  },
  {
    id: "operational-comms",
    route: "#/comms",
    title: "Operational Comms & Mission Coordination Desk",
    stage: "Stage 5: Logistics",
    shell: "dashboard",
    uiFolder: "reliefnet_operational_comms_mission_coordination_desk_2",
    description: "Multi-channel dispatch hub, disaster theater broadcast, encrypted inter-agency comms, tactical macros."
  },
  {
    id: "admin-triage",
    route: "#/admin/triage",
    title: "NGO Verification Triage Desk & Document Review",
    stage: "Stage 6: Governance",
    shell: "admin",
    uiFolder: "reliefnet_admin_verification_triage_desk_document_review_2",
    description: "Sovereign review bench, OCR forensic analyzer, DARPAN cross-check, ECDSA signature sign-off."
  },
  {
    id: "admin-sybil-graph",
    route: "#/admin/sybil-risk",
    title: "Cross-Network Sybil Detection & Graph Risk Intelligence",
    stage: "Stage 6: Governance",
    shell: "admin",
    uiFolder: "reliefnet_admin_ai_risk_sybil_graph_intelligence_2",
    description: "Topology DAG graph, cluster analysis, shared bank accounts/phone numbers/addresses, quarantine ring action."
  },
  {
    id: "admin-arbitration",
    route: "#/admin/arbitration",
    title: "Cargo & Dispatch Mediation Command",
    stage: "Stage 6: Governance",
    shell: "admin",
    uiFolder: "reliefnet_admin_cargo_dispatch_mediation_command_2",
    description: "Weighbridge variance arbitration bench, photographic evidence bench, driver sworn statements, binding ruling."
  },
  {
    id: "admin-ledger",
    route: "#/admin/ledger",
    title: "Cryptographic Ledger & State Consensus Audit Stream",
    stage: "Stage 6: Governance",
    shell: "admin",
    uiFolder: "reliefnet_admin_cryptographic_ledger_audit_stream",
    description: "Merkle tree root, append-only block stream, JSON payload viewer, SHA-256 state consensus validator."
  },
  {
    id: "design-system-guide",
    route: "#/design-system",
    title: "Alexandria Design System Canonical Gazette & Style Guide",
    stage: "Design System",
    shell: "public",
    uiFolder: "alexandria_design_system_printable_pdf_guide",
    description: "Complete design tokens, typographic hierarchy, porcelain surface scale, and reusable component patterns."
  }
];

