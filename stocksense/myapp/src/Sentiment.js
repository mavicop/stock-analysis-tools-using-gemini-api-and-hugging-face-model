import React, { useState } from "react";
import axios from "axios";
import "./Sentiment.css";

const Sentiment = () => {
  const [ticker, setTicker] = useState(""); // State to handle user input for the stock ticker
  const [sentimentResult, setSentimentResult] = useState(null); // State to store the sentiment analysis result
  const [sectorSentiment, setSectorSentiment] = useState(null); // State to store the sentiment for the sector
  const [loading, setLoading] = useState(false); // State to handle loading status
  const [error, setError] = useState(null); // State to handle any errors during the API call

  const sectors = [
    { name: "IT Sector", stocks: ["INFY", "TCS", "WIPRO", "HCLTECH", "TECHM"] },
    { name: "Chemical", stocks: ["GUJGAS", "SRF", "UPL"] },
    { name: "Metals", stocks: ["TATASTEEL", "JSWSTEEL", "HINDALCO"] },
    { name: "Pharmaceuticals", stocks: ["SUNPHARMA", "CIPLA", "DRREDDY"] },
    { name: "Energy", stocks: ["RELIANCE", "ONGC", "NTPC"] },
    { name: "Banking", stocks: ["HDFCBANK", "ICICIBANK", "SBIN"] },
    { name: "Real Estate", stocks: ["DLF", "OBEROIRLTY", "GodrejProperties"] },
    { name: "Automotive", stocks: ["MARUTI", "TATAMOTORS", "BajajAuto"] },
  ];

  const handleSearch = async () => {
    if (!ticker) {
      alert("Please enter a stock ticker");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze_single_stock_sentiment", {
        stock_name: ticker, // Pass the stock ticker in the request body as 'stock_name'
      });

      if (response.status === 200) {
        setSentimentResult(response.data.result); // Set the sentiment result correctly from the response
      } else {
        setError("Unexpected error from backend. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
      setError("Error fetching sentiment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSectorClick = async (sectorName, stocks) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze_sector_sentiment", {
        sector_name: sectorName,
        stocks: stocks,
      });

      if (response.status === 200) {
        setSectorSentiment(response.data.result); // Set the sector sentiment result from the response
      } else {
        setError("Unexpected error from backend. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching sector sentiment:", err);
      setError("Error fetching sector sentiment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSentimentResult = (result) => {
    // Assuming result is an object with keys Negative, Neutral, Overall Sentiment, Positive
    return (
      <div>
        <p><strong>Overall Sentiment:</strong> {result["Overall Sentiment"]}</p>
        <p><strong>Positive Sentiment:</strong> {result["Positive"]}</p>
        <p><strong>Neutral Sentiment:</strong> {result["Neutral"]}</p>
        <p><strong>Negative Sentiment:</strong> {result["Negative"]}</p>
      </div>
    );
  };

  const renderSectorSentiment = (result) => {
    // Assuming result is an object with the same structure
    return (
      <div>
        <p><strong>Overall Sentiment for Sector:</strong> {result["Overall Sentiment"]}</p>
        <p><strong>Positive Sentiment:</strong> {result["Positive"]}</p>
        <p><strong>Neutral Sentiment:</strong> {result["Neutral"]}</p>
        <p><strong>Negative Sentiment:</strong> {result["Negative"]}</p>
      </div>
    );
  };

  return (
    <div className="sentiment-container">
      <div className="search-intro">
        <h2>Analyze Sentiment of Stocks using AI</h2>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Enter Stock Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)} // Handle input change
        />
        <button className="search-button" onClick={handleSearch} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="loading-animation">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {sentimentResult && (
        <div className="sentiment-result">
          <h3>Sentiment Analysis for {ticker}</h3>
          {renderSentimentResult(sentimentResult)}
        </div>
      )}

      <div className="sector-intro">
        <h2>Analyze Overall Sectors</h2>
      </div>

      <div className="sectors">
        {sectors.map((sector, index) => (
          <div
            key={index}
            className="sector-card"
            onClick={() => handleSectorClick(sector.name, sector.stocks)} // Handle click on sector
          >
            {sector.name}
          </div>
        ))}
      </div>

      {sectorSentiment && (
        <div className="sector-sentiment-result">
          <h3>Sentiment Analysis for Sector: {sectorSentiment.sector_name}</h3>
          {renderSectorSentiment(sectorSentiment)}
        </div>
      )}
    </div>
  );
};

export default Sentiment;
