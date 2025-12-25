import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/axios';
import { FaSpinner } from 'react-icons/fa';

interface GalleryImage {
  key: string;
  originalName: string;
  fileName: string;
  size: number;
  lastModified: string;
  folder: string;
  extension: string;
  signedUrl: string;
  downloadUrl: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef(null);
  const lastImageRef = useRef(null);

  const IMAGES_PER_BATCH = 12;

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        const res = await api.get('/gallery');
        const responseData = res.data.data;
        
        if (responseData && Array.isArray(responseData.images)) {
          // Images are already sorted by lastModified (newest first) from backend
          const images = responseData.images.map((img: GalleryImage) => ({
            ...img,
            id: img.key, // Use key as unique identifier
            src: img.signedUrl || img.downloadUrl,
            alt: img.originalName || 'Gallery Image'
          }));
          
          setAllImages(images);
          // Show first batch
          setVisibleImages(images.slice(0, IMAGES_PER_BATCH));
        } else {
          setAllImages([]);
          setVisibleImages([]);
        }
      } catch (err: any) {
        console.error('Error fetching gallery images:', err);
        setError(err.message || 'Failed to load gallery images');
        setAllImages([]);
        setVisibleImages([]);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!initialLoading && !loading && visibleImages.length < allImages.length) {
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
  }, [initialLoading, loading, visibleImages, allImages]);

  const loadMoreImages = () => {
    if (visibleImages.length >= allImages.length) return;

    setLoading(true);
    
    // Load next batch
    setTimeout(() => {
      const nextBatch = allImages.slice(
        visibleImages.length,
        visibleImages.length + IMAGES_PER_BATCH
      );
      setVisibleImages(prev => [...prev, ...nextBatch]);
      setLoading(false);
    }, 300);
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
    const currentIndex = allImages.findIndex(img => img.key === selectedImage.key);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
    setZoomLevel(1);
  };

  const goToPrevious = () => {
    if (!selectedImage) return;
    const currentIndex = allImages.findIndex(img => img.key === selectedImage.key);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
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

        {/* Loading State */}
        {initialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-gray-600 text-lg">Loading gallery images...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !initialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <p className="text-red-600 text-lg">{error}</p>
            <p className="text-red-500 text-sm mt-2">Please try refreshing the page.</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!initialLoading && !error && allImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-600 text-xl">No images found in the gallery.</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new photos!</p>
          </motion.div>
        )}

        {/* Masonry Style Gallery with Infinite Scroll */}
        {!initialLoading && !error && allImages.length > 0 && (
          <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visibleImages.map((img, index) => (
            <motion.div
              key={img.key}
              ref={
                index === visibleImages.length - 1 &&
                visibleImages.length < allImages.length
                  ? lastImageRef
                  : null
              }
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg bg-white cursor-pointer transform-gpu"
              onClick={() => openModal(img)}
            >
              <div className="relative overflow-hidden group aspect-[4/3] sm:aspect-square">
                <img
                  src={img.signedUrl || img.downloadUrl}
                  alt={img.originalName || 'Gallery Image'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x300?text=Image+Error';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-1.5 sm:p-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        )}

        {/* Loading Indicator for More Images */}
        {loading && !initialLoading && (
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
        {!initialLoading && !loading && visibleImages.length === allImages.length && allImages.length > 0 && (
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
                    key={selectedImage.key}
                    src={selectedImage.signedUrl || selectedImage.downloadUrl}
                    alt={selectedImage.originalName || 'Gallery Image'}
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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Error';
                    }}
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
                    {allImages.findIndex(img => img.key === selectedImage.key) + 1} / {allImages.length}
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