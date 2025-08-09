// Google Analytics utilities
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

// Initialize GA
export const initializeGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
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
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
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
