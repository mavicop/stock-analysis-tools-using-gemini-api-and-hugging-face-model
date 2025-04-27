import React from "react";
import { Link } from "react-router-dom";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="about-us-header">
        <h1>About Us</h1>
        <p>
        At EquityAi, we are redefining the way investors approach the stock market. Our AI-powered Stock Analyzer uses advanced machine learning algorithms to provide in-depth stock analysis, allowing users to gain a clear understanding of potential investments. The power of AI enables precise stock comparisons, helping you identify high-potential stocks and optimize your portfolio with greater accuracy.

In addition to our stock analyzer, we offer a Sentiment-Based Model that analyzes market sentiment based on the latest news and social media trends. This model provides valuable insights into how public sentiment can impact stock movements, giving you a competitive edge in your decision-making process.

Looking forward, we are thrilled to introduce our Upcoming Model for Investors in India, tailored to meet the specific needs of the Indian stock market. This model will provide personalized investment strategies based on local market trends, regulatory factors, and economic data, helping Indian investors make informed decisions in a fast-evolving market.

With EquityAi, we’re committed to providing innovative tools that make stock analysis and risk management easier, more accessible, and more effective for everyone.
        </p>
      </div>

      <div className="contact-section">
        <h2>Contact Us</h2>
        <p>If you have any questions or need support, we're here to help!</p>
        <div className="actions">
          {/* Link to the Support Us page */}
          <Link to="/support" className="support-button">Support</Link>
          <a 
            href="https://console.zerodha.com/verified/63a935a1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="verified-link">
            View Verified P&L
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
