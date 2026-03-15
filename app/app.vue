<script setup lang="ts">
const { operators } = useMobilePlans()

const route = useRoute()

const dark = ref(false)

onMounted(() => {
  dark.value = localStorage.getItem('theme') === 'dark'
    || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  applyTheme()
})

function toggleDark() {
  dark.value = !dark.value
  localStorage.setItem('theme', dark.value ? 'dark' : 'light')
  applyTheme()
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', dark.value)
}

const sidebarTitle = computed(() => {
  const path = route.path.replace(/\/$/, '')
  if (path.includes('/compare')) return 'MARKET COMPARISON / 2026'
  if (path.includes('/operators')) return 'NETWORK OPERATORS / 2026'
  return 'THE DATA REPORT / 2026'
})
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <NuxtLink to="/" class="header-title">
          <h1>Mauritius <span class="italic">Internet Prices</span></h1>
        </NuxtLink>

        <nav class="header-nav">
          <NuxtLink to="/" :class="{ active: route.path === '/' }">The Report</NuxtLink>
          <NuxtLink to="/compare" :class="{ active: route.path === '/compare' }">All Plans</NuxtLink>
          <NuxtLink to="/operators" :class="{ active: route.path === '/operators' }">Operators</NuxtLink>
        </nav>

        <div class="header-actions">
          <a
            href="https://github.com/MrSunshyne/mauritius-internet-prices"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
            title="View on GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <button class="theme-toggle" :title="dark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleDark">
            <svg v-if="dark" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2 suicide-3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 9.2A6.5 6.5 0 0 1 6.8 2 6 6 0 1 0 14 9.2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="magazine-shell">
      <aside class="side-nav">
        <div class="vertical-title">{{ sidebarTitle }}</div>
        <div class="issue-no">ISSUE NO. 01</div>
      </aside>

      <div class="main-view">
        <NuxtPage />
      </div>
    </div>

    <footer class="page-footer">
      <div class="footer-inner">
        <div class="footer-col brand-col">
          <span class="footer-title">THE DATA REPORT</span>
          <p class="footer-subtitle">Independent analysis of Mauritian mobile data markets.</p>
        </div>
        <div class="footer-col legal-col">
          <p>Verified March 2026. All prices MUR / VAT inclusive.</p>
          <div class="author-info">
            Built by <a href="https://github.com/MrSunshyne" target="_blank" rel="noopener noreferrer">Sandeep Ramgolam</a>.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-raised: #f2f2f2;
  --border: #1a1a1a;
  --border-subtle: #e5e5e5;
  --text: #1a1a1a;
  --text-secondary: #555555;
  --text-muted: #888888;
  --accent: #000000;
  --accent-soft: rgba(0, 0, 0, 0.03);
  
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  
  --shadow-sm: none;
  --shadow-md: none;
  --shadow-lg: none;
  --shadow-flat: 0 0 0 1px var(--border);
  
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', SFMono-Regular, ui-monospace, monospace;
}

html.dark {
  --bg: #0a0a0a;
  --surface: #0a0a0a;
  --surface-raised: #111111;
  --border: #f5f5f5;
  --border-subtle: #222222;
  --text: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #666666;
  --accent: #ffffff;
  --accent-soft: rgba(255, 255, 255, 0.03);
  color-scheme: dark;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--bg) 95%, transparent);
}

.header-inner {
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 64px;
}

.header-title {
  margin-right: 48px;
}

.header-title h1 {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--text);
  white-space: nowrap;
}

.header-title .italic { font-style: italic; }

.header-nav {
  display: flex;
  height: 100%;
  flex: 1;
}

.header-nav a {
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.header-nav a:hover,
.header-nav a.active {
  color: var(--text);
  background: var(--accent-soft);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: auto;
}

.github-link,
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 64px;
  background: transparent;
  border: none;
  border-left: 1px solid var(--border-subtle);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

/* Shell Layout */
.magazine-shell {
  display: flex;
  min-height: calc(100vh - 64px);
}

.side-nav {
  width: 80px;
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 0;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  background: var(--bg);
  z-index: 10;
  flex-shrink: 0;
}

.vertical-title {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.issue-no {
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}

.main-view {
  flex: 1;
  min-width: 0;
}

.page-footer {
  background: var(--surface-raised);
  border-top: 1px solid var(--border);
  padding: 80px 24px 80px 164px; /* 80px sidebar + 60px content padding + 24px base padding */
  width: 100%;
}

.footer-inner {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  text-align: left;
}

.footer-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.1em;
  display: block;
  margin-bottom: 8px;
}

.footer-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-legal {
  font-size: 13px;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-subtle);
  padding-top: 24px;
}

.author-info {
  margin-top: 8px;
  font-weight: 700;
}

.author-info a {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--text-muted);
}

.author-info a:hover {
  text-decoration-color: var(--text);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .header-nav a { padding: 0 12px; font-size: 11px; }
  .header-title { margin-right: 24px; }
}

@media (max-width: 900px) {
  .side-nav { display: none; }
  .page-footer { padding: 64px 24px; }
}

@media (max-width: 768px) {
  .header-inner {
    display: grid;
    grid-template-areas: "title actions" "nav nav";
    grid-template-columns: 1fr auto;
    height: auto;
    padding: 0;
    gap: 0;
  }
  
  .header-title {
    grid-area: title;
    padding: 16px;
    margin-right: 0;
  }
  
  .header-actions {
    grid-area: actions;
    height: 100%;
  }
  
  .github-link, .theme-toggle {
    height: 56px;
  }
  
  .header-nav {
    grid-area: nav;
    width: 100%;
    overflow-x: auto;
    border-top: 1px solid var(--border-subtle);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .header-nav a {
    height: 48px;
    white-space: nowrap;
  }

  .footer-inner {
    text-align: left;
    align-items: flex-start;
  }
  
  .footer-legal {
    text-align: left;
    width: 100%;
  }
}
</style>
