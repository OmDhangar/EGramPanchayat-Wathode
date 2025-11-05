import mongoose from 'mongoose';

const niradharCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  // Applicant Details
  financialYear: { type: String, required: true },
  applicantName: { type: String, required: true }, // "Mr./Mrs..."
  aadhaarNumber: { type: String, required: true, match: /^\d{12}$/ },
  whatsappNumber: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  utrNumber: { type: String, required: true },

  // Form-Specific Fields (from Niradhar image)
  grampanchayatName: { type: String, required: true }, // "Of Grampanchayat..."
  taluka: { type: String, required: true },
  district: { type: String, required: true },
  utrNumber: { type: String, required: true },
  paymentOption: { type: String, default: 'UPI' }

}, { timestamps: true });

export const NiradharCertificate = mongoose.model('NiradharCertificate', niradharCertificateSchema);
