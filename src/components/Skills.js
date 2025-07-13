

import React, { useState, useEffect } from 'react';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState({});

  useEffect(() => {
    fetch('/skills.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/[\[]Content[\]]\n(.*)/s);
        if (contentMatch) {
          const lines = contentMatch[1].split('\n').filter(line => line.trim() !== '');
          const parsedSkills = lines.reduce((acc, line) => {
            const [category, skillList] = line.split(': ');
            if (category && skillList) {
              acc[category.trim()] = skillList.trim().split(', ');
            }
            return acc;
          }, {});
          setSkills(parsedSkills);
        }
      });
  }, []);

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

