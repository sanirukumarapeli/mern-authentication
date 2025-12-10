# MERN Authentication

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green.svg?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-blue.svg?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg?style=for-the-badge)

A complete **MERN stack authentication system** featuring secure user registration, login, password hashing, and JWT-based protected routes.  
This project demonstrates a clean and modular structure suitable for real-world full-stack applications.

---

## 📌 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Client Usage](#client-usage)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

---

## 📖 About
This project implements a **fully functional authentication workflow** using React (frontend), Node.js + Express (backend), MongoDB (database), JWT (auth), and bcrypt (encryption).

It provides:
- Register / Login functionality  
- Token-based authentication  
- Protected routes  

Perfect for learning or extending into production‑grade apps.

---

## ✨ Features
- 🔐 User Registration  
- 🔑 User Login  
- 🔒 JWT Authentication  
- 🛡 Protected API Routes  
- 🧂 Password Hashing with bcrypt  
- ⚛ React UI for Auth Flow  
- 📁 Clean and modular folder structure  

---

## 🛠 Tech Stack
### **Frontend**
- React  
- Context API  
- Axios  

### **Backend**
- Node.js  
- Express  
- Mongoose  
- JWT  
- bcrypt  

---

## 📂 Project Structure
```
mern-authentication/
│── client/                # React Frontend
│   ├── src/
│   └── package.json
│
│── server/                # Node.js Backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── README.md
└── package.json
```

---

## 🚀 Getting Started

### 🔧 Prerequisites
Install:
- Node.js  
- npm / yarn  
- MongoDB Atlas or local MongoDB  

---

## 📥 Installation
### 1. Clone the repo
```bash
git clone https://github.com/sanirukumarapeli/mern-authentication.git
cd mern-authentication
```

---

## ⚙️ Environment Variables
Create a `.env` in **server**:

```
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

Create a `.env` in **client** (if needed):

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Run the App

### Start Backend
```bash
cd server
npm install
npm run dev
```

### Start Frontend
```bash
cd client
npm install
npm start
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000  

---

## 📡 API Reference

### **Register**
```
POST /api/auth/register
```
**Body**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### **Login**
```
POST /api/auth/login
```
**Body**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **Protected Route**
```
GET /api/auth/profile
Authorization: Bearer TOKEN
```

---

## 🖥 Client Usage
- Register new users  
- Login  
- Token stored (localStorage or cookies)  
- Protected pages blocked unless authenticated  

---

## 🔐 Security Notes
- Never expose secrets publicly  
- Use HTTPS in production  
- Consider httpOnly Secure cookies instead of localStorage  

---

## 🚧 Future Improvements
- Email verification  
- Forgot password  
- Admin roles  
- Refresh tokens  
- Full dashboard UI  

---

## 📄 License
**MIT License**

---

## 👤 Author
**Saniru Kumar Apeli**  
GitHub: https://github.com/sanirukumarapeli
