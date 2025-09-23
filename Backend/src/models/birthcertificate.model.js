import mongoose from "mongoose";

const birthCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },
  
  // Form Fields
  childName: {
    type: String,
    required: true,
    trim: true
  },
  financialYear: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  // birthTime removed
  placeOfBirth: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  // Add these new fields
  // Aadhaar fields removed
  parentsAddressAtBirth: {
    type: String,
    required: false,
    trim: true
  },
  permanentAddressParent: {
    type: String,
    required: true,
    trim: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  applicantFullNameEnglish: { type: String, required: true, trim: true },
  applicantFullNameDevanagari: { type: String, required: true, trim: true },
  whatsappNumber: { type: String, required: true, trim: true },
  email: { type: String, required: false, trim: true },
  address: { type: String, required: true, trim: true },
  utrNumber: { type: String, required: true, trim: true },
  fatherOccupation: {
    type: String,
    trim: true
  },
  motherOccupation: {
    type: String,
    trim: true
  },
  // hospitalName removed
  
  // Payment Amount
  paymentAmount: {
    type: Number,
    default: 20
  }
}, {
  timestamps: true
});

export const BirthCertificate = mongoose.model("BirthCertificate", birthCertificateSchema);