'use client';

import { useState, useEffect } from 'react';
import styles from '../app.module.css';

const PROVIDERS = [
  { id: 'google', name: 'Google Cloud & Workspace', icon: 'google' },
  { id: 'instagram', name: 'Instagram Business', icon: 'instagram' },
  { id: 'youtube', name: 'YouTube Content', icon: 'youtube' },
];

export default function CredentialsPage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from /api/credentials
    setLoading(false);
  }, []);

  const handleConnect = async (provider: string) => {
    // Mock connecting
    alert(`Redirecting to ${provider} OAuth flow...`);
    // After redirect back, the backend would have the token
    setConnections([...connections, { provider, createdAt: new Date() }]);
  };

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>Account Connections</div>
            <h1 className={styles.sectionTitle}>Manage Your Identity</h1>
          </div>
        </div>
        <p className={styles.sectionText}>
          Connect your accounts once and use them across all agents. Your data is encrypted 
          and only used to execute your requested tasks.
        </p>
      </section>

      <section className={styles.grid3}>
        {PROVIDERS.map((provider) => {
          const isConnected = connections.find(c => c.provider === provider.id);
          return (
            <div key={provider.id} className={`${styles.routeCard} glass`}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.routeTitle}>{provider.name}</h3>
                {isConnected ? (
                  <span className={styles.badge} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>Connected</span>
                ) : (
                  <span className={styles.tag}>Not Connected</span>
                )}
              </div>
              <p className={styles.cardText}>
                {isConnected 
                  ? `Authenticated as your-email@gmail.com. Active for all ${provider.id === 'google' ? '30+' : ''} integrated APIs.` 
                  : `Allow agents to access ${provider.name} to perform autonomous tasks.`}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                {isConnected ? (
                  <button className={styles.secondaryButton} style={{ width: '100%' }}>Disconnect</button>
                ) : (
                  <button 
                    onClick={() => handleConnect(provider.id)} 
                    className={styles.primaryButton} 
                    style={{ width: '100%' }}
                  >
                    Connect {provider.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
