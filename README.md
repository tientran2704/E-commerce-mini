AI-Powered E-commerce Platform
==============================

A modern e-commerce website with AI chatbot and product recommendations, built with React, Node.js, Express, and MySQL.

## Tech Stack

### Frontend
- React 18
- TailwindCSS
- Axios
- React Router DOM v6

### Backend
- Node.js
- Express.js
- MySQL
- OpenAI API

---

## Features

### User Features
- User registration and login
- Browse products with category filtering
- Product search
- Product detail view
- Add to cart
- Place orders
- View order history

### Admin Features
- Admin login
- Add/Edit/Delete products
- View all orders

### AI Features
- **AI Chatbot**: Ask product-related questions using OpenAI
- **AI Product Recommendations**: Get personalized product suggestions based on viewing history and preferences

---

## Project Structure

```
ai-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── aiRoutes.js
│   ├── scripts/
│   │   └── init-db.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── database/
    └── schema.sql
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

### Step 1: Database Setup

```bash
cd backend
npm run init-db
```

Or manually in MySQL Workbench:
```sql
CREATE DATABASE ai_ecommerce;
USE ai_ecommerce;
-- Then import database/schema.sql
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this
OPENAI_API_KEY=your_openai_api_key
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

### Step 4: Run the Project

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will run at: `http://localhost:5173`
The backend API runs at: `http://localhost:5000`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| GET | /api/products/search | Search products |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create new order |
| GET | /api/orders/user/:userId | Get user orders |
| GET | /api/orders | Get all orders (admin) |
| PUT | /api/orders/:id | Update order status (admin) |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ai/chat | AI Chatbot |
| POST | /api/ai/recommend | Product recommendations |

---

## Default Admin Account

After running the application, create an admin user via:
1. Register a new account
2. Manually update the `is_admin` field in MySQL:
```sql
UPDATE users SET is_admin = 1 WHERE email = 'your_email@example.com';
```

---

## License

MIT License

---

## Author

Your Name - Full Stack Developer

Password admin
email = admin@example.com mật khẩu = Admin@123
node scripts/create-admin.js admin@example.com Admin@123 "Admin User"