
import React from 'react';
import './Education.css';

const Education = ({ data }) => {
  const educationList = data?.items || [];

  // Legacy fetch removed in favor of DB data passed via props

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
