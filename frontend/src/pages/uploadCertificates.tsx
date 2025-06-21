import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaFileAlt, FaCheck, FaSpinner, FaDownload, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { api } from '../api/axios';

interface Application {
  _id: string;
  applicationId: string;
  applicantId: {
    _id: string;
    fullName: string;
  };
  documentType: string;
  status: string;
  uploadedFiles: Array<{
    fileName: string;
    originalName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    _id: string;
    uploadedAt: string;
  }>;
  paymentDetails: {
    paymentStatus: string;
  };
  adminRemarks?: string;
  reviewedAt?: string;
  formDataRef: string;
}

const UploadCertificates = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovedApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        '/applications/admin/filter?status=approved'
      );
      setApplications(response.data.data);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  const handleCertificateUpload = async (applicationId: string, file: File) => {
    try {
      setUploading(applicationId);
      const formData = new FormData();
      formData.append('certificate', file);

      await api.post(
        `/applications/admin/certificate/${applicationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      // Refresh the applications list
      await fetchApprovedApplications();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload certificate');
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Certificates</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((application) => (
            <motion.div
              key={application._id}
              className="bg-white rounded-lg shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {application.documentType.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {application.applicationId}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {application.status.toUpperCase()}
                </span>
              </div>

              {/* Applicant Details */}
              <div className="mb-4">
                <p className="text-sm">
                  <span className="font-medium">Applicant:</span> {application.applicantId.fullName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Reviewed:</span>{' '}
                  {new Date(application.reviewedAt!).toLocaleDateString()}
                </p>
                {application.adminRemarks && (
                  <p className="text-sm mt-2">
                    <span className="font-medium">Remarks:</span>{' '}
                    <span className="text-gray-600">{application.adminRemarks}</span>
                  </p>
                )}
              </div>

              {/* Uploaded Documents */}
              <div className="mb-4">
                <p className="font-medium text-sm mb-2">Submitted Documents:</p>
                <div className="space-y-2">
                  {application.uploadedFiles.map((file) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FaFileAlt className="text-blue-500" />
                        <span className="text-sm truncate">{file.originalName}</span>
                      </div>
                      <a
                        href={file.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaDownload />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Certificate Section */}
              <div className="mt-6 border-t pt-4">
                <label className={`
                  w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed
                  ${uploading === application._id 
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                    : 'border-blue-300 hover:border-blue-400 cursor-pointer'
                  }
                `}>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCertificateUpload(application._id, file);
                    }}
                    disabled={uploading === application._id}
                  />
                  {uploading === application._id ? (
                    <>
                      <FaSpinner className="animate-spin text-blue-600" />
                      <span className="text-gray-600">Uploading Certificate...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload className="text-blue-600" />
                      <span className="text-blue-600">Upload Final Certificate</span>
                    </>
                  )}
                </label>
              </div>
            </motion.div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No approved applications waiting for certificates.
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCertificates;