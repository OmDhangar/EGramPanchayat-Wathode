import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSkull } from "react-icons/fa";

// Reusable input field component
const InputField = ({ label, name, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      name={name}
      className="input_field w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
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
      className="input_field w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
      required
      {...props}
    />
  </div>
);

// Submit button
const SubmitButton = ({ loading, color = "red" }) => (
  <button
    type="submit"
    className={`w-full py-2 rounded bg-${color}-700 text-white font-bold hover:bg-${color}-800 transition`}
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

const DeathCertificateForm = () => {
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
          key="death"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="flex flex-col items-center gap-2">
            <FaSkull className="text-red-400 mb-1" size={40} />
            <h2 className="text-xl font-bold text-red-700">मृत्यू प्रमाणपत्र अर्ज</h2>
            <span className="text-gray-500 text-sm">कृपया सर्व माहिती भरा</span>
          </div>

          <InputField label="मृत व्यक्तीचे नाव:" name="deceasedName" placeholder="मृत व्यक्तीचे नाव" onChange={handleInputChange} />
          <InputField label="मृत्यूची तारीख:" name="dateOfDeath" type="date" onChange={handleInputChange} />
          <InputField label="मृत्यूचे ठिकाण:" name="placeOfDeath" placeholder="मृत्यूचे ठिकाण" onChange={handleInputChange} />
          <InputField label="मृत्यूचे कारण:" name="causeOfDeath" placeholder="मृत्यूचे कारण" onChange={handleInputChange} />
          <InputField label="नातेवाईकाचे नाव:" name="relativeName" placeholder="नातेवाईकाचे नाव" onChange={handleInputChange} />
          <InputField label="नातेवाईकाचा संपर्क क्रमांक:" name="relativeContact" placeholder="संपर्क क्रमांक" onChange={handleInputChange} />
          <TextareaField label="नातेवाईकाचा पत्ता:" name="relativeAddress" onChange={handleInputChange} />
          <InputField label="डॉक्टर/रुग्णालयाचे नाव:" name="hospitalName" placeholder="डॉक्टर/रुग्णालयाचे नाव" onChange={handleInputChange} />

          <SubmitButton loading={loading} color="red" />
        </motion.form>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FaSkull className="text-green-500 mb-2" size={48} />
          <h2 className="text-2xl font-bold text-green-700 mb-2">अर्ज यशस्वीपणे सबमिट झाला!</h2>
          <p className="text-gray-700 text-center">आपला मृत्यू प्रमाणपत्राचा अर्ज प्राप्त झाला आहे.<br />लवकरच प्रक्रिया केली जाईल.</p>
        </div>
      )}
    </motion.div>
  );
};

export default DeathCertificateForm;
