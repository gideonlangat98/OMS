import React, { useState } from 'react';

const CompanyNews = ({company_articles}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextNews = () => {
    if (Array.isArray(company_articles) && currentIndex < company_articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousNews = () => {
    if (Array.isArray(company_articles) && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Add a check for company_articles before rendering
  if (!Array.isArray(company_articles) || company_articles.length === 0) {
    return (
      <div className="container mx-auto">
        <h2 className="text- font-bold text-gray-800 mb-6">Company News</h2>
        <p>No news available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-sm font-bold text-gray-800 mb-6">Company News</h2>
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <div
          className="flex gap-4"
          style={{
            transform: `translateX(-${currentIndex * 120}%)`, // Adjust width as needed
            transition: 'transform 0.5s ease',
            display: 'flex',
            flexWrap: 'nowrap',
          }}
        >
          {company_articles.map((company_article) => (
            <div
              key={company_article.id}
              className="bg-gray-100 w-full px-4 pr-8 pl-4 rounded-lg shadow-md" // Adjust width as needed
              style={{
                flex: '0 0 auto',
              }}
            >
              <h3 className="text-sm font-semibold mb-2">{company_article.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{company_article.date}</p>
              <p className="text-gray-800">{company_article.content}</p>
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
          {currentIndex > 0 && (
            <button
              className="p-2 rounded-full text-gray-800 text-xl"
              onClick={handlePreviousNews}
            >
              &larr;
            </button>
          )}
          {currentIndex < company_articles.length - 1 && (
            <button
              className="p-2 rounded-full text-gray-800 text-xl"
              onClick={handleNextNews}
            >
              &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyNews;
