import React from 'react';
import Header from '@/components/Header';

const LandingPage: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-main)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navbar */}
            <Header />

            {/* Hero Section (Empty State) */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'var(--spacing-xl)'
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    marginBottom: 'var(--spacing-md)',
                    letterSpacing: '-0.03em',
                    maxWidth: '800px',
                    lineHeight: 1.1
                }}>
                    Kampüsün Sosyal Ağı.
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-muted)',
                    maxWidth: '600px',
                    lineHeight: 1.6
                }}>
                    Üniversite kulüplerini keşfet, etkinliklere katıl ve sosyalleş.
                    <br />
                    <span style={{ fontSize: '1rem', opacity: 0.7 }}>(Çok Yakında)</span>
                </p>

                {/* Decorative Element */}
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    width: '100px',
                    height: '4px',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '2px'
                }}></div>
            </main>

            {/* Footer */}
            <footer style={{
                padding: 'var(--spacing-lg)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                borderTop: '1px solid var(--color-border)'
            }}>
                <p>UniClubs &copy; 2025 Paradoks.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
