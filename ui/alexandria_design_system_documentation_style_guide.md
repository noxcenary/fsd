# Alexandria Design System — Complete Specification & Implementation Guide
**Platform:** ReliefNet Humanitarian Coordination & Governance OS  
**Theme:** Alexandria ("The Digital Curator")  
**Design System Identifier:** `{{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}`  
**Version:** 4.2 Production Release  
**Status:** Canonical Reference

---

## 1. Executive Summary & Design Philosophy

### North Star: "The Digital Curator"
Alexandria transforms critical public utility and humanitarian infrastructure from utilitarian database forms into an authoritative, scholarly editorial gazette and statutory crisis ledger. It brings the prestige, visual gravitas, and typographic rigor of premium editorial publications to mission-critical operational software.

### Core Principles
1. **Statutory Authority via Serif Hierarchy:**  
   Headings, dossiers, legal statutes, and case titles command respect through high-contrast serif typography (`Noto Serif`).
2. **Dense Data, Effortless Scannability:**  
   Operational metrics, cryptographic hashes, telemetry numbers, and weighbridge weights use monospace and geometric sans with strict tabular spacing.
3. **Calm Porcelain & Institutional Navy:**  
   Surfaces evoke archival paper and crisp institutional binders (`#ffffff`, `#f8fafc`, `#f1f5f9`), framed by stately blue accents (`#3366cc`) and authoritative dark navy chrome (`#0f2444`, `#1a365d`).
4. **Human-in-the-Loop Transparency:**  
   Algorithmic outputs are explicitly labeled as decision-support heuristics, distinguished with tinted factor badges, explainability cards, and cryptographic sign-off affordances.

---

## 2. Color Palette & Token System

### 2.1 Primary & Brand Colors
| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| `primary` | `#3366cc` | Main interactive brand color, primary CTA buttons, active tabs, verified linkages |
| `primary-hover` | `#2554a8` | Button hover and pressed states |
| `primary-light` | `#eff6ff` | Selected table row background, chip background, subtle focus halos |
| `primary-border` | `#bfdbfe` | Subtle primary container borders |

### 2.2 Neutral & Surface Hierarchy
| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| `surface-canvas` | `#f8fafc` | Global outer page background |
| `surface-card` | `#ffffff` | Primary panel, data table, and modal background |
| `surface-secondary` | `#f1f5f9` | Inner container low, table header background, inactive tabs |
| `surface-dim` | `#e2e8f0` | Inset backgrounds, divider rules, subtle cards |
| `chrome-dark` | `#0f2444` | Top administrative headers, air-gapped security enclaves, footer bar |
| `chrome-navy` | `#1a365d` | Left navigation bar on operations dashboards |

### 2.3 Typography & Text Contrast
| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| `text-primary` | `#0f172a` | High-contrast title and body text (Slate-900) |
| `text-secondary` | `#475569` | Subtitles, field labels, metadata descriptions (Slate-600) |
| `text-tertiary` | `#64748b` | Timestamps, table column headers, helper notes (Slate-500) |
| `text-inverse` | `#ffffff` | Text on dark buttons, badges, and dark navigation headers |

### 2.4 Status, Crisis & Semantic Palette
| Semantic Role | Background | Text / Stroke | Border | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Tier-1 Verified / Safe** | `#f0fdf4` | `#166534` | `#bbf7d0` | Government DARPAN badges, zero-defect audit logs |
| **Tier-2 Community Verified**| `#eff6ff` | `#1d4ed8` | `#bfdbfe` | Peer-endorsed network badges, active transfers |
| **Warning / Expedited** | `#fefce8` | `#854d0e` | `#fef08a` | Expiry countdown (<30 days), weighbridge variance |
| **Red Alert / Crisis** | `#fef2f2` | `#991b1b` | `#fecaca` | Active flood crisis, critical shortages, Sybil quarantine |
| **Neutral / Draft** | `#f8fafc` | `#475569` | `#cbd5e1` | Inactive channels, unverified drafts, archived records |

---

## 3. Typography Scale & Pairings

### Font Families
- **Display & Headings:** `Noto Serif`, Georgia, serif
- **Body & Controls:** `Inter`, `Plus Jakarta Sans`, system-ui, sans-serif
- **Code & Hashes:** `JetBrains Mono`, `Fira Code`, monospace

### Type Hierarchy
| Scale Name | Font | Size | Weight | Line Height | Tracking | Recommended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display XL** | Noto Serif | `32px` (2rem) | Bold (700) | `1.2` | `-0.02em` | Portal hero headlines, dossier titles |
| **Display LG** | Noto Serif | `24px` (1.5rem) | Bold (700) | `1.25` | `-0.015em` | Page header titles, incident dockets |
| **Heading MD** | Noto Serif | `20px` (1.25rem)| Semi (600) | `1.3` | `-0.01em` | Major section cards, modal titles |
| **Heading SM** | Noto Serif | `16px` (1rem) | Semi (600) | `1.4` | `normal` | Sub-card headers, accordion titles |
| **Body Default** | Inter | `14px` (0.875rem)| Regular (400)| `1.5` | `normal` | Standard prose, narrative audit notes |
| **Body Medium** | Inter | `14px` (0.875rem)| Medium (500) | `1.5` | `normal` | Form inputs, table cells, button labels |
| **Caption / Meta** | Inter | `12px` (0.75rem) | Medium (500) | `1.4` | `+0.01em` | Timestamps, SLA metrics, field tags |
| **Micro Tag** | Inter | `11px` (0.6875rem)| Semi (600) | `1.2` | `+0.05em` | Status chips, uppercase protocol flags |
| **Monospace Hash** | Mono | `12px` (0.75rem) | Regular (400)| `1.4` | `normal` | SHA-256 signatures, public keys, DARPAN IDs |

---

## 4. Spacing, Geometry & Elevation

### Spacing Rhythm
Built upon an 8-point baseline grid with a 4-point half-step:
- `4px` (`space-1`): Micro tag padding, icon-text gap
- `8px` (`space-2`): Input vertical padding, chip gaps
- `12px` (`space-3`): Card sub-element spacing
- `16px` (`space-4`): Component interior padding, form row spacing
- `24px` (`space-6`): Card container padding, column gutters
- `32px` (`space-8`): Section separation on dashboards
- `48px` (`space-12`): Major content block rhythm on public portal

### Radii Tokens
- **Tags & Badges:** `rounded` (`4px`) or `rounded-full` (`9999px`)
- **Buttons & Inputs:** `rounded-md` (`6px`)
- **Cards & Data Panels:** `rounded-lg` (`8px`)
- **Modals & Flyouts:** `rounded-xl` (`12px`)

### Elevation & Borders
- **Border Default:** `1px solid #e2e8f0` (Slate-200)
- **Border Accent:** `1px solid #3366cc` (Primary focus)
- **Shadow Flat / Subtle:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Shadow Floating:** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`

---

## 5. Reusable Component Patterns

### 5.1 Top Navigation Bar (Institutional Gazette)
- Dark Navy background (`#0f2444`) with white typography.
- Left brand badge: "RELIEFNET" + "ADMIN / DISASTER OVERSIGHT CONSOLE".
- Center contextual theater breadcrumb: e.g., "DISASTER THEATER OVERSIGHT: KARNATAKA NODE".
- Right status indicator: Live mesh connection dot (`99.8% Online`), Red Alert crisis override button, and cryptographic officer token pill.

### 5.2 Metric Summary KPI Tiles
```html
<div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
  <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
    <span>Active Dispute Dockets</span>
    <svg class="w-4 h-4 text-slate-400" ...></svg>
  </div>
  <div class="flex items-baseline gap-2">
    <span class="font-serif text-3xl font-bold text-slate-900">03</span>
    <span class="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Priority Bench</span>
  </div>
  <p class="text-xs text-slate-500 mt-2">Open cases under active statutory conciliation</p>
</div>
```

### 5.3 Verification Status Badges
- **Tier-1 Sovereign Verified:** Green fill (`#f0fdf4`), green border (`#bbf7d0`), text `#166534`, with checkmark shield icon.
- **Tier-2 Community Attested:** Blue fill (`#eff6ff`), blue border (`#bfdbfe`), text `#1d4ed8`, with peer handshake icon.
- **Quarantined / Sybil Ring:** Red fill (`#fef2f2`), red border (`#fecaca`), text `#991b1b`, with warning lock icon.

### 5.4 Forensic Document & Evidence Inspector
- Side-by-side comparison cards with high-contrast metadata tables.
- OCR confidence score pill (e.g., `100% OCR Confidence`).
- Cryptographic hash anchor block with copy-to-clipboard trigger.
- Explicit human-in-the-loop statutory notice card before any signing button.

---

## 6. Implementation Reference (Tailwind CSS)

```javascript
// tailwind.config.js snippet for Alexandria
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        alexandria: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3366cc',
          600: '#2554a8',
          900: '#0f2444',
          navy: '#1a365d',
        }
      }
    }
  }
}
```

---

## 7. Master Screen Architecture Mapping

| Screen Title | Stage / Category | Key Layout Modules |
| :--- | :--- | :--- |
| `Public Portal & Inter-NGO Coordination` | Stage 1: Public | Hero telemetry gazette, 4 platform pillars, corridor map |
| `How It Works & Trust Verification` | Stage 1: Public | 4-stage protocol guide, deterministic model, transfer audit trail |
| `Public NGO Discovery Directory` | Stage 1: Public | Faceted search, trust matrices, drawer dossier |
| `Organization Sign In & Portal Access` | Stage 1: Auth | Enclave card, DARPAN SSO, 2FA hardware token input |
| `Organization Registration & Track Selection` | Stage 2: Onboard | 3-track selector, anti-sybil notice, document checklist |
| `Government DARPAN Verification` | Stage 2: Onboard | Live API query validator, key-value match panel, SMS 2FA |
| `Document Vault & AI Risk Status` | Stage 2: Onboard | OCR vault, AI explainability matrix, 5-stage accreditation rail |
| `Surplus Inventory & Expiry Control` | Stage 3: Operations | Metric tiles, 18-day expiry watchtower, deduction audit log |
| `Publish Surplus Resource Manifest` | Stage 3: Operations | 4-step wizard, instant match preview, storage cert dropzone |
| `Emergency Requests & Shortage Directory` | Stage 4: Requisitions | Priority master ledger, multi-provider queue, SDRF channels |
| `Create Emergency Resource Request` | Stage 4: Requisitions | SLA urgency matrix, receiving bay checklist, solver forecast |
| `Operational Comms & Coordination Desk` | Stage 5: Logistics | Dual-pane signed chat, waybill token inspector, tactical macros |
| `Consignment Dispute & Weighbridge Desk` | Stage 5: Mediation | Tare variance spectrum, photographic vault, statutory bench |
| `NGO Verification Triage Desk` | Stage 6: Governance | Ingestion queue, forensic OCR panel, ECDSA sign-off |
| `AI Risk & Sybil Graph Intelligence` | Stage 6: Governance | Topology DAG matrix, ring attribution log, quarantine action |
| `Cargo & Dispatch Mediation Command` | Stage 6: Governance | Tare reconciliation bench, driver sworn statements, ruling |
| `Cryptographic Ledger & State Consensus`| Stage 6: Governance | Append-only block stream, payload JSON viewer, Merkle proofs |

---
*Documentation compiled for the ReliefNet Humanitarian Consortium. All rights reserved.*
