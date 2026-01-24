// src/services/adapters/localAdapter.js

const API_URL = 'http://localhost:5001/api';

export const getSections = async () => {
    const response = await fetch(`${API_URL}/sections`);
    if (!response.ok) throw new Error('Failed to fetch sections');
    return response.json();
};

export const saveSection = async (section) => {
    const response = await fetch(`${API_URL}/sections`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(section),
    });
    if (!response.ok) throw new Error('Failed to save section');
    return response.json();
};

export const getBlogs = async () => {
    // Mock implementations for now or add endpoints to server
    console.log('getBlogs not fully implemented in local server yet');
    return [];
};

export const saveBlog = async (blog) => {
    console.log('saveBlog not fully implemented in local server yet');
    return blog;
};

export const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();

    // Return the URL as stored in the DB (which should be /uploads/filename)
    return data.url;
};

// Mock Auth for Local Dev
export const login = async (email, password) => {
    console.log('Local Mode: Auto-login as admin');
    localStorage.setItem('local_user', JSON.stringify({ id: 'admin', email: 'admin@local' }));
    return { user: { id: 'admin', email: 'admin@local' }, session: { access_token: 'mock_token' } };
};

export const logout = async () => {
    localStorage.removeItem('local_user');
};

export const getUser = async () => {
    const user = localStorage.getItem('local_user');
    return user ? JSON.parse(user) : null;
};
