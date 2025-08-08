
import React, { useState, useEffect } from 'react';
import './Personal.css';

const Personal = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', phone: '', email: '', quote: '', ctaButtons: [] });
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

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

  const openResumeModal = () => {
    setIsResumeModalOpen(true);
  };

  const closeResumeModal = () => {
    setIsResumeModalOpen(false);
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/assets/preeti-ramesh-parmar-resume.pdf';
    link.download = 'Preeti_Ramesh_Parmar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isResumeModalOpen) {
        closeResumeModal();
      }
    };

    if (isResumeModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isResumeModalOpen]);

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
        
        <div className="personal-cta">
          {personalInfo.ctaButtons.map((cta, index) => {
            // Replace Portfolio button with Resume button
            if (cta.label.toLowerCase().includes('portfolio')) {
              return (
                <button 
                  key={index}
                  onClick={openResumeModal}
                  className="cta-button resume-button"
                >
                  <i className="fas fa-file-pdf"></i> Resume
                </button>
              );
            }
            
            return (
              <a 
                key={index}
                href={cta.url} 
                className="cta-button"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {cta.label === 'LinkedIn' && <i className="fab fa-linkedin"></i>} {cta.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <div className="resume-modal-overlay" onClick={closeResumeModal}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3 className="resume-modal-title">Resume - Preeti Ramesh Parmar</h3>
              <div className="resume-modal-controls">
                <button 
                  className="resume-modal-control-btn download-btn" 
                  onClick={downloadResume}
                  title="Download Resume"
                >
                  <i className="fas fa-download"></i>
                </button>
                <button 
                  className="resume-modal-control-btn close-btn" 
                  onClick={closeResumeModal}
                  title="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="resume-modal-body">
              <embed 
                src="/assets/preeti-ramesh-parmar-resume.pdf" 
                type="application/pdf"
                width="100%" 
                height="100%"
              />
              <div className="resume-pdf-fallback">
                <div className="fallback-content">
                  <i className="fas fa-file-pdf fallback-icon"></i>
                  <p>PDF cannot be displayed in this browser.</p>
                  <button onClick={downloadResume} className="fallback-download-btn">
                    <i className="fas fa-download"></i> Download Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal;
