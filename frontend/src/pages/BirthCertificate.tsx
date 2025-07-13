// BirthCertificate.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBaby } from "react-icons/fa";

// Reusable input field component
const InputField = ({ label, name, ...props }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      name={name}
      className="input_field w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
      className="input_field w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      required
      {...props}
    />
  </div>
);

// Submit button
const SubmitButton = ({ loading, color = "blue" }) => (
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

const BirthCertificateForm = () => {
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
          key="birth"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="flex flex-col items-center gap-2">
            <FaBaby className="text-blue-400 mb-1" size={40} />
            <h2 className="text-xl font-bold text-blue-700">जन्म प्रमाणपत्र अर्ज</h2>
            <span className="text-gray-500 text-sm">कृपया सर्व माहिती भरा</span>
          </div>

          <InputField label="बालकाचे नाव:" name="childName" placeholder="Child's Name" onChange={handleInputChange} />
          <InputField label="जन्म तारीख:" name="dateOfBirth" type="date" onChange={handleInputChange} />
          <InputField label="जन्म ठिकाण:" name="placeOfBirth" placeholder="Place of Birth" onChange={handleInputChange} />

          <div>
            <label className="block text-gray-700 font-medium mb-1">लिंग:</label>
            <select name="gender" onChange={handleInputChange} className="input_field w-full border rounded px-3 py-2" required>
              <option value="">लिंग निवडा</option>
              <option value="Male">पुरुष</option>
              <option value="Female">स्त्री</option>
              <option value="Other">इतर</option>
            </select>
          </div>

          <InputField label="वडिलांचे पूर्ण नाव:" name="fatherName" placeholder="Father's Name" onChange={handleInputChange} />
          <InputField label="आईचे पूर्ण नाव:" name="motherName" placeholder="Mother's Name" onChange={handleInputChange} />
          <InputField label="आईचे आधार क्रमांक:" name="motherAdharNumber" maxLength={12} pattern="\d{12}" onChange={handleInputChange} />
          <InputField label="वडिलांचे आधार क्रमांक:" name="fatherAdharNumber" maxLength={12} pattern="\d{12}" onChange={handleInputChange} />
          <InputField label="वडिलांचा व्यवसाय:" name="fatherOccupation" onChange={handleInputChange} />
          <InputField label="आईचा व्यवसाय:" name="motherOccupation" onChange={handleInputChange} />
          <InputField label="जन्मलेल्या रुग्णालयाचे नाव:" name="hospitalName" onChange={handleInputChange} />

          <TextareaField label="जन्मावेळी पालकांचा पत्ता:" name="parentsAddressAtBirth" onChange={handleInputChange} />
          <TextareaField label="पालकांचा कायमचा पत्ता:" name="permanentAddressParent" onChange={handleInputChange} />

          <SubmitButton loading={loading} color="blue" />
        </motion.form>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FaBaby className="text-green-500 mb-2" size={48} />
          <h2 className="text-2xl font-bold text-green-700 mb-2">अर्ज यशस्वीपणे सबमिट झाला!</h2>
          <p className="text-gray-700 text-center">आपला जन्म प्रमाणपत्राचा अर्ज प्राप्त झाला आहे.<br />लवकरच प्रक्रिया केली जाईल.</p>
        </div>
      )}
    </motion.div>
  );
};

export default BirthCertificateForm;