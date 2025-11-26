import React, { useState } from 'react';
import * as authService from '@/service/authService';

/**
 * ClubRegistrationPage
 * Allows admin to register new clubs.
 * Connects to /api/v1/auth/register
 */
const ClubRegistrationPage: React.FC = () => {
    // State for form fields
    // State for form fields
    const [formData, setFormData] = useState({
        clubName: '',
        email: '',
        password: ''
    });

    // State for UI feedback
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await authService.register(formData);
            setStatus('success');
            setMessage('Kulüp başarıyla oluşturuldu!');
            setFormData({ clubName: '', email: '', password: '' }); // Reset form
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Sunucuya bağlanılamadı.');
        }
    };

    return (
        <div style={{
            maxWidth: '800px', // Limit width for better readability on large screens
            backgroundColor: 'var(--color-bg-panel)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <header style={{ marginBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-md)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-xs)', color: 'white' }}>Yeni Kulüp Kaydı</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    Sisteme yeni bir öğrenci kulübü ekleyin.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="form-group">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="clubName">KULÜP ADI</label>
                        <input
                            id="clubName"
                            name="clubName"
                            type="text"
                            className="form-input"
                            placeholder="Örn: Sinema Kulübü"
                            value={formData.clubName}
                            onChange={handleChange}
                            required
                            minLength={2}
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">E-POSTA ADRESİ</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            placeholder="kulup@universite.edu.tr"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                        minLength={8}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                        style={{ minWidth: '150px' }}
                    >
                        {status === 'loading' ? 'KAYDEDİLİYOR...' : 'KULÜBÜ KAYDET'}
                    </button>
                </div>

                {message && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-sm)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: status === 'error' ? 'rgba(255, 92, 92, 0.1)' : 'rgba(39, 174, 96, 0.1)',
                        color: status === 'error' ? 'var(--color-error)' : 'var(--color-primary)',
                        border: `1px solid ${status === 'error' ? 'var(--color-error)' : 'var(--color-primary)'}`,
                        textAlign: 'center',
                        fontSize: '0.875rem'
                    }}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default ClubRegistrationPage;
