
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo">
          <h2>My Portfolio</h2>
        </div>
        <nav className="app-nav">
          <a href="#personal">Home</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#work-experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#web-links">Links</a>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>
      </header>
      <main>
        <section id="personal"><Personal /></section>
        <section id="skills"><Skills /></section>
        <section id="projects"><Projects /></section>
        <section id="work-experience"><WorkExperience /></section>
        <section id="education"><Education /></section>
        <section id="web-links"><WebLinks /></section>
      </main>
    </div>
  );
}

export default App;
