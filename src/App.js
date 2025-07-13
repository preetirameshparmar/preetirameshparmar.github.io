import React, { useState } from 'react';
import Personal from './components/Personal';
import WebLinks from './components/WebLinks';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="App">
      <header>
        <h1>My Resume</h1>
        <nav>
          <a href="#personal">Personal</a>
          <a href="#web-links">Web</a>
          <a href="#education">Education</a>
          <a href="#work-experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
        </nav>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <main>
        <Personal />
        <WebLinks />
        <Education />
        <WorkExperience />
        <Projects />
        <Skills />
      </main>
    </div>
  );
}

export default App;