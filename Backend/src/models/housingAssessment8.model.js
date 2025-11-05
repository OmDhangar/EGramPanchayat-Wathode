import mongoose from 'mongoose';

const housingAssessment8Schema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  // Applicant Details
  financialYear: { type: String, required: true },
  applicantName: { type: String, required: true },
  whatsappNumber: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  utrNumber: { type: String, required: true },
  
  // Form-Specific Fields
  propertyNo: { type: String, required: true },
  descriptionNo: { type: String },
  propertyName: { type: String, required: true },
  occupantName: { type: String, required: true },
  lengthInFeet: { type: Number, required: true },
  heightInFeet: { type: Number, required: true },
  totalAreaSqFt: { type: Number, required: true },
  utrNumber: { type: String, required: true },
  paymentOption: { type: String, default: 'UPI' }
  
}, { timestamps: true });

export const HousingAssessment8 = mongoose.model('HousingAssessment8', housingAssessment8Schema);
