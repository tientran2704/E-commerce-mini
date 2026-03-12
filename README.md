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
- Manage users

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
│   ├── models/
│   │   └── index.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── aiRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   ├── CartItem.js
│   │   │   ├── Chatbot.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── AdminRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── ProductDetail.js
│   │   │   ├── Cart.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── Orders.js
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.js
│   │   │       ├── ManageProducts.js
│   │   │       ├── ManageOrders.js
│   │   │       └── ManageUsers.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
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

1. Open MySQL Workbench or use command line
2. Create a new database:
```sql
CREATE DATABASE ai_ecommerce;
```

3. Import the schema:
```bash
mysql -u root -p ai_ecommerce < database/schema.sql
```

Or copy the SQL from `database/schema.sql` and execute in MySQL Workbench.

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

## Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai_ecommerce
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key
```

---

## Sample API Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Suggest a laptop under $1000"}'
```

---

## AI Features Details

### AI Chatbot
The chatbot uses OpenAI's GPT model to answer product-related questions. It can:
- Suggest products based on budget and requirements
- Compare products
- Answer product-related questions
- Help with purchase decisions

### AI Recommendations
The recommendation system analyzes:
- User's viewing history
- Product categories
- Price ranges
- Similar products

---

## License

MIT License

---

## Author

Your Name - Full Stack Developer
