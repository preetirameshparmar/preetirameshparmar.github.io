import React, { useState, useEffect } from 'react';

const WorkExperience = () => {
  const [title, setTitle] = useState('');
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetch('/work-experience.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/[\[]Title[\]]\n(.*?)\n\n/);
        const contentMatch = text.match(/[\[]Content[\]]\n(.*)/s);
        if (titleMatch) setTitle(titleMatch[1]);
        if (contentMatch) {
          const entries = contentMatch[1].split(/\n\n(?=Start:)/);
          const parsedEntries = entries.map(entry => {
            const lines = entry.split('\n').filter(line => line.trim() !== '');
            return lines.reduce((acc, line) => {
              const [key, value] = line.split(': ');
              acc[key.trim()] = value.trim();
              return acc;
            }, {});
          });

          parsedEntries.sort((a, b) => new Date(b.Start) - new Date(a.Start));

          setExperiences(parsedEntries);
        }
      });
  }, []);

  return (
    <section id="work-experience">
      <h2>{title}</h2>
      {experiences.map((exp, index) => (
        <div key={index} className="experience-item">
          <h3>{exp['Company Name']}</h3>
          <p><strong>City:</strong> {exp['City']}</p>
          <p><strong>Timeline:</strong> {exp['Start']} - {exp['End']}</p>
          <p>{exp['On Field work']}</p>
        </div>
      ))}
    </section>
  );
};

export default WorkExperience;
