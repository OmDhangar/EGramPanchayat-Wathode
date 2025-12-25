// middleware/multer.middleware.js
import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure temp directory exists
const ensureTempDir = () => {
  const tempDir = './public/temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
};

// Call this when the module loads
ensureTempDir();

// Storage configuration for general file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureTempDir(); // Ensure directory exists
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${fileExtension}`;
    cb(null, filename);
  }
});

// Storage configuration specifically for certificates (admin uploads)
const certificateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureTempDir();
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = `certificate-${uniqueSuffix}${fileExtension}`;
    cb(null, filename);
  }
});

// File filter for documents and images (PDF, DOC, DOCX, JPG, PNG)
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',                                                        // PDF
    'application/msword',                                                     // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'image/jpeg',                                                            // JPEG
    'image/jpg',                                                             // JPG
    'image/png'                                                              // PNG
  ];

  console.log('File received:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed'), false);
  }
};

// File filter for images only (PNG/JPG/JPEG)
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG images are allowed'), false);
  }
};

// File filter for certificate uploads (PDF only - for admin generated certificates)
const certificateFileFilter = (req, file, cb) => {
  console.log('Certificate file received:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for certificates'), false);
  }
};

// Basic upload configuration (for user application documents - goes to 'unverified' folder)
export const upload = multer({ 
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Images-only upload configuration (for payment receipt screenshots)
export const uploadImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB
    files: 1
  }
});

// Multiple images upload configuration (for gallery uploads)
export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files per request
  }
});

// Certificate upload configuration (for admin generated certificates - goes to 'certificate' folder)
export const uploadCertificate = multer({ 
  storage: certificateStorage,
  fileFilter: certificateFileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for certificates
    files: 1
  }
});

// Multiple file upload for applications (user documents - goes to 'unverified' folder)
export const uploadMultiple = multer({ 
  storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10 // Maximum 10 files per request
  }
});

// PDF only upload (legacy support)
export const uploadPDF = multer({ 
  storage,
  fileFilter: certificateFileFilter, // PDF only
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Single file upload for PDFs
  }
});

// Error handling middleware for multer errors
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    let message = 'File upload error';
    let statusCode = 400;

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File size too large. Maximum size allowed is 10MB per file';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files. Maximum allowed files exceeded';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field. Please check field names';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts in multipart form';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name too long';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value too long';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields';
        break;
      default:
        message = error.message;
    }

    return res.status(statusCode).json({
      success: false,
      message: message,
      error: error.code,
      allowedTypes: 'PDF, DOC, DOCX, JPG, PNG files only'
    });
  }

  // Handle custom file filter errors
  if (error.message === 'Only PDF files are allowed for certificates' || 
      error.message === 'Only PDF, DOC, DOCX, JPG, and PNG files are allowed') {
    return res.status(400).json({
      success: false,
      message: error.message,
      allowedTypes: error.message.includes('certificates') ? 'PDF files only' : 'PDF, DOC, DOCX, JPG, PNG files'
    });
  }

  // Pass other errors to the next error handler
  next(error);
};

// Utility function to clean up uploaded files in case of error
export const cleanupFiles = (files) => {
  if (!files) return;

  const filesToClean = Array.isArray(files) ? files : [files];
  
  filesToClean.forEach(file => {
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
        console.log(`Cleaned up file: ${file.path}`);
      } catch (error) {
        console.error(`Error cleaning up file ${file.path}:`, error);
      }
    }
  });
};

// Middleware to validate file upload fields
export const validateFileFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.files?.[field]);
    
    if (missingFields.length > 0) {
      // Clean up any uploaded files
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(400).json({
        success: false,
        message: `Missing required file fields: ${missingFields.join(', ')}`
      });
    }
    
    next();
  };
};

export default {
  upload,
  uploadImages,
  uploadMultipleImages,
  uploadPDF,
  uploadCertificate,
  uploadMultiple,
  handleMulterError,
  cleanupFiles,
  validateFileFields
};