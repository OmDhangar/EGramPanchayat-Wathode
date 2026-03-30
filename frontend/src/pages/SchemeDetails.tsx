import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Helmet } from "react-helmet";
import { Scheme, getSchemes, resolveSchemeAssetUrl } from '../api/schemes';

const SchemeDetails = () => {
  const { year } = useParams<{ year: string }>();
  const [schemes, setSchemes] = useState<Scheme[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchemes = async () => {
      if (!year) return;
      setLoading(true);
      try {
        const response = await getSchemes({ year, limit: 100 });
        console.log(response);
        setSchemes(response.schemes.length > 0 ? response.schemes : null);
      } finally {
        setLoading(false);
      }
    };
    loadSchemes();
  }, [year]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">Loading schemes...</div>;
  }

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
            <div key={scheme._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:flex-shrink-0 relative">
                <img 
                  className="h-full w-full object-cover md:w-56" 
                  src={resolveSchemeAssetUrl(scheme.thumbnailPath)} 
                  alt={scheme.title} 
                />
                {scheme.status === 'active' && (
                  <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-green-200">
                    ● Active
                  </span>
                )}
              </div>
          
              {/* Content Section */}
              <div className="p-6 w-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{scheme.title}</h2>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {scheme.launchDate}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
          
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Benefits - Now pulled from backend array */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Key Benefit</p>
                      <div className="text-gray-800 font-medium">
                        {scheme.benefits && scheme.benefits.length > 0 ? (
                          <span className="text-green-700 font-semibold">{scheme.benefits[0]}</span>
                        ) : "Not Specified"}
                      </div>
                    </div>
          
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Eligibility</p>
                      <p className="text-gray-800 font-medium">{scheme.eligibility}</p>
                    </div>
          
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Department</p>
                      <p className="text-gray-800 font-medium">{scheme.agency}</p>
                    </div>
                  </div>
                </div>
          
                {/* Action Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500 italic">ID: {scheme._id.slice(-6).toUpperCase()}</span>
                  <Link
                    to={`/schemes/details/${scheme.slug || scheme._id}`}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    View Full Details
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Link>
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