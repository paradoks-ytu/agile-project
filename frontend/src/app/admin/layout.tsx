import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

/**
 * AdminLayout
 * Wraps all admin pages.
 * Implements Sidebar Layout (CoreUI style)
 */
const AdminLayout: React.FC = () => {
    return (
        <div className="layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area - Flexible width */}
            <main style={{
                flex: 1,
                marginLeft: 'var(--sidebar-width)', // Offset for fixed sidebar
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-bg-main)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Top Header (Optional for now, good for breadcrumbs/mobile toggle) */}
                <header style={{
                    marginBottom: 'var(--spacing-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h2>
                    {/* Mobile toggle could go here */}
                </header>

                {/* Content Wrapper */}
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>

                <footer style={{
                    marginTop: 'var(--spacing-xl)',
                    paddingTop: 'var(--spacing-md)',
                    borderTop: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <span>UniClubs &copy; 2025 Paradoks.</span>
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
