import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLandmark } from "react-icons/fa";
import { useTranslation } from "react-i18next";
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
interface LandRecord8AFormData {
  ownersName: string;
  village: string;
  whatsappNumber: string;
  email: string;
  taluka: string;
  district: string;
  accountNumber: string;
  utrNumber: string;
  paymentOption: string;
}

const LandRecord8AForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LandRecord8AFormData>({
    ownersName: "",
    village: "",
    whatsappNumber: "",
    email: "",
    taluka: "",
    district: "",
    accountNumber: "",
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
      setErrors(prev => ({ ...prev, paymentReceipt: t("forms.validation.onlyImages") }));
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
    if (!formData.ownersName) newErrors.ownersName = t("forms.validation.required");
    if (!formData.village) newErrors.village = t("forms.validation.required");
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = t("forms.validation.invalidPhone");
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("forms.validation.invalidEmail");
    if (!formData.taluka) newErrors.taluka = t("forms.validation.required");
    if (!formData.district) newErrors.district = t("forms.validation.required");
    if (!formData.accountNumber) newErrors.accountNumber = t("forms.validation.required");
    if (!formData.utrNumber) newErrors.utrNumber = t("forms.validation.required");
    if (!paymentReceipt) newErrors.paymentReceipt = t("forms.validation.paymentReceiptRequired");

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

      const response = await api.post("/applications/land-record-8a", formDataToSend, {
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
      const errorMessage = error?.response?.data?.message || t("forms.common.error");
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
      accountNumber: "",
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <SuccessMessage
            title={t("forms.common.success")}
            message={t("forms.common.successMessage")}
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <Helmet>
        <title>8A Land Record Digital Signature - Grampanchayat Wathode</title>
        <meta name="description" content="Apply for 8A land record with digital signature online. Fill in land owner details and payment information. Grampanchayat Wathode, Shirpur, Dhule, Maharashtra." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FaLandmark className="text-3xl text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("forms.landRecord8A.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("forms.landRecord8A.description")}
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
              title={t("forms.landRecord8A.ownerInfo")}
              description={t("forms.landRecord8A.ownerInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.landRecord8A.ownersName")}
                  name="ownersName"
                  placeholder="Enter owner's full name"
                  value={formData.ownersName}
                  onChange={handleInputChange}
                  error={errors.ownersName}
                />
                <InputField
                  label={t("forms.landRecord8A.village")}
                  name="village"
                  placeholder="Enter village name"
                  value={formData.village}
                  onChange={handleInputChange}
                  error={errors.village}
                />
                
                <InputField
                  label={t("forms.landRecord8A.whatsappNumber")}
                  name="whatsappNumber"
                  placeholder="10-digit mobile"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  error={errors.whatsappNumber}
                />
                
                <InputField
                  label={t("forms.landRecord8A.email")}
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required={false}
                />
                
                <InputField
                  label={t("forms.landRecord8A.taluka")}
                  name="taluka"
                  placeholder="Enter taluka name"
                  value={formData.taluka}
                  onChange={handleInputChange}
                  error={errors.taluka}
                />

                <InputField
                  label={t("forms.landRecord8A.district")}
                  name="district"
                  placeholder="Enter district name"
                  value={formData.district}
                  onChange={handleInputChange}
                  error={errors.district}
                />

                <InputField
                  label={t("forms.landRecord8A.accountNumber")}
                  name="accountNumber"
                  placeholder="Enter the account number"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  error={errors.accountNumber}
                />
              </div>
            </FormSection>

            {/* Payment Section */}
            <FormSection
              title={t("forms.landRecord8A.paymentInfo")}
              description={t("forms.landRecord8A.paymentInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label={t("forms.landRecord8A.paymentOption")}
                  name="paymentOption"
                  options={paymentOptions as any}
                  placeholder="Select payment option"
                  value={formData.paymentOption}
                  onChange={handleInputChange}
                  error={errors.paymentOption}
                />
                
                <InputField
                  label={t("forms.landRecord8A.utrNumber")}
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
              title={t("forms.common.paymentReceipt")}
              description="Upload payment receipt (Rs. 15)"
              className="mb-8"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">{t("forms.common.paymentReceipt")} Screenshot (PNG/JPG) - Rs. 15 *</label>
                
                {/* QR Code for Payment */}
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/QR.jpg" 
                        alt="Payment QR Code" 
                        className="w-72 h-72 object-contain border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-2">{t("forms.common.scanQR").replace("Rs. 20", "Rs. 15")}</p>
                      <p className="mb-1">{t("forms.common.useUPI")}</p>
                      <p className="mb-1">{t("forms.common.uploadScreenshot")}</p>
                      <p className="text-green-600 font-medium">{t("forms.common.enterUTR")}</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  capture="environment"
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {errors.paymentReceipt && (<p className="text-red-600 text-sm mt-1">{errors.paymentReceipt}</p>)}
                {receiptPreview && (
                  <div className="mt-3 grid grid-cols-2 gap-3 items-start">
                    <img src={receiptPreview} alt="Receipt Preview" className="rounded border max-h-40 object-contain" />
                    <div className="text-xs text-gray-600 break-all">
                      <div className="font-medium mb-1">{t("forms.common.qrDetected")}</div>
                      <div className="p-2 bg-gray-50 rounded border min-h-16">{qrText || t("forms.common.noQR")}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-green-900 mb-2">{t("forms.common.importantNote")}</h4>
                <p className="text-sm text-green-800">
                  {t("forms.landRecord8A.feeNote")}
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
                {loading ? t("forms.common.submitting") : t("forms.common.submit")}
              </SubmitButton>
              
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("forms.common.reset")}
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
            {t("forms.common.reviewMessage")}
          </p>
          <p className="mt-2">
            {t("forms.common.supportMessage")}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LandRecord8AForm;
