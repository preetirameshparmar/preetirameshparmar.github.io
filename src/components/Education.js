

import React, { useState, useEffect } from 'react';
import './Education.css';

const Education = () => {
  const [education, setEducation] = useState({});

  useEffect(() => {
    fetch('/education.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/[Title]\n(.*?)\n\n/);
        const orderMatch = text.match(/[Order]\n(.*?)\n\n/);
        const contentMatch = text.match(/[Content]\n(.*)/s);

        const title = titleMatch ? titleMatch[1] : 'Education';
        const order = orderMatch ? parseInt(orderMatch[1], 10) : Infinity;
        const isVisible = order >= 0;

        if (contentMatch) {
          const lines = contentMatch[1].split('\n').filter(line => line.trim() !== '');
          const parsedEducation = lines.reduce((acc, line) => {
            const [key, value] = line.split(': ');
            if (typeof key === 'string' && typeof value === 'string') {
              acc[key.trim().toLowerCase().replace(/\s+/g, '_')] = value.trim();
            }
            return acc;
          }, {});
          setEducation(parsedEducation);
        }

      });
  }, []);

  return (
    <div className="education-container">
      <h2>Education</h2>
      <div className="education-card">
        <h3 className="degree">{education.degree}</h3>
        <p className="institution">{education.institution}</p>
        <p className="timeline">{education.start} - {education.end} | {education.city}</p>
      </div>
    </div>
  );
};

export default Education;

