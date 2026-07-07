<h1 align="center">🚀 Job Portal - MERN Stack Application</h1>

<p align="center">
A full-stack, production-ready <strong>Job Portal</strong> built with the <strong>MERN Stack</strong>, enabling job seekers, employers, and administrators to manage the complete hiring process through a modern and responsive web application.
</p>

<p align="center">
<strong>This project was developed as part of the Ethnus MERN Stack Internship Program to gain hands-on experience in full-stack web development using the MERN technology stack.</strong>
</p>

---

## 📋 Table of Contents

* Features
* User Roles
* Authentication
* Tech Stack
* Project Structure
* Installation
* API Endpoints
* Database Models
* License

---

# ✨ Features

## 👥 User Roles

### 💼 Job Seeker

* Create a professional profile
* Upload resume (PDF)
* Search and filter jobs
* Apply for jobs
* Save jobs
* Track application status
* View dashboard statistics

---

### 🏢 Employer

* Create company profile
* Post new jobs
* Manage job listings
* View applicants
* Accept or reject applications
* Dashboard with job statistics

---

### 🛡️ Admin

* Manage users
* Manage job postings
* Delete users and jobs
* View platform analytics

---

# 🔐 Authentication

* JWT Authentication
* Role-Based Authorization
* Password Hashing using bcryptjs
* Protected Routes

---

# 💻 Tech Stack

## Frontend

* React.js 18
* TypeScript
* React Router DOM v6
* Tailwind CSS
* Axios
* React Hot Toast
* Lucide React Icons

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Multer
* CORS

---

# 📁 Project Structure

```text
root
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── types
│   │   ├── utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   └── index.js
│
└── README.md
```

---

# ⚙️ Installation

## Prerequisites

* Node.js (v18 or later)
* MongoDB Atlas (or Local MongoDB)

---

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

### Server

```bash
cd server
npm install
```

### Client

```bash
cd client
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

JWT_SECRET=your-super-secret-jwt-key

CLIENT_URL=http://localhost:3000
```

---

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

# 📡 API Endpoints

## 🔐 Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/auth/me`       | Get current user    |
| PUT    | `/api/auth/profile`  | Update user profile |
| PUT    | `/api/auth/password` | Change password     |

---

## 💼 Jobs

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/jobs`          | Get all jobs      |
| GET    | `/api/jobs/featured` | Get featured jobs |
| GET    | `/api/jobs/:id`      | Get job by ID     |
| POST   | `/api/jobs`          | Create a new job  |
| PUT    | `/api/jobs/:id`      | Update a job      |
| DELETE | `/api/jobs/:id`      | Delete a job      |

---

## 🏢 Companies

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/companies`     | Get all companies |
| GET    | `/api/companies/:id` | Get company by ID |
| POST   | `/api/companies`     | Create company    |
| PUT    | `/api/companies`     | Update company    |

---

## 📄 Applications

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/applications/job/:jobId` | Apply for a job           |
| GET    | `/api/applications/my`         | User applications         |
| GET    | `/api/applications/employer`   | Employer applications     |
| PUT    | `/api/applications/:id/status` | Update application status |

---

## 📌 Saved Jobs

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| POST   | `/api/saved-jobs/:jobId` | Save a job       |
| DELETE | `/api/saved-jobs/:jobId` | Remove saved job |
| GET    | `/api/saved-jobs`        | Get saved jobs   |

---

## 🛡️ Admin

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/users`            | Get all users      |
| PATCH  | `/api/users/:id/status` | Update user status |
| DELETE | `/api/users/:id`        | Delete user        |

---

# 🗄️ Database Models

## 👤 User

* name
* email
* password
* role
* profileImage
* phone
* location
* bio
* skills
* education
* experience
* resume

---

## 🏢 Company

* companyName
* logo
* description
* website
* location
* industry
* companySize

---

## 💼 Job

* title
* description
* requirements
* salary
* location
* category
* jobType
* skills
* experience
* deadline

---

## 📄 Application

* applicant
* job
* resume
* coverLetter
* status

  * Pending
  * Reviewing
  * Shortlisted
  * Rejected
  * Accepted

---

## 📌 Saved Job

* user
* job

---

# 📄 License

This project is licensed under the **MIT License**.
