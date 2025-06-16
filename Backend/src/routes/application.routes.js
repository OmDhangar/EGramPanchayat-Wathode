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
  getApplicationDetails
} from "../controllers/application.controllers.js";

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
router.route("/:applicationId").get(verifyJWT,getApplicationDetails);


// Admin review routes
router.route("/admin/review/:applicationId").post(verifyAdmin,reviewApplication);
router.route("/admin/certificate/:applicationId").post(
  verifyAdmin,
  upload.single("certificate"),
  uploadCertificate
);

export default router;