// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Personal from './components/Personal';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import WebLinks from './components/WebLinks';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import ContentManager from './admin/ContentManager';
import BlogManager from './admin/BlogManager';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { backend } from './services/backend';
import './App.css';

function MainSite() {
  const [theme, setTheme] = useState('light');
  // Sections state logic - currently still uses files or backend?
  // Transition: Let's try to load from backend if available, fallback to empty
  const [sections, setSections] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Load sections from Backend now instead of legacy text files
    // But since backend returns generic 'sections' array, we need to map them to components.
    const fetchContent = async () => {
      try {
        const data = await backend.getSections();
        setSections(data);
      } catch (e) {
        console.error("Failed to load sections from DB", e);
      }
    };
    fetchContent();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Component Map
  const componentMap = {
    'personal': Personal,
    'education': Education,
    'experience': WorkExperience,
    'project': Projects,
    'skills': Skills,
    'links': WebLinks
  };

  const personalSection = sections.find(s => s.type === 'personal');

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo">
          <h2>My Portfolio</h2>
        </div>
        <nav className="app-nav">
          <a href="#personal">Home</a>
          {sections.filter(s => s.type !== 'personal' && s.is_visible !== false).map(s => (
            <a key={s.id} href={`#${s.title.toLowerCase().replace(/\s/g, '-')}`}>{s.title}</a>
          ))}
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>
      </header>
      <main>
        {personalSection && (
          <section id="personal">
            <Personal data={personalSection.content} />
          </section>
        )}

        {sections.filter(s => s.type !== 'personal' && s.is_visible !== false).map(section => {
          const Component = componentMap[section.type];
          if (!Component) return null;
          return (
            <section id={section.title.toLowerCase().replace(/\s/g, '-')} key={section.id}>
              <Component data={section.content} />
            </section>
          );
        })}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="sections" element={<ContentManager />} />
                <Route path="blogs" element={<BlogManager />} />
                <Route path="/" element={<Navigate to="sections" />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<MainSite />} />
      </Routes>
    </Router>
  );
}

export default App;
