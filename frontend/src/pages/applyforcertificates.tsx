import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBaby, FaSkull, FaHeart, FaSpinner } from "react-icons/fa";
import { Variants } from "framer-motion";
import axios from "axios";

type CertificateType = "birth" | "death" | "marriage";

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  applicationId?: string;
}

interface FormData {
  [key: string]: any;
}

const certificateLabels: Record<CertificateType, { label: string; icon: React.ReactNode; color: string }> = {
  birth: {
    label: "जन्म प्रमाणपत्र",
    icon: <FaBaby className="text-blue-400" size={28} />,
    color: "from-blue-100 to-blue-50",
  },
  death: {
    label: "मृत्यू प्रमाणपत्र ",
    icon: <FaSkull className="text-red-400" size={28} />,
    color: "from-red-100 to-red-50",
  },
  marriage: {
    label: "विवाह प्रमाणपत्र ",
    icon: <FaHeart className="text-pink-400" size={28} />,
    color: "from-pink-100 to-pink-50",
  },
};

// Dummy admin check (replace with real auth logic)
const isAdmin = false; // Set to true for admin

const formVariants: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } },
  exit: { opacity: 0, y: -40, scale: 0.97, transition: { duration: 0.3 } },
};

const FormsPage = () => {
  const [selected, setSelected] = useState<CertificateType>("birth");
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Map frontend data to backend format
  const mapFormData = (type: CertificateType, data: FormData) => {
    switch (type) {
      case "birth":
        return {
          childName: data.childName,
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth,
          gender: data.gender || "Male",
          fatherName: data.fatherName,
          motherName: data.motherName,
          motherAdharNumber: data.motherAdharNumber,
          fatherAdharNumber: data.fatherAdharNumber,
          parentsAddressAtBirth: data.parentsAddressAtBirth,
          permanentAddressParent: data.permanentAddressParent,
          fatherOccupation: data.fatherOccupation,
          motherOccupation: data.motherOccupation,
          hospitalName: data.hospitalName
        };
      case "death":
        return {
          deceasedName: data.deceasedName,
          dateOfDeath: data.dateOfDeath,
          placeOfDeath: data.placeOfDeath,
          age: parseInt(data.age),
          gender: data.gender,
          causeOfDeath: data.causeOfDeath || "Natural",
          fatherName: data.fatherName,
          motherName: data.motherName,
          spouseName: data.spouseName,
          spouseAdhar: data.spouseAdhar,
          fatherAdhar: data.fatherAdhar,
          motherAdhar: data.motherAdhar,
          addressOfDeath:data.addressOfDeath,
          permanentAddress: data.permanentAddress,
          deceasedAdharNumber: data.deceasedAdharNumber
        };
      case "marriage":
        return {
          dateOfMarriage: data.dateOfMarriage,
          placeOfMarriage: data.placeOfMarriage,
          HusbandName: data.HusbandName,
          HusbandAge: parseInt(data.HusbandAge),
          HusbandFatherName: data.HusbandFatherName,
          HusbandAddress: data.HusbandAddress,
          HusbandOccupation: data.HusbandOccupation,
          wifeName: data.wifeName,
          wifeAge: parseInt(data.wifeAge),
          wifeFatherName: data.wifeFatherName,
          wifeAddress: data.wifeAddress,
          wifeOccupation: data.wifeOccupation,
          SolemnizedOn: data.SolemnizedOn || "As per religious customs"
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const mappedData = mapFormData(selected, formData);
      console.log(mappedData);
      
      const response = await axios.post(
        `http://localhost:8000/api/v1/applications/${selected}-certificate`,
          formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json', // optional but recommended
          },
        }
      );


      const result: ApiResponse = await response.data;

      if (result.success) {
        setSubmitted(true);
      console.log(result.applicationId);
      } else {
        setError(result.message || "Submission failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handlePayment = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`/api/applications/${applicationId}/payment`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });

  //     const result = await response.data;

  //     if (result.success) {
  //       setPaid(true);
  //     } else {
  //       setError(result.message || "Payment failed");
  //     }
  //   } catch (err) {
  //     setError("Payment failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderForm = () => {
    switch (selected) {
      case "birth":
        return (
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
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">बालकाचे नाव:</label>
              <input name="childName" placeholder="Child's Name" onChange={handleInputChange} className="input_field" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">जन्म तारीख:</label>
              <input name="dateOfBirth" type="date" onChange={handleInputChange} className="input_field" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">जन्म ठिकाण:</label>
              <input name="placeOfBirth" placeholder="Place of Birth" onChange={handleInputChange} className="input_field" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">लिंग:</label>
              <select name="gender" onChange={handleInputChange} className="input_field" required>
                <option value="">लिंग निवडा</option>
                <option value="Male">पुरुष</option>
                <option value="Female">स्त्री</option>
                <option value="Other">इतर</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">वडिलांचे पूर्ण नाव:</label>
              <input name="fatherName" placeholder="Father's Name" onChange={handleInputChange} className="input_field" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">आईचे पूर्ण नाव:</label>
              <input name="motherName" placeholder="Mother's Name" onChange={handleInputChange} className="input_field" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">आईचे आधार क्रमांक:</label>
              <input
                type="text"
                name="motherAdharNumber"
                placeholder="Mother's Aadhar Number"
                onChange={handleInputChange}
                className="input_field"
                maxLength={12}
                pattern="\d{12}"
                title="Enter a valid 12-digit Aadhar number"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">वडिलांचे आधार क्रमांक:</label>
              <input
                type="text"
                name="fatherAdharNumber"
                placeholder="Father's Aadhar Number"
                onChange={handleInputChange}
                className="input_field"
                maxLength={12}
                pattern="\d{12}"
                title="Enter a valid 12-digit Aadhar number"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">वडिलांचा व्यवसाय:</label>
              <input
                type="text"
                name="fatherOccupation"
                placeholder="Father's Occupation"
                onChange={handleInputChange}
                className="input_field"
                maxLength={12}
                pattern="\d{12}"
                title="Enter a valid Occupation"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">आईचा व्यवसाय:</label>
              <input
                type="text"
                name="motherOccupation"
                placeholder="Mother's Occupation"
                onChange={handleInputChange}
                className="input_field"
                maxLength={12}
                pattern="\d{12}"
                title="Enter a valid Occupation"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">जन्मलेल्या रुग्णालयाचे नाव:</label>
              <input
                type="text"
                name="hospitalName"
                placeholder="Name of hospital born"
                onChange={handleInputChange}
                className="input_field"
                maxLength={12}
                pattern="\d{12}"
                title="Enter a valid Name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">जन्मावेळी पालकांचा पत्ता:</label>
              <textarea name="parentsAddressAtBirth" placeholder="Parents Address at Birth" onChange={handleInputChange} className="input_field" required />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">पालकांचा कायमचा पत्ता:</label>
              <textarea name="permanentAddressParent" placeholder="Permanent Address" onChange={handleInputChange} className="input_field" required />
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded font-semibold shadow transition flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </motion.form>
        );
      case "death":
        return (
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
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत व्यक्तीचे नाव:</label>
              <input name="deceasedName" placeholder="Full Name of Deceased" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">लिंग:</label>
              <select name="gender" onChange={handleInputChange} className="input_field" required>
                <option value="">लिंग निवडा</option>
                <option value="Male">पुरुष</option>
                <option value="Female">स्त्री</option>
                <option value="Other">इतर</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">आधार क्रमांक:</label>
              <input name="deceasedAdharNumber" placeholder="Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत व्यक्तीचे वय:</label>
              <input name="age" type="number" placeholder="Age" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत्यूचा दिनांक:</label>
              <input name="dateOfDeath" type="date" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत्यूचे ठिकाण:</label>
              <input name="placeOfDeath" placeholder="Place of Death" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत्यूचे कारण:</label>
              <input name="causeOfDeath" placeholder="Cause of Death" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">जोडीदाराचे नाव:</label>
              <input name="spouseName" placeholder="Spouse Name" onChange={handleInputChange} className="input_field" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पती/पत्नीचा आधार क्रमांक:</label>
              <input name="spouseAdhar" placeholder="Spouse Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">आईचे नाव:</label>
              <input name="motherName" placeholder="Mother's Name" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">आईचा आधार क्रमांक:</label>
              <input name="motherAdhar" placeholder="Mother's Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">वडिलांचे नाव:</label>
              <input name="fatherName" placeholder="Father's Name" onChange={handleInputChange} className="input_field" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">वडिलांचा आधार क्रमांक:</label>
              <input name="fatherAdhar" placeholder="Father's Aadhar Number" maxLength={12} pattern="\d{12}" onChange={handleInputChange} className="input_field" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत्युदर्शनाचा पत्ता:</label>
              <textarea name="addressOfDeath" placeholder="Address Of Death" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">मृत व्यक्तीचा कायमचा पत्ता:</label>
              <textarea name="permanentAddress" placeholder="Permanent Address" onChange={handleInputChange} className="input_field" required />
            </div>
            

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white px-6 py-3 rounded font-semibold shadow transition flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </motion.form>
        );
      case "marriage":
        return (
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
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">पतीचे नाव:</label>
              <input name="HusbandName" placeholder="Husband's Name" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पत्नीचे नाव:</label>
              <input name="wifeName" placeholder="Wife's Name" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">लग्नाची दिनांक:</label>
              <input type="date" name="dateOfMarriage" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">लग्नाचे ठिकाण:</label>
              <input name="placeOfMarriage" placeholder="Place of Marriage" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पतीचे वय:</label>
              <input type="number" name="HusbandAge" placeholder="Husband's Age" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पत्नीचे वय:</label>
              <input type="number" name="wifeAge" placeholder="Wife's Age" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पतीच्या वडिलांचे नाव:</label>
              <input name="HusbandFatherName" placeholder="Husband's Father Name" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पत्नीच्या वडिलांचे नाव:</label>
              <input name="wifeFatherName" placeholder="Wife's Father Name" onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पतीचा व्यवसाय:</label>
              <input name="HusbandOccupation" placeholder="Husband's Occupation" onChange={handleInputChange} className="input_field" />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">पत्नीचा व्यवसाय:</label>
              <input name="wifeOccupation" placeholder="Wife's Occupation" onChange={handleInputChange} className="input_field" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">पतीचा पत्ता:</label>
              <textarea name="HusbandAddress" placeholder="Husband's Address " onChange={handleInputChange} className="input_field" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">पत्नीचा पत्ता:</label>
              <textarea name="wifeAddress" placeholder="Wife's Address " onChange={handleInputChange} className="input_field" required />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">विवाह कसा झाला:</label>
              <input name="SolemnizedOn" placeholder="Marriage Solemnized On" onChange={handleInputChange} className="input_field" required />
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-pink-500 text-white px-6 py-3 rounded font-semibold shadow transition flex items-center justify-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </motion.form>
        );
      default:
        return null;
    }
  };

  const resetForm = () => {
    setSelected("birth");
    setFormData({});
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50 py-10 px-2">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-blue-900"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
      >
        Certificate Forms
      </motion.h1>
      
      <motion.div
        className="flex justify-center flex-wrap gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {Object.entries(certificateLabels).map(([key, { label, icon, color }]) => (
          <motion.button
            key={key}
            onClick={() => {
              setSelected(key as CertificateType);
              setSubmitted(false);
              setError("");
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow transition-all duration-300 bg-gradient-to-br ${color} ${
              selected === key ? "scale-105 ring-2 ring-blue-400" : "hover:scale-105"
            }`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
          >
            {icon}
            <span>{label}</span>
          </motion.button>
        ))}
      </motion.div>
      
      <div className="w-full max-w-lg mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {!submitted && (
            <motion.div
              key={selected}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={formVariants}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {renderForm()}
            </motion.div>
          )}
         
          
          {submitted  && (
            <motion.div
              key="download"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={formVariants}
              className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4"
            >
              <p className="mb-4 text-lg">Form Submitted successful!</p>
              <a 
                href={`dashboard`}
                className="text-blue-600 underline font-semibold text-lg block mb-4"
              >
                Redirect to Dashboard to check Status
              </a>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="bg-blue-500 text-white px-6 py-3 rounded font-semibold"
              >
                Submit Another Application
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {isAdmin && (
        <motion.div
          className="mt-8 p-6 border-t bg-white rounded-xl shadow animate-fade-in-up"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="font-semibold mb-2 text-xl">Admin Section</h2>
          <p>Edit certificate templates and manage submissions here.</p>
        </motion.div>
      )}
      
      <style>
        {`
        .input_field {
          width: 100%;
          min-height: 42px;
          padding: 8px 12px;
          border-radius: 8px;
          outline: none;
          border: 1.5px solid #e5e5e5;
          background: #f8fafc;
          font-size: 1rem;
          transition: border 0.2s, box-shadow 0.2s;
          resize: vertical;
        }
        .input_field:focus {
          border: 1.5px solid #115DFC;
          box-shadow: 0px 0px 0px 2px #e3eafe;
          background-color: #f7faff;
        }
        `}
      </style>
    </div>
  );
};

export default FormsPage;