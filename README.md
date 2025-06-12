# 🛒 ShoppyGlobe Backend

This is the backend for the **ShoppyGlobe** e-commerce application, built using **Node.js**, **Express**, and **MongoDB**. It supports product listing, cart management, user login/registration with JWT authentication, and API integration with MongoDB.

All the screenshots are in folder
---

## 📁 Features

### ✅ Product APIs
- `GET /products` - Get all products
- `GET /products/:id` - Get a single product by ID

### 🛒 Cart APIs (JWT protected)
- `POST /cart` - Add product to cart
- `PUT /cart/:id` - Update quantity in cart by cart item ID
- `DELETE /cart/product/:productId` - Remove product from cart using **productId**

### 🔐 Authentication APIs
- `POST /register` - Register a new user and return a JWT token
- `POST /login` - Login a user and return a JWT token

---

## 💽 MongoDB Collections

### `Product`
- `name` (String)
- `price` (Number)
- `description` (String)
- `stock` (Number)

### `Cart`
- `productId` (ObjectId, ref: `Product`)
- `quantity` (Number, default: 1)

---

## 🔒 Authentication

- JWT tokens are used to protect sensitive routes (cart APIs).
- Tokens expire in **15 minutes**.
- Token must be sent in the `Authorization` header like:  
