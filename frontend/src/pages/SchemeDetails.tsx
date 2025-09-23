import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Users, Calendar, Landmark } from 'lucide-react';
import { getSchemesByYear } from '../data/schemes';
import { Helmet } from "react-helmet";

const SchemeDetails = () => {
  const { year } = useParams<{ year: string }>();
  const schemes = getSchemesByYear(year || '');

  if (!schemes) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Year Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find any schemes for the year {year}.
        </p>
        <Link 
          to="/schemes" 
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <Helmet>
        <title>{`शासकीय योजना ${year} - ग्रामपंचायत वाठोडे`}</title>
        <meta name="description" content={`ग्रामपंचायत वाठोडे येथे ${year} मध्ये राबविण्यात आलेल्या शासकीय योजनांची माहिती. ग्रामपंचायत वाठोडे, शिरपूर, धुळे, महाराष्ट्र.`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/schemes" 
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to All Schemes
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Government Schemes - {year}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the government schemes implemented in our Gram Panchayat during {year}.
          </p>
        </div>

        {/* Schemes List */}
        <div className="space-y-8">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img 
                    className="h-48 w-full object-cover md:w-48" 
                    src={scheme.imageUrl} 
                    alt={scheme.name} 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-600">{scheme.launchDate}</p>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{scheme.name}</h2>
                  <p className="text-gray-600 mb-4">{scheme.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Eligibility</p>
                        <p className="text-gray-600">{scheme.eligibility}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Landmark className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Implementing Agency</p>
                        <p className="text-gray-600">{scheme.agency}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href="#" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                      Learn more
                    </a>
                    <a 
                      href="#" 
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 ml-4"
                    >
                      <Download className="h-4 w-4 mr-1" /> Download Guidelines
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;