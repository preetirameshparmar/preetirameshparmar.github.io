// Google Analytics utilities
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-LE81C3MLMD';

// Debug logging
console.log('GA Tracking ID:', GA_TRACKING_ID);

// Initialize GA
export const initializeGA = () => {
  console.log('Initializing GA with ID:', GA_TRACKING_ID);
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'undefined') {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title,
      page_location: url,
    });
  }
};

// Track events
export const trackEvent = (action, category, label, value) => {
  console.log('Tracking event:', { action, category, label, value });
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });

    console.log('Event sent to GA4');
  } else {
    console.warn('GA4 not available:', { gtag: !!window.gtag, trackingId: GA_TRACKING_ID });
  }
};

// Track project interactions
export const trackProjectView = (projectName) => {
  trackEvent('view_project', 'Projects', projectName);
};

export const trackProjectMediaOpen = (projectName, mediaType) => {
  trackEvent('open_project_media', 'Projects', `${projectName} - ${mediaType}`);
};

export const trackCTAClick = (projectName, ctaLabel) => {
  trackEvent('click_cta', 'Projects', `${projectName} - ${ctaLabel}`);
};

// Track navigation
export const trackNavigation = (section) => {
  trackEvent('navigate', 'Navigation', section);
};

// Track contact interactions
export const trackContact = (method) => {
  trackEvent('contact', 'Contact', method);
};

// Scroll depth tracking
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll', 'Engagement', `${percentage}% scroll`, percentage);
};

// Time on site tracking  
export const trackTimeOnSite = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  trackEvent('time_on_site', 'Engagement', `${minutes} minutes`, seconds);
};

// Resume/CV download tracking
export const trackResumeDownload = (format = 'pdf') => {
  trackEvent('download', 'Resume', `Resume ${format.toUpperCase()}`, 1);
};

// Social media link tracking
export const trackSocialClick = (platform, url) => {
  trackEvent('social_click', 'Social', platform, 1);
};

// External link tracking
export const trackExternalLink = (linkText, url) => {
  trackEvent('external_link', 'Links', linkText, 1);
};

// Contact form tracking (more detailed)
export const trackContactFormStart = () => {
  trackEvent('form_start', 'Contact', 'Contact form started', 1);
};

export const trackContactFormSubmit = (method = 'email') => {
  trackEvent('form_submit', 'Contact', `Form submitted via ${method}`, 1);
};

// Skills interaction tracking
export const trackSkillClick = (skillName) => {
  trackEvent('skill_click', 'Skills', skillName, 1);
};

// Theme toggle tracking
export const trackThemeToggle = (newTheme) => {
  trackEvent('theme_toggle', 'UI', `Switched to ${newTheme}`, 1);
};

// Modal actions (enhance your existing project tracking)
export const trackModalAction = (action, projectName) => {
  trackEvent('modal_action', 'Projects', `${action} - ${projectName}`, 1);
};

// Error tracking
export const trackError = (errorMessage, location) => {
  trackEvent('error', 'Technical', `${location}: ${errorMessage}`, 1);
};

// HOOKS FOR AUTOMATIC TRACKING

// Scroll tracking hook (add to App.js)
export const useScrollTracking = () => {
  let scrolled25 = false;
  let scrolled50 = false; 
  let scrolled75 = false;
  let scrolled90 = false;

  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent >= 25 && !scrolled25) {
      trackScrollDepth(25);
      scrolled25 = true;
    }
    if (scrollPercent >= 50 && !scrolled50) {
      trackScrollDepth(50);
      scrolled50 = true;
    }
    if (scrollPercent >= 75 && !scrolled75) {
      trackScrollDepth(75);
      scrolled75 = true;
    }
    if (scrollPercent >= 90 && !scrolled90) {
      trackScrollDepth(90);
      scrolled90 = true;
    }
  };

  return handleScroll;
};

// Time tracking hook (add to App.js)
export const useTimeTracking = () => {
  let startTime = Date.now();
  let tracked30s = false;
  let tracked1min = false;
  let tracked2min = false;
  let tracked5min = false;

  const checkTimeOnSite = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    
    if (timeSpent >= 30 && !tracked30s) {
      trackTimeOnSite(30);
      tracked30s = true;
    }
    if (timeSpent >= 60 && !tracked1min) {
      trackTimeOnSite(60);
      tracked1min = true;
    }
    if (timeSpent >= 120 && !tracked2min) {
      trackTimeOnSite(120);
      tracked2min = true;
    }
    if (timeSpent >= 300 && !tracked5min) {
      trackTimeOnSite(300);
      tracked5min = true;
    }
  };

  const interval = setInterval(checkTimeOnSite, 10000);
  return () => clearInterval(interval);
};
