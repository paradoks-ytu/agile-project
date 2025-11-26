import React from 'react';

const DashboardPage: React.FC = () => {
    return (
        <div style={{
            backgroundColor: 'var(--color-bg-panel)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'var(--color-text-muted)'
        }}>
            <h2 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>Dashboard</h2>
            <p>Hoş geldiniz! Sol menüden işlemlere devam edebilirsiniz.</p>
        </div>
    );
};

export default DashboardPage;
