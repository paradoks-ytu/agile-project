import React, { useCallback } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import * as authService from '../service/authService';
import type { ClubResponse } from '../types/authTypes';

// Define types for suggestion items
interface SuggestionItem {
    id: number;
    label: string;
    profilePicture?: string | null;
}

// Suggestion Logic for Mentions
const suggestion = {
    char: '@',
    items: async ({ query }: { query: string }): Promise<SuggestionItem[]> => {
        try {
            const response = await authService.getClubs(0, 50);
            const clubs: ClubResponse[] = response.content;
            return clubs
                .filter((club) => club.name.toLowerCase().startsWith(query.toLowerCase()))
                .slice(0, 5)
                .map((club) => ({ id: club.id, label: club.name, profilePicture: club.profilePicture }));
        } catch (e) {
            return [];
        }
    },

    render: () => {
        let component: ReactRenderer;
        let popup: any;

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
            },

            onUpdate(props: any) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                    popup[0].hide();
                    return true;
                }

                // @ts-ignore - Component ref type issue with TipTap ReactRenderer
                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};

// Mention List Component
const MentionList = React.forwardRef((props: { items: SuggestionItem[], command: (item: any) => void }, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command({ id: item.id, label: item.label });
        }
    };

    React.useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
                return true;
            }

            if (event.key === 'ArrowDown') {
                setSelectedIndex((selectedIndex + 1) % props.items.length);
                return true;
            }

            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }

            if (event.key === 'Tab') {
                event.preventDefault();
                selectItem(selectedIndex);
                return true;
            }

            return false;
        },
    }));

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    return (
        <div className="mention-list" style={{
            backgroundColor: 'var(--color-bg-panel)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            minWidth: '200px'
        }}>
            {props.items.length ? (
                props.items.map((item, index) => (
                    <button
                        className={`mention-item ${index === selectedIndex ? 'is-selected' : ''}`}
                        key={index}
                        onClick={() => selectItem(index)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: index === selectedIndex ? 'var(--color-bg-sidebar)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg-main)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem'
                        }}>
                            {item.profilePicture ? (
                                <img src={item.profilePicture} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                item.label.charAt(0)
                            )}
                        </div>
                        {item.label}
                    </button>
                ))
            ) : (
                <div style={{ padding: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sonuç bulunamadı</div>
            )}
        </div>
    );
});

import { useEffect } from 'react';

interface TipTapEditorProps {
    onChange: (content: string) => void;
    placeholder?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onChange, placeholder }) => {
    const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const [highlightColor, setHighlightColor] = React.useState('#27AE60'); // Default green

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Bir şeyler yaz...',
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion,
                renderLabel({ options, node }) {
                    return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            Youtube.configure({
                controls: false,
                HTMLAttributes: {
                    class: 'editor-youtube',
                },
            }),
            Underline,
            Highlight.configure({
                multicolor: true,
            }),
            Subscript,
            Superscript,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            onChange(JSON.stringify(json));
        },
        onSelectionUpdate: () => {
            forceUpdate();
        },
        onTransaction: () => {
            forceUpdate();
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert focus:outline-none min-h-[120px] p-4 text-white',
                style: 'min-height: 120px; padding: 1rem; color: white; outline: none;'
            },
        },
    });

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const addImage = useCallback(() => {
        const url = window.prompt('Resim URL\'si:');
        if (url) {
            if (isValidUrl(url)) {
                editor?.chain().focus().setImage({ src: url }).run();
            } else {
                alert('Geçersiz URL!');
            }
        }
    }, [editor]);

    const addLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        if (isValidUrl(url)) {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        } else {
            alert('Geçersiz URL! Lütfen http:// veya https:// ile başlayan bir adres girin.');
        }
    }, [editor]);

    const addYoutube = useCallback(() => {
        const url = window.prompt('YouTube Video URL\'si:');

        if (url) {
            if (isValidUrl(url) && (url.includes('youtube.com') || url.includes('youtu.be'))) {
                editor?.commands.setYoutubeVideo({ src: url });
            } else {
                alert('Geçersiz YouTube URL\'si!');
            }
        }
    }, [editor]);

    const toggleHighlight = useCallback(() => {
        editor?.chain().focus().toggleHighlight({ color: highlightColor }).run();
    }, [editor, highlightColor]);

    if (!editor) {
        return null;
    }

    return (
        <div style={{
            backgroundColor: 'var(--color-bg-input)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Main Toolbar - Moved to Top */}
            <div style={{
                display: 'flex',
                gap: '0.25rem',
                padding: '0.5rem',
                borderBottom: '1px solid var(--color-border)', // Changed to borderBottom
                backgroundColor: '#171D22',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Undo / Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>}
                    title="Geri Al"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"></path></svg>}
                    title="İleri Al"
                />

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Headings */}
                <select
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'p') editor.chain().focus().setParagraph().run();
                        else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                        else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                        else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                    }}
                    value={editor.isActive('heading', { level: 1 }) ? 'h1' : editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
                    style={{
                        background: 'transparent',
                        color: 'var(--color-text-main)',
                        border: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0 0.5rem',
                        outline: 'none'
                    }}
                >
                    <option value="p">Normal</option>
                    <option value="h1">Başlık 1</option>
                    <option value="h2">Başlık 2</option>
                    <option value="h3">Başlık 3</option>
                </select>

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Lists & Blockquote & HR */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>}
                    title="Liste"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>}
                    title="Sıralı Liste"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
                    title="Alıntı"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    isActive={false}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
                    title="Ayırıcı"
                />

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Code Block */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><path d="M9 16v-8"></path><path d="M15 8v8"></path><path d="M9 12h6"></path></svg>}
                    title="Kod Bloğu"
                />

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>}
                    title="Kalın"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>}
                    title="İtalik"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><path d="M16 6C16 6 14.5 4 12 4C9.5 4 8 6 8 6"></path><path d="M8 18C8 18 9.5 20 12 20C14.5 20 16 18 16 18"></path></svg>}
                    title="Üstü Çizili"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>}
                    title="Satır İçi Kod"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>}
                    title="Altı Çizili"
                />

                {/* Highlight with Color Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ToolbarButton
                        onClick={toggleHighlight}
                        isActive={editor.isActive('highlight')}
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>}
                        title="Vurgula"
                    />
                    <input
                        type="color"
                        value={highlightColor}
                        onChange={(e) => {
                            setHighlightColor(e.target.value);
                            editor.chain().focus().toggleHighlight({ color: e.target.value }).run();
                        }}
                        style={{
                            width: '20px',
                            height: '20px',
                            padding: 0,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                        }}
                        title="Vurgu Rengi Seç"
                    />
                </div>

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Sub/Sup */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    isActive={editor.isActive('subscript')}
                    icon={<span style={{ fontSize: '10px', fontWeight: 'bold' }}>X<sub>2</sub></span>}
                    title="Alt Simge"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    isActive={editor.isActive('superscript')}
                    icon={<span style={{ fontSize: '10px', fontWeight: 'bold' }}>X<sup>2</sup></span>}
                    title="Üst Simge"
                />

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Align */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>}
                    title="Sola Hizala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>}
                    title="Ortala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>}
                    title="Sağa Hizala"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>}
                    title="Yasla"
                />

                <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }}></div>

                {/* Media Add Buttons (Link, Image, YouTube) */}
                <ToolbarButton
                    onClick={addLink}
                    isActive={editor.isActive('link')}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>}
                    title="Link Ekle"
                />
                <ToolbarButton
                    onClick={addImage}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>}
                    title="Resim Ekle"
                />
                <ToolbarButton
                    onClick={addYoutube}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>}
                    title="YouTube Ekle"
                />

            </div>

            {/* Editor Content Area - Scrollable */}
            <div style={{
                maxHeight: '60vh',
                overflowY: 'auto',
                backgroundColor: 'var(--color-bg-input)'
            }}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

const ToolbarButton = ({ onClick, isActive, icon, title, disabled }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        type="button"
        style={{
            background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            border: 'none',
            borderRadius: '4px',
            color: disabled ? 'var(--color-text-muted)' : (isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'),
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
            width: '28px',
            height: '28px'
        }}
    >
        {icon}
    </button>
);


export default TipTapEditor;
