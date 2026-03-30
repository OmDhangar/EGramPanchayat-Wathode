<div align="center">

# 🌿 EGramPanchayat – Wathode
### ई-ग्रामपंचायत वाठोडे
**A Full-Stack Digital Governance Platform for Village Administration**

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-S3%20%2B%20CloudFront-FF9900?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-enabled-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

<br/>

🔗 **Live:** [grampanchayatwathode.com](https://grampanchayatwathode.com/)  
Deployed on **AWS S3 + CloudFront + Route 53**

</div>

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Environment Configuration](#environment-configuration)
7. [Local Development Setup](#local-development-setup)
8. [Docker Setup](#docker-setup)
9. [API Reference](#api-reference)
10. [Database Models](#database-models)
11. [Frontend Pages & Routes](#frontend-pages--routes)
12. [Authentication Flow](#authentication-flow)
13. [File Management System (AWS S3)](#file-management-system-aws-s3)
14. [Email Notification System](#email-notification-system)
15. [Internationalization (i18n)](#internationalization-i18n)
16. [Admin Dashboard Guide](#admin-dashboard-guide)
17. [Citizen User Guide](#citizen-user-guide)
18. [Deployment](#deployment)
19. [Contributing](#contributing)

---

## Project Overview

**EGramPanchayat – Wathode** is a comprehensive, production-grade digital platform designed to digitize and modernize public service delivery for **Wathode Gram Panchayat** (Tal. Shirpur, Dist. Dhule, Maharashtra, India).

The platform eliminates paper-based processes by enabling citizens to:
- Apply for government certificates online
- Track application status in real time
- Download approved certificates securely
- Pay house taxes and view tax records
- Stay informed about government schemes, notices, and local news

Administrators (Gram Panchayat staff) get a full-featured dashboard to review, approve/reject applications, upload digitally signed certificates, manage citizens, and publish information.

The system supports **English and Marathi (मराठी)** languages and is designed with the vision of **Digital India** in mind.

---

## Key Features

### 👤 Citizen Features
| Feature | Description |
|---|---|
| **User Registration & Login** | Secure account creation with email/password and JWT authentication |
| **Birth Certificate Application** | Online form with document upload (up to 5 files) |
| **Death Certificate Application** | Online form with supporting documents |
| **Marriage Certificate Application** | Online form with age validation (Husband ≥ 21, Wife ≥ 18) |
| **Land Record 8A** | Application for land record documents |
| **No Outstanding Debts Certificate** | Apply for NOD certificate |
| **Digital Signed 7/12 Extract** | Application for digitally signed property records |
| **Certificate Download** | Securely download approved certificates via signed S3 URLs |
| **Application Tracking** | View status: Pending → Approved → Certificate Generated |
| **Notifications** | In-app and email notifications for every status change |
| **Taxation Information** | View property tax / house tax records |
| **Public Notices** | View government announcements, schemes, and notices |
| **About Village** | History, geography, and information about Vathode |
| **Panchayat Members** | View elected members and officials |
| **Departments** | Information about panchayat departments |
| **Gallery** | Photo gallery organized by year |
| **Blog / News** | Read local news and blog posts |
| **Self-Declaration Letters** | Download standard self-declaration templates |
| **Contact / Help** | Contact information and help page |
| **Bilingual Interface** | Switch between English and Marathi at any time |

### 🛡️ Admin Features
| Feature | Description |
|---|---|
| **Admin Dashboard** | Overview statistics and quick links |
| **Certificate Approvals** | Review, approve, or reject citizen applications with remarks |
| **Upload Certificates** | Upload digitally signed certificates to approved applications |
| **Form Details Viewer** | View complete application details with all uploaded documents |
| **File Management** | Securely view documents (PDF, images) via signed S3 URLs |
| **User Management** | List and manage registered citizens |
| **User Detail View** | View individual citizen applications and history |
| **Blog Management** | Create, edit, and delete news and blog posts via rich text editor |
| **Gallery Management** | Upload and manage photo gallery by year |
| **Scheme Management** | Create, edit, publish/unpublish, and delete government schemes from admin panel |
| **Scheme Thumbnail Upload** | Upload scheme thumbnail images (served from `/uploads/schemes`) |
| **Email Notifications** | Automated emails sent to citizens on every status update |

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18 | Runtime environment |
| **Express.js** | 5.x | Web framework |
| **MongoDB** | Atlas | NoSQL database |
| **Mongoose** | 8.x | ODM for MongoDB |
| **JWT (jsonwebtoken)** | 9.x | Access & Refresh token authentication |
| **bcrypt** | 6.x | Password hashing |
| **Multer** | 2.x | Multipart file upload handling |
| **AWS SDK S3** | 3.x | File storage (upload, move, signed URLs) |
| **Nodemailer** | 7.x | Email sending |
| **Mailgen** | 2.x | Beautiful email template generation |
| **Razorpay** | 2.x | Payment gateway integration |
| **express-validator** | 7.x | Input validation |
| **cookie-parser** | 1.x | HTTP-only cookie management |
| **cors** | 2.x | Cross-origin resource sharing |
| **dotenv** | 16.x | Environment variable management |
| **nodemon** | 3.x | Development hot-reloading |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Vite** | 5.x | Build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **React Router DOM** | 6.x | Client-side routing |
| **Axios** | 1.x | HTTP client for API calls |
| **Framer Motion** | 12.x | Animations and transitions |
| **i18next / react-i18next** | 25.x | Internationalization (English & Marathi) |
| **React Hot Toast** | 2.x | In-app toast notifications |
| **Lucide React** | 0.344 | Icon library |
| **React Icons** | 5.x | Additional icons |
| **Recharts** | 2.x | Dashboard charts and graphs |
| **React Quill** | 2.x | Rich text editor for blog posts |
| **LightGallery** | 2.x | Image gallery viewer |
| **React Helmet** | 6.x | SEO meta tag management |
| **Styled Components** | 6.x | CSS-in-JS styling |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| **AWS S3** | File storage (documents & certificates) |
| **AWS CloudFront** | CDN for frontend static assets |
| **AWS Route 53** | DNS management |
| **Docker** | Containerization of backend and frontend |
| **MongoDB Atlas** | Managed cloud database |

---

## Project Structure

```
EGramPanchayat-Wathode/
├── Backend/
│   ├── Dockerfile                  # Docker configuration for backend
│   ├── package.json
│   ├── .env                        # Environment variables (not committed)
│   ├── .prettierrc                 # Code formatting config
│   └── src/
│       ├── index.js                # Server entry point (port binding)
│       ├── app.js                  # Express app setup, CORS, middleware, routes
│       ├── db/
│       │   └── index.js            # MongoDB connection
│       ├── controllers/            # Business logic handlers
│       │   ├── application.controllers.js   # Certificate application logic
│       │   ├── auth.controllers.js          # Register/Login/Logout/Refresh
│       │   ├── blog.controller.js           # Blog CRUD operations
│       │   ├── gallery.controller.js        # Gallery image management
│       │   ├── scheme.controller.js         # Scheme CRUD + publish + thumbnail upload
│       │   ├── healthcheck.controllers.js   # Health check endpoint
│       │   ├── officer.controller.js        # Panchayat officer management
│       │   ├── payment.controller.js        # Razorpay payment handling
│       │   └── user.controller.js           # User management (admin)
│       ├── models/                 # Mongoose database schemas
│       │   ├── application.model.js         # Core application model
│       │   ├── user.model.js                # User schema (JWT methods)
│       │   ├── birthcertificate.model.js
│       │   ├── deathcertificate.model.js
│       │   ├── marriagecertificate.model.js
│       │   ├── bplCertificate.model.js      # BPL certificate schema
│       │   ├── niradharCertificate.model.js # Niradhar certificate schema
│       │   ├── noOutstandingDebts.model.js
│       │   ├── housingAssessment8.model.js
│       │   ├── blog.model.js
│       │   ├── scheme.model.js
│       │   ├── notification.model.js
│       │   ├── officer.model.js
│       │   ├── payment.model.js
│       │   ├── taxation.model.js
│       │   └── documentRequirement.model.js
│       ├── routes/                 # Express route definitions
│       │   ├── application.routes.js
│       │   ├── auth.routes.js
│       │   ├── blog.routes.js
│       │   ├── gallery.routes.js
│       │   ├── healthCheck.routes.js
│       │   ├── officer.routes.js
│       │   ├── payment.routes.js
│       │   ├── scheme.routes.js
│       │   └── user.routes.js
│       ├── middlewares/            # Express middleware
│       │   ├── auth.middleware.js  # verifyJWT, verifyAdmin
│       │   └── multer.middleware.js # File upload config
│       └── utils/                  # Helper utilities
│           ├── ApiError.js         # Standardized error class
│           ├── ApiResponse.js      # Standardized response class
│           ├── asyncHandler.js     # Async error wrapper
│           ├── s3Service.js        # AWS S3 upload/move/URL generation
│           ├── emailService.js     # Nodemailer + Mailgen email templates
│           ├── cloudinary.js       # Cloudinary integration (legacy/avatar)
│           └── constants.js        # Shared constants
│   ├── scripts/
│   │   └── migrate-schemes-from-frontend.js  # One-time migration: static schemes -> MongoDB
│
└── frontend/
    ├── Dockerfile                  # Multi-stage Docker build with Nginx
    ├── package.json
    ├── vite.config.ts              # Vite build configuration
    ├── tailwind.config.js          # Tailwind CSS config
    ├── tsconfig.app.json           # TypeScript configuration
    ├── vercel.json                 # Vercel SPA routing config
    ├── index.html                  # HTML entry point
    └── src/
        ├── main.tsx                # React entry point
        ├── App.tsx                 # Root component with all routes
        ├── i18n.ts                 # i18next initialization
        ├── index.css               # Global styles
        ├── Context/
        │   └── authContext.tsx     # Auth state (user, login, logout)
        ├── api/
        │   ├── axios.ts            # Configured Axios instance
        │   └── schemes.ts          # Schemes API service + asset URL resolver
        ├── types/                  # TypeScript type definitions
        ├── data/                   # Static data files
        ├── locales/
        │   ├── en/                 # English translations
        │   └── mr/                 # Marathi translations
        ├── components/             # Reusable UI components
        │   ├── Navbar.tsx
        │   ├── Footer.tsx
        │   ├── dashboard.tsx       # Admin dashboard component
        │   ├── UserDetails.tsx     # Citizen user detail view
        │   ├── FormComponents.tsx  # Shared form input components
        │   ├── NoticeBoard.tsx     # Announcement/notice board
        │   ├── AdminBlogCreate.tsx # Rich-text blog editor
        │   ├── AdminSchemeForm.tsx # Admin create/edit form for schemes
        │   ├── BlogCard.tsx
        │   ├── blogDetails.tsx
        │   ├── taxation.tsx        # Taxation table component
        │   ├── LogoutButton.tsx
        │   ├── loader.tsx          # Page loading spinner
        │   └── button.tsx
        └── pages/                  # Full page components (38 pages)
            ├── Home.tsx            # Landing page
            ├── Login.tsx / register.tsx
            ├── BirthCertificate.tsx
            ├── DeathCertificate.tsx
            ├── MarriageCertificateForm.tsx
            ├── LandRecord8A.tsx
            ├── NoOutstandingDebts.tsx
            ├── DigitalSigned712.tsx
            ├── applyforcertificates.tsx  # Certificate selection hub
            ├── CertificatesApprovals.tsx # Admin approval dashboard
            ├── FormDetails.tsx           # Admin: full application viewer
            ├── uploadCertificates.tsx    # Admin: certificate upload
            ├── userCertificates.tsx      # Citizen: my certificates
            ├── certificateDownload.tsx   # Secure certificate download
            ├── TaxationInfo.tsx
            ├── Schemes.tsx / SchemeDetails.tsx / SchemeFullDetails.tsx
            ├── Gallery.tsx / YearGallery.tsx
            ├── AdminGallery.tsx
            ├── Blogs.tsx
            ├── AboutVathode.tsx
            ├── AboutGram.tsx
            ├── Members.tsx
            ├── Department.tsx
            ├── publicinfo.tsx            # Notices board
            ├── userNotification.tsx
            ├── ManageUsers.tsx
            ├── selfdeclareletters.tsx
            ├── Media.tsx
            ├── help.tsx
            └── NotFound.tsx
```

---

## Prerequisites

Before setting up this project, ensure you have the following installed:

- **Node.js** ≥ 18.x ([Download](https://nodejs.org/))
- **npm** ≥ 9.x (comes with Node.js)
- **MongoDB** – A running MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **AWS Account** – S3 bucket configured for file storage
- **Git** ([Download](https://git-scm.com/))
- **Docker** (optional, for containerized setup) ([Download](https://www.docker.com/))

---

## Environment Configuration

### Backend `.env` File

Create a `.env` file inside the `Backend/` directory:

```env
# ── Server ───────────────────────────────────────
PORT=3000

# ── Database ─────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>

# ── JWT Secrets ───────────────────────────────────
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=7d

# ── AWS S3 ────────────────────────────────────────
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-s3-bucket-name

# ── Email (Nodemailer) ────────────────────────────
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@grampanchayatwathode.com

# ── Razorpay (Payment Gateway) ────────────────────
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# ── Cloudinary (Avatar uploads) ──────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── CORS (Frontend URL) ───────────────────────────
CORS_ORIGIN=http://localhost:5173
```

> **Important**: Never commit `.env` files to version control. The `.gitignore` already excludes them.

### Frontend Environment (Vite)

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/EGramPanchayat-Wathode.git
cd EGramPanchayat-Wathode
```

### 2. Setup the Backend

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Start the development server (with hot reload)
npm run dev
```

The backend will start at `http://localhost:8000`.

The dev script uses `nodemon` with `dotenv/config` loaded automatically:
```bash
nodemon -r dotenv/config --experimental-json-modules src/index.js
```

### 3. Setup the Frontend

Open a **new terminal** in the project root:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 4. Verify the Setup

- Open [http://localhost:5173](http://localhost:5173) in your browser
- You should see the Gram Panchayat homepage
- The health check endpoint at `http://localhost:8000/api/health` should return `200 OK`

---

## Docker Setup

Both the backend and frontend come with production-ready `Dockerfile` configurations.

### Backend Docker

```bash
cd Backend

# Build the image
docker build -t egrampanchayat-backend .

# Run the container
docker run -p 3000:3000 --env-file .env egrampanchayat-backend
```

### Frontend Docker

The frontend uses a **multi-stage build** (Node builder + Nginx server):

```bash
cd frontend

# Build the image
docker build -t egrampanchayat-frontend .

# Run the container
docker run -p 80:80 egrampanchayat-frontend
```

### Docker Compose (Recommended for Local Full Stack)

Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'
services:
  backend:
    build: ./Backend
    ports:
      - "3000:3000"
    env_file:
      - ./Backend/.env

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

```bash
docker-compose up --build
```

---

## API Reference

All API endpoints are prefixed with `/api`. The backend runs on port `8000` in local development.

### 🔐 Authentication Routes (`/api/users`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/users/register` | ❌ | Register a new citizen user |
| `POST` | `/api/users/login` | ❌ | Login and receive JWT tokens |
| `POST` | `/api/users/logout` | ✅ JWT | Logout and clear tokens |
| `POST` | `/api/users/refresh-token` | ❌ | Refresh expired access token |
| `GET`  | `/api/users/current-user` | ✅ JWT | Get current logged-in user |
| `PATCH`| `/api/users/update-account` | ✅ JWT | Update name/email |
| `PATCH`| `/api/users/update-avatar` | ✅ JWT | Update profile avatar |

### 📄 Application Routes (`/api/applications`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/applications/birth-certificate` | ✅ JWT | Submit birth certificate application |
| `POST` | `/api/applications/death-certificate` | ✅ JWT | Submit death certificate application |
| `POST` | `/api/applications/marriage-certificate` | ✅ JWT | Submit marriage certificate application |
| `GET`  | `/api/applications/user/:userId` | ✅ JWT | Get all applications for a citizen |
| `GET`  | `/api/applications/admin` | ✅ Admin | Get all applications (admin view) |
| `GET`  | `/api/applications/admin/filter?status=pending` | ✅ Admin | Filter applications by status |
| `GET`  | `/api/applications/:applicationId` | ✅ JWT | Get full application details |
| `GET`  | `/api/applications/files/urls?applicationId=xxx` | ✅ JWT | Get signed S3 URLs for certificate |
| `GET`  | `/api/applications/secure-url/:fileId` | ✅ JWT | Get signed URL for a specific file |
| `POST` | `/api/applications/admin/review/:applicationId` | ✅ Admin | Approve or reject an application |
| `POST` | `/api/applications/admin/certificate/:applicationId` | ✅ Admin | Upload generated certificate |

> **File uploads**: All application submission endpoints accept multipart form data with a `documents` field (max 5 files).

### 📝 Blog Routes (`/api/blogs`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET`  | `/api/blogs` | ❌ | Get all published blog posts |
| `GET`  | `/api/blogs/:id` | ❌ | Get single blog post |
| `POST` | `/api/blogs` | ✅ Admin | Create new blog post |
| `PUT`  | `/api/blogs/:id` | ✅ Admin | Update blog post |
| `DELETE`| `/api/blogs/:id` | ✅ Admin | Delete blog post |

### 🖼️ Gallery Routes (`/api/gallery`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET`  | `/api/gallery` | ❌ | Get all gallery images |
| `POST` | `/api/gallery` | ✅ Admin | Upload gallery images |
| `DELETE`| `/api/gallery/:id` | ✅ Admin | Delete gallery image |

### 🧾 Scheme Routes (`/api/schemes`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET`  | `/api/schemes` | ❌ | Get published schemes (supports `year`, `category`, `page`, `limit`) |
| `GET`  | `/api/schemes/:idOrSlug` | ❌ | Get single scheme by Mongo `_id` or `slug` |
| `GET`  | `/api/schemes/admin/all` | ✅ Admin | Get all schemes including unpublished |
| `POST` | `/api/schemes` | ✅ Admin | Create a scheme |
| `PUT`  | `/api/schemes/:id` | ✅ Admin | Update a scheme |
| `PATCH`| `/api/schemes/:id/publish` | ✅ Admin | Publish/unpublish scheme |
| `DELETE`| `/api/schemes/:id` | ✅ Admin | Delete a scheme |
| `POST` | `/api/schemes/upload-thumbnail` | ✅ Admin | Upload scheme thumbnail image |

### 👮 Officer Routes (`/api/officers`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET`  | `/api/officers` | ❌ | Get list of panchayat officers |
| `POST` | `/api/officers` | ✅ Admin | Add a new officer |

### 💳 Payment Routes (`/api/payments`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/payments/create-order` | ✅ JWT | Create Razorpay payment order |
| `POST` | `/api/payments/verify` | ✅ JWT | Verify payment signature |

### 🏥 Health Check (`/api/health`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET`  | `/api/health` | ❌ | Server health status |

---

## Database Models

### 1. Application Model (`application.model.js`)

The central model linking all certificate applications.

```
Application
├── applicationId          (String, unique) — e.g., "BIRTH-1700000000000-abc123"
├── applicantId            (ObjectId → User)
├── documentType           (enum: birth_certificate | death_certificate | marriage_certificate)
├── status                 (enum: pending | approved | certificate_generated | rejected | completed)
├── formDataRef            (ObjectId, dynamic ref)
├── formDataModel          (enum: BirthCertificate | DeathCertificate | MarriageCertificate)
├── uploadedFiles[]
│   ├── fileName, originalName, filePath, fileType, fileSize
│   ├── s3Key
│   └── folder             (enum: unverified | verified | certificate)
├── assignedAt, reviewedAt, reviewedBy (ObjectId → User), adminRemarks
├── generatedCertificate   { fileName, filePath, s3Key, folder, contentType, fileSize, generatedAt, downloadCount }
└── paymentDetails         { paymentId, paymentStatus (pending|completed|failed), paidAt }
```

**Key static methods:**
- `createWithFormData(applicationData, formData, documentType)` — Creates both the application and form document atomically
- `getFormData()` — Retrieves the linked certificate-specific form data
- `getSignedUrls()` — Generates signed S3 URLs for all uploaded files
- `updateFileLocation(fileId, newKey, folder)` — Updates S3 file path after folder move

---

### 2. User Model (`user.model.js`)

```
User
├── fullName       (String, required)
├── email          (String, unique, required)
├── password       (String, bcrypt hashed)
├── role           (enum: user | admin, default: user)
├── refreshToken   (String)
├── avatar         (String, Cloudinary URL)
├── passwordResetToken (String)
└── passwordResetExpires (Date)
```

**Instance methods:**
- `isPasswordCorrect(password)` — bcrypt comparison
- `generateAccessToken()` — Creates 15-minute JWT
- `generateRefreshToken()` — Creates 7-day JWT

---

### 3. Certificate Models

All certificate models reference the parent `Application`:

| Model | Key Fields |
|---|---|
| **BirthCertificate** | childName, dateOfBirth, placeOfBirth, gender, motherAdharNumber, fatherAdharNumber, fatherName, motherName, fatherOccupation, motherOccupation, hospitalName, permanentAddressParent |
| **DeathCertificate** | deceasedName, deceasedAdharNumber, dateOfDeath, addressOfDeath, placeOfDeath, age, gender, causeOfDeath, fatherName, motherName, spouseName, permanentAddress |
| **MarriageCertificate** | dateOfMarriage, placeOfMarriage, HusbandName, HusbandAge (≥21), HusbandFatherName, HusbandAddress, HusbandOccupation, wifeName, wifeAge (≥18), wifeFatherName, wifeAddress, wifeOccupation, SolemnizedOn |

---

### 4. Other Models

| Model | Purpose |
|---|---|
| **Blog** | News articles / blog posts with title, content, images, author |
| **Scheme** | Government scheme records with year/category/benefits/publish status/thumbnail |
| **Notification** | In-app notifications for users linked to applications |
| **Officer** | Gram Panchayat staff/officer records |
| **Payment** | Razorpay payment records |
| **Taxation** | House tax records for properties |
| **DocumentRequirement** | Per-certificate document checklists |
| **BplCertificate** | BPL (Below Poverty Line) certificate applications |
| **NiradharCertificate** | Niradhar (destitute) certificate applications |
| **NoOutstandingDebts** | NOD certificate applications |
| **HousingAssessment8** | House assessment form data |

---

## Frontend Pages & Routes

| Route | Component | Access | Description |
|---|---|:---:|---|
| `/` | `Home.tsx` | Public | Main landing page with all panchayat info |
| `/login` | `Login.tsx` | Public | Login page (no layout/navbar) |
| `/register` | `register.tsx` | Public | Citizen registration |
| `/schemes` | `Schemes.tsx` | Public | Government schemes list |
| `/schemes/:year` | `SchemeDetails.tsx` | Public | Year-wise schemes list |
| `/schemes/details/:idOrSlug` | `SchemeFullDetails.tsx` | Public | Single scheme full details page |
| `/gallery` | `Gallery.tsx` | Public | Photo gallery (by year) |
| `/gallery/:year` | `YearGallery.tsx` | Public | Year-specific gallery |
| `/blogs/:id` | `blogDetails.tsx` | Public | Single blog post view |
| `/about-vathode` | `AboutVathode.tsx` | Public | About Vathode village |
| `/grampanchayat-info` | `AboutGram.tsx` | Public | About the Gram Panchayat |
| `/members` | `Members.tsx` | Public | Elected members |
| `/departments` | `Department.tsx` | Public | Panchayat departments |
| `/notices` | `publicinfo.tsx` | Public | Public notices board |
| `/media` | `Media.tsx` | Public | Media section |
| `/taxation` | `TaxationInfo.tsx` | Public | Tax information |
| `/contact` | `help.tsx` | Public | Contact / Help page |
| `/selfdeclareletters` | `SelfDeclareLetters.tsx` | Public | Self-declaration templates |
| `/apply-for-certificates` | `applyforcertificates.tsx` | ✅ Auth | Certificate type selector |
| `/apply-for-certificates/birth-certificate` | `BirthCertificate.tsx` | ✅ Auth | Birth cert application form |
| `/apply-for-certificates/death-certificate` | `DeathCertificate.tsx` | ✅ Auth | Death cert application form |
| `/apply-for-certificates/marriage-certificate` | `MarriageCertificateForm.tsx` | ✅ Auth | Marriage cert form |
| `/apply-for-certificates/land-record-8a` | `LandRecord8A.tsx` | ✅ Auth | Land Record 8A form |
| `/apply-for-certificates/no-outstanding-debts` | `NoOutstandingDebts.tsx` | ✅ Auth | NOD form |
| `/apply-for-certificates/digital-signed-712` | `DigitalSigned712.tsx` | ✅ Auth | 7/12 extract form |
| `/user/certificates` | `userCertificates.tsx` | ✅ Auth | My applications & certificates |
| `/user/notifications` | `userNotification.tsx` | ✅ Auth | My notifications |
| `/certificate/:applicationId` | `certificateDownload.tsx` | ✅ Auth | Download certificate |
| `/dashboard` | `dashboard.tsx` | 🛡️ Admin | Admin dashboard/overview |
| `/admin` | `dashboard.tsx` | 🛡️ Admin | Admin home |
| `/admin/approvals` | `CertificatesApprovals.tsx` | 🛡️ Admin | Review applications |
| `/admin/upload` | `uploadCertificates.tsx` | 🛡️ Admin | Upload certificates |
| `/form-details/:applicationId` | `FormDetails.tsx` | 🛡️ Admin | Full application details |
| `/admin/users` | `ManageUsers.tsx` | 🛡️ Admin | Manage citizens |
| `/admin/user/:userId` | `UserDetails.tsx` | 🛡️ Admin | Citizen detail view |
| `/admin/blogs` | `Blogs.tsx` | 🛡️ Admin | Manage blog posts |
| `/admin/gallery` | `AdminGallery.tsx` | 🛡️ Admin | Manage gallery |
| `/admin/schemes` | `AdminSchemes.tsx` | 🛡️ Admin | Manage schemes (CRUD + publish toggle) |

---

## Authentication Flow

The system uses **dual-token JWT authentication**:

```
┌─────────────┐     POST /api/users/login     ┌──────────────┐
│   Browser   │ ──────────────────────────────►│   Backend    │
│             │◄── Access Token (15 min) ──────│              │
│             │◄── Refresh Token (7 days, HTTP-only cookie) ──│
└─────────────┘                                └──────────────┘

On each protected request:
Browser ──► Authorization: Bearer <access_token> ──► Backend verifies JWT

When access token expires:
Browser ──► POST /api/users/refresh-token (sends refresh cookie) ──► Backend
Backend ──► New access token + new refresh token ──► Browser
```

### JWT Payload Structure

**Access Token** (15 minutes):
```json
{
  "_id": "user_object_id",
  "email": "user@example.com",
  "role": "user | admin"
}
```

**Refresh Token** (7 days):
```json
{
  "_id": "user_object_id"
}
```

### Auth Middleware

| Middleware | File | Description |
|---|---|---|
| `verifyJWT` | `auth.middleware.js` | Validates Bearer token, attaches `req.user` |
| `verifyAdmin` | `auth.middleware.js` | Extends `verifyJWT`, checks `role === 'admin'` |

---

## File Management System (AWS S3)

All uploaded documents and certificates are stored in **AWS S3** with a structured folder hierarchy.

### S3 Folder Structure

```
s3-bucket/
├── unverified/      ← Uploaded after application submission
├── verified/        ← Moved here when admin approves the application
└── certificate/     ← Generated certificate uploaded by admin
```

### File Lifecycle

```
1. Citizen submits form with documents
   → Files uploaded to "unverified/" folder

2. Admin reviews and approves
   → Files moved from "unverified/" to "verified/"
   → Application status: pending → approved

3. Admin uploads signed certificate
   → Certificate stored in "certificate/" folder
   → Application status: approved → certificate_generated

4. Citizen downloads certificate
   → Signed URL generated (time-limited)
   → Citizen securely downloads the PDF
```

### Key Utility Functions (`s3Service.js`)

| Function | Description |
|---|---|
| `uploadToS3(file, folder, metadata)` | Upload a multer file to a specific S3 folder |
| `moveFileToFolder(sourceKey, destFolder)` | Move file between S3 folders (copy + delete) |
| `getSecureFileUrl(s3Key, disposition)` | Generate a signed URL for secure file access |
| `processUploadedFilesS3(files, folder)` | Batch-process multiple multer file uploads |

---

## Email Notification System

The system sends automated emails at key lifecycle events using **Nodemailer** with **Mailgen** templates.

### Notification Events

| Event | Recipient | Description |
|---|---|---|
| New application submitted | Admin | Alert admin of new pending application |
| Application approved | Citizen | Certificate application approved |
| Application rejected | Citizen | Certificate application rejected with remarks |
| Certificate uploaded | Citizen | Certificate is ready to download |

### Email Configuration

Uses **Gmail SMTP** with App Password authentication. Set up:
1. Enable **2-Factor Authentication** on your Gmail account
2. Generate an **App Password** (Google Account → Security → App Passwords)
3. Use that App Password as `EMAIL_PASS` in `.env`

---

## Internationalization (i18n)

The platform supports **English** and **Marathi** languages.

### Setup

The i18n system is configured in `src/i18n.ts` using `i18next` with browser language detection.

### Translation Files

```
frontend/src/locales/
├── en/
│   └── translation.json    ← English strings
└── mr/
    └── translation.json    ← Marathi (मराठी) strings
```

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('home.title')}</h1>;
}
```

### Language Switcher

The language toggle is in the top bar of `App.tsx`. Clicking **English** or **मराठी** instantly switches all translated UI text without a page reload.

---

## Admin Dashboard Guide

### Accessing the Admin Panel

1. Login at `/login` with an admin account
2. Navigate to `/dashboard` or `/admin`

### Reviewing Certificate Applications

1. Go to `/admin/approvals`
2. Applications are displayed in cards with status badges
3. Filter by status: **All / Pending / Approved / Rejected / Certificate Generated**
4. Click **"View Details"** on an application card to open `/form-details/:applicationId`

### Reviewing an Application

On the Form Details page:
- View complete form data (all fields filled by citizen)
- View uploaded supporting documents (click to open via signed S3 URL)
- Enter **Admin Remarks**
- Click **Approve** or **Reject**
- The citizen is automatically notified via email and in-app notification

### Uploading Certificates

After approval:
1. Go to `/admin/upload`
2. Find the approved application
3. Upload the generated/digitally signed certificate (PDF)
4. The certificate is stored in S3 and the citizen is notified

### Managing Government Schemes

1. Go to `/admin/schemes`
2. Create a scheme with title, slug, year, category, benefits, eligibility, and process
3. Upload a thumbnail image (stored at `/uploads/schemes`)
4. Use **Publish** toggle to control whether it appears in public routes
5. Edit or delete schemes any time from the same admin page

### Scheme Data Migration (Static -> MongoDB)

Use the backend script to migrate old frontend static schemes into MongoDB:

```bash
cd Backend

# Preview records without writing to DB
npm run migrate:schemes:dry

# Execute migration
npm run migrate:schemes
```

---

## Citizen User Guide

### Registration & Login

1. Visit `/register` to create an account
2. Go to `/login` to sign in
3. Your JWT session is managed automatically with refresh tokens

### Applying for a Certificate

1. Navigate to `/apply-for-certificates`
2. Choose the certificate type (Birth / Death / Marriage / etc.)
3. Fill in the online form completely
4. Upload supporting documents (max 5 files: PDF, JPG, PNG, etc.)
5. Submit — you'll receive a confirmation notification

### Tracking Your Application

- Go to `/user/certificates` to see all your applications
- Status flow: **Pending → Approved → Certificate Generated**

### Downloading Your Certificate

- When status is **Certificate Generated**, go to `/certificate/:applicationId`
- Click **Download** to get a secure, signed link to your certificate

### Notifications

- Check `/user/notifications` for all updates on your applications

---

## Deployment

The production deployment uses the following AWS services:

| Component | AWS Service |
|---|---|
| **Frontend** | S3 (static hosting) + CloudFront (CDN) |
| **Domain** | Route 53 (DNS) |
| **Backend** | EC2 / ECS / App Runner (your choice) |
| **Database** | MongoDB Atlas |
| **File Storage** | S3 |

### Frontend Deployment (AWS S3 + CloudFront)

```bash
cd frontend
npm run build
# Upload the `dist/` folder to your S3 bucket configured for static hosting
# Invalidate CloudFront cache after every deployment
```

The `vercel.json` also enables one-click deployman on **Vercel** for the frontend:
```bash
cd frontend
vercel deploy --prod
```

### Backend Deployment

The backend Docker image can be deployed to:
- **AWS ECS/Fargate**
- **AWS App Runner**
- **EC2** with Docker

```bash
cd Backend
docker build -t egrampanchayat-backend .
docker push your-ecr-repo/egrampanchayat-backend
```

---

## Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/EGramPanchayat-Wathode.git`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Set up** both Backend and Frontend as described in [Local Development Setup](#local-development-setup)
5. **Make your changes** following the existing code conventions
6. **Test** your changes thoroughly
7. **Commit** with a clear message: `git commit -m "feat: add XYZ feature"`
8. **Push** and open a Pull Request

### Code Style

- **Backend**: JavaScript (ESM), formatted with **Prettier** (config in `.prettierrc`)
- **Frontend**: TypeScript with strict mode, **ESLint** enforced

Run formatter:
```bash
# Backend
cd Backend && npx prettier --write .

# Frontend
cd frontend && npm run lint
```

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `style:` — formatting (no logic change)
- `refactor:` — code restructure
- `chore:` — build/tooling changes

---

## License

This project is developed exclusively for **Wathode Gram Panchayat**, Tal. Shirpur, Dist. Dhule, Maharashtra, India.

---

<div align="center">

**Built with ❤️ for Digital India**  
*Wathode Gram Panchayat — Bringing Governance to Your Fingertips*

</div>
