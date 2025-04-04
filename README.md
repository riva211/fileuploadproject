# 📁 File Management Dashboard

A full-stack file management dashboard built using **React, Node.js, Express, and MongoDB**. The app provides user authentication, file uploads, and insightful dashboard statistics.

---

## 🚀 Features
- User Authentication (Signup, Login, JWT-based Auth)
- File Upload & Management
- Dashboard with File Statistics (Total Files, File Type Breakdown)
- Secure API using Express & MongoDB
- Responsive UI with Bootstrap

---

## 🛠️ Tech Stack
- **Frontend**: React, React Router, Bootstrap
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Database**: MongoDB (local or cloud via MongoDB Atlas)

---

## 🏗️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/riva211/fileuploadproject.git
cd fileuploadproject
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install  # Install backend dependencies
```



### 3️⃣ Frontend Setup
Open a new terminal window and run:
```bash
cd frontend
npm install  # Install frontend dependencies
```

---

## 🚦 Running the Project

### Start the Backend Server
```bash
npm run start
```

### Start the Frontend React App
In another terminal:
```bash
npm run start
```

This will launch the app in your default browser at `http://localhost:3000` (Frontend) and `http://localhost:5000` (Backend API).

---

## 🐞 Troubleshooting
- Ensure MongoDB is running locally or provide a valid connection string in `.env`.
- If encountering CORS errors, install & configure `cors` in the backend:
  ```bash
  npm install cors
  ```
  Add this in `server.js`:
  ```javascript
  const cors = require('cors');
  app.use(cors());
  ```

---



---

## 📜 Creator
This project is created by Riva Makhani

