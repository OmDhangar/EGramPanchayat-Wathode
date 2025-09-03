import React from "react";

const departments = [
  { name: "Revenue Department", description: "Handles land records, taxes, and related services." },
  { name: "Health Department", description: "Provides healthcare facilities and public health programs." },
  { name: "Education Department", description: "Manages schools, scholarships, and educational initiatives." },
  { name: "Water Supply Department", description: "Ensures clean and safe drinking water for all residents." },
  { name: "Sanitation Department", description: "Responsible for cleanliness, waste management, and hygiene." },
  { name: "Agriculture Department", description: "Supports farmers with schemes, seeds, and guidance." },
];

const PublicInfo = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-2xl font-bold text-blue-900 mb-4">Public Information</h1>
    <p className="mb-6 text-yellow-700 font-semibold">
      Various Government Departments Serving the Village
    </p>
    <ul className="mb-8 space-y-4">
      {departments.map((dept, idx) => (
        <li key={idx} className="border-l-4 border-blue-300 pl-4">
          <span className="font-semibold text-blue-800">{dept.name}</span>
          <div className="text-gray-700 text-sm">{dept.description}</div>
        </li>
      ))}
    </ul>
    <div className="mt-10 text-center text-lg text-gray-500 font-semibold italic">
      🚧 This page is under development 🚧
    </div>
  </div>
);

export default PublicInfo;