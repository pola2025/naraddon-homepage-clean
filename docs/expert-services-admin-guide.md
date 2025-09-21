# Expert Services Admin Guide

## Environment Variables

- `EXPERT_SERVICES_ADMIN_PASSWORD` – required password for registering, updating, or removing examiner cards through the admin tools and API routes.
- `EXPERT_SERVICES_BASE_URL` (optional) – base URL used by the seeding script; defaults to `http://localhost:3000`.

Ensure these values are available in the runtime environment (e.g. `.env.local`) before using the admin interface.

## Initial Seeding

A helper script is available to migrate the legacy `data/expertProfiles.json` data into the new MongoDB collection.

```bash
EXPERT_SERVICES_ADMIN_PASSWORD=your-password \
node scripts/seed-expert-examiners.js
```

Run the script while the Next.js dev server is running; it will call the `/api/expert-services/examiners` endpoint for each record. Existing entries may cause duplicate warnings—rerun only as needed.

## Admin Workflow

1. Open `/expert-services` and use the new “Register Examiner” button.
2. Enter the admin password to unlock the management board.
3. Use the form to create or edit examiner cards.
4. Upload images via the built-in Cloudflare R2 uploader.
5. Delete unused cards as required; the public carousel updates immediately after each save/delete.
