import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';

interface TipTapRendererProps {
    content: string; // JSON string
}

const TipTapRenderer: React.FC<TipTapRendererProps> = ({ content }) => {
    let jsonContent;
    try {
        jsonContent = JSON.parse(content);
    } catch (e) {
        // Fallback for legacy content or invalid JSON
        // We can wrap legacy content in a paragraph node
        jsonContent = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: content
                        }
                    ]
                }
            ]
        };
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Mention.extend({
                renderHTML({ node, HTMLAttributes }) {
                    return [
                        'a',
                        {
                            ...HTMLAttributes,
                            href: `/clubs/${node.attrs.id}`,
                            target: '_self',
                            class: 'mention',
                        },
                        `@${node.attrs.label ?? node.attrs.id}`,
                    ];
                },
            }).configure({
                HTMLAttributes: {
                    class: 'mention',
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: true,
            }),
            Youtube.configure({
                controls: true,
                HTMLAttributes: {
                    class: 'editor-youtube',
                },
            }),
        ],
        content: jsonContent,
        editable: false, // Read-only
        editorProps: {
            attributes: {
                class: 'prose prose-invert text-white',
                style: 'color: #9ab; line-height: 1.6;'
            },
        },
    });

    if (!editor) {
        return null;
    }

    return <EditorContent editor={editor} />;
};

export default TipTapRenderer;
