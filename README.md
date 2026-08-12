# HYRA Mobile Accessories — Full-Stack MERN Shopping App

A complete e-commerce application for **HYRA Mobile Accessories**, built on the
MERN stack (MongoDB, Express, React, Node.js) with JWT authentication, a
mobile-accessories catalogue (covers, tempered glass, chargers, cables, power
banks, earphones, smart watches, gadgets), cart management, and end-to-end
order processing.

## Features

**Customer-facing**
- Email/password registration & login (JWT)
- Browse catalogue with category filters, search, sorting, and pagination
- Product detail pages with compatible-model info, stock status, and customer reviews
- Persistent server-side cart (add/update/remove/clear)
- Checkout with shipping address, payment method selection, and order summary
- Order history with a visual status tracker (Pending → Processing → Shipped → Delivered)
- Order cancellation (while still Pending/Processing), with automatic restock
- Profile management with saved addresses

**Admin**
- Product management (create, edit, delete, feature on homepage)
- Order management (view all orders, update status)
- Stock is automatically decremented on order and restored on cancellation

**Engineering**
- Password hashing with bcrypt, JWT-protected routes, role-based access control
- Server-side price/stock re-validation on order creation (never trusts client totals)
- Centralized error handling middleware
- Clean separation: models / controllers / routes / middleware

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Tailwind CSS, Axios, react-hot-toast |
| Backend    | Node.js, Express, Mongoose                      |
| Database   | MongoDB                                         |
| Auth       | JSON Web Tokens (JWT), bcryptjs                 |

## Design

Clean, bright, professional look built for a tech/gadget storefront:
- **Palette:** near-black navy text/buttons, white background, electric blue accent, red for sale tags
- **Type:** Space Grotesk (headings) + Inter (body)
- **Shapes:** rounded product imagery and pill-shaped buttons

## Categories

Mobile Covers · Tempered Glass · Chargers · Cables · Power Banks · Earphones · Smart Watches · Gadgets

## Project Structure

```
hyra-accessories/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, product, cart, order logic
│   ├── middleware/         # auth guard, admin guard, error handler
│   ├── models/             # User, Product, Order (Mongoose schemas)
│   ├── routes/             # /api/auth, /api/products, /api/cart, /api/orders
│   ├── seed/seedProducts.js
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/        # AuthContext, CartContext
    │   ├── components/     # Navbar, Footer, ProductCard, route guards
    │   ├── pages/           # Home, Shop, ProductDetail, Cart, Checkout,
    │   │                    # Orders, OrderDetail, Login, Register, Profile,
    │   │                    # AdminDashboard, NotFound
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local install or a free MongoDB Atlas cluster)

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your own values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hyra_mobile_accessories
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed the database with sample mobile-accessories products and an admin account:

```bash
npm run seed
```

This creates 10 sample products (cases, tempered glass, chargers, cables,
power banks, earbuds, a smart watch, and gadgets) and an admin user:
- **Email:** admin@hyra.com
- **Password:** admin1234

Start the API server:

```bash
npm run dev       # with nodemon (auto-restart)
# or
npm start
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the backend
(configured in `vite.config.js`), so no separate `.env` is required for local dev.

### 3. Try it out

1. Visit `http://localhost:5173`
2. Register a new customer account, or sign in as admin (`admin@hyra.com` / `admin1234`)
3. Browse the catalogue, add items to your cart, and check out
4. As admin, visit `/admin` to manage products and update order statuses

## API Overview

| Method | Endpoint                          | Access        | Description                  |
|--------|------------------------------------|---------------|-------------------------------|
| POST   | `/api/auth/register`              | Public        | Create account                |
| POST   | `/api/auth/login`                 | Public        | Log in                        |
| GET    | `/api/auth/profile`               | Private       | Get current user              |
| PUT    | `/api/auth/profile`               | Private       | Update profile                |
| POST   | `/api/auth/addresses`             | Private       | Add shipping address          |
| DELETE | `/api/auth/addresses/:index`      | Private       | Remove shipping address       |
| GET    | `/api/products`                   | Public        | List products (filter/sort/paginate) |
| GET    | `/api/products/:id`               | Public        | Get product by ID or slug     |
| GET    | `/api/products/categories`        | Public        | List distinct categories      |
| POST   | `/api/products`                   | Admin         | Create product                |
| PUT    | `/api/products/:id`                | Admin         | Update product                |
| DELETE | `/api/products/:id`                | Admin         | Delete product                |
| POST   | `/api/products/:id/reviews`        | Private       | Add a review                  |
| GET    | `/api/cart`                        | Private       | Get current user's cart       |
| POST   | `/api/cart`                        | Private       | Add item to cart              |
| PUT    | `/api/cart/:productId`             | Private       | Update item quantity          |
| DELETE | `/api/cart/:productId`             | Private       | Remove item                   |
| DELETE | `/api/cart`                        | Private       | Clear cart                    |
| POST   | `/api/orders`                      | Private       | Place an order                |
| GET    | `/api/orders/myorders`             | Private       | Get my orders                 |
| GET    | `/api/orders/:id`                  | Private/Admin | Get order details             |
| PUT    | `/api/orders/:id/cancel`           | Private       | Cancel my order                |
| GET    | `/api/orders`                      | Admin         | List all orders               |
| PUT    | `/api/orders/:id/status`           | Admin         | Update order status           |

## Notes for Production

- Set a strong, random `JWT_SECRET` and never commit `.env`
- Point `MONGO_URI` at a managed MongoDB (e.g. Atlas) and `CLIENT_URL` at your deployed frontend origin for CORS
- Build the frontend with `npm run build` (outputs to `frontend/dist`) and serve it via any static host or through Express
- Consider adding a real payment gateway integration (Razorpay/Stripe) in place of the current COD/Card/UPI placeholder flow
# Hyra-accessories
