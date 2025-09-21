# Gram Panchayat Website - Complete Project Documentation
//mongodb+srv://omdhangar24:1234@cluster0.3kksm.mongodb.net
## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Database Models](#database-models)
6. [API Routes & Controllers](#api-routes--controllers)
7. [File Management System](#file-management-system)
8. [Authentication & Authorization](#authentication--authorization)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Error Handling](#error-handling)
11. [Security Features](#security-features)

---

## Project Overview

The Gram Panchayat Website is a comprehensive digital platform for managing certificate applications (Birth, Death, and Marriage certificates) in rural areas. The system provides both user-facing application submission and admin-facing approval workflows.

### Key Features
- **Multi-language Support**: English and Marathi
- **Certificate Types**: Birth, Death, and Marriage certificates
- **File Management**: AWS S3 integration for secure file storage
- **Admin Dashboard**: Application review and approval system
- **Payment Integration**: Payment status tracking
- **Email Notifications**: Automated email alerts
- **Real-time Status Updates**: Application status tracking

---

## Architecture

### Tech Stack
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Frontend**: React.js, TypeScript, Tailwind CSS, Vite
- **File Storage**: AWS S3
- **Authentication**: JWT (Access + Refresh tokens)
- **Email Service**: Nodemailer
- **Payment**: Integration ready (structure in place)

### Project Structure
```
GramPanchayat Website/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middlewares/    # Authentication & validation
│   │   ├── utils/          # Helper functions
│   │   └── db/            # Database connection
│   └── public/            # Static files
└── Frontend/
    ├── src/
    │   ├── pages/         # React components
    │   ├── components/    # Reusable components
    │   ├── api/          # API integration
    │   ├── Context/      # React context
    │   └── locales/      # Internationalization
    └── public/           # Static assets
```

---

## Backend Documentation

### Core Controllers

#### 1. Application Controllers (`application.controllers.js`)

##### **submitBirthCertificateApplication**
**Purpose**: Handles birth certificate application submission
**Route**: `POST /api/applications/birth-certificate`
**Authentication**: Required (JWT)

**Request Body**:
```javascript
{
  childName: string,
  dateOfBirth: string (ISO date),
  placeOfBirth: string,
  gender: "Male" | "Female" | "Other",
  motherAdharNumber: string,
  fatherAdharNumber: string,
  permanentAddressParent: string,
  parentsAddressAtBirth: string,
  fatherName: string,
  motherName: string,
  fatherOccupation: string,
  motherOccupation: string,
  hospitalName: string,
  documents: File[] (max 5 files)
}
```

**Response**:
```javascript
{
  statusCode: 201,
  data: {
    applicationId: "BIRTH-123456-abc123",
    applicantId: ObjectId,
    documentType: "birth_certificate",
    status: "pending",
    uploadedFiles: [...],
    formDataRef: ObjectId,
    formDataModel: "BirthCertificate"
  },
  message: "Birth certificate application submitted successfully"
}
```

**Logic Flow**:
1. Validate input data (dates, gender, required fields)
2. Process uploaded files using S3 service
3. Generate unique application ID (BIRTH-timestamp-random)
4. Create application with form data using static method
5. Create notification for user
6. Send email notification to admin
7. Return success response

##### **submitDeathCertificateApplication**
**Purpose**: Handles death certificate application submission
**Route**: `POST /api/applications/death-certificate`
**Authentication**: Required (JWT)

**Request Body**:
```javascript
{
  deceasedName: string,
  dateOfDeath: string (ISO date),
  addressOfDeath: string,
  placeOfDeath: string,
  age: number,
  gender: "Male" | "Female" | "Other",
  causeOfDeath: string,
  deceasedAdharNumber: string,
  fatherName: string,
  motherName: string,
  spouseName: string,
  spouseAdhar: string,
  motherAdhar: string,
  fatherAdhar: string,
  permanentAddress: string,
  documents: File[] (max 5 files)
}
```

**Logic Flow**: Similar to birth certificate with death-specific validations

##### **submitMarriageCertificateApplication**
**Purpose**: Handles marriage certificate application submission
**Route**: `POST /api/applications/marriage-certificate`
**Authentication**: Required (JWT)

**Request Body**:
```javascript
{
  dateOfMarriage: string (ISO date),
  placeOfMarriage: string,
  HusbandName: string,
  HusbandAge: number (min 21),
  HusbandFatherName: string,
  HusbandAddress: string,
  HusbandOccupation: string,
  wifeName: string,
  wifeAge: number (min 18),
  wifeFatherName: string,
  wifeAddress: string,
  wifeOccupation: string,
  SolemnizedOn: string,
  documents: File[] (max 5 files)
}
```

**Logic Flow**: Similar to other certificates with marriage-specific validations

##### **getUserApplications**
**Purpose**: Retrieves all applications for a specific user
**Route**: `GET /api/applications/user/:userId`
**Authentication**: Required (JWT)

**Response**:
```javascript
{
  statusCode: 200,
  data: [
    {
      _id: ObjectId,
      applicationId: string,
      documentType: string,
      status: string,
      createdAt: Date,
      updatedAt: Date,
      // ... other application fields
    }
  ],
  message: "User applications retrieved successfully"
}
```

##### **getAdminApplications**
**Purpose**: Retrieves all applications for admin review
**Route**: `GET /api/applications/admin`
**Authentication**: Required (Admin JWT)

**Response**: Array of all applications with applicant details populated

##### **reviewApplication**
**Purpose**: Allows admin to approve/reject applications
**Route**: `POST /api/applications/admin/review/:applicationId`
**Authentication**: Required (Admin JWT)

**Request Body**:
```javascript
{
  status: "approved" | "rejected",
  adminRemarks: string
}
```

**Logic Flow**:
1. Validate application exists and is pending
2. Update application status and admin remarks
3. If approved, move files from 'unverified' to 'verified' folder in S3
4. Create notification for user
5. Send email notification to applicant
6. Return success response

##### **uploadCertificate**
**Purpose**: Allows admin to upload generated certificate
**Route**: `POST /api/applications/admin/certificate/:applicationId`
**Authentication**: Required (Admin JWT)

**Request**: Multipart form with certificate file

**Logic Flow**:
1. Validate application is approved
2. Upload certificate to S3 'certificate' folder
3. Update application with certificate details
4. Change status to 'certificate_generated'
5. Create notification for user
6. Send email notification

##### **getApplicationDetails**
**Purpose**: Retrieves detailed application information
**Route**: `GET /api/applications/:applicationId`
**Authentication**: Required (JWT)

**Response**: Complete application data with form details and secure URLs

##### **getFileUrls**
**Purpose**: Generates signed URLs for file access
**Route**: `GET /api/applications/files/urls?applicationId=xxx`
**Authentication**: Required (JWT)

**Response**:
```javascript
{
  statusCode: 200,
  data: {
    url: "https://s3-signed-url..."
  },
  message: "Certificate URL generated successfully"
}
```

#### 2. Authentication Controllers (`auth.controllers.js`)

##### **registerUser**
**Purpose**: User registration
**Route**: `POST /api/auth/register`
**Authentication**: Not required

**Request Body**:
```javascript
{
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
}
```

**Response**:
```javascript
{
  statusCode: 200,
  data: {
    user: UserObject,
    accessToken: string,
    refreshToken: string
  },
  message: "User registered Successfully"
}
```

**Logic Flow**:
1. Validate input fields
2. Check password confirmation
3. Check for existing user
4. Create user in database
5. Generate access and refresh tokens
6. Set HTTP-only cookies
7. Return user data and tokens

##### **loginUser**
**Purpose**: User login
**Route**: `POST /api/auth/login`
**Authentication**: Not required

**Request Body**:
```javascript
{
  email: string,
  password: string
}
```

**Logic Flow**:
1. Validate email and password
2. Find user by email
3. Verify password using bcrypt
4. Generate new access and refresh tokens
5. Set HTTP-only cookies
6. Return user data and tokens

##### **logoutUser**
**Purpose**: User logout
**Route**: `POST /api/auth/logout`
**Authentication**: Required (JWT)

**Logic Flow**:
1. Clear refresh token from user document
2. Clear HTTP-only cookies
3. Return success response

##### **refreshAccessToken**
**Purpose**: Refresh expired access token
**Route**: `POST /api/auth/refresh-token`
**Authentication**: Not required (uses refresh token cookie)

**Logic Flow**:
1. Extract refresh token from cookies
2. Verify refresh token
3. Find user by token payload
4. Generate new access and refresh tokens
5. Update user's refresh token
6. Set new cookies

---

## Frontend Documentation

### Key Components

#### 1. Certificate Approvals (`CertificatesApprovals.tsx`)

**Purpose**: Admin dashboard for reviewing and managing certificate applications

**State Management**:
```typescript
interface FormSubmission {
  _id: string;
  applicationId: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected' | 'certificate_generated';
  uploadedFiles: Array<{
    fileName: string;
    originalName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    _id: string;
    uploadedAt: string;
  }>;
  generatedCertificate?: {
    fileName: string;
    filePath: string;
    generatedAt: string;
  };
  paymentDetails: {
    paymentStatus: string;
  };
  createdAt: string;
  updatedAt: string;
  adminRemarks?: string;
}
```

**Key Functions**:

##### **fetchForms**
- Fetches all applications for admin
- Filters by status (all, pending, approved, etc.)
- Handles loading states and errors

##### **openCertificate**
- Generates signed URL for certificate viewing
- Opens certificate in new tab
- Handles loading states and errors

##### **viewFormDetails**
- Navigates to detailed application view
- Passes application ID as route parameter

**UI Features**:
- Tab-based filtering (all, pending, approved, etc.)
- Card-based application display
- File type icons (PDF, Image, Document)
- Status badges with color coding
- Payment status indicators
- Responsive grid layout

---

## Database Models

### 1. Application Model (`application.model.js`)

**Schema Structure**:
```javascript
{
  // Application Basics
  applicationId: String (unique),
  applicantId: ObjectId (ref: 'User'),
  documentType: String (enum: ['marriage_certificate', 'birth_certificate', 'death_certificate']),
  status: String (enum: ['pending', 'approved', 'certificate_generated', 'rejected', 'completed']),
  
  // Form Data Reference
  formDataRef: ObjectId (dynamic ref),
  formDataModel: String (enum: ['BirthCertificate', 'DeathCertificate', 'MarriageCertificate']),
  
  // File Uploads
  uploadedFiles: [{
    fileName: String,
    originalName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    s3Key: String,
    folder: String (enum: ['unverified', 'verified', 'certificate']),
    uploadedAt: Date
  }],
  
  // Admin Processing
  assignedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId (ref: 'User'),
  adminRemarks: String,
  
  // Generated Certificate
  generatedCertificate: {
    fileName: String,
    filePath: String,
    s3Key: String,
    folder: String,
    contentType: String,
    fileSize: Number,
    generatedAt: Date,
    downloadCount: Number,
    lastDownloaded: Date
  },
  
  // Payment Info
  paymentDetails: {
    paymentId: String,
    paymentStatus: String (enum: ['pending', 'completed', 'failed']),
    paidAt: Date
  }
}
```

**Key Methods**:

##### **createWithFormData**
- Static method for creating application with form data
- Validates form data based on document type
- Creates form document and links to application
- Handles different certificate types

##### **getFormData**
- Retrieves linked form data
- Uses dynamic model reference

##### **getSignedUrls**
- Generates signed URLs for all files in application
- Handles both uploaded files and certificates
- Returns array of file objects with URLs

##### **updateFileLocation**
- Updates file location after S3 folder moves
- Updates s3Key, folder, and filePath

### 2. User Model (`user.model.js`)

**Schema Structure**:
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  refreshToken: String,
  avatar: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}
```

**Key Methods**:
- `generateAccessToken()`: Creates JWT access token
- `generateRefreshToken()`: Creates JWT refresh token
- `isPasswordCorrect()`: Compares password with hash

### 3. Certificate Models

#### Birth Certificate Model
```javascript
{
  applicationId: ObjectId (ref: 'Application'),
  childName: String,
  dateOfBirth: Date,
  placeOfBirth: String,
  gender: String,
  motherAdharNumber: String,
  fatherAdharNumber: String,
  permanentAddressParent: String,
  parentsAddressAtBirth: String,
  fatherName: String,
  motherName: String,
  fatherOccupation: String,
  motherOccupation: String,
  hospitalName: String
}
```

#### Death Certificate Model
```javascript
{
  applicationId: ObjectId (ref: 'Application'),
  deceasedName: String,
  deceasedAdharNumber: String,
  dateOfDeath: Date,
  addressOfDeath: String,
  placeOfDeath: String,
  age: Number,
  gender: String,
  causeOfDeath: String,
  fatherName: String,
  motherName: String,
  spouseName: String,
  spouseAdhar: String,
  fatherAdhar: String,
  motherAdhar: String,
  permanentAddress: String
}
```

#### Marriage Certificate Model
```javascript
{
  applicationId: ObjectId (ref: 'Application'),
  dateOfMarriage: Date,
  placeOfMarriage: String,
  HusbandName: String,
  HusbandAge: Number,
  HusbandFatherName: String,
  HusbandAddress: String,
  HusbandOccupation: String,
  wifeName: String,
  wifeAge: Number,
  wifeFatherName: String,
  wifeAddress: String,
  wifeOccupation: String,
  SolemnizedOn: String
}
```

---

## API Routes & Controllers

### Application Routes (`application.routes.js`)

#### **Application Submission Routes**
```javascript
// Birth Certificate
POST /api/applications/birth-certificate
- Middleware: upload.array("documents", 5)
- Controller: submitBirthCertificateApplication

// Death Certificate  
POST /api/applications/death-certificate
- Middleware: upload.array("documents", 5)
- Controller: submitDeathCertificateApplication

// Marriage Certificate
POST /api/applications/marriage-certificate
- Middleware: upload.array("documents", 5)
- Controller: submitMarriageCertificateApplication
```

#### **Application Retrieval Routes**
```javascript
// Get user applications
GET /api/applications/user/:userId
- Middleware: verifyJWT
- Controller: getUserApplications

// Get admin applications
GET /api/applications/admin
- Middleware: verifyAdmin
- Controller: getAdminApplications

// Get applications by status
GET /api/applications/admin/filter?status=pending
- Middleware: verifyAdmin
- Controller: getApplicationsByStatus

// Get application details
GET /api/applications/:applicationId
- Middleware: verifyJWT
- Controller: getApplicationDetails
```

#### **File Management Routes**
```javascript
// Get file URLs
GET /api/applications/files/urls?applicationId=xxx
- Middleware: verifyJWT
- Controller: getFileUrls

// Get secure URL for specific file
GET /api/applications/secure-url/:fileId
- Middleware: verifyJWT
- Controller: getSecureFileUrl
```

#### **Admin Review Routes**
```javascript
// Review application
POST /api/applications/admin/review/:applicationId
- Middleware: verifyAdmin
- Controller: reviewApplication

// Upload certificate
POST /api/applications/admin/certificate/:applicationId
- Middleware: verifyAdmin, upload.single("certificate")
- Controller: uploadCertificate
```

### Authentication Routes (`auth.routes.js`)

```javascript
// User registration
POST /api/auth/register
- Controller: registerUser

// User login
POST /api/auth/login
- Controller: loginUser

// User logout
POST /api/auth/logout
- Middleware: verifyJWT
- Controller: logoutUser

// Refresh token
POST /api/auth/refresh-token
- Controller: refreshAccessToken

// Get current user
GET /api/auth/current-user
- Middleware: verifyJWT
- Controller: getCurrentUser

// Update account details
PATCH /api/auth/update-account
- Middleware: verifyJWT
- Controller: updatAccountDetails

// Update avatar
PATCH /api/auth/update-avatar
- Middleware: verifyJWT, upload.single("avatar")
- Controller: updateAvatar
```

---

## File Management System

### AWS S3 Integration (`s3Service.js`)

#### **Key Functions**

##### **uploadToS3**
- Uploads files to S3 with metadata
- Handles content type detection
- Generates unique file keys with timestamps
- Supports folder organization (unverified, verified, certificate)

##### **moveFileToFolder**
- Moves files between S3 folders
- Updates metadata during move
- Handles copy and delete operations

##### **getSecureFileUrl**
- Generates signed URLs for file access
- Supports both inline and attachment dispositions
- Implements URL caching for performance

##### **processUploadedFilesS3**
- Processes multer file objects
- Handles multiple file uploads
- Returns structured file objects for database storage

#### **Folder Structure**
```
S3 Bucket/
├── unverified/     # Newly uploaded files
├── verified/       # Approved application files
└── certificate/    # Generated certificates
```

#### **File Metadata**
```javascript
{
  originalName: string,
  uploadedAt: ISO string,
  folder: string,
  contentType: string
}
```

---

## Authentication & Authorization

### JWT Implementation

#### **Token Structure**
```javascript
// Access Token (15 minutes)
{
  _id: user._id,
  email: user.email,
  role: user.role,
  iat: timestamp,
  exp: timestamp + 15min
}

// Refresh Token (7 days)
{
  _id: user._id,
  iat: timestamp,
  exp: timestamp + 7days
}
```

#### **Middleware Functions**

##### **verifyJWT**
- Extracts token from Authorization header
- Verifies token signature and expiry
- Attaches user data to request object
- Handles token refresh if needed

##### **verifyAdmin**
- Extends verifyJWT functionality
- Checks if user has admin role
- Returns 403 if unauthorized

### Security Features
- HTTP-only cookies for refresh tokens
- Secure flag in production
- Token rotation on refresh
- Password hashing with bcrypt
- Input validation and sanitization

---

## Data Flow Diagrams

### Application Submission Flow
```
User → Frontend Form → Backend API → Validation → File Upload (S3) → Database → Email Notification → Response
```

### Admin Review Flow
```
Admin → Dashboard → Select Application → Review Details → Approve/Reject → Update Status → Move Files → Notify User → Update UI
```

### File Access Flow
```
User/Admin → Click File → Generate Signed URL → S3 → Display/Download File
```

---

## Error Handling

### Backend Error Handling

#### **ApiError Class**
```javascript
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
  }
}
```

#### **AsyncHandler Wrapper**
```javascript
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
```

#### **Global Error Handler**
- Catches all unhandled errors
- Returns structured error responses
- Logs errors for debugging
- Handles different error types

### Frontend Error Handling

#### **API Error Handling**
- Axios interceptors for global error handling
- Token refresh on 401 errors
- User-friendly error messages
- Loading states and error states

#### **Form Validation**
- Client-side validation
- Server-side validation feedback
- Real-time validation
- Error message display

---

## Security Features

### Data Protection
- Password hashing with bcrypt
- JWT token encryption
- HTTPS in production
- Input sanitization
- SQL injection prevention (Mongoose)

### File Security
- S3 bucket policies
- Signed URLs with expiration
- File type validation
- Size limits
- Virus scanning (can be added)

### Access Control
- Role-based authorization
- Route protection
- Admin-only endpoints
- User data isolation

### Session Management
- Secure cookie settings
- Token expiration
- Automatic logout
- Session invalidation

---

## Performance Optimizations

### Backend Optimizations
- Database indexing on frequently queried fields
- S3 URL caching
- Pagination for large datasets
- Efficient database queries with population
- File compression

### Frontend Optimizations
- Lazy loading of components
- Image optimization
- Code splitting
- Caching strategies
- Responsive design

---

## Deployment Considerations

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/grampanchayat

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_bucket_name

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Server
PORT=8000
NODE_ENV=development
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database connection secured
- [ ] SSL certificate installed
- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled

---

This documentation provides a comprehensive overview of the Gram Panchayat Website project, covering all major functionalities, data flows, and technical implementations. The system is designed to be scalable, secure, and user-friendly while maintaining cost efficiency through on-demand file URL generation.
