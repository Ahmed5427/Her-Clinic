# Before / After case images

Drop the following pairs of images here to populate the Before & After section:

- `skin-before.jpg` / `skin-after.jpg`
- `lips-before.jpg` / `lips-after.jpg`
- `laser-before.jpg` / `laser-after.jpg`
- `contour-before.jpg` / `contour-after.jpg`

Recommended size: 1200×900 (4:3), under 400KB each (use WebP/JPG).
The slider gracefully falls back to a styled placeholder until images are added.

To add new cases, also extend the `cases` array in `components/BeforeAfter.tsx`
and add the matching translation keys under `gallery.cases.*` in
`messages/en.json` and `messages/ar.json`.
