import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAdminApplications,
  getApplicationsByStatus,
  reviewApplication,
  uploadCertificate,
  submitBirthCertificateApplication,
  submitDeathCertificateApplication,
  submitMarriageCertificateApplication,
  getUserApplications,
  getApplicationDetails,
  getFileUrls,
  generateFileSignedUrl
} from "../controllers/application.controllers.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {getSecureFileUrl} from "../utils/s3Service.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Application} from "../models/application.model.js"

const router = Router();

// Secure all routes with JWT verification
router.use(verifyJWT);

// Application submission routes
router.route("/birth-certificate").post(
  upload.array("documents", 5), // Allow up to 5 document uploads
  submitBirthCertificateApplication
);

router.route("/death-certificate").post(
  upload.array("documents", 5),
  submitDeathCertificateApplication
);

router.route("/marriage-certificate").post(
  upload.array("documents", 5),
  submitMarriageCertificateApplication
);

// Application retrieval routes
router.route("/user/:userId").get(verifyJWT,getUserApplications);
router.route("/admin").get(verifyAdmin,getAdminApplications);
router.route("/admin/filter").get(verifyAdmin,getApplicationsByStatus);
  
// File-related routes must come before the general applicationId route
router.get("/files/urls",verifyJWT,asyncHandler(getFileUrls));
// Certificate route must come before the file ID route to avoid conflicts
router.get("/files/:applicationId/certificate/signed-url", verifyJWT, asyncHandler(generateFileSignedUrl));
router.get("/files/:applicationId/:fileId/signed-url", verifyJWT, asyncHandler(generateFileSignedUrl));

router.route("/:applicationId").get(verifyJWT,asyncHandler(getApplicationDetails));
router.get(
  "/secure-url/:fileId",
  verifyJWT,
  asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const application = await Application.findOne({
      $or: [
        { "uploadedFiles._id": fileId },
        { "generatedCertificate._id": fileId }
      ]
    });

    if (!application) {
      throw new ApiError(404, "File not found");
    }

    // Check if user has access to this application
    if (
      application.applicantId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw new ApiError(403, "Access denied");
    }

    let filePath;
    console.log(application.generatedCertificate.id);
    if (application.generatedCertificate?._id.toString() === fileId) {
      filePath = application.generatedCertificate.filePath;
    } else {
      const file = application.uploadedFiles.find(
        f => f._id.toString() === fileId
      );
      filePath = file?.filePath;
    }

    if (!filePath) {
      throw new ApiError(404, "File path not found");
    }

    const secureUrl = await getSecureFileUrl(filePath);
    
    return res.status(200).json(
      new ApiResponse(200, { secureUrl }, "Secure URL generated successfully")
    );
  })
);


// Admin review routes
router.route("/admin/review/:applicationId").post(verifyAdmin,reviewApplication);
router.route("/admin/certificate/:applicationId").post(
  verifyAdmin,
  upload.single("certificate"),
  uploadCertificate
);

export default router;