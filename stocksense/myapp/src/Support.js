import React, { useState } from 'react';
import './support.css'; // Make sure to include your CSS file
import emailjs from 'emailjs-com'; // Import EmailJS

const Support = () => {
  // State hooks to manage form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State to handle form submission feedback
  const [status, setStatus] = useState(null); // success or error messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    if (!name || !email || !message) {
      setStatus({ type: 'error', message: 'All fields are required!' });
      return;
    }

    try {
      // Send email using EmailJS
      const templateParams = {
        user_name: name,
        user_email: email,
        message: message,
      };

      const response = await emailjs.send(
        'service_j0m9qgl', // Replace with your service ID
        'template_7eklsdk', // Replace with your template ID
        templateParams,
        '75-g1wcyLrktAqBxt' // Replace with your user ID
      );

      setStatus({ type: 'success', message: 'Your message has been sent successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Error sending your message. Please try again later.' });
    }

    // Clear form after submission
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="support-container">
      <span className="support-title">Contact Us</span>
      <form className="support-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>

      {/* Display status message */}
      {status && (
        <div className={`support-${status.type === 'success' ? 'success' : 'message'}-container`}>
          <p>{status.message}</p>
        </div>
      )}
    </div>
  );
};

export default Support;
