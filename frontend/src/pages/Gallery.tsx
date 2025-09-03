import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { galleryYears } from '../data/gallery';

const Gallery = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our collection of photographs showcasing various events, development projects, and activities conducted in our Gram Panchayat over the years.
          </p>
        </div>

        {/* Year-wise Gallery Listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryYears.map((year) => (
            <Link 
              key={year.id} 
              to={`/gallery/${year.year}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="relative h-48">
                <img 
                  src={year.coverImage} 
                  alt={`${year.year} Gallery`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{year.year}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-gray-600">{year.eventCount} Events</p>
                </div>
                <p className="text-gray-600 mb-4">
                  {year.description}
                </p>
                <div className="text-blue-600 font-medium flex items-center hover:text-blue-800">
                  View Gallery <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;