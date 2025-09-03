import React, { useState } from 'react';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      date: '25 Aug 2025',
      title: 'स्वच्छता मोहीम',
      content: 'ग्रामपंचायत वाठोडे येथे स्वच्छता मोहीम राबविण्यात येणार आहे. सर्व ग्रामस्थांनी यात सहभागी व्हावे व स्वच्छतेच्या कार्यक्रमास यशस्वी करावे.',
      category: 'सार्वजनिक सूचना',
      priority: 'high',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '2 min read',
      url: '/news/swachhta-mission'
    },
    {
      id: 2,
      date: '20 Aug 2025',
      title: 'पाणीपुरवठा योजना देखभाल',
      content: 'पाणीपुरवठा योजनेची देखभाल २७ ऑगस्ट रोजी होईल, कृपया सहकार्य करा. यामुळे दिवसभर पाणीपुरवठा अडकू शकतो.',
      category: 'जनसेवा',
      priority: 'medium',
      isNew: true,
      image: 'https://images.unsplash.com/photo-1570804439973-9a1684665c21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '3 min read',
      url: '/news/water-supply-maintenance'
    },
    {
      id: 3,
      date: '15 Aug 2025',
      title: 'स्वातंत्र्य दिन समारंभ',
      content: 'स्वातंत्र्य दिनानिमित्त गावात ध्वजारोहण कार्यक्रम आयोजित. सकाळी ८ वाजता ग्रामपंचायत कार्यालय येथे कार्यक्रम सुरू होईल.',
      category: 'सण उत्सव',
      priority: 'medium',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1621570366592-2a5c717269c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '4 min read',
      url: '/news/independence-day'
    },
    {
      id: 4,
      date: '10 Aug 2025',
      title: 'कर संग्रह कार्यक्रम',
      content: 'मालमत्ता कर व इतर कर संग्रह करण्यासाठी विशेष कार्यक्रम राबविण्यात येणार आहे. कृपया आपले कर भरण्यासाठी ग्रामपंचायत कार्यालय भेट द्या.',
      category: 'कर संग्रह',
      priority: 'high',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '5 min read',
      url: '/news/tax-collection'
    },
    {
      id: 5,
      date: '5 Aug 2025',
      title: 'नवीन रस्ते दुरुस्ती कार्य',
      content: 'गावातील मुख्य रस्त्याची दुरुस्ती कार्य सुरू होत आहे. यासाठी आवश्यक ती सर्व माहिती ग्रामपंचायत कार्यालयात मिळू शकते.',
      category: 'नियोजन',
      priority: 'medium',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1565043589184-75767e50a24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '3 min read',
      url: '/news/road-repair'
    },
    {
      id: 6,
      date: '1 Aug 2025',
      title: 'शैक्षणिक मेळावा आयोजन',
      content: 'ग्रामपंचायत तर्फे शैक्षणिक मेळाव्याचे आयोजन करण्यात येत आहे. सर्व विद्यार्थ्यांनी यात सहभागी व्हावे.',
      category: 'शिक्षण',
      priority: 'low',
      isNew: false,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      readTime: '4 min read',
      url: '/news/education-fair'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItems, setVisibleItems] = useState(6);

  const categories = [
    { id: 'all', name: 'सर्व' },
    { id: 'सार्वजनिक सूचना', name: 'सार्वजनिक सूचना' },
    { id: 'जनसेवा', name: 'जनसेवा' },
    { id: 'कर संग्रह', name: 'कर संग्रह' },
    { id: 'सण उत्सव', name: 'सण उत्सव' },
    { id: 'नियोजन', name: 'नियोजन' },
    { id: 'शिक्षण', name: 'शिक्षण' }
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesFilter = filter === 'all' || notice.category === filter;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (url) => {
    // In a real application, you would use React Router or similar
    // For this example, we'll just show an alert
    alert(`Redirecting to: ${url}`);
    // window.location.href = url; // Actual redirect in a real app
  };

  const loadMore = () => {
    setVisibleItems(prev => prev + 3);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'सार्वजनिक सूचना': return 'bg-blue-100 text-blue-800';
      case 'जनसेवा': return 'bg-purple-100 text-purple-800';
      case 'कर संग्रह': return 'bg-amber-100 text-amber-800';
      case 'सण उत्सव': return 'bg-pink-100 text-pink-800';
      case 'नियोजन': return 'bg-teal-100 text-teal-800';
      case 'शिक्षण': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 md:mb-4">ग्रामपंचायत सूचना फलक</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            नवीनतम सूचना, बातम्या आणि ग्रामपंचायत कार्यक्रमांची माहिती
          </p>
          <div className="w-20 md:w-24 h-1 bg-blue-600 mx-auto mt-4 md:mt-6"></div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-10">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">श्रेणीनुसार फिल्टर करा</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setFilter(category.id)}
                    className={`px-3 py-1 text-xs md:text-sm rounded-full font-medium transition-all ${filter === category.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">सूचना शोधा</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="सूचना शोधा..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.slice(0, visibleItems).map(notice => (
              <div 
                key={notice.id} 
                className="bg-white rounded-xl md:rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col"
                onClick={() => handleCardClick(notice.url)}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={notice.image} 
                    alt={notice.title}
                    className="w-full h-40 sm:h-36 md:h-44 lg:h-40 xl:h-44 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    {notice.isNew && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        नवीन
                      </span>
                    )}
                  </div>
                  <div className={`absolute top-3 right-3 w-2 h-2 md:w-3 md:h-3 rounded-full ${getPriorityColor(notice.priority)}`}></div>
                </div>
                
                <div className="p-4 md:p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">
                      {notice.date}
                    </span>
                    <span className="text-xs text-gray-500">{notice.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{notice.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3 flex-grow">{notice.content}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-blue-600 text-sm md:text-base font-medium flex items-center">
                      अधिक वाचा
                      <svg className="h-3 w-3 md:h-4 md:w-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                    
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-blue-500 p-1 md:p-2" onClick={(e) => e.stopPropagation()}>
                        <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500 p-1 md:p-2" onClick={(e) => e.stopPropagation()}>
                        <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-xl md:rounded-2xl shadow-md p-6 md:p-8 lg:p-12 text-center">
              <svg className="h-16 w-16 md:h-20 md:w-20 text-gray-400 mx-auto mb-4 md:mb-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-2">कोणतीही सूचना उपलब्ध नाही</h3>
              <p className="text-gray-500 max-w-md mx-auto">निवडलेल्या फिल्टरशी जुळणाऱ्या कोणत्याही सूचना आढळल्या नाहीत. कृपया वेगळा फिल्टर निवडा.</p>
            </div>
          )}
        </div>

        {/* View More Button */}
        {filteredNotices.length > visibleItems && (
          <div className="mt-8 md:mt-12 text-center">
            <button 
              onClick={loadMore}
              className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-lg md:rounded-xl shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg"
            >
              अधिक सूचना पहा
              <svg className="ml-2 -mr-1 h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NoticeBoard;