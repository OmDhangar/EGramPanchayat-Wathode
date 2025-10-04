import mongoose from "mongoose";

const taxationSchema = new mongoose.Schema({
  financialYear: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be 10 digits'
    }
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  taxPayerNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  groupName: String,
  groupType: String,
  oldTaxNumber: String,
  newTaxNumber: String,
  utrNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Taxation = mongoose.model("Taxation", taxationSchema);