import React, { useState, useEffect } from 'react';

const Projects = () => {
  const [title, setTitle] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/projects.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/\[Title\]\n(.*?)\n\n/);
        const contentMatch = text.match(/\[Content\]\n(.*)/s);
        if (titleMatch) setTitle(titleMatch[1]);
        if (contentMatch) {
          const entries = contentMatch[1].split(/\n\n(?=Name:)/);
          const parsedEntries = entries.map(entry => {
            const lines = entry.split('\n').filter(line => line.trim() !== '');
            return lines.reduce((acc, line) => {
              const [key, value] = line.split(': ');
              acc[key.trim()] = value.trim();
              return acc;
            }, {});
          });
          setProjects(parsedEntries);
        }
      });
  }, []);

  return (
    <section id="projects">
      <h2>{title}</h2>
      {projects.map((project, index) => (
        <div key={index} className="project-item">
          <h3>{project['Name']}</h3>
          <p><strong>Tech Stack:</strong> {project['Tech Stack']}</p>
          <p>{project['Description']}</p>
        </div>
      ))}
    </section>
  );
};

export default Projects;