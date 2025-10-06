import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FileText, ExternalLink, User, Phone, Mail, Hash, Building, MapPin, Tag, Upload, X, CheckCircle } from 'lucide-react';
import { api } from '../api/axios';

interface TaxationFormData {
  financialYear: string;
  applicantName: string;
  mobileNumber: string;
  email: string;
  taxPayerNumber: string;
  address: string;
  groupName: string;
  groupType: string;
  oldTaxNumber: string;
  newTaxNumber: string;
  utrNumber: string;
}

// Reusable form input component
const FormInput = ({
  icon: Icon,
  label,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  [key: string]: any;
}) => (
  <div>
    <label className="block text-sm font-tiro-marathi text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="w-5 h-5 text-gray-500" />
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
      />
    </div>
  </div>
);

const TaxationInfo: React.FC = () => {
  const [formData, setFormData] = useState<TaxationFormData>({
    financialYear: '',
    applicantName: '',
    mobileNumber: '',
    email: '',
    taxPayerNumber: '',
    address: '',
    groupName: '',
    groupType: '',
    oldTaxNumber: '',
    newTaxNumber: '',
    utrNumber: ''
  });

  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // Replace with your actual URLs and QR image paths
  const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1dRGsuDIzLQh-wepa3CTymR9SPqinuP3m/edit?usp=sharing&ouid=101169031650114830941&rtpof=true&sd=true";

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('पेमेंट रसीद फक्त JPG किंवा PNG फॉरमॅटमध्ये असावी / Payment receipt must be JPG or PNG');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setError('पेमेंट रसीद 5MB पेक्षा कमी असावी / Payment receipt must be less than 5MB');
        return;
      }
      setPaymentReceipt(file);
      setError('');
    }
  };

  const removeReceipt = () => {
    setPaymentReceipt(null);
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setSubmitSuccess(false);
  
  // Validation
  if (!formData.financialYear || !formData.applicantName || !formData.mobileNumber || 
      !formData.taxPayerNumber || !formData.address || !formData.utrNumber) {
      setError('कृपया सर्व आवश्यक फील्ड भरा / Please fill all required fields');
      return;
  }

  if (!/^\d{10}$/.test(formData.mobileNumber)) {
      setError('मोबाईल नंबर 10 अंकी असावा / Mobile number must be 10 digits');
      return;
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('चुकीचा ई-मेल फॉरमॅट / Invalid email format');
      return;
  }

  if (!paymentReceipt) {
      setError('पेमेंट रसीद अपलोड करणे आवश्यक आहे / Payment receipt is required');
      return;
  }

  setIsSubmitting(true);
  
  try {
    const formDataToSend = new FormData();
    
    
    // Append all form fields - FIXED: Convert to string and ensure proper field names
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formDataToSend.append(key, String(value));
      }
    });

    // Append payment receipt - FIXED: Ensure file is properly appended
    if (paymentReceipt) {
      formDataToSend.append('paymentReceipt', paymentReceipt);
    }

    // Append additional documents - FIXED: Use correct field name
    documents.forEach(doc => {
      formDataToSend.append('documents', doc);
    });

    // FIXED: Use correct endpoint and headers
    const response = await api.post('/applications/taxation/submit', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'अर्ज जमा करताना त्रुटी / Submission failed');
    }

    // Success
    setSubmitSuccess(true);
    
    // Reset form
    setFormData({
      financialYear: '',
      applicantName: '',
      mobileNumber: '',
      email: '',
      taxPayerNumber: '',
      address: '',
      groupName: '',
      groupType: '',
      oldTaxNumber: '',
      newTaxNumber: '',
      utrNumber: ''
    });
    setPaymentReceipt(null);
    setDocuments([]);
    
    // Scroll to success message
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err: any) {
    console.error('Submission error:', err);
    setError(err.response?.data?.message || err.message || 'अर्ज जमा करताना त्रुटी झाली / Failed to submit application');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-tiro-marathi font-bold text-gray-800">कर माहिती पोर्टल</h1>
                    </div>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Success Message */}
            {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                        <div>
                            <h3 className="font-tiro-marathi text-green-800 font-bold mb-1">अर्ज यशस्वीरित्या जमा झाला!</h3>
                            <p className="text-green-700 text-sm font-tiro-marathi">
                                तुमचा कर माहिती अर्ज यशस्वीरित्या जमा झाला आहे. तुम्हाला लवकरच अपडेट मिळेल.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm mt-0.5">
                            !
                        </div>
                        <div>
                            <h3 className="font-tiro-marathi text-red-800 font-bold mb-1">त्रुटी</h3>
                            <p className="text-red-700 text-sm font-tiro-marathi">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Notice Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm mt-0.5">
                        !
                    </div>
                    <div>
                        <h3 className="font-tiro-marathi text-blue-800 mb-1">महत्वाची सूचना</h3>
                        <p className="text-red-700 text-sm font-tiro-marathi font-bold">
                            आर्थिक वर्ष 2025-26 साठी कर भरणे अनिवार्य आहे. वेळेवर कर भरून सवलतीचा लाभ घ्या.
                        </p>
                    </div>
                </div>
            </div>

            {/* QR Code Payment Section */}
            <section className="mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-tiro-marathi text-gray-800 mb-2">QR कोड पेमेंट</h2>
                    <p className="text-gray-600 font-tiro-marathi">UPI अॅप (Google Pay, PhonePe, Paytm इ.) द्वारे QR कोड स्कॅन करून कर भरा</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Property Tax QR */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-tiro-marathi text-gray-800 mb-1">घरपट्टी, सॅनिटरी, दिवाबत्ती भरणा साठीचे ग्रामनिधी स्कॅनर</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="./images/gharpattiqr.jpg"
                                alt="Property Tax QR Code"
                                className="w-62 h-62 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const fallback = e.currentTarget.nextSibling;
                                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                                }}
                            />
                            <div className="hidden w-56 h-56 bg-gray-100 rounded-lg items-center justify-center text-gray-400 text-sm text-center">
                                QR Code Not Found
                            </div>
                            <p className="mt-3 text-sm font-tiro-marathi text-gray-500">स्कॅन करून पेमेंट करा</p>
                        </div>
                    </div>

                    {/* Business Tax QR */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-tiro-marathi text-gray-800 mb-1">पाणीपट्टी भरणा साठीचे स्कॅनर</h3>
                        </div>
                        <div className="flex flex-col items-center">
                            <img
                                src="./images/waterqr.jpg"
                                alt="Business Tax QR Code"
                                className="w-62 h-62 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const fallback = e.currentTarget.nextSibling;
                                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                                }}
                            />
                            <div className="hidden w-56 h-56 bg-gray-100 rounded-lg items-center justify-center text-gray-400 text-sm text-center">
                                QR Code Not Found
                            </div>
                            <p className="mt-3 text-sm font-tiro-marathi text-gray-500">स्कॅन करून पेमेंट करा</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Sheet Link */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                            <h3 className="font-tiro-marathi text-gray-800">कर भरणा तपशील</h3>
                            <p className="text-blue-600 text-sm font-tiro-marathi font-bold">(आपले नाव शोधण्यासाठी मोबाइल वर मेनू मध्ये जाऊन "Search" (शोधा) वर क्लिक करून आपले संपूर्ण नाव टाइप करावे व शोधावे)</p>
                        </div>
                    </div>
                    <a
                        href={GOOGLE_SHEET_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-tiro-marathi font-bold transition-colors shadow-sm w-full sm:w-auto justify-center"
                    >
                        अधिक माहिती साठी येथे क्लिक करा
                    </a>
                </div>
            </div>

            {/* Application Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-tiro-marathi font-bold text-gray-800 mb-2">कर माहिती अर्ज</h2>
                    <p className="text-gray-600 font-tiro-marathi">कृपया खालील अर्ज अचूक माहितीसह भरा</p>
                </div>

                <div className="space-y-6">
                    {/* Financial Year */}
                    <FormInput 
                        icon={FileText}
                        label="आर्थिक वर्ष *"
                        name="financialYear"
                        value={formData.financialYear}
                        onChange={handleInputChange}
                        placeholder="उदा. 2025-26"
                        required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput 
                            icon={User} 
                            label="अर्जदाराचे संपूर्ण नाव *" 
                            name="applicantName" 
                            value={formData.applicantName} 
                            onChange={handleInputChange} 
                            placeholder="उदा. रमेश पाटील" 
                            required 
                        />
                        <FormInput 
                            icon={Phone} 
                            label="मोबाईल क्रमांक *" 
                            name="mobileNumber" 
                            value={formData.mobileNumber} 
                            onChange={handleInputChange} 
                            placeholder="उदा. 9876543210" 
                            required 
                            type="tel"
                            maxLength="10"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput 
                            icon={Mail} 
                            label="ई-मेल आयडी" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            placeholder="उदा. user@example.com" 
                            type="email" 
                        />
                        <FormInput 
                            icon={Hash} 
                            label="करदाता क्रमांक *" 
                            name="taxPayerNumber" 
                            value={formData.taxPayerNumber} 
                            onChange={handleInputChange} 
                            placeholder="करदाता क्रमांक टाका" 
                            required 
                        />
                    </div>
                    
                    <FormInput 
                        icon={MapPin} 
                        label="संपूर्ण पत्ता *" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        placeholder="घर क्रमांक, रस्त्याचे नाव, परिसर" 
                        required 
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput 
                            icon={Building} 
                            label="जुना मालमत्ता कर क्रमांक" 
                            name="oldTaxNumber" 
                            value={formData.oldTaxNumber} 
                            onChange={handleInputChange} 
                            placeholder="असल्यास नमूद करा" 
                        />
                        <FormInput 
                            icon={Building} 
                            label="नवीन मालमत्ता कर क्रमांक" 
                            name="newTaxNumber" 
                            value={formData.newTaxNumber} 
                            onChange={handleInputChange} 
                            placeholder="असल्यास नमूद करा" 
                        />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput 
                            icon={Tag} 
                            label="गट नाव" 
                            name="groupName" 
                            value={formData.groupName} 
                            onChange={handleInputChange} 
                            placeholder="गट नाव टाका" 
                        />
                        <FormInput 
                            icon={Tag} 
                            label="गट प्रकार" 
                            name="groupType" 
                            value={formData.groupType} 
                            onChange={handleInputChange} 
                            placeholder="गट प्रकार टाका" 
                        />
                    </div>

                    {/* UTR Number */}
                    <FormInput 
                        icon={Hash}
                        label="UTR क्रमांक *"
                        name="utrNumber"
                        value={formData.utrNumber}
                        onChange={handleInputChange}
                        placeholder="पेमेंट UTR नंबर"
                        required
                    />

                    {/* Payment Receipt Upload */}
                    <div>
                        <label className="block text-sm font-tiro-marathi text-gray-700 mb-2">
                            पेमेंट रसीद अपलोड करा * (JPG/PNG फक्त, कमाल 5MB)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            {!paymentReceipt ? (
                                <label className="flex flex-col items-center cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600 font-tiro-marathi">पेमेंट रसीद अपलोड करण्यासाठी क्लिक करा</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleReceiptChange}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-700">{paymentReceipt.name}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeReceipt}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    
                    
                    {/* Submit Button */}
                    <div className="pt-4 text-center">
                        <p className="text-sm text-gray-500 mb-4 font-tiro-marathi">* चिन्हांकित फील्ड अनिवार्य आहेत.</p>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`w-full sm:w-auto px-8 py-3 rounded-md font-semibold font-tiro-marathi transition-colors flex items-center justify-center gap-2 mx-auto ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-700 hover:bg-blue-800 text-white'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>प्रक्रिया करत आहे...</span>
                                </>
                            ) : (
                                <>
                                    <span>अर्ज जमा करा</span>
                                    <ExternalLink className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-300 text-sm">
                    &copy; {new Date().getFullYear()} कर विभाग, सर्व हक्क राखीव | 
                    Taxation Department, All Rights Reserved
                </p>
            </div>
        </footer>
    </div>
  );
};

export default TaxationInfo;