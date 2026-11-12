<div align="center">

# ⚙️ FixItNow: Backend API

**REST API for the FixItNow Home Service Marketplace**

Authentication, role-based access, services, bookings, reviews and Stripe payments.

[![Live Frontend](https://img.shields.io/badge/Live-Frontend-0EA5E9?style=for-the-badge&logo=vercel&logoColor=white)](https://front-end-ruddy-theta.vercel.app)
[![Frontend Repo](https://img.shields.io/badge/Frontend-Repo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rakibulislam161363/HomeServiceFront)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)

</div>

---

## 📖 About

This is the backend of **FixItNow**, a home service marketplace where customers book services, technicians manage their work, and admins monitor the platform. It serves the [FixItNow frontend](https://github.com/rakibulislam161363/HomeServiceFront).

## ✨ Features

- 🔐 **Authentication:** register, login, refresh tokens (JWT, bcrypt password hashing)
- 🛡️ **Three roles:** `CUSTOMER`, `TECHNICIAN`, `ADMIN`, enforced by an auth middleware
- 🔧 **Technician profiles** and **services** (create, update, delete)
- 🗂️ **Categories** for organizing services
- 📅 **Bookings** with a status flow: `REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED` (also `DECLINED`, `CANCELLED`)
- 💳 **Stripe Checkout payments** with a webhook that confirms payments
- ⭐ **Reviews** from customers, with a technician view of their own reviews
- 👥 **User management** for admins (stats, update, change status, delete)

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Runtime & framework | Node.js, Express |
| Language | TypeScript |
| Database & ORM | PostgreSQL, Prisma (with the `pg` adapter) |
| Auth | JWT, bcrypt, cookie-parser |
| Payments | Stripe |
| Build | tsup |

## 📁 Project Structure

```
src/
├── app.ts / server.ts     # Express app and server entry point
├── config/                # Environment configuration
├── lib/                   # Prisma and Stripe clients
├── middleware/            # Role-based auth, error handlers, not-found
├── modules/
│   ├── auth/  user/  technician/  categories/
│   ├── service/  booking/  payment/  review/
└── utils/                 # JWT, catchAsync, sendResponse
prisma/schema/             # Split Prisma schema (user, service, booking, payment, review, ...)
```

Each module follows `route → controller → service`.

## 🔌 API Endpoints

Base path: `/api`

| Module | Method & Route | Access |
| --- | --- | --- |
| **Auth** | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh-token` | Public |
| | `GET /auth/me` | Any logged-in role |
| **Users** | `GET /users/stats`, `PATCH /users/:id`, `PATCH /users/:id/status`, `DELETE /users/:id` | Admin |
| | `GET /users`, `GET /users/:id` | See route file |
| **Technicians** | `GET /technicians`, `GET /technicians/:id` | Public |
| | `GET`, `POST`, `PATCH /technicians/profile` | Technician |
| **Categories** | `POST /categories` | Admin, Technician |
| | `PATCH /categories/:id` | Admin |
| **Services** | `GET /services`, `GET /services/:id` | Public |
| | `POST /services`, `PATCH /services/:id`, `DELETE /services/:id` | Technician |
| **Bookings** | `POST /booking`, `DELETE /booking/:id` | Customer |
| | `GET /booking`, `GET /booking/:id` | Customer, Technician, Admin |
| | `PATCH /booking/:id` | Customer, Technician |
| **Payments** | `POST /payment/create`, `GET /payment`, `GET /payment/:id` | Customer |
| | `POST /payment/confirm` | Stripe webhook |
| **Reviews** | `POST /review`, `PATCH /review/:id`, `DELETE /review/:id`, `GET /review/booking/:bookingId` | Customer |
| | `GET /review/my-reviews` | Technician |
| | `GET /review`, `GET /review/:id` | Public |

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- A PostgreSQL database
- A Stripe account (test mode is enough) and the [Stripe CLI](https://stripe.com/docs/stripe-cli) for webhooks

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rakibulislam161363/HomeServicePlatform.git
cd HomeServicePlatform

# 2. Install dependencies
npm install

# 3. Create your environment file and fill in the values
cp .env.example .env

# 4. Generate the Prisma client and apply migrations
npx prisma generate
npx prisma migrate deploy

# 5. Start the development server
npm run dev
```

The API runs on `http://localhost:5000` (or the `PORT` you set).

### Stripe webhook (local)

In a second terminal:

```bash
npm run stripe:webhook
```

Copy the webhook signing secret it prints into `STRIPE_WEBHOOK_SECRET`.

### Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on |
| `APP_URL` | Frontend URL, used for CORS (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SCRETE` | Access-token secret (the name is spelled this way in the code) |
| `JWT_EXPIRATION` | Access-token lifetime |
| `JWT_REFRESH_SECRET` | Refresh-token secret |
| `JWT_REFRESH_EXPIRATION` | Refresh-token lifetime |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRODUCT_PRICE_ID` | Stripe price ID used for checkout |

> ⚠️ The frontend verifies tokens too, so `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in the frontend must match these secrets.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with auto-reload |
| `npm run build` | Build with tsup |
| `npm start` | Run the production build |
| `npm run stripe:webhook` | Forward Stripe webhooks to the local server |

## 🌍 Deployment

Deployed on Vercel. Add all environment variables in the hosting dashboard and set `APP_URL` to your deployed frontend URL so CORS works.

## 👨‍💻 Author

**Rakibul Islam**: Full Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/rakibulislam161363)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rakibulislam16/)
[![Portfolio](https://img.shields.io/badge/Portfolio-0EA5E9?style=flat-square&logo=googlechrome&logoColor=white)](https://rakibulislam161363.vercel.app)
