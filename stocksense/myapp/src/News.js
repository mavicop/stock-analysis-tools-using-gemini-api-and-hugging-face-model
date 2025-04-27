import React, { useEffect, useState } from "react";
import axios from "axios";
import "./News.css";

const News = () => {
  const predefinedStockSymbols = ["NIFTY 50", "Sensex", "Indian Stock Market", "Tata Motors"];
  const [stockSymbols, setStockSymbols] = useState(["Indian Stock Market"]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputStock, setInputStock] = useState("");
  const [isValidStock, setIsValidStock] = useState(true);
  const [showError, setShowError] = useState(false); // New state to control error visibility

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const responses = await Promise.all(
          stockSymbols.map(symbol =>
            axios.get("https://newsapi.org/v2/everything", {
              params: {
                q: symbol,
                apiKey: "863c056cded04ea19b435f8834e8aaf5", // Replace with your API key
                language: "en",
                sortBy: "relevancy",
                pageSize: 10, // Fetch detailed news
              },
            })
          )
        );

        const allNews = responses.map(res => res.data.articles);
        setNews(allNews);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (stockSymbols.length > 0) {
      fetchNews();
    }
  }, [stockSymbols]); // Make sure it re-fetches news when stockSymbols changes

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputStock(value);

    // Ensure case-insensitive matching by converting both input and predefined symbols to lowercase
    const matchedStock = predefinedStockSymbols.find(
      (symbol) => symbol.toLowerCase() === value.toLowerCase()
    );

    if (matchedStock) {
      setIsValidStock(true);
    } else {
      setIsValidStock(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set showError to true when user attempts to submit
    setShowError(true);

    // Ensure case-insensitive matching by converting both input and predefined symbols to lowercase
    const matchedStock = predefinedStockSymbols.find(
      (symbol) => symbol.toLowerCase() === inputStock.toLowerCase()
    );

    if (matchedStock) {
      setStockSymbols([matchedStock]); // Set the valid stock symbol and trigger news fetching
      setIsValidStock(true);
      setShowError(false); // Hide the error message if the stock is valid
    } else {
      setIsValidStock(false); // Invalid stock
    }
  };

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="news-container">
      <h1>Latest Stock News</h1>

      {/* Stock input form */}
      <form onSubmit={handleSubmit} className="stock-input-form">
        <input
          type="text"
          value={inputStock}
          onChange={handleInputChange}
          placeholder="Enter Stock Name"
          className={`stock-input ${!isValidStock && showError && inputStock ? 'invalid-input' : ''}`}
        />
        <button type="submit" className="stock-submit">
          Get News
        </button>
      </form>

      {showError && !isValidStock && inputStock && (
        <p className="error-message">Invalid stock name. Please try again.</p>
      )}

      {stockSymbols.map((symbol, index) => (
        <div className="stock-news" key={symbol}>
          <h2>{symbol}</h2>
          <ul>
            {news[index] && news[index].length > 0 ? (
              news[index].map((article, idx) => (
                <li key={idx} className="news-item">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-title"
                  >
                    {article.title}
                  </a>
                  <p className="news-details">
                    <span className="news-source">{article.source.name}</span> -
                    <span className="news-date">
                      {new Date(article.publishedAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="news-description">
                    {article.description || "No description available."}
                  </p>
                </li>
              ))
            ) : (
              <li>No news articles found for {symbol}.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default News;
