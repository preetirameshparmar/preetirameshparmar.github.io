import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { backend } from '../services/backend';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await backend.logout();
            navigate('/login');
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <div className="admin-logo-mobile">Admin Panel</div>
                <button className="hamburger-btn" onClick={toggleMenu}>
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </header>

            {/* Sidebar / Drawer */}
            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="admin-logo">Admin Panel</div>
                    <button className="close-menu-btn" onClick={closeMenu}>✕</button>
                </div>

                <nav>
                    <Link to="/admin/sections" onClick={closeMenu}>Sections</Link>
                    <Link to="/admin/blogs" onClick={closeMenu}>Blogs</Link>
                    <Link to="/admin/media" onClick={closeMenu}>Media</Link>
                    <Link to="/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>View Site</Link>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    Sign Out
                </button>
            </aside>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
