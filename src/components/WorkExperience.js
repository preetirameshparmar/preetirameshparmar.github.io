import React, { useState, useEffect } from 'react';
import './WorkExperience.css';

const WorkExperience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch('/work-experience.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/\[Content\]\n(.*)/s);


        if (contentMatch) {
          const entries = contentMatch[1].split(/\n\n(?=Start:)/);
          const parsedEntries = entries.map(entry => {
            const lines = entry.split('\n').filter(line => line.trim() !== '');
            const workEntry = {};
            let currentField = null;
            
            lines.forEach(line => {
              if (line.includes(': ') && !line.startsWith('•') && !line.startsWith('• ')) {
                const [key, ...valueParts] = line.split(': ');
                const value = valueParts.join(': ').trim();
                const fieldKey = key.trim().toLowerCase().replace(/\s+/g, '_');
                workEntry[fieldKey] = value;
                currentField = fieldKey;
              } else if (line.trim().toLowerCase() === 'on field work:' || line.trim().toLowerCase() === 'on field work') {
                // Handle "On Field work:" or "On Field work" lines
                currentField = 'on_field_work';
                workEntry[currentField] = '';
              } else if (line.startsWith('•') || line.startsWith('• ')) {
                // This is a bullet point for the current field
                if (currentField === 'on_field_work') {
                  workEntry[currentField] += (workEntry[currentField] ? '\n' : '') + line;
                }
              }
            });
            
            return workEntry;
          });
          
          parsedEntries.sort((a, b) => new Date(b.start) - new Date(a.start));
          setExperiences(parsedEntries);
        }

      });
  }, []);

  return (
    <div className="experience-container">
      <h2>Work Experience</h2>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3 className="company-name">{exp.company_name}</h3>
              <p className="job-duration">{exp.start} - {exp.end} | {exp.city}</p>
              <div className="job-description">
                {exp.on_field_work && exp.on_field_work.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;