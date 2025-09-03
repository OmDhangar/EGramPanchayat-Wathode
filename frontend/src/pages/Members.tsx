import React from "react";
import { ChevronRight } from "lucide-react";

const members = [
  {
    name: "Smt. Sunita Patil",
    designation: "Sarpanch",
    ward: "1",
    mobile: "9876543210",
  },
  {
    name: "Shri. Rajesh Pawar",
    designation: "Deputy Sarpanch",
    ward: "2",
    mobile: "9876543211",
  },
  {
    name: "Smt. Meena Shinde",
    designation: "Member",
    ward: "3",
    mobile: "9876543212",
  },
  {
    name: "Shri. Ganesh More",
    designation: "Member",
    ward: "4",
    mobile: "9876543213",
  },
  {
    name: "Smt. Rekha Patil",
    designation: "Member",
    ward: "5",
    mobile: "9876543214",
  },
  // Add more members as needed
];

const quickLinks = [
  { label: "Panchayat Meetings", href: "/meetings" },
  { label: "Government Schemes", href: "/schemes" },
];

const Members = () => (
  <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-6 text-yellow-800">Gram Panchayat Members</h1>
    <div className="flex flex-col md:flex-row gap-8">
      {/* Quick Links on the left */}
      <div className="min-w-[200px] order-1 md:order-none">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Quick Links</h2>
        <div className="flex flex-col gap-2 border-r-2 border-gray-300 pr-4">
          {quickLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={`flex items-center text-blue-700 rounded group transition
                ${idx % 2 === 0
                  ? "hover:bg-pink-100"
                  : "hover:bg-green-100"
                } px-2 py-2`}
            >
              <span className="mr-2">{link.label}</span>
              <ChevronRight className="h-4 w-4 text-blue-700 group-hover:translate-x-1 transition" />
            </a>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto mb-8 md:mb-0">
        <table className="min-w-full bg-white border border-gray-300 rounded shadow">
          <thead>
            <tr className="bg-yellow-100">
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Designation</th>
              <th className="py-2 px-4 border-b">Ward No.</th>
              <th className="py-2 px-4 border-b">Mobile Number</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr key={idx} className="hover:bg-yellow-50">
                <td className="py-2 px-4 border-b">{member.name}</td>
                <td className="py-2 px-4 border-b">{member.designation}</td>
                <td className="py-2 px-4 border-b text-center">{member.ward}</td>
                <td className="py-2 px-4 border-b">{member.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Members;