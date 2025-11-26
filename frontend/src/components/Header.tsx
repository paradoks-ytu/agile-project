import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '@/service/authService';
import type { ClubResponse } from '@/types/authTypes';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<ClubResponse | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = authService.isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                }
            }
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        authService.logout();
        setIsLoggedIn(false);
        setUser(null);
        navigate('/'); // Refresh or stay on page
    };

    return (
        <header style={{
            padding: 'var(--spacing-lg) var(--spacing-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
                {/* Brand */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', textDecoration: 'none', color: 'white', transform: 'translateY(-2px)' }}>
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
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>UniClubs</span>
                </Link>

                {/* Clubs Button (Added) */}
                <Link
                    to="/clubs"
                    className="btn"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-muted)',
                        border: '1px solid transparent',
                        padding: '0.5rem 1.5rem', // Same padding as Profile button for height match
                        borderRadius: 'var(--radius-full)',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        transition: 'all var(--transition-fast)',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    Kulüpler
                </Link>
            </div>

            {/* Actions */}
            {isLoggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    {/* Profile Picture (Initial) */}
                    <Link
                        to="/myprofile"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg-panel)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Link>

                    {/* Profile Button */}
                    <Link
                        to="/myprofile"
                        className="btn"
                        style={{
                            backgroundColor: 'var(--color-bg-panel)',
                            color: 'white',
                            border: '1px solid var(--color-border)',
                            padding: '0.5rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        Profil
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="btn"
                        style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-error)',
                            border: '1px solid var(--color-error)',
                            padding: '0.5rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        Çıkış Yap
                    </button>
                </div>
            ) : (
                <Link
                    to="/login"
                    className="btn"
                    style={{
                        backgroundColor: 'var(--color-bg-panel)',
                        color: 'white',
                        border: '1px solid var(--color-border)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: 'var(--radius-full)', // Pill shape
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        transition: 'all var(--transition-fast)'
                    }}
                >
                    GİRİŞ YAP
                </Link>
            )}
        </header>
    );
};

export default Header;
