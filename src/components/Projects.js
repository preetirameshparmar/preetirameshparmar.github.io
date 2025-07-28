import React, { useState, useEffect } from 'react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/projects.txt')
      .then(response => response.text())
      .then(text => {
        const contentMatch = text.match(/\[Content\]\n(.*)/s);


        if (contentMatch) {
          const entries = contentMatch[1].split(/\n\n(?=Name:)/);
          const parsedEntries = entries.map(entry => {
            const lines = entry.split('\n').filter(line => line.trim() !== '');
            const projectData = lines.reduce((acc, line) => {
              const [key, ...valueParts] = line.split(': ');
              if (key && valueParts.length > 0) {
                const value = valueParts.join(': ').trim();
                acc[key.trim().toLowerCase().replace(' ', '_')] = value;
              }
              return acc;
            }, {});
            
            // Parse CTA if available
            if (projectData.cta) {
              const ctaMatch = projectData.cta.match(/^(.*?): (.*)/);
              if (ctaMatch) {
                projectData.ctaLabel = ctaMatch[1].trim();
                projectData.ctaUrl = ctaMatch[2].trim();
              }
            }
            
            return projectData;
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
            {project.image && (
              <div className="project-image">
                <img src={project.image} alt={project.name} onError={(e) => {
                  e.target.src = '/default-project.jpg';
                }} />
              </div>
            )}
            
            {!project.image && (
              <div className="project-image">
                <img src="/default-project.jpg" alt={`${project.name} default`} />
              </div>
            )}
            
            <div className="project-tech-stack">
              {(project.tags || project.tech_stack)?.split(', ').map((tech, i) => (
                <span className="tech-item" key={i}>{tech}</span>
              ))}
            </div>
            
            {project.ctaLabel && project.ctaUrl && (
              <div className="project-cta">
                <a href={project.ctaUrl} className="project-cta-button" target="_blank" rel="noopener noreferrer">
                  {project.ctaLabel}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;