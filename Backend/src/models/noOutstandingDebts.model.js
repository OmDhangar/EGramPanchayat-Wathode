import mongoose from 'mongoose';

const noOutstandingDebtsSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  // Applicant Details
  financialYear: { type: String, required: true },
  propertyOwnerName: { type: String, required: true },
  aadhaarCardNumber: { type: String, required: true, match: /^\d{12}$/ },
  whatsappNumber: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  
  // Property Details
  villageName: { type: String, required: true },
  wardNo: { type: String, required: true },
  streetNameNumber: { type: String, required: true },
  propertyNumber: { type: String, required: true },
  
  // Applicant Information
  applicantFullNameEnglish: { type: String, required: true },
  applicantAadhaarNumber: { type: String, required: true, match: /^\d{12}$/ },
  utrNumber: { type: String, required: true },
  paymentOption: { type: String, default: 'UPI' }
  
}, { timestamps: true });

export const NoOutstandingDebts = mongoose.model('NoOutstandingDebts', noOutstandingDebtsSchema);
