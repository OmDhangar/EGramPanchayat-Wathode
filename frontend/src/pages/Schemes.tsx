import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Filter } from 'lucide-react';
import { schemeYears } from '../data/schemes';
import { Helmet } from "react-helmet";

const categories = [
  { key: 'all', label: 'सर्व योजना', color: 'bg-blue-600 text-white' },
  { key: '2025', label: '2025', color: 'bg-green-600 text-white' },
  { key: '2024', label: '2024', color: 'bg-yellow-500 text-white' },
  { key: '2023', label: '2023', color: 'bg-purple-600 text-white' },
  { key: '2022', label: '2022', color: 'bg-pink-600 text-white' },
];

const Schemes = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter schemes by selected year/category
  const filteredSchemes =
    selectedCategory === 'all'
      ? schemeYears
      : schemeYears.filter((year) => year.year === selectedCategory);

  return (
    <div className="bg-gray-50 py-14 min-h-screen">
      <Helmet>
        <title>शासकीय योजना - ग्रामपंचायत वाठोडे</title>
        <meta name="description" content="ग्रामपंचायत वाठोडे येथे राबविण्यात येणाऱ्या विविध शासकीय योजनांची माहिती. ग्रामपंचायत वाठोडे, शिरपूर, धुळे, महाराष्ट्र." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* शीर्षक */}
        <div className="text-center">
          <h1 className="text-3xl font-tiro-marathi text-blue-900 mb-2">शासकीय योजना</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-4">
            ग्रामीण विकास आणि जीवनमान सुधारण्यासाठी आमच्या ग्रामपंचायतीत राबविण्यात येणाऱ्या विविध शासकीय योजनांचा अभ्यास करा.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-5 py-2 rounded-full font-tiro-marath shadow transition-all duration-200 border-2 border-transparent
                ${selectedCategory === cat.key ? cat.color : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-100'}`}
            >
              {cat.key === 'all' && <Filter className="inline h-4 w-4 mr-1" />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* परिचय */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-tiro-marathi mb-4 text-blue-800">शासकीय योजनांविषयी</h2>
          <p className="text-gray-700 mb-4">
            भारत सरकार आणि राज्य सरकारांनी ग्रामीण समुदायांच्या गरजा लक्षात घेऊन विविध योजना सुरू केल्या आहेत. 
            या योजनांचा मुख्य उद्देश पायाभूत सुविधा विकास, रोजगारवाढ, सामाजिक सुरक्षा आणि ग्रामीण भागाचा एकूणच विकास करणे हा आहे.
          </p>
          <p className="text-gray-700">
            आमची ग्रामपंचायत या योजनांची अंमलबजावणी प्रभावीपणे करते, जेणेकरून त्याचा लाभ पात्र नागरिकांना मिळेल. 
            योजनांची पात्रता, फायदे आणि अर्ज करण्याच्या प्रक्रियेबद्दल अधिक जाणून घेण्यासाठी वर्षनिहाय यादी ब्राउझ करा.
          </p>
        </div>

        {/* वर्षनिहाय योजनांची यादी */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchemes.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              कोणतीही योजना उपलब्ध नाही.
            </div>
          )}
          {filteredSchemes.map((year) => (
            <div
              key={year.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 flex flex-col justify-between border-t-4 border-blue-500"
            >
              <div>
                <div className="flex items-center mb-3">
                  <Calendar className="h-7 w-7 text-blue-600 mr-2" />
                  <h3 className="text-xl font-tiro-marathi text-blue-800">{year.year} च्या योजना</h3>
                </div>
                <p className="text-gray-700 mb-4">{year.description}</p>
              </div>
              <Link
                to={`/schemes/${year.year}`}
                className="mt-4 inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-600 text-white font-tiro-marathi hover:bg-blue-700 transition"
              >
                योजना पहा <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          ))}
        </div>

        {/* अतिरिक्त संसाधने */}
        <div className="bg-blue-50 rounded-xl shadow-md p-6 mt-10">
          <h2 className="text-xl font-tiro-marathi mb-4 text-blue-800">अतिरिक्त संसाधने</h2>
          <p className="text-gray-700 mb-4">
            शासकीय योजनांबद्दल अधिक माहिती मिळवण्यासाठी खालील अधिकृत संकेतस्थळांना भेट द्या:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>
              <a href="https://rural.nic.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                ग्रामीण विकास मंत्रालय
              </a>
            </li>
            <li>
              <a href="https://panchayat.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                पंचायती राज मंत्रालय
              </a>
            </li>
            <li>
              <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                राष्ट्रीय पोर्टल ऑफ इंडिया
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Schemes;
