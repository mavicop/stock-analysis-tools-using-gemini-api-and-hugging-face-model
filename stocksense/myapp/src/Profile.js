
import "./Profile.css";

import React, { useState, useEffect } from "react";

const Profile = ({ setUserName }) => {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [description, setDescription] = useState(localStorage.getItem("userDescription") || "");

  // Handle name change and enforce 10 letters with no spaces
  const handleNameChange = (e) => {
    const value = e.target.value;

    // Remove spaces and limit to 10 letters
    const newValue = value.replace(/\s/g, "").slice(0, 10);
    setName(newValue);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userDescription", description);
    setUserName(name);
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {/* Name section */}
      <div className="profile-info">
        <label>Change Name (Max 10 letters, no spaces):</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
      </div>

      {/* Description section */}
      <div className="profile-info">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter a short description"
          rows="4"
        />
      </div>

      {/* Save button */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Profile;
