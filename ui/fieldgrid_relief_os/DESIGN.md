---
name: FieldGrid Relief OS
colors:
  surface: '#f8faf8'
  surface-dim: '#d8dad9'
  surface-bright: '#f8faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#eceeec'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#414844'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#eff1ef'
  outline: '#717974'
  outline-variant: '#c1c8c3'
  surface-tint: '#3e6656'
  primary: '#002318'
  on-primary: '#ffffff'
  primary-container: '#0f392b'
  on-primary-container: '#7aa391'
  inverse-primary: '#a5d0bc'
  secondary: '#376757'
  on-secondary: '#ffffff'
  secondary-container: '#baeed9'
  on-secondary-container: '#3d6d5d'
  tertiary: '#002215'
  on-tertiary: '#ffffff'
  tertiary-container: '#003a25'
  on-tertiary-container: '#00af79'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c0ecd7'
  primary-fixed-dim: '#a5d0bc'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#264e3f'
  secondary-fixed: '#baeed9'
  secondary-fixed-dim: '#9ed1bd'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#1d4f40'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for crisis response coordinators, logistics field officers, and institutional aid partners working under high-stress, decision-critical conditions. The brand aesthetic merges institutional authority with rapid field utility: it is sober, unshakeable, and surgically clear.

The design movement combines **Corporate Modern** with **Technical Utilitarianism**. Rather than relying on emotional or decorative flourishes, the interface establishes trust through dense, highly structured data layouts, razor-sharp dividers, and unequivocal status communication. Visual noise is aggressively eliminated to preserve cognitive bandwidth during disaster response operations.

## Colors

The palette balances authoritative field greens with an ergonomic neutral surface to reduce eye fatigue across extended monitoring shifts.

### Palette Hierarchy & Tokens
- **Primary Brand (`#0f392b`)**: Primary navigational rails, header bars, and dominant action controls.
- **Secondary Deep Forest (`#1b4d3e`)**: Interactive hover states, secondary header surfaces, and highlighted structural frames.
- **Emerald Accent (`#10b981`)**: Positive balance indicators, operational ready-states, and high-priority action triggers.
- **Surface & Canvas (`#f8f9fa` base, `#f4f6f4` sub-canvas)**: Warm off-white surfaces engineered to prevent harsh screen glare in outdoor field environments.
- **Corporate Slate Grays**:
  - Ink Primary: `#0f172a` (High legibility body text)
  - Slate Dark: `#334155` (Data labels, secondary text)
  - Slate Muted: `#64748b` (Tertiary captions, placeholder text)
  - Slate Border: `#cbd5e1` (Structural card borders, grid dividers)
  - Surface Subdued: `#e2e8f0` (Disabled fills, table header fills)

### Semantic & Verification System
Badges and operational tags are strictly codified to prevent misinterpretation:
- **Government-Verified**: `#065f46` text on `#d1fae5` background with `#10b981` border.
- **Community-Verified**: `#1e40af` text on `#dbeafe` background with `#3b82f6` border.
- **Urgency - High (Warning)**: `#92400e` text on `#fef3c7` background with `#f59e0b` border.
- **Urgency - Critical (Emergency)**: `#991b1b` text on `#fee2e2` background with `#ef4444` border.
- **Transaction Active / In-Transit**: `#075985` text on `#e0f2fe` background with `#0284c7` border.

## Typography

The type system leverages **Plus Jakarta Sans** for clear, legible headings and **Inter** for dense, tabular body copy and micro-metrics. 

### Rules
- All numeric tables and quantitative stock indicators must activate `font-variant-numeric: tabular-nums` to maintain strict vertical scanning alignment.
- Metric highlights must utilize `label-md` or `label-sm` with upper tracking (`letter-spacing: 0.02em`) to cleanly separate metadata keys from dynamic data values.
- Headings must avoid oversized proportions; screen real estate is reserved for data-dense dashboards and geospatial mapping modules.

## Layout & Spacing

The layout operates on a compact, responsive 12-column grid prioritizing density without clutter.

### Breakpoints & Layout Adapters
- **Mobile (< 768px)**: 4-column layout with `margin: 1rem` and `gutter: 1rem`. Side navigation collapses into a bottom taskbar; data tables collapse into key-value cards.
- **Tablet (768px - 1024px)**: 8-column layout with `margin: 1.5rem` and `gutter: 1rem`. Left-hand action panel minimizes into an icon sidebar (64px width).
- **Desktop (> 1024px)**: 12-column layout with `margin: 2rem` and `gutter: 1.5rem`. Max canvas constraint capped at 1600px to maintain immediate peripheral scan times across widescreen consoles.

Vertical cadence follows a tight 4px baseline sub-rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 12px, `space-lg` = 16px, `space-xl` = 24px) providing sufficient density for logistics inventories and manifest logs.

## Elevation & Depth

Visual hierarchy is maintained primarily through **low-contrast outlines** and **tonal surface stepping** rather than heavy blurred drop shadows. This preserves clarity under outdoor, high-glare tablet operations.

### Elevation Hierarchy
- **Level 0 (Base Canvas)**: `#f4f6f4` default background. Flat.
- **Level 1 (Surface Cards & Grids)**: `#ffffff` background with a crisp border of `1px solid #cbd5e1`. Zero drop shadow.
- **Level 2 (Dropdowns, Popovers & Filter Flyouts)**: `#ffffff` surface, border `1px solid #94a3b8`, accompanied by an ambient structural shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals & Emergency Drawers)**: `#ffffff` elevated container with an ambient overlay: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`. Backing scrim: `#0f172a` tinted to 40% opacity.

## Shapes

The design system maintains a **Soft (`1`)** shape language (`4px` base radius, `8px` container radius) to balance modern interface standards with corporate order.

- **Base Radius (`0.25rem` / `4px`)**: Applied to small interactive targets, inputs, verification chips, status tags, and inline controls.
- **Container Radius (`0.5rem` / `8px`)**: Applied to cards, table envelopes, modal panels, and filter toolbars.
- **Circular (`9999px`)**: Exclusively reserved for status avatar indicators, pinpoints on map overlays, and counter pips.

## Components

### Buttons
- **Primary**: Deep Forest Green (`#0f392b`) fill, `#ffffff` text, 4px border radius. Hover: `#1b4d3e`. Height: 36px (compact data entry) or 40px (prominent CTA).
- **Secondary**: `#ffffff` fill, `1px solid #cbd5e1` outline, `#334155` text. Hover: `#f8f9fa` with `#94a3b8` border.
- **Critical Action**: `#dc2626` fill, `#ffffff` text. Used exclusively for destructive or emergency dispatches.
- **Focus Rings**: `2px solid #10b981` with `2px` offset on all keyboard-focused states.

### Status Chips & Badges
- Minimum height: 20px, internal padding: 2px 8px, font size: `11px`, font weight: `600`, border radius: 4px.
- Built using explicit three-point tokens: Background fill (light tint), Border outline (1px solid), and Label text (dark shade) to ensure AAA accessible contrast.

### Filter & Search Bars
- Unified toolbar shell (`#ffffff`, border `1px solid #cbd5e1`, 8px radius) grouping live text input, multi-select criteria chips, clear triggers, and record counters.
- Inputs do not utilize bottom-only border lines; full rectangular containment ensures immediate tap target recognition.

### Tables & Data Grids
- **Header Row**: `#f1f5f9` surface fill, `#334155` uppercase `11px` text, `1px solid #cbd5e1` bottom border.
- **Row Height**: Compact default (40px) with `space-sm` vertical cell padding. Alternating row fills are prohibited; segregation is maintained via `1px solid #e2e8f0` dividers.
- **Hover State**: Entire row transitions to `#f8fafc` on pointer hover, revealing quick-action icons (dispatch, view audit log, verify).

### Modal & Dialog Interaction Patterns
- Modals are strictly utilitarian: standard width (560px), header bar featuring distinct category label and bold item title, scrollable middle context, and a pinned footer containing secondary dismiss and primary affirmative actions.
- Any critical state alteration requires a dual-confirmation toggle or typed verification pattern.