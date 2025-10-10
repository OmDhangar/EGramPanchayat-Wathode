import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Helmet } from "react-helmet";

// Marathi labels and data based on the new image (2011 Census)
const populationStats = [
  { name: "एकूण लोकसंख्या", पुरुष: 1019, महिला: 1053 },
  { name: "बालक (0-6 वर्षे)", पुरुष: 50, महिला: 53 },
  { name: "अनुसूचित जाती (SC)", पुरुष: 62, महिला: 66 },
  { name: " अनुसूचित जमाती (ST)", पुरुष: 411, महिला: 418 },
];

// Calculated from percentages: Male Literate = 1019 * 71.42% = 728, Female Literate = 1053 * 51.91% = 547
const literacyStats = [
  { name: "साक्षर", पुरुष: 728, महिला: 547 },
  { name: "अशिक्षित", पुरुष: 291, महिला: 506 },
];

const genderPie = [
  { name: "पुरुष", value: 1019 },
  { name: "महिला", value: 1053 },
];

const castePie = [
  { name: "SC", value: 128 },
  { name: "ST", value: 829 },
  { name: "इतर", value: 2072 - 128 - 829 }, // 1115
];

const COLORS = ["#2563eb", "#f59e42", "#22c55e", "#eab308", "#f43f5e"];

const nearbyVillages = [
 "जैतपूर", "पिंप्री", "आढे", "अहिल्यापुर", "ताजपुरी"
];

const AboutVathode = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 font-[Tiro Devanagari Marathi]">
      <Helmet>
        <title>About Wathode Village - Grampanchayat Wathode</title>
        <meta name="description" content="Detailed information about Wathode village, including population, literacy, caste structure, and connectivity based on the 2011 census. Grampanchayat Wathode, Shirpur, Dhule, Maharashtra." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4 text-yellow-800 tiro-header">वाठोडे गावाची माहिती</h1>
      <p className="mb-4 text-gray-700 text-lg">
        <b>वाठोडे</b> हे महाराष्ट्रातील धुळे जिल्ह्यातील शिरपूर तालुक्यातील एक गाव आहे. हे गाव शिरपूरपासून सुमारे १२ किमी आणि जिल्हा मुख्यालय धुळेपासून ६९ किमी अंतरावर आहे. <strong>सन २०११ च्या जनगणनेनुसार</strong>, वाठोडे हे स्वतःचे ग्रामपंचायत आहे. गावाचा एकूण लोकसंख्या २०७२ असून एकूण क्षेत्रफळ २९९.१७ हेक्टर आहे. शिरपूर हे गावाच्या जवळचे प्रमुख आर्थिक केंद्र आहे.
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">लोकसंख्या आणि सामाजिक माहिती (२०११)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2 text-blue-700">लोकसंख्या तपशील</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={populationStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={13} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="पुरुष" fill="#2563eb" />
                <Bar dataKey="महिला" fill="#f59e42" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2 text-blue-700">लिंग प्रमाण</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={genderPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {genderPie.map((entry, idx) => (
                    <Cell key={`cell-gender-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Literacy */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2 text-blue-700">साक्षरता</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={literacyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={13} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="पुरुष" fill="#2563eb" />
              <Bar dataKey="महिला" fill="#f59e42" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-gray-700 text-sm">
            <span>एकूण साक्षरता: <b>६१.८२%</b> | पुरुष: <b>७१.४२%</b> | महिला: <b>५१.९१%</b></span>
          </div>
        </div>
        {/* Caste Pie */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2 text-blue-700">जातीय रचना</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={castePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {castePie.map((entry, idx) => (
                  <Cell key={`cell-caste-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">गावातील घरे व इतर माहिती</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded shadow text-base">
          <thead>
            <tr className="bg-yellow-100">
              <th className="py-2 px-4 border-b">तपशील</th>
              <th className="py-2 px-4 border-b">संख्या</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">एकूण कुटुंब संख्या</td>
              <td className="py-2 px-4 border-b text-center">४३३</td>
            </tr>
             <tr>
              <td className="py-2 px-4 border-b">दारिद्र रेषेखालील कुटुंब</td>
              <td className="py-2 px-4 border-b text-center">१५३</td>
            </tr>
             <tr>
              <td className="py-2 px-4 border-b">प्रधानमंत्री आवास योजना प्रतीक्षा यादी</td>
              <td className="py-2 px-4 border-b text-center">२०५</td>
            </tr>
             <tr>
              <td className="py-2 px-4 border-b">प्रधानमंत्री आवास योजना मंजूर घरकुल</td>
              <td className="py-2 px-4 border-b text-center">२००</td>
            </tr>
             <tr>
              <td className="py-2 px-4 border-b">स्वस्त धान्य दुकान</td>
              <td className="py-2 px-4 border-b text-center">१</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">कनेक्टिव्हिटी</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded shadow text-base">
          <thead>
            <tr className="bg-yellow-100">
              <th className="py-2 px-4 border-b">सेवा</th>
              <th className="py-2 px-4 border-b">अंतर</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">तालुका (शिरपूर)</td>
              <td className="py-2 px-4 border-b">१२ कि.मी.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">उपजिल्हा रुग्णालय</td>
              <td className="py-2 px-4 border-b">१२ कि.मी.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">पोलीस ठाणे (थाळनेर)</td>
              <td className="py-2 px-4 border-b">१० कि.मी.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">रेल्वे स्टेशन</td>
              <td className="py-2 px-4 border-b">१८ कि.मी.</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">विमान तळ</td>
              <td className="py-2 px-4 border-b">२९० कि.मी.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">जवळची गावे</h2>
        <ul className="list-disc pl-6 text-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-y-1">
          {nearbyVillages.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-900">Google Map</h2>
        <div className="rounded-xl overflow-hidden shadow border border-gray-300">
          <iframe
            title="Wathode Village Map"
            src="https://maps.google.com/maps?q=Wathode,Shirpur,Dhule&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="text-xs text-gray-500 mt-1">नकाशा डेटा: Google Maps</div>
      </div>
    </div>
  );
};

export default AboutVathode;