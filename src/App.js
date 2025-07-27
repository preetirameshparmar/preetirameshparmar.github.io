
import React, { useState, useEffect } from 'react';
import Personal from './components/Personal';
import WebLinks from './components/WebLinks';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import './App.css';


function App() {
  const [theme, setTheme] = useState('light');
  const [sections] = useState({
    personal: { id: 'personal', title: 'Home', order: -Infinity, isVisible: true, component: Personal },
    skills: { id: 'skills', title: 'Skills', order: 3, isVisible: true, component: Skills },
    projects: { id: 'projects', title: 'Projects', order: 5, isVisible: true, component: Projects },
    workExperience: { id: 'workExperience', title: 'Experience', order: 2, isVisible: true, component: WorkExperience },
    education: { id: 'education', title: 'Education', order: 1, isVisible: true, component: Education },
    webLinks: { id: 'webLinks', title: 'Web Links', order: 4, isVisible: true, component: WebLinks },
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  const sortedSections = Object.values(sections)
    .filter(sec => sec.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo">
          <h2>My Portfolio</h2>
        </div>
        <nav className="app-nav">
          {sortedSections.map(section => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>
      </header>
      <main>
        <section id="personal"><Personal /></section>
        {sortedSections.map(section => {
          if (section.id === 'personal') return null; // Personal is always first and handled separately
          const Component = section.component;
          return (
            <section id={section.id} key={section.id}>
              <Component />
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default App;
