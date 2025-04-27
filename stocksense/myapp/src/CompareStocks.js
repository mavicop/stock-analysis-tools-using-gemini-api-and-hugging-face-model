import React, { useState } from "react";
import axios from "axios";
import "./CompareStocks.css";

function Compare() {
  const [stock1, setStock1] = useState("");
  const [stock2, setStock2] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null); // To store the comparison result
  const [comparisonPrompt, setComparisonPrompt] = useState(""); // Store comparison prompt
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Track error state

  // Handle changes in stock tickers
  const handleStock1Change = (e) => {
    setStock1(e.target.value);
  };

  const handleStock2Change = (e) => {
    setStock2(e.target.value);
  };

  // Handle the compare button click
  const handleCompareClick = async () => {
    if (!stock1 || !stock2) {
      setError("Please enter both stock tickers to compare.");
      return;
    }

    setError(""); // Reset any previous errors
    setLoading(true); // Start loading state

    try {
      // Request AI analysis for both stocks
      const response = await axios.post("http://127.0.0.1:5000/compare_stocks", {
        stock_a: stock1,  // Send stock tickers as stock_a and stock_b
        stock_b: stock2,
      });

      console.log("API Response:", response.data); // Log the response to debug

      // Check if the response contains the comparison result
      if (response.data.comparison_result) {
        const { comparison_result, comparison_prompt } = response.data;

        // Set state for the comparison result and prompt
        setComparisonResult(comparison_result);
        setComparisonPrompt(comparison_prompt);
      } else {
        setError("Analysis not available for the provided tickers.");
      }
    } catch (error) {
      console.error("Error comparing stocks:", error);
      setError("Error comparing stocks. Please try again.");
    } finally {
      setLoading(false); // Stop loading after the request finishes
    }
  };

  // Function to render the comparison result
  const renderComparisonResult = () => {
    if (comparisonResult) {
      // Format the result: replace "*" with space and handle line breaks
      const formattedResult = comparisonResult
        .replace(/\*/g, " ") // Replace "*" with a space
        .replace(/\n/g, "<br />"); // Replace "\n" with actual line breaks

      return (
        <div className="comparison-results">
          <h3>Comparison Analysis</h3>
          <div className="result-content">
            {/* Use dangerouslySetInnerHTML to render HTML content */}
            <div dangerouslySetInnerHTML={{ __html: formattedResult }} />
          </div>
        </div>
      );
    }

    // If no comparison result is available
    return <p></p>;
  };

  return (
    <div className="compare">
      <h1>Compare Stocks Using AI</h1>
      
      <div className="inputs">
        <input
          type="text"
          placeholder="Enter Stock 1"
          value={stock1}
          onChange={handleStock1Change}
        />
        <input
          type="text"
          placeholder="Enter Stock 2"
          value={stock2}
          onChange={handleStock2Change}
        />
      </div>

      <button
        className="compare-button"
        onClick={handleCompareClick}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Loading..." : "COMPARE"}
      </button>

      {/* Error Handling */}
      {error && <p className="error-message">{error}</p>}

      {/* Displaying the AI analysis comparison result */}
      <div className="result">
        {comparisonPrompt && (
          <div className="comparison-prompt">
            <h2>Comparison Prompt</h2>
            <pre>{comparisonPrompt}</pre>
          </div>
        )}

        {renderComparisonResult()}
      </div>
    </div>
  );
}

export default Compare;
