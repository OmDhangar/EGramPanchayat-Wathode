import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { api } from "../api/axios";
import { Helmet } from "react-helmet";
import {
  InputField,
  TextareaField,
  FileUploadField,
  SubmitButton,
  FormSection,
  SuccessMessage
} from "../components/FormComponents";

// Form validation interface
interface FormErrors {
  [key: string]: string;
}

// Form data interface
interface MarriageCertificateFormData {
  dateOfMarriage: string;
  placeOfMarriage: string;
  HusbandName: string;
  HusbandAadhaar: string;
  HusbandAge: string;
  HusbandFatherName: string;
  HusbandAddress: string;
  HusbandOccupation: string;
  wifeName: string;
  wifeAadhaar: string;
  wifeAge: string;
  wifeFatherName: string;
  wifeAddress: string;
  wifeOccupation: string;
  SolemnizedOn: string;
  applicantFullName: string;
  whatsappNumber: string;
  email: string;
  utrNumber: string;
}

const MarriageCertificateForm = () => {
  const [formData, setFormData] = useState<MarriageCertificateFormData>({
    dateOfMarriage: "",
    placeOfMarriage: "",
    HusbandName: "",
    HusbandAadhaar: "",
    HusbandAge: "",
    HusbandFatherName: "",
    HusbandAddress: "",
    HusbandOccupation: "",
    wifeName: "",
    wifeAadhaar: "",
    wifeAge: "",
    wifeFatherName: "",
    wifeAddress: "",
    wifeOccupation: "",
    SolemnizedOn: "",
    applicantFullName: "",
    whatsappNumber: "",
    email: "",
    utrNumber: ""
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [qrText, setQrText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
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

    // Required field validation (excluding optional email field)
    const requiredFields = Object.keys(formData).filter(key => key !== 'email');
    requiredFields.forEach(key => {
      if (!formData[key as keyof MarriageCertificateFormData]) {
        newErrors[key] = "This field is required";
      }
    });

    // Specific validations
    if (formData.dateOfMarriage) {
      const marriageDate = new Date(formData.dateOfMarriage);
      const today = new Date();
      if (marriageDate > today) {
        newErrors.dateOfMarriage = "Date of marriage cannot be in the future";
      }
    }

    if (formData.HusbandAge && (isNaN(Number(formData.HusbandAge)) || Number(formData.HusbandAge) < 21)) {
      newErrors.HusbandAge = "Groom's age must be at least 21 years";
    }

    if (formData.wifeAge && (isNaN(Number(formData.wifeAge)) || Number(formData.wifeAge) < 18)) {
      newErrors.wifeAge = "Bride's age must be at least 18 years";
    }

    // Aadhaar validation
    if (formData.HusbandAadhaar && !/^\d{12}$/.test(formData.HusbandAadhaar)) {
      newErrors.HusbandAadhaar = "Aadhaar must be 12 digits";
    }

    if (formData.wifeAadhaar && !/^\d{12}$/.test(formData.wifeAadhaar)) {
      newErrors.wifeAadhaar = "Aadhaar must be 12 digits";
    }

    // WhatsApp number validation
    if (formData.whatsappNumber && !/^\d{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "WhatsApp number must be 10 digits";
    }

    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    // Payment receipt validation
    if (!paymentReceipt) {
      newErrors.paymentReceipt = "Payment receipt image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append payment receipt
      if (paymentReceipt) {
        formDataToSend.append("paymentReceipt", paymentReceipt);
      }
      
      // Append supporting documents
      files.forEach(file => {
        formDataToSend.append("documents", file);
      });

      const response = await api.post("/applications/marriage-certificate", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      const errorMessage = error?.response?.data?.message || "Failed to submit application. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dateOfMarriage: "",
      placeOfMarriage: "",
      HusbandName: "",
      HusbandAadhaar: "",
      HusbandAge: "",
      HusbandFatherName: "",
      HusbandAddress: "",
      HusbandOccupation: "",
      wifeName: "",
      wifeAadhaar: "",
      wifeAge: "",
      wifeFatherName: "",
      wifeAddress: "",
      wifeOccupation: "",
      SolemnizedOn: "",
      applicantFullName: "",
      whatsappNumber: "",
      email: "",
      utrNumber: ""
    });
    setFiles([]);
    setPaymentReceipt(null);
    setReceiptPreview("");
    setQrText("");
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage
            title="Application Submitted Successfully!"
            message="Your marriage certificate application has been submitted and is now under review. You will receive updates on your application status."
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-8 px-4">
      <Helmet>
        <title>विवाह प्रमाणपत्र अर्ज - ग्रामपंचायत वाठोडे</title>
        <meta name="description" content="विवाह प्रमाणपत्रासाठी अर्ज करा. ग्रामपंचायत वाठोडे, शिरपूर, धुळे, महाराष्ट्र." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-4">
            <FaHeart className="text-3xl text-pink-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Marriage Certificate Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to apply for a marriage certificate. All fields marked with * are required.
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
            {/* Marriage Details Section */}
            <FormSection
              title="Marriage Details"
              description="Enter the basic marriage information"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Date of Marriage"
                  name="dateOfMarriage"
                  type="date"
                  value={formData.dateOfMarriage}
                  onChange={handleInputChange}
                  error={errors.dateOfMarriage}
                />
                
                <InputField
                  label="Place of Marriage"
                  name="placeOfMarriage"
                  placeholder="Enter place of marriage"
                  value={formData.placeOfMarriage}
                  onChange={handleInputChange}
                  error={errors.placeOfMarriage}
                />
                
                <InputField
                  label="Type of Marriage Ceremony"
                  name="SolemnizedOn"
                  placeholder="e.g., Traditional, Court, Temple, etc."
                  value={formData.SolemnizedOn}
                  onChange={handleInputChange}
                  error={errors.SolemnizedOn}
                  className="md:col-span-2"
                />
              </div>
            </FormSection>

            {/* Groom Information Section */}
            <FormSection
              title="Groom Information"
              description="Enter the groom's details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Groom's Full Name"
                  name="HusbandName"
                  placeholder="Enter groom's full name"
                  value={formData.HusbandName}
                  onChange={handleInputChange}
                  error={errors.HusbandName}
                />
                
                <InputField
                  label="Groom's Aadhaar Number"
                  name="HusbandAadhaar"
                  placeholder="12-digit Aadhaar number"
                  value={formData.HusbandAadhaar}
                  onChange={handleInputChange}
                  error={errors.HusbandAadhaar}
                />
                
                <InputField
                  label="Groom's Age"
                  name="HusbandAge"
                  type="number"
                  placeholder="Enter age"
                  min="21"
                  max="100"
                  value={formData.HusbandAge}
                  onChange={handleInputChange}
                  error={errors.HusbandAge}
                />
                
                <InputField
                  label="Groom's Father's Name"
                  name="HusbandFatherName"
                  placeholder="Enter father's name"
                  value={formData.HusbandFatherName}
                  onChange={handleInputChange}
                  error={errors.HusbandFatherName}
                />
                
                <InputField
                  label="Groom's Occupation"
                  name="HusbandOccupation"
                  placeholder="Enter occupation"
                  value={formData.HusbandOccupation}
                  onChange={handleInputChange}
                  error={errors.HusbandOccupation}
                />
                
                <TextareaField
                  label="Groom's Address"
                  name="HusbandAddress"
                  placeholder="Enter complete address"
                  rows={3}
                  value={formData.HusbandAddress}
                  onChange={handleInputChange}
                  error={errors.HusbandAddress}
                  className="md:col-span-2"
                />
              </div>
            </FormSection>

            {/* Bride Information Section */}
            <FormSection
              title="Bride Information"
              description="Enter the bride's details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Bride's Full Name"
                  name="wifeName"
                  placeholder="Enter bride's full name"
                  value={formData.wifeName}
                  onChange={handleInputChange}
                  error={errors.wifeName}
                />
                
                <InputField
                  label="Bride's Aadhaar Number"
                  name="wifeAadhaar"
                  placeholder="12-digit Aadhaar number"
                  value={formData.wifeAadhaar}
                  onChange={handleInputChange}
                  error={errors.wifeAadhaar}
                />
                
                <InputField
                  label="Bride's Age"
                  name="wifeAge"
                  type="number"
                  placeholder="Enter age"
                  min="18"
                  max="100"
                  value={formData.wifeAge}
                  onChange={handleInputChange}
                  error={errors.wifeAge}
                />
                
                <InputField
                  label="Bride's Father's Name"
                  name="wifeFatherName"
                  placeholder="Enter father's name"
                  value={formData.wifeFatherName}
                  onChange={handleInputChange}
                  error={errors.wifeFatherName}
                />
                
                <InputField
                  label="Bride's Occupation"
                  name="wifeOccupation"
                  placeholder="Enter occupation"
                  value={formData.wifeOccupation}
                  onChange={handleInputChange}
                  error={errors.wifeOccupation}
                />
                
                <TextareaField
                  label="Bride's Address"
                  name="wifeAddress"
                  placeholder="Enter complete address"
                  rows={3}
                  value={formData.wifeAddress}
                  onChange={handleInputChange}
                  error={errors.wifeAddress}
                  className="md:col-span-2"
                />
              </div>
            </FormSection>

            {/* Applicant Details Section */}
            <FormSection
              title="Applicant Details"
              description="Enter applicant information"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Applicant's Full Name"
                  name="applicantFullName"
                  placeholder="Enter applicant's full name"
                  value={formData.applicantFullName}
                  onChange={handleInputChange}
                  error={errors.applicantFullName}
                />
                
                <InputField
                  label="WhatsApp Number"
                  name="whatsappNumber"
                  placeholder="10-digit mobile number"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  error={errors.whatsappNumber}
                />
                
                <InputField
                  label="Email ID (optional)"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required={false}
                />
                
                <InputField
                  label="UTR Number"
                  name="utrNumber"
                  placeholder="Enter UTR number"
                  value={formData.utrNumber}
                  onChange={handleInputChange}
                  error={errors.utrNumber}
                />
              </div>
            </FormSection>

            {/* Document Upload Section */}
            <FormSection
              title="Required Documents"
              description="Upload supporting documents (maximum 5 files, 10MB each)"
              className="mb-8"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Receipt (PNG/JPG) - Rs. 20 *</label>
                
                {/* QR Code for Payment */}
                <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/QR.jpg" 
                        alt="Payment QR Code" 
                        className="w-72 h-72 object-contain border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-pink-800">
                      <p className="font-semibold mb-2">📱 Scan QR Code to Pay Rs. 20</p>
                      <p className="mb-1">• Use any UPI app (PhonePe, GPay, Paytm)</p>
                      <p className="mb-1">• After payment, upload screenshot below</p>
                      <p className="text-pink-600 font-medium">• Enter UTR number in applicant details</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  capture="environment"
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
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
              
              <FileUploadField
                label="Supporting Documents (Optional)"
                name="documents"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                acceptedTypes={[".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]}
                onFilesChange={handleFilesChange}
                error={errors.files}
                required={false}
              />
              
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-medium text-pink-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• Identity proof of both husband and wife (Aadhaar Card)</li>
                </ul>
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
                variant="success"
                size="lg"
                className="flex-1"
                aria-label="Submit Marriage Certificate Application"
              >
                Submit Application
              </SubmitButton>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                aria-label="Reset Form"
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

export default MarriageCertificateForm;
