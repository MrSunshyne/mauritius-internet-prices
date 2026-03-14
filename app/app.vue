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
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <NuxtLink to="/" class="header-title">
          <h1>Mauritius Internet Prices</h1>
        </NuxtLink>

        <nav class="header-nav">
          <NuxtLink to="/" :class="{ active: route.path === '/' || route.path === '/mauritius-internet-prices/' }">Home</NuxtLink>
          <NuxtLink to="/compare" :class="{ active: route.path === '/compare' || route.path === '/mauritius-internet-prices/compare' }">Compare</NuxtLink>
          <NuxtLink to="/operators" :class="{ active: route.path === '/operators' || route.path === '/mauritius-internet-prices/operators' }">Operators</NuxtLink>
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
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 9.2A6.5 6.5 0 0 1 6.8 2 6 6 0 1 0 14 9.2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <NuxtPage />

    <footer class="page-footer">
      <p>
        Data last verified March 2026. All prices in Mauritian Rupees (MUR), VAT inclusive.
      </p>
      <div class="author-info">
        Built and maintained by <a href="https://github.com/MrSunshyne" target="_blank" rel="noopener noreferrer">Sandeep Ramgolam</a>.
        An open-source project to help Mauritians find better data value.
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
  --surface-raised: #f8f8f8;
  --border: #e8e8e8;
  --border-subtle: #f0f0f0;
  --text: #0a0a0a;
  --text-secondary: #525252;
  --text-muted: #a3a3a3;
  --accent: #000000;
  --accent-soft: rgba(0, 0, 0, 0.05);
  
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-flat: 0 0 0 1px var(--border);
  
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', SFMono-Regular, ui-monospace, monospace;
}

html.dark {
  --bg: #050505;
  --surface: #0a0a0a;
  --surface-raised: #121212;
  --border: #1a1a1a;
  --border-subtle: #141414;
  --text: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #525252;
  --accent: #ffffff;
  --accent-soft: rgba(255, 255, 255, 0.05);
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
  --shadow-flat: 0 0 0 1px var(--border);
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
  background: color-mix(in srgb, var(--bg) 80%, transparent);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-title h1 {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(to bottom right, var(--text), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}

.header-nav {
  display: flex;
  gap: 4px;
}

.header-nav a {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  white-space: nowrap;
}

.header-nav a:hover,
.header-nav a.active {
  color: var(--text);
  background: var(--accent-soft);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.github-link,
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--border);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.github-link:hover,
.theme-toggle:hover {
  color: var(--text);
  background: var(--accent-soft);
  border-color: var(--text-muted);
}

.page-footer {
  max-width: 1200px;
  margin: 64px auto 0;
  padding: 64px 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}

.page-footer p {
  margin-bottom: 8px;
}

.author-info {
  margin-top: 16px;
  color: var(--text-secondary);
}

.author-info a {
  color: var(--text);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: var(--border);
}

.author-info a:hover {
  text-decoration-color: var(--text);
}

@media (max-width: 768px) {
  .header-inner {
    display: grid;
    grid-template-areas: "title actions" "nav nav";
    grid-template-columns: 1fr auto;
    height: auto;
    padding: 12px 16px;
    gap: 8px;
  }
  
  .header-title {
    grid-area: title;
  }
  
  .header-actions {
    grid-area: actions;
    justify-self: end;
  }
  
  .header-nav {
    grid-area: nav;
    width: 100%;
    overflow-x: auto;
    padding: 4px 0;
    margin: 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .header-nav::-webkit-scrollbar {
    display: none;
  }
  
  .header-nav a {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
