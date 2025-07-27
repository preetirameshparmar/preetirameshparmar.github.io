

import React, { useState, useEffect } from 'react';
import './Personal.css';

const Personal = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', phone: '', email: '' , quote: ''});

  useEffect(() => {
    fetch('/personal.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/[Content]\n(.*)/s);
        if (contentMatch) {
          const content = contentMatch[1];
          const nameMatch = content.match(/Name: (.*?)/);
          console.log("Name Match" + nameMatch);
          const name = nameMatch ? nameMatch[1].trim() : '';
          console.log("Name" + name);
          const phoneMatch = content.match(/Phone: (.*)/);
          console.log("Phone Match" + phoneMatch);
          const phone = phoneMatch ? phoneMatch[1].trim() : '';
          console.log("Phone" + phone);
          const emailMatch = content.match(/Email: (.*)/);
          console.log("Email Match" + emailMatch);
          const email = emailMatch ? emailMatch[1].trim() : '';
          console.log("Email" + email);
          const quoteMatch = content.match(/Quote: (.*)/);
          console.log("Quote Match" + quoteMatch);
          const quote = quoteMatch ? quoteMatch[1].trim() : '';
          console.log("Quote" + quote);

          setPersonalInfo({ name, phone, email, quote });
        }
      });
  }, []);

  return (
    <div className="personal-container">
      <div className="personal-image">
        <img src="/profile.png" alt="Profile" />
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

