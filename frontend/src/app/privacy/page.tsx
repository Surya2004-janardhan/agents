import styles from '../app.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <section className={styles.sectionCard}>
        <h1 className={styles.sectionTitle}>Privacy Policy</h1>
        <p className={styles.sectionText}>Last Updated: May 2, 2026</p>
        
        <div className={styles.cardText} style={{ marginTop: '24px', lineHeight: '1.8' }}>
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: '20px' }}>
            To provide our autonomous agent services, we collect information you explicitly provide, 
            including your email and social media credentials via OAuth (e.g., Google, Instagram, LinkedIn, YouTube).
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>2. Use of Connected Accounts</h2>
          <p style={{ marginBottom: '20px' }}>
            OAuth tokens are used exclusively to perform actions as directed by your agent configurations. 
            We do not use these tokens for any purpose other than executing your requested workflows.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>3. Data Security</h2>
          <p style={{ marginBottom: '20px' }}>
            Your credentials and session tokens are encrypted at rest and in transit. We implement 
            industry-standard security measures to protect your identity.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>4. Third-Party API Integration</h2>
          <p style={{ marginBottom: '20px' }}>
            Our service interacts with third-party APIs (Google Cloud, Meta Graph API, LinkedIn API). 
            Your use of these integrations is also subject to the respective platforms' privacy policies.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>5. Revoking Access</h2>
          <p style={{ marginBottom: '20px' }}>
            You may revoke our access to your social accounts at any time through the Meooww 
            "Identity" settings or directly via the third-party platform's security settings.
          </p>
        </div>
      </section>
    </div>
  );
}
