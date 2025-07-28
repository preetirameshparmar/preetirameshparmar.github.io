

import React, { useState, useEffect } from 'react';
import './Personal.css';

const Personal = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', phone: '', email: '', quote: '', ctaButtons: [] });

  useEffect(() => {
    fetch('/personal.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/\[Content\]\n(.*?)(?=\[CTA\]|$)/s);
        const ctaMatch = text.match(/\[CTA\]\n(.*)/s);
        
        let name = '', phone = '', email = '', quote = '';
        
        if (contentMatch) {
          const content = contentMatch[1];
          const nameMatch = content.match(/Name: (.*)/);
          name = nameMatch ? nameMatch[1].trim() : '';
          const phoneMatch = content.match(/Phone: (.*)/);
          phone = phoneMatch ? phoneMatch[1].trim() : '';
          const emailMatch = content.match(/Email: (.*)/);
          email = emailMatch ? emailMatch[1].trim() : '';
          const quoteMatch = content.match(/Quote: (.*)/);
          quote = quoteMatch ? quoteMatch[1].trim() : '';
        }

        let ctaButtons = [];
        if (ctaMatch) {
          const ctaContent = ctaMatch[1];
          const ctaLines = ctaContent.split('\n').filter(line => line.trim().startsWith('- '));
          ctaButtons = ctaLines.map(line => {
            // Parse format: "- Label - https://linktolabel"
            const match = line.match(/^- (.*?) - (https?:\/\/.*)/);
            if (match) {
              return {
                label: match[1].trim(),
                url: match[2].trim()
              };
            }
            return null;
          }).filter(Boolean);
        }

        setPersonalInfo({ name, phone, email, quote, ctaButtons });
      });
  }, []);

  return (
    <div className="personal-container">
      <div className="personal-image">
        <img src="/profile.png" alt="Profile" />
      </div>
      <div className="personal-content">
        <h1 className="personal-name">I am {personalInfo.name}</h1>
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
        
        {personalInfo.ctaButtons.length > 0 && (
          <div className="personal-cta">
            {personalInfo.ctaButtons.map((cta, index) => (
              <a 
                key={index}
                href={cta.url} 
                className="cta-button"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Personal;

