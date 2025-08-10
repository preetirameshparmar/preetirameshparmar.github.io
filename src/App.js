
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Personal from './components/Personal';
import WebLinks from './components/WebLinks';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import { initializeGA, trackNavigation, trackThemeToggle } from './utils/analytics';
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

  // Refs for tracking state
  const scrollTrackingRef = useRef({
    scrolled25: false,
    scrolled50: false,
    scrolled75: false,
    scrolled90: false
  });
  
  const timeTrackingRef = useRef({
    startTime: Date.now(),
    tracked30s: false,
    tracked1min: false,
    tracked2min: false,
    tracked5min: false
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scroll tracking function
  const handleScroll = useCallback(() => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const tracking = scrollTrackingRef.current;
    
    if (scrollPercent >= 25 && !tracking.scrolled25) {
      import('./utils/analytics').then(({ trackScrollDepth }) => trackScrollDepth(25));
      tracking.scrolled25 = true;
    }
    if (scrollPercent >= 50 && !tracking.scrolled50) {
      import('./utils/analytics').then(({ trackScrollDepth }) => trackScrollDepth(50));
      tracking.scrolled50 = true;
    }
    if (scrollPercent >= 75 && !tracking.scrolled75) {
      import('./utils/analytics').then(({ trackScrollDepth }) => trackScrollDepth(75));
      tracking.scrolled75 = true;
    }
    if (scrollPercent >= 90 && !tracking.scrolled90) {
      import('./utils/analytics').then(({ trackScrollDepth }) => trackScrollDepth(90));
      tracking.scrolled90 = true;
    }
  }, []);

  // Time tracking function
  const checkTimeOnSite = useCallback(() => {
    const timeSpent = (Date.now() - timeTrackingRef.current.startTime) / 1000;
    const tracking = timeTrackingRef.current;
    
    if (timeSpent >= 30 && !tracking.tracked30s) {
      import('./utils/analytics').then(({ trackTimeOnSite }) => trackTimeOnSite(30));
      tracking.tracked30s = true;
    }
    if (timeSpent >= 60 && !tracking.tracked1min) {
      import('./utils/analytics').then(({ trackTimeOnSite }) => trackTimeOnSite(60));
      tracking.tracked1min = true;
    }
    if (timeSpent >= 120 && !tracking.tracked2min) {
      import('./utils/analytics').then(({ trackTimeOnSite }) => trackTimeOnSite(120));
      tracking.tracked2min = true;
    }
    if (timeSpent >= 300 && !tracking.tracked5min) {
      import('./utils/analytics').then(({ trackTimeOnSite }) => trackTimeOnSite(300));
      tracking.tracked5min = true;
    }
  }, []);

  // Initialize Google Analytics and tracking
  useEffect(() => {
    initializeGA();
    
    // Set up scroll tracking
    window.addEventListener('scroll', handleScroll);
    
    // Set up time tracking
    const timeInterval = setInterval(checkTimeOnSite, 10000);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, [handleScroll, checkTimeOnSite]);


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
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    trackThemeToggle(newTheme); 
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
            <a 
              key={section.id} 
              href={`#${section.id}`}
              onClick={() => trackNavigation(section.title)}
            >
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
