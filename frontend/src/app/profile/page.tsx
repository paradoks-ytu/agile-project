import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as authService from '../../service/authService';
import * as postService from '../../service/postService';
import type { ClubResponse } from '../../types/authTypes';
import type { PostResponse } from '../../types/postTypes';
import Header from '../../components/Header';
import PostCard from '../../components/PostCard';
import CreatePostForm from '../../components/CreatePostForm';

// Icons
const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<ClubResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingPosts, setLoadingPosts] = useState(false);

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
        const fetchUserAndPosts = async () => {
            setLoading(true);
            try {
                let userData: ClubResponse;
                const currentUser = authService.getCachedUser();
                let clubIdToFetch: number;

                if (id) {
                    // Viewing a specific club
                    clubIdToFetch = parseInt(id);

                    // If logged in and viewing own profile via ID, redirect to /myprofile
                    if (currentUser && currentUser.id === clubIdToFetch) {
                        navigate('/myprofile', { replace: true });
                        return;
                    }

                    userData = await authService.getClubById(clubIdToFetch);
                    setIsOwner(false);
                } else {
                    // Viewing own profile (/myprofile)
                    if (!authService.isAuthenticated()) {
                        navigate('/login');
                        return;
                    }
                    userData = await authService.getMe();
                    clubIdToFetch = userData.id;
                    setIsOwner(true);
                }

                setUser(userData);
                setEditForm({
                    name: userData.name,
                    description: userData.description || '',
                    tags: userData.tags ? userData.tags.join(', ') : ''
                });

                // Fetch Posts (Graceful degradation)
                try {
                    setLoadingPosts(true);
                    const pagedResponse = await postService.getClubPosts(clubIdToFetch, 0, 10);
                    // Client-side sort for the current page as a fallback
                    const sortedContent = pagedResponse.content.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                    setPosts(sortedContent);
                    setTotalPages(pagedResponse.totalPages);
                    setPage(0);
                } catch (postError) {
                    console.warn('Failed to fetch posts (Backend might be missing endpoint):', postError);
                    setPosts([]); // Set empty posts instead of crashing
                } finally {
                    setLoadingPosts(false);
                }

            } catch (error) {
                console.error('Failed to fetch user data', error);
                // Only redirect if USER fetch fails
                if (!id) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndPosts();
    }, [navigate, id]);

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

    const handlePostCreated = (newPost: PostResponse) => {
        setPosts([newPost, ...posts]);
    };

    const handleDeletePost = async (postId: number) => {
        if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;
        try {
            await postService.deletePost(postId);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (error) {
            console.error('Failed to delete post', error);
            alert('Gönderi silinemedi.');
        }
    };

    const handlePageChange = async (newPage: number) => {
        if (!user || newPage < 0 || newPage >= totalPages || newPage === page) return;

        setLoadingPosts(true);
        try {
            const pagedResponse = await postService.getClubPosts(user.id, newPage, 10);
            const sortedContent = pagedResponse.content.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
            setPosts(sortedContent);
            setTotalPages(pagedResponse.totalPages);
            setPage(newPage);
            // Scroll to top of posts section
            window.scrollTo({ top: 400, behavior: 'smooth' });
        } catch (error) {
            console.error('Failed to load posts page', error);
        } finally {
            setLoadingPosts(false);
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
                    {!isEditMode && isOwner && (
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
                        height: '225px',
                        backgroundColor: 'var(--color-bg-panel)',
                        borderRadius: 'var(--radius-md)',
                        backgroundImage: user.banner
                            ? `linear-gradient(to top, var(--color-bg-main) 0%, transparent 40%), url(${user.banner})`
                            : 'linear-gradient(to top, var(--color-bg-main) 0%, transparent 40%), linear-gradient(to right bottom, #1B2228, #2C3440)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--color-border)',
                        borderBottom: 'none',
                        position: 'relative',
                        zIndex: 0,
                        overflow: 'hidden'
                    }}>
                        {isEditMode && (
                            <>
                                <label
                                    htmlFor="banner-upload"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s',
                                        color: 'white'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                                        <EditIcon />
                                        <span>Bannerı Düzenle</span>
                                    </div>
                                </label>
                                <input
                                    id="banner-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            try {
                                                const updatedUser = await authService.uploadBanner(e.target.files[0]);
                                                setUser(updatedUser);
                                            } catch (error) {
                                                console.error('Failed to upload banner', error);
                                                alert('Banner yüklenirken bir hata oluştu.');
                                            }
                                        }
                                    }}
                                />
                            </>
                        )}
                    </div>

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
                            flexShrink: 0,
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '160px',
                                height: '160px',
                                borderRadius: '50%', // Circular for Club Logo
                                backgroundColor: 'var(--color-bg-sidebar)',
                                border: '4px solid var(--color-bg-main)', // Match background to create "cutout" effect
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '4.6rem',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                boxShadow: 'var(--shadow-lg)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                {user.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}

                                {isEditMode && (
                                    <>
                                        {/* Upload Overlay */}
                                        <label
                                            htmlFor="profile-upload"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s',
                                                color: 'white'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                        >
                                            <EditIcon />
                                        </label>
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    try {
                                                        const updatedUser = await authService.uploadProfilePicture(e.target.files[0]);
                                                        setUser(updatedUser);
                                                    } catch (error) {
                                                        console.error('Failed to upload profile picture', error);
                                                        alert('Profil resmi yüklenirken bir hata oluştu.');
                                                    }
                                                }
                                            }}
                                        />
                                    </>
                                )}
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

                    {/* Create Post Form (Only for Owner) */}
                    {isOwner && (
                        <CreatePostForm onPostCreated={handlePostCreated} />
                    )}

                    {/* Posts List */}
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isOwner={isOwner}
                                onDelete={handleDeletePost}
                            />
                        ))
                    ) : (
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
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 0 || loadingPosts}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: page === 0 || loadingPosts ? 'not-allowed' : 'pointer',
                                        opacity: page === 0 || loadingPosts ? 0.5 : 1,
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    &lt;
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        disabled={loadingPosts}
                                        style={{
                                            background: i === page ? 'var(--color-primary)' : 'transparent',
                                            border: '1px solid var(--color-border)',
                                            color: 'white',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: loadingPosts ? 'not-allowed' : 'pointer',
                                            fontWeight: i === page ? 700 : 400,
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages - 1 || loadingPosts}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--color-border)',
                                        color: 'white',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: page === totalPages - 1 || loadingPosts ? 'not-allowed' : 'pointer',
                                        opacity: page === totalPages - 1 || loadingPosts ? 0.5 : 1,
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    &gt;
                                </button>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Sayfa {page + 1} / {totalPages}
                            </div>
                        </div>
                    )}
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
