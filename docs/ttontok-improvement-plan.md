# Ttontok Improvement Plan

## Summary
- Rebuild the Ttontok board so that all posts/comments come from MongoDB instead of in-memory mocks.
- Keep existing visual design language but modernize layouts (latest list, expert badges) and prepare for production data.
- Ensure experts and certified examiners are highlighted and authenticated, while ordinary members use their registered nicknames.

## Goals
1. Persist Ttontok posts and replies in MongoDB with Cloudflare R2 for media assets.
2. Replace all hard-coded seed data with realistic initial content and enforce nickname policy.
3. Upgrade UI components to emphasize expert responses and present latest posts in list format.
4. Deliver documented APIs that the Next.js front end can consume for listing, posting, and replying.

## Functional Requirements
- Members select a nickname during account creation; the nickname is stored with the account.
- Posts and replies always use the stored nickname; there is no linkage beyond the nickname string in MongoDB.
- Roles:
  - `general`: default community member.
  - `certified_examiner`: authenticated via existing examiner database.
  - `expert`: authenticated via expert services collection.
- Expert/certified replies are visually distinguished (badges, accent background, elevated card style).
- Latest Ttontok section on Business Voice landing converts from card grid to a slim list (title, category, replies, timestamp).

## Data Model (Draft)
### Collection: `ttontok_posts`
- `_id`: ObjectId.
- `title`: string (required).
- `category`: enum (`funding`, `tax`, `hr`, `marketing`, `strategy`, `etc`).
- `content`: rich text/markdown.
- `nickname`: string (snapshot at publish time).
- `memberId`: ObjectId reference to user account (for moderation; not exposed in API).
- `tags`: string[] (optional).
- `viewCount`: number (default 0).
- `likeCount`: number (default 0).
- `replyCount`: number (default 0; denormalized).
- `createdAt` / `updatedAt`: ISO date.

### Collection: `ttontok_replies`
- `_id`: ObjectId.
- `postId`: ObjectId reference.
- `content`: string.
- `nickname`: string (snapshot).
- `memberId`: ObjectId reference (optional for guests).
- `role`: enum (`general`, `certified_examiner`, `expert`).
- `isAccepted`: boolean (for marked solutions; default false).
- `createdAt` / `updatedAt`.

### Optional: `ttontok_nicknames`
- Seed table for suggested nicknames (neutral combinations) used during onboarding.

## API Endpoints (Next.js Route Handlers)
- `GET /api/business-voice/ttontok` — list posts with pagination, sorting (`latest`, `popular`), optional category filter.
- `POST /api/business-voice/ttontok` — create post. Requires session auth, validates nickname ownership.
- `GET /api/business-voice/ttontok/[id]` — fetch post detail + replies.
- `POST /api/business-voice/ttontok/[id]/replies` — create reply. Role derived from member profile (expert/examiner).
- `PATCH`/`DELETE` endpoints (admin only) for moderation.

### Validation & Security
- Use Zod schema for payloads.
- Rate limit write endpoints (e.g., 1 post per minute per account).
- Sanitize HTML/markdown and run profanity filter before persistence.
- Ensure Cloudflare R2 uploads require signed URLs.

## Front-End Tasks
1. **Data Fetching**: Replace dummy state in `src/app/business-voice/page.tsx` with SWR/`useEffect` calls to new API; handle loading and error skeletons.
2. **Latest List**: Rebuild "Latest Ttontok" as a list similar to the Q&A section (title link, reply count, timestamp, category badge).
3. **Expert Highlighting**: Add badge styles (`.badge-certified`, `.badge-expert`) and accent card backgrounds; show role label near nickname.
4. **Reply Component**: Ensure replies render role-based avatars/badges, collapsible read-more for long answers, and accepted-answer styling.
5. **Write Flow**: Wire post/reply forms to the API; add client-side validation, character counters, and friendly error messaging.
6. **Nickname Display**: Always show stored nickname; disable manual nickname edits per post.

## Back-End Tasks
1. Define Mongoose schemas (`TtontokPost`, `TtontokReply`) under `src/models`.
2. Implement API route handlers using `connectDB`; follow REST shape above.
3. Seed script (`scripts/seed-ttontok.ts`) to populate initial posts/replies with curated nicknames.
4. Update `package.json` scripts for seeding/migrating.
5. Configure indexes: `ttontok_posts` on `(createdAt desc)`, `(category, createdAt desc)`, `(viewCount desc)`; `ttontok_replies` on `(postId, createdAt)`.

## Migration Plan
1. Remove hard-coded arrays from Business Voice page.
2. Write migration script to transform existing dummy JSON into Mongo insert documents (or discard and craft realistic entries).
3. Verify Cloudflare R2 bucket contains any assets referenced in posts.
4. Deploy API changes and run seed script in staging; validate via Postman/Thunder Client.
5. Update documentation and handoff instructions for content moderators.

## QA Checklist
- Post/reply creation, edit, delete flows for all roles.
- Pagination and category filters.
- Badge display for experts/certified examiners.
- Latest list vs. full board consistency.
- Rate limiting and validation errors.
- Accessibility review: role badges have text, colors meet contrast ratios.

## Next Steps
1. Kick off schema/API implementation.
2. Prepare UI components refactor in parallel branch.
3. Populate initial real-world content with curated nicknames.
4. End-to-end testing and deployment checklist.
## Implementation Notes (2025-09-20)
- Database schemas created: `src/models/TtontokPost.ts`, `src/models/TtontokReply.ts`.
- Seed scaffolding: use `scripts/seed-ttontok.ts` with `data/ttontok-seed.json`.
- API routes delivered:
  - `GET/POST /api/business-voice/ttontok`
  - `GET /api/business-voice/ttontok/[postId]`
  - `GET/POST /api/business-voice/ttontok/[postId]/replies`
- Front-end section refactored to consume the new API (`TtontokBoard` component) with expert/certified badges and list-style latest view.
