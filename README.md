# 🎁 Jewelry Store - MERN Stack

A full-stack MERN application for an online jewelry store with user authentication, product catalog, shopping cart, and admin management.

## 🌐 Live Demo

- **Frontend**: https://jwelstore-bydk.vercel.app
- **Backend**: https://jwelstore-backend.vercel.app

---

## 🛠️ Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- React Hot Toast
- Context API

### Backend

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Nodemailer (Gmail)
- Bcryptjs

### Deployment

- Vercel (Frontend + Backend)
- MongoDB Atlas (Database)

---

## ✨ Features

### User

- Sign up / Login
- Browse jewelry by category (Bracelets, Pendants, Rings, Earrings, Necklaces)
- Add items to cart with quantity control
- Place orders with Cash on Delivery
- View order history with real-time status
- Receive email notification when order is ready for pickup

### Admin

- Secure admin login
- Add / Edit / Delete jewelry products
- View all orders
- Update order status (Pending → Preparing → Completed → Delivered)
- Email automatically sent when status is set to Completed

---

## 📁 Project Structure

```
GProject/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── seedAdmin.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── landingPage/
│   │   │       ├── Navbar.jsx
│   │   │       └── Navbar.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── utils/
│   │   │   └── apiClient.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── vercel.json
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js v14+
- MongoDB (local or Atlas)
- Git

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder (copy from `.env.example`):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_USER=your_jwt_secret_user
JWT_SECRET_ADMIN=your_jwt_secret_admin
PORT=5000
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### Create Default Admin

```bash
cd backend
npm run seed
```

Default admin credentials:

- Email: `admin@jewelstore.com`
- Password: `admin123`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend folder (copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📚 API Endpoints

### Auth

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/auth/user/signup` | Register user     |
| POST   | `/api/auth/user/login`  | Login user        |
| POST   | `/api/auth/admin/login` | Login admin       |
| GET    | `/api/auth/user/me`     | Get user profile  |
| GET    | `/api/auth/admin/me`    | Get admin profile |

### Products

| Method | Endpoint                           | Description            |
| ------ | ---------------------------------- | ---------------------- |
| GET    | `/api/products`                    | Get all products       |
| GET    | `/api/products?category=Bracelets` | Filter by category     |
| GET    | `/api/products/:id`                | Get single product     |
| POST   | `/api/products`                    | Create product (Admin) |
| PUT    | `/api/products/:id`                | Update product (Admin) |
| DELETE | `/api/products/:id`                | Delete product (Admin) |

### Orders

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| POST   | `/api/orders`            | Place order (User)          |
| GET    | `/api/orders/user`       | Get user orders             |
| GET    | `/api/orders/admin/all`  | Get all orders (Admin)      |
| PUT    | `/api/orders/:id/status` | Update order status (Admin) |
| DELETE | `/api/orders/:id`        | Cancel order (User)         |

---

## 📧 Email Setup

When admin marks an order as **Completed**, the user automatically receives an email with order summary.

### Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → Enable
3. Security → App Passwords → Create
4. Use the 16-digit password as `EMAIL_PASS`

---

## 🌍 Deployment on Vercel

### Backend Deployment

1. Push code to GitHub
2. Import repo on Vercel → set Root Directory to `backend`
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET_USER`
   - `JWT_SECRET_ADMIN`
   - `NODE_ENV=production`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL=https://your-frontend.vercel.app`

### Frontend Deployment

1. Import repo on Vercel → set Root Directory to `frontend`
2. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend.vercel.app/api`

---

## 👤 Default Admin

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@jewelstore.com` |
| Password | `admin123`             |

⚠️ **Change the password after first login in production!**

---

## 📝 Next Steps

1. ✅ Backend structure created
2. ✅ Frontend folder structure ready
3. ⬜ Create pages and components
4. ⬜ Connect frontend to backend API
5. ⬜ Deploy to Vercel

---

## 📄 License

MIT License © 2024 Digambar Khekade
