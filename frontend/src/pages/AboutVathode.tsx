import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// Marathi labels and data
const populationStats = [
  { name: "एकूण लोकसंख्या", पुरुष: 1053, महिला: 1019 },
  { name: "बालक (0-6 वर्षे)", पुरुष: 143, महिला: 110 },
  { name: "अनुसूचित जाती (SC)", पुरुष: 66, महिला: 62 },
  { name: "अनुसूचित जमाती (ST)", पुरुष: 418, महिला: 411 },
];

const literacyStats = [
  { name: "साक्षर", पुरुष: 752, महिला: 529 },
  { name: "अशिक्षित", पुरुष: 301, महिला: 490 },
];

const genderPie = [
  { name: "पुरुष", value: 1053 },
  { name: "महिला", value: 1019 },
];

const childPie = [
  { name: "बालक (पुरुष)", value: 143 },
  { name: "बालक (महिला)", value: 110 },
];

const castePie = [
  { name: "SC", value: 128 },
  { name: "ST", value: 829 },
  { name: "इतर", value: 2072 - 128 - 829 },
];

const COLORS = ["#2563eb", "#f59e42", "#22c55e", "#eab308", "#f43f5e"];

const nearbyVillages = [
  "अधे", "टांडे", "असली", "अहिल्यापूर", "जैतपूर", "भोरखेडा", "गोडी", "ठळनेर", "महादेव डोंडवडे", "मलापूर", "टोंडे"
];

const AboutVathode = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 font-[Tiro Devanagari Marathi]">
      <h1 className="text-3xl font-bold mb-4 text-yellow-800 tiro-header">वाठोडे गावाची माहिती</h1>
      <p className="mb-4 text-gray-700 text-lg">
        <b>वाठोडे</b> हे महाराष्ट्रातील धुळे जिल्ह्यातील शिरपूर तालुक्यातील एक गाव आहे. हे गाव शिरपूरपासून सुमारे १२ किमी आणि जिल्हा मुख्यालय धुळेपासून ६९ किमी अंतरावर आहे. २००९ नुसार, वाठोडे हे स्वतःचे ग्रामपंचायत आहे. गावाचा भौगोलिक कोड ५२६०७४ आहे आणि एकूण क्षेत्रफळ २९९.१७ हेक्टर आहे. शिरपूर हे गावाच्या जवळचे प्रमुख आर्थिक केंद्र आहे.
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
        <h2 className="text-xl font-semibold mb-2 text-blue-900">गावातील घरे व मुलांची माहिती</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded shadow text-base">
          <thead>
            <tr className="bg-yellow-100">
              <th className="py-2 px-4 border-b">एकूण घरे</th>
              <th className="py-2 px-4 border-b">बालक (0-6)</th>
              <th className="py-2 px-4 border-b">SC</th>
              <th className="py-2 px-4 border-b">ST</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b text-center">४३३</td>
              <td className="py-2 px-4 border-b text-center">२५३</td>
              <td className="py-2 px-4 border-b text-center">१२८</td>
              <td className="py-2 px-4 border-b text-center">८२९</td>
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
              <th className="py-2 px-4 border-b">स्थिती (२०११)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">सार्वजनिक बस सेवा</td>
              <td className="py-2 px-4 border-b">गावी उपलब्ध</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">खाजगी बस सेवा</td>
              <td className="py-2 px-4 border-b">गावी उपलब्ध</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">रेल्वे स्थानक</td>
              <td className="py-2 px-4 border-b">१०+ किमी अंतरावर</td>
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.123456789!2d74.880000!3d21.350000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdedb1c0b0b0b0b%3A0x0!2z4KS44KSC4KSw4KWA4KSo4KWA4KSw4KWA!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
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