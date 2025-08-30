import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

// Enhanced Input Field Component
export const InputField = ({ 
  label, 
  name, 
  type = "text", 
  required = true, 
  placeholder = "", 
  className = "",
  error = "",
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className={`
        w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200 ease-in-out
        ${error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400'}
        ${className}
      `}
      required={required}
      {...props}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-red-600 flex items-center gap-2"
      >
        <FaTimes className="text-xs" />
        {error}
      </motion.p>
    )}
  </div>
);

// Enhanced Textarea Field Component
export const TextareaField = ({ 
  label, 
  name, 
  required = true, 
  placeholder = "", 
  rows = 3,
  className = "",
  error = "",
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      rows={rows}
      placeholder={placeholder}
      className={`
        w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200 ease-in-out resize-none
        ${error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400'}
        ${className}
      `}
      required={required}
      {...props}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-red-600 flex items-center gap-2"
      >
        <FaTimes className="text-xs" />
        {error}
      </motion.p>
    )}
  </div>
);

// Enhanced Select Field Component
export const SelectField = ({ 
  label, 
  name, 
  options = [], 
  required = true, 
  placeholder = "Select an option",
  className = "",
  error = "",
  ...props 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      className={`
        w-full px-4 py-3 border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200 ease-in-out bg-white
        ${error ? 'border-red-500 focus:ring-red-500' : 'hover:border-gray-400'}
        ${className}
      `}
      required={required}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-red-600 flex items-center gap-2"
      >
        <FaTimes className="text-xs" />
        {error}
      </motion.p>
    )}
  </div>
);

// Enhanced File Upload Component with AWS Integration
export const FileUploadField = ({ 
  label, 
  name, 
  required = true, 
  multiple = true, 
  maxFiles = 5,
  maxSize = 10, // MB
  acceptedTypes = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"],
  onFilesChange,
  className = "",
  error = "",
  ...props 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`File ${file.name} is not a supported type. Accepted types: ${acceptedTypes.join(', ')}`);
        return false;
      }
      
      return true;
    });

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return '🖼️';
    if (['pdf'].includes(ext || '')) return '📄';
    if (['doc', 'docx'].includes(ext || '')) return '📝';
    return '📎';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Drag & Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${className}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
          required={required && uploadedFiles.length === 0}
          {...props}
        />
        
        <div className="space-y-3">
          <FaUpload className="mx-auto text-3xl text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes.join(', ')} up to {maxSize}MB (max {maxFiles} files)
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected Files ({uploadedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg">{getFileIcon(file.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {uploadProgress[file.name] !== undefined && (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin text-blue-600" />
                      <span className="text-xs text-blue-600">
                        {uploadProgress[file.name]}%
                      </span>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center gap-2"
        >
          <FaTimes className="text-xs" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Enhanced Submit Button Component
export const SubmitButton = ({ 
  loading = false, 
  children, 
  variant = "primary",
  size = "default",
  className = "",
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      type="submit"
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <FaSpinner className="animate-spin" />
          Processing...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

// Form Section Component
export const FormSection = ({ 
  title, 
  description, 
  children, 
  className = "" 
}) => (
  <div className={`space-y-6 ${className}`}>
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Success Message Component
export const SuccessMessage = ({ 
  title, 
  message, 
  icon: Icon = FaCheck,
  onClose 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
  >
    <Icon className="mx-auto text-4xl text-green-500 mb-4" />
    <h3 className="text-xl font-semibold text-green-800 mb-2">{title}</h3>
    <p className="text-green-700 mb-4">{message}</p>
    {onClose && (
      <button
        onClick={onClose}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
      >
        Close
      </button>
    )}
  </motion.div>
);
