# Pomodoro Roulette - Updated Design Guidelines

This document summarizes the new design direction for the Pomodoro Roulette interface. It is intended for designers and developers working on the UI.

## 0. Global Foundations

- **Design language**: Dark‑mode neo‑brutalist with flat backgrounds, bold grid lines and subtle shadows.
- **Color palette**:
  - `#0E1117` – nav/outer background
  - `#161B22` – card background
  - `#2D3748` – secondary background
  - `#FF5B57` – primary accent
  - `#22C55E` – success accent
  - `#38BDF8` – info accent
  - White text at 87% opacity
- **Typography**: Inter variable font (48 / 36 / 24 / 16 / 14 scale).
- **Grid**: 12 columns with 24 px gutters. Task panel spans 3 cols and wheel 9 cols on desktop, collapsing to stacked layout under 768 px.
- **Motion**: 300 ms ease‑out on hover states. Wheel spin uses 750‑1000 ms cubic‑bezier to mimic roulette inertia.
- **Design tokens**: Exposed as `color.bgCard`, `radius.md`, `shadow.lg`, etc.

## 1. Header

- Replace 🍅 with tomato timer icon.
- H1 uses 48 pt weight 600. Subtitle 16 pt at 60 % opacity.
- 32 px bottom margin followed by divider line `#202634`.

## 2. Task Manager

- Card background `#161B22`, radius 12 px, large shadow and 24 px padding.
- Header promoted to 24 pt weight 600.
- Input row uses pill shaped field and red “Add” button.
- Task list stacked in scrollable container. Delete button becomes icon.

## 3. Roulette Panel

- Wheel card mirrors task card with extra padding. Title changed to “Task Wheel”.
- Wheel diameter expands to 320‑360 px on desktop with inner shadow and pointer animation.
- “Spin the Wheel” button uses green gradient and dice icon.
- Selected task appears in glassy card below the wheel with conic gradient border.

## 4. Timer Modal

- Start Timer opens a modal with large numeric countdown and circular progress ring.

## 5. Responsiveness

- Task Manager collapses above 1024 px. Under 640 px the wheel shrinks to 240 px and buttons become full‑width.

## 6. Accessibility

- Ensure 4.5:1 contrast ratio.
- Provide ARIA labels for buttons.
- Focus ring 2 px `#38BDF8`.
- Respect prefers‑reduced‑motion for the wheel spin.

## Assets / Handoff

- Include SVGs for tomato logo, trash icon, dice icon and chevron pointer.
- Provide design tokens JSON and an animation spec sheet.

