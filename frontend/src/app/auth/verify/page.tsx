import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as authService from '../../../service/authService';

const VerifyPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Auto-fill from LocalStorage (primary) or URL (fallback)
    const [email, setEmail] = useState(localStorage.getItem('pending_verify_email') || searchParams.get('email') || '');
    const [code, setCode] = useState(searchParams.get('code') || '');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await authService.verifyUser(email, code);
            setStatus('success');
            localStorage.removeItem('pending_verify_email'); // Cleanup
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Doğrulama başarısız.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-md)'
        }}>
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    left: 'var(--spacing-xl)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--color-border)',
                    backdropFilter: 'blur(12px)',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    zIndex: 10
                }}
                title="Ana Sayfaya Dön"
            >
                ←
            </button>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'var(--color-bg-panel)',
                padding: 'var(--spacing-xl)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--color-success)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: '1.5rem',
                        margin: '0 auto var(--spacing-md)'
                    }}>✓</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: 'var(--spacing-xs)' }}>
                        Hesabı Doğrula
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        E-posta adresinize gelen 6 haneli kodu girin.
                    </p>
                </div>

                {status === 'success' ? (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        color: 'var(--color-success)',
                        border: '1px solid var(--color-success)',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Doğrulama Başarılı! 🎉</p>
                        <p style={{ fontSize: '0.9rem' }}>Giriş sayfasına yönlendiriliyorsunuz...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="form-group">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">E-POSTA</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="ad.soyad@ogrenci.edu.tr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="code">DOĞRULAMA KODU</label>
                            <input
                                id="code"
                                type="text"
                                className="form-input"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                maxLength={6}
                                style={{ letterSpacing: '0.2rem', textAlign: 'center', fontSize: '1.2rem' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={status === 'loading'}
                            style={{ marginTop: 'var(--spacing-sm)' }}
                        >
                            {status === 'loading' ? 'DOĞRULANIYOR...' : 'DOĞRULA'}
                        </button>

                        {message && status === 'error' && (
                            <div style={{
                                marginTop: 'var(--spacing-md)',
                                padding: 'var(--spacing-sm)',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(255, 92, 92, 0.1)',
                                color: 'var(--color-error)',
                                border: '1px solid var(--color-error)',
                                textAlign: 'center',
                                fontSize: '0.875rem'
                            }}>
                                {message}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default VerifyPage;
