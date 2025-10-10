import { Helmet } from "react-helmet";

const AboutGramPanchayat = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 font-[Tiro Devanagari Marathi]">
      <Helmet>
        <title>About Gram Panchayat - Grampanchayat Wathode</title>
        <meta name="description" content="Gram Panchayat Wathode team and administration information." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8 text-yellow-800 tiro-header text-center">
        वाठोडे ग्रामपंचायत
      </h1>
      
      {/* GPTEAM Image - Centered with big size */}
      <div className="flex justify-center items-center my-8">
        <img 
          src="/images/gpteam.png" 
          alt="वाठोडे ग्रामपंचायत संघटना"
          className="max-w-full h-auto rounded-lg"
          style={{ maxWidth: '800px', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default AboutGramPanchayat;