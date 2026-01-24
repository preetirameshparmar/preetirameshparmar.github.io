import React, { useState, useEffect } from 'react';
import './WebLinks.css';

const WebLinks = ({ data }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (data?.raw) {
      const lines = data.raw.split('\n').filter(line => line.trim() !== '');
      const parsedLinks = lines.map(line => {
        const [name, url] = line.split(' - ');
        let iconClass = '';
        if (name && name.toLowerCase().includes('linkedin')) {
          iconClass = 'fab fa-linkedin';
        } else if (name && name.toLowerCase().includes('github')) {
          iconClass = 'fab fa-github';
        } else if (name && name.toLowerCase().includes('portfolio')) {
          iconClass = 'fas fa-globe';
        }
        return { name, url, iconClass };
      });
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