import React from 'react';
import { Helmet } from 'react-helmet';
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';

const Socials = () => {
  const links = [
    { name: 'Facebook', url: 'https://www.facebook.com/share/17nNEx1cfs/', icon: <FaFacebookF /> },
    { name: 'YouTube', url: 'https://youtube.com/@grampanchayatwathode?si=1z_iLehpvCl6JKgH', icon: <FaYoutube /> },
    // { name: 'Twitter', url: 'https://twitter.com', icon: <FaTwitter /> },
    // { name: 'Instagram', url: 'https://www.instagram.com', icon: <FaInstagram /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 font-tiro-marathi">
      <Helmet>
        <title>Social Media - ग्रामपंचायत वाठोडे</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Follow Us</h1>
        <p className="text-center text-gray-600 mb-8">Connect with ग्रामपंचायत वाठोडे on social media</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition">
              <div className="text-2xl text-blue-600">{l.icon}</div>
              <div>
                <div className="font-semibold">{l.name}</div>
                <div className="text-sm text-gray-500">Visit our official {l.name} page</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Socials;
