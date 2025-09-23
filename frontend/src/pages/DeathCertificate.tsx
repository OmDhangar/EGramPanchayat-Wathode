import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSkull } from "react-icons/fa";
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
interface DeathCertificateFormData {
  financialYear: string;
  nameOfDeceased: string;
  aadhaarNumber: string; // optional
  address: string;
  dateOfDeath: string; // dd-mm-yyyy
  causeOfDeath: string;
  applicantFullNameEnglish: string;
  whatsappNumber: string;
  email: string; // optional
  paymentOption: 'UPI';
  utrNumber: string;
}

const DeathCertificateForm = () => {
  const [formData, setFormData] = useState<DeathCertificateFormData>({
    financialYear: "",
    nameOfDeceased: "",
    aadhaarNumber: "",
    address: "",
    dateOfDeath: "",
    causeOfDeath: "",
    applicantFullNameEnglish: "",
    whatsappNumber: "",
    email: "",
    paymentOption: 'UPI',
    utrNumber: ""
  });
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [qrText, setQrText] = useState<string>("");
  
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Gender not used in new form

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
    if (!formData.financialYear) newErrors.financialYear = 'Financial year is required';
    if (!formData.nameOfDeceased) newErrors.nameOfDeceased = 'Name of deceased is required';
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'Aadhaar must be 12 digits';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.dateOfDeath) newErrors.dateOfDeath = 'Date of death is required';
    if (!formData.causeOfDeath) newErrors.causeOfDeath = 'Cause of death is required';
    if (!formData.applicantFullNameEnglish) newErrors.applicantFullNameEnglish = 'Applicant full name (English) is required';
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = 'WhatsApp must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.utrNumber) newErrors.utrNumber = 'UTR number is required';
    if (!paymentReceipt) newErrors.paymentReceipt = 'Payment receipt image is required';

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

      const response = await api.post("/applications/death-certificate", formDataToSend, {
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
      financialYear: "",
      nameOfDeceased: "",
      aadhaarNumber: "",
      address: "",
      dateOfDeath: "",
      causeOfDeath: "",
      applicantFullNameEnglish: "",
      whatsappNumber: "",
      email: "",
      paymentOption: 'UPI',
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage
            title="Application Submitted Successfully!"
            message="Your death certificate application has been submitted and is now under review. You will receive updates on your application status."
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-8 px-4">
      <Helmet>
        <title>मृत्यू प्रमाणपत्र अर्ज - ग्रामपंचायत वाठोडे</title>
        <meta name="description" content="मृत्यू प्रमाणपत्रासाठी अर्ज करा. ग्रामपंचायत वाठोडे, शिरपूर, धुळे, महाराष्ट्र." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <FaSkull className="text-3xl text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Death Certificate Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to apply for a death certificate. All fields marked with * are required.
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
            {/* Deceased Person Information */}
            <FormSection
              title="Deceased Person Information"
              description="Enter the details of the deceased person"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Financial Year" name="financialYear" placeholder="2025-26" value={formData.financialYear} onChange={handleInputChange} error={errors.financialYear} />
                <InputField label="Name of Deceased" name="nameOfDeceased" placeholder="Enter full name" value={formData.nameOfDeceased} onChange={handleInputChange} error={errors.nameOfDeceased} />
                <InputField label="Aadhaar Number (optional)" name="aadhaarNumber" placeholder="12-digit Aadhaar" value={formData.aadhaarNumber} onChange={handleInputChange} error={errors.aadhaarNumber} required={false} />
                <InputField label="Date of Death" name="dateOfDeath" type="date" value={formData.dateOfDeath} onChange={handleInputChange} error={errors.dateOfDeath} />
                <InputField label="Cause of Death" name="causeOfDeath" placeholder="Enter cause of death" value={formData.causeOfDeath} onChange={handleInputChange} error={errors.causeOfDeath} className="md:col-span-2" />
              </div>
            </FormSection>

            {/* Address Information Section */}
            <FormSection
              title="Address Information"
              description="Enter address details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaField label="Address" name="address" placeholder="Enter address" rows={3} value={formData.address} onChange={handleInputChange} error={errors.address} className="md:col-span-2" />
              </div>
            </FormSection>

            <FormSection title="Applicant Details" description="Enter applicant information" className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Applicant Full Name (English)" name="applicantFullNameEnglish" placeholder="John Doe" value={formData.applicantFullNameEnglish} onChange={handleInputChange} error={errors.applicantFullNameEnglish} />
                <InputField label="WhatsApp Number" name="whatsappNumber" placeholder="10-digit mobile" value={formData.whatsappNumber} onChange={handleInputChange} error={errors.whatsappNumber} />
                <InputField label="Email (optional)" name="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} error={errors.email} required={false} />
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
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/QR.jpg" 
                        alt="Payment QR Code" 
                        className="w-72 h-72 object-contain border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-2">📱 Scan QR Code to Pay Rs. 20</p>
                      <p className="mb-1">• Use any UPI app (PhonePe, GPay, Paytm)</p>
                      <p className="mb-1">• After payment, upload screenshot below</p>
                      <p className="text-red-600 font-medium">• Enter UTR number in applicant details</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  capture="environment"
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
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
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-red-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Identity proof of deceased person (Aadhaar Card)</li>
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
                variant="danger"
                size="lg"
                className="flex-1"
                aria-label="Submit Death Certificate Application"
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

export default DeathCertificateForm;
