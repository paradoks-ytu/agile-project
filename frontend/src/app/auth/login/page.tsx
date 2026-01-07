import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../../service/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const [isClubLogin, setIsClubLogin] = useState(true);

    useEffect(() => {
        if (authService.isAuthenticated()) {
            const role = authService.getUserRole();
            if (role === 'student') navigate('/profile');
            else navigate('/myprofile');
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            if (isClubLogin) {
                await authService.login(formData);
                navigate('/myprofile');
            } else {
                await authService.loginUser(formData);
                navigate('/profile');
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Giriş başarısız.');
        }
        setStatus('idle');
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: 'var(--color-bg-main)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}
        >
            {/* ... Back Button ... */}
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
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
                title="Ana Sayfaya Dön"
            >
                ←
            </button>

            {/* Main Content Area (Full Screen Height) */}
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-md)',
                width: '100%'
            }}>
                <div
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: 'var(--color-bg-panel)',
                        padding: 'var(--spacing-xl)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--color-primary)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '1.5rem',
                            margin: '0 auto var(--spacing-md)'
                        }}>U</div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: 'var(--spacing-sm)' }}>Giriş Yap</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Hesabınıza erişmek için giriş yapın.
                        </p>
                    </div>

                    {/* Role Toggle */}
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'var(--color-bg-main)',
                        padding: '4px',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-lg)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <button
                            type="button"
                            onClick={() => setIsClubLogin(true)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: isClubLogin ? 'var(--color-bg-panel)' : 'transparent',
                                color: isClubLogin ? 'white' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                                fontWeight: isClubLogin ? 600 : 400,
                                transition: 'all 0.2s',
                                boxShadow: isClubLogin ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            Kulüp
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsClubLogin(false)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: !isClubLogin ? 'var(--color-bg-panel)' : 'transparent',
                                color: !isClubLogin ? 'white' : 'var(--color-text-muted)',
                                cursor: 'pointer',
                                fontWeight: !isClubLogin ? 600 : 400,
                                transition: 'all 0.2s',
                                boxShadow: !isClubLogin ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            Öğrenci
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="form-group">
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">E-POSTA</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder={isClubLogin ? "kulup@universite.edu.tr" : "ogrenci@universite.edu.tr"}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">ŞİFRE</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={status === 'loading'}
                            style={{ marginTop: 'var(--spacing-sm)' }}
                        >
                            {status === 'loading' ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
                        </button>

                        {message && (
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

                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        Hesabınız yok mu? <a href="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Kayıt Ol</a>
                    </div>
                </div>
            </div>

            {/* Footer (Below the fold) */}
            <footer style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-main)',
                width: '100%'
            }}>
                <p>UniNest &copy; 2025 Paradoks.</p>
            </footer>
        </div>
    );
};

export default LoginPage;
