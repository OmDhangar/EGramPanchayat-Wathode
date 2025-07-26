import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { getGalleryByYear } from '../data/gallery';

const YearGallery = () => {
  const { year } = useParams<{ year: string }>();
  const galleryData = getGalleryByYear(year || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!galleryData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Year Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find any gallery for the year {year}.
        </p>
        <Link 
          to="/gallery" 
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
        </Link>
      </div>
    );
  }

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/gallery" 
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{year} Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {galleryData.description}
          </p>
        </div>

        {/* Events */}
        <div className="space-y-12">
          {galleryData.events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{event.name}</h2>
                <p className="text-gray-600 mb-6">{event.date} - {event.description}</p>
                
                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer overflow-hidden rounded-lg h-48"
                      onClick={() => openLightbox(photo.url)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-full object-cover transition duration-300 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged view" 
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default YearGallery;