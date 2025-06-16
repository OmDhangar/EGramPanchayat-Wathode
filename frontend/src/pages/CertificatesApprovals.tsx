import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa';

interface FormSubmission {
  _id: string;
  applicationId: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected' | 'certificate_generated';
  uploadedFiles: Array<{
    fileName: string;
    originalName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    _id: string;
    uploadedAt: string;
  }>;
  generatedCertificate?: {
    fileName: string;
    filePath: string;
    generatedAt: string;
  };
  paymentDetails: {
    paymentStatus: string;
  };
  createdAt: string;
  updatedAt: string;
  adminRemarks?: string;
}

const TABS = ['all', 'pending','approved', 'certificate_generated','rejected', 'completed'];

const CertificateApprovals = () => {
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const filterFormByStatus = (forms:FormSubmission[]):FormSubmission[]=>{
    if(activeTab === 'all') return forms;
    return forms.filter(form => form.status === activeTab);
  }

  const fetchForms = async (status: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/v1/applications/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
          },
        } 
      );
      const filteredForms = filterFormByStatus(res.data.data ||[])
      console.log(res);
      setForms(filteredForms);
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchForms(activeTab);
  }, [activeTab]);

  const viewFormDetails = (formId: string) => {
    navigate(`/admin/form-details/${formId}`);
  };

 return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Certificate Approvals</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading applications...</p>
        ) : forms.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No applications found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <motion.div
              onClick={(e)=>{
                 e.stopPropagation();
                viewFormDetails(form.applicationId);
              }}
                key={form._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {form.documentType.replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {form.applicationId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-center justify-center text-sm ${
                      form.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      form.status === 'approved' ? 'bg-green-100 text-green-800' :
                      form.status === 'certificate_generated' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {form.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Payment Status:</span>
                      <span className={`font-medium ${
                        form.paymentDetails.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {form.paymentDetails.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <p className="mb-2 font-medium">Uploaded Files:</p>
                      <ul className="space-y-2">
                        {form.uploadedFiles.map((file) => (
                          <li key={file._id} className="flex items-center gap-2">
                            {file.fileType.includes('image') ? (
                              <FaFileImage className="text-blue-500" />
                            ) : file.fileType.includes('pdf') ? (
                              <FaFilePdf className="text-red-500" />
                            ) : (
                              <FaFileAlt className="text-gray-500" />
                            )}
                            <a
                              href={file.filePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline truncate flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {file.originalName}
                            </a>
                            <span className="text-xs text-gray-500">
                              ({(file.fileSize / 1024).toFixed(1)} KB)
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {form.generatedCertificate && (
                      <div className="border-t pt-3">
                        <p className="mb-2 font-medium">Generated Certificate:</p>
                        <div className="flex items-center gap-2">
                          <FaFilePdf className="text-red-500" />
                          <a
                            href={form.generatedCertificate.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Certificate
                          </a>
                          <span className="text-xs text-gray-500">
                            ({new Date(form.generatedCertificate.generatedAt).toLocaleDateString()})
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-gray-500 pt-2">
                      <span>Submitted: {new Date(form.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {form.adminRemarks && (
                      <div className="border-t pt-2 mt-2">
                        <p className="font-medium mb-1">Remarks:</p>
                        <p className="text-gray-600 italic">{form.adminRemarks}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 text-right border-t">
                    <button
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewFormDetails(form._id);
                      }}
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateApprovals;
