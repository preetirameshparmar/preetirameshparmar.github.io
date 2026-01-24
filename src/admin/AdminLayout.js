import React from 'react';
import { backend } from '../services/backend';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const handleLogout = async () => {
        try {
            await backend.logout();
            window.location.href = '/login';
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">Admin Panel</div>
                <nav>
                    <a href="/admin/sections">Sections</a>
                    <a href="/admin/blogs">Blogs</a>
                    <a href="/admin/media">Media</a>
                    <a href="/" target="_blank" rel="noopener noreferrer">View Site</a>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    Sign Out
                </button>
            </aside>
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
