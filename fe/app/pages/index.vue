<script setup lang="ts">
import {
  PhBriefcase,
  PhStack,
  PhEyeSlash,
  PhBellSlash,
  PhGauge,
  PhFunnel,
  PhNotepad,
  PhArrowRight,
} from '@phosphor-icons/vue'

definePageMeta({ layout: false })

const problems = [
  {
    icon: PhStack,
    title: 'Lost applications',
    description: 'You apply, then forget where things stand. Every company becomes a blur after a few weeks.',
  },
  {
    icon: PhEyeSlash,
    title: 'No pipeline visibility',
    description: "You can't see your progress at a glance. Are you active enough? Stalled? Impossible to tell.",
  },
  {
    icon: PhBellSlash,
    title: 'Missed follow-ups',
    description: 'Deadlines and next steps fall through the cracks. Opportunities slip away from inaction.',
  },
]

const solutions = [
  {
    icon: PhGauge,
    title: 'Live dashboard',
    description: 'See your full pipeline at a glance — total applications, active reviews, interviews, and offers.',
  },
  {
    icon: PhFunnel,
    title: 'Status tracking',
    description: 'Filter by Applied, In Review, Interview, Offered, or Rejected. Always know exactly where you stand.',
  },
  {
    icon: PhNotepad,
    title: 'Notes per application',
    description: 'Record contacts, interview prep, and follow-up context right alongside each application.',
  },
]
</script>

<template>
  <div class="landing">
    <div class="grain" aria-hidden="true" />

    <!-- Nav -->
    <header class="nav">
      <div class="nav-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-mark" />
          <span class="brand-name">ApplyPilot</span>
        </NuxtLink>
        <NuxtLink to="/login" class="nav-cta">
          Get Started
          <PhArrowRight :size="12" weight="bold" />
        </NuxtLink>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <p class="eyebrow">Job Search Intelligence</p>
          <h1 class="headline">
            Track every<br />
            application.<br />
            <em>Land the role.</em>
          </h1>
          <p class="hero-sub">
            Stop juggling spreadsheets and scattered emails. ApplyPilot keeps your entire job search in one command center — so you focus on getting hired.
          </p>
          <div class="hero-ctas">
            <NuxtLink to="/login" class="cta-primary">
              Start tracking — free
              <PhArrowRight :size="15" />
            </NuxtLink>
            <NuxtLink to="/login" class="cta-link">
              See dashboard
            </NuxtLink>
          </div>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">12</span>
            <span class="stat-label">Applied</span>
          </div>
          <div class="stat-rule" />
          <div class="stat-item">
            <span class="stat-number">04</span>
            <span class="stat-label">Interviews</span>
          </div>
          <div class="stat-rule" />
          <div class="stat-item stat-item--amber">
            <span class="stat-number">02</span>
            <span class="stat-label">Offers</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Problem -->
    <section class="section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">The Problem</span>
          <h2 class="section-heading">The job search is chaotic by default.</h2>
          <p class="section-sub">Most people manage their search across email, notes apps, and memory. It doesn't scale.</p>
        </div>
        <div class="cards-row">
          <div v-for="item in problems" :key="item.title" class="feat-card">
            <div class="card-icon">
              <component :is="item.icon" :size="18" />
            </div>
            <h3 class="card-name">{{ item.title }}</h3>
            <p class="card-body">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution -->
    <section class="section section--dim">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag section-tag--amber">The Solution</span>
          <h2 class="section-heading">ApplyPilot brings order to the chaos.</h2>
          <p class="section-sub">One place for every application, every status, every note.</p>
        </div>
        <div class="cards-row">
          <div v-for="item in solutions" :key="item.title" class="feat-card feat-card--solution">
            <div class="card-icon card-icon--amber">
              <component :is="item.icon" :size="18" />
            </div>
            <h3 class="card-name">{{ item.title }}</h3>
            <p class="card-body">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-band">
      <div class="cta-inner">
        <h2 class="cta-heading">
          Your next role<br />
          <em>starts here.</em>
        </h2>
        <p class="cta-sub">Stop guessing where things stand. Start tracking.</p>
        <NuxtLink to="/login" class="cta-large">
          Open ApplyPilot
          <PhArrowRight :size="16" />
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <span>© 2026 ApplyPilot</span>
        <span>Built to get you hired.</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ─── Dark palette tokens ─── */
.landing {
  --bg: #07070D;
  --bg-card: #0E0E1B;
  --bg-card-hover: #131321;
  --bg-dim: #0B0B13;
  --text: #ECE7E2;
  --text-muted: rgba(236, 231, 226, 0.48);
  --text-dim: rgba(236, 231, 226, 0.22);
  --amber: #E8A547;
  --amber-dim: rgba(232, 165, 71, 0.1);
  --border: rgba(236, 231, 226, 0.07);
  --border-strong: rgba(236, 231, 226, 0.13);

  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', system-ui, sans-serif;
  min-height: 100svh;
  position: relative;
}

/* Film grain overlay */
.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  opacity: 0.036;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ─── Nav ─── */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border);
  background: rgba(7, 7, 13, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text);
}
.brand-mark {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--amber);
  box-shadow: 0 0 9px rgba(232, 165, 71, 0.55);
}
.brand-name {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.015em;
}
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  background: var(--text);
  color: var(--bg);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: opacity 0.15s;
}
.nav-cta:hover { opacity: 0.82; }

/* ─── Hero ─── */
.hero {
  padding: 6.5rem 2rem 5.5rem;
}
.hero-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 175px;
  gap: 5rem;
  align-items: center;
}
.eyebrow {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--amber);
  margin-bottom: 1.375rem;
}
.headline {
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(3.25rem, 6.5vw, 5.75rem);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.025em;
  margin-bottom: 1.875rem;
  color: var(--text);
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}
.headline em {
  font-style: italic;
  color: var(--amber);
}
.hero-sub {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 500px;
  margin-bottom: 2.625rem;
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}
.hero-ctas {
  display: flex;
  align-items: center;
  gap: 1.375rem;
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}
.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--amber);
  color: #180B00;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cta-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 26px -4px rgba(232, 165, 71, 0.42);
}
.cta-link {
  font-size: 0.9375rem;
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--border-strong);
  padding-bottom: 1px;
  transition: color 0.15s, border-color 0.15s;
}
.cta-link:hover {
  color: var(--text);
  border-color: rgba(236, 231, 226, 0.38);
}

/* Stats panel */
.hero-stats {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-card);
  animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
.stat-item {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.stat-item--amber .stat-number { color: var(--amber); }
.stat-rule {
  height: 1px;
  background: var(--border);
}
.stat-number {
  font-family: 'DM Mono', 'Courier New', monospace;
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--text);
}
.stat-label {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-dim);
}

/* ─── Sections ─── */
.section {
  padding: 5.5rem 2rem;
  border-top: 1px solid var(--border);
}
.section--dim {
  background: var(--bg-dim);
}
.section-inner {
  max-width: 1120px;
  margin: 0 auto;
}
.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.section-tag {
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 1rem;
}
.section-tag--amber { color: var(--amber); }
.section-heading {
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(1.75rem, 3vw, 2.625rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--text);
  margin-bottom: 0.875rem;
}
.section-sub {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.65;
}
.cards-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.125rem;
}
.feat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.875rem;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.feat-card:hover {
  border-color: var(--border-strong);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}
.feat-card--solution {
  background: var(--bg);
}
.feat-card--solution:hover {
  background: var(--bg-card);
}
.card-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: rgba(236, 231, 226, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 1.125rem;
}
.card-icon--amber {
  background: var(--amber-dim);
  color: var(--amber);
}
.card-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.625rem;
  letter-spacing: -0.01em;
}
.card-body {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--text-muted);
}

/* ─── CTA Band ─── */
.cta-band {
  padding: 7rem 2rem;
  border-top: 1px solid var(--border);
  text-align: center;
}
.cta-inner {
  max-width: 1120px;
  margin: 0 auto;
}
.cta-heading {
  font-family: 'Cormorant', Georgia, serif;
  font-size: clamp(2.75rem, 5.5vw, 4.75rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.06;
  color: var(--text);
  margin-bottom: 1rem;
}
.cta-heading em {
  font-style: italic;
  color: var(--amber);
}
.cta-sub {
  font-size: 1.0625rem;
  color: var(--text-muted);
  margin-bottom: 2.75rem;
  line-height: 1.6;
}
.cta-large {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  background: var(--amber);
  color: #180B00;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cta-large:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 32px -6px rgba(232, 165, 71, 0.4);
}

/* ─── Footer ─── */
.footer {
  border-top: 1px solid var(--border);
  padding: 1.5rem 2rem;
}
.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: var(--text-dim);
}

/* ─── Animation ─── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ─── Responsive ─── */
@media (max-width: 860px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .hero-stats {
    flex-direction: row;
    max-width: 380px;
  }
  .stat-item {
    flex: 1;
    padding: 1rem 1.25rem;
  }
  .stat-rule {
    width: 1px;
    height: auto;
  }
  .cards-row {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin: 0 auto;
  }
}
@media (max-width: 560px) {
  .hero        { padding: 4rem 1.25rem 3.5rem; }
  .nav-inner   { padding: 0 1.25rem; }
  .section     { padding: 3.5rem 1.25rem; }
  .cta-band    { padding: 4.5rem 1.25rem; }
  .footer      { padding: 1.5rem 1.25rem; }
  .footer-inner { flex-direction: column; gap: 0.375rem; }
}
</style>
