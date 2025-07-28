
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
  const [sections, setSections] = useState({
    personal: { id: 'personal', title: 'Home', order: -Infinity, isVisible: true, component: Personal },
    skills: { id: 'skills', title: 'Skills', order: 4, isVisible: true, component: Skills },
    projects: { id: 'projects', title: 'Projects', order: 5, isVisible: true, component: Projects },
    workExperience: { id: 'workExperience', title: 'Experience', order: 2, isVisible: true, component: WorkExperience },
    education: { id: 'education', title: 'Education', order: 1, isVisible: true, component: Education },
    webLinks: { id: 'webLinks', title: 'Web Links', order: 3, isVisible: true, component: WebLinks },
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load section orders from text files
    const loadSectionOrder = async (filename, sectionId) => {
      try {
        const response = await fetch(`/${filename}.txt`);
        const text = await response.text();
        const titleMatch = text.match(/\[Title\]\n(.*?)\n/);
        const orderMatch = text.match(/\[Order\]\n(.*?)\n/);
        
        const title = titleMatch ? titleMatch[1].trim() : sections[sectionId]?.title;
        const order = orderMatch ? parseInt(orderMatch[1], 10) : sections[sectionId]?.order;
        const isVisible = order >= 0;
        
        setSections(prev => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            title,
            order,
            isVisible
          }
        }));
      } catch (error) {
        console.log(`Could not load ${filename}.txt:`, error);
      }
    };

    // Load all section configurations
    loadSectionOrder('education', 'education');
    loadSectionOrder('work-experience', 'workExperience');
    loadSectionOrder('projects', 'projects');
    loadSectionOrder('skills', 'skills');
    loadSectionOrder('web', 'webLinks');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
