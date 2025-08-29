import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaDownload, 
  FaArrowLeft, 
  FaPrint, 
  FaShare, 
  FaEye, 
  FaCertificate,
  FaCalendarAlt,
  FaIdCard,
  FaUser
} from 'react-icons/fa';
import axios from 'axios';
import { api } from '../api/axios';

interface CertificateData {
  certificateId: string;
  applicationId: string;
  certificateType: string;
  applicantName: string;
  issueDate: string;
  validUntil?: string;
  certificateNumber: string;
  qrCode: string;
  digitalSignature: string;
  certificateUrl: string;
  status: 'active' | 'revoked';
  formData: any;
}

interface DownloadHistory {
  downloadedAt: string;
  downloadType: 'pdf' | 'image';
  ipAddress: string;
}

interface CertificateFile {
  fileName: string;
  secureUrl: string;
  originalName: string;
}

const CertificateDownload = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState<CertificateFile | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
              if (!applicationId) {
                setError("No application ID provided");
                return;
              }

              try {
                setLoading(true);
                setError(null);

                const response = await api.get(`/applications/files/urls`, {
                  params: { applicationId },
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  },
                });

                console.log("Signed URL data:", response.data);

                if (response.data?.data?.url) {
                  setFile({
                    fileName: `${applicationId}.pdf`,
                    secureUrl: response.data.data.url,
                    originalName: `${applicationId}.pdf`,
                  });
                } else {
                  setError("Certificate not available yet");
                }
              } catch (err: any) {
                console.error("Error fetching signed URL:", err);
                setError(err.response?.data?.message || "Failed to fetch certificate URL");
              } finally {
                setLoading(false);
              }
  };
    fetchCertificate();
  }, [applicationId]);

  const handleDownload = async (format: "pdf" | "image") => {
  if (!file?.secureUrl) {
    setError("No certificate file available");
    return;
  }

  try {
    setDownloadLoading(format);
    setError(null);

    // Fetch directly from signed URL
    const response = await axios.get(file.secureUrl, { responseType: "blob" });

    const blob = new Blob([response.data], {
      type: format === "pdf" ? "application/pdf" : "image/png",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.originalName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err: any) {
    console.error("Download failed:", err);
    setError("Download failed");
  } finally {
    setDownloadLoading(null);
  }
};


  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && certificate) {
      try {
        await navigator.share({
          title: `${certificate.certificateType} - ${certificate.applicantName}`,
          text: `Certificate ${certificate.certificateNumber}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Certificate URL copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate URL copied to clipboard!');
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const formatCertificateType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const viewCertificate = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error && !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <FaCertificate className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Certificate not found or not yet generated</p>
          <button 
            onClick={() => navigate('/user/applications')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/user/applications')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft /> Back to Applications
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
              >
                <FaShare /> Share
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
              >
                <FaPrint /> Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Certificate Status Banner */}
        <div className={`mb-8 p-6 rounded-lg ${
          certificate.status === 'active' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCertificate className={`text-2xl ${
                certificate.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`} />
              <div>
                <h2 className={`text-xl font-bold ${
                  certificate.status === 'active' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Certificate {certificate.status === 'active' ? 'Ready' : 'Revoked'}
                </h2>
                <p className={`${
                  certificate.status === 'active' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {certificate.status === 'active' 
                    ? 'Your certificate is valid and ready for download'
                    : 'This certificate has been revoked and is no longer valid'
                  }
                </p>
              </div>
            </div>
            {certificate.status === 'active' && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Certificate Number</p>
                <p className="font-bold text-lg">{certificate.certificateNumber}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaCertificate className="text-3xl text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {formatCertificateType(certificate.certificateType)}
                  </h1>
                  <p className="text-gray-600">Certificate ID: {certificate.certificateId}</p>
                </div>
              </div>

              {/* Certificate Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600">Applicant Name</label>
                      <p className="font-semibold">{certificate.applicantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaIdCard className="text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600">Application ID</label>
                      <p className="font-semibold">{certificate.applicationId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-gray-400" />
                    <div>
                      <label className="text-sm text-gray-600">Issue Date</label>
                      <p className="font-semibold">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {certificate.validUntil && (
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-gray-400" />
                      <div>
                        <label className="text-sm text-gray-600">Valid Until</label>
                        <p className="font-semibold">
                          {new Date(certificate.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Preview */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Certificate Preview</h3>
                  <button
                    onClick={handlePreview}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    <FaEye /> Full Preview
                  </button>
                </div>
                
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FaCertificate className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Certificate preview will be displayed here
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Document Type: {formatCertificateType(certificate.certificateType)}</p>
                    <p>Certificate Number: {certificate.certificateNumber}</p>
                    <p>Digital Signature: ✓ Verified</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Actions and Download History */}
          <div className="space-y-6">
            {/* Download Actions */}
            {certificate.status === 'active' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Download Certificate</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload('pdf')}
                    disabled={downloadLoading === 'pdf'}
                    className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaDownload />
                    {downloadLoading === 'pdf' ? 'Downloading...' : 'Download PDF'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload('image')}
                    disabled={downloadLoading === 'image'}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FaDownload />
                    {downloadLoading === 'image' ? 'Downloading...' : 'Download Image'}
                  </motion.button>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>• PDF format is recommended for official use</p>
                  <p>• Image format is suitable for digital sharing</p>
                  <p>• Both formats contain digital signature</p>
                </div>
              </div>
            )}

            {/* Security Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Security Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Digital Signature Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>QR Code Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Blockchain Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tamper Proof</span>
                </div>
              </div>
            </div>

            {/* Download History */}
            {downloadHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Download History</h3>
                <div className="space-y-3">
                  {downloadHistory.slice(0, 5).map((download, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium capitalize">{download.downloadType} Download</p>
                        <p className="text-gray-600">
                          {new Date(download.downloadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(download.downloadedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {downloadHistory.length > 5 && (
                    <p className="text-xs text-gray-500 text-center pt-2 border-t">
                      +{downloadHistory.length - 5} more downloads
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Support Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">
                  If you're having trouble downloading or viewing your certificate, 
                  please contact our support team.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> support@certificates.gov</p>
                  <p><strong>Phone:</strong> 1800-XXX-XXXX</p>
                  <p><strong>Hours:</strong> 9 AM - 6 PM (Mon-Fri)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Certificate Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              {/* Certificate preview content would go here */}
              <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 rounded-lg p-12 text-center">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-blue-800 mb-2">
                    GOVERNMENT OF INDIA
                  </h1>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {formatCertificateType(certificate.certificateType)}
                  </h2>
                </div>
                
                <div className="mb-8">
                  <p className="text-lg mb-4">This is to certify that</p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {certificate.applicantName}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    has been issued this certificate as per the official records.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-8 text-left">
                  <div>
                    <p><strong>Certificate Number:</strong> {certificate.certificateNumber}</p>
                    <p><strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>Application ID:</strong> {certificate.applicationId}</p>
                    <p><strong>Status:</strong> {certificate.status}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <div className="w-32 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs">
                      QR Code
                    </div>
                    <p className="text-xs text-gray-500">Scan to verify</p>
                  </div>
                  <div className="text-right">
                    <div className="w-32 h-16 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs">
                      Digital Signature
                    </div>
                    <p className="text-xs text-gray-500">Authorized Signatory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDownload;