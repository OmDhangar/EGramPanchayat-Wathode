import mongoose from 'mongoose';

const bplCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  // Applicant Details
  financialYear: { type: String, required: true },
  applicantName: { type: String, required: true },
  aadhaarNumber: { type: String, required: true, match: /^\d{12}$/ },
  address: { type: String, required: true },
  taluka: { type: String, required: true },
  district: { type: String, required: true },
  whatsappNumber: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  utrNumber: { type: String, required: true },

  // Form-Specific Fields (from BPL image)
  bplYear: { type: String, required: true }, // "in the year..."
  bplListSerialNo: { type: String, required: true }, // "...at serial number..."
  utrNumber: { type: String, required: true },
  paymentOption: { type: String, default: 'UPI' }

}, { timestamps: true });

export const BPLCertificate = mongoose.model('BPLCertificate', bplCertificateSchema);
