import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileContract } from "react-icons/fa";
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
interface DigitalSigned712FormData {
  ownersName: string;
  village: string;
  whatsappNumber: string;
  email: string;
  taluka: string;
  district: string;
  surveyNumber: string;
  utrNumber: string;
  paymentOption: string;
}

const DigitalSigned712Form = () => {
  const [formData, setFormData] = useState<DigitalSigned712FormData>({
    ownersName: "",
    village: "",
    whatsappNumber: "",
    email: "",
    taluka: "",
    district: "",
    surveyNumber: "",
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
    if (!formData.ownersName) newErrors.ownersName = "Owner's name is required";
    if (!formData.village) newErrors.village = "Village is required";
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = "WhatsApp must be 10 digits";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.taluka) newErrors.taluka = "Taluka is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.surveyNumber) newErrors.surveyNumber = "Survey Number / Group Number is required";
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

      const response = await api.post("/applications/digital-signed-712", formDataToSend, {
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
      ownersName: "",
      village: "",
      whatsappNumber: "",
      email: "",
      taluka: "",
      district: "",
      surveyNumber: "",
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage
            title="Application Submitted Successfully!"
            message="Your digitally signed 7/12 application has been submitted and is now under review. You will receive updates on your application status."
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8 px-4">
      <Helmet>
        <title>Digitally Signed 7/12 - Grampanchayat Wathode</title>
        <meta name="description" content="Apply for digitally signed 7/12 land record online. Fill in land owner details and survey information. Grampanchayat Wathode, Shirpur, Dhule, Maharashtra." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
            <FaFileContract className="text-3xl text-orange-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Digitally Signed 7/12
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to apply for digitally signed 7/12 land record. All fields marked with * are required.
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
            {/* Land Owner Information Section */}
            <FormSection
              title="Land Owner Information"
              description="Enter the details of the land owner"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Owner's Name"
                  name="ownersName"
                  placeholder="Enter owner's full name"
                  value={formData.ownersName}
                  onChange={handleInputChange}
                  error={errors.ownersName}
                />
                <InputField
                  label="Village"
                  name="village"
                  placeholder="Enter village name"
                  value={formData.village}
                  onChange={handleInputChange}
                  error={errors.village}
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
                
                <InputField
                  label="Taluka"
                  name="taluka"
                  placeholder="Enter taluka name"
                  value={formData.taluka}
                  onChange={handleInputChange}
                  error={errors.taluka}
                />

                <InputField
                  label="District"
                  name="district"
                  placeholder="Enter district name"
                  value={formData.district}
                  onChange={handleInputChange}
                  error={errors.district}
                />

                <InputField
                  label="Survey Number / Group Number"
                  name="surveyNumber"
                  placeholder="Enter survey number or group number"
                  value={formData.surveyNumber}
                  onChange={handleInputChange}
                  error={errors.surveyNumber}
                />
              </div>
            </FormSection>

            {/* Payment Section */}
            <FormSection
              title="Payment Information"
              description="Payment details for digitally signed 7/12 (Rs. 15)"
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
              description="Upload payment receipt (Rs. 15)"
              className="mb-8"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Payment Receipt Screenshot (PNG/JPG) - Rs. 15 *</label>
                
                {/* QR Code for Payment */}
                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/QR.jpg" 
                        alt="Payment QR Code" 
                        className="w-72 h-72 object-contain border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-orange-800">
                      <p className="font-semibold mb-2">📱 Scan QR Code to Pay Rs. 15</p>
                      <p className="mb-1">• Use any UPI app (PhonePe, GPay, Paytm)</p>
                      <p className="mb-1">• After payment, upload screenshot below</p>
                      <p className="text-orange-600 font-medium">• Enter UTR number in payment details</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  capture="environment"
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
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
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-orange-900 mb-2">Important Note:</h4>
                <p className="text-sm text-orange-800">
                  A fee of Rs. 15/- is required to be paid and the receipt of payment should be uploaded. 
                  Please fill the information carefully as marked with (*). No additional documents are required.
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

export default DigitalSigned712Form;
