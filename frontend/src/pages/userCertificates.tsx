import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaSpinner, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { User } from 'lucide-react';
import { useAuthContext } from '../Context/authContext';

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
}

const UserCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/v1/applications/user/${user?.id}`,
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
  }, []);

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

  if (error) return (
    <div className="min-h-screen bg-gray-50 p-8 text-center text-red-600">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Certificates</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cert.documentType.replace('_', ' ').toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {cert.applicationId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(cert.status)}`}>
                    {cert.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <FaClock className="inline-block mr-2" />
                    Submitted: {new Date(cert.createdAt).toLocaleDateString()}
                  </p>

                  {cert.generatedCertificate && (
                    <div className="mt-4">
                      <a
                        href={cert.generatedCertificate.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaDownload />
                        Download Certificate
                      </a>
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
      </div>
    </div>
  );
};

export default UserCertificates;