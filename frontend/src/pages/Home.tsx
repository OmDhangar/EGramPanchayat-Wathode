import React, { useEffect, useRef, useState } from 'react';
//import { FaLandmark, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { motion } from "framer-motion";


const images = [
  "/images/vathode1.jpg",
  "/images/vathode2.jpg",
  "/images/vathode3.jpg",
  "/images/vathode4.jpg",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
};


export default function Home() {
  // const villageInfo = {
  //   established: "१९५५",
  //   population: "२,५००",
  //   literacy: "८५%",
  // };

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

  // --- Add these for marquee pause/resume ---
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

  // ------------------------------------------

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="main-content" className="min-h-screen bg-white font-tiro-marathi-sans text-[14px] sm:text-base">
      {/* Header Banner with Slideshow */}
      <section className="bg-gradient-to-r from-blue-700 via-green-500 to-green-300 text-white py-6 px-2 sm:py-12 sm:px-6 relative overflow-hidden shadow-lg">
        <div className="max-w-8xl max-h-6xl mx-auto relative">
          {/* Slideshow Container */}
          <div className="relative w-full h-48 sm:h-96 overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl mb-4 sm:mb-6">
            <div
              className="flex transition-transform duration-[2000ms] ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {imageGrid.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className={`w-full flex-shrink-0 object-contain h-48 sm:h-96 transition-transform duration-[2000ms] ease-in-out ${
                    index === currentIndex ? "scale-105 opacity-100" : "scale-100 opacity-60"
                  }`}
                  style={{
                    transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 1.2s",
                  }}
                />
              ))}
            </div>
            {/* Swacch Sundar Harit Vathode Title (left, overlay, visible on all screens) */}
            <div className="absolute left-2 top-2 sm:left-6 sm:top-6 bg-black/40 rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow">
              <p className="text-base sm:text-2xl font-tiro-marathi leading-tight text-green-200">स्वच्छ सुंदर</p>
              <p className="text-lg sm:text-3xl font-tiro-marathi text-green-400">हरित वाठोडे</p>
            </div>
          </div>

          {/* Village Title & Dots */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-0">
            <div className="text-center sm:text-right w-full">
              <p className="text-lg sm:text-3xl font-tiro-marathi leading-tight drop-shadow">विकसित</p>
              <p className="text-xl sm:text-4xl font-tiro-marathi text-yellow-200 drop-shadow">वाठोडे</p>
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
      <div className="relative w-full bg-black overflow-hidden h-10 sm:h-12 flex items-center">
        <div className="absolute left-0 top-0 h-full flex items-center px-3 bg-yellow-400 text-black font-tiro-marathi text-xs sm:text-sm rounded-br-md z-10">
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
              className="whitespace-nowrap animate-marquee text-white text-sm sm:text-base font-tiro-marathi flex items-center gap-7 sm:gap-16 cursor-pointer"
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
      <section
  className="w-full py-10 px-2 sm:px-6 bg-[#f8fafc] flex flex-col md:flex-row items-center md:items-start gap-8 font-tiro-marathi"
  id="vathode-info"
>
  {/* Left Side: Satellite Map and Google Map Link */}
  <div className="flex flex-col items-center gap-16 w-full md:w-1/2">
    <motion.img
      src="/images/wathodesatelliteimg.jpg"
      alt="वाठोडे सॅटेलाईट नकाशा"
      className="rounded-2xl shadow-lg w-full max-w-md object-cover"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
    />
    <motion.a
      href="https://goo.gl/maps/your-google-map-link"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-800 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow hover:bg-blue-900 transition"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={1}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      वाठोडेच्या गुगल मॅप वर जाण्यासाठी येथे क्लिक करा
    </motion.a>
    <motion.img
      src="/images/wathodesatelliteimg2.jpg.png"
      alt="वाठोडे गावाचा नकाशा"
      className="rounded-xl shadow w-full max-w-md object-cover"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={2}
    />
  </div>

  {/* Right Side: Village Info Palette */}
  <motion.div
    className="w-full md:w-1/2 bg-blue-800 text-white rounded-2xl shadow-xl p-8 flex flex-col gap-4"
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={3}
  >
    <h2 className="text-4xl font-tiro-marathi mb-2 text-center">वाठोडे ग्रामपंचायत</h2>
    <p className="text-lg text-center mb-2">च्या डिजिटल पोर्टल वर आपले स्वागत आहे</p>
    <hr className="border-blue-200 mb-2" />
    <div className="text-base leading-relaxed space-y-3">
      <p>
        वाठोडे हे महाराष्ट्रातील धुळे जिल्ह्याच्या शिरपूर तालुक्यातील एक छोटेखानी पण महत्वाचे गाव आहे. 2011 च्या जनगणनेनुसार, या गावात एकूण 433 कुटुंबे राहतात आणि एकूण लोकसंख्या 2,072 इतकी आहे, ज्यामध्ये 1,053 पुरुष आणि 1,019 महिला आहेत. गावाचे लिंग गुणोत्तर 968 आहे, जे राज्याच्या सरासरीपेक्षा थोडे जास्त आहे. गावातील 0 ते 6 वयोगटातील मुलांची संख्या 253 आहे, आणि या वयोगटातील लिंग गुणोत्तर 769 आहे.
      </p>
      <p>
        शिक्षणाच्या दृष्टीने पाहता, वाठोडे गावाचा एकूण साक्षरता दर 70.42% आहे, ज्यामध्ये पुरुष साक्षरता 82.64% आणि स्त्री साक्षरता 58.20% इतकी आहे. हा साक्षरता दर राज्याच्या तुलनेत समाधानकारक मानला जातो. जातीनुसार वर्गीकरण पाहता, या गावात सुमारे 6.2% लोकसंख्या अनुसूचित जातींमध्ये मोडते, तर जवळपास 40% लोकसंख्या अनुसूचित जमातींमध्ये आहे, जे गावाचे सामाजिक-सांस्कृतिक विविधतेचे दर्शन घडवते.
      </p>
      <p>
        कामाच्या बाबतीत, एकूण 1,206 नागरिक काम करतात, यामध्ये 957 जण मुख्य व्यवसायात गुंतलेले आहेत (6 महिन्यांपेक्षा जास्त काळ रोजगार), तर 249 जण अल्पकालीन रोजगार करतात. मुख्य काम करणाऱ्यांमध्ये 226 शेतकरी, 652 कृषी मजूर, 14 घरगुती उद्योगात कार्यरत, आणि उर्वरित 65 जण इतर व्यवसाय करतात.
      </p>
      <p>
        गावाचे एकूण क्षेत्रफळ सुमारे 299.17 हेक्टर (3.0 चौ.कि.मी.) आहे. वाठोडे ग्रामपंचायतीचा कारभार स्थानिक पातळीवर थेट सरपंच निवडणुकीद्वारे चालवला जातो. गावात प्राथमिक शैक्षणिक संस्था, पाणीपुरवठा योजना, वीजपुरवठा आणि काही मूलभूत नागरी सुविधा उपलब्ध आहेत. वाठोडे गाव हे आदिवासी लोकसंख्येच्या प्रमाणात महत्त्वाचे मानले जाते आणि कृषी हा प्रमुख उपजीविकेचा स्रोत आहे.
      </p>
    </div>
  </motion.div>
</section>

{/* Officers Section - New Addition */}
<section className="py-10 px-2 sm:px-6 bg-[#f8fafc]">
  <div className="max-w-6xl mx-auto">
    <div className="mb-8">
      <div className="bg-blue-500 rounded-[3rem]  border border-blue-950 py-4 px-4 text-center shadow">
        <h2 className="text-2xl sm:text-4xl  text-white font-semibold font-tiro-marathi">अधिकारी/पदाधिकारी</h2>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Officer 1 */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col border-2 border-black items-center">
        <img
          src="/images/ceo.jpg"
          alt="विशाल सविता तेजराव नरवाडे"
          className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h3 className="text-xl font-tiro-marathi tiro-header text-center mb-2">मा. विशाल सविता तेजराव नरवाडे</h3>
        <p className="text-gray-700 text-center font-tiro-marathi">
          मुख्य कार्यकारी अधिकारी (IAS)<br />
          जिल्हा परिषद, धुळे
        </p>
      </div>
      {/* Officer 2 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-black flex flex-col items-center">
        <img
          src="/images/vceo.jpg"
          alt="गणेश कुसुम भास्कर मोरे"
          className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h3 className="text-xl font-tiro-marathi-semibold tiro-header text-center mb-2">मा. गणेश कुसुम भास्कर मोरे</h3>
        <p className="text-gray-700 text-center font-tiro-marathi">
          उपमुख्य कार्यकारी अधिकारी (ग्रा.पं)<br />
          जिल्हा परिषद, धुळे
        </p>
      </div>
      {/* Officer 3 */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-black flex flex-col items-center">
        <img
          src="/images/asceo.jpg"
          alt="प्रदीप सुमनताई बाबूलाल पवार"
          className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h3 className="text-xl font-tiro-marathi-semibold tiro-header text-center mb-2">मा. प्रदीप सुमनताई बाबूलाल पवार</h3>
        <p className="text-gray-700 text-center font-tiro-marathi">
          गटविकास अधिकारी<br />
          पंचायत समिती, शिरपूर, जि. धुळे
        </p>
      </div>
      <div className="bg-white rounded-xl border-2 border-black shadow-lg p-6 flex flex-col items-center">
        <img
          src="/images/sarpanch.jpg"
          alt="vikas patil"
          className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h3 className="text-xl font-tiro-marathi-semibold tiro-header text-center mb-2">श्री. विकास पाटील</h3>
        <p className="text-gray-700 text-center font-tiro-marathi">
     लोकनियुक्त सरपंच<br />
          ग्रामपंचायत, वाठोडे 
        </p>
      </div>
      <div className="bg-white rounded-xl border-2 border-black shadow-lg p-6 flex flex-col items-center">
        <img
          src="/images/officer3.jpg"
          alt="प्रदीप सुमनताई बाबूलाल पवार"
          className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h3 className="text-xl font-tiro-marathi-semibold tiro-header text-center mb-2">श्री. ..... </h3>
        <p className="text-gray-700 text-center font-tiro-marathi">
          उपसरपंच<br />
          ग्रामपंचायत वाठोडे 
        </p>
      </div>
      <div className="bg-white rounded-xl border-2 border-black shadow-lg p-6 flex flex-col items-center">
        <img
          src="/images/gramsevak.jpeg"
          alt=""
          className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h3 className="text-xl font-tiro-marathi-semibold tiro-header text-center mb-2">श्री. शरद पुंडलिक कोळी </h3>
        <p className="text-gray-700 text-center font-tiro-marathi">
          ग्रामपंचायत अधिकारी,वाठोडे<br />
          
        </p>
      </div>
    </div>
  </div>
</section>

{/* Connect With Government Section */}
<section className="py-12 px-2 sm:px-6 bg-[#ececff]">
  <h2 className="text-2xl sm:text-3xl font-tiro-marathi-bold text-center mb-10 text-black">Connect With Government</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {/* Card 1 */}
    <a
      href="https://digitalindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/digital_india.jpg" alt="Digital India" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Digital India
      </div>
    </a>
    {/* Card 2 */}
    <a
      href="https://www.makeinindia.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/make_in_india.jpg" alt="Make in India" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Make in India
      </div>
    </a>
    {/* Card 3 */}
    <a
      href="https://swachhbharat.mygov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/swatch-bharat.jpg" alt="Swachh Bharat Abhiyaan" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Swachh Bharat Abhiyan
      </div>
    </a>
    {/* Card 4 */}
    <a
      href="https://bharatkeveer.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/bharat-ke-veer.jpg" alt="Bharat ke Veer" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Bharat ke Veer
      </div>
    </a>
    {/* Card 5 */}
    <a
      href="https://www.mygov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/mygov.png" alt="MyGov" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        MyGov- Connect with Gov.
      </div>
    </a>
    {/* Card 6 */}
    <a
      href="https://pmjdy.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="../../public/images/jan_dhan_yojna.jpg" alt="P.M Jan Dhan Yojana" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        P.M Jan Dhan Yojana
      </div>
    </a>
    {/* Card 7 */}
    <a
      href="https://www.nsiindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="../../public/images/Sukanya_Samriddhi_Yojana_Scheme.jpg" alt="Sukanya Samriddhi Yojana" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Sukanya Samriddhi Yojana
      </div>
    </a>
    {/* Card 8 */}
    <a
      href="https://www.skillindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/skill_india.jpg" alt="National Skill Dev. Mission" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-tiro-marathi-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        National Skill Devel. Mission
      </div>
    </a>
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
