import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { processUploadedFilesS3, moveFileToFolder, getFileDownloadUrl,getSecureFileUrl } from "../utils/s3Service.js";
import { notifyAdminNewApplication, notifyUserStatusUpdate } from "../utils/emailService.js";
import mongoose from "mongoose";
import crypto from "crypto";

// Import models
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { BirthCertificate } from "../models/birthcertificate.model.js";
import { DeathCertificate } from "../models/deathcertificate.model.js";
import { MarriageCertificate } from "../models/marriagecertificate.model.js";
import { Notification } from "../models/notification.model.js";

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

// Submit Birth Certificate Application
const submitBirthCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    childName, dateOfBirth, placeOfBirth, gender, motherAdharNumber, parentsAddressAtBirth,
    fatherName, fatherAdharNumber, permanentAddressParent, motherName, fatherOccupation, 
    motherOccupation, hospitalName 
  } = req.body;
  
  // Validate date format
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) {
    console.log(dateOfBirth);
    throw new ApiError(400, "Invalid date format for date of birth");
  }
  
  // Validate gender
  const trimmedGender = gender.trim();
  console.log("Trimmed Gender:", trimmedGender);
  if(gender !== 'Male' && gender !== 'Female' && gender !== 'Other'){
    throw new ApiError(400, "Invalid gender");
  }
  
  // Process uploaded files using S3 (files start as 'unverified')
  const uploadedFiles = await processUploadedFilesS3(req.files, 'unverified');
  
  // Create application with unique ID
  const applicationId = generateApplicationId('BIRTH');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'birth_certificate',
    uploadedFiles
  };
  
  // Prepare form data
  const formData = {
    childName,
    dateOfBirth: birthDate,
    placeOfBirth,
    motherAdharNumber: motherAdharNumber || "",
    fatherAdharNumber: fatherAdharNumber || "",
    permanentAddressParent,
    parentsAddressAtBirth,
    gender,
    fatherName,
    motherName,
    fatherOccupation,
    motherOccupation,
    hospitalName
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  console.log(application);
  
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
    deceasedName, dateOfDeath, addressOfDeath, placeOfDeath, age, gender, causeOfDeath, deceasedAdharNumber,
    fatherName, motherName, spouseName, spouseAdhar, motherAdhar, fatherAdhar, permanentAddress 
  } = req.body;
  
  // Validate date format
  const deathDate = new Date(dateOfDeath);
  if (isNaN(deathDate.getTime())) {
    throw new ApiError(400, "Invalid date format for date of death");
  }
  
  // Validate age
  if (isNaN(age) || age < 0) {
    throw new ApiError(400, "Age must be a positive number");
  }
  
  // Validate gender
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    throw new ApiError(400, "Gender must be Male, Female, or Other");
  }
  
  // Process uploaded files using S3 (files start as 'unverified')
  const uploadedFiles = await processUploadedFilesS3(req.files, 'unverified');
  
  // Create application with unique ID
  const applicationId = generateApplicationId('DEATH');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'death_certificate',
    uploadedFiles
  };
  
  // Prepare form data
  const formData = {
    deceasedName,
    deceasedAdharNumber,
    dateOfDeath: deathDate,
    addressOfDeath,
    placeOfDeath,
    age: parseInt(age),
    gender,
    causeOfDeath,
    fatherName,
    motherName,
    spouseName: spouseName || "",
    spouseAdhar: spouseAdhar || "",
    fatherAdhar: fatherAdhar || "",
    motherAdhar: motherAdhar || "",
    permanentAddress,
  };
  
  // Create application with form data using the static method
  const application = await Application.createWithFormData(applicationData, formData);
  
  // Create notification for user
  await createNotification(
    req.user._id,
    application._id,
    'application_submitted',
    'Death Certificate Application Submitted',
    `Your application for ${deceasedName}'s death certificate has been submitted successfully.`
  );
  
  // Notify admin about new application
  await notifyAdminNewApplication(application, req.user.fullName);
  
  return res.status(201).json(
    new ApiResponse(201, application, "Death certificate application submitted successfully")
  );
});

// Submit Marriage Certificate Application
const submitMarriageCertificateApplication = asyncHandler(async (req, res) => {
  const { 
    dateOfMarriage, placeOfMarriage,
    HusbandName, HusbandAge, HusbandFatherName, HusbandAddress, HusbandOccupation,
    wifeName, wifeAge, wifeFatherName, wifeAddress, wifeOccupation, SolemnizedOn,
  } = req.body;
  
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
  
  // Process uploaded files using S3 (files start as 'unverified')
  const uploadedFiles = await processUploadedFilesS3(req.files, 'unverified');
  
  // Create application with unique ID
  const applicationId = generateApplicationId('MARRIAGE');
  
  // Prepare application data
  const applicationData = {
    applicationId,
    applicantId: req.user._id,
    documentType: 'marriage_certificate',
    uploadedFiles
  };
  
  // Prepare form data
  const formData = {
    dateOfMarriage: marriageDate,
    placeOfMarriage,
    HusbandName,
    HusbandAge: parseInt(HusbandAge),
    HusbandFatherName,
    HusbandAddress,
    HusbandOccupation,
    wifeName,
    wifeAge: parseInt(wifeAge),
    wifeFatherName,
    wifeAddress,
    wifeOccupation,
    SolemnizedOn,
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

// Get user's applications
const getUserApplications = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const applications = await Application.find({
    applicantId: userId,
  });

  return res.status(200).json(
    new ApiResponse(200, applications, "User applications retrieved successfully")
  );
});

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
  
  // Build filter based on status
  const filter = {};
  if (status && ['pending', 'approved', 'certificate_generated', 'rejected', 'completed'].includes(status)) {
    filter.status = status;
  }
  
  const applications = await Application.find(filter)
    .sort({ createdAt: -1 })
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
    new ApiResponse(200, applicationsData, "Applications retrieved successfully")
  );
});

// Get admin's applications
const getAdminApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, "Unauthorized access");
  }
  
  const applications = await Application.find({
    status: {
      $in: ['pending', 'approved', 'certificate_generated', 'rejected', 'completed']
    }
  })
  .sort({ createdAt: -1 });

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
    new ApiResponse(200, applicationsData, "Admin applications retrieved successfully")
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

  // Handle certificate files
  if (fileType === 'certificate') {
    if (!application.generatedCertificate?.filePath) {
      throw new ApiError(404, "Certificate not found or not yet generated");
    }
    filePath = application.generatedCertificate.filePath;
    fileName = application.generatedCertificate.fileName;
  } else {
    // Handle uploaded files
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

export {
  getAdminApplications,
  submitBirthCertificateApplication,
  submitDeathCertificateApplication,
  submitMarriageCertificateApplication,
  getUserApplications,
  getApplicationDetails,
  reviewApplication,
  uploadCertificate,
  getApplicationsByStatus,
  downloadFile,
  getFileDetails,
  getFileUrls,
  generateFileSignedUrl
};