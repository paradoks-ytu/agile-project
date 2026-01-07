import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../../service/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const [studentFormData, setStudentFormData] = useState({
        firstName: '',
        secondName: '',
        email: '',
        password: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentFormData({
            ...studentFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await authService.registerUser(studentFormData);
            // Store email for verification page
            localStorage.setItem('pending_verify_email', studentFormData.email);

            alert('Doğrulama kodu e-posta adresinize gönderildi.');
            navigate('/verify');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Kayıt başarısız.');
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

            {/* Main Content Area */}
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
                        maxWidth: '440px',
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
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: 'var(--spacing-sm)' }}>Kayıt Ol</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            Öğrenci olarak UniNest'e katılın.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="form-group">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="firstName">AD</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-input"
                                    placeholder="Ahmet"
                                    value={studentFormData.firstName}
                                    onChange={handleStudentChange}
                                    required
                                    minLength={2}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="secondName">SOYAD</label>
                                <input
                                    id="secondName"
                                    name="secondName"
                                    type="text"
                                    className="form-input"
                                    placeholder="Yılmaz"
                                    value={studentFormData.secondName}
                                    onChange={handleStudentChange}
                                    required
                                    minLength={2}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="studentEmail">E-POSTA</label>
                            <input
                                id="studentEmail"
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder="ad.soyad@ogrenci.edu.tr"
                                value={studentFormData.email}
                                onChange={handleStudentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="studentPassword">ŞİFRE</label>
                            <input
                                id="studentPassword"
                                name="password"
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={studentFormData.password}
                                onChange={handleStudentChange}
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={status === 'loading'}
                            style={{ marginTop: 'var(--spacing-md)' }}
                        >
                            {status === 'loading' ? 'KAYIT YAPILIYOR...' : 'KAYIT OL'}
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

                        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            Zaten hesabınız var mı? <a href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>Giriş Yap</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
