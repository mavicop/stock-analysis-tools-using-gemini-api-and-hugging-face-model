import React, { useState } from "react";
import DOMPurify from "dompurify";

const MainPage = ({
  ticker,
  handleTickerChange,
  handleSearch,
  aiAnalysis,
  loading,
  error,
}) => {
  const [selectedTicker, setSelectedTicker] = useState(null);

  const predefinedTickers = [
    "TCS",
    "INFY",
    "RELIANCE",
    "HDFCBANK",
    "ICICIBANK",
    "SBIN",
    "AXISBANK",
    "WIPRO",
    "BHARTIARTL",
    "ITC",
    "HINDUNILVR",
    "MARUTI",
    "TATAMOTORS",
    "ADANIGREEN",
    "ADANIENT",
    "HDFC",
    "LT",
    "NTPC",
    "POWERGRID",
    "SUNPHARMA",
  ];

  const handlePredefinedTickerClick = (ticker) => {
    setSelectedTicker(ticker); // Highlight clicked ticker
    handleTickerChange({ target: { value: ticker } }); // Update ticker state
    handleSearch(ticker); // Pass the ticker directly to handleSearch
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const renderComparisonResult = () => {
    if (aiAnalysis) {
      const sanitizedResult = DOMPurify.sanitize(
        aiAnalysis.replace(/\*/g, " ").replace(/\n/g, "<br />")
      );
      return <div dangerouslySetInnerHTML={{ __html: sanitizedResult }} />;
    }
    return null;
  };

  return (
    <main className="main">
      <div className="main-content">
        <h4>Your stock Analying Ai Tool for Indian Market</h4>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter Stock Ticker"
            value={ticker}
            onChange={handleTickerChange}
            onKeyPress={handleKeyPress}
            aria-label="Stock Ticker Input"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            aria-label="Search Stock"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        <div className="predefined-tickers">
          <p>Predefined tickers:</p>
          <div className="ticker-list">
            {predefinedTickers.map((preTicker) => (
              <button
                key={preTicker}
                className={`ticker-button ${
                  selectedTicker === preTicker ? "selected" : ""
                }`}
                onClick={() => handlePredefinedTickerClick(preTicker)}
              >
                {preTicker}
              </button>
            ))}
          </div>
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

        {aiAnalysis && !loading && (
          <div className="stock-result">
            <h3>AI Analysis</h3>
            <p>{renderComparisonResult()}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainPage;