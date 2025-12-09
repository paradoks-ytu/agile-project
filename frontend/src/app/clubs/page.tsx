import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import * as authService from '@/service/authService';
import type { ClubResponse } from '@/types/authTypes';

const ClubsPage: React.FC = () => {
    const [clubs, setClubs] = useState<ClubResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12; // 3x4 or 4x3 grid

    useEffect(() => {
        const fetchClubs = async () => {
            setLoading(true);
            try {
                const response = await authService.getClubs(page, pageSize);
                setClubs(response.content);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Failed to fetch clubs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-main)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Header />

            <main style={{ flex: 1, padding: 'var(--spacing-xl)', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-sm)' }}>Kulüpleri Keşfet</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Üniversitenin en aktif kulüplerini incele ve katıl.</p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ color: 'var(--color-text-muted)' }}>Yükleniyor...</div>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: 'var(--spacing-lg)',
                            marginBottom: 'var(--spacing-2xl)'
                        }}>
                            {clubs.map((club) => (
                                <Link key={club.id} to={`/clubs/${club.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{
                                        backgroundColor: 'var(--color-bg-panel)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        overflow: 'hidden',
                                        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Card Header / Banner Placeholder */}
                                        <div style={{
                                            height: '100px',
                                            background: club.banner
                                                ? `linear-gradient(to top, var(--color-bg-panel) 0%, transparent 40%), url(${club.banner})`
                                                : 'linear-gradient(to right bottom, #1B2228, #2C3440)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative'
                                        }}>
                                            {/* Avatar */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '-30px',
                                                left: '20px',
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                backgroundColor: 'var(--color-bg-sidebar)',
                                                border: '3px solid var(--color-bg-panel)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                color: 'var(--color-primary)',
                                                overflow: 'hidden'
                                            }}>
                                                {club.profilePicture ? (
                                                    <img
                                                        src={club.profilePicture}
                                                        alt={club.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    club.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div style={{ padding: 'var(--spacing-lg)', paddingTop: '40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--spacing-xs)', lineHeight: 1.2 }}>
                                                {club.name}
                                            </h3>

                                            {/* Tags */}
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: 'var(--spacing-md)' }}>
                                                {club.tags && club.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} style={{
                                                        fontSize: '0.7rem',
                                                        color: 'var(--color-text-muted)',
                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <p style={{
                                                fontSize: '0.9rem',
                                                color: 'var(--color-text-muted)',
                                                lineHeight: 1.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                marginBottom: 'var(--spacing-md)',
                                                flex: 1
                                            }}>
                                                {club.description || 'Bu kulüp hakkında henüz bir açıklama girilmemiş.'}
                                            </p>

                                            {/* Action */}
                                            <button style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                backgroundColor: 'transparent',
                                                border: '1px solid var(--color-border)',
                                                borderRadius: 'var(--radius-sm)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                transition: 'background-color 0.2s'
                                            }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                İncele
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 0}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--color-bg-panel)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: page === 0 ? 'var(--color-text-muted)' : 'white',
                                        cursor: page === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Önceki
                                </button>

                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    Sayfa {page + 1} / {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages - 1}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--color-bg-panel)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: page === totalPages - 1 ? 'var(--color-text-muted)' : 'white',
                                        cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Sonraki
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default ClubsPage;
