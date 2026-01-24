import React, { useState, useEffect } from 'react';
import './WebLinks.css';

const WebLinks = ({ data }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    let rawContent = '';
    if (typeof data === 'string') {
      rawContent = data;
    } else if (data?.raw) {
      rawContent = data.raw;
    }

    if (rawContent) {
      const lines = rawContent.split('\n').filter(line => line.trim() !== '');
      const parsedLinks = lines.map(line => {
        // Handle "Name - URL" or "Name: URL"
        let name, url;
        if (line.includes(' - ')) {
          [name, url] = line.split(' - ');
        } else if (line.includes(': ')) {
          [name, url] = line.split(': ');
        } else {
          return null; // Skip invalid format
        }

        if (!name || !url) return null;

        let iconClass = 'fas fa-link'; // Default icon
        if (name.toLowerCase().includes('linkedin')) {
          iconClass = 'fab fa-linkedin';
        } else if (name.toLowerCase().includes('github')) {
          iconClass = 'fab fa-github';
        } else if (name.toLowerCase().includes('portfolio') || name.toLowerCase().includes('web')) {
          iconClass = 'fas fa-globe';
        }

        return { name, url, iconClass };
      }).filter(Boolean); // Remove nulls
      setLinks(parsedLinks);
    }
  }, [data]);

  return (
    <div className="weblinks-container">
      <h2>Web Profiles</h2>
      <div className="weblinks-grid">
        {links.map((link, index) => (
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="weblink-card" key={index}>
            <i className={`${link.iconClass} weblink-icon`}></i>
            <span className="weblink-name">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default WebLinks;