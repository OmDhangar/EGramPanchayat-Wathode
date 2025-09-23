import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBaby } from "react-icons/fa";
import { api } from "../api/axios";
import {
  InputField,
  TextareaField,
  SelectField,
  FileUploadField,
  SubmitButton,
  FormSection,
  SuccessMessage
} from "../components/FormComponents";
import { Helmet } from 'react-helmet';

// Form validation interface
interface FormErrors {
  [key: string]: string;
}

// Form data interface - Fixed to match backend exactly
interface BirthCertificateFormData {
  financialYear: string;
  childName: string;
  dateOfBirth: string; // yyyy-mm-dd format from HTML date input
  placeOfBirth: string;
  gender: string;
  fatherName: string;
  motherName: string;
  applicantFullNameEnglish: string;
  applicantFullNameDevanagari: string;
  whatsappNumber: string;
  email: string;
  address: string;
  utrNumber: string;
  fatherOccupation: string;
  motherOccupation: string; // Added missing field
  parentsAddressAtBirth: string; // Added missing field
  permanentAddressParent: string;
}

const BirthCertificateForm = () => {
  const [formData, setFormData] = useState<BirthCertificateFormData>({
    financialYear: "",
    childName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    fatherName: "",
    motherName: "",
    applicantFullNameEnglish: "",
    applicantFullNameDevanagari: "",
    whatsappNumber: "",
    email: "",
    address: "",
    utrNumber: "",
    fatherOccupation: "",
    motherOccupation: "", // Added
    parentsAddressAtBirth: "", // Added
    permanentAddressParent: ""
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [qrText, setQrText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Gender options for select field
  const genderOptions: { value: string; label: string }[] = [
    { value: "Male", label: "पुरुष (Male)" },
    { value: "Female", label: "स्त्री (Female)" },
    { value: "Other", label: "इतर (Other)" }
  ];

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
    
    // Required field validations matching backend exactly
    if (!formData.financialYear) newErrors.financialYear = "Financial year is required";
    if (!formData.childName) newErrors.childName = "Child name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.placeOfBirth) newErrors.placeOfBirth = "Place of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.fatherName) newErrors.fatherName = "Father name is required";
    if (!formData.motherName) newErrors.motherName = "Mother name is required";
    if (!formData.applicantFullNameEnglish) newErrors.applicantFullNameEnglish = "Applicant full name (English) is required";
    if (!formData.applicantFullNameDevanagari) newErrors.applicantFullNameDevanagari = "Applicant full name (Devanagari) is required";
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = "WhatsApp must be 10 digits";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.utrNumber) newErrors.utrNumber = "UTR number is required";
    if (!paymentReceipt) newErrors.paymentReceipt = "Payment receipt image is required";
    
    // Note: parentsAddressAtBirth and occupations are not required in backend

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
      
      // Append form fields exactly as backend expects
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append files with correct field names
      files.forEach(file => {
        formDataToSend.append("documents", file);
      });

      if (paymentReceipt) {
        formDataToSend.append("paymentReceipt", paymentReceipt);
      }

      console.log("Submitting form data:", Object.fromEntries(formDataToSend.entries()));

      const response = await api.post("/applications/birth-certificate", formDataToSend, {
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
      childName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      gender: "",
      fatherName: "",
      motherName: "",
      applicantFullNameEnglish: "",
      applicantFullNameDevanagari: "",
      whatsappNumber: "",
      email: "",
      address: "",
      utrNumber: "",
      fatherOccupation: "",
      motherOccupation: "",
      parentsAddressAtBirth: "",
      permanentAddressParent: ""
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage
            title="Application Submitted Successfully!"
            message="Your birth certificate application has been submitted and is now under review. You will receive updates on your application status."
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <Helmet>
        <title>Birth Certificate Application - Grampanchayat Wathode</title>
        <meta name="description" content="Apply for a birth certificate online. Fill in child's information, parents' details, and address. Grampanchayat Wathode, Shirpur, Dhule, Maharashtra." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <FaBaby className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Birth Certificate Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to apply for a birth certificate. All fields marked with * are required.
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
            {/* Child Information Section */}
            <FormSection
              title="Child Information"
              description="Enter the details of the child for whom the birth certificate is requested"
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
                  label="Child's Full Name"
                  name="childName"
                  placeholder="Enter child's full name"
                  value={formData.childName}
                  onChange={handleInputChange}
                  error={errors.childName}
                />
                
                <InputField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={errors.dateOfBirth}
                />
                
                <InputField
                  label="Place of Birth"
                  name="placeOfBirth"
                  placeholder="Enter place of birth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  error={errors.placeOfBirth}
                />
                
                <SelectField
                  label="Gender"
                  name="gender"
                  options={genderOptions as any}
                  placeholder="Select gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  error={errors.gender}
                />
              </div>
            </FormSection>

            {/* Parents Information Section - FIXED */}
            <FormSection
              title="Parents Information"
              description="Enter the parents' details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Father's Full Name"
                  name="fatherName"
                  placeholder="Enter father's full name"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  error={errors.fatherName}
                />
                <InputField
                  label="Mother's Full Name"
                  name="motherName"
                  placeholder="Enter mother's full name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  error={errors.motherName}
                />
                
                <InputField
                  label="Father's Occupation"
                  name="fatherOccupation"
                  placeholder="Enter father's occupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  error={errors.fatherOccupation}
                  required={false}
                />

                {/* Added missing Mother's Occupation field */}
                <InputField
                  label="Mother's Occupation"
                  name="motherOccupation"
                  placeholder="Enter mother's occupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  error={errors.motherOccupation}
                  required={false}
                />
              </div>
            </FormSection>

            {/* Address Information Section - FIXED */}
            <FormSection
              title="Address Information"
              description="Enter address details"
              className="mb-8"
            >
              {/* Added missing Parents Address at Birth field */}
              <TextareaField
                label="Parents Address at Time of Birth"
                name="parentsAddressAtBirth"
                placeholder="Enter the address where parents lived when child was born"
                rows={3}
                value={formData.parentsAddressAtBirth}
                onChange={handleInputChange}
                error={errors.parentsAddressAtBirth}
                required={false}
                className="mb-4"
              />

              <TextareaField
                label="Permanent Address of Parents"
                name="permanentAddressParent"
                placeholder="Enter current permanent address of parents"
                rows={3}
                value={formData.permanentAddressParent}
                onChange={handleInputChange}
                error={errors.permanentAddressParent}
                className="mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Applicant Full Name (English)"
                  name="applicantFullNameEnglish"
                  placeholder="John Doe"
                  value={formData.applicantFullNameEnglish}
                  onChange={handleInputChange}
                  error={errors.applicantFullNameEnglish}
                />
                <InputField
                  label="Applicant Full Name (Devanagari)"
                  name="applicantFullNameDevanagari"
                  placeholder="जॉन डो"
                  value={formData.applicantFullNameDevanagari}
                  onChange={handleInputChange}
                  error={errors.applicantFullNameDevanagari}
                />
                <InputField
                  label="WhatsApp Number"
                  name="whatsappNumber"
                  placeholder="10-digit mobile"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  error={errors.whatsappNumber}
                />
                <InputField
                  label="Email (optional)"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required={false}
                />
              </div>
              
              <TextareaField
                label="Current Address"
                name="address"
                placeholder="Full current address of applicant"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                className="mt-4"
              />
            </FormSection>

            {/* Payment Section */}
            <FormSection
              title="Payment Information"
              description="Payment details for birth certificate (Rs. 20)"
              className="mb-8"
            >
              <InputField
                label="UTR Number"
                name="utrNumber"
                placeholder="Enter UTR number from payment receipt"
                value={formData.utrNumber}
                onChange={handleInputChange}
                error={errors.utrNumber}
              />
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
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/QR.jpg" 
                        alt="Payment QR Code" 
                        className="w-72 h-72 object-contain border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-2">📱 Scan QR Code to Pay Rs. 20</p>
                      <p className="mb-1">• Use any UPI app (PhonePe, GPay, Paytm)</p>
                      <p className="mb-1">• After payment, upload screenshot below</p>
                      <p className="text-blue-600 font-medium">• Enter UTR number in applicant details</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  capture="environment"
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-blue-900 mb-2">Recommended Documents:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Identity proof of parents(Aadhaar Card)</li>
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

export default BirthCertificateForm;