import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import CompareStocks from "./CompareStocks";
import AboutUs from "./AboutUs";
import News from "./News";
import Support from "./Support";
import Sentiment from "./Sentiment";
import MainPage from "./MainPage";
import Login from "./Login";
import Registration from "./Registration";
import Profile from "./Profile"; // Import the Profile component
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [ticker, setTicker] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFooter, setShowFooter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Profile");

  const location = useLocation();
  const showHeaderFooterRoutes = ["/", "/news", "/about-us", "/support", "/stock-compare-ai", "/sentiment"];
  const shouldShowHeaderFooter = showHeaderFooterRoutes.includes(location.pathname);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleTickerChange = (e) => {
    setTicker(e.target.value);
  };

  const handleSearch = async (customTicker) => {
    const tickerToSearch = customTicker || ticker;
    if (!tickerToSearch) {
      alert("Please enter a stock ticker");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze_single_stock", { ticker: tickerToSearch });
      if (response.status === 200) {
        setAiAnalysis(response.data.analysis_result);
      } else {
        setError("Unexpected error from backend. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError("Error fetching stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    setUserName("Profile");
  };

  return (
    <div className="app">
      {shouldShowHeaderFooter && (
        <header className="header">
          <nav className="navbar">
            <div className="menu">
              <span className="brand">equitifyAi</span>
              <Link to="/">Home</Link>
              <Link to="/news">News</Link>
              <Link to="/about-us">About Us</Link>
              <div className="dropdown">
                <button className="dropdown-btn" onClick={toggleDropdown}>
                  Tools ▼
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/stock-compare-ai">Stock Compare AI</Link>
                    <Link to="/sentiment">Sentiment Analysis</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-icon" onClick={toggleProfileDropdown}>
                {userName}
              </div>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <Link to="/profile">My Profile</Link>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              )}
            </div>
          </nav>
        </header>
      )}

      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <MainPage
                  ticker={ticker}
                  handleTickerChange={handleTickerChange}
                  handleSearch={handleSearch}
                  aiAnalysis={aiAnalysis}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Registration setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile setUserName={setUserName} />} />
          <Route path="/news" element={<News />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/support" element={<Support />} />
          <Route path="/stock-compare-ai" element={<CompareStocks />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/logout" element={<Navigate to="/login" />} />
        </Routes>
      </div>

      {shouldShowHeaderFooter && (
        <footer className={`footer ${showFooter ? "show-footer" : ""}`}>
          <div className="footer-content">
            <div className="footer-branding">
              <h3>EquitifyAi</h3>
              <p>Empowering your financial decisions with AI-driven insights.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/support">Support</Link>
                </li>
                <li>
                  <Link to="/terms">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>Email: <a href="mailto:contact@equitfyai.com">sanskarmaheshwari062@gmail.com</a></p>
              <p>Phone: <a href="tel:+123456789">+91 7440845844</a></p>
              <p>Address: Cyber City, Raipur (C.G), India</p>
            </div>

            <div className="footer-social">
              <h4>Follow Us</h4>
              <ul className="social-icons">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter to receive the latest updates and insights.</p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EquitifyAi. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;