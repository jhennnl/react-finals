# CakeCraft Frontend

Soft Y2K-inspired custom cake planning and ordering frontend built with React, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, and Axios.

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
- LocalStorage demo account state until the Express authentication API is connected
- React Hook Form + Zod validation
- Central Axios instance for the future Express API
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

## Next backend connection

The frontend is intentionally using local sample data while the UI is being completed. The next phase can connect the same pages to the Express REST API and MongoDB collections for cakes, customers, orders, production slots, promotions, and users.
