
import React, { useState, useEffect } from 'react';
import './Education.css';

const Education = () => {
  const [educationList, setEducationList] = useState([]);

  useEffect(() => {
    fetch('/education.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/\[Content\]\n(.*)/s);

        if (contentMatch) {
          const content = contentMatch[1];
          
          // Split by lines and process sequentially
          const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
          
          const educationEntries = [];
          let currentEntry = {};
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes(': ')) {
              const [key, value] = line.split(': ');
              const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
              
              // If we encounter a 'Degree' and we already have a current entry, 
              // it means we're starting a new education entry
              if (cleanKey === 'degree' && Object.keys(currentEntry).length > 0) {
                educationEntries.push({ ...currentEntry });
                currentEntry = {};
              }
              
              currentEntry[cleanKey] = value.trim();
            }
          }
          
          // Don't forget to add the last entry
          if (Object.keys(currentEntry).length > 0) {
            educationEntries.push(currentEntry);
          }

          console.log('Parsed education entries:', educationEntries);
          setEducationList(educationEntries);
        }
      })
      .catch(error => {
        console.error('Error fetching education data:', error);
      });
  }, []);

  return (
    <div className="education-container">
      <h2>Education</h2>
      <div className="timeline">
        {educationList.map((edu, index) => (
          <div className="timeline-item" key={index}>
            <div className="education-card">
              <h3 className="degree">{edu.degree}</h3>
              <p className="institution">{edu.institution}</p>
              <p className="education-timeline">
                {edu.start} - {edu.end} | {edu.city}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
