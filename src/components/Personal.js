

import React, { useState, useEffect } from 'react';
import './Personal.css';

const Personal = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', phone: '', email: '' , quote: ''});

  useEffect(() => {
    fetch('/personal.txt')
      .then(response => {
        console.log('Fetch response for personal.txt:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        console.log('Raw text from personal.txt:', text);
        const contentMatch = text.match(/[\[]Content[\]]\n(.*)/s);
        console.log('Content match result:', contentMatch);
        if (contentMatch) {
          const content = contentMatch[1];
          const nameMatch = content.match(/^(.*?)\n/);
          const name = nameMatch ? nameMatch[1].trim() : '';
          const phoneMatch = content.match(/Phone: (.*)/);
          const phone = phoneMatch ? phoneMatch[1].trim() : '';
          const emailMatch = content.match(/Email: (.*)/);
          const email = emailMatch ? emailMatch[1].trim() : '';
          const quoteMatch = content.match(/Quote: (.*)/);
          const quote = quoteMatch ? quoteMatch[1].trim() : '';

          setPersonalInfo({ name, phone, email, quote });
          console.log('Parsed personal info:', { name, phone, email, quote });
        } else {
          console.log('No [Content] section found in personal.txt');
        }
      })
      .catch(error => {
        console.error('Error fetching or parsing personal.txt:', error);
      });
  }, []);

  return (
    <div className="personal-container">
      <div className="personal-image">
        <img src="/logo512.png" alt="Profile" />
      </div>
      <div className="personal-content">
        <h1 className="personal-name">{personalInfo.name}</h1>
        <p className="personal-description">
          {personalInfo.quote}
        </p>
        <div className="personal-contact">
          <a href={`mailto:${personalInfo.email}`} className="contact-button">
            <i className="fas fa-envelope"></i> {personalInfo.email}
          </a>
          <a href={`tel:${personalInfo.phone}`} className="contact-button">
            <i className="fas fa-phone"></i> {personalInfo.phone}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Personal;

