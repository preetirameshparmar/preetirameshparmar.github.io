import React, { useState, useEffect } from 'react';

const Education = () => {
  const [title, setTitle] = useState('');
  const [education, setEducation] = useState({});

  useEffect(() => {
    fetch('/education.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/\[Title\]\n(.*?)\n\n/);
        const contentMatch = text.match(/\[Content\]\n(.*)/s);
        if (titleMatch) setTitle(titleMatch[1]);
        if (contentMatch) {
          const lines = contentMatch[1].split('\n').filter(line => line.trim() !== '');
          const parsedEducation = lines.reduce((acc, line) => {
            const [key, value] = line.split(': ');
            acc[key.trim()] = value.trim();
            return acc;
          }, {});
          setEducation(parsedEducation);
        }
      });
  }, []);

  return (
    <section id="education">
      <h2>{title}</h2>
      <p><strong>Degree:</strong> {education['Degree']}</p>
      <p><strong>Institution:</strong> {education['Institution']}</p>
      <p><strong>City:</strong> {education['City']}</p>
      <p><strong>Timeline:</strong> {education['Start']} - {education['End']}</p>
    </section>
  );
};

export default Education;