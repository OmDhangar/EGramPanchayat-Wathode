import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { Variants } from 'framer-motion';
import NoticeBoard from '../components/NoticeBoard';
import { Helmet } from 'react-helmet';

const images = [
  "/images/vathode1.jpg",
  "/images/vathode2.jpg",
  "/images/vathode3.jpg",
  "/images/vathode4.jpg",
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};

export default function Home() {
  
  const imageGrid = [
    { src: "/images/developed village 2.webp", alt: "Village 1" },
    { src: "/images/developed village.jpg", alt: "Village 2" },
    { src: "/images/gpvasardi.jpg", alt: "Village 3" },
    { src: "/images/phu.jpeg", alt: "Village 4" },
    { src: "/images/place.jpeg", alt: "Village 5" },
    { src: "/images/samajmandir.jpeg", alt: "Village 6" },
    { src: "/images/school.jpeg", alt: "Village 7" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const delay = 3000; // Change image every 3 seconds

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === imageGrid.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Marquee pause/resume
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleMarqueeMouseEnter = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMarqueeMouseLeave = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'running';
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      id="main-content"
      className="min-h-screen font-tiro-marathi-sans text-xs xs:text-sm sm:text-base relative overflow-x-hidden"
    >
      <Helmet>
        <title>ग्रामपंचायत वाठोडे - आपले गाव, आपला विकास</title>
        <meta name="description" content="ग्रामपंचायत वाठोडे, शिरपूर, धुळे, महाराष्ट्र. गावातील विकासकामे, योजना, प्रमाणपत्रे आणि ताज्या बातम्यांसाठी अधिकृत वेबसाइट." />
      </Helmet>
      {/* Background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      
      {/* Full Screen Slideshow Overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <button 
            onClick={toggleFullScreen}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Slideshow Container - Responsive height */}
          <div className="
            relative w-full 
            h-[50vh] xs:h-[60vh] sm:h-[50vh] 
            max-h-[50vh] 
            overflow-hidden rounded-lg shadow-lg
          ">
            <div
              className="flex transition-transform duration-[2000ms] ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {imageGrid.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full max-h-[50vh]  object-cover flex-shrink-0"
                  loading="lazy" // Lazy load images in the full-screen slideshow
                  // TODO: For further optimization, generate different sizes for these images (e.g., using a build tool or image optimization service)
                  // and update srcset and sizes attributes.
                  // Example srcset (replace with actual generated paths and sizes):
                  // srcset={`${img.src.replace(/\.(webp|jpg|jpeg|png)$/, '-small.$1')} 640w,
                  //          ${img.src.replace(/\.(webp|jpg|jpeg|png)$/, '-medium.$1')} 768w,
                  //          ${img.src.replace(/\.(webp|jpg|jpeg|png)$/, '-large.$1')} 1024w,
                  //          ${img.src} 1280w`}
                  // sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px"
                  // TODO: Consider converting all images to AVIF format for better compression and quality.
                />
              ))}
            </div>
          </div>


          
          <div className="absolute bottom-10 flex justify-center space-x-2">
            {imageGrid.map((_, idx) => (
              <button
                key={idx}
                className={`w-4 h-4 rounded-full mx-1 border-2 border-white transition-all duration-300 ${
                  idx === currentIndex ? "bg-white scale-110 shadow" : "bg-white/60"
                }`}
                onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header Banner with Slideshow */}
      <section className="bg-gradient-to-r from-blue-700 via-green-500 to-green-300 text-white pb-6 sm:pb-10 px-2 pt-4 sm:pt-7 sm:pb-16 sm:px-6 relative overflow-hidden shadow-lg">
        <div className="max-w-8xl max-h-6xl mx-auto relative">
          {/* Slideshow Container - Now with full-screen button */}
          <div className="relative mt-[4vh] w-full h-[40vh] xs:h-[50vh] sm:h-[60vh] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl mb-2 sm:mb-6">
            <div
              className="flex transition-transform duration-[2000ms] ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}

            >
              {imageGrid.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className={`w-full flex-shrink-0 object-cover h-full transition-transform duration-[2000ms] ease-in-out ${
                    index === currentIndex ? "scale-105 opacity-100" : "scale-100 opacity-60"
                  }`}
                  style={{
                    transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 1.2s",
                  }}
                  loading={index === 0 ? "eager" : "lazy"} // Eager load the first image, lazy load the rest
                  fetchPriority={index === 0 ? "high" : undefined} // High priority for the first image
                  // TODO: For further optimization, generate different sizes for these images (e.g., using a build tool or image optimization service)
                  // and update srcset and sizes attributes.
                  // Example srcset (replace with actual generated paths and sizes):
                  // srcset={`${img.src.replace(/\.(webp|jpg|jpeg|png)$/, '-small.$1')} 640w,
                  //          ${img.src.replace(/\.(webp|jpg|jpeg|png)$/, '-medium.$1')} 768w,
                  //          ${img.src.replace(/\.(webp|jpg|jpeg|png)$/, '-large.$1')} 1024w,
                  //          ${img.src} 1280w`}
                  // sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px"
                  // TODO: Consider converting all images to AVIF format for better compression and quality.
                />
              ))}
            </div>
            
            {/* Full Screen Button */}
            {/* <button 
              onClick={toggleFullScreen}
              className="absolute bottom-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
              aria-label="View full screen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button> */}
            
            {/* Swacch Sundar Harit Vathode Title (left, overlay, visible on all screens) */}
            <div className="absolute left-2 top-2 sm:left-6 sm:top-6 bg-black/40 rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow">
              <p className="text-sm xs:text-base sm:text-2xl font-tiro-marathi leading-tight text-green-200">स्वच्छ सुंदर</p>
              <p className="text-base xs:text-lg sm:text-3xl font-tiro-marathi text-green-400">हरित वाठोडे</p>
            </div>
          </div>

          {/* Village Title & Dots */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-0">
            <div className="text-center sm:text-right w-full">
              <p className="text-base xs:text-lg sm:text-3xl font-tiro-marathi leading-tight drop-shadow">विकसित</p>
              <p className="text-lg xs:text-xl sm:text-4xl font-tiro-marathi text-yellow-700 drop-shadow">वाठोडे</p>
            </div>
            {/* Dots for slideshow */}
            <div className="flex justify-center sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto">
              {imageGrid.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full mx-1 border-2 border-yellow-200 transition-all duration-300 ${
                    idx === currentIndex ? "bg-white-300 scale-110 shadow" : "bg-white/60"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}

                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="relative w-full bg-black overflow-hidden h-8 xs:h-10 sm:h-12 flex items-center">
        <div className="absolute left-0 top-0 h-full flex items-center px-3 bg-yellow-400 text-black font-tiro-marathi text-[0.6rem] xs:text-xs sm:text-sm rounded-br-md z-10">
          सूचना
        </div>
        <div className="w-full h-full flex items-center pl-24">
          <a
            href="https://maharashtra.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full"
            onMouseEnter={handleMarqueeMouseEnter}
            onMouseLeave={handleMarqueeMouseLeave}
          >
            <div
              ref={marqueeRef}
              className="whitespace-nowrap animate-marquee text-white text-sm xs:text-base sm:text-lg font-tiro-marathi flex items-center gap-7 sm:gap-16 cursor-pointer"
              style={{ animationPlayState: 'running' }}
            >
              <span className="relative">
                पारदर्शक प्रशासन आणि समाजाच्या सहभागामाधून एक सक्षम, आत्मनिर्भर गाव निर्माण करूया. पारदर्शक प्रशासन आणि समाजाच्या सहभागामाधून एक सक्षम, आत्मनिर्भर गाव निर्माण करूया.
                <span className="absolute -top-2 right-0 flex items-center">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-700 border-2 border-white"></span>
                    <span className="absolute inset-0 flex items-center justify-center text-[0.55rem] font-tiro-marathi-bold text-white">New</span>
                  </span>
                </span>
              </span>
              <span>अधिक माहितीसाठी ग्रामपंचायत कार्यालयला संपर्क करा</span>
            </div>
          </a>
        </div>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 15s linear infinite;
              display: inline-flex;
              min-width: 100%;
            }
          `}
        </style>
      </div>

      {/* Panchayat Info Section */}
      <section className="w-full py-16 px-4 sm:px-8 bg-gradient-to-br from-blue-50 to-cyan-50" id="vathode-info">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-tiro-marathi font-bold text-blue-900 mb-4">  ❖ वाठोडे ग्रामपंचायत  ❖</h2>
          <div className="w-24 h-2 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-xl text-blue-800 mt-6 font-tiro-marathi max-w-3xl mx-auto">च्या डिजिटल पोर्टल वर आपले स्वागत आहे</p>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Left Side: Maps and Statistics */}
          <div className="w-full lg:w-2/5 flex flex-col gap-12">
            {/* Satellite Map */}
            <div className="map-container group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl p-5 shadow-xl">
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src="/images/wathodesatelliteimg.jpg" 
                    alt="वाठोडे सॅटेलाईट नकाशा" 
                    className="map-image w-full h-64 object-cover rounded-xl transform transition-transform duration-700"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-tiro-marathi font-bold text-blue-900">वाठोडे नकाशा सॅटेलाईट दृश्य</h3>
                  
                </div>
              </div>
            </div>


            {/* Google Maps Link */}
            <div className="text-center">
              <a 
                href="https://goo.gl/maps/your-google-map-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center font-tiro-marathi justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                वाठोडेच्या गुगल मॅप वर जाण्यासाठी येथे क्लिक करा
              </a>
            </div>

            {/* Village Map */}
            <div className="map-container group relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl p-5 shadow-xl">
                <div className="overflow-hidden rounded-xl">
                  <img 
                    src="/images/wathodesatelliteimg2.jpg.png" 
                    alt="वाठोडे गावाचा नकाशा" 
                    className="map-image w-full h-64 object-cover rounded-xl transform transition-transform duration-700"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-tiro-marathi font-bold text-blue-900">ग्रामरचना नकाशा</h3>
                  <p className="text-blue-700 font-tiro-marathi mt-2">वाठोडे गावाची अंतर्गत रचना</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Village Information */}
          <div className="w-full lg:w-3/5 relative">
             {/* Statistics Cards */}
            <div className="grid grid-cols-2 mb-5 gap-4">
              <div className="stat-card bg-white rounded-xl p-5 shadow-lg border border-blue-100 text-center">
                <div className="text-3xl font-tiro-marathi font-bold text-blue-800 mb-2">२,०७२</div>
                <div className="text-blue-600">एकूण लोकसंख्या</div>
              </div>
              <div className="stat-card bg-white rounded-xl p-5 shadow-lg border border-blue-100 text-center">
                <div className="text-3xl font-tiro-marathi font-bold   text-blue-800 mb-2">७०.४%</div>
                <div className="text-blue-600">साक्षरता दर</div>
              </div>
              <div className="stat-card bg-white rounded-xl p-5 shadow-lg border border-blue-100 text-center">
                <div className="text-3xl font-tiro-marathi font-bold text-blue-800 mb-2">२९९</div>
                <div className="text-blue-600">हेक्टर क्षेत्रफळ</div>
              </div>
              <div className="stat-card bg-white rounded-xl p-5 shadow-lg border border-blue-100 text-center">
                <div className="text-3xl font-tiro-marathi font-bold text-blue-800 mb-2">४३३</div>
                <div className="text-blue-600">कुटुंबे</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="decoration-circle w-64 h-64 -top-16 -right-16 bg-blue-400"></div>
            <div className="decoration-circle w-32 h-32 -bottom-8 -left-8 bg-cyan-300"></div>
            
            <div className="info-palette relative rounded-2xl p-8 text-white overflow-hidden">
              {/* Corner decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 opacity-10 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 opacity-10 rounded-tr-full"></div>

              <h2 className="text-3xl font-tiro-marathi font-bold mb-6 text-center relative z-10"> ◆ ग्रामपंचायत वाठोडे माहिती  ◆</h2>
              <div className="w-20 h-1 bg-red-400 mx-auto mb-8 rounded-full"></div>
              
              <div className="space-y-2 relative z-10">
                <div className="bg-blue-900 bg-opacity-50 p-5 rounded-xl hover:bg-opacity-70 transition-all duration-300">
                  <h3 className="text-xl font-tiro-marathi font-bold mb-3 flex items-center">
                    <i className="fas fa-users mr-3 text-cyan-300"></i>
                      ➤  लोकसंख्या आणि समाजरचना
                  </h3>
                  <p className="text-blue-100 font-tiro-marathi">
                    वाठोडे हे महाराष्ट्रातील धुळे जिल्ह्याच्या शिरपूर तालुक्यातील एक छोटेखानी पण महत्वाचे गाव आहे. 2011 च्या जनगणनेनुसार, या गावात एकूण 433 कुटुंबे राहतात आणि एकूण लोकसंख्या 2,072 इतकी आहे.
                  </p>
                </div>
                
                <div className="bg-blue-900 bg-opacity-50 p-5 rounded-xl hover:bg-opacity-70 transition-all duration-300">
                  <h3 className="text-xl font-tiro-marathi font-bold mb-3 flex items-center">
                    <i className="fas fa-graduation-cap mr-3 text-cyan-300"></i>
                    ➤ शैक्षणिक स्थिती
                  </h3>
                  <p className="text-blue-100 font-tiro-marathi">
                    शिक्षणाच्या दृष्टीने पाहता, वाठोडे गावाचा एकूण साक्षरता दर 70.42% आहे, ज्यामध्ये पुरुष साक्षरता 82.64% आणि स्त्री साक्षरता 58.20% इतकी आहे. हा साक्षरता दर राज्याच्या तुलनेत समाधानकारक मानला जातो.
                  </p>
                </div>
                
                <div className="bg-blue-900 bg-opacity-50 p-5 rounded-xl hover:bg-opacity-70 transition-all duration-300">
                  <h3 className="text-xl font-tiro-marathi font-bold mb-3 flex items-center">
                    <i className="fas fa-industry mr-3 text-cyan-300"></i>
                    ➤ आर्थिक स्थिती
                  </h3>
                  <p className="text-blue-100 font-tiro-marathi">
                    कामाच्या बाबतीत, एकूण 1,206 नागरिक काम करतात, यामध्ये 957 जण मुख्य व्यवसायात गुंतलेले आहेत. मुख्य काम करणाऱ्यांमध्ये 226 शेतकरी, 652 कृषी मजूर, 14 घरगुती उद्योगात कार्यरत, आणि उर्वरित 65 जण इतर व्यवसाय करतात.
                  </p>
                </div>
                
                <div className="bg-blue-900 bg-opacity-50 p-5 rounded-xl hover:bg-opacity-70 transition-all duration-300">
                  <h3 className="text-xl font-tiro-marathi font-bold mb-3 flex items-center">
                    <i className="fas fa-map-marked-alt mr-3 text-cyan-300"></i>
                   ➤ भौगोलिक माहिती
                  </h3>
                  <p className="text-blue-100 font-tiro-marathi">
                    गावाचे एकूण क्षेत्रफळ सुमारे 299.17 हेक्टर (3.0 चौ.कि.मी.) आहे. वाठोडे ग्रामपंचायतीचा कारभार स्थानिक पातळीवर थेट सरपंच निवडणुकीद्वारे चालवला जातो. गावात प्राथमिक शैक्षणिक संस्था, पाणीपुरवठा योजना, वीजपुरवठा आणि काही मूलभूत नागरी सुविधा उपलब्ध आहेत.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the components remain the same */}
      {/* Officers Section */}
      
        {/* Officers Section */}
       <section className="py-14 px-2 sm:px-8 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl py-5 px-8 text-center shadow-lg transform transition-all duration-300 hover:scale-105">
              <h2 className="text-3xl sm:text-4xl text-white font-tiro-marathi font-bold mb-2">अधिकारी/पदाधिकारी</h2>
              <p className="text-blue-100 font-tiro-marathi ">ग्रामपंचायत वाठोडेचे अधिकारी व पदाधिकारी</p>
            </div>
          </div>

          {/* Officers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-8">
            {/* Officer 1 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 border-blue-100">
              <div className="relative">
                <div className="h-24 xs:h-32 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                <div className="absolute -bottom-8 xs:-bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src="/images/ceo.jpg"
                      alt="विशाल सविता तेजराव नरवाडे"
                      className="w-20 h-20 xs:w-28 xs:h-28 rounded-full border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-6 h-6 xs:w-8 xs:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-10 xs:pt-16 pb-4 xs:pb-6 px-4 xs:px-6 text-center">
                <h3 className="text-base xs:text-xl font-tiro-marathi font-bold text-gray-800 mb-1">विशाल सविता तेजराव नरवाडे</h3>
                <p className="text-blue-600 font-tiro-marathi text-sm xs:text-base mb-2 xs:mb-3">मुख्य कार्यकारी अधिकारी (IAS)</p>
                <p className="text-gray-600 font-tiro-marathi text-xs xs:text-sm mb-3 xs:mb-4">जिल्हा परिषद, धुळे</p>
                <div className="flex justify-center space-x-2 xs:space-x-3">
                  <button className="bg-blue-100 text-blue-700 p-1.5 xs:p-2 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="bg-blue-100 text-blue-700 p-1.5 xs:p-2 rounded-full hover:bg-blue-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Officer 2 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 border-blue-100">
              <div className="relative">
                <div className="h-24 xs:h-32 bg-gradient-to-r from-purple-500 to-purple-700"></div>
                <div className="absolute -bottom-8 xs:-bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative ">
                    <img
                      src="/images/vceo.jpg"
                      alt="गणेश कुसुम भास्कर मोरे"
                      className="w-20 h-20 xs:w-28 xs:h-28 rounded-full  border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-6 h-6 xs:w-8 xs:h-8  bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-10 xs:pt-16 pb-4 xs:pb-6 px-4 xs:px-6 text-center">
                <h3 className="text-base xs:text-xl font-bold font-tiro-marathi  text-gray-800 mb-1">गणेश कुसुम भास्कर मोरे</h3>
                <p className="text-purple-600 font-tiro-marathi text-sm xs:text-base mb-2 xs:mb-3">उपमुख्य कार्यकारी अधिकारी (ग्रा.पं)</p>
                <p className="text-gray-600 text-xs xs:text-sm font-tiro-marathi  mb-3 xs:mb-4">जिल्हा परिषद, धुळे</p>
                <div className="flex justify-center space-x-2 xs:space-x-3">
                  <button className="bg-purple-100 text-purple-700 p-1.5 xs:p-2 rounded-full hover:bg-purple-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="bg-purple-100 text-purple-700 p-1.5 xs:p-2 rounded-full hover:bg-purple-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Officer 3 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 border-blue-100">
              <div className="relative">
                <div className="h-24 xs:h-32 bg-gradient-to-r from-teal-500 to-teal-700"></div>
                <div className="absolute -bottom-8 xs:-bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src="/images/asceo.jpg"
                      alt="प्रदीप सुमनताई बाबूलाल पवार"
                      className="w-20 h-20 xs:w-28 xs:h-28 rounded-full  border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-6 h-6 xs:w-8 xs:h-8  bg-teal-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-10 xs:pt-16 pb-4 xs:pb-6 px-4 xs:px-6 text-center">
                <h3 className="text-base xs:text-xl font-bold font-tiro-marathi  text-gray-800 mb-1">प्रदीप सुमनताई बाबूलाल पवा</h3>
                <p className="text-teal-600 font-tiro-marathi text-sm xs:text-base mb-2 xs:mb-3">गटविकास अधिकारी</p>
                <p className="text-gray-600 text-xs xs:text-sm font-tiro-marathi  mb-3 xs:mb-4">समिती, शिरपूर, जि. धुळे</p>
                <div className="flex justify-center space-x-2 xs:space-x-3">
                  <button className="bg-teal-100 text-teal-700 p-1.5 xs:p-2 rounded-full hover:bg-teal-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="bg-teal-100 text-teal-700 p-1.5 xs:p-2 rounded-full hover:bg-teal-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Officer 4 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 border-blue-100">
              <div className="relative">
                <div className="h-24 xs:h-32 bg-gradient-to-r from-red-500 to-red-700"></div>
                <div className="absolute -bottom-8 xs:-bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src="/images/sarpanch.jpg"
                      alt="विकास पाटील"
                      className="w-20 h-20 xs:w-28 xs:h-28 rounded-full  border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-6 h-6 xs:w-8 xs:h-8  bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-10 xs:pt-16 pb-4 xs:pb-6 px-4 xs:px-6 text-center">
                <h3 className="text-base xs:text-xl font-bold font-tiro-marathi  text-gray-800 mb-1">विकास पाटील</h3>
                <p className="text-red-600 font-tiro-marathi text-sm xs:text-base mb-2 xs:mb-3">लोकनियुक्त सरपंच</p>
                <p className="text-gray-600 text-xs xs:text-sm font-tiro-marathi  mb-3 xs:mb-4">ग्रामपंचायत, वाठोडे</p>
                <div className="flex justify-center space-x-2 xs:space-x-3">
                  <button className="bg-red-100 text-red-700 p-1.5 xs:p-2 rounded-full hover:bg-red-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="bg-red-100 text-red-700 p-1.5 xs:p-2 rounded-full hover:bg-red-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Officer 5 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 border-blue-100">
              <div className="relative">
                <div className="h-24 xs:h-32 bg-gradient-to-r from-green-500 to-green-700"></div>
                <div className="absolute -bottom-8 xs:-bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src="/images/officer3.jpg"
                      alt="उपसरपंच"
                      className="w-20 h-20 xs:w-28 xs:h-28 rounded-full  border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-6 h-6 xs:w-8 xs:h-8  bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-10 xs:pt-16 pb-4 xs:pb-6 px-4 xs:px-6 text-center">
                <h3 className="text-base xs:text-xl font-bold font-tiro-marathi  text-gray-800 mb-1">उपसरपंच</h3>
                <p className="text-green-600 font-tiro-marathi text-sm xs:text-base mb-2 xs:mb-3">उपसरपंच</p>
                <p className="text-gray-600 text-xs xs:text-sm font-tiro-marathi  mb-3 xs:mb-4">ग्रामपंचायत वाठोडे</p>
                <div className="flex justify-center space-x-2 xs:space-x-3">
                  <button className="bg-green-100 text-green-700 p-1.5 xs:p-2 rounded-full hover:bg-green-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="bg-green-100 text-green-700 p-1.5 xs:p-2 rounded-full hover:bg-green-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Officer 6 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group border-2 border-blue-100">
              <div className="relative">
                <div className="h-24 xs:h-32 bg-gradient-to-r from-yellow-500 to-yellow-700"></div>
                <div className="absolute -bottom-8 xs:-bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img
                      src="/images/gramsevak.jpeg"
                      alt="शरद पुंडलिक कोळी"
                      className="w-20 h-20 xs:w-28 xs:h-28 rounded-full  border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-110"
                    />
                    <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-6 h-6 xs:w-8 xs:h-8  bg-yellow-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.003-.21-1.96-.59-2.808A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-10 xs:pt-16 pb-4 xs:pb-4 px-4 xs:px-6 text-center">
                <h3 className="text-base xs:text-xl font-bold font-tiro-marathi  text-gray-800 mb-1">शरद कोळी</h3>
                <p className="text-yellow-600 font-tiro-marathi text-sm xs:text-base mb-2 xs:mb-3">ग्रामपंचायत अधिकारी</p>
                <p className="text-gray-600 text-xs xs:text-sm font-tiro-marathi  mb-3 xs:mb-4">ग्रामपंचायत, वाठोडे</p>
                <div className="flex justify-center space-x-2 xs:space-x-3">
                  <button className="bg-yellow-100 text-yellow-700 p-1.5 xs:p-2 rounded-full hover:bg-yellow-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </button>
                  <button className="bg-yellow-100 text-yellow-700 p-1.5 xs:p-2 rounded-full hover:bg-yellow-200 transition-colors">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Notice Board / Current News Section */}
      <section className="py-14 px-2 sm:px-8 bg-[#ececff]">
        <NoticeBoard />
      </section>

      {/* Connect with Government Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">
            Connect with Government
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {/* Card 3 */}
            <a
              href="https://www.digitalindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="/images/digital_india.jpg"
                alt="Digital India"
                className="w-full h-48 xs:h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-lg xs:text-sm font-tiro-marathi text-center py-3 group-hover:bg-opacity-90 transition">
                डिजिटल इंडिया
              </div>
            </a>
            {/* Card 4 */}
            <a
              href="https://bharatkeveer.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="/images/bharat-ke-veer.jpg"
                alt="Bharat ke Veer"
                className="w-full h-48 xs:h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-lg xs:text-sm font-tiro-marathi text-center py-3 group-hover:bg-opacity-90 transition">
                भारत के वीर
              </div>
            </a>
            {/* Card 5 */}
            <a
              href="https://www.mygov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="/images/mygov.png"
                alt="MyGov"
                className="w-full h-48 xs:h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-lg xs:text-sm font-tiro-marathi text-center py-3 group-hover:bg-opacity-90 transition">
                MyGov- Connect with Gov.
              </div>
            </a>
            {/* Card 6 */}
            <a
              href="https://pmjdy.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="../../public/images/jan_dhan_yojna.jpg"
                alt="P.M Jan Dhan Yojana"
                className="w-full h-48 xs:h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-lg xs:text-sm font-tiro-marathi text-center py-3 group-hover:bg-opacity-90 transition">
                प्रधानमंत्री जन धन योजना
              </div>
            </a>
            {/* Card 7 */}
            <a
              href="https://www.nsiindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="../../public/images/Sukanya_Samriddhi_Yojana_Scheme.jpg"
                alt="Sukanya Samriddhi Yojana"
                className="w-full h-48 xs:h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-lg xs:text-sm font-tiro-marathi text-center py-3 group-hover:bg-opacity-90 transition">
                सुकन्या समृद्धी योजना
              </div>
            </a>
            {/* Card 8 */}
            <a
              href="https://www.skillindia.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative rounded-xl overflow-hidden shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src="/images/skill_india.jpg"
                alt="National Skill Dev. Mission"
                className="w-full h-48 xs:h-32 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gray-800 bg-opacity-70 text-white text-lg xs:text-sm font-tiro-marathi text-center py-3 group-hover:bg-opacity-90 transition">
                राष्ट्रीय कौशल्य विकास अभियान
              </div>
            </a>
          </div>
        </div>
      </section>

      <button
        onClick={() => scrollToSection("main-content")}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Back to Top
      </button>
    </div>
  );
}