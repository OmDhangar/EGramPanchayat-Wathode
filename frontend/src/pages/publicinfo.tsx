import React from "react";
import { useTranslation } from "react-i18next";

const GovernmentLinks = () => {
  const { t } = useTranslation();

  const importantLinks = [
    {
      name: t("govLinks.maharashtraGovt.name"),
      description: t("govLinks.maharashtraGovt.description"),
      url: "https://maharashtra.gov.in",
      category: "state",
      icon: "🏛️",
      image: "/images/download.webp",
      bgColor: "bg-blue-50"
    },
    {
      name: t("govLinks.govtDecisions.name"),
      description: t("govLinks.govtDecisions.description"),
      url: "https://gr.maharashtra.gov.in/1145/Government-Resolutions",
      category: "state",
      icon: "📋",
      image: "/images/shasan.png",
      bgColor: "bg-blue-50"
    },
    {
      name: t("govLinks.tenderPortal.name"),
      description: t("govLinks.tenderPortal.description"),
      url: "https://mahatenders.gov.in/nicgep/app",
      category: "tenders",
      icon: "📑",
      image: "/images/procurement.png",
      bgColor: "bg-purple-50"
    },
    {
      name: t("govLinks.gem.name"),
      description: t("govLinks.gem.description"),
      url: "https://gem.gov.in",
      category: "commerce",
      icon: "🛒",
      image: "/images/procurement.webp",
      bgColor: "bg-teal-50"
    },
    {
      name: t("govLinks.ruralDevelopment.name"),
      description: t("govLinks.ruralDevelopment.description"),
      url: "https://rural.gov.in",
      category: "central",
      icon: "🇮🇳",
      image: "/images/14.jpg",
      bgColor: "bg-green-50"
    },
    {
      name: t("govLinks.gpdp.name"),
      description: t("govLinks.gpdp.description"),
      url: "https://gpdp.nic.in",
      category: "panchayat",
      icon: "📊",
      image: "/images/th.webp",
      bgColor: "bg-orange-50"
    },
    {
      name: t("govLinks.villageMapping.name"),
      description: t("govLinks.villageMapping.description"),
      url: "https://grammanchitra.gov.in/gm4MVC",
      category: "maps",
      icon: "🗺️",
      image: "/images/mapping.png",
      bgColor: "bg-indigo-50"
    },
    {
      name: t("govLinks.landRecords.name"),
      description: t("govLinks.landRecords.description"),
      url: "https://bhumiabhilekh.maharashtra.gov.in",
      category: "revenue",
      icon: "🏠",
      image: "/images/Bhumi.webp",
      bgColor: "bg-amber-50"
    }
  ];

  const categories = {
    state: { 
      label: t("govLinks.categories.state"), 
      color: "bg-blue-100 border-blue-300 text-blue-800" 
    },
    central: { 
      label: t("govLinks.categories.central"), 
      color: "bg-green-100 border-green-300 text-green-800" 
    },
    panchayat: { 
      label: t("govLinks.categories.panchayat"), 
      color: "bg-orange-100 border-orange-300 text-orange-800" 
    },
    tenders: { 
      label: t("govLinks.categories.tenders"), 
      color: "bg-purple-100 border-purple-300 text-purple-800" 
    },
    commerce: { 
      label: t("govLinks.categories.commerce"), 
      color: "bg-teal-100 border-teal-300 text-teal-800" 
    },
    maps: { 
      label: t("govLinks.categories.maps"), 
      color: "bg-indigo-100 border-indigo-300 text-indigo-800" 
    },
    revenue: { 
      label: t("govLinks.categories.revenue"), 
      color: "bg-amber-100 border-amber-300 text-amber-800" 
    }
  };

  const getCategoryColor = (category: keyof typeof categories) => categories[category] || categories.state;

  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            {t("govLinks.header.title")}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t("govLinks.header.subtitle")}
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-700">{importantLinks.length}</div>
            <div className="text-sm text-gray-600">{t("govLinks.stats.totalLinks")}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-700">{t("govLinks.stats.govtDepartments")}</div>
            <div className="text-sm text-gray-600">{t("govLinks.stats.departments")}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-700">{t("govLinks.stats.centralGovt")}</div>
            <div className="text-sm text-gray-600">{t("govLinks.stats.central")}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-l-4 border-purple-500">
            <div className="text-2xl font-bold text-purple-700">{t("govLinks.stats.onlineServices")}</div>
            <div className="text-sm text-gray-600">{t("govLinks.stats.services")}</div>
          </div>
        </div>

        {/* Image-based Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {importantLinks.map((link: any, index: any) => {
            const category = getCategoryColor(link.category);
            return (
              <div
                key={index}
                onClick={() => handleCardClick(link.url)}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-${category.color.split('-')[1]}-300 hover:transform hover:-translate-y-2 cursor-pointer group overflow-hidden`}
              >
                {/* Image Section */}
                <div className="h-32 relative overflow-hidden">
                  {/* Background Image */}
                  <img 
                    src={link.image} 
                    alt={link.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-3 right-3 text-2xl bg-white/80 rounded-full p-1">
                    {link.icon}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${category.color} backdrop-blur-sm`}>
                      {category.label}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-700 transition-colors">
                    {link.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {link.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 text-sm font-medium group-hover:text-green-800 transition-colors">
                      {t("govLinks.clickHere")}
                    </span>
                    <svg 
                      className="w-4 h-4 text-green-600 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            );
          })}
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-green-500 text-2xl mr-3">👆</div>
            <h3 className="text-xl font-bold text-gray-800">
              {t("govLinks.usage.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("govLinks.usage.clickImage.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("govLinks.usage.clickImage.description")}
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("govLinks.usage.colorCode.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("govLinks.usage.colorCode.description")}
              </p>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("govLinks.usage.easySearch.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("govLinks.usage.easySearch.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="text-yellow-500 text-xl mr-3">💡</div>
            <div className="text-center">
              <p className="text-gray-700 font-medium">
                {t("govLinks.footer.title")}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {t("govLinks.footer.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Development Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <span className="text-yellow-500 text-lg mr-2">🚧</span>
            <span className="text-yellow-700 font-medium text-sm">
              {t("govLinks.developmentNotice")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentLinks;