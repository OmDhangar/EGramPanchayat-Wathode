import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <Helmet>
        <title>पृष्ठ सापडले नाही - ग्रामपंचायत वाठोडे</title>
        <meta name="description" content="आपण शोधत असलेले पृष्ठ उपलब्ध नाही. ग्रामपंचायत वाठोडे, शिरपूर, धुळे, महाराष्ट्र." />
      </Helmet>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
        >
          <Home className="h-5 w-5 mr-2" /> Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;