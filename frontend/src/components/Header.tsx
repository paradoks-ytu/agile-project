import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../service/authService';
import type { ClubResponse, UserResponse } from '../types/authTypes';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<ClubResponse | UserResponse | null>(authService.getCachedUser());

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = authService.isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                try {
                    const role = authService.getUserRole();
                    if (role === 'student') {
                        const userData = await authService.getMeUser();
                        setUser(userData);
                    } else {
                        const userData = await authService.getMe();
                        setUser(userData);
                    }
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

    // Helper to get display name and image
    const getDisplayName = () => {
        if (!user) return 'U';
        if ('name' in user && user.name) return user.name; // Club
        if ('firstName' in user && user.firstName) return user.firstName; // Student
        return 'Kullanıcı';
    };

    const getProfileImage = () => {
        if (!user) return null;
        if ('profilePicture' in user) return user.profilePicture;
        return null; // Student doesn't have profile pic yet
    };

    const getProfileLink = () => {
        const role = authService.getUserRole();
        return role === 'student' ? '/profile' : '/myprofile';
    };

    const getInitials = () => {
        if (!user) return 'U';

        // Club
        if ('name' in user && user.name) {
            return user.name.charAt(0).toUpperCase();
        }

        // Student
        if ('firstName' in user && user.firstName) {
            const first = user.firstName.charAt(0);
            const second = ('lastName' in user && user.lastName) ? user.lastName.charAt(0) : '';
            // Note: backend maps lastName to secondName or vice versa, check authTypes.
            // In authTypes UserResponse has firstName, lastName, email...
            return (first + second).toUpperCase();
        }

        return 'U';
    };

    return (
        <header style={{
            padding: 'var(--spacing-lg) var(--spacing-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', textDecoration: 'none', color: 'white', transform: 'translateY(-2px)' }}>
                    <img src="/uninest-logo.png" alt="UniNest Logo" style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-sm)'
                    }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>UniNest</span>
                </Link>

                {/* Clubs Button */}
                <Link
                    to="/clubs"
                    className="btn"
                    style={{
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-muted)',
                        border: '1px solid transparent',
                        padding: '0.5rem 1.5rem',
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
                    {/* Profile Picture */}
                    <Link
                        to={getProfileLink()}
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
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                    >
                        {getProfileImage() ? (
                            <img
                                src={getProfileImage()!}
                                alt={getDisplayName()}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            getInitials()
                        )}
                    </Link>

                    {/* Profile Button */}
                    <Link
                        to={getProfileLink()}
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
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <Link
                        to="/register"
                        className="btn"
                        style={{
                            backgroundColor: 'white',
                            color: 'black',
                            border: '1px solid white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        KAYIT OL
                    </Link>
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
                </div>
            )}
        </header>
    );
};

export default Header;
