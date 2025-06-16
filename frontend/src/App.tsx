import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Members from './pages/Members'; // Import the AboutKhasala component
// import Certificates from './pages/Certificates';
import FormsPage from './pages/applyforcertificates';
import PublicInfo from './pages/publicinfo';
import Help from './pages/help';
import { Toaster } from 'react-hot-toast';




function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate loading for route change
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/:year" element={<SchemeDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:year" element={<YearGallery />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/admin/users' element={<ManageUsers/>}/>
            <Route path="/admin/form-details/:applicationId" element={<FormDetails />} />
            <Route path="/admin/approvals" element={<CertificateApprovals/>}></Route>
            <Route  path="/admin" element={<Dashboard />} />
            <Route path='/admin/upload'element={<UploadCertificates/>}></Route>
            <Route path="/about-vathode" element={<AboutVathode/>} /> {/* Add the new route here */}
            <Route path="*" element={<NotFound />} />

            <Route path="/user/certificates" element={<UserCertificates />} />
            <Route path="/user/notifications" element={<UserNotifications />} />
            <Route path="home" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/notices" element={<PublicInfo />} />
            <Route path="/contact" element={<Help/>} />
            <Route path="/apply-for-certificates" element={<FormsPage/>} />

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
