import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import birthLogo from "../../public/utils/birthlogo.png";
import deathLogo from "../../public/utils/deathlogo.png";
 import marriageLogo from "../../public/utils/marriagelogo.png";

export default function CertificateForms() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "जन्म प्रमाणपत्र",
      points: [
        "बाळाचे पूर्ण नाव",
        "जन्माची तारीख व ठिकाण",
        "पालकांचे नाव व पत्ता",
        "आवश्यक कागदपत्रे: हॉस्पिटल/डॉक्टरचा दाखला, ओळखपत्र",
      ],
      bgColor: "bg-[#5e3d2a]",
      hoverColor: "hover:bg-[#7b5037]",
      route: "/apply-for-certificates/birth-certificate",
      logo: birthLogo,
    },
    {
      title: "मृत्यू प्रमाणपत्र",
      points: [
        "मृत व्यक्तीचे नाव",
        "मृत्यूची तारीख व ठिकाण",
        "नातेवाईकांचे नाव व पत्ता",
        "आवश्यक कागदपत्रे: हॉस्पिटल/डॉक्टरचा दाखला, ओळखपत्र",
      ],
      bgColor: "bg-[#c74f6a]",
      hoverColor: "hover:bg-[#a73f55]",
      route: "/apply-for-certificates/death-certificate",
      logo: deathLogo,
    },
    {
      title: "लग्न प्रमाणपत्र",
      points: [
        "वर वधूचे संपूर्ण नाव",
        "लग्नाची तारीख व ठिकाण",
        "साक्षीदारांची नावे व पत्ते",
        "आवश्यक कागदपत्रे: लग्नाचे फोटो, आधार कार्ड, ओळखपत्र",
      ],
      bgColor: "bg-[#f0c841]",
      hoverColor: "hover:bg-[#e0b52c]",
      route: "/apply-for-certificates/marriage-certificate",
       logo: marriageLogo,
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      className="w-full py-12 px-2 sm:px-8 bg-[#f8fafc] flex flex-col items-center min-h-screen"
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-xl p-6 text-center shadow-lg text-white transition duration-300 ease-in-out ${card.bgColor} ${card.hoverColor}`}
          >
            {card.logo && (
              <img
                src={card.logo}
                alt="Card logo"
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-white p-1"
              />
            )}
            <h2 className="text-xl font-tiro-marathi mb-4">{card.title}</h2>
            <ul className="list-disc list-inside text-white/90 mb-6 space-y-2 text-sm text-left">
              {card.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(card.route)}
              className="bg-white text-black px-4 py-2 text-sm font-tiro-marathi font-bold rounded hover:bg-gray-100"
            >
              ऑनलाइन अर्ज करा
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
