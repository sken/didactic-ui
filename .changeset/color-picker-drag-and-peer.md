---
"@sken/color-picker": major
---

Hue slider and callback fixes:

- `react` is now a peer dependency (`^18 || ^19`), so apps no longer install a second React.
- `onColorSelect` is called only for colours the user picks (shade click or key, hue handle release), always with the current hex. It no longer fires on mount or when `initialRGB` changes.
- Releasing the hue handle selects that hue (keeping the chosen shade's saturation and brightness) and calls `onColorSelect`. The shade row follows the handle while dragging.
- New optional `onColorPreview(hex)`: called live while the hue handle is dragged.
- `initialRGB` also moves the hue handle and the shade row, and is compared by value (a new object with the same r/g/b does not reset the picker).
- The hue handle works with touch and pen (pointer events) and with the keyboard (arrow keys, Home, End).
- The shade row has equal cells across the full 840 px, so it lines up with the hue bar.

Breaking: components are named exports only (`import { ColorPicker } from "@sken/color-picker"`), a change already on `main` since the 2.1.0 release.
