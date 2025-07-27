import React, { useState, useEffect } from 'react';

const Personal = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState({});

  useEffect(() => {
    fetch('/personal.txt')
      .then(response => response.text())
      .then(text => {
        const titleMatch = text.match(/\[Title\]\n(.*?)\n\n/);
        const contentMatch = text.match(/\[Content\]\n(.*)/s);
        if (titleMatch) setTitle(titleMatch[1]);
        if (contentMatch) {
          const lines = contentMatch[1].split('\n').filter(line => line.trim() !== '');
          const parsedContent = lines.reduce((acc, line) => {
            const [key, value] = line.split(': ');
            if (key && value) {
              acc[key.trim()] = value.trim();
            } else {
              acc['Name'] = key;
            }
            return acc;
          }, {});
          setContent(parsedContent);
        }
      });
  }, []);

  return (
    <section id="personal">
      <h2>{title}</h2>
      <p><strong>Name:</strong> {content['Name']}</p>
      <p><strong>Phone:</strong> {content['Phone']}</p>
      <p><strong>Email:</strong> <a href={`mailto:${content['Email']}`}>{content['Email']}</a></p>
    </section>
  );
};

export default Personal;