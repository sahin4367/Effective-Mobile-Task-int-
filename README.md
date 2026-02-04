# User Service API {Effective Mobile Tasks}

A simple and secure RESTful API for user management built with **Node.js**, **Express**, **TypeScript**, and **TypeORM**.
This project was implemented as a technical task for a **Junior Node.js Developer** position and follows clean architecture, role-based access control, and basic security best practices.

---

## 🚀 Features

* User registration and authentication (JWT)
* Role-based authorization (`admin`, `user`)
* Get user by ID with permission control
* Get all users (admin only)
* Block user (admin or self)
* Password hashing with bcrypt
* Secure API responses (password is never returned)

---

## 🛠 Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **TypeORM**
* **PostgreSQL** (can be replaced with any SQL DB supported by TypeORM)
* **JWT** (Authentication)
* **bcrypt** (Password hashing)

---

## 📁 Project Structure

```
src/
│
├── DAL/
|   ├──config/
|      └── data-source.ts
│   └── models/
│       └── users/
│           └── user.model.ts
│
├── Core/
│   ├── API
|       └── user
|           ├──user.controller.ts
|           └──user.route.ts
│   └── Middlewares
|       ├──admin.middleware.ts
|       └──user.middleware.ts
|
|
├── routers
|   └──index.ts
└── index.ts
| --- or
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on `.env.example`.

```
PORT = 
USER_EMAIL = 
PASSWORD =    
JWT_SECRET = 

DB_HOST = 
DB_PORT = 
DB_USER = 
DB_PASSWORD = 
DB_NAME = 
```

---

## ▶️ Installation & Running

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build project
npm run build

# Run production build
npm start
```

---

## 🔐 Authentication

Authentication is handled using **JWT**.

After successful login, include the token in request headers:

```
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 📌 API Endpoints

### 1️⃣ Register User

**POST** `/users/register`

```json
{
  "fullName": "John Doe",
  "birthDate": "1999-01-01",
  "email": "john@mail.com",
  "password": "123456"
}
```

---

### 2️⃣ Login

**POST** `/users/login`

```json
{
  "email": "john@mail.com",
  "password": "123456"
}
```

**Response**

```json
{
  "token": "jwt_access_token"
}
```

---

### 3️⃣ Get All Users (Admin only)

**GET** `/users`

**Headers**

```
Authorization: Bearer <ADMIN_TOKEN>
```

---

### 4️⃣ Get User By ID

**GET** `/users/:id`

* Admin can access any user
* User can access only their own data

---

### 5️⃣ Block User

**PATCH** `/users/:id/block`

* Admin can block any user
* User can block their own account

---

## 🔒 Security Notes

* Passwords are hashed using **bcrypt**
* Password field is never returned in API responses
* JWT is used for stateless authentication
* Role-based access control is enforced via middleware

---

## 🧪 Testing

All endpoints were manually tested using **Postman**.

Test scenarios include:

* Admin vs User access
* Permission validation
* Blocked user behavior

---

## 📌 Notes

* This project avoids using NestJS as per task requirements
* The architecture is modular and easy to scale
* The codebase follows clean and readable patterns suitable for junior to mid-level backend development

---

## 👤 Author

**Şahin Quliyev**
Junior Backend Developer (Node.js)

---

## ✅ Status

✔ Task completed successfully
✔ Fully tested
✔ Ready for review
