import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa';
import { api } from '../api/axios';

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
  const [fileUrls, setFileUrls] = useState<{ [key: string]: string }>({});
  const [loadingUrls, setLoadingUrls] = useState<{ [key: string]: boolean }>({});
  const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const filterFormByStatus = (forms:FormSubmission[]):FormSubmission[]=>{
    if(activeTab === 'all') return forms;
    return forms.filter(form => form.status === activeTab);
  }

  const fetchForms = async () => {
    try {
      console.log(localStorage.getItem('accessToken'));
      console.log(localStorage.getItem('refreshToken'))
      setLoading(true);
      const res = await api.get(
        `/applications/admin`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, 
          },
        } 
      );
             const filteredForms = filterFormByStatus(res.data.data ||[])
       console.log('Applications data:', res.data.data);
       console.log('Filtered forms:', filteredForms);
       setForms(filteredForms);
    } catch (err) {
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchForms();
  }, [activeTab]);

  const viewFormDetails = (formId: string) => {
    navigate(`/form-details/${formId}`);
  };

  // Generate signed URL for a specific file on-demand
  // This optimizes AWS S3 costs by only generating URLs when user clicks on files
  const generateFileUrl = async (applicationId: string, fileId: string, fileType: 'certificate' | 'file') => {
    try {
      setLoadingUrls(prev => ({ ...prev, [fileId]: true }));
      setUrlErrors(prev => ({ ...prev, [fileId]: '' }));

      let url;
      if (fileType === 'certificate') {
        // For certificates, use the working route from FormDetails
        const res = await api.get(`/applications/files/urls`, {
          params: { applicationId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        url = res.data?.data?.url;
      } else {
        // For uploaded files, use the secure-url route
        const res = await api.get(`/applications/files/${applicationId}/${fileId}/signed-url`);
        url = res.data?.data?.url;
      }

      if (!url) throw new Error('Signed URL not received');
      
      setFileUrls(prev => ({ ...prev, [fileId]: url }));
      return url;
    } catch (err: any) {
      let errorMessage = 'Failed to generate file URL';
      
      if (err?.response?.status === 404) {
        if (fileType === 'certificate') {
          errorMessage = 'Certificate not available yet';
        } else {
          errorMessage = 'File not found';
        }
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

  // Handle file click to generate URL and open file
  const handleFileClick = async (applicationId: string, fileId: string, fileType: 'certificate' | 'file') => {
    try {
      const url = await generateFileUrl(applicationId, fileId, fileType);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error opening file:', err);
    }
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
                key={form._id}
                onClick={(e) => {
                  e.stopPropagation();
                  viewFormDetails(form.applicationId);
                }}
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
                       {form.uploadedFiles.filter(file => file.filePath).length > 0 ? (
                         <ul className="space-y-2">
                           {form.uploadedFiles.filter(file => file.filePath).map((file) => (
                             <li key={file._id} className="flex items-center gap-2">
                               {file.fileType.includes('image') ? (
                                 <FaFileImage className="text-blue-500" />
                               ) : file.fileType.includes('pdf') ? (
                                 <FaFilePdf className="text-red-500" />
                               ) : (
                                 <FaFileAlt className="text-gray-500" />
                               )}
                               <div className="flex items-center gap-2">
                                 {loadingUrls[file._id] ? (
                                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                                 ) : fileUrls[file._id] ? (
                                   <a
                                     href={fileUrls[file._id]}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="text-blue-600 hover:text-blue-800 hover:underline truncate flex-1"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     {file.originalName}
                                   </a>
                                 ) : (
                                   <button
                                     className="text-blue-600 hover:text-blue-800 hover:underline truncate flex-1 text-left disabled:opacity-50"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       handleFileClick(form.applicationId, file._id, 'file');
                                     }}
                                     disabled={loadingUrls[file._id]}
                                   >
                                     {file.originalName}
                                   </button>
                                 )}
                               </div>
                               {urlErrors[file._id] && (
                                 <span className="text-red-500 text-xs">{urlErrors[file._id]}</span>
                               )}
                               <span className="text-xs text-gray-500">
                                 ({(file.fileSize / 1024).toFixed(1)} KB)
                               </span>
                             </li>
                           ))}
                         </ul>
                       ) : (
                         <p className="text-gray-500 text-sm italic">No files available</p>
                       )}
                     </div>

                                         {form.generatedCertificate && (form.generatedCertificate.filePath || form.generatedCertificate.fileName) && (
                       <div className="border-t pt-3">
                         <p className="mb-2 font-medium">Generated Certificate:</p>
                         <div className="flex items-center gap-2">
                           <FaFilePdf className="text-red-500" />
                           {loadingUrls[`cert-${form._id}`] ? (
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                           ) : fileUrls[`cert-${form._id}`] ? (
                             <a
                               href={fileUrls[`cert-${form._id}`]}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-blue-600 hover:text-blue-800 hover:underline flex-1"
                               onClick={(e) => e.stopPropagation()}
                             >
                               View Certificate
                             </a>
                           ) : (
                             <button
                               className="text-blue-600 hover:text-blue-800 hover:underline flex-1 disabled:opacity-50"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 console.log('Certificate data:', form.generatedCertificate);
                                 handleFileClick(form.applicationId, `cert-${form._id}`, 'certificate');
                               }}
                               disabled={loadingUrls[`cert-${form._id}`]}
                             >
                               View Certificate
                             </button>
                           )}
                           {urlErrors[`cert-${form._id}`] && (
                             <span className="text-red-500 text-xs">{urlErrors[`cert-${form._id}`]}</span>
                           )}
                           <span className="text-xs text-gray-500">
                             ({form.generatedCertificate.generatedAt ? new Date(form.generatedCertificate.generatedAt).toLocaleDateString() : 'Date not available'})
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
                        viewFormDetails(form.applicationId);
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
