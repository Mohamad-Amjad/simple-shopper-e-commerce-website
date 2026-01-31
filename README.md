# 🛍️ Shopper — Full Stack E-Commerce Website

**Shopper** is a full-stack e-commerce web application built with **React**, **Node.js**, **Express**, and **MongoDB Atlas**.  
It includes a customer-facing shopping website, an admin dashboard to manage products, and a backend REST API deployed on Vercel.

---

## ✨ Key Features

### 🛒 Customer Website
- Browse products by category (**Men / Women / Kids**)
- Product listing & product detail pages
- Add to cart / remove from cart
- Cart management
- Responsive UI

### 🧑‍💼 Admin Dashboard
- Add new products
- Upload product images
- View all products
- Delete products

### ⚙️ Backend API
- REST API using Express
- MongoDB Atlas integration
- JWT-based authentication (Signup/Login)
- Cart APIs (Add/Remove/Get cart)
- Product APIs (Add/Delete/List)
- Handles Vercel deployment constraints (serverless)

---

## 🧰 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React, CSS |
| Admin Panel | vite React, CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JSON Web Token (JWT) |
| Image Upload | Multer |

---

## 📁 Project Structure
simple-shopper-e-commerce-website/
│
├── frontend/ # Customer website (React)
├── admin/ # Admin dashboard (Vite + React)
└── backend/ # Express API (MongoDB Atlas)

## Frontend
cd frontend
npm install
npm start

## backend
cd backend
npm install
npx nodemon

## admin
cd admin
npm install
npm run dev



