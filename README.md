# CakeCraft Frontend

Soft Y2K-inspired custom cake shop built with React, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, Axios, and a small Node API.

## Current frontend features

- Landing page with featured cakes, occasions, promotions, and ordering flow
- 18 starting cake designs ready for transparent PNG/JPG/WebP assets
- Cake collection search, category filters, and sorting
- Cake detail pages
- Visual cake selection inside the customizer
- Multiple sizes, flavors, fillings, designs, and add-ons
- Live price calculation
- Promotion and discount calculation with minimum subtotal rules
- Promotion listing page
- Pickup capacity selection
- Order summary with discount breakdown
- Order confirmation and order history screens
- Profile page
- Login, registration, and forgot-password UI
- Persistent account registration and login with salted password hashes
- Token-authenticated profile updates, order placement, order tracking, and cancellation
- Server-side price and promotion validation
- Live pickup capacity that updates after each order
- Reusable confirmation and success modals for account, checkout, profile, cancellation, and logout actions
- Responsive mobile navigation

## Add your cake images

Place your transparent cake images in:

`src/assets/`

The filenames currently expected are:

- strawberry-cloud.png
- vanilla-dream.png
- matcha-bloom.png
- choco-velvet.png
- blueberry-milk.png
- birthday-pop.png
- lemon-cloud.png
- ube-milk.png
- red-velvet.png
- caramel-nude.png
- peach-blush.png
- cookies-cream.png
- strawberry-shortcake.png
- midnight-chocolate.png
- garden-party.png
- retro-cherry.png
- pink-heart.png
- dreamy-ribbon.png

If your files have different names, edit only the `image` and `imageFile` values in `src/data.ts`.

## Run

```bash
npm install
npm run dev
```

`npm run dev` starts the CakeCraft API on port 8000 and the Vite client together. The API persists shop data to `server/store.json`, which is intentionally ignored by Git.

For a production deployment, replace the file-backed store and in-memory sessions with a database, durable session or JWT strategy, an email provider for password resets, and payment processing.
