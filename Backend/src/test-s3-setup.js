// test-s3-setup.js
// Run this script to test your S3 configuration

import { 
  S3Client, 
  ListObjectsV2Command, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  CopyObjectCommand   // ✅ Added import
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Test functions
const tests = {
  // Test 1: Check environment variables
  checkEnvironment() {
    console.log(`${colors.blue}🔍 Testing environment variables...${colors.reset}`);
    
    const requiredVars = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY', 
      'AWS_REGION',
      'S3_BUCKET_NAME'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.log(`${colors.red}❌ Missing environment variables: ${missing.join(', ')}${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.green}✅ All environment variables present${colors.reset}`);
    return true;
  },

  // Test 2: Check bucket access
  async checkBucketAccess() {
    console.log(`${colors.blue}🔍 Testing bucket access...${colors.reset}`);
    
    try {
      const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        MaxKeys: 1
      });
      
      await s3Client.send(command);
      console.log(`${colors.green}✅ Bucket access successful${colors.reset}`);
      return true;
    } catch (error) {
      console.log(`${colors.red}❌ Bucket access failed: ${error.message}${colors.reset}`);
      return false;
    }
  },

  // Test 3: Test file upload to unverified folder
  async testUploadToUnverified() {
    console.log(`${colors.blue}🔍 Testing file upload to unverified folder...${colors.reset}`);
    
    try {
      const testFiles = [
        { content: 'This is a test PDF content.', name: 'test-document.pdf', type: 'application/pdf' },
        { content: 'This is a test image.', name: 'test-image.jpg', type: 'image/jpeg' },
        { content: 'This is a test document.', name: 'test-document.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ];
      
      const uploadedFiles = [];
      
      for (const testFile of testFiles) {
        const timestamp = Date.now();   // ✅ generate once
        const fileName = `${timestamp}-${testFile.name}`;
        
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `unverified/${fileName}`,
          Body: testFile.content,
          ContentType: testFile.type,
        });
        
        await s3Client.send(command);
        uploadedFiles.push(fileName);   // ✅ use the same name
      }
      
      console.log(`${colors.green}✅ Files uploaded successfully to unverified folder${colors.reset}`);
      return uploadedFiles;
    } catch (error) {
      console.log(`${colors.red}❌ File upload failed: ${error.message}${colors.reset}`);
      return false;
    }
  },

  // Test 4: Test moving file from unverified to verified
  async testMoveToVerified(fileName) {
    console.log(`${colors.blue}🔍 Testing file move to verified folder...${colors.reset}`);
    
    try {
      const sourceKey = `unverified/${fileName}`;
      const destKey = `verified/${fileName}`;
      
      const copyParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        CopySource: `${process.env.S3_BUCKET_NAME}/${sourceKey}`,
        Key: destKey,
      };

      const copyCommand = new CopyObjectCommand(copyParams);
      await s3Client.send(copyCommand);

      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: sourceKey,
      };

      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand);
      
      console.log(`${colors.green}✅ File moved to verified folder successfully${colors.reset}`);
      return destKey;
    } catch (error) {
      console.log(`${colors.red}❌ File move failed: ${error.message}${colors.reset}`);
      return false;
    }
  },

  // Test 5: Test certificate upload
  async testCertificateUpload() {
    console.log(`${colors.blue}🔍 Testing certificate upload...${colors.reset}`);
    
    try {
      const certificateContent = 'This is a generated certificate PDF content.';
      const fileName = `certificate-${Date.now()}.pdf`;
      
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `certificate/${fileName}`,
        Body: certificateContent,
        ContentType: 'application/pdf',
      });
      
      await s3Client.send(command);
      console.log(`${colors.green}✅ Certificate uploaded successfully${colors.reset}`);
      return fileName;
    } catch (error) {
      console.log(`${colors.red}❌ Certificate upload failed: ${error.message}${colors.reset}`);
      return false;
    }
  },

  // Test 6: Test folder listing
  async testFolderListing() {
    console.log(`${colors.blue}🔍 Testing folder listing for all folders...${colors.reset}`);
    
    const folders = ['unverified', 'verified', 'certificate'];
    const folderStats = {};
    
    try {
      for (const folder of folders) {
        const command = new ListObjectsV2Command({
          Bucket: process.env.S3_BUCKET_NAME,
          Prefix: `${folder}/`,
          MaxKeys: 100
        });
        
        const result = await s3Client.send(command);
        const fileCount = result.KeyCount || 0;
        
        folderStats[folder] = {
          count: fileCount,
          files: (result.Contents || []).map(file => ({
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified
          }))
        };
      }
      
      console.log(`${colors.green}✅ Folder listing successful${colors.reset}`);
      return folderStats;
    } catch (error) {
      console.log(`${colors.red}❌ Folder listing failed: ${error.message}${colors.reset}`);
      return false;
    }
  },

  // Test 7: Signed URL generation
  async testSignedUrls() {
    console.log(`${colors.blue}🔍 Testing signed URL generation for different folders...${colors.reset}`);
    
    try {
      const folders = ['unverified', 'verified', 'certificate'];
      let successCount = 0;
      
      for (const folder of folders) {
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.S3_BUCKET_NAME,
          Prefix: `${folder}/`,
          MaxKeys: 1
        });
        
        const listResult = await s3Client.send(listCommand);
        
        if (listResult.Contents && listResult.Contents.length > 0) {
          const fileKey = listResult.Contents[0].Key;
          
          const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
          });
          
          await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          console.log(`   ✅ ${folder} folder: Signed URL generated`);
          successCount++;
        } else {
          console.log(`   ℹ️  ${folder} folder: No files to test`);
        }
      }
      
      console.log(`${colors.green}✅ Signed URL generation test completed (${successCount} folders tested)${colors.reset}`);
      return true;
    } catch (error) {
      console.log(`${colors.red}❌ Signed URL generation failed: ${error.message}${colors.reset}`);
      return false;
    }
  },

  // Test 8: Cleanup
  async cleanup() {
    console.log(`${colors.blue}🔍 Cleaning up test files...${colors.reset}`);
    
    const folders = ['unverified', 'verified', 'certificate'];
    let cleanupCount = 0;
    
    try {
      for (const folder of folders) {
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.S3_BUCKET_NAME,
          Prefix: `${folder}/`,
          MaxKeys: 100
        });
        
        const listResult = await s3Client.send(listCommand);
        
        if (listResult.Contents && listResult.Contents.length > 0) {
          for (const file of listResult.Contents) {
            if (file.Key.includes('test-') || file.Key.includes('certificate-')) {
              const deleteCommand = new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: file.Key,
              });
              
              await s3Client.send(deleteCommand);
              cleanupCount++;
            }
          }
        }
      }
      
      console.log(`${colors.green}✅ Cleanup completed - ${cleanupCount} test files removed${colors.reset}`);
      return true;
    } catch (error) {
      console.log(`${colors.yellow}⚠️  Cleanup partially failed: ${error.message}${colors.reset}`);
      return false;
    }
  }
};

// Main test runner
async function runAllTests() {
  console.log(`${colors.blue}🚀 Starting S3 Three-Folder Configuration Tests...${colors.reset}\n`);
  
  let allPassed = true;
  let uploadedFiles = null;
  
  if (!tests.checkEnvironment()) {
    allPassed = false;
    return;
  }
  
  console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
  
  if (!await tests.checkBucketAccess()) {
    allPassed = false;
  } else {
    console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
    
    uploadedFiles = await tests.testUploadToUnverified();
    if (!uploadedFiles) {
      allPassed = false;
    } else {
      console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
      
      if (await tests.testMoveToVerified(uploadedFiles[0])) {
        console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
        
        if (await tests.testCertificateUpload()) {
          console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
          
          if (await tests.testFolderListing()) {
            console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
            
            if (!await tests.testSignedUrls()) {
              allPassed = false;
            }
          } else {
            allPassed = false;
          }
        } else {
          allPassed = false;
        }
      } else {
        allPassed = false;
      }
      
      console.log(`${colors.blue}────────────────────────────────────────${colors.reset}`);
      
      await tests.cleanup();
    }
  }
  
  console.log(`${colors.blue}\n════════════════════════════════════════${colors.reset}`);
  if (allPassed) {
    console.log(`${colors.green}🎉 ALL TESTS PASSED! Your S3 three-folder setup is working correctly.${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Some tests failed. Please check your S3 configuration.${colors.reset}`);
  }
  console.log(`${colors.blue}════════════════════════════════════════${colors.reset}`);
}

// Run the tests
(async () => {
  try {
    await runAllTests();
  } catch (error) {
    console.log(`${colors.red}💥 Unexpected error: ${error.message}${colors.reset}`);
  }
})();

export { s3Client, tests };
