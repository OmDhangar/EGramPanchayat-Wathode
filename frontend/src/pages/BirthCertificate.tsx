import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBaby, FaUser, FaHome, FaHospital, FaFileAlt } from "react-icons/fa";
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

// Form data interface
interface BirthCertificateFormData {
  childName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  fatherName: string;
  fatherAdharNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherAdharNumber: string;
  motherOccupation: string;
  hospitalName: string;
  parentsAddressAtBirth: string;
  permanentAddressParent: string;
}

const BirthCertificateForm = () => {
  const [formData, setFormData] = useState<BirthCertificateFormData>({
    childName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    fatherName: "",
    fatherAdharNumber: "",
    fatherOccupation: "",
    motherName: "",
    motherAdharNumber: "",
    motherOccupation: "",
    hospitalName: "",
    parentsAddressAtBirth: "",
    permanentAddressParent: ""
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
      if (!formData[key as keyof BirthCertificateFormData]) {
        newErrors[key] = "This field is required";
      }
    });

    // Specific validations
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    if (formData.fatherAdharNumber && !/^\d{12}$/.test(formData.fatherAdharNumber)) {
      newErrors.fatherAdharNumber = "Aadhaar number must be 12 digits";
    }

    if (formData.motherAdharNumber && !/^\d{12}$/.test(formData.motherAdharNumber)) {
      newErrors.motherAdharNumber = "Aadhaar number must be 12 digits";
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
      const errorMessage = error?.response?.data?.message || "Failed to submit application. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      childName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      gender: "",
      fatherName: "",
      fatherAdharNumber: "",
      fatherOccupation: "",
      motherName: "",
      motherAdharNumber: "",
      motherOccupation: "",
      hospitalName: "",
      parentsAddressAtBirth: "",
      permanentAddressParent: ""
    });
    setFiles([]);
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
                  options={genderOptions}
                  placeholder="Select gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  error={errors.gender}
                />
              </div>
            </FormSection>

            {/* Father's Information Section */}
            <FormSection
              title="Father's Information"
              description="Enter the father's details"
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
                  label="Father's Aadhaar Number"
                  name="fatherAdharNumber"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  pattern="\d{12}"
                  value={formData.fatherAdharNumber}
                  onChange={handleInputChange}
                  error={errors.fatherAdharNumber}
                />
                
                <InputField
                  label="Father's Occupation"
                  name="fatherOccupation"
                  placeholder="Enter occupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  error={errors.fatherOccupation}
                />
              </div>
            </FormSection>

            {/* Mother's Information Section */}
            <FormSection
              title="Mother's Information"
              description="Enter the mother's details"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Mother's Full Name"
                  name="motherName"
                  placeholder="Enter mother's full name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  error={errors.motherName}
                />
                
                <InputField
                  label="Mother's Aadhaar Number"
                  name="motherAdharNumber"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  pattern="\d{12}"
                  value={formData.motherAdharNumber}
                  onChange={handleInputChange}
                  error={errors.motherAdharNumber}
                />
                
                <InputField
                  label="Mother's Occupation"
                  name="motherOccupation"
                  placeholder="Enter occupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  error={errors.motherOccupation}
                />
              </div>
            </FormSection>

            {/* Hospital & Address Information Section */}
            <FormSection
              title="Hospital & Address Information"
              description="Enter hospital details and addresses"
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Hospital Name"
                  name="hospitalName"
                  placeholder="Enter hospital name"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  error={errors.hospitalName}
                />
                
                <TextareaField
                  label="Parents' Address at Birth"
                  name="parentsAddressAtBirth"
                  placeholder="Enter address where parents lived at the time of birth"
                  rows={3}
                  value={formData.parentsAddressAtBirth}
                  onChange={handleInputChange}
                  error={errors.parentsAddressAtBirth}
                  className="md:col-span-2"
                />
                
                <TextareaField
                  label="Permanent Address"
                  name="permanentAddressParent"
                  placeholder="Enter permanent address of parents"
                  rows={3}
                  value={formData.permanentAddressParent}
                  onChange={handleInputChange}
                  error={errors.permanentAddressParent}
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
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Documents:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Hospital/Doctor's certificate</li>
                  <li>• Identity proof of parents</li>
                  <li>• Address proof</li>
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
                variant="primary"
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

export default BirthCertificateForm;
