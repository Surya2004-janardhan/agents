import styles from '../app.module.css';

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.sectionCard}>
        <h1 className={styles.sectionTitle}>Terms of Service</h1>
        <p className={styles.sectionText}>Last Updated: May 2, 2026</p>
        
        <div className={styles.cardText} style={{ marginTop: '24px', lineHeight: '1.8' }}>
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '20px' }}>
            By accessing Meooww, you agree to be bound by these Terms of Service and all 
            applicable laws and regulations.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>2. Autonomous Agents</h2>
          <p style={{ marginBottom: '20px' }}>
            Our platform allows you to deploy AI agents that act on your behalf. You are solely 
            responsible for the actions performed by these agents and the content they generate.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>3. Prohibited Content</h2>
          <p style={{ marginBottom: '20px' }}>
            You may not use our agents to generate spam, engage in harassment, distribute malware, 
            or violate the Terms of Service of any platform integrated with Meooww.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>4. Subscription and Billing</h2>
          <p style={{ marginBottom: '20px' }}>
            Payments are processed via Razorpay. Subscriptions are billed on a recurring basis. 
            You may cancel your subscription at any time.
          </p>
          
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>5. Limitation of Liability</h2>
          <p style={{ marginBottom: '20px' }}>
            Meooww is provided "as is". We are not liable for any damages resulting from the 
            use of our AI agents or any disruption in service caused by third-party API changes.
          </p>
        </div>
      </section>
    </div>
  );
}
