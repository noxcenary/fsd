"""
Screen Builder for ReliefNet
Extracts, adapts, and compiles all 29 screens from the ui/ directory
into standardized Alexandria design system partials and standalone pages.
"""

import os
import re
import json

SCREEN_MAPPINGS = [
    {
        "id": "public-portal",
        "route": "#/portal",
        "title": "Public Portal & Inter-NGO Coordination",
        "stage": "Stage 1: Public",
        "shell": "public",
        "folder": "reliefnet_public_portal_inter_ngo_coordination_alexandria",
    },
    {
        "id": "how-it-works",
        "route": "#/how-it-works",
        "title": "How It Works & Trust Verification",
        "stage": "Stage 1: Public",
        "shell": "public",
        "folder": "reliefnet_how_it_works_trust_verification_2",
    },
    {
        "id": "discover-ngos",
        "route": "#/discover",
        "title": "Public NGO Discovery Transparency Directory",
        "stage": "Stage 1: Public",
        "shell": "public",
        "folder": "reliefnet_public_ngo_discovery_transparency_directory_alexandria",
    },
    {
        "id": "faceted-directory",
        "route": "#/directory",
        "title": "Advanced NGO Directory (Faceted Discovery)",
        "stage": "Stage 1: Public",
        "shell": "public",
        "folder": "reliefnet_advanced_ngo_directory_faceted_discovery_alexandria",
    },
    {
        "id": "sign-in",
        "route": "#/auth/signin",
        "title": "Organization Sign In & Portal Access",
        "stage": "Stage 1: Auth",
        "shell": "public",
        "folder": "reliefnet_organization_sign_in_portal_access_alexandria",
    },
    {
        "id": "registration",
        "route": "#/auth/register",
        "title": "Organization Registration & Track Selection",
        "stage": "Stage 2: Onboard",
        "shell": "public",
        "folder": "reliefnet_organization_registration_track_selection_2",
    },
    {
        "id": "darpan-verification",
        "route": "#/verification/darpan",
        "title": "Government DARPAN State Registry Verification",
        "stage": "Stage 2: Onboard",
        "shell": "public",
        "folder": "reliefnet_government_darpan_state_registry_verification_2",
    },
    {
        "id": "peer-endorsement",
        "route": "#/verification/peer-endorsement",
        "title": "Community Peer Reference Endorsement",
        "stage": "Stage 2: Onboard",
        "shell": "public",
        "folder": "reliefnet_community_peer_reference_endorsement",
    },
    {
        "id": "document-vault",
        "route": "#/verification/vault",
        "title": "Document Vault & AI Risk Status",
        "stage": "Stage 2: Onboard",
        "shell": "dashboard",
        "folder": "reliefnet_document_vault_ai_risk_analysis_verification_status_2",
    },
    {
        "id": "operations-dashboard",
        "route": "#/dashboard",
        "title": "Operations Mission Console Dashboard",
        "stage": "Stage 3: Operations",
        "shell": "dashboard",
        "folder": "reliefnet_operations_dashboard",
    },
    {
        "id": "surplus-inventory",
        "route": "#/inventory/surplus",
        "title": "Surplus Inventory & Expiry Watchtower",
        "stage": "Stage 3: Operations",
        "shell": "dashboard",
        "folder": "reliefnet_surplus_inventory_expiry_control_2",
    },
    {
        "id": "publish-surplus",
        "route": "#/inventory/publish",
        "title": "Publish Surplus Resource Manifest",
        "stage": "Stage 3: Operations",
        "shell": "dashboard",
        "folder": "reliefnet_publish_surplus_resource_manifest_alexandria",
    },
    {
        "id": "resource-directory",
        "route": "#/resources",
        "title": "Resource Directory Surplus Exchange",
        "stage": "Stage 3: Operations",
        "shell": "dashboard",
        "folder": "reliefnet_resource_directory_surplus_exchange",
    },
    {
        "id": "humanitarian-services",
        "route": "#/services",
        "title": "Humanitarian Services Directory & Deployment",
        "stage": "Stage 3: Operations",
        "shell": "dashboard",
        "folder": "reliefnet_humanitarian_services_directory_deployment_2",
    },
    {
        "id": "emergency-requests",
        "route": "#/requests",
        "title": "Emergency Requests & Shortage Directory",
        "stage": "Stage 4: Requisitions",
        "shell": "dashboard",
        "folder": "reliefnet_emergency_requests_shortage_directory_2",
    },
    {
        "id": "create-request",
        "route": "#/requests/create",
        "title": "Create Emergency Resource Requisition",
        "stage": "Stage 4: Requisitions",
        "shell": "dashboard",
        "folder": "reliefnet_create_emergency_resource_request_2",
    },
    {
        "id": "requisition-details",
        "route": "#/requests/REQ-1049",
        "title": "Requisition Details & Split Fulfillment (#REQ-1049)",
        "stage": "Stage 4: Requisitions",
        "shell": "dashboard",
        "folder": "reliefnet_requisition_details_multi_provider_fulfillment",
    },
    {
        "id": "ai-matching",
        "route": "#/matching",
        "title": "AI Resource Matching & Allocation Engine",
        "stage": "Stage 4: Requisitions",
        "shell": "dashboard",
        "folder": "reliefnet_ai_matching_shortage_allocation",
    },
    {
        "id": "match-explainability",
        "route": "#/matching/explainability",
        "title": "AI Match Score Mathematical Explainability",
        "stage": "Stage 4: Requisitions",
        "shell": "dashboard",
        "folder": "reliefnet_ai_match_breakdown_mathematical_explainability",
    },
    {
        "id": "consignment-workspace",
        "route": "#/transfers/workspace",
        "title": "Consignment Collaboration Workspace & Live Handshake",
        "stage": "Stage 5: Logistics",
        "shell": "dashboard",
        "folder": "reliefnet_consignment_collaboration_workspace_live_handshake_alexandria",
    },
    {
        "id": "digital-waybill",
        "route": "#/transfers/waybill",
        "title": "Digital Waybill & Custody Verification (#WB-2023-8821A)",
        "stage": "Stage 5: Logistics",
        "shell": "dashboard",
        "folder": "reliefnet_digital_waybill_consignment_chain_of_custody_alexandria",
    },
    {
        "id": "transfer-tracking",
        "route": "#/transfers",
        "title": "Transfer Lifecycle & Transaction Tracking",
        "shell": "dashboard",
        "folder": "reliefnet_transfer_tracking_transaction_lifecycle",
    },
    {
        "id": "weighbridge-dispute",
        "route": "#/disputes/weighbridge",
        "title": "Consignment Dispute & Weighbridge Mediation",
        "shell": "dashboard",
        "folder": "reliefnet_consignment_dispute_reporting_weighbridge_mediation_alexandria",
    },
    {
        "id": "operational-comms",
        "route": "#/comms",
        "title": "Operational Comms & Mission Coordination Desk",
        "shell": "dashboard",
        "folder": "reliefnet_operational_comms_mission_coordination_desk_2",
    },
    {
        "id": "admin-triage",
        "route": "#/admin/triage",
        "title": "NGO Verification Triage Desk & Document Review",
        "stage": "Stage 6: Governance",
        "shell": "admin",
        "folder": "reliefnet_admin_verification_triage_desk_document_review_2",
    },
    {
        "id": "admin-sybil-graph",
        "route": "#/admin/sybil-risk",
        "title": "Cross-Network Sybil Detection & Graph Risk Intelligence",
        "stage": "Stage 6: Governance",
        "shell": "admin",
        "folder": "reliefnet_admin_ai_risk_sybil_graph_intelligence_2",
    },
    {
        "id": "admin-arbitration",
        "route": "#/admin/arbitration",
        "title": "Cargo & Dispatch Mediation Command",
        "stage": "Stage 6: Governance",
        "shell": "admin",
        "folder": "reliefnet_admin_cargo_dispatch_mediation_command_2",
    },
    {
        "id": "admin-ledger",
        "route": "#/admin/ledger",
        "title": "Cryptographic Ledger & State Consensus Audit Stream",
        "stage": "Stage 6: Governance",
        "shell": "admin",
        "folder": "reliefnet_admin_cryptographic_ledger_audit_stream",
    },
    {
        "id": "design-system-guide",
        "route": "#/design-system",
        "title": "Alexandria Design System Canonical Gazette & Style Guide",
        "stage": "Design System",
        "shell": "public",
        "folder": "alexandria_design_system_printable_pdf_guide",
    }
]

def adapt_markup(html_content, screen_info):
    # 1. Update font references to Alexandria
    html = html_content
    html = re.sub(r'font-headline(-[a-z]+)?', 'font-serif', html)
    html = re.sub(r'font-display(-[a-z]+)?', 'font-serif', html)
    html = re.sub(r'font-label(-[a-z]+)?', 'font-label', html)
    html = re.sub(r'font-body(-[a-z]+)?', 'font-sans', html)
    
    # 2. Update legacy fieldgrid colors if present
    color_replacements = {
        '#002318': '#08211c',
        '#0f392b': '#064e3b',
        '#003a25': '#08211c',
        '#376757': '#047857',
        '#baeed9': '#d1fae5',
        '#a5d0bc': '#a7f3d0',
        '#7aa391': '#6ee7b7',
        '#c0ecd7': '#ecfdf5',
        '#6ffbbe': '#fcd34d',
        '#00af79': '#059669',
        '#3e6656': '#065f46'
    }
    for old_c, new_c in color_replacements.items():
        html = html.replace(old_c, new_c)

    # 3. Update route hyperlinks
    nav_replacements = [
        (r'data-path="overview"', 'href="#/portal"'),
        (r'data-path="how-it-works-trust"', 'href="#/how-it-works"'),
        (r'data-path="discover-ngos"', 'href="#/directory"'),
        (r'data-path="emergency-shortages"', 'href="#/requests"'),
        (r'data-path="sign-in"', 'href="#/auth/signin"'),
        (r'data-path="register-organization"', 'href="#/auth/register"'),
        (r'data-path="dashboard"', 'href="#/dashboard"'),
        (r'data-path="resources"', 'href="#/inventory/surplus"'),
        (r'data-path="requests"', 'href="#/requests"'),
        (r'data-path="ai-matching"', 'href="#/matching"'),
        (r'data-path="services"', 'href="#/services"'),
        (r'data-path="activity-feed"', 'href="#/dashboard"'),
        (r'data-path="messages"', 'href="#/comms"'),
        (r'data-path="transactions"', 'href="#/transfers"'),
        (r'data-path="org-profile-trust"', 'href="#/verification/vault"'),
        (r'data-path="settings"', 'href="#/admin/triage"')
    ]
    for pattern, repl in nav_replacements:
        html = re.sub(pattern, repl, html)

    return html

def build():
    os.makedirs("static/partials", exist_ok=True)
    os.makedirs("static/pages", exist_ok=True)

    summary = []
    for item in SCREEN_MAPPINGS:
        folder = item["folder"]
        src_path = os.path.join("ui", folder, "code.html")
        if not os.path.exists(src_path):
            print(f"Warning: {src_path} not found!")
            continue

        with open(src_path, "r", encoding="utf-8", errors="ignore") as f:
            raw_html = f.read()

        adapted = adapt_markup(raw_html, item)

        # Extract main block
        m_main = re.search(r'<main[^>]*>(.*?)</main>', adapted, re.DOTALL)
        main_content = m_main.group(1) if m_main else adapted

        # Extract any trailing modals / dialogs after </main>
        m_after_main = re.search(r'</main>(.*?)</body>', adapted, re.DOTALL)
        extra_content = m_after_main.group(1) if m_after_main else ""

        # Remove extra duplicate <script> tags inside partial
        clean_extra = re.sub(r'<script.*?</script>', '', extra_content, flags=re.DOTALL)

        partial_content = f"""<!-- Screen: {item['title']} | ID: {item['id']} | UI Source: {folder} -->
<div id="screen-{item['id']}" class="reliefnet-screen-view w-full" data-shell="{item['shell']}">
  {main_content}
  {clean_extra}
</div>
"""
        partial_file = os.path.join("static/partials", f"{item['id']}.html")
        with open(partial_file, "w", encoding="utf-8") as f:
            f.write(partial_content)

        # Also create a standalone full page version with Alexandria wrapper
        standalone_file = os.path.join("static/pages", f"{item['id']}.html")
        standalone_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{item['title']} — ReliefNet</title>
  <link rel="stylesheet" href="/static/css/alexandria.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Public+Sans:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
  <script>
    tailwind.config = {{
      darkMode: "class",
      theme: {{
        extend: {{
          colors: {{
            primary: {{ DEFAULT: "#1d4ed8", 50: "#eff6ff", 100: "#dbeafe", 500: "#3b82f6", 600: "#1d4ed8", 700: "#1e40af" }},
            "primary-container": "#eff6ff",
            "on-primary": "#ffffff",
            "on-primary-container": "#1e40af",
            "primary-fixed": "#dbeafe",
            "secondary-container": "#f1f5f9",
            "on-secondary-container": "#0f172a",
            surface: "#f8fafc",
            "on-surface": "#0f172a",
            "on-surface-variant": "#475569",
            "surface-container-lowest": "#ffffff",
            "surface-container-low": "#f8fafc",
            "surface-container": "#f1f5f9",
            "surface-container-high": "#e2e8f0",
            outline: "#94a3b8",
            "outline-variant": "#e2e8f0"
          }},
          spacing: {{
            "space-xs": "0.25rem",
            "space-sm": "0.5rem",
            "space-md": "0.75rem",
            "space-lg": "1rem",
            "space-xl": "1.5rem",
            "margin-desktop": "2rem",
            "gutter-desktop": "1.5rem"
          }},
          fontFamily: {{
            serif: ['"Noto Serif"', 'Georgia', 'serif'],
            sans: ['"Inter"', 'system-ui', 'sans-serif'],
            label: ['"Public Sans"', '"Inter"', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }},
          fontSize: {{
            "display-lg": ["32px", {{ lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }}],
            "headline-lg": ["24px", {{ lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "600" }}],
            "headline-md": ["20px", {{ lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }}],
            "headline-sm": ["16px", {{ lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "600" }}],
            "body-lg": ["16px", {{ lineHeight: "24px", fontWeight: "400" }}],
            "body-md": ["14px", {{ lineHeight: "20px", fontWeight: "400" }}],
            "body-sm": ["13px", {{ lineHeight: "18px", fontWeight: "400" }}],
            "label-lg": ["14px", {{ lineHeight: "20px", fontWeight: "600" }}],
            "label-md": ["12px", {{ lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "600" }}],
            "label-sm": ["11px", {{ lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "600" }}],
            "caption": ["12px", {{ lineHeight: "16px", fontWeight: "400" }}]
          }}
        }}
      }}
    }};
  </script>
</head>
<body class="bg-surface font-sans antialiased text-slate-900">
  <div id="global-header"></div>
  <main class="w-full">
    {main_content}
    {clean_extra}
  </main>
  <script src="/static/js/screen_catalog.js"></script>
  <script src="/static/js/mock_data.js"></script>
  <script src="/static/js/api.js"></script>
  <script src="/static/js/app.js"></script>
</body>
</html>"""
        with open(standalone_file, "w", encoding="utf-8") as f:
            f.write(standalone_html)

        summary.append({
            "id": item["id"],
            "title": item["title"],
            "route": item["route"],
            "shell": item["shell"],
            "uiFolder": item["folder"],
            "partialBytes": len(partial_content)
        })

    with open("static/screens_index.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print(f"Successfully processed and generated all {len(summary)} screens!")

if __name__ == "__main__":
    build()
