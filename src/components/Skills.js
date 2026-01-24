

import React, { useState, useEffect } from 'react';
import './Skills.css';

const Skills = ({ data }) => {
  const [skills, setSkills] = useState({});

  useEffect(() => {
    let rawContent = '';
    if (typeof data === 'string') {
      rawContent = data;
    } else if (data?.raw) {
      rawContent = data.raw;
    }

    if (rawContent) {
      const lines = rawContent.split('\n').filter(line => line.trim() !== '');
      const parsedSkills = lines.reduce((acc, line) => {
        const [category, skillList] = line.split(': ');
        if (category && skillList) {
          acc[category.trim()] = skillList.trim().split(', ');
        }
        return acc;
      }, {});
      setSkills(parsedSkills);
    }
  }, [data]);

  return (
    <div className="skills-container">
      <h2>Skills</h2>
      <div className="skills-grid">
        {Object.entries(skills).map(([category, skillList], index) => (
          <div className="skill-card" key={index}>
            <h3 className="skill-category">{category}</h3>
            <div className="skill-list">
              {skillList.map((skill, i) => (
                <span className="skill-item" key={i}>{skill}</span>
              ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;

