# P.C SDG 4 Quality Education Platform for Sierra Leone

A responsive multi-page frontend education platform built with HTML, CSS and JavaScript.

## Role dashboards
- Student: courses, progress, recent activities, tasks, badges, certificates and recommendations.
- Teacher: lesson upload, quiz creation, assignment marking, attendance and performance tracking.
- Parent: child attendance, grades, teacher feedback, notices and reports.
- Admin: full platform control for users, content, security, reports and announcements.

## Security demo
Admin and Teacher accounts use two-step verification. Demo code: `246810`.

## Deployment
Upload the folder to GitHub and enable GitHub Pages from the repository settings.

## What's new (2026 presentation upgrade)
- **Fixed navigation:** the cluttered link bar now collapses into a working **More ▾** dropdown on desktop and a clean hamburger drawer on mobile. (The dropdown was previously invisible because the menu had `overflow:hidden`; a stray CSS syntax error was also corrected.)
- **Loading screen** on every page, with a safe fallback so it never gets stuck.
- **AI National ID verification** (`verify-id.html`): enter a Sierra Leone NIN, watch the document/record/face/liveness checks run, and get a match-confidence result. New sign-ups pass through this step. Clearly labelled as a demonstration — it is not connected to NCRA systems.
- **Forgot-password flow** (`forgot-password.html`): email → 6-digit code → new password, in three stages.
- **Parent access by child code:** the Parent Portal is now gated. A learner's Student Dashboard shows a parent access code; the parent enters it to unlock the child's records. Demo access code: `SLE-2026`.
- Button ripple/glow and card hover polish retained across the site.

### Note on "real" vs "demo"
The included Flask + SQLite backend (`app.py`) does real password hashing and two-step verification when run with Python. The static (GitHub Pages) version simulates the same flows in the browser for presentation.
