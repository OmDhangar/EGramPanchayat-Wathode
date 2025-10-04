import mongoose from 'mongoose';
import { getFileDownloadUrl, getSecureFileUrl } from '../utils/s3Service.js';

// Update the uploadedFiles schema within applicationSchema
const applicationSchema = new mongoose.Schema({
  // Application Basics
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Document Type - UPDATED to include taxation
  documentType: {
    type: String,
    enum: [
      'marriage_certificate', 
      'birth_certificate', 
      'death_certificate',
      'land_record_8a',
      'no_outstanding_debts',
      'digital_signed_712',
      'taxation'  // ADDED
    ],
    required: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending','approved', 'certificate_generated','rejected', 'completed'],
    default: 'pending'
  },
  
  // Form Data (Dynamic based on document type)
  formDataRef: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'formDataModel'
  },
  formDataModel: {
    type: String,
    enum: [
      'BirthCertificate', 
      'DeathCertificate', 
      'MarriageCertificate',
      'LandRecord8A',
      'NoOutstandingDebts',
      'DigitalSigned712',
      'Taxation'  // ADDED
    ]
  },

  // File Uploads
  uploadedFiles: [{
    fileName: String,
    originalName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    s3Key: String,
    folder: {
      type: String,
      enum: ['unverified', 'verified', 'certificate'],
      default: 'unverified'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isPaymentReceipt: {  // ADDED to identify payment receipt
      type: Boolean,
      default: false
    }
  }],
  
  // Admin Processing
  assignedAt: Date,
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminRemarks: String,
  
  // Generated Certificate
  generatedCertificate: {
    fileName: String,
    filePath: String,
    s3Key: String,
    folder: {
      type: String,
      default: 'certificate'
    },
    contentType: String,
    fileSize: Number,
    generatedAt: Date,
    downloadCount: {
      type: Number,
      default: 0
    },
    lastDownloaded: Date
  },
  
  // Payment Info
  paymentDetails: {
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paidAt: Date,
    amount: { type: Number, default: 20 },
    utrNumber: { type: String },
    receiptUrl: { type: String }
  }
}, {
  timestamps: true
});

// Method to get payment amount from referenced form
applicationSchema.methods.getPaymentAmount = async function() {
  if (!this.formDataRef) return 0;
  
  const FormModel = mongoose.model(this.formDataModel);
  const formData = await FormModel.findById(this.formDataRef);
  return formData ? formData.paymentAmount : 0;
};

// Method to get form data
applicationSchema.methods.getFormData = async function() {
  if (!this.formDataRef) return null;
  
  const FormModel = mongoose.model(this.formDataModel);
  return await FormModel.findById(this.formDataRef);
};

// Static method to create application with form data - UPDATED
applicationSchema.statics.createWithFormData = async function(applicationData, formData) {
  const { documentType } = applicationData;

  // Validate form data based on document type
  let validationResult;
  switch(documentType) {
    case 'birth_certificate':
      validationResult = validateBirthCertificate(formData);
      break;
    case 'death_certificate':
      validationResult = validateDeathCertificate(formData);
      break;
    case 'marriage_certificate':
      validationResult = validateMarriageCertificate(formData);
      break;
    case 'land_record_8a':
      validationResult = validateLandRecord8A(formData);
      break;
    case 'no_outstanding_debts':
      validationResult = validateNoOutstandingDebts(formData);
      break;
    case 'digital_signed_712':
      validationResult = validateDigitalSigned712(formData);
      break;
    case 'taxation':  // ADDED
      validationResult = validateTaxation(formData);
      break;
    default:
      throw new Error('Invalid document type');
  }
  
  // Check validation result
  if (!validationResult.isValid) {
    throw new Error(`Missing required fields: ${validationResult.missingFields.join(', ')}`);
  }
  
  // Create the application first
  const application = new this(applicationData);
  await application.save();
  
  // Determine form model and create form data
  let FormModel, formDataModel;
  
  switch(documentType) {
    case 'birth_certificate':
      FormModel = mongoose.model('BirthCertificate');
      formDataModel = 'BirthCertificate';
      break;
    case 'death_certificate':
      FormModel = mongoose.model('DeathCertificate');
      formDataModel = 'DeathCertificate';
      break;
    case 'marriage_certificate':
      FormModel = mongoose.model('MarriageCertificate');
      formDataModel = 'MarriageCertificate';
      break;
    case 'land_record_8a':
      FormModel = mongoose.model('LandRecord8A');
      formDataModel = 'LandRecord8A';
      break;
    case 'no_outstanding_debts':
      FormModel = mongoose.model('NoOutstandingDebts');
      formDataModel = 'NoOutstandingDebts';
      break;
    case 'digital_signed_712':
      FormModel = mongoose.model('DigitalSigned712');
      formDataModel = 'DigitalSigned712';
      break;
    case 'taxation':  // ADDED
      FormModel = mongoose.model('Taxation');
      formDataModel = 'Taxation';
      break;
    default:
      throw new Error('Invalid document type');
  }
  
  // Create form data with application reference
  const formDataDoc = new FormModel({
    applicationId: application._id,
    ...formData
  });
  await formDataDoc.save();
  
  // Update application with form data reference
  application.formDataRef = formDataDoc._id;
  application.formDataModel = formDataModel;
  await application.save();
  
  return application;
};

// ===================================
// FORM VALIDATION HELPERS
// ===================================

// Birth Certificate Validation
const validateBirthCertificate = (data) => {
  const required = ['childName', 'dateOfBirth', 'gender', 'fatherName', 'motherName', 'placeOfBirth', 'parentsAddressAtBirth', 'permanentAddressParent'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Death Certificate Validation
const validateDeathCertificate = (data) => {
  const required = ['deceasedName', 'dateOfDeath', 'causeOfDeath'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Marriage Certificate Validation
const validateMarriageCertificate = (data) => {
  const required = [
    'dateOfMarriage', 'placeOfMarriage', 'HusbandName', 'HusbandAge', 'HusbandFatherName',
    'wifeName', 'wifeAge', 'wifeFatherName'
  ];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Land Record 8A Validation
const validateLandRecord8A = (data) => {
  const required = ['ownersName', 'village', 'whatsappNumber', 'taluka', 'district', 'accountNumber', 'utrNumber'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// No Outstanding Debts Validation
const validateNoOutstandingDebts = (data) => {
  const required = ['financialYear', 'propertyOwnerName', 'aadhaarCardNumber', 'whatsappNumber', 'villageName', 'wardNo', 'streetNameNumber', 'propertyNumber', 'applicantFullNameEnglish', 'applicantAadhaarNumber', 'utrNumber'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Digital Signed 7/12 Validation
const validateDigitalSigned712 = (data) => {
  const required = ['ownersName', 'village', 'whatsappNumber', 'taluka', 'district', 'surveyNumber', 'utrNumber'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Taxation Validation - ADDED
const validateTaxation = (data) => {
  const required = ['financialYear', 'applicantName', 'mobileNumber', 'taxPayerNumber', 'address', 'utrNumber'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Add method to get signed download URL
applicationSchema.methods.getFileDownloadUrl = async function(fileIndex) {
  const file = this.uploadedFiles[fileIndex];
  if (!file || (!file.s3Key && !file.filePath)) {
    throw new Error('File not found or file path missing');
  }

  try {
    return await getSecureFileUrl(file.s3Key || file.filePath);
  } catch (error) {
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }
};

// Add method to get certificate download URL
applicationSchema.methods.getCertificateDownloadUrl = async function() {
  if (!this.generatedCertificate?.s3Key && !this.generatedCertificate?.filePath) {
    throw new Error('Certificate not found or file path missing');
  }

  try {
    // Update download count and last downloaded time
    this.generatedCertificate.downloadCount += 1;
    this.generatedCertificate.lastDownloaded = new Date();
    await this.save();

    return await getSecureFileUrl(
      this.generatedCertificate.s3Key || this.generatedCertificate.filePath
    );
  } catch (error) {
    throw new Error(`Failed to generate certificate download URL: ${error.message}`);
  }
};

// Add method to update file location after S3 move
applicationSchema.methods.updateFileLocation = async function(fileIndex, newS3Key, newFolder) {
  if (!this.uploadedFiles[fileIndex]) {
    throw new Error('File not found');
  }

  this.uploadedFiles[fileIndex].s3Key = newS3Key;
  this.uploadedFiles[fileIndex].folder = newFolder;
  this.uploadedFiles[fileIndex].filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newS3Key}`;

  return await this.save();
};

// Add method to get all file URLs for an application
applicationSchema.methods.getSignedUrls = async function() {
  const urls = [];
  
  // Get URLs for uploaded files
  for (const file of this.uploadedFiles) {
    try {
      const signedUrl = await getSecureFileUrl(file.s3Key || file.filePath);
      urls.push({
        fileName: file.originalName,
        url: signedUrl,
        expiresIn: 3600,
        type: 'document'
      });
    } catch (error) {
      console.error(`Error generating URL for ${file.fileName}:`, error);
    }
  }

  // Get URL for certificate if available
  if (this.generatedCertificate?.s3Key || this.generatedCertificate?.filePath) {
    try {
      const certificateUrl = await getSecureFileUrl(
        this.generatedCertificate.s3Key || this.generatedCertificate.filePath
      );
      urls.push({
        fileName: this.generatedCertificate.fileName,
        url: certificateUrl,
        expiresIn: 3600,
        type: 'certificate'
      });
    } catch (error) {
      console.error('Error generating certificate URL:', error);
    }
  }

  return urls;
};

export const Application = mongoose.model('Application', applicationSchema);