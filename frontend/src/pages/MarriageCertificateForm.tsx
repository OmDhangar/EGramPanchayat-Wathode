import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

// Reusable input field component
const InputField = ({ label, name, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      name={name}
      className="input_field w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
      required
      {...props}
    />
  </div>
);

// Reusable textarea field component
const TextareaField = ({ label, name, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <textarea
      name={name}
      className="input_field w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
      required
      {...props}
    />
  </div>
);

// Submit button
const SubmitButton = ({ loading, color = "pink" }) => (
  <button
    type="submit"
    className={`w-full py-2 rounded bg-${color}-600 text-white font-bold hover:bg-${color}-700 transition`}
    disabled={loading}
  >
    {loading ? "सबमिट होत आहे..." : "सबमिट करा"}
  </button>
);

// Framer Motion variants
const formVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.5 } },
};

const MarriageCertificateForm = () => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-8 border-2 border-black max-w-lg mx-auto mt-12 mb-16"
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {!submitted ? (
        <motion.form
          key="marriage"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="flex flex-col items-center gap-2">
            <FaHeart className="text-pink-400 mb-1" size={40} />
            <h2 className="text-xl font-bold text-pink-700">विवाह प्रमाणपत्र अर्ज</h2>
            <span className="text-gray-500 text-sm">कृपया सर्व माहिती भरा</span>
          </div>

          <InputField label="पतीचे नाव:" name="HusbandName" placeholder="पतीचे पूर्ण नाव" onChange={handleInputChange} />
          <InputField label="पत्नीचे नाव:" name="wifeName" placeholder="पत्नीचे पूर्ण नाव" onChange={handleInputChange} />
          <InputField label="लग्नाची दिनांक:" name="dateOfMarriage" type="date" onChange={handleInputChange} />
          <InputField label="लग्नाचे ठिकाण:" name="placeOfMarriage" placeholder="ठिकाण" onChange={handleInputChange} />
          <InputField label="पतीचे वय:" name="HusbandAge" type="number" onChange={handleInputChange} />
          <InputField label="पत्नीचे वय:" name="wifeAge" type="number" onChange={handleInputChange} />
          <InputField label="पतीच्या वडिलांचे नाव:" name="HusbandFatherName" placeholder="पतीच्या वडिलांचे नाव" onChange={handleInputChange} />
          <InputField label="पत्नीच्या वडिलांचे नाव:" name="wifeFatherName" placeholder="पत्नीच्या वडिलांचे नाव" onChange={handleInputChange} />
          <InputField label="पतीचा व्यवसाय:" name="HusbandOccupation" placeholder="पतीचा व्यवसाय" onChange={handleInputChange} />
          <InputField label="पत्नीचा व्यवसाय:" name="wifeOccupation" placeholder="पत्नीचा व्यवसाय" onChange={handleInputChange} />
          <TextareaField label="पतीचा पत्ता:" name="HusbandAddress" placeholder="पतीचा संपूर्ण पत्ता" onChange={handleInputChange} />
          <TextareaField label="पत्नीचा पत्ता:" name="wifeAddress" placeholder="पत्नीचा संपूर्ण पत्ता" onChange={handleInputChange} />
          <InputField label="विवाह कसा झाला:" name="SolemnizedOn" placeholder="उदाहरण: साखरपुडा, मंदिर, कोर्ट मॅरेज" onChange={handleInputChange} />

          <SubmitButton loading={loading} color="pink" />
        </motion.form>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FaHeart className="text-green-500 mb-2" size={48} />
          <h2 className="text-2xl font-bold text-green-700 mb-2">अर्ज यशस्वीपणे सबमिट झाला!</h2>
          <p className="text-gray-700 text-center">आपला विवाह प्रमाणपत्राचा अर्ज प्राप्त झाला आहे.<br />लवकरच प्रक्रिया केली जाईल.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MarriageCertificateForm;
