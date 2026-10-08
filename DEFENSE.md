# Defense day script (Oct 5–6)

Keep the app **already running and seeded** before you enter the room.

## Start (two terminals)

```bash
cd server
npm run dev

cd client
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:8000/api  
- Demo login: `aya@cakette.test` / `password123`  
- Your admin: `magtotomb@students.nu-clark.edu.ph` / `merner123!`  
- Your demo: `mernermagtoto55@gmail.com` / `merner123!`  
- Password reset: `/forgot-password` → verification code → new password (sessions cleared)

## Live demo flow (smooth path)

1. **Landing** — brand, CTA, popular cakes from MongoDB  
2. **Cakes** — search/filter via `GET /cakes/search` (Mongo processing)  
3. **Customize** — change options, show live total, apply `WELCOME10`  
4. **Pickup** — capacity bars (processing endpoint)  
5. **Place order** — log in if needed → confirmation  
6. **My Orders / Details** — status timeline  
7. **Cancel with confirmation** — then success modal  
8. **Studio dashboard** — revenue, stock, pickup utilization  
9. **Manage menu** — create/edit/delete a cake (CRUD + delete confirm)  
10. **Reviews** — rankings from `GET /reviews/stats/by-cake`

## Rubric-required demo moments

### MongoDB Atlas (required for grading)
- `server/.env` must use `mongodb+srv://.../cakette`
- Set `ALLOW_MEMORY_FALLBACK=false`
- Confirm `GET /api/health` shows `"gradingReady": true` (not `"mode": "memory"`)

### Validation error (400)
- Studio → Manage menu → Create cake with empty name / short description  
- Or leave login email blank and submit → per-field Zod errors  

### Not found (404)
- API: open `http://localhost:8000/api/cakes/this-cake-does-not-exist`  
- UI: open `http://localhost:5173/this-page-does-not-exist`  
- Or open an invalid order URL after login  

### Status codes to mention
- `201` create order / create cake  
- `400` Mongoose validation  
- `404` missing record / route  
- `409` overbooked pickup  

### Processing shown in the UI
- Cakes page → search/filter hits `GET /cakes/search`  
- Customize → live total hits `POST /orders/quote`; Apply code hits `POST /promotions/validate`  
- Admin order details → **Advance status** hits `PATCH /orders/:id/status`  

## End-to-end data flow (say this out loud)

> React (axios) → Express routes → Mongoose models → MongoDB Atlas → JSON response → UI loading/error/success states.

## Processing endpoints to name (pick 5+)

1. `POST /orders/quote` — price + promo math  
2. `GET /pickup-slots` — capacity / double-booking prevention  
3. `PATCH /orders/:id/status` — status workflow  
4. `GET /orders/stats/summary` — revenue / status distribution  
5. `GET /cakes/stats/summary` — stock / category stats  
6. `POST /promotions/validate` — promo eligibility  
7. `GET /reviews/stats/by-cake` — ranking averages  
8. `GET /dashboard/overview` — multi-collection summary  

## Individual Q&A prep

Every member should be able to explain:

- Where routes vs models live (`server/routes`, `server/models`)  
- Middleware order: logger → routes → 404 → error handler  
- Why totals are computed in render / on the server, not stored as fake state  
- Which files they personally committed  