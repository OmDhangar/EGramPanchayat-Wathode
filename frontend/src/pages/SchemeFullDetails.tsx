import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Landmark, Users, ExternalLink } from "lucide-react";
import { Helmet } from "react-helmet";
import { Scheme, getSchemeByIdOrSlug, resolveSchemeAssetUrl } from "../api/schemes";

export default function SchemeFullDetails() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScheme = async () => {
      if (!idOrSlug) return;
      setLoading(true);
      try {
        const data = await getSchemeByIdOrSlug(idOrSlug);
        setScheme(data);
      } catch {
        setScheme(null);
      } finally {
        setLoading(false);
      }
    };
    loadScheme();
  }, [idOrSlug]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-center">Loading scheme details...</div>;
  }

  if (!scheme) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scheme not found</h1>
        <p className="text-gray-600 mb-6">The requested scheme does not exist or is unavailable.</p>
        <Link to="/schemes" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-10">
      <Helmet>
        <title>{`${scheme.title} - ग्रामपंचायत वाठोडे`}</title>
        <meta name="description" content={scheme.description} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={`/schemes/${scheme.year}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to {scheme.year} schemes
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <img
            src={resolveSchemeAssetUrl(scheme.thumbnailPath)}
            alt={scheme.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{scheme.title}</h1>
            <p className="text-gray-700 mb-6">{scheme.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">Launch Date</p>
                  <p className="text-gray-800">{scheme.launchDate || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">Eligibility</p>
                  <p className="text-gray-800">{scheme.eligibility || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Landmark className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">Implementing Agency</p>
                  <p className="text-gray-800">{scheme.agency || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Benefits</h2>
              {scheme.benefits?.length ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {scheme.benefits.map((benefit, index) => (
                    <li key={`${scheme._id}-benefit-${index}`}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No benefits listed.</p>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Application Process</h2>
              {scheme.applicationProcess?.length ? (
                <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                  {scheme.applicationProcess.map((step, index) => (
                    <li key={`${scheme._id}-step-${index}`}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-gray-600">No application process listed.</p>
              )}
            </div>

            {scheme.learnMoreUrl && (
              <a
                href={scheme.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Visit Official Link <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
