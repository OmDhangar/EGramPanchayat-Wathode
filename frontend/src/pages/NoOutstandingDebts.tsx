import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { api } from "../api/axios";
import {
  InputField,
  SelectField,
  SubmitButton,
  FormSection,
  SuccessMessage
} from "../components/FormComponents";
import { Helmet } from 'react-helmet';

// Form validation interface
interface FormErrors {
  [key: string]: string;
}

// Form data interface
interface NoOutstandingDebtsFormData {
  financialYear: string;
  propertyOwnerName: string;
  aadhaarCardNumber: string;
  whatsappNumber: string;
  email: string;
  villageName: string;
  wardNo: string;
  streetNameNumber: string;
  propertyNumber: string;
  applicantFullNameEnglish: string;
  applicantAadhaarNumber: string;
  utrNumber: string;
  paymentOption: string;
}

const NoOutstandingDebtsForm = () => {
  const [formData, setFormData] = useState<NoOutstandingDebtsFormData>({
    financialYear: "",
    propertyOwnerName: "",
    aadhaarCardNumber: "",
    whatsappNumber: "",
    email: "",
    villageName: "",
    wardNo: "",
    streetNameNumber: "",
    propertyNumber: "",
    applicantFullNameEnglish: "",
    applicantAadhaarNumber: "",
    utrNumber: "",
    paymentOption: "UPI"
  });
  
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [qrText, setQrText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Payment options for select field
  const paymentOptions: { value: string; label: string }[] = [
    { value: "UPI", label: "UPI" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleReceiptChange = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg','image/jpg','image/png'].includes(file.type)) {
      setErrors(prev => ({ ...prev, paymentReceipt: 'Only PNG/JPG images are allowed' }));
      return;
    }
    setErrors(prev => ({ ...prev, paymentReceipt: "" }));
    setPaymentReceipt(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    const tryDetectQR = async () => {
      try {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.BarcodeDetector) {
          // @ts-ignore
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = receiptPreview;
          await new Promise(res => { img.onload = () => res(null); });
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const blobPromise: Promise<Blob> = new Promise(resolve => canvas.toBlob(b => resolve(b as Blob)));
            const blob = await blobPromise;
            const bitmap = await createImageBitmap(blob);
            const codes = await detector.detect(bitmap);
            if (codes && codes[0]?.rawValue) {
              setQrText(codes[0].rawValue);
            }
          }
        }
      } catch {}
    };
    if (receiptPreview) tryDetectQR();
  }, [receiptPreview]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required field validations
    if (!formData.financialYear) newErrors.financialYear = "Financial year is required";
    if (!formData.propertyOwnerName) newErrors.propertyOwnerName = "Property owner's name is required";
    if (!formData.aadhaarCardNumber || !/^\d{12}$/.test(formData.aadhaarCardNumber)) newErrors.aadhaarCardNumber = "Aadhaar must be 12 digits";
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = "WhatsApp must be 10 digits";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.villageName) newErrors.villageName = "Village name is required";
    if (!formData.wardNo) newErrors.wardNo = "Ward number is required";
    if (!formData.streetNameNumber) newErrors.streetNameNumber = "Street name/number is required";
    if (!formData.propertyNumber) newErrors.propertyNumber = "Property number is required";
    if (!formData.applicantFullNameEnglish) newErrors.applicantFullNameEnglish = "Applicant's full name is required";
    if (!formData.applicantAadhaarNumber || !/^\d{12}$/.test(formData.applicantAadhaarNumber)) newErrors.applicantAadhaarNumber = "Applicant's Aadhaar must be 12 digits";
    if (!formData.utrNumber) newErrors.utrNumber = "UTR number is required";
    if (!paymentReceipt) newErrors.paymentReceipt = "Payment receipt image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (paymentReceipt) {
        formDataToSend.append("paymentReceipt", paymentReceipt);
      }

      console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries()));

      const response = await api.post("/applications/no-outstanding-debts", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      console.error("Error response:", error?.response?.data);
      const errorMessage = error?.response?.data?.message || "Failed to submit application. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      financialYear: "",
      propertyOwnerName: "",
      aadhaarCardNumber: "",
      whatsappNumber: "",
      email: "",
      villageName: "",
      wardNo: "",
      streetNameNumber: "",
      propertyNumber: "",
      applicantFullNameEnglish: "",
      applicantAadhaarNumber: "",
      utrNumber: "",
      paymentOption: "UPI"
    });
    setPaymentReceipt(null);
    setReceiptPreview("");
    setQrText("");
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage
            title="Application Submitted Successfully!"
            message="Your certificate of no outstanding debts application has been submitted and is now under review. You will receive updates on your application status."
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <Helmet>
        <title>Certificate of No Outstanding Debts - Grampanchayat Wathode</title>
        <meta name="description" content="Apply for certificate of no outstanding debts online. Fill in property owner details and applicant information. Grampanchayat Wathode, Shirpur, Dhule, Maharashtra." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
            <FaFileInvoiceDollar className="text-3xl text-purple-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Certificate of No Outstanding Debts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to apply for certificate of no outstanding debts. All fields marked with * are required.
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Basic Information Section */}
            <FormSection
              title="Basic Information"
              description="Enter the basic details for the certificate"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Financial Year"
                  name="financialYear"
                  placeholder="2025-26"
                  value={formData.financialYear}
                  onChange={handleInputChange}
                  error={errors.financialYear}
                />
                <InputField
                  label="Property Owner's Name"
                  name="propertyOwnerName"
                  placeholder="Enter property owner's full name"
                  value={formData.propertyOwnerName}
                  onChange={handleInputChange}
                  error={errors.propertyOwnerName}
                />
                
                <InputField
                  label="Aadhaar Card Number"
                  name="aadhaarCardNumber"
                  placeholder="12-digit Aadhaar number"
                  value={formData.aadhaarCardNumber}
                  onChange={handleInputChange}
                  error={errors.aadhaarCardNumber}
                />
                
                <InputField
                  label="WhatsApp Mobile Number"
                  name="whatsappNumber"
                  placeholder="10-digit mobile"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  error={errors.whatsappNumber}
                />
                
                <InputField
                  label="Email ID"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required={false}
                />
              </div>
            </FormSection>

            {/* Property Information Section */}
            <FormSection
              title="Property Information"
              description="Enter the property details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Village Name"
                  name="villageName"
                  placeholder="Enter village name"
                  value={formData.villageName}
                  onChange={handleInputChange}
                  error={errors.villageName}
                />
                <InputField
                  label="Ward No."
                  name="wardNo"
                  placeholder="Enter ward number"
                  value={formData.wardNo}
                  onChange={handleInputChange}
                  error={errors.wardNo}
                />
                
                <InputField
                  label="Street Name / Street Number"
                  name="streetNameNumber"
                  placeholder="Enter street name or number"
                  value={formData.streetNameNumber}
                  onChange={handleInputChange}
                  error={errors.streetNameNumber}
                />

                <InputField
                  label="Property Number"
                  name="propertyNumber"
                  placeholder="Enter property number"
                  value={formData.propertyNumber}
                  onChange={handleInputChange}
                  error={errors.propertyNumber}
                />
              </div>
            </FormSection>

            {/* Applicant Information Section */}
            <FormSection
              title="Applicant Information"
              description="Enter the applicant's details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Applicant's Full Name (English)"
                  name="applicantFullNameEnglish"
                  placeholder="Enter applicant's full name"
                  value={formData.applicantFullNameEnglish}
                  onChange={handleInputChange}
                  error={errors.applicantFullNameEnglish}
                />
                
                <InputField
                  label="Applicant's Aadhaar Card Number"
                  name="applicantAadhaarNumber"
                  placeholder="12-digit Aadhaar number"
                  value={formData.applicantAadhaarNumber}
                  onChange={handleInputChange}
                  error={errors.applicantAadhaarNumber}
                />
              </div>
            </FormSection>

            {/* Payment Section */}
            <FormSection
              title="Payment Information"
              description="Payment details for certificate (Rs. 20)"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Payment Option"
                  name="paymentOption"
                  options={paymentOptions as any}
                  placeholder="Select payment option"
                  value={formData.paymentOption}
                  onChange={handleInputChange}
                  error={errors.paymentOption}
                />
                
                <InputField
                  label="UTR Number"
                  name="utrNumber"
                  placeholder="Enter UTR number from payment receipt"
                  value={formData.utrNumber}
                  onChange={handleInputChange}
                  error={errors.utrNumber}
                />
              </div>
            </FormSection>

            {/* Document Upload Section */}
            <FormSection
              title="Payment Receipt"
              description="Upload payment receipt (Rs. 20)"
              className="mb-8"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Receipt Screenshot (PNG/JPG) - Rs. 20 *</label>
                
                {/* QR Code for Payment */}
                <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/QR.jpg" 
                        alt="Payment QR Code" 
                        className="w-72 h-72 object-contain border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-purple-800">
                      <p className="font-semibold mb-2">📱 Scan QR Code to Pay Rs. 20</p>
                      <p className="mb-1">• Use any UPI app (PhonePe, GPay, Paytm)</p>
                      <p className="mb-1">• After payment, upload screenshot below</p>
                      <p className="text-purple-600 font-medium">• Enter UTR number in payment details</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  capture="environment"
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {errors.paymentReceipt && (<p className="text-red-600 text-sm mt-1">{errors.paymentReceipt}</p>)}
                {receiptPreview && (
                  <div className="mt-3 grid grid-cols-2 gap-3 items-start">
                    <img src={receiptPreview} alt="Receipt Preview" className="rounded border max-h-40 object-contain" />
                    <div className="text-xs text-gray-600 break-all">
                      <div className="font-medium mb-1">QR Scan (if detected):</div>
                      <div className="p-2 bg-gray-50 rounded border min-h-16">{qrText || 'No QR detected'}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-purple-900 mb-2">Important Note:</h4>
                <p className="text-sm text-purple-800">
                  This certificate confirms that there are no outstanding debts against the specified property. 
                  No additional documents are required - only the payment receipt.
                </p>
              </div>
            </FormSection>

            {/* General Error Display */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <p className="text-red-800 text-sm">{errors.general}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <SubmitButton
                loading={loading}
                variant="primary"
                size="lg"
                className="flex-1"
                type="submit"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </SubmitButton>
              
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>
            Your application will be reviewed by our team. You will receive updates via email and SMS.
          </p>
          <p className="mt-2">
            For any queries, please contact our support team.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NoOutstandingDebtsForm;
