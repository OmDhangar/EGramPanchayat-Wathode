import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSkull, FaUser, FaHome, FaHospital, FaFileAlt, FaPhone } from "react-icons/fa";
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

// Form validation interface
interface FormErrors {
  [key: string]: string;
}

// Form data interface
interface DeathCertificateFormData {
  deceasedName: string;
  dateOfDeath: string;
  addressOfDeath: string;
  placeOfDeath: string;
  age: string;
  gender: string;
  causeOfDeath: string;
  deceasedAdharNumber: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  spouseAdhar: string;
  motherAdhar: string;
  fatherAdhar: string;
  permanentAddress: string;
}

const DeathCertificateForm = () => {
  const [formData, setFormData] = useState<DeathCertificateFormData>({
    deceasedName: "",
    dateOfDeath: "",
    addressOfDeath: "",
    placeOfDeath: "",
    age: "",
    gender: "",
    causeOfDeath: "",
    deceasedAdharNumber: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    spouseAdhar: "",
    motherAdhar: "",
    fatherAdhar: "",
    permanentAddress: ""
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Gender options for select field
  const genderOptions = [
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof DeathCertificateFormData]) {
        newErrors[key] = "This field is required";
      }
    });

    // Specific validations
    if (formData.dateOfDeath) {
      const deathDate = new Date(formData.dateOfDeath);
      const today = new Date();
      if (deathDate > today) {
        newErrors.dateOfDeath = "Date of death cannot be in the future";
      }
    }

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 0 || Number(formData.age) > 150)) {
      newErrors.age = "Age must be a valid number between 0 and 150";
    }

    if (formData.deceasedAdharNumber && !/^\d{12}$/.test(formData.deceasedAdharNumber)) {
      newErrors.deceasedAdharNumber = "Aadhaar number must be 12 digits";
    }

    if (formData.spouseAdhar && !/^\d{12}$/.test(formData.spouseAdhar)) {
      newErrors.spouseAdhar = "Aadhaar number must be 12 digits";
    }

    if (formData.motherAdhar && !/^\d{12}$/.test(formData.motherAdhar)) {
      newErrors.motherAdhar = "Aadhaar number must be 12 digits";
    }

    if (formData.fatherAdhar && !/^\d{12}$/.test(formData.fatherAdhar)) {
      newErrors.fatherAdhar = "Aadhaar number must be 12 digits";
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
      deceasedName: "",
      dateOfDeath: "",
      addressOfDeath: "",
      placeOfDeath: "",
      age: "",
      gender: "",
      causeOfDeath: "",
      deceasedAdharNumber: "",
      fatherName: "",
      motherName: "",
      spouseName: "",
      spouseAdhar: "",
      motherAdhar: "",
      fatherAdhar: "",
      permanentAddress: ""
    });
    setFiles([]);
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
            {/* Deceased Person Information Section */}
            <FormSection
              title="Deceased Person Information"
              description="Enter the details of the deceased person"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Deceased Person's Full Name"
                  name="deceasedName"
                  placeholder="Enter full name"
                  value={formData.deceasedName}
                  onChange={handleInputChange}
                  error={errors.deceasedName}
                />
                
                <InputField
                  label="Date of Death"
                  name="dateOfDeath"
                  type="date"
                  value={formData.dateOfDeath}
                  onChange={handleInputChange}
                  error={errors.dateOfDeath}
                />
                
                <InputField
                  label="Place of Death"
                  name="placeOfDeath"
                  placeholder="Enter place of death"
                  value={formData.placeOfDeath}
                  onChange={handleInputChange}
                  error={errors.placeOfDeath}
                />
                
                <InputField
                  label="Age at Death"
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={handleInputChange}
                  error={errors.age}
                />
                
                <SelectField
                  label="Gender"
                  name="gender"
                  options={genderOptions}
                  placeholder="Select gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  error={errors.gender}
                />
                
                <InputField
                  label="Cause of Death"
                  name="causeOfDeath"
                  placeholder="Enter cause of death"
                  value={formData.causeOfDeath}
                  onChange={handleInputChange}
                  error={errors.causeOfDeath}
                />
              </div>
            </FormSection>

            {/* Address Information Section */}
            <FormSection
              title="Address Information"
              description="Enter address details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Address at Time of Death"
                  name="addressOfDeath"
                  placeholder="Enter address where death occurred"
                  value={formData.addressOfDeath}
                  onChange={handleInputChange}
                  error={errors.addressOfDeath}
                  className="md:col-span-2"
                />
                
                <TextareaField
                  label="Permanent Address"
                  name="permanentAddress"
                  placeholder="Enter permanent address"
                  rows={3}
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  error={errors.permanentAddress}
                  className="md:col-span-2"
                />
              </div>
            </FormSection>

            {/* Family Information Section */}
            <FormSection
              title="Family Information"
              description="Enter family member details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Father's Name"
                  name="fatherName"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  error={errors.fatherName}
                />
                
                <InputField
                  label="Mother's Name"
                  name="motherName"
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  error={errors.motherName}
                />
                
                <InputField
                  label="Spouse Name (if applicable)"
                  name="spouseName"
                  placeholder="Enter spouse's name"
                  value={formData.spouseName}
                  onChange={handleInputChange}
                  error={errors.spouseName}
                  required={false}
                />
              </div>
            </FormSection>

            {/* Aadhaar Information Section */}
            <FormSection
              title="Aadhaar Information"
              description="Enter Aadhaar numbers for verification"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Deceased Person's Aadhaar"
                  name="deceasedAdharNumber"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  pattern="\d{12}"
                  value={formData.deceasedAdharNumber}
                  onChange={handleInputChange}
                  error={errors.deceasedAdharNumber}
                />
                
                <InputField
                  label="Spouse's Aadhaar (if applicable)"
                  name="spouseAdhar"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  pattern="\d{12}"
                  value={formData.spouseAdhar}
                  onChange={handleInputChange}
                  error={errors.spouseAdhar}
                  required={false}
                />
                
                <InputField
                  label="Father's Aadhaar"
                  name="fatherAdhar"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  pattern="\d{12}"
                  value={formData.fatherAdhar}
                  onChange={handleInputChange}
                  error={errors.fatherAdhar}
                  required={false}
                />
                
                <InputField
                  label="Mother's Aadhaar"
                  name="motherAdhar"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  pattern="\d{12}"
                  value={formData.motherAdhar}
                  onChange={handleInputChange}
                  error={errors.motherAdhar}
                  required={false}
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
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Hospital/Doctor's death certificate</li>
                  <li>• Identity proof of deceased person</li>
                  <li>• Address proof</li>
                  <li>• Family member's identity proof</li>
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
                variant="danger"
                size="lg"
                className="flex-1"
              >
                Submit Application
              </SubmitButton>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
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
