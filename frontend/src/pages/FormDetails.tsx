import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaArrowLeft, FaDownload, FaReceipt } from 'react-icons/fa';
import { api } from '../api/axios';
import { Helmet } from "react-helmet";

// Payment gateway removed

interface UploadedFile {
  _id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  isPaymentReceipt?: boolean; // Flag to identify payment receipt
}

// PaymentDetails interface inlined in FormDetails.paymentDetails

interface FormDetails {
  _id: string;
  applicationId: string;
  applicantId: string;
  documentType: 'birth_certificate' | 'death_certificate' | 'marriage_certificate'| string; // Added 'death_certificate'
  status: 'pending' | 'approved' | 'rejected' | 'certificate_generated'; // Added new status
  uploadedFiles: UploadedFile[];
  paymentDetails: {
    paymentStatus: 'pending' | 'completed' | 'failed'; // Expanded based on your data
    paymentId?: string;
    paymentAmount?: number;
    paymentDate?: string;
    amount?: number;
    utrNumber?: string;
    receiptUrl?: string; // Added receipt URL
  };
  createdAt: string;
  updatedAt: string;
  formDataModel: string;
  formDataRef: string;
  adminRemarks?: string;
  reviewedAt?: string; // New field from your data
  reviewedBy?: string; // New field from your data
  generatedCertificate?: { // New field from your data
    fileName: string;
    filePath: string;
    generatedAt: string;
  };
  __v: number;
}

interface BirthCertificateFormData {
  _id: string;
  applicationId: string;
  childName: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  fatherAdharNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherAdharNumber: string;
  motherOccupation: string;
  hospitalName: string;
  placeOfBirth: string;
  parentsAddressAtBirth: string;
  permanentAddressParent: string;
  paymentAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GenericFormData {
  [key: string]: any;
}


type FormData = BirthCertificateFormData | GenericFormData;

interface User {
  role: 'admin' | 'user';
  id: string;
}

const FormDetails = () => {
  const { applicationId } = useParams();
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Removed payment loading state
  const [showAnimation, setShowAnimation] = useState<null | 'approved' | 'rejected'>(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Removed unused fileUrls state
  const [loadingUrls, setLoadingUrls] = useState<Record<string, boolean>>({});
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  // Removed unused loadingFiles state

  // Removed Razorpay script injection

  // Get user info from token or context
  useEffect(() => {
    const getUserInfo = () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Decode JWT token to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            role: payload.role || 'user',
            id: payload.userId || payload.id
          });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser({ role: 'user', id: '' });
      }
    };
    
    getUserInfo();
  }, []);

  //to generate the signed url for accessing the aws S3 files
  const generateFileUrl = async (
    applicationId: string,
    fileId: string,
    fileType: 'certificate' | 'file'
  ) => {
    try {
      setLoadingUrls(prev => ({ ...prev, [fileId]: true }));
      setUrlErrors(prev => ({ ...prev, [fileId]: '' }));

      let url;
      if (fileType === 'certificate') {
        const res = await api.get(`/applications/files/urls`, {
          params: { applicationId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        url = res.data?.data?.url;
      } else {
        const res = await api.get(
          `/applications/files/${applicationId}/${fileId}/signed-url`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
        url = res.data?.data?.url;
      }

      if (!url) throw new Error('Signed URL not received');
      return url;
    } catch (err: any) {
      let errorMessage = 'Failed to generate file URL';

      if (err?.response?.status === 404) {
        errorMessage =
          fileType === 'certificate'
            ? 'Certificate not available yet'
            : 'File not found';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setUrlErrors(prev => ({ ...prev, [fileId]: errorMessage }));
      throw err;
    } finally {
      setLoadingUrls(prev => ({ ...prev, [fileId]: false }));
    }
  };

  // Handle payment receipt click using existing file logic
  const handlePaymentReceiptClick = async () => {
    if (!formDetails?.uploadedFiles || formDetails.uploadedFiles.length === 0) {
      setError('No files available');
      return;
    }

    try {
      // Payment receipt is always the first file (index 0) in uploadedFiles
      const receiptFile = formDetails.uploadedFiles[0];

      // Use existing file URL generation logic
      const url = await generateFileUrl(
        formDetails.applicationId,
        receiptFile._id,
        "file"
      );
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error opening payment receipt:", err);
      setError('Failed to open payment receipt');
    }
  };
  

  const handleFileClick = async (
    applicationId: string,
    fileId: string,
    fileType: 'certificate' | 'file'
  ) => {
    try {
      const url = await generateFileUrl(applicationId, fileId, fileType);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error opening file:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!applicationId) {
        setError('No application ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data for applicationId:', applicationId);

        const response = await api.get(`/applications/${applicationId}`);
        // Support both old and new response shapes
        const data = response.data?.data;
        const application = data?.application || data; 
        const formData = data?.formData || null;

        console.log('Application data:', application);
        console.log('Form data:', formData);

        setFormDetails(application);
        setFormData(formData);

      } catch (err: any) {
        console.error('Error fetching application details:', err);
        setError(err.response?.data?.message || 'Failed to fetch application details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  // Admin functions
  const updateStatus = async (status: 'approved' | 'rejected') => {
    if (!applicationId || user?.role !== 'admin') {
      setError('Unauthorized action');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Updating status for applicationId:', applicationId, 'to:', status);
      
      const response = await api.post(
        `/applications/admin/review/${applicationId}`,
        {
          status,
          adminRemarks: remarks,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
        }
      );

      console.log('Status update response:', response.data);

      setShowAnimation(status);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowAnimation(null);
      navigate('/admin/approvals');
    } catch (error: any) {
      console.error('Error updating status for applicationId:', applicationId, error);
      setError(error.response?.data?.message || 'Failed to update application status');
    } finally {
      setLoading(false);
    }
  };


  const handleApprove = () => {
    if (!remarks.trim()) {
      setError('Please provide remarks for the approval');
      return;
    }
    updateStatus('approved');
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      setError('Please provide remarks for the rejection');
      return;
    }
    updateStatus('rejected');
  };


  //handle Download after payment: redirect to signed URL immediately
  const handleSecureCertificateDownload = async () => {
  if (!formDetails?.generatedCertificate) {
    setError("Certificate not available yet");
    return;
  }

  // Payment is not required anymore

  try {
    setLoading(true);
    setError(null);

    // Ask backend for a signed URL
    const res = await api.get(`/applications/files/urls`, {
      params: { applicationId: formDetails.applicationId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log(res.data);

    const signedUrl = res.data?.data?.url;
    if (!signedUrl) {
      throw new Error("No signed URL received");
    }

    // Redirect to signed URL (lets the browser handle viewing/downloading)
    window.location.href = signedUrl;
  } catch (err: any) {
    console.error("Certificate download failed:", err);
    setError(err.message || "Download failed");
  } finally {
    setLoading(false);
  }
};


  // Payment flow removed

  // Navigation functions
  // Removed unused navigate-to-certificate route; using direct signed URL instead

  // Removed unused handleProtectedDownload

  const handleBackNavigation = () => {
    if (user?.role === 'admin') {
      navigate('/admin/approvals');
    } else {
      navigate('/user/certificates');
    }
  };

  // Utility functions
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Id$/, ' ID')
      .replace(/Adhar/, 'Aadhaar');
  };

  const formatFieldValue = (value: any, fieldName: string): string => {
    if (value === null || value === undefined) return 'N/A';
    
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    if (fieldName.toLowerCase().includes('date') && typeof value === 'string') {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    if (typeof value === 'number') {
      if (fieldName.toLowerCase().includes('amount')) {
        return `₹${value}`;
      }
      return value.toString();
    }
    
    return value.toString();
  };

  const renderFormDataFields = (data: FormData) => {
    if (!data) return null;

    const excludeFields = ['_id', '__v', 'createdAt', 'updatedAt', 'applicationId'];
    const fields = Object.entries(data).filter(([key]) => !excludeFields.includes(key));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <label className="text-sm text-gray-600 block mb-1">{formatFieldName(key)}</label>
            <p className="font-semibold text-gray-800">{formatFieldValue(value, key)}</p>
          </motion.div>
        ))}
      </div>
    );
  };

// Update the renderUserActions function to handle the 'certificate_generated' status

const renderUserActions = () => {
  if (!formDetails) return `Formdetails are not available ${formDetails}`;


  const { status, generatedCertificate } = formDetails;

  if (status === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-8 text-center"
      >
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Application Under Review</h3>
          <p className="text-yellow-700">
            Your application is currently being reviewed by our admin team. 
            You will be notified once the review is complete.
          </p>
        </div>
      </motion.div>
    );
  }

  if (status === 'rejected') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-8 text-center"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Application Rejected</h3>
          <p className="text-red-700 mb-4">
            Unfortunately, your application has been rejected.
          </p>
          {formDetails.adminRemarks && (
            <div className="text-left">
              <label className="text-sm text-gray-600 block mb-2">Admin Remarks:</label>
              <p className="bg-white p-3 rounded border text-gray-800">
                {formDetails.adminRemarks}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (status === 'certificate_generated' && generatedCertificate) {
    return (
      <><Helmet>
        <title>अर्ज तपशील - ग्रामपंचायत वाठोडे</title>
        <meta name="description" content="ग्रामपंचायत वाठोडे येथील प्रमाणपत्र अर्जांचे तपशील पहा आणि व्यवस्थापित करा. प्रशासकीय मंजूरी आणि प्रमाणपत्र निर्मिती." />
      </Helmet><motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 space-y-6"
      >
          {/* Certificate Generated - Download Available */}
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)",
              y: -2
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSecureCertificateDownload}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold text-lg shadow-lg"
          >
            <FaDownload className="text-xl" />
            Download Certificate
          </motion.button>
        </motion.div></>
    );
  }

  // Removed separate branch for payment completion

  if (status === 'approved') {
    // ... (keep your existing approved status logic)
  }

  return null;
};

  // Render admin actions
  const renderAdminActions = () => {
    if (!formDetails || user?.role !== 'admin') return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-8">
          <label className="text-sm text-gray-600 block mb-2">Admin Remarks</label>
          <motion.textarea
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            rows={4}
            placeholder="Enter remarks for approval/rejection"
          />
        </div>

        {formDetails.status === 'pending' && (
          <div className="mt-8 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-all duration-300 font-semibold"
            >
              <FaCheck /> {loading ? 'Processing...' : 'Approve'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReject}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition-all duration-300 font-semibold"
            >
              <FaTimes /> {loading ? 'Processing...' : 'Reject'}
            </motion.button>
          </div>
        )}

        {formDetails.status !== 'pending' && (
          <div className="mt-8 text-center text-gray-600">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-lg font-semibold mb-2">
                This application has already been {formDetails.status}.
              </p>
              {formDetails.adminRemarks && (
                <div className="mt-4 text-left">
                  <label className="text-sm text-gray-600 block mb-2">Previous Admin Remarks:</label>
                  <p className="bg-white p-3 rounded border text-gray-800">
                    {formDetails.adminRemarks}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    );
  };

  // Loading state
  if (loading && !formDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !formDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-600 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Retry
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // No data state
  if (!formDetails) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-600">No application data available</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center"
        >
          <motion.video
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={
              showAnimation === 'approved'
                ? '../../public/images/Animation - 1749657387951.webm'
                : '../../public/images/Animation - 1749657542955.webm'
            }
            autoPlay
            playsInline
            muted
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg shadow-md border-4 border-white"
            style={{ background: "#fff" }}
          />
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackNavigation}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-300"
        >
          <FaArrowLeft /> 
          {user?.role === 'admin' ? 'Back to Approvals' : 'Back to Applications'}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-800"
            >
              {user?.role === 'admin' ? 'Application Details' : 'My Application'}
              <span className="text-sm font-normal text-gray-500 block">
                ID: {formDetails.applicationId}
              </span>
            </motion.h1>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                formDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                formDetails.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {formDetails.status.charAt(0).toUpperCase() + formDetails.status.slice(1)}
            </motion.span>
          </div>

          {/* Application Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">Application Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                  className="p-3 rounded-lg transition-all duration-200"
                >
                  <label className="text-sm text-gray-600">Payment Status</label>
                  <p className={`font-semibold capitalize ${
                    formDetails.paymentDetails.paymentStatus === 'pending' ? 'text-yellow-600' :
                    formDetails.paymentDetails.paymentStatus === 'completed' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {formDetails.paymentDetails.paymentStatus}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Payment Details Section */}
          {formDetails.paymentDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8 pt-6 border-t"
            >
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {formDetails.paymentDetails.amount && (
                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                      className="p-3 rounded-lg transition-all duration-200"
                    >
                      <label className="text-sm text-gray-600">Payment Amount</label>
                      <p className="font-semibold">₹{formDetails.paymentDetails.amount}</p>
                    </motion.div>
                  )}
                  {formDetails.paymentDetails.utrNumber && (
                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                      className="p-3 rounded-lg transition-all duration-200"
                    >
                      <label className="text-sm text-gray-600">UTR Number</label>
                      <p className="font-semibold">{formDetails.paymentDetails.utrNumber}</p>
                    </motion.div>
                  )}
                </div>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                    className="p-3 rounded-lg transition-all duration-200"
                  >
                    <label className="text-sm text-gray-600">Payment Status</label>
                    <p className={`font-semibold capitalize ${
                      formDetails.paymentDetails.paymentStatus === 'pending' ? 'text-yellow-600' :
                      formDetails.paymentDetails.paymentStatus === 'completed' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {formDetails.paymentDetails.paymentStatus}
                    </p>
                  </motion.div>
                  
                  {/* Payment Receipt Button */}
                  {formDetails.paymentDetails.receiptUrl && (
                    <motion.div
                      whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                      className="p-3 rounded-lg transition-all duration-200"
                    >
                      <label className="text-sm text-gray-600 block mb-2">Payment Receipt</label>
                      <motion.button
                        whileHover={{ 
                          scale: 1.05, 
                          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" 
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePaymentReceiptClick}
                        disabled={loadingUrls['payment-receipt']}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 font-semibold"
                      >
                        <FaReceipt className="text-sm" />
                        {loadingUrls['payment-receipt'] ? 'Loading...' : 'View Receipt'}
                      </motion.button>
                      {urlErrors['payment-receipt'] && (
                        <p className="text-red-500 text-sm mt-2">{urlErrors['payment-receipt']}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Data Section */}
          {formData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 pt-6 border-t"
            >
              <h3 className="text-lg font-semibold mb-4">Form Details</h3>
              {renderFormDataFields(formData)}
            </motion.div>
          )}

          {/* Uploaded Files Section */}
          {user?.role === 'admin' && formDetails?.uploadedFiles?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-8 pt-6 border-t"
            >
              <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {formDetails.uploadedFiles.map(file => (
                  <motion.div
                    key={file._id}
                    whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg transition-all duration-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{file.originalName}</p>
                      <p className="text-sm text-gray-600">
                        Size: {(file.fileSize / 1024).toFixed(1)} KB • 
                        Type: {file.fileType} • 
                        Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleFileClick(formDetails.applicationId, file._id, 'file')}
                      disabled={loadingUrls[file._id]}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300 font-semibold"
                    >
                      {loadingUrls[file._id] ? 'Loading...' : 'View File'}
                    </motion.button>
                    {urlErrors[file._id] && (
                      <p className="text-red-500 text-sm ml-2">{urlErrors[file._id]}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            </motion.div>
          )}

          {/* Render appropriate actions based on user role */}
          {renderUserActions()}
          {renderAdminActions()}
        </motion.div>
      </div>
    </div>
  );
};

export default FormDetails;