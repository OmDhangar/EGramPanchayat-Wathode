import React from "react";

const helplines = [
  { service: "Gram Panchayat Office", contact: "912563353212" },
  { service: "Sarpanch (Narayan Kondusing Chaudhary)", contact: "8208531941" },
  { service: "Police Station", contact: "100" },
  { service: "Fire Brigade", contact: "101" },
  { service: "Electricity Complaint", contact: "1912" },
];

const Help = () => (
  <div className="max-w-2xl mx-auto p-6">
    <h1 className="text-2xl font-bold text-blue-900 mb-4">Village Helpline Desk</h1>
    <p className="mb-6 text-gray-700">
      For any assistance, please contact the relevant helpline below:
    </p>
    <table className="min-w-full bg-white border border-gray-300 rounded shadow">
      <thead>
        <tr className="bg-blue-100">
          <th className="py-2 px-4 border-b text-left">Service</th>
          <th className="py-2 px-4 border-b text-left">Contact Number</th>
        </tr>
      </thead>
      <tbody>
        {helplines.map((line, idx) => (
          <tr key={idx} className="hover:bg-blue-50">
            <td className="py-2 px-4 border-b">{line.service}</td>
            <td className="py-2 px-4 border-b font-mono">{line.contact}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-8 text-center text-gray-500 text-sm">
      For emergencies, dial <span className="font-bold text-red-600">100</span> (Police) or <span className="font-bold text-red-600">101</span> (Fire).
    </div>
  </div>
);

export default Help;