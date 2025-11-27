import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '@/service/authService';
import type { ClubResponse } from '@/types/authTypes';
import Header from '@/components/Header';

// Icons
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<ClubResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // UI States
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeField, setActiveField] = useState<'name' | 'tags' | 'description' | null>(null);

    // Form Data
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        tags: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (!authService.isAuthenticated()) {
                navigate('/login');
                return;
            }

            try {
                const userData = await authService.getMe();
                setUser(userData);
                setEditForm({
                    name: userData.name,
                    description: userData.description || '',
                    tags: userData.tags ? userData.tags.join(', ') : ''
                });
            } catch (error) {
                console.error('Failed to fetch user data', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleEnterEditMode = () => {
        if (user) {
            // Reset form to current user data when entering edit mode
            setEditForm({
                name: user.name,
                description: user.description || '',
                tags: user.tags ? user.tags.join(', ') : ''
            });
        }
        setIsEditMode(true);
        setActiveField(null); // No field active initially
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setActiveField(null);
    };

    const handleSave = async () => {
        try {
            const tagsArray = editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            const updatedUser = await authService.updateClub({
                name: editForm.name,
                description: editForm.description,
                tags: tagsArray
            });
            setUser(updatedUser);
            setIsEditMode(false);
            setActiveField(null);
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Profil güncellenirken bir hata oluştu.');
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Yükleniyor...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-main)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navbar */}
            <Header />

            <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: 'var(--spacing-xl)' }}>

                {/* Profile Content Container */}
                <div style={{ position: 'relative', marginBottom: 'var(--spacing-lg)' }}>

                    {/* Edit Profile Button (Right Outer Corner - Above Banner) */}
                    {!isEditMode && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                            <button
                                onClick={handleEnterEditMode}
                                className="btn"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-text-muted)',
                                    border: '1px solid var(--color-border)',
                                    padding: '0.4rem 1rem',
                                    borderRadius: 'var(--radius-full)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >
                                <EditIcon />
                                Profili Düzenle
                            </button>
                        </div>
                    )}

                    {/* Banner */}
                    <div style={{
                        height: '225px', // Reduced height as requested (approx 16:9 ratio for a smaller viewport, or just a good landscape banner)
                        backgroundColor: 'var(--color-bg-panel)',
                        borderRadius: 'var(--radius-md)',
                        backgroundImage: 'linear-gradient(to top, var(--color-bg-main) 0%, transparent 40%), linear-gradient(to right bottom, #1B2228, #2C3440)',
                        border: '1px solid var(--color-border)',
                        borderBottom: 'none',
                        position: 'relative',
                        zIndex: 0
                    }}></div>

                    {/* Main Content (Avatar + Info) */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        padding: '0 var(--spacing-lg)',
                        marginTop: '-60px',
                        display: 'flex',
                        gap: 'var(--spacing-xl)',
                        alignItems: 'flex-start'
                    }}>
                        {/* Left Column: Avatar */}
                        <div style={{
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: '140px',
                                height: '140px',
                                borderRadius: '50%', // Circular for Club Logo
                                backgroundColor: 'var(--color-bg-sidebar)',
                                border: '4px solid var(--color-bg-main)', // Match background to create "cutout" effect
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4rem',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                boxShadow: 'var(--shadow-lg)',
                                overflow: 'hidden'
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Right Column: Info */}
                        <div style={{ flex: 1, paddingTop: '45px' }}> {/* Increased padding to align name with avatar center */}

                            {/* Header Row: Name */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                                {/* Name */}
                                <div style={{ flex: 1 }}>
                                    {activeField === 'name' ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            autoFocus
                                            onBlur={() => setActiveField(null)}
                                            style={{
                                                backgroundColor: 'var(--color-bg-input)',
                                                border: '1px solid var(--color-border)',
                                                color: 'white',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '2.5rem',
                                                fontWeight: 800,
                                                width: '100%',
                                                fontFamily: '"Merriweather", serif' // Attempt a serif font if available, or fallback
                                            }}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <h1 style={{
                                                fontSize: '2.5rem',
                                                fontWeight: 800,
                                                margin: 0,
                                                lineHeight: 1.1,
                                                fontFamily: '"Merriweather", "Georgia", serif', // Letterboxd style serif
                                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                            }}>
                                                {editForm.name}
                                            </h1>
                                            {isEditMode && (
                                                <button
                                                    onClick={() => setActiveField('name')}
                                                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                                                >
                                                    <EditIcon />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                {activeField === 'tags' ? (
                                    <input
                                        type="text"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                        placeholder="sinema, film, sanat"
                                        autoFocus
                                        style={{
                                            backgroundColor: 'var(--color-bg-input)',
                                            border: '1px solid var(--color-border)',
                                            color: 'white',
                                            padding: '0.4rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.9rem',
                                            width: '100%'
                                        }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                                        {editForm.tags && editForm.tags.length > 0 ? (
                                            editForm.tags.split(',').map((tag, index) => (
                                                <span key={index} style={{
                                                    fontSize: '0.75rem',
                                                    backgroundColor: 'var(--color-bg-panel)',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: 'var(--color-text-muted)',
                                                    border: '1px solid var(--color-border)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {tag.trim()}
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Etiket yok</span>
                                        )}
                                        {isEditMode && (
                                            <button
                                                onClick={() => setActiveField('tags')}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                                            >
                                                <EditIcon />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Description (Synopsis Style) */}
                            <div style={{ marginBottom: 'var(--spacing-md)' }}> {/* Reduced margin */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                    <h3 style={{
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        margin: 0,
                                        color: 'var(--color-text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        HAKKINDA
                                    </h3>
                                    {isEditMode && activeField !== 'description' && (
                                        <button
                                            onClick={() => setActiveField('description')}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                                        >
                                            <EditIcon />
                                        </button>
                                    )}
                                </div>

                                {activeField === 'description' ? (
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        rows={6}
                                        autoFocus
                                        style={{
                                            backgroundColor: 'var(--color-bg-input)',
                                            border: '1px solid var(--color-border)',
                                            color: 'white',
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '1rem',
                                            width: '100%',
                                            fontFamily: '"Merriweather", serif',
                                            resize: 'vertical',
                                            lineHeight: 1.6
                                        }}
                                    />
                                ) : (
                                    <p style={{
                                        lineHeight: 1.6,
                                        color: '#9ab', // Slightly blue-ish grey like Letterboxd text
                                        fontSize: '1rem',
                                        fontFamily: '"Merriweather", serif'
                                    }}>
                                        {editForm.description || 'Henüz açıklama yok.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-lg) 0' }}></div>

                {/* Edit Actions (Save/Cancel) */}
                {isEditMode && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-xl)',
                        padding: '0 var(--spacing-lg)'
                    }}>
                        <button
                            onClick={handleCancelEdit}
                            className="btn"
                            style={{
                                backgroundColor: 'transparent',
                                color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)',
                                padding: '0.5rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer'
                            }}
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                )}

                {/* Posts Section */}
                <div style={{ padding: '0 var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--spacing-lg)' }}>Gönderiler</h3>

                    {/* Empty State for Posts */}
                    <div style={{
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        backgroundColor: 'var(--color-bg-panel)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📭</div>
                        <p>Henüz gönderi yok.</p>
                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                borderTop: '1px solid var(--color-border)'
            }}>
                <p>UniNest &copy; 2025 Paradoks.</p>
            </footer>
        </div>
    );
};

export default ProfilePage;
