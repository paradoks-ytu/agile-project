import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../../service/authService';
import Header from '../../../components/Header';
import type { UserResponse } from '../../../types/authTypes';

// Icons
const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const StudentProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [activeField, setActiveField] = useState<'firstName' | 'secondName' | 'tags' | null>(null);
    const [editForm, setEditForm] = useState({
        firstName: '',
        secondName: '',
        tags: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    navigate('/login');
                    return;
                }

                const role = authService.getUserRole();
                if (role !== 'student') {
                    navigate('/myprofile');
                    return;
                }

                const userData = await authService.getMeUser();
                setUser(userData);

                // Initialize form
                setEditForm({
                    firstName: userData.firstName,
                    secondName: userData.lastName, // Backend maps lastName to secondName
                    tags: '' // Tags not yet in UserResponse, placeholder
                });

            } catch (error) {
                console.error('Failed to fetch user', error);
                authService.logout();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleEnterEditMode = () => {
        if (user) {
            setEditForm({
                firstName: user.firstName,
                secondName: user.lastName,
                tags: '' // UserResponse doesn't have tags yet, need to check authTypes update
            });
        }
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setActiveField(null);
    };

    const handleSave = async () => {
        try {
            const tagsArray = editForm.tags ? editForm.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
            const updatedUser = await authService.updateUser({
                firstName: editForm.firstName,
                secondName: editForm.secondName,
                tags: tagsArray
            });
            setUser(updatedUser);
            setIsEditing(false);
            setActiveField(null);
        } catch (error) {
            console.error('Update failed', error);
            alert('Güncelleme başarısız.');
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
            color: 'var(--color-text-main)'
        }}>
            <Header />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-xl) var(--spacing-md)' }}>

                {/* Profile Card */}
                <div style={{
                    backgroundColor: 'var(--color-bg-panel)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>

                    {/* Edit Button (Top Right) */}
                    {!isEditing && (
                        <button
                            onClick={handleEnterEditMode}
                            style={{
                                position: 'absolute',
                                top: 'var(--spacing-md)',
                                right: 'var(--spacing-md)',
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-muted)',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <EditIcon /> Profili Düzenle
                        </button>
                    )}

                    <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>

                        {/* Avatar */}
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)', // Dynamic color based on name hash?
                            color: 'white',
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--spacing-md)',
                            border: '4px solid var(--color-bg-panel)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                            {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                            {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                        </div>

                        {/* Name & Surname (Editable) */}
                        <div style={{ marginBottom: 'var(--spacing-xs)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            {activeField === 'firstName' || activeField === 'secondName' ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                                        placeholder="İsim"
                                        autoFocus
                                        style={{
                                            backgroundColor: 'var(--color-bg-input)',
                                            border: '1px solid var(--color-border)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            width: '120px',
                                            textAlign: 'center'
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={editForm.secondName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, secondName: e.target.value }))}
                                        placeholder="Soyisim"
                                        style={{
                                            backgroundColor: 'var(--color-bg-input)',
                                            border: '1px solid var(--color-border)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            width: '120px',
                                            textAlign: 'center'
                                        }}
                                    />
                                </div>
                            ) : (
                                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {editForm.firstName} {editForm.secondName}
                                    {isEditing && (
                                        <button onClick={() => setActiveField('firstName')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}>
                                            <EditIcon />
                                        </button>
                                    )}
                                </h1>
                            )}
                        </div>

                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginBottom: 'var(--spacing-lg)' }}>
                            {user.email}
                        </p>

                        {/* Tags (Editable) */}
                        <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            {activeField === 'tags' ? (
                                <input
                                    type="text"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="Etiketler (virgülle ayırın)"
                                    autoFocus
                                    style={{
                                        backgroundColor: 'var(--color-bg-input)',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        padding: '0.4rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.9rem',
                                        width: '300px',
                                        textAlign: 'center'
                                    }}
                                />
                            ) : (
                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {editForm.tags && editForm.tags.length > 0 ? (
                                        editForm.tags.split(',').map((tag, index) => (
                                            <span key={index} style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: 'var(--color-bg-main)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: 'var(--radius-full)',
                                                color: 'var(--color-text-muted)',
                                                border: '1px solid var(--color-border)',
                                            }}>
                                                {tag.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Etiket yok</span>
                                    )}
                                    {isEditing && (
                                        <button onClick={() => setActiveField('tags')} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}>
                                            <EditIcon />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions Row */}
                        {isEditing && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 'var(--spacing-lg)' }}>
                                <button
                                    onClick={handleCancelEdit}
                                    className="btn"
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text-muted)',
                                        padding: '6px 20px',
                                        borderRadius: 'var(--radius-full)'
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
                                        padding: '6px 20px',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 600
                                    }}
                                >
                                    Kaydet
                                </button>
                            </div>
                        )}

                        <div style={{
                            marginTop: 'var(--spacing-xl)',
                            paddingTop: 'var(--spacing-lg)',
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 'var(--spacing-xl)'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Kayıt Tarihi</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white' }}>
                                    {new Date(user.dateCreated).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfilePage;
