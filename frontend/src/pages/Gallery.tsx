import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';

// Sample gallery data (replace with your actual gallery data)
const galleryImages = [
  { id: 1, src: "/images/1.jpeg", alt: "Village Event 1" },
  { id: 2, src: "/images/2.jpeg", alt: "Village Event 2" },
  { id: 3, src: "/images/3.jpeg", alt: "Village Event 3" },
  { id: 4, src: "/images/4.jpeg", alt: "Village Event 4" },
  { id: 5, src: "/images/5.jpeg", alt: "Village Event 5" },
  { id: 6, src: "/images/6.jpeg", alt: "Village Event 6" },
  { id: 7, src: "/images/7.jpeg", alt: "Village Development Project" },
  { id: 8, src: "/images/8.jpeg", alt: "Community Meeting" },
  { id: 9, src: "/images/9.jpeg", alt: "Village Event 9" },
  { id: 10, src: "/images/10.jpeg", alt: "Village Event 10" },
  { id: 11, src: "/images/11.jpeg", alt: "Village Event 11" },
  { id: 12, src: "/images/12.jpeg", alt: "Village Event 12" },
  { id: 13, src: "/images/13.jpeg", alt: "Village Event 13" },
  { id: 14, src: "/images/14.jpeg", alt: "Village Event 14" },
  { id: 15, src: "/images/15.jpeg", alt: "Village Event 15" },
  { id: 16, src: "/images/16.jpeg", alt: "Village Event 16" },
  { id: 17, src: "/images/17.jpeg", alt: "Village Event 17" },
  { id: 18, src: "/images/18.jpeg", alt: "Village Event 18" },
  { id: 19, src: "/images/19.jpeg", alt: "Village Event 19" },  
  { id: 20, src: "/images/20.jpeg", alt: "Village Event 20" },
  { id: 21, src: "/images/21.jpeg", alt: "Village Event 21" },
  { id: 22, src: "/images/22.jpeg", alt: "Village Event 22" },
  { id: 23, src: "/images/23.jpeg", alt: "Village Event 23" },
  { id: 24, src: "/images/24.jpeg", alt: "Village Event 24" },
  { id: 25, src: "/images/25.jpeg", alt: "Village Event 25" },
  { id: 26, src: "/images/26.jpeg", alt: "Village Event 26" },
  { id: 27, src: "/images/27.jpeg", alt: "Village Event 27" },
  { id: 28, src: "/images/28.jpeg", alt: "Village Event 28" },
  { id: 29, src: "/images/29.jpg", alt: "Village Event 29" },
  { id: 30, src: "/images/30.jpeg", alt: "Village Event 30" },
  { id: 31, src: "/images/31.jpeg", alt: "Village Event 31" },
  { id: 32, src: "/images/32.jpeg", alt: "Village Event 32" },
  { id: 33, src: "/images/33.jpeg", alt: "Village Event 33" },
  { id: 34, src: "/images/34.jpeg", alt: "Village Event 34" },
  { id: 35, src: "/images/35.jpeg", alt: "Village Event 35" },
  { id: 36, src: "/images/36.jpeg", alt: "Village Event 36" },
  { id: 37, src: "/images/37.jpeg", alt: "Village Event 37" },
  { id: 38, src: "/images/38.jpeg", alt: "Village Event 38" },
  { id: 39, src: "/images/39.jpeg", alt: "Village Event 39" },
  { id: 40, src: "/images/40.jpeg", alt: "Village Event 40" },
  { id: 41, src: "/images/41.jpeg", alt: "Village Event 41" },
  { id: 42, src: "/images/42.jpeg", alt: "Village Event 42" },
  { id: 43, src: "/images/43.jpeg", alt: "Village Event 43" },
  { id: 44, src: "/images/44.jpeg", alt: "Village Event 44" },
  { id: 45, src: "/images/45.jpeg", alt: "Village Event 45" },
  { id: 46, src: "/images/46.jpeg", alt: "Village Event 46" },
  { id: 47, src: "/images/47.jpeg", alt: "Village Event 47" },
  { id: 48, src: "/images/48.jpeg", alt: "Village Event 48" },
  { id: 49, src: "/images/49.jpeg", alt: "Village Event 49" },
  { id: 50, src: "/images/50.jpeg", alt: "Village Event 50" },
  { id: 51, src: "/images/51.jpeg", alt: "Village Event 51" },
  { id: 52, src: "/images/52.jpeg", alt: "Village Event 52" },
  { id: 53, src: "/images/53.jpeg", alt: "Village Event 53" },
  { id: 54, src: "/images/54.jpeg", alt: "Village Event 54" },
  { id: 55, src: "/images/55.jpeg", alt: "Village Event 55" },
  { id: 56, src: "/images/56.jpg", alt: "Village Event 56" },
  ];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleImages, setVisibleImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);
  const lastImageRef = useRef(null);

  // Initialize with first batch of images
  useEffect(() => {
    const initialBatch = galleryImages.slice(0, 12);
    setVisibleImages(initialBatch);
    setLoading(false);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreImages();
          }
        },
        { threshold: 0.1 }
      );

      if (lastImageRef.current) {
        observer.observe(lastImageRef.current);
      }

      return () => {
        if (lastImageRef.current) {
          observer.unobserve(lastImageRef.current);
        }
      };
    }
  }, [loading, visibleImages]);

  const loadMoreImages = () => {
    if (visibleImages.length >= galleryImages.length) return;

    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextBatch = galleryImages.slice(
        visibleImages.length,
        visibleImages.length + 9
      );
      setVisibleImages(prev => [...prev, ...nextBatch]);
      setLoading(false);
    }, 500);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setZoomLevel(1);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const goToNext = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
    setZoomLevel(1);
  };

  const goToPrevious = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch(e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 font-tiro-marathi min-h-screen py-12">
      <Helmet>
        <title>फोटो गॅलरी - ग्रामपंचायत वाठोडे</title>
        <meta
          name="description"
          content="ग्रामपंचायत वाठोडे येथील विविध कार्यक्रम, विकास प्रकल्प आणि उपक्रमांचे फोटो गॅलरी एक्सप्लोर करा."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Heading */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            फोटो गॅलरी
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ग्रामपंचायत वाठोडे येथील विविध कार्यक्रम, विकास प्रकल्प आणि उपक्रमांचे फोटो गॅलरी एक्सप्लोर करा.
          </p>
        </motion.div>

        {/* Masonry Style Gallery with Infinite Scroll */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visibleImages.map((img, index) => (
            <motion.div
              key={img.id}
              ref={index === visibleImages.length - 1 ? lastImageRef : null}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl bg-white cursor-pointer transform-gpu"
              onClick={() => openModal(img)}
            >
              <div className="relative overflow-hidden group aspect-square">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    className="bg-white bg-opacity-90 rounded-full p-2"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-8"
          >
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        )}

        {/* End of Gallery Message */}
        {visibleImages.length === galleryImages.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-600 text-lg">
              तुम्ही सर्व फोटो पाहिले आहेत! 📸
            </p>
          </motion.div>
        )}

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-6xl h-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 md:p-4 transition-all z-10 backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 md:p-4 transition-all z-10 backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image with Zoom */}
                <div className="w-full h-full flex items-center justify-center">
                  <motion.img
                    key={selectedImage.id}
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-w-full max-h-full object-contain cursor-zoom-in"
                    style={{ scale: zoomLevel }}
                    drag
                    dragConstraints={{
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    }}
                    onClick={handleZoomIn}
                  />
                </div>

                {/* Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 rounded-xl p-3 flex items-center space-x-4 backdrop-blur-sm">
                  <button
                    onClick={handleZoomOut}
                    className="text-white hover:text-blue-300 transition-colors p-2"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <button
                    onClick={handleResetZoom}
                    className="text-white hover:text-blue-300 transition-colors px-3 py-1 text-sm border border-white rounded-lg min-w-[60px]"
                    title="Reset Zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>

                  <button
                    onClick={handleZoomIn}
                    className="text-white hover:text-blue-300 transition-colors p-2"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="text-sm font-medium">
                    {galleryImages.findIndex(img => img.id === selectedImage.id) + 1} / {galleryImages.length}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 transition-all backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;