import React from 'react';
import { Helmet } from 'react-helmet';
import { FaFilePdf } from 'react-icons/fa';

const documents: { id: number; title: string; url: string }[] = [
  { id: 1, title: 'कोणत्याही-योजनेचा-लाभ-न-घेतल्याचे-स्वयंचोषणपत्र', url: '/pdf/कोणत्याही-योजनेचा-लाभ-न-घेतल्याचे-स्वयंघोषणापत्र.pdf' },
  { id: 2, title: 'परित्यक्त्या-असल्याबाबत-स्वयंचोषणपत्र', url: '/pdf/परितक्या-असल्याबाबत-स्वयंघोषणापत्र.pdf' },
  { id: 3, title: 'रहिवाशी_दाखला_स्व.घोषणापत्र', url: '/pdf/रहिवाशी_दाखला_स्व_घोषणापत्र.pdf' },
  { id: 4, title: 'विधवा-असल्याबाबत-स्वयंचोषणपत्र', url: '/pdf/विधवा-असल्याबाबत-स्वयंघोषणापत्र-1.pdf' },
  { id: 5, title: 'विभक्त-कुटुंब-असल्यास-स्वयंचोषणपत्र', url: '/pdf/विभक्त-कुटुंब-असल्यास-स्वयंघोषणापत्र.pdf' },
  { id: 6, title: 'वीज-जोडणी-स्वयंचोषणपत्र', url: '/pdf/वीज-जोडणी-स्वयंघोषणापत्र.pdf' },
  { id: 7, title: 'शौचालय-असल्याबाबत-स्वयंचोषणपत्र', url: '/pdf/शौचालय-असल्याबाबत-स्वयंघोषणापत्र.pdf' },
  { id: 8, title: 'हयात-असल्याबाबत-स्वयंचोषणपत्र', url: '/pdf/हयात-असल्याबाबत-स्वयंघोषणापत्र.pdf' },
];

const SelfDeclareLetters: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-tiro-marathi">
      <Helmet>
        <title>स्वयंघोषणापत्रे | Gram Panchayat</title>
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-800">स्वयंघोषणापत्रे</h1>
          <p className="text-gray-600 text-sm">PDF फाईलवर क्लिक करून उघडा </p>
        </div>
      </header>

      {/* Document Links */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <ul className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center py-3 hover:bg-gray-100 rounded transition">
              <FaFilePdf className="text-red-600 text-xl mr-3" />
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-800 hover:underline text-lg font-medium"
              >
                {doc.title}
              </a>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-10">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-300">
          © {new Date().getFullYear()} ग्रामपंचायत विभाग | Gram Panchayat Department
        </div>
      </footer>
    </div>
  );
};

export default SelfDeclareLetters;
