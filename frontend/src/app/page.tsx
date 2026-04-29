'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';
import { providerOptions, workflowBlueprints } from '../lib/providerCatalog';

const navigation = [
  { label: 'Workbench', meta: 'Compose and ship', active: true },
  { label: 'Agents', meta: 'Templates' },
  { label: 'Workflows', meta: 'Automations' },
  { label: 'Runs', meta: 'History' },
  { label: 'Knowledge', meta: 'RAG' },
  { label: 'Events', meta: 'Webhooks' },
];

const agentCards = [
  {
    title: 'Research Analyst',
    description: 'Break down a topic, fetch references, and draft a short executive brief.',
    badges: ['Research', 'Citations', 'Fast'],
  },
  {
    title: 'Support Copilot',
    description: 'Classify tickets, summarize history, and prepare a ready-to-send reply.',
    badges: ['Support', 'Triage', 'Auto-draft'],
  },
  {
    title: 'Ops Router',
    description: 'Route tasks to the right workflow and keep an audit trail by default.',
    badges: ['Automation', 'Audit', 'Rules'],
  },
];

const runFeed = [
  {
    title: 'Lead enrichment workflow',
    status: 'live',
    detail: '3-step enrichment flow completed in 2.9s using Groq + OpenRouter.',
  },
  {
    title: 'Daily support digest',
    status: 'idle',
    detail: 'Summaries generated from 48 tickets and routed to Slack.',
  },
  {
    title: 'Research brief',
    status: 'warning',
    detail: 'Waiting on citations pass before publishing to the team workspace.',
  },
];

export default function HomePage() {
  const [providerId, setProviderId] = useState(providerOptions[1].id);
  const [model, setModel] = useState(providerOptions[1].models[0]);
  const [temperature, setTemperature] = useState(0.3);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [workflowMode, setWorkflowMode] = useState('Research brief');
  const [prompt, setPrompt] = useState(
    'Turn a rough product idea into a clear workflow with roles, steps, and a concise output format.',
  );

  const provider = useMemo(
    () => providerOptions.find((option) => option.id === providerId) ?? providerOptions[0],
    [providerId],
  );

  const shortModel = model.length > 28 ? `${model.slice(0, 28)}…` : model;

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brandRow}>
          <div className={styles.brandMark} />
          <div>
            <div className={styles.brandTitle}>Signal Forge</div>
            <div className={styles.brandSub}>Core logic for agents, workflows, knowledge, tools, and events</div>
          </div>
        </div>

        <div className={styles.topbarMeta}>
          <span className={styles.topline}>Node-first stack</span>
          <span className={styles.topline}>Different UI, same backend power</span>
          <button className={styles.buttonSecondary}>Open run history</button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.panelCard}>
            <div className={styles.sectionTitle}>Workspace</div>
            <div className={styles.navList}>
              {navigation.map((item) => (
                <div key={item.label} className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}>
                  <span>{item.label}</span>
                  <span className={styles.navMeta}>{item.meta}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panelCard}>
            <div className={styles.sectionTitle}>Today</div>
            <div className={styles.metricList}>
              <div className={styles.metricCard}>
                <p className={styles.metricValue}>24</p>
                <p className={styles.metricLabel}>jobs queued today</p>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricValue}>1.8k</p>
                <p className={styles.metricLabel}>tokens saved with memory</p>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricValue}>99.4%</p>
                <p className={styles.metricLabel}>provider availability observed</p>
              </div>
            </div>
          </div>

          <div className={styles.panelCard}>
            <div className={styles.sectionTitle}>Quick facts</div>
            <div className={styles.sidebarNotes}>
              <div>
                <strong>Knowledge base</strong>
                <p>Docs are ready for uploads and search.</p>
              </div>
              <div>
                <strong>Logs</strong>
                <p>Execution trace endpoints are wired in.</p>
              </div>
              <div>
                <strong>Tools</strong>
                <p>Web search, files, API calls, and custom tools.</p>
              </div>
              <div>
                <strong>Webhooks</strong>
                <p>Event delivery and test endpoints are available.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className={styles.mainColumn}>
          <section className={styles.heroCard}>
            <div className={styles.heroLayout}>
              <div className={styles.heroCopy}>
                <div className={styles.heroKicker}>
                  <span className={styles.badgeLive}>Live workbench</span>
                  <span>Backend logic first, UI second</span>
                </div>
                <h1 className={styles.heroTitle}>
                  Build agents and workflows with a cleaner, sharper product identity.
                </h1>
                <p className={styles.heroText}>
                  This studio keeps the core capabilities you need - provider selection, prompt drafting, templates,
                  knowledge, tools, logs, and webhooks - while using a completely different visual language.
                </p>

                <div className={styles.heroActions}>
                  <button className={styles.buttonPrimary}>Create workflow</button>
                  <button className={styles.buttonSecondary}>Run selected agent</button>
                  <button className={styles.buttonGhost}>Open knowledge</button>
                </div>

                <div className={styles.heroStatsRow}>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Provider</div>
                    <div className={styles.statValue}>{provider.name}</div>
                    <div className={styles.statNote}>{provider.label}</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Current model</div>
                    <div className={styles.statValue}>{shortModel}</div>
                    <div className={styles.statNote}>{workflowMode}</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Memory</div>
                    <div className={styles.statValue}>{memoryEnabled ? 'On' : 'Off'}</div>
                    <div className={styles.statNote}>State is controlled per run.</div>
                  </div>
                </div>
              </div>

              <div className={styles.heroRail}>
                <div className={styles.railCard}>
                  <div className={styles.sectionTitle}>Execution focus</div>
                  <p>
                    Prompt drafting, provider switching, workflow routing, logging, and event delivery are all exposed
                    in the backend.
                  </p>
                </div>
                <div className={styles.railCardAccent}>
                  <div className={styles.railAccentLabel}>Selected mode</div>
                  <div className={styles.railAccentValue}>{workflowMode}</div>
                  <div className={styles.railAccentNote}>4-step plan with tool-aware execution.</div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.contentGrid}>
            <div className={styles.surfaceCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionTitle}>Prompt studio</div>
                  <h2 className={styles.sectionHeading}>Compose the input for a workflow or agent</h2>
                </div>
                <span className={styles.pillAlt}>Direct control</span>
              </div>

              <textarea
                className={styles.promptInput}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe the task, constraints, tools, and output format."
              />

              <div className={styles.toolbar}>
                <div className={styles.chipRow}>
                  <span className={styles.chip}>Memory on</span>
                  <span className={styles.chip}>Tool aware</span>
                  <span className={styles.chip}>Audit log</span>
                  <span className={styles.chip}>Retries</span>
                </div>
                <button className={styles.buttonPrimary}>Send to {workflowMode}</button>
              </div>
            </div>

            <div className={styles.surfaceCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionTitle}>Model control</div>
                  <h2 className={styles.sectionHeading}>Provider, model, and execution settings</h2>
                </div>
              </div>

              <div className={styles.configStack}>
                <label className={styles.control}>
                  <span className={styles.label}>Provider</span>
                  <select
                    className={styles.select}
                    value={providerId}
                    onChange={(event) => {
                      const nextProvider = providerOptions.find((option) => option.id === event.target.value) ?? providerOptions[0];
                      setProviderId(nextProvider.id);
                      setModel(nextProvider.models[0]);
                    }}
                  >
                    {providerOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.control}>
                  <span className={styles.label}>Model</span>
                  <select className={styles.select} value={model} onChange={(event) => setModel(event.target.value)}>
                    {provider.models.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.control}>
                  <span className={styles.label}>Temperature: {temperature.toFixed(1)}</span>
                  <input
                    className={styles.slider}
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(event) => setTemperature(Number(event.target.value))}
                  />
                </label>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleText}>
                    <span className={styles.toggleTitle}>Conversation memory</span>
                    <span className={styles.toggleDesc}>Keep short context between runs.</span>
                  </div>
                  <button
                    type="button"
                    className={`${styles.switch} ${memoryEnabled ? styles.switchOn : ''}`}
                    onClick={() => setMemoryEnabled((value) => !value)}
                    aria-label="Toggle memory"
                  />
                </div>

                <label className={styles.control}>
                  <span className={styles.label}>Workflow template</span>
                  <select className={styles.select} value={workflowMode} onChange={(event) => setWorkflowMode(event.target.value)}>
                    {workflowBlueprints.map((workflow) => (
                      <option key={workflow.id} value={workflow.title}>
                        {workflow.title}
                      </option>
                    ))}
                  </select>
                </label>

                <button className={styles.buttonSecondary}>Preview run plan</button>
              </div>
            </div>

            <div className={styles.surfaceCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionTitle}>Workflow blueprints</div>
                  <h2 className={styles.sectionHeading}>Start from a practical template</h2>
                </div>
                <span className={styles.pillAlt}>Drag, edit, run</span>
              </div>

              <div className={styles.workflowGrid}>
                {workflowBlueprints.map((workflow) => (
                  <div key={workflow.id} className={styles.workflowCard}>
                    <div className={styles.workflowBar} style={{ background: `linear-gradient(90deg, ${workflow.gradient[0]}, ${workflow.gradient[1]})` }} />
                    <div className={styles.agentTop}>
                      <div>
                        <p className={styles.agentName}>{workflow.title}</p>
                        <p className={styles.agentDesc}>Built for quick orchestration and readable outputs.</p>
                      </div>
                      <span className={styles.pillAlt}>{workflow.steps.length} steps</span>
                    </div>
                    <div className={styles.workflowSteps}>
                      {workflow.steps.map((step) => (
                        <span key={step} className={styles.workflowStep}>
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.surfaceCard}>
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionTitle}>Agents</div>
                  <h2 className={styles.sectionHeading}>Templates for fast starts</h2>
                </div>
              </div>

              <div className={styles.agentList}>
                {agentCards.map((agent) => (
                  <div key={agent.title} className={styles.agentCard}>
                    <div className={styles.agentTop}>
                      <div>
                        <p className={styles.agentName}>{agent.title}</p>
                        <p className={styles.agentDesc}>{agent.description}</p>
                      </div>
                      <button className={styles.buttonGhost}>Open</button>
                    </div>
                    <div className={styles.agentMeta}>
                      {agent.badges.map((badge) => (
                        <span key={badge} className={styles.metaPill}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>Execution safety</h3>
                <p>Retries, memory, usage tracking, and provider selection are exposed without extra clicks.</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Fast iteration</h3>
                <p>The prompt box, model picker, and workflow templates keep the path from idea to run short.</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Unique identity</h3>
                <p>The palette and layout are intentionally different, so the product feels like its own system.</p>
              </div>
            </div>
          </section>
        </section>

        <aside className={styles.rightColumn}>
          <div className={styles.surfaceCard}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Run feed</div>
                <h2 className={styles.sectionHeading}>Latest executions</h2>
              </div>
            </div>
            <div className={styles.runList}>
              {runFeed.map((run) => (
                <div key={run.title} className={styles.runCard}>
                  <div className={styles.runTop}>
                    <div>
                      <p className={styles.runTitle}>{run.title}</p>
                      <p className={styles.runText}>{run.detail}</p>
                    </div>
                    <span
                      className={`${styles.statusPill} ${
                        run.status === 'live' ? styles.statusLive : run.status === 'idle' ? styles.statusIdle : styles.statusWarn
                      }`}
                    >
                      {run.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.surfaceCard}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionTitle}>Provider matrix</div>
                <h2 className={styles.sectionHeading}>Supported LLMs</h2>
              </div>
            </div>
            <div className={styles.agentList}>
              {providerOptions.slice(0, 6).map((option) => (
                <div key={option.id} className={styles.agentCard}>
                  <div className={styles.agentTop}>
                    <div>
                      <p className={styles.agentName}>{option.name}</p>
                      <p className={styles.agentDesc}>{option.label}</p>
                    </div>
                    <span style={{ color: option.accent }}>●</span>
                  </div>
                  <div className={styles.agentMeta}>
                    {option.models.slice(0, 2).map((item) => (
                      <span key={item} className={styles.metaPill}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
