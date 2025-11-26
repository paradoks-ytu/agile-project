
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '@/service/authService';
import type { ClubResponse } from '@/types/authTypes';

const LandingPage: React.FC = () => {
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
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-main)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navbar */}
            <header style={{
                padding: 'var(--spacing-lg) var(--spacing-xl)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Brand */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', textDecoration: 'none', color: 'white' }}>
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
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>UniClubs</span>
                </Link>

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

            {/* Hero Section (Empty State) */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'var(--spacing-xl)'
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    marginBottom: 'var(--spacing-md)',
                    letterSpacing: '-0.03em',
                    maxWidth: '800px',
                    lineHeight: 1.1
                }}>
                    Kampüsün Sosyal Ağı.
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    maxWidth: '600px',
                    lineHeight: 1.6
                }}>
                    Üniversite kulüplerini keşfet, etkinliklere katıl ve sosyalleş.
                    <br />
                    <span style={{ fontSize: '1rem', opacity: 0.7 }}>(Çok Yakında)</span>
                </p>

                {/* Decorative Element */}
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    width: '100px',
                    height: '4px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '2px'
                }}></div>
            </main>

            {/* Footer */}
            <footer style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                borderTop: '1px solid var(--color-border)'
            }}>
                <p>UniClubs &copy; 2025 Paradoks.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
