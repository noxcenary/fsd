# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences have equal product priority for the pilot:

1. **NGO operations staff and coordinators** — publish surplus resources and services, raise shortages, review ranked matches, and coordinate transfers. They work in the field and in offices, often under time pressure during disasters.
2. **Platform administrators and verifiers** — review organization verification, AI risk flags, references, disputes, and audit records, and remain accountable for final decisions.
3. **Public visitors and donors** — evaluate NGO credibility, activity, and needs before engaging or contributing.

Supporting roles named in the specification: NGO member, NGO admin, platform admin, and an optional verifier/moderator.

## Product Purpose

ReliefNet is a trusted inter-NGO resource coordination network for publishing surplus and need, verifying organizations, matching resources and services to shortages, and recording transfers with a defensible chain of custody. Success means surplus moves to shortages faster with less duplication, every transfer is traceable, and verification and reputation remain trustworthy signals rather than popularity contests.

## Positioning

ReliefNet is not a donation website or a social network. It is a verified NGO-to-NGO coordination system that combines two distinct verification tracks (government registry and community reference), explainable matching with human choice, multi-provider fulfillment for a single request, and auditable transfer records. The combination is the position: verification, matching, coordination, and accountability in one network.

## Operating Context

- Intended operating scope: an India-wide network, with state- and district-level coordination.
- Primary workflows: registration and verification, surplus and service publishing, emergency requisitions, matching and selection, secure coordination, pickup/delivery, receipt confirmation, dispute mediation, and administrative review.
- Government context: DARPAN registration, PAN, and FCRA status are the named Indian registry signals. Government verification is not a claim of moral or financial reliability.
- Field context: coordinators, dispatchers, drivers, receiving depots, and weighbridges coordinate around physical consignments; evidence includes waybills, weights, and signed handshakes.
- Language context: operations require English plus Kannada, Hindi, Telugu, Tamil, and Bengali.
- The seeded demonstration geography is Karnataka (Bengaluru, Mysuru, Belagavi, Hubballi-Dharwad, Mangaluru, and other districts), but the product scope is India-wide.

## Capabilities and Constraints

**Confirmed capabilities**

- Public NGO discovery and transparency directory; organization profiles with public and restricted information separated.
- Two verification tracks: government registry verification (Government Verified) and community reference endorsement (Community Verified). An unverified organization cannot recursively validate another unverified organization.
- Document vault with OCR, AI-assisted risk assessment, and mandatory human review before any verification decision.
- Surplus inventory with expiry watchtower, resource and service directories, and resource manifest publishing.
- Emergency requests and shortage directory, including multi-provider fulfillment for one request.
- AI-assisted matching with factor-level explainability, configurable weighting, and human selection of providers.
- Consignment workspace, digital waybill, transfer lifecycle tracking, weighbridge dispute mediation, and operational communications.
- Administration: verification triage, AI risk and Sybil-graph review, cargo/dispatch arbitration, and a cryptographic ledger/audit stream.
- Roles and permissions for NGO members, NGO admins, platform admins, and optional verifiers/moderators.

**Constraints and current implementation gaps**

- This build is a **production pilot foundation**. Claims and data handling must be defensible.
- The running implementation is a FastAPI server with a static HTML/CSS/JavaScript SPA and an in-memory demo database. Strategy documents name Next.js, PostgreSQL, Redis, and Pinecone, but those are not the built system.
- The product owner confirms the following are authentic: organization names and descriptions, DARPAN IDs and registry status, and ledger/audit events. The current code nevertheless synthesizes DARPAN IDs and registry responses and seeds ledger blocks in memory. These must be backed by authoritative sources before any public verification or immutability claim.
- The following are simulated demo data and must never be presented as real operational records: verification tiers and trust scores, inventory, requests, transfers, disputes, AI risk outputs, Sybil clusters, and match scores.
- AI is decision support only. It must not automatically approve organizations or make final fraud, verification, or arbitration decisions.
- Verification and reputation are separate concepts. Government registration does not imply high reputation; high reputation does not imply government registration.
- Public NGO information, restricted organization information, and private user information must remain distinct.
- The operating entity, governance body, launch date, and commercial model for the India-wide pilot are undecided.
- Formal data-access agreements for DARPAN and other government registries are not evidenced in the repository.
- Future/optional, not MVP: corporate CSR integration, individual donors, government agency accounts, international NGOs, volunteer matching, logistics partners, warehouses, payment/donation processing, predictive demand, disaster-response coordination, cross-city routing, automated procurement, and public transparency dashboards.

## Brand Commitments

- Product name: **ReliefNet**.
- Required verification terminology: **Government Verified** and **Community Verified**; these categories must remain visually and verbally distinct.
- DARPAN is the named government registration reference.
- No logo, voice guide, or formal brand system has been confirmed. The incumbent Alexandria design system and institutional-scholarly voice are current implementation evidence, not yet confirmed as binding.

## Evidence on Hand

- `dataset/Non Profit Org.csv` — roughly 196 Indian NGOs with names, source links, and descriptions. The owner confirms the names and descriptions are authentic public information.
- `doc/details.md` — comprehensive product and architecture specification covering verification, matching, transfers, reputation, administration, security, and analytics.
- `README.md` — 29-screen route inventory and feature summary.
- `ui/` — 59 reference interface folders plus the Alexandria design specification; `static/pages/` and `static/partials/` contain the implemented screens.
- `images/` — system, master, primary-flow, NGO-flow, and resource-coordination diagrams.
- `app/api.py`, `app/data_loader.py`, `server.py` — current API and in-memory data behavior.
- **Absences to preserve:** no signed NGO partners, testimonials, case studies, financial disclosures, benchmarks, or evidence of production registry integrations exist in the repository. Future work must not fabricate them.

## Product Principles

1. **Verification is identity, not endorsement.** A badge states what was checked, never that an organization is morally or financially trustworthy.
2. **AI advises; humans decide.** Consequential verification, fraud, matching, and arbitration decisions remain human and logged.
3. **Coordination over feed.** The network exists to move resources and services to shortages, not to maximize social engagement.
4. **Every transfer is traceable.** Quantity, custody, condition, and confirmation are recorded from publication through receipt.
5. **Clarity under field conditions.** Interfaces must stay legible across roles, devices, and the required Indian languages.

## Accessibility & Inclusion

- The pilot must support English, Kannada, Hindi, Telugu, Tamil, and Bengali.
- No formal accessibility conformance standard or assistive-technology requirement has been confirmed; record it as an open decision before launch.
