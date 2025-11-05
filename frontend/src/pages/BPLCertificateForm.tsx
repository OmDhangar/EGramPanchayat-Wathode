import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { api } from "../api/axios";
import {
  InputField,
  TextareaField,
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
interface BPLCertificateFormData {
  financialYear: string;
  applicantName: string;
  aadhaarNumber: string;
  address: string;
  taluka: string;
  district: string;
  whatsappNumber: string;
  email: string;
  utrNumber: string;
  bplYear: string;
  bplListSerialNo: string;
}

const BPLCertificateForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BPLCertificateFormData>({
    financialYear: "",
    applicantName: "",
    aadhaarNumber: "",
    address: "",
    taluka: "",
    district: "",
    whatsappNumber: "",
    email: "",
    utrNumber: "",
    bplYear: "",
    bplListSerialNo: ""
  });
  
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required field validations
    if (!formData.financialYear) newErrors.financialYear = t("forms.validation.required");
    if (!formData.applicantName) newErrors.applicantName = t("forms.validation.required");
    if (!formData.aadhaarNumber || !/^\d{12}$/.test(formData.aadhaarNumber)) 
      newErrors.aadhaarNumber = "Aadhaar must be 12 digits";
    if (!formData.address) newErrors.address = t("forms.validation.required");
    if (!formData.taluka) newErrors.taluka = t("forms.validation.required");
    if (!formData.district) newErrors.district = t("forms.validation.required");
    if (!formData.whatsappNumber || !/^\d{10}$/.test(formData.whatsappNumber)) 
      newErrors.whatsappNumber = t("forms.validation.invalidPhone");
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
      newErrors.email = t("forms.validation.invalidEmail");
    if (!formData.utrNumber) newErrors.utrNumber = t("forms.validation.required");
    if (!formData.bplYear) newErrors.bplYear = t("forms.validation.required");
    if (!formData.bplListSerialNo) newErrors.bplListSerialNo = t("forms.validation.required");
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

      if (paymentReceipt) {
        formDataToSend.append("paymentReceipt", paymentReceipt);
      }

      const response = await api.post("/applications/bpl-certificate", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      // Error is handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      financialYear: "",
      applicantName: "",
      aadhaarNumber: "",
      address: "",
      taluka: "",
      district: "",
      whatsappNumber: "",
      email: "",
      utrNumber: "",
      bplYear: "",
      bplListSerialNo: ""
    });
    setPaymentReceipt(null);
    setReceiptPreview("");
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
    <>
      <Helmet>
        <title>BPL Certificate Application | Gram Panchayat</title>
        <meta name="description" content="Apply for BPL certificate online" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-green-100 rounded-full">
                <FaFileAlt className="text-3xl text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {t("forms.bplCertificate.title")}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t("forms.bplCertificate.description")}
                </p>
              </div>
            </div>

            {/* Fee Information */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 font-semibold">
                📋 {t("forms.common.applicationFee")}: ₹20
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                {t("forms.common.paymentInstructions")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Applicant Details Section */}
              <FormSection 
                title={t("forms.bplCertificate.applicantInfo")}
                description={t("forms.bplCertificate.applicantInfoDesc")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label={t("forms.common.financialYear")}
                    name="financialYear"
                    value={formData.financialYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024-2025"
                    required
                    error={errors.financialYear}
                  />
                  <InputField
                    label={t("forms.common.applicantName")}
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    error={errors.applicantName}
                  />
                  <InputField
                    label={t("forms.common.aadhaarNumber")}
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    placeholder="12-digit Aadhaar"
                    required
                    error={errors.aadhaarNumber}
                  />
                  <InputField
                    label={t("forms.common.whatsappNumber")}
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    required
                    error={errors.whatsappNumber}
                  />
                  <InputField
                    label={t("forms.common.email")}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    error={errors.email}
                  />
                </div>
                <div className="mt-4">
                  <TextareaField
                    label={t("forms.common.address")}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full Address"
                    required
                    error={errors.address}
                    rows={3}
                  />
                </div>
              </FormSection>

              {/* Location Details Section */}
              <FormSection 
                title={t("forms.bplCertificate.bplInfo")}
                description=""
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label={t("forms.bplCertificate.taluka")}
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleInputChange}
                    placeholder="Taluka"
                    required
                    error={errors.taluka}
                  />
                  <InputField
                    label={t("forms.bplCertificate.district")}
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="District"
                    required
                    error={errors.district}
                  />
                </div>
              </FormSection>

              {/* BPL Details Section */}
              <FormSection 
                title={t("forms.bplCertificate.bplInfo")}
                description={t("forms.bplCertificate.bplInfoDesc")}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label={t("forms.bplCertificate.bplYear")}
                    name="bplYear"
                    value={formData.bplYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2011"
                    required
                    error={errors.bplYear}
                  />
                  <InputField
                    label={t("forms.bplCertificate.bplListSerialNo")}
                    name="bplListSerialNo"
                    value={formData.bplListSerialNo}
                    onChange={handleInputChange}
                    placeholder="Serial Number"
                    required
                    error={errors.bplListSerialNo}
                  />
                </div>
              </FormSection>

              {/* Payment Details Section */}
              <FormSection 
                title={t("forms.bplCertificate.paymentInfo")}
                description={t("forms.bplCertificate.paymentInfoDesc")}
              >
                <div className="space-y-4">
                  <InputField
                    label={t("forms.common.utrNumber")}
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleInputChange}
                    placeholder="12-digit UTR Number"
                    required
                    error={errors.utrNumber}
                  />
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("forms.common.paymentReceipt")} (PNG/JPG) - Rs. 20 *
                    </label>
                    {/* QR Code for Payment */}
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-shrink-0">
                        <img 
                            src="/images/QR.jpg" 
                            alt="Payment QR Code" 
                            className="w-82 h-82 object-contain border border-gray-300 rounded-lg"
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
                      onChange={e => handleReceiptChange(e.target.files?.[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.paymentReceipt && (
                      <p className="text-red-600 text-sm mt-1">{errors.paymentReceipt}</p>
                    )}
                    {receiptPreview && (
                      <div className="mt-4">
                        <img
                          src={receiptPreview}
                          alt="Receipt Preview"
                          className="max-w-xs rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Submit Button */}
              <SubmitButton loading={loading}>
                {t("forms.common.submit")}
              </SubmitButton>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default BPLCertificateForm;
