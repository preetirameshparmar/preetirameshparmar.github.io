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
            return lines.reduce((acc, line) => {
              const [key, value] = line.split(': ');
              if (typeof key === 'string' && typeof value === 'string') {
                acc[key.trim().toLowerCase().replace(/\s+/g, '_')] = value.trim();
              }
              return acc;
            }, {});
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
              <p className="job-description">{exp.on_field_work}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;