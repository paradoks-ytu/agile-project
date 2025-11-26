import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [isClubsOpen, setIsClubsOpen] = useState(true); // Default open for visibility

    const isActiveLink = (path: string) => location.pathname === path;
    const isClubsActive = location.pathname.startsWith('/admin/clubs');

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--color-bg-sidebar)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 100
        }}>
            {/* Brand */}
            <div style={{
                padding: 'var(--spacing-md)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white'
                }}>U</div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>UniClubs</span>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: 'var(--spacing-md)' }}>
                <ul style={{ listStyle: 'none' }}>

                    {/* Dashboard */}
                    <li style={{ marginBottom: 'var(--spacing-xs)' }}>
                        <NavLink
                            to="/admin/panel"
                            end
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                padding: 'var(--spacing-sm)',
                                borderRadius: 'var(--radius-sm)',
                                color: isActive ? 'white' : 'var(--color-text-muted)',
                                backgroundColor: isActive ? 'rgba(39, 174, 96, 0.1)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: 500,
                                transition: 'all var(--transition-fast)'
                            })}
                        >
                            <span style={{ marginRight: '0.5rem' }}>🏠</span> Ana Sayfa
                        </NavLink>
                    </li>

                    {/* Clubs Dropdown */}
                    <li style={{ marginBottom: 'var(--spacing-xs)' }}>
                        <div
                            onClick={() => setIsClubsOpen(!isClubsOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--spacing-sm)',
                                borderRadius: 'var(--radius-sm)',
                                color: isClubsActive ? 'white' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all var(--transition-fast)',
                                backgroundColor: isClubsActive && !isClubsOpen ? 'rgba(255,255,255,0.05)' : 'transparent'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '0.5rem' }}>👥</span> Kulüpler
                            </div>
                            <span style={{ fontSize: '0.75rem', transform: isClubsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                        </div>

                        {/* Dropdown Content */}
                        {isClubsOpen && (
                            <ul style={{ listStyle: 'none', paddingLeft: '2rem', marginTop: '0.25rem' }}>
                                <li>
                                    <NavLink
                                        to="/admin/clubs/register"
                                        style={({ isActive }) => ({
                                            display: 'block',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            color: isActive ? 'white' : 'var(--color-text-muted)',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.2s'
                                        })}
                                    >
                                        Kulüp Kayıt
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                </ul>
            </nav>

            {/* Footer / User Profile */}
            <div style={{
                padding: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-bg-panel)',
                        border: '1px solid var(--color-border)'
                    }}></div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Admin</div>
                        <div style={{ fontSize: '0.75rem' }}>Yönetici</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
