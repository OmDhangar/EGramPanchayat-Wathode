import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthContextProvider } from './Context/authContext';
import { Toaster } from 'react-hot-toast';

// i18n setup
import '../src/i18n';
import Loader from './components/loader';

const Home = lazy(() => import('./pages/Home'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Gallery = lazy(() => import('./pages/Gallery'));
const SchemeDetails = lazy(() => import('./pages/SchemeDetails'));
const YearGallery = lazy(() => import('./pages/YearGallery'));
const Blogs = lazy(() => import('./pages/Blogs'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./components/dashboard'));
const FormDetails = lazy(() => import('./pages/FormDetails'));
const CertificateApprovals = lazy(() => import('./pages/CertificatesApprovals'));
const UploadCertificates = lazy(() => import('./pages/uploadCertificates'));
const Register = lazy(() => import('./pages/register'));
const Login = lazy(() => import('./pages/Login'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));
const UserCertificates = lazy(() => import('./pages/userCertificates'));
const UserNotifications = lazy(() => import('./pages/userNotification'));
const AboutVathode = lazy(() => import('./pages/AboutVathode'));
const BirthCertificate = lazy(() => import('./pages/BirthCertificate'));
const DeathCertificate = lazy(() => import('./pages/DeathCertificate'));
const UserDetails = lazy(() => import('./components/UserDetails'));
const Members = lazy(() => import('./pages/Members'));
const FormsPage = lazy(() => import('./pages/applyforcertificates'));
const PublicInfo = lazy(() => import('./pages/publicinfo'));
const Help = lazy(() => import('./pages/help'));
const MarriageCertificateForm = lazy(() => import('./pages/MarriageCertificateForm'));
const CertificateDownload = lazy(() => import('./pages/certificateDownload'));
const BlogDetails = lazy(() => import('./components/blogDetails'));

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
          <div className="flex items-center">
            <button onClick={() => changeLanguage('en')} className="mr-2 text-sm font-medium text-blue-600" aria-label="Switch to English">English</button>
            <button onClick={() => changeLanguage('mr')} className="text-sm font-medium text-green-600" aria-label="मराठीमध्ये बदला">मराठी</button>
          </div>
        </div>
        <Toaster position="top-right" />
        <Navbar />
        {/* Spacer to prevent content being hidden behind the fixed/auto-hiding navbar */}
        <div className="h-[112px] sm:h-[136px]" />
        <main className="flex-grow">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/schemes/:year" element={<SchemeDetails />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:year" element={<YearGallery />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/blogs" element={<Blogs />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/user/:userId" element={<UserDetails />} />
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
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/contact" element={<Help/>} />
              <Route path="/apply-for-certificates" element={<FormsPage/>} />
              <Route path="/apply-for-certificates/birth-certificate" element={<BirthCertificate />} />
              <Route path="/apply-for-certificates/death-certificate" element={<DeathCertificate />} />
              <Route path="/apply-for-certificates/marriage-certificate" element={<MarriageCertificateForm />} />
            </Routes>
          </Suspense>
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
