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
  
  // Document Type
  documentType: {
    type: String,
    enum: [
      'marriage_certificate', 
      'birth_certificate', 
      'death_certificate',
      'taxation',
      'no_outstanding_debts',
      'housing_assessment_8',
      'bpl_certificate',
      'niradhar_certificate'
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
      'Taxation',
      'NoOutstandingDebts',
      'HousingAssessment8',
      'BPLCertificate',
      'NiradharCertificate'
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
    isPaymentReceipt: {  
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

// Static method to create application with form data
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
    case 'taxation':
      validationResult = validateTaxation(formData);
      break;
    case 'no_outstanding_debts':
      validationResult = validateNoOutstandingDebts(formData);
      break;
    case 'housing_assessment_8':
      validationResult = validateHousingAssessment8(formData);
      break;
      
    case 'bpl_certificate':
      validationResult = validateBPLCertificate(formData);
      break;
    case 'niradhar_certificate':
      validationResult = validateNiradharCertificate(formData);
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
    case 'taxation':
      FormModel = mongoose.model('Taxation');
      formDataModel = 'Taxation';
      break;
    case 'no_outstanding_debts':
      FormModel = mongoose.model('NoOutstandingDebts');
      formDataModel = 'NoOutstandingDebts';
      break;
    case 'housing_assessment_8':
      FormModel = mongoose.model('HousingAssessment8');
      formDataModel = 'HousingAssessment8';
      break;
    case 'bpl_certificate':
      FormModel = mongoose.model('BPLCertificate');
      formDataModel = 'BPLCertificate';
      break;
    case 'niradhar_certificate':
      FormModel = mongoose.model('NiradharCertificate');
      formDataModel = 'NiradharCertificate';
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

// Taxation Validation
const validateTaxation = (data) => {
  const required = ['financialYear', 'applicantName', 'mobileNumber', 'taxPayerNumber', 'address', 'utrNumber'];
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

// Housing Assessment 8 Validation
const validateHousingAssessment8 = (data) => {
  const required = ['financialYear', 'applicantName', 'whatsappNumber', 'utrNumber', 'propertyNo', 'propertyName', 'occupantName', 'lengthInFeet', 'heightInFeet', 'totalAreaSqFt'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// BPL Certificate Validation
const validateBPLCertificate = (data) => {
  const required = ['financialYear', 'applicantName', 'aadhaarNumber', 'address', 'taluka', 'district', 'whatsappNumber', 'utrNumber', 'bplYear', 'bplListSerialNo'];
  const missing = required.filter(field => !data[field]);
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
};

// Niradhar Certificate Validation
const validateNiradharCertificate = (data) => {
  const required = ['financialYear', 'applicantName', 'aadhaarNumber', 'whatsappNumber', 'utrNumber', 'grampanchayatName', 'taluka', 'district'];
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