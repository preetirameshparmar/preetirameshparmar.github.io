import React, { useState, useEffect } from 'react';

const WebLinks = () => {
  const [title, setTitle] = useState('');
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetch('/web.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/["Title"]\n(.*?)\n\n/);
        const contentMatch = text.match(/["Content"]\n(.*)/s);
        if (titleMatch) setTitle(titleMatch[1]);
        if (contentMatch) {
          const lines = contentMatch[1].split('\n').filter(line => line.trim() !== '');
          const parsedLinks = lines.map(line => {
            const [name, url] = line.split(' - ');
            return { name, url };
          });
          setLinks(parsedLinks);
        }
      });
  }, []);

  return (
    <section id="web-links">
      <h2>{title}</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WebLinks;
