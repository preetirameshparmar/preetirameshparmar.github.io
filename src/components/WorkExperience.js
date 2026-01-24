import React from 'react';
import './WorkExperience.css';

const WorkExperience = ({ data }) => {
  const experiences = data?.items || [];

  // Legacy fetch removed in favor of DB data passed via props

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