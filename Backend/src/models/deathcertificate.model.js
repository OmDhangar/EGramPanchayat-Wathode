import mongoose from "mongoose";

const deathCertificateSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true
  },

  // New required fields
  financialYear: { type: String, required: true, trim: true },
  deceasedName: { type: String, required: true, trim: true },
  aadhaarNumber: { type: String, trim: true },
  address: { type: String, required: true, trim: true },
  dateOfDeath: { type: Date, required: true },
  timeOfDeath: { type: String, required: true, trim: true },
  causeOfDeath: { type: String, required: true, trim: true },

  applicantFullNameEnglish: { type: String, required: true, trim: true },
  applicantFullNameDevanagari: { type: String, required: true, trim: true },
  whatsappNumber: { type: String, required: true, trim: true },
  email: { type: String, required: false, trim: true },

  paymentOption: { type: String, enum: ['UPI'], default: 'UPI' },
  utrNumber: { type: String, required: true, trim: true },

  // Fixed payment
  paymentAmount: { type: Number, default: 20 }
}, { timestamps: true });

export const DeathCertificate = mongoose.model("DeathCertificate", deathCertificateSchema);