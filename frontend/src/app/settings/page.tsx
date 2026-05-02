import styles from '../app.module.css';

export default function SettingsPage() {
  return (
    <div className={`${styles.page} animate-fade-in`}>
      <header className={`${styles.sectionHeader} animate-stagger stagger-1`}>
        <div>
          <div className={styles.sectionLabel}>Configuration</div>
          <h1 className={`${styles.sectionTitle} cat-ear`}>Settings & Providers</h1>
        </div>
      </header>

      <section className={`${styles.sectionCard} animate-stagger stagger-2`}>
        <div className={`${styles.routeCard} glass`}>
          <h2 className={styles.routeTitle}>API Providers</h2>
          <p className={styles.cardText}>
            Connect your AI models and external services to enable Agent execution.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px' }}>
              <div>
                <strong style={{ display: 'block' }}>OpenAI</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required for reasoning agents</span>
              </div>
              <button className={styles.secondaryButton} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Connect</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px' }}>
              <div>
                <strong style={{ display: 'block' }}>Anthropic</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enable Claude models</span>
              </div>
              <button className={styles.secondaryButton} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Connect</button>
            </div>
          </div>
        </div>

        <div className={`${styles.routeCard} glass animate-stagger stagger-3`}>
          <h2 className={styles.routeTitle}>Account Security</h2>
          <p className={styles.cardText}>
            Manage your email verification and account settings.
          </p>
          <button className={styles.primaryButton} style={{ marginTop: '10px' }}>Verify Email</button>
        </div>
      </section>
    </div>
  );
}
