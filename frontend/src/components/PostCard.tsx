import React from 'react';

import type { PostResponse } from '../types/postTypes';

import TipTapRenderer from './TipTapRenderer';

interface PostCardProps {
    post: PostResponse;
    onDelete?: (id: number) => void;
    isOwner?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, isOwner }) => {
    const [visibleHeight, setVisibleHeight] = React.useState(400); // Increased initial height
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (contentRef.current) {
            setIsOverflowing(contentRef.current.scrollHeight > visibleHeight);
        }
    }, [post.content, visibleHeight]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleShowMore = () => {
        setVisibleHeight(prev => prev + 1000); // Increased chunk size
    };

    return (
        <div style={{
            backgroundColor: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                {/* Avatar */}
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg-sidebar)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    overflow: 'hidden'
                }}>
                    {post.club.profilePicture ? (
                        <img src={post.club.profilePicture} alt={post.club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        post.club.name.charAt(0).toUpperCase()
                    )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'white' }}>{post.club.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(post.creationDate)}</div>
                </div>

                {/* Delete Action */}
                {isOwner && onDelete && (
                    <button
                        onClick={() => onDelete(post.id)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                        title="Sil"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                )}
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--spacing-sm)', color: 'white' }}>
                {post.title}
            </h3>

            {/* Content */}
            <div
                ref={contentRef}
                style={{
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#9ab',
                    whiteSpace: 'pre-wrap',
                    maxHeight: `${visibleHeight}px`,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'max-height 0.3s ease'
                }}
            >
                <TipTapRenderer content={post.content} />

                {isOverflowing && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '120px',
                        background: 'linear-gradient(to bottom, transparent, var(--color-bg-panel))',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '0'
                    }}>
                        <button
                            onClick={handleShowMore}
                            style={{
                                backgroundColor: 'var(--color-bg-panel)',
                                color: 'var(--color-primary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '20px',
                                padding: '9px 28px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '1rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-sidebar)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-bg-panel)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Devamını Gör
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
