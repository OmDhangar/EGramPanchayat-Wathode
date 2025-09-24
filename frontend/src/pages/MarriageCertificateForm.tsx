import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
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
  applicantFullName: string;
  whatsappNumber: string;
  email: string;
  utrNumber: string;
}

const MarriageCertificateForm = () => {
  const { t } = useTranslation();
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

    // Required field validation (excluding optional email field)
    const requiredFields = Object.keys(formData).filter(key => key !== 'email');
    requiredFields.forEach(key => {
      if (!formData[key as keyof MarriageCertificateFormData]) {
        newErrors[key] = t("forms.validation.required");
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
      newErrors.HusbandAge = t("forms.validation.minAge") + " 21";
    }

    if (formData.wifeAge && (isNaN(Number(formData.wifeAge)) || Number(formData.wifeAge) < 18)) {
      newErrors.wifeAge = t("forms.validation.minAge") + " 18";
    }

    // Aadhaar validation
    if (formData.HusbandAadhaar && !/^\d{12}$/.test(formData.HusbandAadhaar)) {
      newErrors.HusbandAadhaar = t("forms.validation.invalidAadhaar");
    }

    if (formData.wifeAadhaar && !/^\d{12}$/.test(formData.wifeAadhaar)) {
      newErrors.wifeAadhaar = t("forms.validation.invalidAadhaar");
    }

    // WhatsApp number validation
    if (formData.whatsappNumber && !/^\d{10}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = t("forms.validation.invalidPhone");
    }

    // Email validation (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("forms.validation.invalidEmail");
    }

    // Payment receipt validation
    if (!paymentReceipt) {
      newErrors.paymentReceipt = t("forms.validation.paymentReceiptRequired");
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
      const errorMessage = error?.response?.data?.message || t("forms.common.error");
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
            title={t("forms.common.success")}
            message={t("forms.common.successMessage")}
            onClose={resetForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("forms.marriage.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("forms.marriage.description")}
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
              title={t("forms.marriage.marriageInfo")}
              description={t("forms.marriage.marriageInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.marriage.dateOfMarriage")}
                  name="dateOfMarriage"
                  type="date"
                  value={formData.dateOfMarriage}
                  onChange={handleInputChange}
                  error={errors.dateOfMarriage}
                />
                
                <InputField
                  label={t("forms.marriage.placeOfMarriage")}
                  name="placeOfMarriage"
                  placeholder="Enter place of marriage"
                  value={formData.placeOfMarriage}
                  onChange={handleInputChange}
                  error={errors.placeOfMarriage}
                />
              </div>
            </FormSection>

            {/* Groom Information Section */}
            <FormSection
              title={t("forms.marriage.husbandInfo")}
              description={t("forms.marriage.husbandInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.marriage.husbandName")}
                  name="HusbandName"
                  placeholder="Enter groom's full name"
                  value={formData.HusbandName}
                  onChange={handleInputChange}
                  error={errors.HusbandName}
                />
                
                <InputField
                  label={t("forms.marriage.husbandAadhaar")}
                  name="HusbandAadhaar"
                  placeholder="12-digit Aadhaar number"
                  value={formData.HusbandAadhaar}
                  onChange={handleInputChange}
                  error={errors.HusbandAadhaar}
                />
                
                <InputField
                  label={t("forms.marriage.husbandAge")}
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
                  label={t("forms.marriage.husbandFatherName")}
                  name="HusbandFatherName"
                  placeholder="Enter father's name"
                  value={formData.HusbandFatherName}
                  onChange={handleInputChange}
                  error={errors.HusbandFatherName}
                />
                
                <InputField
                  label={t("forms.marriage.husbandOccupation")}
                  name="HusbandOccupation"
                  placeholder="Enter occupation"
                  value={formData.HusbandOccupation}
                  onChange={handleInputChange}
                  error={errors.HusbandOccupation}
                />
                
                <TextareaField
                  label={t("forms.marriage.husbandAddress")}
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
              title={t("forms.marriage.wifeInfo")}
              description={t("forms.marriage.wifeInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.marriage.wifeName")}
                  name="wifeName"
                  placeholder="Enter bride's full name"
                  value={formData.wifeName}
                  onChange={handleInputChange}
                  error={errors.wifeName}
                />
                
                <InputField
                  label={t("forms.marriage.wifeAadhaar")}
                  name="wifeAadhaar"
                  placeholder="12-digit Aadhaar number"
                  value={formData.wifeAadhaar}
                  onChange={handleInputChange}
                  error={errors.wifeAadhaar}
                />
                
                <InputField
                  label={t("forms.marriage.wifeAge")}
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
                  label={t("forms.marriage.wifeFatherName")}
                  name="wifeFatherName"
                  placeholder="Enter father's name"
                  value={formData.wifeFatherName}
                  onChange={handleInputChange}
                  error={errors.wifeFatherName}
                />
                
                <InputField
                  label={t("forms.marriage.wifeOccupation")}
                  name="wifeOccupation"
                  placeholder="Enter occupation"
                  value={formData.wifeOccupation}
                  onChange={handleInputChange}
                  error={errors.wifeOccupation}
                />
                
                <TextareaField
                  label={t("forms.marriage.wifeAddress")}
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
              title={t("forms.marriage.applicantInfo")}
              description={t("forms.marriage.applicantInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.marriage.applicantFullName")}
                  name="applicantFullName"
                  placeholder="Enter applicant's full name"
                  value={formData.applicantFullName}
                  onChange={handleInputChange}
                  error={errors.applicantFullName}
                />
                
                <InputField
                  label={t("forms.marriage.whatsappNumber")}
                  name="whatsappNumber"
                  placeholder="10-digit mobile number"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  error={errors.whatsappNumber}
                />
                
                <InputField
                  label={t("forms.marriage.email")}
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required={false}
                />
                
                <InputField
                  label={t("forms.marriage.utrNumber")}
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
              title={t("forms.birth.requiredDocs")}
              description={t("forms.birth.requiredDocsDesc")}
              className="mb-8"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">{t("forms.common.paymentReceipt")} (PNG/JPG) - Rs. 20 *</label>
                
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
                      <p className="font-semibold mb-2">{t("forms.common.scanQR")}</p>
                      <p className="mb-1">{t("forms.common.useUPI")}</p>
                      <p className="mb-1">{t("forms.common.uploadScreenshot")}</p>
                      <p className="text-pink-600 font-medium">{t("forms.common.enterUTR")}</p>
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
                      <div className="font-medium mb-1">{t("forms.common.qrDetected")}</div>
                      <div className="p-2 bg-gray-50 rounded border min-h-16">{qrText || t("forms.common.noQR")}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <FileUploadField
                label={t("forms.birth.supportingDocs")}
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
                <h4 className="font-medium text-pink-900 mb-2">{t("forms.birth.recommendedDocs")}</h4>
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
                {loading ? t("forms.common.submitting") : t("forms.common.submit")}
              </SubmitButton>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                aria-label="Reset Form"
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

export default MarriageCertificateForm;
