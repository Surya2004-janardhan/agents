'use client';

import { useState } from 'react';
import styles from '../app.module.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    // 1. Create order on backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 50000 }), // ₹500
    });
    const { order } = await response.json();

    // 2. Open Razorpay Checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Meooww',
      description: 'Pro Plan Subscription',
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify payment on backend
        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert('Welcome to Pro!');
          window.location.href = '/dashboard';
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
      },
      theme: {
        color: '#6366f1',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <div className={`${styles.page} animate-fade-in`}>
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>Subscription</div>
            <h1 className={styles.sectionTitle}>Upgrade to Pro</h1>
          </div>
        </div>
        <p className={styles.sectionText}>
          Unlock unlimited agents, multi-tasking workflows, and priority API access.
        </p>
      </section>

      <section className={styles.grid3}>
        <div className={`${styles.routeCard} glass`} style={{ border: '2px solid var(--accent-primary)' }}>
          <h3 className={styles.routeTitle}>Pro Plan</h3>
          <p className={styles.cardText}>₹500 / month</p>
          <ul className={styles.tagRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginTop: '16px' }}>
            <li className={styles.tag}>Unlimited Agents</li>
            <li className={styles.tag}>Multi-step Workflows</li>
            <li className={styles.tag}>GitHub Integration</li>
            <li className={styles.tag}>Priority Support</li>
          </ul>
          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <button 
              onClick={handlePayment} 
              disabled={loading}
              className={styles.primaryButton} 
              style={{ width: '100%' }}
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
