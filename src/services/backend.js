// src/services/backend.js

// Determine which adapter to use based on environment variables
let adapter;

// We use a factory approach. In a real build, we might use Conditional Compilation or 
// rely on tree-shaking if configured correctly.
// For GitHub Pages, we want to ensure the Local Adapter code (which might use localhost) 
// is safe or acceptable.
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_LOCAL_DB === 'true') {
    adapter = require('./adapters/localAdapter');
} else {
    adapter = require('./adapters/supabaseAdapter');
}

export const backend = {
    getSections: () => adapter.getSections(),
    saveSection: (section) => adapter.saveSection(section),
    getBlogs: () => adapter.getBlogs(),
    saveBlog: (blog) => adapter.saveBlog(blog),
    uploadMedia: (file) => adapter.uploadMedia(file),
    login: (email, password) => adapter.login(email, password),
    logout: () => adapter.logout(),
    getUser: () => adapter.getUser(),
};
