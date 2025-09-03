// src/pages/CertificateForms.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBaby, FaSkull, FaHeart, FaFileAlt, FaArrowRight } from "react-icons/fa";
import birthLogo from "../../public/utils/birthlogo.png";
import deathLogo from "../../public/utils/deathlogo.png";
import marriageLogo from "../../public/utils/marriagelogo.png";

export default function CertificateForms() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Birth Certificate",
      subtitle: "जन्म प्रमाणपत्र",
      description: "Apply for a birth certificate for newborns or children",
      points: [
        "Child's full name and details",
        "Date and place of birth",
        "Parents' information and address",
        "Required documents: Hospital certificate, ID proof"
      ],
      bgColor: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      route: "/apply-for-certificates/birth-certificate",
      logo: birthLogo,
      icon: FaBaby,
      iconColor: "text-blue-100"
    },
    {
      title: "Death Certificate",
      subtitle: "मृत्यू प्रमाणपत्र",
      description: "Apply for a death certificate for deceased persons",
      points: [
        "Deceased person's details",
        "Date and place of death",
        "Family member information",
        "Required documents: Medical certificate, ID proof"
      ],
      bgColor: "from-red-500 to-red-600",
      hoverColor: "from-red-600 to-red-700",
      route: "/apply-for-certificates/death-certificate",
      logo: deathLogo,
      icon: FaSkull,
      iconColor: "text-red-100"
    },
    {
      title: "Marriage Certificate",
      subtitle: "विवाह प्रमाणपत्र",
      description: "Apply for a marriage certificate for newlyweds",
      points: [
        "Bride and groom details",
        "Date and place of marriage",
        "Witness information",
        "Required documents: Wedding photos, ID proof"
      ],
      bgColor: "from-pink-500 to-pink-600",
      hoverColor: "from-pink-600 to-pink-700",
      route: "/apply-for-certificates/marriage-certificate",
      logo: marriageLogo,
      icon: FaHeart,
      iconColor: "text-pink-100"
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut" as const,
      },
    }),
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <FaFileAlt className="text-4xl text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Certificate Applications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the type of certificate you need and complete the online application form. 
            Our streamlined process makes it easy to apply for government certificates.
          </p>
        </motion.div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="group relative"
            >
              <div className={`
                relative h-full bg-gradient-to-br ${card.bgColor} rounded-2xl shadow-xl 
                overflow-hidden transition-all duration-300 ease-out
                group-hover:shadow-2xl group-hover:${card.hoverColor}
              `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                </div>

                {/* Card Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                      <card.icon className={`text-3xl ${card.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{card.title}</h2>
                    <p className="text-white/80 text-lg font-medium">{card.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-center mb-6 flex-grow">
                    {card.description}
                  </p>

                  {/* Points List */}
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {card.points.map((point, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + idx * 0.1 }}
                          className="flex items-start gap-3 text-white/90 text-sm"
                        >
                          <div className="w-2 h-2 bg-white/60 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate(card.route); }}
                    className="w-full bg-white text-gray-800 py-4 px-6 rounded-xl font-semibold 
                             hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3
                             group-hover:shadow-lg"
                  >
                    Apply Now
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Fill Application Form</h4>
                    <p className="text-gray-600 text-sm">Complete the online form with all required information</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Upload Documents</h4>
                    <p className="text-gray-600 text-sm">Upload supporting documents using our secure file upload</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Submit & Track</h4>
                    <p className="text-gray-600 text-sm">Submit your application and track its progress online</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Important Notes:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All fields marked with * are mandatory</li>
                <li>• Maximum 5 documents can be uploaded</li>
                <li>• Supported formats: JPG, PNG, PDF, DOC, DOCX</li>
                <li>• Maximum file size: 10MB per file</li>
                <li>• Applications are processed within 7-10 working days</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Need help with your application?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              Contact Support
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              View FAQ
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
