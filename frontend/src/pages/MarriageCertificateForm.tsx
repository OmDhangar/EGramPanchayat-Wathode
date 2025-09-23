import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaUser, FaHome, FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import { api } from "../api/axios";
import { Helmet } from "react-helmet";
import {
  InputField,
  TextareaField,
  SelectField,
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
  HusbandAge: string;
  HusbandFatherName: string;
  HusbandAddress: string;
  HusbandOccupation: string;
  wifeName: string;
  wifeAge: string;
  wifeFatherName: string;
  wifeAddress: string;
  wifeOccupation: string;
  SolemnizedOn: string;
}

const MarriageCertificateForm = () => {
  const [formData, setFormData] = useState<MarriageCertificateFormData>({
    dateOfMarriage: "",
    placeOfMarriage: "",
    HusbandName: "",
    HusbandAge: "",
    HusbandFatherName: "",
    HusbandAddress: "",
    HusbandOccupation: "",
    wifeName: "",
    wifeAge: "",
    wifeFatherName: "",
    wifeAddress: "",
    wifeOccupation: "",
    SolemnizedOn: ""
  });
  
  const [files, setFiles] = useState<File[]>([]);
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    Object.keys(formData).forEach(key => {
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

    if (files.length === 0) {
      newErrors.files = "Please upload at least one document";
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
      
      // Append files
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
      HusbandAge: "",
      HusbandFatherName: "",
      HusbandAddress: "",
      HusbandOccupation: "",
      wifeName: "",
      wifeAge: "",
      wifeFatherName: "",
      wifeAddress: "",
      wifeOccupation: "",
      SolemnizedOn: ""
    });
    setFiles([]);
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

            {/* Document Upload Section */}
            <FormSection
              title="Required Documents"
              description="Upload supporting documents (maximum 5 files, 10MB each)"
              className="mb-8"
            >
              <FileUploadField
                label="Supporting Documents"
                name="documents"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                acceptedTypes={[".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"]}
                onFilesChange={handleFilesChange}
                error={errors.files}
                required={true}
              />
              
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="font-medium text-pink-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• Marriage invitation card</li>
                  <li>• Wedding photographs</li>
                  <li>• Identity proof of both parties</li>
                  <li>• Address proof of both parties</li>
                  <li>• Age proof documents</li>
                  <li>• Any other relevant documents</li>
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
