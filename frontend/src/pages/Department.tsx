import { Helmet } from "react-helmet";
import { FaUsers, FaWater, FaBroom } from 'react-icons/fa';
import { useState } from 'react';

// Department Data from PDF
const departments = [
  {
    name: "ग्रामपंचायत सदस्य",
    icon: FaUsers,
    members: [
      { name: "श्री. नारायण कोंडूसिंग चौधरी", position: "सरपंच", ward: "२" },
      { name: "सौ. वंदनाबाई देविदास सावळे", position: "उपसरपंच", ward: "२" },
      { name: "श्री. देविदास बारकू भिल", position: "सदस्य", ward: "१" },
      { name: "सौ. जयश्री नारायण शिरसाठ", position: "सदस्या", ward: "१" },
      { name: "सौ. संगीता प्रकाशसिंग चौधरी", position: "सदस्या", ward: "१" },
      { name: "सौ. सकूबाई भिका भिल", position: "सदस्या", ward: "२" },
      { name: "श्री. संग्राम जयराम भिल", position: "सदस्य", ward: "३" },
      { name: "सौ. भिकूबाई फुलसिंग भil", position: "सदस्या", ward: "३" },
      { name: "सौ. सरलाबाई आसाराम भोई", position: "सदस्या", ward: "३" },
    ],
  },
  {
    name: "ग्रामीण पाणीपुरवठा व स्वच्छता समिती",
    icon: FaWater,
    members: [
        { name: "श्री. नारायण कोंडूसिंग चौधरी", position: "अध्यक्ष" },
        { name: "सौ. वंदनाबाई देविदास सावळे", position: "उपाध्यक्ष" },
        { name: "श्री. देविदास बारकू भिल", position: "सदस्य" },
        { name: "सौ. जयश्री नारायण शिरसाठ", position: "सदस्या" },
        { name: "सौ. संगीता प्रकाशसिंग चौधरी", position: "सदस्या" },
        { name: "सौ. सकूबाई भिका भिल", position: "सदस्या" },
        { name: "श्री. संग्राम जयराम भिल", position: "सदस्य" },
        { name: "सौ. भिकूबाई फुलसिंग भिल", position: "सदस्या" },
        { name: "सौ. सरलाबाई आसाराम भोई", position: "सदस्या" },
        { name: "श्री. एस पी. कोळी", position: "सचिव" },
    ],
  },
  {
    name: "संत गाडगेबाबा ग्राम स्वच्छता अभियान समिती",
    icon: FaBroom,
    members: [
        { name: "श्री. नारायण कोंडूसिंग चौधरी", position: "अध्यक्ष" },
        { name: "सौ. वंदनाबाई देविदास सावळे", position: "उपसरपंच" },
        { name: "सौ. चंद्रकला जगन्नाथ भदाणे", position: "मुख्याध्यापक" },
        { name: "सौ. जयश्री नारायण शिरसाठ", position: "ग्रा पं सदस्या" },
        { name: "सौ. संगीता प्रकाशसिंग चौधरी", position: "ग्रा पं सदस्या" },
        { name: "श्रीमती. कल्पना मच्छिंद्र चौधरी", position: "अंगणवाडी सेविका" },
        { name: "श्री. संग्राम जयराम भिल", position: "ग्रा पं. सदस्य" },
        { name: "श्रीमती प्रतिभा राजेंद्र वाडीले", position: "आशा" },
        { name: "श्रीमती वैशाली आनंदा शिरसाठ", position: "आशा" },
        { name: "श्री. बापु बारकू भिल", position: "पा पु कर्मचारी" },
        { name: "श्री. एस पी. कोळी", position: "सचिव" },
    ],
  },
];

const DepartmentsPage = () => {
  const [activeDept, setActiveDept] = useState(departments[0]);

  return (
    <div className="max-w-6xl mx-auto p-4 font-[Tiro Devanagari Marathi]">
      <Helmet>
        <title>Departments - Grampanchayat Wathode</title>
        <meta name="description" content="List of departments and committees in Grampanchayat Wathode, including members and their roles." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-yellow-800 tiro-header text-center">ग्रामपंचायत वाठोडे - विभाग आणि समित्या</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-900 border-b pb-2">विभाग</h2>
            <ul>
              {departments.map((dept) => (
                <li key={dept.name} className="mb-2">
                  <button
                    onClick={() => setActiveDept(dept)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                      activeDept.name === dept.name
                        ? 'bg-blue-600 text-white shadow'
                        : 'hover:bg-yellow-100 text-gray-700'
                    }`}
                  >
                    <dept.icon className="text-xl" />
                    <span className="font-medium">{dept.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <activeDept.icon className="text-3xl text-blue-700" />
              <h2 className="text-2xl font-bold text-blue-900">{activeDept.name}</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded shadow text-base">
                <thead>
                  <tr className="bg-yellow-100">
                    <th className="py-3 px-4 border-b text-left">अ.क्र.</th>
                    <th className="py-3 px-4 border-b text-left">सभासदाचे नांव</th>
                    <th className="py-3 px-4 border-b text-left">पद</th>
                    {activeDept.name === "ग्रामपंचायत सदस्य" && (
                      <th className="py-3 px-4 border-b text-left">प्रभाग</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {activeDept.members.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{member.name}</td>
                      <td className="py-2 px-4 border-b">{member.position}</td>
                      {activeDept.name === "ग्रामपंचायत सदस्य" && (
                        <td className="py-2 px-4 border-b">{member.ward}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepartmentsPage;