import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { processUploadedFilesS3, moveFileToFolder, getFileDownloadUrl,getSecureFileUrl } from "../utils/s3Service.js";
import { notifyAdminNewApplication, notifyUserStatusUpdate } from "../utils/emailService.js";
import mongoose from "mongoose";
import crypto from "crypto";
import { Taxation } from "../models/taxation.model.js";

// Import models
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { BirthCertificate } from "../models/birthcertificate.model.js";
import { DeathCertificate } from "../models/deathcertificate.model.js";
import { MarriageCertificate } from "../models/marriagecertificate.model.js";
import { Notification } from "../models/notification.model.js";
import { HousingAssessment8 } from "../models/housingAssessment8.model.js";
import { BPLCertificate } from "../models/bplCertificate.model.js";
import { NiradharCertificate } from "../models/niradharCertificate.model.js";
import { NoOutstandingDebts } from "../models/noOutstandingDebts.model.js";

// Helper to generate unique application ID
const generateApplicationId = (prefix) => {
  const timestamp = Date.now().toString().slice(-6);
  const random = crypto.randomBytes(3).toString('hex');
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to create notification
const createNotification = async (userId, applicationId, type, title, message) => {
  try {
    const notification = await Notification.create({
      userId,
      applicationId,
      type,
      title,
      message
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Submit Birth Certificate Application (manual payment with receipt image)
const submitBirthCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    childName,
    dateOfBirth,
    placeOfBirth,
    gender,
    fatherName,
    motherName,
    applicantFullNameEnglish,
    applicantFullNameDevanagari,
    whatsappNumber,
    email,
    address,
    utrNumber,
    // Aadhaar removed
    permanentAddressParent,
    parentsAddressAtBirth,
    fatherOccupation,
    motherOccupation,
    // hospitalName removed
  } = req.body;
  
  // Basic validations
  if (!financialYear || !childName || !dateOfBirth || !fatherName || !motherName || !applicantFullNameEnglish || !applicantFullNameDevanagari || !whatsappNumber || !address || !utrNumber) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate date: accept dd-mm-yyyy or yyyy-mm-dd (HTML date)
  let birthDate;
  if (/^([0-2]\d|3[01])-([0-1]\d)-(\d{4})$/.test(dateOfBirth)) {
    const [dd, mm, yyyy] = dateOfBirth.split('-').map(Number);
    birthDate = new Date(yyyy, mm - 1, dd);
  } else if (/^(\d{4})-(\d{2})-(\d{2})$/.test(dateOfBirth)) {
    const [yyyy, mm, dd] = dateOfBirth.split('-').map(Number);
    birthDate = new Date(yyyy, mm - 1, dd);
  } else {
    throw new ApiError(400, "Invalid date format. Use dd-mm-yyyy or yyyy-mm-dd");
  }
  if (isNaN(birthDate.getTime())) {
    throw new ApiError(400, "Invalid date provided");
  }

  // birthTime removed

  // Validate email
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate whatsapp number (10 digits)
  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, "Invalid WhatsApp number. Must be 10 digits");
  }
  
  // Validate gender
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    throw new ApiError(400, "Invalid gender");
  }
  
  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }

  // Process uploaded files using S3 (receipt + optional documents) under 'unverified'
  const documentFiles = req.files && req.files.documents ? req.files.documents : [];
  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }
  const allFiles = [
    ...receiptFiles,
    ...documentFiles
  ];
  const uploadedFiles = await processUploadedFilesS3(allFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true; // Add flag to identify receipt
  }
  
  // Create application with unique ID
  const applicationId = generateApplicationId('BIRTH');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'birth_certificate',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };
  
  // Prepare form data
  const formData = {
    financialYear,
    childName,
    dateOfBirth: birthDate,
    placeOfBirth,
    // Aadhaar removed
    permanentAddressParent,
    parentsAddressAtBirth,
    gender,
    fatherName,
    motherName,
    applicantFullNameEnglish,
    applicantFullNameDevanagari,
    whatsappNumber,
    email,
    address,
    utrNumber,
    fatherOccupation,
    motherOccupation
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Birth Certificate Application Submitted',
    `Your application for ${childName}'s birth certificate has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "Birth certificate application submitted successfully")
  );
});

// Submit Death Certificate Application
const submitDeathCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    nameOfDeceased,
    aadhaarNumber,
    address,
    dateOfDeath,
    causeOfDeath,
    applicantFullNameEnglish,
    whatsappNumber,
    email,
    paymentOption,
    utrNumber
  } = req.body;
  
  if (!financialYear || !nameOfDeceased || !address || !dateOfDeath || !causeOfDeath || !applicantFullNameEnglish || !whatsappNumber || !utrNumber) {
    throw new ApiError(400, 'Missing required fields');
  }

  let parsedDate;
  if (/^([0-2]\d|3[01])-([0-1]\d)-(\d{4})$/.test(dateOfDeath)) {
    const [dd, mm, yyyy] = dateOfDeath.split('-').map(Number);
    parsedDate = new Date(yyyy, mm - 1, dd);
  } else if (/^(\d{4})-(\d{2})-(\d{2})$/.test(dateOfDeath)) {
    const [yyyy, mm, dd] = dateOfDeath.split('-').map(Number);
    parsedDate = new Date(yyyy, mm - 1, dd);
  } else {
    throw new ApiError(400, 'Invalid date format. Use dd-mm-yyyy or yyyy-mm-dd');
  }
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, 'Invalid date provided');
  }

  if (aadhaarNumber && !/^\d{12}$/.test(aadhaarNumber)) {
    throw new ApiError(400, 'Aadhaar must be 12 digits');
  }

  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, 'WhatsApp must be 10 digits');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Invalid email format');
  }

  if (paymentOption && paymentOption !== 'UPI') {
    throw new ApiError(400, 'Only UPI payment is supported currently');
  }

  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, 'Payment receipt image is required');
  }
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }
  const documentFiles = req.files && req.files.documents ? req.files.documents : [];
  const allFiles = [...receiptFiles, ...documentFiles];
  const uploadedFiles = await processUploadedFilesS3(allFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true; // Add flag to identify receipt
  }

  const applicationId = generateApplicationId('DEATH');
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'death_certificate',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };

  const formData = {
    financialYear,
    deceasedName: nameOfDeceased,
    aadhaarNumber,
    address,
    dateOfDeath: parsedDate,
    causeOfDeath,
    applicantFullNameEnglish,
    whatsappNumber,
    email,
    paymentOption: 'UPI',
    utrNumber
  };

  const application = await Application.createWithFormData(applicationData, formData);
  
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Death Certificate Application Submitted',
    `Your application for ${nameOfDeceased}'s death certificate has been submitted successfully.`
  );
  
  return res.status(201).json(
    new ApiResponse(201, application, 'Death certificate application submitted successfully')
  );
});

// Submit Marriage Certificate Application
const submitMarriageCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    dateOfMarriage, placeOfMarriage,
    HusbandName, HusbandAadhaar, HusbandAge, HusbandFatherName, HusbandAddress, HusbandOccupation,
    wifeName, wifeAadhaar, wifeAge, wifeFatherName, wifeAddress, wifeOccupation,
    applicantFullName, whatsappNumber, email, utrNumber
  } = req.body;
  
  // Basic validations
  if (!dateOfMarriage || !placeOfMarriage || !HusbandName || !HusbandAadhaar || !wifeName || !wifeAadhaar || !applicantFullName || !whatsappNumber || !utrNumber) {
    throw new ApiError(400, "Missing required fields");
  }
  
  // Validate date format
  const marriageDate = new Date(dateOfMarriage);
  if (isNaN(marriageDate.getTime())) {
    throw new ApiError(400, "Invalid date format for date of marriage");
  }
  
  // Validate ages
  if (isNaN(HusbandAge) || HusbandAge < 21) {
    throw new ApiError(400, "Groom's age must be at least 21 years");
  }
  
  if (isNaN(wifeAge) || wifeAge < 18) {
    throw new ApiError(400, "Bride's age must be at least 18 years");
  }
  
  // Validate Aadhaar numbers
  if (!/^\d{12}$/.test(HusbandAadhaar)) {
    throw new ApiError(400, "Husband's Aadhaar must be 12 digits");
  }
  
  if (!/^\d{12}$/.test(wifeAadhaar)) {
    throw new ApiError(400, "Wife's Aadhaar must be 12 digits");
  }
  
  // Validate WhatsApp number
  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, "WhatsApp number must be 10 digits");
  }
  
  // Validate email if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  
  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }
  
  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }
  
  // Process uploaded files using S3 (receipt + optional documents) under 'unverified'
  const documentFiles = req.files && req.files.documents ? req.files.documents : [];
  const allFiles = [
    ...receiptFiles,
    ...documentFiles
  ];
  const uploadedFiles = await processUploadedFilesS3(allFiles, 'unverified');
  
  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true; // Add flag to identify receipt
  }
  
  // Create application with unique ID
  const applicationId = generateApplicationId('MARRIAGE');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'marriage_certificate',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };
  
  // Prepare form data
  const formData = {
    dateOfMarriage: marriageDate,
    placeOfMarriage,
    HusbandName,
    HusbandAadhaar,
    HusbandAge: parseInt(HusbandAge),
    HusbandFatherName,
    HusbandAddress,
    HusbandOccupation,
    wifeName,
    wifeAadhaar,
    wifeAge: parseInt(wifeAge),
    wifeFatherName,
    wifeAddress,
    wifeOccupation,
    applicantFullName,
    whatsappNumber,
    email,
    utrNumber
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Marriage Certificate Application Submitted',
    `Your marriage certificate application for ${HusbandName} and ${wifeName} has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "Marriage certificate application submitted successfully")
  );
});

// --- UPDATED FOR PAGINATION ---
// Get user's applications
const getUserApplications = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Get page and limit from query, with defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9; // Default to 9 per page
  const skip = (page - 1) * limit;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  
  // Verify user is fetching their own applications (or is admin, if you add that logic)
  if (req.user._id.toString() !== userId) {
      throw new ApiError(403, "Unauthorized to access these applications");
  }

  // Create the query
  const query = { applicantId: userId };

  // Get total number of applications for this user
  const totalApplications = await Application.countDocuments(query);

  if (totalApplications === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        applications: [],
        currentPage: 1,
        totalPages: 0,
        totalApplications: 0
      }, "No applications found")
    );
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalApplications / limit);

  // Get the applications for the current page
  const applications = await Application.find(query)
    .sort({ createdAt: -1 }) // Show newest first
    .skip(skip)
    .limit(limit);

  // Send the paginated response
  return res.status(200).json(
    new ApiResponse(200, {
      applications,
      currentPage: page,
      totalPages,
      totalApplications
    }, "User applications retrieved successfully")
  );
});
// --- END OF PAGINATION UPDATE ---

// Admin Dashboard Functionalities
const reviewApplication = asyncHandler(async (req, res) => {
  const { status, adminRemarks } = req.body;
  const { applicationId } = req.params;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }
  if (!status || status !== 'approved' && status !== 'rejected') {
    throw new ApiError(400, "Invalid status value");
  }

  const application = await Application.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
      { applicationId }
    ]
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.status !== 'pending') {
    throw new ApiError(400, "Application is already reviewed");
  }

  application.status = status;
  application.adminRemarks = adminRemarks;
  application.reviewedAt = new Date();
  application.reviewedBy = req.user._id;
  await application.save();

  // If approved, move uploaded files from 'unverified' to 'verified' folder in S3
  if (status === 'approved' && application.uploadedFiles?.length > 0) {
    try {
      for (let i = 0; i < application.uploadedFiles.length; i++) {
        const file = application.uploadedFiles[i];
        if (file.s3Key?.startsWith('unverified/')) {
          const updatedFile = await moveFileToFolder(file.s3Key, 'verified');
          await application.updateFileLocation(i, updatedFile.newKey, 'verified');
        }
      }
    } catch (error) {
      console.error('Error moving files:', error);
    }
  }

  // Get Applicant details for email notification
  const applicant = await User.findById(application.applicantId);
  if (applicant) {
    await notifyUserStatusUpdate(application, applicant);
  }

  await Notification.findOneAndUpdate(
    { applicationId: application._id },
    {
      type: status === 'approved' ? 'application_approved' : 'application_rejected',
      title: status === 'approved' ? 'Application Approved' : 'Application Rejected',
      message: status === 'approved' 
        ? `Your ${application.documentType.replace('_', ' ')} application has been approved.` 
        : `Your ${application.documentType.replace('_', ' ')} application has been rejected. Reason: ${adminRemarks}`,
      isRead: false,
      emailSent: false,
      updatedAt: new Date()
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, { application }, `Application ${status} successfully`)
  );
});

// Upload certificate to S3 (goes into 'certificate' folder)
const uploadCertificate = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  // Upload certificate file into 'certificate' folder
  const uploadedFiles = await processUploadedFilesS3([req.file], 'certificate');
  
  if (!uploadedFiles || uploadedFiles.length === 0) {
    throw new ApiError(400, "Failed to process certificate file");
  }

  const application = await Application.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
      { applicationId }
    ]
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.status !== "approved") {
    throw new ApiError(400, "Application must be approved to upload certificate");
  }

  console.log("Uploaded Certificate:", uploadedFiles);
  const uploadedFile = uploadedFiles[0];

  application.generatedCertificate = {
    fileName: uploadedFile.fileName,
    filePath: uploadedFile.filePath,
    s3Key: uploadedFile.s3Key,
    folder: 'certificate',
    contentType: uploadedFile.contentType,
    fileSize: uploadedFile.fileSize,
    generatedAt: new Date(),
    downloadCount: 0
  };

  application.status = "certificate_generated";
  await application.save();

  // Create notification for the user
  await Notification.findOneAndUpdate(
    { applicationId: application._id },
    {
      type: 'Certificate Generated',
      title: 'Application Approved and Certificate Generated',
      message: `Your ${application.documentType.replace('_', ' ')} application has been approved and certificate has been generated.`,
      isRead: false,
      emailSent: false,
      updatedAt: new Date()
    },
    { new: true }
  );
  
  // Notify applicant by email
  const applicant = await User.findById(application.applicantId);
  if (applicant) {
    await notifyUserStatusUpdate(application, applicant);
  }
  
  return res.status(200).json(
    new ApiResponse(200, { application }, "Certificate uploaded successfully")
  );
});


// Get applications by status (for admin filtering)
const getApplicationsByStatus = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    throw new ApiError(403, "Unauthorized access");
  }
  
  const { status } = req.query;

  // --- PAGINATION LOGIC ---
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; // 10 per page
  const skip = (page - 1) * limit;
  // --- END PAGINATION ---
  
  // Build filter based on status
  const filter = {};
  if (status && ['pending', 'approved', 'certificate_generated', 'rejected', 'completed'].includes(status)) {
    filter.status = status;
  }
  
  // Get total count
  const totalApplications = await Application.countDocuments(filter);
  const totalPages = Math.ceil(totalApplications / limit);

  const applications = await Application.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip) // Apply skip
    .limit(limit) // Apply limit
    .populate('applicantId', 'fullName');

  // Convert to plain objects and ensure subdocuments are properly serialized
  const applicationsData = applications.map(app => {
    const appData = app.toObject();
    return {
      ...appData,
      uploadedFiles: appData.uploadedFiles || [],
      generatedCertificate: appData.generatedCertificate ? {
        fileName: appData.generatedCertificate.fileName,
        filePath: appData.generatedCertificate.filePath,
        s3Key: appData.generatedCertificate.s3Key,
        folder: appData.generatedCertificate.folder,
        contentType: appData.generatedCertificate.contentType,
        fileSize: appData.generatedCertificate.fileSize,
        generatedAt: appData.generatedCertificate.generatedAt,
        downloadCount: appData.generatedCertificate.downloadCount,
        lastDownloaded: appData.generatedCertificate.lastDownloaded
      } : null
    };
  });
  
  return res.status(200).json(
      new ApiResponse(200, {
        applications: applicationsData,
        currentPage: page,
        totalPages,
        totalApplications
      }, "Applications retrieved successfully")
    );
});

// Get admin's applications
const getAdminApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, "Unauthorized access");
  }
  // --- PAGINATION LOGIC ---
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  // --- END PAGINATION ---

  // Get total count
  const totalApplications = await Application.countDocuments(filter);
  const totalPages = Math.ceil(totalApplications / limit);
  
  const applications = await Application.find({
    status: {
      $in: ['pending', 'approved', 'certificate_generated', 'rejected', 'completed']
    }
  })
  .sort({ createdAt: -1 })
  .skip(skip) // Apply skip
  .limit(limit); // Apply limit

  // Convert to plain objects and ensure subdocuments are properly serialized
  const applicationsData = applications.map(app => {
    const appData = app.toObject();
    return {
      ...appData,
      uploadedFiles: appData.uploadedFiles || [],
      generatedCertificate: appData.generatedCertificate ? {
        fileName: appData.generatedCertificate.fileName,
        filePath: appData.generatedCertificate.filePath,
        s3Key: appData.generatedCertificate.s3Key,
        folder: appData.generatedCertificate.folder,
        contentType: appData.generatedCertificate.contentType,
        fileSize: appData.generatedCertificate.fileSize,
        generatedAt: appData.generatedCertificate.generatedAt,
        downloadCount: appData.generatedCertificate.downloadCount,
        lastDownloaded: appData.generatedCertificate.lastDownloaded
      } : null
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      applications: applicationsData,
      currentPage: page,
      totalPages,
      totalApplications
    }, "Admin applications retrieved successfully")
  );
});

// Get application details
// Optimized to return raw data without generating signed URLs upfront
// URLs are generated on-demand when user clicks on files to reduce AWS S3 costs
const getApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  
  // Find application by applicationId string instead of applicantId
  const application = await Application.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
      { applicationId: applicationId } // Search by application ID string
    ]
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Return raw application data without generating signed URLs upfront
  // URLs will be generated on-demand when user clicks on files
  const responseData = {
    ...application.toObject(),
    uploadedFiles: application.uploadedFiles.map(file => file.toObject()),
    generatedCertificate: application.generatedCertificate ? application.generatedCertificate.toObject() : null
  };

  // Also fetch the referenced form data and include it explicitly for client convenience
  let formData = null;
  try {
    if (application.formDataRef) {
      const form = await application.getFormData();
      formData = form ? form.toObject() : null;
    }
  } catch (e) {
    // Non-fatal; continue without form data
    formData = null;
  }

  return res.status(200).json(
    new ApiResponse(200, { application: responseData, formData }, "Application details retrieved successfully")
  );
});

// New function: Download file from S3
const downloadFile = asyncHandler(async (req, res) => {
  const { fileKey } = req.params;
  
  if (!fileKey) {
    throw new ApiError(400, "File key is required");
  }
  
  try {
    // Generate signed URL for download (1 hour expiry)
    const downloadUrl = await getFileDownloadUrl(fileKey, 3600);
    
    return res.status(200).json(
      new ApiResponse(200, { 
        downloadUrl, 
        fileKey,
        expiresIn: '1 hour',
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
      }, "Download URL generated successfully")
    );
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new ApiError(500, 'Failed to generate download URL');
  }
});

// New function: Get file status and details
const getFileDetails = asyncHandler(async (req, res) => {
  const { applicationId, fileIndex } = req.params;
  
  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }
  
  const application = await Application.findOne({ applicationId });
  
  if (!application) {
    throw new ApiError(404, "Application not found");
  }
  
  // Check authorization
  if (req.user.role !== 'admin' && application.applicantId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to view this application's files");
  }
  
  const fileIdx = parseInt(fileIndex);
  if (isNaN(fileIdx) || fileIdx < 0 || fileIdx >= application.uploadedFiles.length) {
    throw new ApiError(400, "Invalid file index");
  }
  
  const file = application.uploadedFiles[fileIdx];
  
  // Generate download URL if file exists
  let downloadUrl = null;
  if (file.s3Key) {
    try {
      downloadUrl = await getFileDownloadUrl(file.s3Key, 3600);
    } catch (error) {
      console.error('Error generating download URL:', error);
    }
  }
  
  return res.status(200).json(
    new ApiResponse(200, { 
      file: {
        ...file,
        downloadUrl,
        downloadExpiry: downloadUrl ? new Date(Date.now() + 3600 * 1000).toISOString() : null
      }
    }, "File details retrieved successfully")
  );
});

// New function: Get signed URL(s)
// - If query has applicationId, return ONLY the generated certificate's signed URL for that application
// - Otherwise, return a list of signed URLs across the user's applications
const getFileUrls = asyncHandler(async (req, res) => {
  const { applicationId } = req.query;
  console.log("controller hit",applicationId)

  // Single certificate URL for a specific application (used by "View Certificate")
  if (applicationId) {
    const application = await Application.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
        { applicationId }
      ]
    });

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    // Authorization: owner or admin
    if (
      req.user.role !== 'admin' &&
      application.applicantId.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, "Unauthorized access");
    }

    if (!application.generatedCertificate?.s3Key && !application.generatedCertificate?.filePath) {
      throw new ApiError(404, "Certificate not available yet");
    }

    try {
      const url = await getSecureFileUrl(
        application.generatedCertificate.s3Key || application.generatedCertificate.filePath
      );
      
      return res.status(200).json(
        new ApiResponse(200, { url }, "Certificate URL generated successfully")
      );
    } catch (error) {
      console.error('Error generating certificate URL:', error);
      if (error.message.includes('File not found') || error.message.includes('NoSuchKey')) {
        throw new ApiError(404, "Certificate file not found in storage");
      }
      throw new ApiError(500, "Failed to generate certificate URL");
    }
  }

  // Fallback: aggregate signed URLs across all user's applications (admin gets all their own; not cross-tenant)
  const applications = await Application.find({ applicantId: req.user._id });

  let allUrls = [];
  for (const application of applications) {
    // Fix incorrect call: use model method getSignedUrls
    const urls = await application.getSignedUrls();
    allUrls = [...allUrls, ...urls];
  }

  return res.status(200).json(
    new ApiResponse(200, allUrls, "File URLs generated successfully")
  );
});

// New function: Generate signed URL for a specific file on-demand
const generateFileSignedUrl = asyncHandler(async (req, res) => {
  const { applicationId, fileId, fileType } = req.params;

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  // Find the application
  const application = await Application.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
      { applicationId }
    ]
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Authorization: owner or admin
  if (
    req.user.role !== 'admin' &&
    application.applicantId.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Unauthorized access");
  }

  let filePath;
  let fileName;

  // Determine fileType from param or path
  const detectedType = fileType || (req.path.includes('/certificate/') ? 'certificate' : (req.path.includes('/receipt/') ? 'receipt' : undefined));

  if (detectedType === 'certificate') {
    if (!application.generatedCertificate?.filePath) {
      throw new ApiError(404, "Certificate not found or not yet generated");
    }
    filePath = application.generatedCertificate.filePath;
    fileName = application.generatedCertificate.fileName;
  } else if (detectedType === 'receipt') {
    const receiptUrl = application.paymentDetails?.receiptUrl;
    if (!receiptUrl) {
      throw new ApiError(404, "Payment receipt not found");
    }
    filePath = receiptUrl;
    fileName = 'payment-receipt';
  } else {
    // Handle uploaded files by fileId
    const file = application.uploadedFiles.find(f => f._id.toString() === fileId);
    if (!file) {
      throw new ApiError(404, "File not found");
    }
    if (!file.filePath) {
      throw new ApiError(404, "File path not available");
    }
    filePath = file.filePath;
    fileName = file.originalName;
  }

  try {
    const signedUrl = await getSecureFileUrl(filePath);
    
    return res.status(200).json(
      new ApiResponse(200, { 
        url: signedUrl,
        fileName: fileName,
        expiresIn: '1 hour'
      }, "Signed URL generated successfully")
    );
  } catch (error) {
    console.error('Error generating signed URL:', error);
    if (error.message.includes('File not found') || error.message.includes('NoSuchKey')) {
      throw new ApiError(404, "File not found in storage");
    }
    throw new ApiError(500, "Failed to generate signed URL");
  }
});

// Generate signed URL for payment receipt - based on robust certificate logic
const generatePaymentReceiptSignedUrl = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  console.log("controllerhit")

  if (!applicationId) {
    throw new ApiError(400, "Application ID is required");
  }

  // Find the application using the same robust logic as certificate
  const application = await Application.findOne({
    $or: [
      { _id: mongoose.isValidObjectId(applicationId) ? applicationId : null },
      { applicationId }
    ]
  });
  console.log("Application:",application);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Authorization: owner or admin (same as certificate logic)
  if (
    req.user.role !== 'admin' &&
    application.applicantId.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Unauthorized access");
  }

  // Check if payment receipt exists (similar to certificate check)
  if (!application.paymentDetails?.receiptUrl) {
    throw new ApiError(404, "Payment receipt not available yet");
  }


  try {
    // Use the same robust signing logic as certificate
    const url = await getSecureFileUrl(application.paymentDetails.receiptUrl);
    console.log(url);
    return res.status(200).json(
      new ApiResponse(200, { url }, "Payment receipt URL generated successfully")
    );
  } catch (error) {
    console.error('Error generating payment receipt URL:', error);
    if (error.message.includes('File not found') || error.message.includes('NoSuchKey')) {
      throw new ApiError(44, "Payment receipt file not found in storage");
    }
    throw new ApiError(500, "Failed to generate payment receipt URL");
  }
});

// Submit Taxation Application
const submitTaxationApplication = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    applicantName,
    mobileNumber,
    email,
    taxPayerNumber,
    address,
    groupName,
    groupType,
    oldTaxNumber,
    newTaxNumber,
    utrNumber
  } = req.body;
  
  // Basic validations
  if (!financialYear || !applicantName || !mobileNumber || !taxPayerNumber || 
      !address || !utrNumber) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate mobile number (10 digits)
  if (!/^\d{10}$/.test(mobileNumber)) {
    throw new ApiError(400, "Invalid mobile number. Must be 10 digits");
  }

  // Validate email if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }

  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }

  // Validate file size (max 5MB)
  if (receiptFiles[0].size > 5 * 1024 * 1024) {
    throw new ApiError(400, 'Payment receipt must be less than 5MB');
  }

  // Process uploaded files using S3 (receipt + optional documents) under 'unverified'
  const documentFiles = req.files && req.files.documents ? req.files.documents : [];
  
  // Validate maximum 5 additional documents
  if (documentFiles.length > 5) {
    throw new ApiError(400, 'Maximum 5 additional documents allowed');
  }

  const allFiles = [
    ...receiptFiles,
    ...documentFiles
  ];
  const uploadedFiles = await processUploadedFilesS3(allFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true; // Add flag to identify receipt
  }

  // Create application with unique ID
  const applicationId = generateApplicationId('TAX');

  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'taxation',
    uploadedFiles,
    paymentDetails: {
      amount: 20, // Adjust the amount as per your requirement
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };

  // Prepare form data
  const formData = {
    financialYear,
    applicantName,
    mobileNumber,
    email,
    taxPayerNumber,
    address,
    groupName,
    groupType,
    oldTaxNumber,
    newTaxNumber,
    utrNumber
  };

  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);

  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Taxation Application Submitted',
    `Your taxation application has been submitted successfully for ${applicantName}.`
  );

  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);

  return res.status(201).json(
    new ApiResponse(201, application, "Taxation application submitted successfully")
  );
});

// Submit Certificate of No Outstanding Debts Application
const submitNoOutstandingDebtsApplication = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    propertyOwnerName,
    aadhaarCardNumber,
    whatsappNumber,
    email,
    villageName,
    wardNo,
    streetNameNumber,
    propertyNumber,
    applicantFullNameEnglish,
    applicantAadhaarNumber,
    utrNumber,
    paymentOption
  } = req.body;
  
  // Basic validations
  if (!financialYear || !propertyOwnerName || !aadhaarCardNumber || !whatsappNumber || !villageName || !wardNo || !streetNameNumber || !propertyNumber || !applicantFullNameEnglish || !applicantAadhaarNumber || !utrNumber) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate Aadhaar numbers
  if (!/^\d{12}$/.test(aadhaarCardNumber)) {
    throw new ApiError(400, "Property owner's Aadhaar must be 12 digits");
  }
  
  if (!/^\d{12}$/.test(applicantAadhaarNumber)) {
    throw new ApiError(400, "Applicant's Aadhaar must be 12 digits");
  }

  // Validate email
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate whatsapp number (10 digits)
  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, "Invalid WhatsApp number. Must be 10 digits");
  }
  
  // Validate payment option
  if (paymentOption && paymentOption !== 'UPI') {
    throw new ApiError(400, "Only UPI payment is supported currently");
  }
  
  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }

  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }
  
  // Process uploaded files using S3 under 'unverified'
  const uploadedFiles = await processUploadedFilesS3(receiptFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true;
  }
  
  // Create application with unique ID
  const applicationId = generateApplicationId('NODEBTS');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'no_outstanding_debts',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };
  
  // Prepare form data
  const formData = {
    financialYear,
    propertyOwnerName,
    aadhaarCardNumber,
    whatsappNumber,
    email,
    villageName,
    wardNo,
    streetNameNumber,
    propertyNumber,
    applicantFullNameEnglish,
    applicantAadhaarNumber,
    utrNumber,
    paymentOption: 'UPI'
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'No Outstanding Debts Certificate Application Submitted',
    `Your application for certificate of no outstanding debts has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "No outstanding debts certificate application submitted successfully")
  );
});

// Submit Housing Assessment 8 Application
const submitHousingAssessment8Application = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    applicantName,
    whatsappNumber,
    email,
    utrNumber,
    propertyNo,
    descriptionNo,
    propertyName,
    occupantName,
    lengthInFeet,
    heightInFeet,
    totalAreaSqFt
  } = req.body;
  
  // Basic validations
  if (!financialYear || !applicantName || !whatsappNumber || !utrNumber || 
      !propertyNo || !propertyName || !occupantName || !lengthInFeet || 
      !heightInFeet || !totalAreaSqFt) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate whatsapp number (10 digits)
  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, "Invalid WhatsApp number. Must be 10 digits");
  }

  // Validate email if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate numeric fields
  if (isNaN(lengthInFeet) || isNaN(heightInFeet) || isNaN(totalAreaSqFt)) {
    throw new ApiError(400, "Length, height, and total area must be valid numbers");
  }

  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }

  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }

  // Process uploaded files using S3 under 'unverified'
  const uploadedFiles = await processUploadedFilesS3(receiptFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true;
  }

  // Create application with unique ID
  const applicationId = generateApplicationId('HOUSE8');

  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'housing_assessment_8',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };

  // Prepare form data
  const formData = {
    financialYear,
    applicantName,
    whatsappNumber,
    email,
    utrNumber,
    propertyNo,
    descriptionNo,
    propertyName,
    occupantName,
    lengthInFeet: parseFloat(lengthInFeet),
    heightInFeet: parseFloat(heightInFeet),
    totalAreaSqFt: parseFloat(totalAreaSqFt)
  };

  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);

  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Housing Assessment 8 Application Submitted',
    `Your housing assessment 8 application has been submitted successfully.`
  );

  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);

  return res.status(201).json(
    new ApiResponse(201, application, "Housing assessment 8 application submitted successfully")
  );
});

// Submit BPL Certificate Application
const submitBPLCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    applicantName,
    aadhaarNumber,
    address,
    taluka,
    district,
    whatsappNumber,
    email,
    utrNumber,
    bplYear,
    bplListSerialNo
  } = req.body;
  
  // Basic validations
  if (!financialYear || !applicantName || !aadhaarNumber || !address || 
      !taluka || !district || !whatsappNumber || !utrNumber || 
      !bplYear || !bplListSerialNo) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate Aadhaar number
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    throw new ApiError(400, "Aadhaar number must be 12 digits");
  }

  // Validate whatsapp number (10 digits)
  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, "Invalid WhatsApp number. Must be 10 digits");
  }

  // Validate email if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }

  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }

  // Process uploaded files using S3 under 'unverified'
  const uploadedFiles = await processUploadedFilesS3(receiptFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true;
  }

  // Create application with unique ID
  const applicationId = generateApplicationId('BPL');

  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'bpl_certificate',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };

  // Prepare form data
  const formData = {
    financialYear,
    applicantName,
    aadhaarNumber,
    address,
    taluka,
    district,
    whatsappNumber,
    email,
    utrNumber,
    bplYear,
    bplListSerialNo
  };

  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);

  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'BPL Certificate Application Submitted',
    `Your BPL certificate application has been submitted successfully.`
  );

  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);

  return res.status(201).json(
    new ApiResponse(201, application, "BPL certificate application submitted successfully")
  );
});

// Submit Niradhar Certificate Application
const submitNiradharCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    financialYear,
    applicantName,
    aadhaarNumber,
    whatsappNumber,
    email,
    utrNumber,
    grampanchayatName,
    taluka,
    district
  } = req.body;
  
  // Basic validations
  if (!financialYear || !applicantName || !aadhaarNumber || !whatsappNumber || 
      !utrNumber || !grampanchayatName || !taluka || !district) {
    throw new ApiError(400, "Missing required fields");
  }

  // Validate Aadhaar number
  if (!/^\d{12}$/.test(aadhaarNumber)) {
    throw new ApiError(400, "Aadhaar number must be 12 digits");
  }

  // Validate whatsapp number (10 digits)
  if (!/^\d{10}$/.test(whatsappNumber)) {
    throw new ApiError(400, "Invalid WhatsApp number. Must be 10 digits");
  }

  // Validate email if provided
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Require payment receipt image
  const receiptFiles = (req.files && (req.files.paymentReceipt || [])) || [];
  if (receiptFiles.length === 0) {
    throw new ApiError(400, "Payment receipt image is required");
  }

  // Enforce images-only for receipt
  const allowedImageTypes = ['image/jpeg','image/jpg','image/png'];
  if (!allowedImageTypes.includes(receiptFiles[0].mimetype)) {
    throw new ApiError(400, 'Payment receipt must be a JPG or PNG image');
  }

  // Process uploaded files using S3 under 'unverified'
  const uploadedFiles = await processUploadedFilesS3(receiptFiles, 'unverified');

  // Mark the receipt file for easy identification
  const receiptUpload = uploadedFiles.find(f => f.originalName === receiptFiles[0].originalname) || uploadedFiles[0];
  if (receiptUpload) {
    receiptUpload.isPaymentReceipt = true;
  }

  // Create application with unique ID
  const applicationId = generateApplicationId('NIRADHAR');

  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'niradhar_certificate',
    uploadedFiles,
    paymentDetails: {
      amount: 20,
      paymentStatus: 'completed',
      utrNumber,
      receiptUrl: receiptUpload?.filePath || receiptUpload?.s3Key || ''
    }
  };

  // Prepare form data
  const formData = {
    financialYear,
    applicantName,
    aadhaarNumber,
    whatsappNumber,
    email,
    utrNumber,
    grampanchayatName,
    taluka,
    district
  };

  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);

  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Niradhar Certificate Application Submitted',
    `Your Niradhar certificate application has been submitted successfully.`
  );

  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);

  return res.status(201).json(
    new ApiResponse(201, application, "Niradhar certificate application submitted successfully")
  );
});


export {
  getAdminApplications,
  submitBirthCertificateApplication,
  submitDeathCertificateApplication,
  submitMarriageCertificateApplication,
  getUserApplications,
  submitTaxationApplication,
  submitNoOutstandingDebtsApplication,
  submitHousingAssessment8Application,
  submitBPLCertificateApplication,
  submitNiradharCertificateApplication,
  getApplicationDetails,
  reviewApplication,
  uploadCertificate,
  getApplicationsByStatus,
  downloadFile,
  getFileDetails,
  getFileUrls,
  generateFileSignedUrl,
  generatePaymentReceiptSignedUrl
};