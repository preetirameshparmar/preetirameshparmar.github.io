import React, { useState, useEffect } from 'react';

const Skills = () => {
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState({});

  useEffect(() => {
    fetch('/skills.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/\[Title\]\n(.*?)\n\n/);
        const contentMatch = text.match(/\[Content\]\n(.*)/s);
        if (titleMatch) setTitle(titleMatch[1]);
        if (contentMatch) {
          const lines = contentMatch[1].split('\n').filter(line => line.trim() !== '');
          const parsedSkills = lines.reduce((acc, line) => {
            const [key, value] = line.split(': ');
            acc[key.trim()] = value.trim().split(', ');
            return acc;
          }, {});
          setSkills(parsedSkills);
        }
      });
  }, []);

  return (
    <section id="skills">
      <h2>{title}</h2>
      {Object.entries(skills).map(([category, skillList], index) => (
        <div key={index}>
          <h3>{category}</h3>
          <ul>
            {skillList.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Skills;