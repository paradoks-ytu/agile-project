import React, { useState } from 'react';
import * as postService from '@/service/postService';
import type { PostResponse } from '@/types/postTypes';
import TipTapEditor from './TipTapEditor';

interface CreatePostFormProps {
    onPostCreated: (post: PostResponse) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const newPost = await postService.createPost({ title, content });
            onPostCreated(newPost);
            setTitle('');
            setContent(''); // Note: RichPostEditor needs to be reset, we might need a key or ref
        } catch (err: any) {
            setError(err.message || 'Gönderi oluşturulamadı.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            backgroundColor: 'var(--color-bg-panel)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-xl)',
            border: '1px solid var(--color-border)'
        }}>
            <h4 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: '1rem' }}>Yeni Gönderi Oluştur</h4>

            {error && (
                <div style={{
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: '#ff4444',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <input
                        type="text"
                        placeholder="Başlık"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--color-bg-input)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.8rem',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    {/* Key forces re-render to reset content on submit */}
                    <TipTapEditor
                        key={loading ? 'loading' : 'idle'}
                        onChange={setContent}
                        placeholder="Neler oluyor? (@kulüp veya resim ekle)"
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        disabled={loading || !title.trim() || !content.trim()}
                        className="btn btn-primary"
                        style={{
                            opacity: (loading || !title.trim() || !content.trim()) ? 0.7 : 1,
                            cursor: (loading || !title.trim() || !content.trim()) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Paylaşılıyor...' : 'Paylaş'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostForm;
