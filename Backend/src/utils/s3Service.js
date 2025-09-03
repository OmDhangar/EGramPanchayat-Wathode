// utils/s3Service.js
import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { url } from 'inspector';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const urlCache = new Map();
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

/**
 * Get content type based on file extension
 * @param {string} fileName - File name with extension
 * @returns {string} MIME type
 */
const getContentType = (fileName) => {
  const extension = fileName.toLowerCase().split('.').pop();
  const contentTypes = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword'
  };
  return contentTypes[extension] || 'application/octet-stream';
};

/**
 * Upload file to S3 with specified folder and auto-detect content type
 * @param {string} filePath - Local file path
 * @param {string} fileName - Original file name
 * @param {string} folder - S3 folder ('unverified', 'verified', or 'certificate')
 * @returns {Object} Upload result with S3 details
 */
const uploadToS3 = async (filePath, fileName, folder = 'unverified') => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found at specified path');
    }

    // Validate folder
    const allowedFolders = ['unverified', 'verified', 'certificate'];
    if (!allowedFolders.includes(folder)) {
      throw new Error(`Invalid folder. Must be one of: ${allowedFolders.join(', ')}`);
    }

    const fileContent = fs.readFileSync(filePath);
    const timestamp = Date.now();
    const fileKey = `${folder}/${timestamp}-${fileName}`;
    const contentType = getContentType(fileName);
    
    const uploadParams = {
  Bucket: S3_BUCKET_NAME,
  Key: fileKey,
  Body: fileContent,
  ContentType: contentType,
  ServerSideEncryption: "AES256",   // 🔐 added
  Metadata: {
    originalName: fileName,
    uploadedAt: new Date().toISOString(),
    folder: folder,
    contentType: contentType
  }
};


    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    // Clean up local file after successful upload
    fs.unlinkSync(filePath);
    
    return {
      key: fileKey,
      bucket: S3_BUCKET_NAME,
      location: `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
      originalName: fileName,
      folder: folder,
      contentType: contentType
    };
  } catch (error) {
    // Clean up local file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

/**
 * Move file from one folder to another in S3
 * @param {string} currentKey - Current S3 key
 * @param {string} newFolder - New folder ('unverified', 'verified', or 'certificate')
 * @returns {Object} New file details
 */
const moveFileToFolder = async (currentKey, newFolder) => {
  try {
    // Validate folder
    const allowedFolders = ['unverified', 'verified', 'certificate'];
    if (!allowedFolders.includes(newFolder)) {
      throw new Error(`Invalid folder. Must be one of: ${allowedFolders.join(', ')}`);
    }

    // Extract filename from current key (remove folder prefix and timestamp if present)
    const fileName = currentKey.split('/').pop();
    const newKey = `${newFolder}/${fileName}`;

    // Copy the object to new location
    const copyParams = {
  Bucket: S3_BUCKET_NAME,
  CopySource: `${S3_BUCKET_NAME}/${currentKey}`,
  Key: newKey,
  ServerSideEncryption: "AES256",   // 🔐 added
  MetadataDirective: "REPLACE",
  Metadata: {
    originalName: fileName.substring(fileName.indexOf('-') + 1),
    folder: newFolder,
    movedAt: new Date().toISOString()
  }
};


    const copyCommand = new CopyObjectCommand(copyParams);
    await s3Client.send(copyCommand);

    // Delete the original object
    const deleteParams = {
      Bucket: S3_BUCKET_NAME,
      Key: currentKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);

    return {
      oldKey: currentKey,
      newKey: newKey,
      folder: newFolder,
      location: `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`
    };
  } catch (error) {
    throw new Error(`Failed to move file to ${newFolder}: ${error.message}`);
  }
};

/**
 * Generate signed URL with caching
 * @param {string} fileKey - S3 file key
 * @param {number} expiresIn - URL expiry time in seconds
 * @returns {Promise<string>} Signed URL
 */
const getFileDownloadUrl = async (fileKey, expiresIn = 3600) => {
  try {
    const cacheKey = `${fileKey}-${expiresIn}`;
    const cachedUrl = urlCache.get(cacheKey);

    if (cachedUrl?.url && cachedUrl.expiry > Date.now()) {
      return cachedUrl.url;
    }

    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      ResponseContentDisposition:'attachment'
    });

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn,
      signableHeaders: new Set(['host'])
     });
     //cache the url
     urlCache.set(cacheKey,{
      url:signedUrl,
      expiry: Date.now()+ (expiresIn *1000)
     });
    return signedUrl;
  } catch (error) {
    throw new Error(`Failed to generate download URL: ${error.message}`);
  }
};

/**
 * List files by folder
 * @param {string} folder - Folder name ('unverified', 'verified', 'certificate', or 'all')
 * @param {number} limit - Maximum number of files to return
 * @returns {Array} Array of file objects
 */
const listFilesByFolder = async (folder = 'all', limit = 1000) => {
  try {
    const listParams = {
      Bucket: S3_BUCKET_NAME,
      MaxKeys: limit
    };

    // Add prefix if specific folder requested
    if (folder !== 'all') {
      const allowedFolders = ['unverified', 'verified', 'certificate'];
      if (!allowedFolders.includes(folder)) {
        throw new Error(`Invalid folder. Must be one of: ${allowedFolders.join(', ')}, or 'all'`);
      }
      listParams.Prefix = `${folder}/`;
    }

    const command = new ListObjectsV2Command(listParams);
    const result = await s3Client.send(command);

    const files = (result.Contents || []).map(file => {
      const fileParts = file.Key.split('/');
      const fileFolder = fileParts[0];
      const fileName = fileParts.slice(1).join('/');

      // Extract original filename (remove timestamp prefix if present)
      let originalName = fileName;
      const timestampMatch = fileName.match(/^\d+-(.+)$/);
      if (timestampMatch) {
        originalName = timestampMatch[1];
      }

      // Determine file type from extension
      const extension = originalName.toLowerCase().split('.').pop();
      const fileType = getFileType(extension);

      return {
        key: file.Key,
        fileName: fileName,
        originalName: originalName,
        size: file.Size,
        lastModified: file.LastModified,
        folder: fileFolder,
        fileType: fileType,
        extension: extension,
        downloadUrl: `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
      };
    });

    return files;
  } catch (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

/**
 * Get file type category from extension
 * @param {string} extension - File extension
 * @returns {string} File type category
 */
const getFileType = (extension) => {
  const types = {
    'pdf': 'PDF Document',
    'jpg': 'Image',
    'jpeg': 'Image', 
    'png': 'Image',
    'docx': 'Word Document',
    'doc': 'Word Document'
  };
  return types[extension.toLowerCase()] || 'Unknown';
};

/**
 * Delete file from S3
 * @param {string} fileKey - S3 file key
 * @returns {boolean} Success status
 */
const deleteFile = async (fileKey) => {
  try {
    const deleteParams = {
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);
    
    return true;
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Check if file exists in S3
 * @param {string} fileKey - S3 file key
 * @returns {boolean} File existence status
 */
const fileExists = async (fileKey) => {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return false;
    }
    throw error;
  }
};

/**
 * Process uploaded files using S3 (replacement for processUploadedFiles function)
 * @param {Array} files - Array of multer file objects
 * @param {string} folder - Target folder ('unverified', 'verified', or 'certificate')
 * @returns {Array} Array of processed file objects
 */
const processUploadedFilesS3 = async (files, folder = 'unverified') => {
  if (!files || !files.length) return [];
  
  const uploadedFiles = [];
  
  for (const file of files) {
    const localPath = file.path;
    if (!localPath) continue;
    
    try {
      const s3Response = await uploadToS3(localPath, file.originalname, folder);
      
      if (s3Response) {
        uploadedFiles.push({
          fileName: s3Response.key,
          originalName: file.originalname,
          filePath: s3Response.location,
          fileType: file.mimetype,
          fileSize: file.size,
          s3Key: s3Response.key,
          folder: folder,
          contentType: s3Response.contentType
        });
      }
    } catch (error) {
      console.error(`Error uploading file ${file.originalname}:`, error);
      // Continue with other files even if one fails
    }
  }
  
  return uploadedFiles;
};

/**
 * Get secure URL for file access - handles both stored URLs and S3 keys
 * @param {string} filePathOrKey - Either full S3 URL or key
 * @returns {Promise<string>} Signed URL
 */
const getSecureFileUrl = async (filePathOrKey) => {
  try {
    // Extract key if full URL was stored
    let key = filePathOrKey;
    if (filePathOrKey.includes('.amazonaws.com')) {
      key = filePathOrKey.split('.amazonaws.com/')[1];
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ResponseContentDisposition: 'inline'
    });

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // 1 hour
    });

    console.log(signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error generating secure URL:", error);
    throw new Error(`Failed to generate secure URL: ${error.message}`);
  }
};

export {
  uploadToS3,
  moveFileToFolder,
  getFileDownloadUrl,
  listFilesByFolder,
  deleteFile,
  fileExists,
  processUploadedFilesS3,
  getContentType,
  getFileType,
  s3Client,
  getSecureFileUrl
};