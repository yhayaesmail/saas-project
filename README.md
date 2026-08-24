<div align="center">

# Subscription-Based SaaS Backend API

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Joi](https://img.shields.io/badge/Validation-Joi-8A2BE2)

[Live Demo](https://saas-project-sand.vercel.app/)

</div>

---

This is the third task of my internship at Sqrock IT. The goal was to build a subscription-based SaaS backend where users can register, subscribe to plans, upgrade or downgrade, and access routes based on their plan.

Built with **Node.js, Express, MongoDB (Mongoose) and JWT authentication** — same stack and structure as my first internship project (the Banking System API).

## Features

- User registration / login with JWT authentication
- Password hashing with bcrypt
- Three seeded plans: Free, Basic, Premium (name, price, features)
- Subscribe, upgrade, downgrade, cancel subscription
- View current subscription with days remaining
- Plan-based access control middleware:
  - Free users → limited dashboard
  - Basic users → full standard access
  - Premium users → premium content routes
- Admin role: create/update plans, view all users and subscriptions
- Plans auto-seeded on server start

## Live Demo

The API is deployed and running here:

**https://saas-project-sand.vercel.app/**

## How Access Control Works

Each route is guarded by middleware:

| Route | Requirement |
|---|---|
| `/profile` | Authenticated |
| `/dashboard` | Authenticated (free users see limited version + upgrade prompt) |
| `/premium-content` | Premium tier required |

Plans have a `tier` field (`free < basic < premium`). The `requireMinTier` middleware compares the user's active plan tier against the route requirement. Subscriptions also expire automatically when `end_date` passes.

## Tech Stack

Node.js, Express, MongoDB (Mongoose), Joi, JWT, bcryptjs, Docker

## Getting Started

### With Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

### Without Docker

Requires a running MongoDB instance.

```bash
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5001`.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | development / production | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/saas_subscription?replicaSet=rs0` |
| `JWT_SECRET` | Secret used to sign tokens | — |
| `JWT_EXPIRES_IN` | Token lifetime | `1d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` |

## API Overview

All routes are prefixed with `/api`. Protected routes need header:
`Authorization: Bearer <token>`

The first user to sign up becomes the **admin**; everyone after is a customer.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/signup` | Public | Register (first user becomes admin) |
| POST | `/login` | Public | Login, returns JWT |

### Plans & Subscriptions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/plans` | Public | List all plans with prices and features |
| POST | `/subscribe` | Customer | Subscribe to a plan (`"plan": "basic"` or plan id) |
| PUT | `/upgrade-plan` | Customer | Move to a higher-tier plan |
| PUT | `/downgrade-plan` | Customer | Move to a lower-tier plan |
| POST | `/cancel-subscription` | Customer | Cancel the active subscription |
| GET | `/subscription/me` | Authenticated | Current subscription + days remaining |

### User

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/profile` | Authenticated | Own profile with current plan |
| GET | `/dashboard` | Authenticated | Dashboard (limited for free users) |
| GET | `/premium-content` | Premium only | Exclusive premium content |

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/admin/users` | Admin | All users with their plans |
| GET | `/admin/subscriptions` | Admin | All subscriptions (filter by status) |
| POST | `/admin/plans` | Admin | Create a new plan |
| PUT | `/admin/plans/:planId` | Admin | Update a plan |
| POST | `/admin/plans/seed` | Admin | Re-seed default plans |

## Project Structure

```
src/
├── config/          # Database & environment config
├── models/          # User, Plan, Subscription
├── middleware/      # Auth, roles, tier guard, subscription check, validation, errors
├── validations/     # Joi schemas
├── services/        # Subscription logic
├── controllers/     # Request handlers
├── routes/          # API routes
├── app.js           # Express app
└── server.js        # Entry point
```
