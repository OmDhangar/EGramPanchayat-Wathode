// src/pages/CertificateForms.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBaby, FaSkull, FaHeart, FaFileAlt, FaArrowRight, FaLandmark, FaFileInvoiceDollar, FaFileContract } from "react-icons/fa";
import birthLogo from "../../public/utils/birthlogo.png";
import deathLogo from "../../public/utils/deathlogo.png";
import marriageLogo from "../../public/utils/marriagelogo.png";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export default function CertificateForms() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cards = [
    {
      title: t("certificates.birth.title"),
      subtitle: "जन्म प्रमाणपत्र",
      description: t("certificates.birth.description"),
      points: t("certificates.birth.points", { returnObjects: true }) as string[],
      bgColor: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      route: "/apply-for-certificates/birth-certificate",
      logo: birthLogo,
      iconColor: "text-blue-100"
    },
    {
      title: t("certificates.death.title"),
      subtitle: "मृत्यू प्रमाणपत्र",
      description: t("certificates.death.description"),
      points: t("certificates.death.points", { returnObjects: true }) as string[],
      bgColor: "from-red-500 to-red-600",
      hoverColor: "from-red-600 to-red-700",
      route: "/apply-for-certificates/death-certificate",
      logo: deathLogo,
      iconColor: "text-red-100"
    },
    {
      title: t("certificates.marriage.title"),
      subtitle: "विवाह प्रमाणपत्र",
      description: t("certificates.marriage.description"),
      points: t("certificates.marriage.points", { returnObjects: true }) as string[],
      bgColor: "from-pink-500 to-pink-600",
      hoverColor: "from-pink-600 to-pink-700",
      route: "/apply-for-certificates/marriage-certificate",
      logo: marriageLogo,
      iconColor: "text-pink-100"
    },
    {
      title: t("certificates.landRecord8A.title"),
      subtitle: "८अ भूमि अभिलेख डिजिटल स्वाक्षरी",
      description: t("certificates.landRecord8A.description"),
      points: t("certificates.landRecord8A.points", { returnObjects: true }) as string[],
      bgColor: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      route: "/apply-for-certificates/land-record-8a",
      logo: null,
      iconColor: "text-green-100"
    },
    {
      title: t("certificates.noOutstandingDebts.title"),
      subtitle: "थकबाकी नसल्याचा दाखला",
      description: t("certificates.noOutstandingDebts.description"),
      points: t("certificates.noOutstandingDebts.points", { returnObjects: true }) as string[],
      bgColor: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      route: "/apply-for-certificates/no-outstanding-debts",
      logo: null,
      iconColor: "text-purple-100"
    },
    {
      title: t("certificates.digitalSigned712.title"),
      subtitle: "डिजिटल स्वाक्षरी ७/१२",
      description: t("certificates.digitalSigned712.description"),
      points: t("certificates.digitalSigned712.points", { returnObjects: true }) as string[],
      bgColor: "from-orange-500 to-orange-600",
      hoverColor: "from-orange-600 to-orange-700",
      route: "/apply-for-certificates/digital-signed-712",
      logo: null,
      iconColor: "text-orange-100"
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
    <div className="min-h-screen font-tiro-marathi bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <Helmet>
        <title>Certificate Applications - Grampanchayat Wathode</title>
        <meta name="description" content="Apply online for birth, death, and marriage certificates. Grampanchayat Wathode, Shirpur, Dhule, Maharashtra." />
      </Helmet>
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
            {t("certificates.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("certificates.description")}
          </p>
        </motion.div>

        {/* Certificate Cards Grid */}
        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
              <div
                className={`
                  relative bg-gradient-to-br ${card.bgColor} rounded-xl shadow-lg 
                  overflow-hidden transition-all duration-300 ease-out
                  group-hover:shadow-xl group-hover:${card.hoverColor}
                  max-w-sm mx-auto
                `}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -mr-12 -mt-12"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -ml-8 -mb-8"></div>
                </div>

                {/* Card Content */}
                <div className="relative p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-white mb-1">{card.title}</h2>
                    <p className="text-white/80 text-base font-medium">{card.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-center mb-4 flex-grow text-sm">
                    {card.description}
                  </p>

                  {/* Points List */}
                  <ul className="space-y-2 mb-6">
                    {card.points.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                        className="flex items-start gap-2 text-white/90 text-xs"
                      >
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1 flex-shrink-0"></div>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(card.route)}
                    className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg text-sm font-semibold 
                            hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2
                            group-hover:shadow-md"
                  >
                    {t("certificates.applyNow")}
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </div>
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
                {t("certificates.howItWorks")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("certificates.steps.fillForm.title")}</h4>
                    <p className="text-gray-600 text-sm">{t("certificates.steps.fillForm.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("certificates.steps.uploadDocs.title")}</h4>
                    <p className="text-gray-600 text-sm">{t("certificates.steps.uploadDocs.description")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("certificates.steps.submitTrack.title")}</h4>
                    <p className="text-gray-600 text-sm">{t("certificates.steps.submitTrack.description")}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3">{t("certificates.importantNotes")}</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {(t("certificates.notes", { returnObjects: true }) as string[]).map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
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
            {t("certificates.needHelp")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              {t("certificates.contactSupport")}
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              {t("certificates.viewFAQ")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
