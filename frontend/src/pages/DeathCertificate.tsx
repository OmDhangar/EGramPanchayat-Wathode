import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSkull } from "react-icons/fa";
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
  const { t } = useTranslation();
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
    if (!formData.financialYear) newErrors.financialYear = t("forms.validation.required");
    if (!formData.nameOfDeceased) newErrors.nameOfDeceased = t("forms.validation.required");
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = t("forms.validation.invalidAadhaar");
    if (!formData.address) newErrors.address = t("forms.validation.required");
    if (!formData.dateOfDeath) newErrors.dateOfDeath = t("forms.validation.required");
    if (!formData.causeOfDeath) newErrors.causeOfDeath = t("forms.validation.required");
    if (!formData.applicantFullNameEnglish) newErrors.applicantFullNameEnglish = t("forms.validation.required");
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = t("forms.validation.invalidPhone");
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("forms.validation.invalidEmail");
    if (!formData.utrNumber) newErrors.utrNumber = t("forms.validation.required");
    if (!paymentReceipt) newErrors.paymentReceipt = t("forms.validation.paymentReceiptRequired");

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
      const errorMessage = error?.response?.data?.message || t("forms.common.error");
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("forms.death.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("forms.death.description")}
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
              title={t("forms.death.deceasedInfo")}
              description={t("forms.death.deceasedInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label={t("forms.death.financialYear")} name="financialYear" placeholder="2025-26" value={formData.financialYear} onChange={handleInputChange} error={errors.financialYear} />
                <InputField label={t("forms.death.nameOfDeceased")} name="nameOfDeceased" placeholder="Enter full name" value={formData.nameOfDeceased} onChange={handleInputChange} error={errors.nameOfDeceased} />
                <InputField label={t("forms.death.aadhaarNumber")} name="aadhaarNumber" placeholder="12-digit Aadhaar" value={formData.aadhaarNumber} onChange={handleInputChange} error={errors.aadhaarNumber} required={false} />
                <InputField label={t("forms.death.dateOfDeath")} name="dateOfDeath" type="date" value={formData.dateOfDeath} onChange={handleInputChange} error={errors.dateOfDeath} />
                <InputField label={t("forms.death.causeOfDeath")} name="causeOfDeath" placeholder="Enter cause of death" value={formData.causeOfDeath} onChange={handleInputChange} error={errors.causeOfDeath} className="md:col-span-2" />
              </div>
            </FormSection>

            {/* Address Information Section */}
            <FormSection
              title={t("forms.birth.addressInfo")}
              description={t("forms.birth.addressInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaField label={t("forms.death.address")} name="address" placeholder="Enter address" rows={3} value={formData.address} onChange={handleInputChange} error={errors.address} className="md:col-span-2" />
              </div>
            </FormSection>

            <FormSection title={t("forms.death.applicantInfo")} description={t("forms.death.applicantInfoDesc")} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label={t("forms.death.applicantFullNameEnglish")} name="applicantFullNameEnglish" placeholder="John Doe" value={formData.applicantFullNameEnglish} onChange={handleInputChange} error={errors.applicantFullNameEnglish} />
                <InputField label={t("forms.death.whatsappNumber")} name="whatsappNumber" placeholder="10-digit mobile" value={formData.whatsappNumber} onChange={handleInputChange} error={errors.whatsappNumber} />
                <InputField label={t("forms.death.email")} name="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} error={errors.email} required={false} />
              </div>
            </FormSection>

            {/* Payment Information Section */}
            <FormSection
              title={t("forms.death.paymentInfo")}
              description={t("forms.death.paymentInfoDesc")}
              className="mb-8"
            >
              <InputField
                label={t("forms.death.utrNumber")}
                name="utrNumber"
                placeholder="Enter UTR number from payment receipt"
                value={formData.utrNumber}
                onChange={handleInputChange}
                error={errors.utrNumber}
              />
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
                      <p className="font-semibold mb-2">{t("forms.common.scanQR")}</p>
                      <p className="mb-1">{t("forms.common.useUPI")}</p>
                      <p className="mb-1">{t("forms.common.uploadScreenshot")}</p>
                      <p className="text-red-600 font-medium">{t("forms.common.enterUTR")}</p>
                    </div>
                  </div>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  
                  onChange={e => handleReceiptChange(e.target.files?.[0] || undefined)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
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
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-red-900 mb-2">{t("forms.birth.recommendedDocs")}</h4>
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

export default DeathCertificateForm;
