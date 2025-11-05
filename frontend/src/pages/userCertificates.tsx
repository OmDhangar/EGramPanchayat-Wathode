import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaSpinner, FaClock, FaFileAlt } from 'react-icons/fa';
// 'axios' is not needed directly if 'api' is configured
import { useAuthContext } from '../Context/authContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios';

// Interface for individual uploaded files
interface UploadedFile {
  _id: string;
  originalName: string;
  fileName: string;
  isPaymentReceipt?: boolean;
}

// Updated Certificate interface to include uploaded files
interface Certificate {
  _id: string;
  applicationId: string;
  documentType: string;
  status: string;
  generatedCertificate?: {
    fileName: string;
    filePath: string;
    generatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  uploadedFiles: UploadedFile[]; // Added this array
}

const UserCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // State to track which specific file is being downloaded
  const [downloading, setDownloading] = useState<string | null>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user?._id) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(
          `/applications/user/${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        console.log(response.data.data)
        setCertificates(response.data.data);
      } catch (err) {
        setError('Failed to fetch certificates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
    // Removed the separate fetchSignedUrls call
  }, [user]); // Added user as a dependency

  // Function to get a secure URL on-demand and open it
  const handleDownload = async (applicationId: string, fileId: string | 'certificate') => {
    const uniqueId = `${applicationId}-${fileId}`;
    setDownloading(uniqueId);
    setError(null);

    try {
      // Determine the correct API endpoint based on file type
      const url = fileId === 'certificate'
        ? `/applications/files/${applicationId}/certificate/signed-url`
        : `/applications/files/${applicationId}/${fileId}/signed-url`;

      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const signedUrl = response.data.data.url;
      if (signedUrl) {
        window.open(signedUrl, '_blank', 'noopener,noreferrer');
      } else {
        throw new Error("No URL returned from API");
      }
    } catch (err) {
      setError('Failed to get download link. Please try again.');
      console.error(err);
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'certificate_generated':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <FaSpinner className="animate-spin text-4xl text-blue-600" />
    </div>
  );

  const viewFormDetails = (formId: string) => {
    navigate(`/form-details/${formId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Certificates</h1>
        
        {/* Display error message if any download fails */}
        {error && (
            <div className="mb-4 p-4 text-center text-red-700 bg-red-100 rounded-lg">
                {error}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert._id}
              onClick={() => viewFormDetails(cert.applicationId)} // Navigate on card click
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cert.documentType.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {cert.applicationId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(cert.status)}`}>
                    {cert.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaClock className="inline-block mr-2 flex-shrink-0" />
                    Submitted: {new Date(cert.createdAt).toLocaleDateString()}
                  </p>

                  {/* --- FIXED CERTIFICATE DOWNLOAD BUTTON --- */}
                  {cert.status === 'certificate_generated' && cert.generatedCertificate && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card navigation
                          handleDownload(cert.applicationId, 'certificate');
                        }}
                        disabled={downloading === `${cert.applicationId}-certificate`}
                        className="inline-flex w-full justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {downloading === `${cert.applicationId}-certificate` ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaDownload />
                        )}
                        Download Certificate
                      </button>
                    </div>
                  )}

                  {/* --- NEW SECTION FOR UPLOADED FILES --- */}
                  {cert.uploadedFiles && cert.uploadedFiles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Submitted Files</h4>
                      <ul className="space-y-2">
                        {cert.uploadedFiles.map((file) => (
                          <li key={file._id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md">
                            <span className="text-gray-700 truncate pr-2 flex items-center">
                              <FaFileAlt className="text-gray-400 mr-2 flex-shrink-0" />
                              {file.isPaymentReceipt ? 'Payment Receipt' : (file.originalName || file.fileName)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card navigation
                                handleDownload(cert.applicationId, file._id);
                              }}
                              disabled={downloading === `${cert.applicationId}-${file._id}`}
                              className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-300 disabled:opacity-50"
                            >
                              {downloading === `${cert.applicationId}-${file._id}` ? (
                                <FaSpinner className="animate-spin" />
                              ) : (
                                <FaDownload />
                              )}
                              Download
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No certificates found. Apply for a certificate first.
          </div>
        )}

        {/* --- REMOVED THE OLD FILEURLS.MAP BLOCK --- */}
        
      </div>
    </div>
  );
};

export default UserCertificates;