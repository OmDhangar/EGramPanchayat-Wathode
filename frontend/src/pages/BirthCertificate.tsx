import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBaby } from "react-icons/fa";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    
    // Required field validations matching backend exactly
    if (!formData.financialYear) newErrors.financialYear = t("forms.validation.required");
    if (!formData.childName) newErrors.childName = t("forms.validation.required");
    if (!formData.dateOfBirth) newErrors.dateOfBirth = t("forms.validation.required");
    if (!formData.placeOfBirth) newErrors.placeOfBirth = t("forms.validation.required");
    if (!formData.gender) newErrors.gender = t("forms.validation.required");
    if (!formData.fatherName) newErrors.fatherName = t("forms.validation.required");
    if (!formData.motherName) newErrors.motherName = t("forms.validation.required");
    if (!formData.applicantFullNameEnglish) newErrors.applicantFullNameEnglish = t("forms.validation.required");
    if (!formData.applicantFullNameDevanagari) newErrors.applicantFullNameDevanagari = t("forms.validation.required");
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) newErrors.whatsappNumber = t("forms.validation.invalidPhone");
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("forms.validation.invalidEmail");
    if (!formData.address) newErrors.address = t("forms.validation.required");
    if (!formData.utrNumber) newErrors.utrNumber = t("forms.validation.required");
    if (!paymentReceipt) newErrors.paymentReceipt = t("forms.validation.paymentReceiptRequired");
    
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
      const errorMessage = error?.response?.data?.message || t("forms.common.error");
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("forms.birth.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("forms.birth.description")}
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
              title={t("forms.birth.childInfo")}
              description={t("forms.birth.childInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.birth.financialYear")}
                  name="financialYear"
                  placeholder="2025-26"
                  value={formData.financialYear}
                  onChange={handleInputChange}
                  error={errors.financialYear}
                />
                <InputField
                  label={t("forms.birth.childName")}
                  name="childName"
                  placeholder="Enter child's full name"
                  value={formData.childName}
                  onChange={handleInputChange}
                  error={errors.childName}
                />
                
                <InputField
                  label={t("forms.birth.dateOfBirth")}
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={errors.dateOfBirth}
                />
                
                <InputField
                  label={t("forms.birth.placeOfBirth")}
                  name="placeOfBirth"
                  placeholder="Enter place of birth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  error={errors.placeOfBirth}
                />
                
                <SelectField
                  label={t("forms.birth.gender")}
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
              title={t("forms.birth.parentsInfo")}
              description={t("forms.birth.parentsInfoDesc")}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label={t("forms.birth.fatherName")}
                  name="fatherName"
                  placeholder="Enter father's full name"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  error={errors.fatherName}
                />
                <InputField
                  label={t("forms.birth.motherName")}
                  name="motherName"
                  placeholder="Enter mother's full name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  error={errors.motherName}
                />
                
                <InputField
                  label={t("forms.birth.fatherOccupation")}
                  name="fatherOccupation"
                  placeholder="Enter father's occupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  error={errors.fatherOccupation}
                  required={false}
                />

                {/* Added missing Mother's Occupation field */}
                <InputField
                  label={t("forms.birth.motherOccupation")}
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
              title={t("forms.birth.addressInfo")}
              description={t("forms.birth.addressInfoDesc")}
              className="mb-8"
            >
              {/* Added missing Parents Address at Birth field */}
              <TextareaField
                label={t("forms.birth.parentsAddressAtBirth")}
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
                label={t("forms.birth.permanentAddressParent")}
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
                  label={t("forms.birth.applicantFullNameEnglish")}
                  name="applicantFullNameEnglish"
                  placeholder="John Doe"
                  value={formData.applicantFullNameEnglish}
                  onChange={handleInputChange}
                  error={errors.applicantFullNameEnglish}
                />
                <InputField
                  label={t("forms.birth.applicantFullNameDevanagari")}
                  name="applicantFullNameDevanagari"
                  placeholder="जॉन डो"
                  value={formData.applicantFullNameDevanagari}
                  onChange={handleInputChange}
                  error={errors.applicantFullNameDevanagari}
                />
                <InputField
                  label={t("forms.birth.whatsappNumber")}
                  name="whatsappNumber"
                  placeholder="10-digit mobile"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  error={errors.whatsappNumber}
                />
                <InputField
                  label={t("forms.birth.email")}
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required={false}
                />
              </div>
              
              <TextareaField
                label={t("forms.birth.currentAddress")}
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
              title={t("forms.birth.paymentInfo")}
              description={t("forms.birth.paymentInfoDesc")}
              className="mb-8"
            >
              <InputField
                label={t("forms.birth.utrNumber")}
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
                      <p className="font-semibold mb-2">{t("forms.common.scanQR")}</p>
                      <p className="mb-1">{t("forms.common.useUPI")}</p>
                      <p className="mb-1">{t("forms.common.uploadScreenshot")}</p>
                      <p className="text-blue-600 font-medium">{t("forms.common.enterUTR")}</p>
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
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-blue-900 mb-2">{t("forms.birth.recommendedDocs")}</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>{t("forms.birth.parentIdProof")}</li>
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

export default BirthCertificateForm;