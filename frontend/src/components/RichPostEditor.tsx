import React, { useState, useRef, useEffect } from 'react';
import * as authService from '@/service/authService';
import type { ClubResponse } from '@/types/authTypes';

interface RichPostEditorProps {
    initialContent?: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichPostEditor: React.FC<RichPostEditorProps> = ({ onChange, placeholder = "Neler oluyor?" }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [clubs, setClubs] = useState<ClubResponse[]>([]);
    const [filteredClubs, setFilteredClubs] = useState<ClubResponse[]>([]);
    const [cursorPosition, setCursorPosition] = useState<{ top: number, left: number } | null>(null);

    // Fetch clubs for mentions
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await authService.getClubs(0, 50);
                setClubs(response.content);
            } catch (error) {
                console.error('Failed to fetch clubs for mentions', error);
            }
        };
        fetchClubs();
    }, []);

    // Filter clubs based on query
    useEffect(() => {
        if (mentionQuery) {
            const lowerQuery = mentionQuery.toLowerCase();
            setFilteredClubs(clubs.filter(club => club.name.toLowerCase().includes(lowerQuery)));
        } else {
            setFilteredClubs(clubs);
        }
    }, [mentionQuery, clubs]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions && filteredClubs.length > 0 && e.key === 'Tab') {
            e.preventDefault();
            insertMention(filteredClubs[0]);
        }
    };

    const handleInput = () => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const text = range.startContainer.textContent || '';
        const cursorIndex = range.startOffset;

        // Check for @ trigger
        // Look back from cursor to find @
        const textBeforeCursor = text.slice(0, cursorIndex);
        const lastAtPos = textBeforeCursor.lastIndexOf('@');

        if (lastAtPos !== -1) {
            const query = textBeforeCursor.slice(lastAtPos + 1);
            // Simple validation: query shouldn't contain spaces (or maybe allow spaces for names?)
            // Let's assume names can have spaces, but we stop at some point.
            // For now, let's say query is valid if it doesn't contain newlines.

            // Get screen coordinates for dropdown
            const rect = range.getBoundingClientRect();
            setCursorPosition({ top: rect.bottom, left: rect.left });

            setMentionQuery(query);
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }

        parseAndNotify();
    };

    const parseAndNotify = () => {
        if (!editorRef.current) return;

        // Clone the content to manipulate it without affecting the editor
        const clone = editorRef.current.cloneNode(true) as HTMLElement;

        // Replace mention spans with @club-ID
        const mentions = clone.querySelectorAll('.mention-chip');
        mentions.forEach(mention => {
            const id = mention.getAttribute('data-id');
            mention.replaceWith(`@club-${id}`);
        });

        // Replace images with @image-URL
        const images = clone.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            img.replaceWith(`@image-${src}`);
        });

        // Replace links with @link-URL
        const links = clone.querySelectorAll('.editor-link');
        links.forEach(link => {
            const url = link.getAttribute('data-url');
            link.replaceWith(`@link-${url}`);
        });

        // Replace youtube with @yt-URL
        const yts = clone.querySelectorAll('.editor-youtube');
        yts.forEach(yt => {
            const url = yt.getAttribute('data-url');
            yt.replaceWith(`@yt-${url}`);
        });

        // Get text content (this strips HTML tags but keeps our replacements)
        let parsed = clone.innerText;

        // Cleanup: remove zero-width spaces if any
        parsed = parsed.replace(/\u200B/g, '');

        onChange(parsed);
    };

    const insertMention = (club: ClubResponse) => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        // We need to delete the "@query" part
        const textNode = range.startContainer;
        const text = textNode.textContent || '';
        const cursorIndex = range.startOffset;
        const lastAtPos = text.slice(0, cursorIndex).lastIndexOf('@');

        if (lastAtPos !== -1) {
            range.setStart(textNode, lastAtPos);
            range.setEnd(textNode, cursorIndex);
            range.deleteContents();

            // Create the chip
            const chip = document.createElement('span');
            chip.className = 'mention-chip';
            chip.dataset.id = club.id.toString();
            chip.contentEditable = 'false';
            chip.textContent = `@${club.name}`;
            chip.style.color = 'var(--color-primary)';
            chip.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
            chip.style.borderRadius = '4px';
            chip.style.padding = '0 4px';
            chip.style.margin = '0 2px';
            chip.style.fontWeight = '600';

            // Insert chip
            range.insertNode(chip);

            // Insert space after
            const space = document.createTextNode('\u00A0');
            range.setStartAfter(chip);
            range.setEndAfter(chip);
            range.insertNode(space);

            // Move cursor after space
            range.setStartAfter(space);
            range.setEndAfter(space);
            selection.removeAllRanges();
            selection.addRange(range);

            setShowMentions(false);
            parseAndNotify();
        }
    };

    const insertImage = () => {
        const url = prompt('Resim URL\'si girin:');
        if (!url) return;
        insertElement('img', url);
    };

    const insertLink = () => {
        const url = prompt('Link URL\'si girin:');
        if (!url) return;

        const span = document.createElement('span');
        span.className = 'editor-link';
        span.dataset.url = url;
        span.contentEditable = 'false';
        span.textContent = `🔗 ${url}`;
        span.style.color = 'var(--color-secondary)';
        span.style.textDecoration = 'underline';
        span.style.cursor = 'pointer';
        span.style.margin = '0 4px';

        insertNode(span);
    };

    const insertYoutube = () => {
        const url = prompt('YouTube Video URL\'si girin:');
        if (!url) return;

        const div = document.createElement('div');
        div.className = 'editor-youtube';
        div.dataset.url = url;
        div.contentEditable = 'false';
        div.textContent = `▶️ YouTube Video: ${url}`;
        div.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        div.style.color = '#ff0000';
        div.style.padding = '8px';
        div.style.borderRadius = '8px';
        div.style.marginTop = '8px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '8px';
        div.style.fontWeight = '600';

        insertNode(div);
    };

    const insertElement = (type: string, url: string) => {
        if (!editorRef.current) return;

        if (type === 'img') {
            const img = document.createElement('img');
            img.src = url;
            img.className = 'post-editor-image';
            img.style.maxWidth = '100%';
            img.style.borderRadius = '8px';
            img.style.marginTop = '8px';
            img.style.display = 'block';

            editorRef.current.appendChild(img);
            const br = document.createElement('br');
            editorRef.current.appendChild(br);
            parseAndNotify();
        }
    };

    const insertNode = (node: Node) => {
        if (!editorRef.current) return;

        // If we have a selection, insert there. Else append.
        // For simplicity in this demo, let's just append if it's a block, or try to insert at cursor.
        // But cursor tracking is hard without constant state updates.
        // Let's try to use the last known cursor position or just append for blocks.

        editorRef.current.appendChild(node);
        const br = document.createElement('br');
        editorRef.current.appendChild(br);
        parseAndNotify();
    };

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                style={{
                    minHeight: '120px',
                    backgroundColor: 'var(--color-bg-input)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    color: 'white',
                    outline: 'none',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                }}
                data-placeholder={placeholder}
            />

            {/* Toolbar */}
            <div style={{
                marginTop: '0.5rem',
                display: 'flex',
                gap: '1rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '0.5rem'
            }}>
                <button
                    onClick={insertImage}
                    type="button"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Resim
                </button>

                <button
                    onClick={insertLink}
                    type="button"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Link
                </button>

                <button
                    onClick={insertYoutube}
                    type="button"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff0000',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.9rem'
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                    YouTube
                </button>
            </div>

            {/* Mentions Dropdown */}
            {showMentions && filteredClubs.length > 0 && cursorPosition && (
                <div style={{
                    position: 'fixed', // Fixed to break out of overflow hidden parents if any
                    top: cursorPosition.top + 5,
                    left: cursorPosition.left,
                    backgroundColor: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    minWidth: '200px'
                }}>
                    {filteredClubs.map(club => (
                        <div
                            key={club.id}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent focus loss
                                insertMention(club);
                            }}
                            style={{
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-bg-sidebar)',
                                overflow: 'hidden'
                            }}>
                                {club.profilePicture ? (
                                    <img src={club.profilePicture} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                        {club.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <span>{club.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RichPostEditor;
