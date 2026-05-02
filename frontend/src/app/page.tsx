import Link from 'next/link';
import styles from './app.module.css';

const quickRoutes = [
  {
    href: '/agents',
    title: 'Autonomous Agents',
    text: 'Deploy high-performance, curated agents designed for complex reasoning and multi-step execution.',
    tags: ['Production Ready', 'Adaptive Memory'],
  },
  {
    href: '/workflows',
    title: 'Curated Workflows',
    text: 'Scale your operations with pre-orchestrated workflows that handle repetitive tasks with precision.',
    tags: ['Low Latency', 'High Throughput'],
  },
  {
    href: '/schedule',
    title: 'Intelligent Scheduling',
    text: 'Automate your agents with sophisticated cron scheduling and event-driven triggers.',
    tags: ['Auto-scale', 'Persistent'],
  },
];

export default function HomePage() {
  return (
    <div className={`${styles.page} animate-fade-in`}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>
            <span className={styles.badge}>Next-Gen Orchestration</span>
            <span>Unleash the power of persistent memory</span>
          </div>
          <h1 className={styles.title}>The Future of Agentic Workflows.</h1>
          <p className={styles.subtitle}>
            A premium workbench for deploying approved agents, scaling curated workflows, and managing 
            intelligent schedules with the power of long-term adaptive memory.
          </p>
          <div className={styles.heroActions}>
            <Link href="/agents" className={styles.primaryButton}>
              Launch Agents
            </Link>
            <Link href="/workflows" className={styles.secondaryButton}>
              Explore Workflows
            </Link>
            <Link href="/schedule" className={styles.ghostButton}>
              Configure Cron
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionLabel}>Operations</div>
            <h2 className={styles.sectionTitle}>Precision Control</h2>
          </div>
          <span className={styles.pill}>Unified Navigation</span>
        </div>

        <div className={styles.grid3}>
          {quickRoutes.map((route, i) => (
            <Link 
              key={route.href} 
              href={route.href} 
              className={`${styles.routeCard} glass`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <h3 className={styles.routeTitle}>{route.title}</h3>
              <p className={styles.cardText}>{route.text}</p>
              <div className={styles.tagRow}>
                {route.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Visual background elements */}
      <div className="bg-glow" />
    </div>
  );
}
