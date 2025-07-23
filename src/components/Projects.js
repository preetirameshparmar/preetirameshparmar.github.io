import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/projects.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/[\[]Title[\]]\n(.*?)\n\n/);
        const orderMatch = text.match(/[\[]Order[\]]\n(.*?)\n\n/);
        const contentMatch = text.match(/[\[]Content[\]]\n(.*)/s);

        const title = titleMatch ? titleMatch[1] : 'Projects';
        const order = orderMatch ? parseInt(orderMatch[1], 10) : Infinity;
        const isVisible = order >= 0;

        if (contentMatch) {
          const entries = contentMatch[1].split(/\n\n(?=Name:)/);
          const parsedEntries = entries.map(entry => {
            const lines = entry.split('\n').filter(line => line.trim() !== '');
            return lines.reduce((acc, line) => {
              const [key, value] = line.split(': ');
              acc[key.trim().toLowerCase().replace(' ', '_')] = value.trim();
              return acc;
            }, {});
          });
          setProjects(parsedEntries);
        }

      });
  }, []);

  return (
    <div className="projects-container">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <h3 className="project-name">{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech-stack">
              {project.tech_stack?.split(', ').map((tech, i) => (
                <span className="tech-item" key={i}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;