import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Schemes from './pages/Schemes';
import Gallery from './pages/Gallery';
import SchemeDetails from './pages/SchemeDetails';
import YearGallery from './pages/YearGallery';
import NotFound from './pages/NotFound';
import Dashboard from './components/dashboard';
import Loader from './components/loader';
import FormDetails from './pages/FormDetails';
import CertificateApprovals from './pages/CertificatesApprovals';
import UploadCertificates from './pages/uploadCertificates';
import { AuthContextProvider } from './Context/authContext';
import Register from './pages/register';
import Login from './pages/Login';
import ManageUsers from './pages/ManageUsers';
import UserCertificates from './pages/userCertificates';
import UserNotifications from './pages/userNotification';
import AboutVathode from './pages/AboutVathode';
import BirthCertificate from './pages/BirthCertificate';
import DeathCertificate from './pages/DeathCertificate';
import MarriageCertificate from './pages/MarriageCertificateForm';

import Members from './pages/Members';
import FormsPage from './pages/applyforcertificates';
import PublicInfo from './pages/publicinfo';
import Help from './pages/help';
import { Toaster } from 'react-hot-toast';

// i18n setup
import '../src/i18n';
import MarriageCertificateForm from './pages/MarriageCertificateForm';
import CertificateDownload from './pages/certificateDownload';

function AppContent() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Only show Login page without layout
  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <AuthContextProvider>
      <div className="flex flex-col min-h-screen">
        {/* Language Switcher */}
        <div className="text-right px-4 py-2 bg-gray-100 shadow-sm">
          <button onClick={() => changeLanguage('en')} className="mr-2 text-sm font-medium text-blue-600">English</button>
          <button onClick={() => changeLanguage('mr')} className="text-sm font-medium text-green-600">मराठी</button>
        </div>
        <Toaster position="top-right" />
        <Navbar />
        {/* Spacer to prevent content being hidden behind the fixed/auto-hiding navbar */}
        <div className="h-[112px] sm:h-[136px]" />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/:year" element={<SchemeDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:year" element={<YearGallery />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/form-details/:applicationId" element={<FormDetails />} />
            <Route path="/admin/approvals" element={<CertificateApprovals />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/upload" element={<UploadCertificates />} />
            <Route path="/about-vathode" element={<AboutVathode />} />
            <Route path="/user/certificates" element={<UserCertificates />} />
            <Route path="/user/notifications" element={<UserNotifications />} />
            <Route path="/certificate/:applicationId" element={<CertificateDownload/>}/>
            <Route path="/home" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/notices" element={<PublicInfo />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/contact" element={<Help/>} />
            <Route path="/apply-for-certificates" element={<FormsPage/>} />
            <Route path="/apply-for-certificates/birth-certificate" element={<BirthCertificate />} />
            <Route path="/apply-for-certificates/death-certificate" element={<DeathCertificate />} />
            <Route path="/apply-for-certificates/marriage-certificate" element={<MarriageCertificateForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContextProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
