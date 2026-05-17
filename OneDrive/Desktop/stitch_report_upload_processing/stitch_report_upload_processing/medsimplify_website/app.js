/**
 * MedSimplify — SPA Router & UI Controller
 */

(function () {
  'use strict';

  // ============ STATE ============
  const state = {
    currentPage: 'dashboard-home',
    isDark: false,
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    language: 'EN',
  };

  // ============ DOM REFS ============
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mainWrapper = document.getElementById('main-wrapper');
  const pageTitle = document.getElementById('page-title');
  const darkToggle = document.getElementById('dark-toggle');
  const hamburger = document.getElementById('hamburger');
  const langBtns = document.querySelectorAll('.lang-choice');
  const toast = document.getElementById('toast');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');

  // ============ PAGES META ============
  const PAGE_META = {
    'dashboard-home':  { label: 'Dashboard Home',         icon: 'grid_view',        section: 'main' },
    'upload':          { label: 'Upload Report',           icon: 'upload_file',      section: 'main' },
    'chat':            { label: 'AI Chat Assistant',       icon: 'forum',            section: 'main' },
    'chat-interface':  { label: 'Chat Interface',          icon: 'chat_bubble',      section: 'main' },
    'dashboard':       { label: 'Health Dashboard',        icon: 'monitor_heart',    section: 'insights' },
    'trends':          { label: 'Health Trends',           icon: 'trending_up',      section: 'insights' },
    'critical':        { label: 'Critical Dashboard',      icon: 'emergency',        section: 'insights' },
    'hindi':           { label: 'Hindi Results (हिन्दी)',  icon: 'translate',        section: 'insights' },
    'biomarker':       { label: 'Biomarker Detail',        icon: 'biotech',          section: 'insights' },
    'voice':           { label: 'Voice Mode',              icon: 'surround_sound',   section: 'tools' },
    'high-contrast':   { label: 'High Contrast Mode',      icon: 'contrast',         section: 'tools' },
    'settings':        { label: 'Settings & Accessibility',icon: 'settings',         section: 'account' },
  };

  // ============ ROUTER ============
  function navigateTo(page, pushHistory = true) {
    if (!PAGE_META[page]) return;
    if (state.currentPage === page) return;

    // Hide current
    const prev = document.getElementById(`page-${state.currentPage}`);
    if (prev) prev.classList.remove('active');

    // Show new
    const next = document.getElementById(`page-${page}`);
    if (next) next.classList.add('active');

    state.currentPage = page;

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    // Update page title
    if (pageTitle) pageTitle.textContent = PAGE_META[page].label;

    // Update hash
    if (pushHistory) {
      window.location.hash = page;
    }

    // Close mobile sidebar
    if (state.mobileSidebarOpen) closeMobileSidebar();

    // Scroll to top
    const pageContent = document.getElementById('page-content');
    if (pageContent) pageContent.scrollTop = 0;
  }

  function readHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash && PAGE_META[hash]) {
      navigateTo(hash, false);
    } else {
      navigateTo('dashboard-home', false);
    }
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && PAGE_META[hash] && state.currentPage !== hash) {
      navigateTo(hash, false);
    }
  });

  // ============ DARK MODE ============
  function applyDarkMode(isDark) {
    document.body.classList.toggle('dark', isDark);
    state.isDark = isDark;
    const icon = darkToggle ? darkToggle.querySelector('.material-symbols-outlined') : null;
    if (icon) icon.textContent = isDark ? 'light_mode' : 'dark_mode';
    localStorage.setItem('medsimplify-dark', isDark ? '1' : '0');
  }

  function toggleDarkMode() {
    applyDarkMode(!state.isDark);
    showToast(state.isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  }

  // ============ SIDEBAR COLLAPSE ============
  function toggleSidebarCollapse() {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
    localStorage.setItem('medsimplify-sidebar-collapsed', state.sidebarCollapsed ? '1' : '0');
    if (collapseBtn) {
      const icon = collapseBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = state.sidebarCollapsed ? 'chevron_right' : 'chevron_left';
    }
  }

  // ============ MOBILE SIDEBAR ============
  function openMobileSidebar() {
    sidebar.classList.remove('mobile-hidden');
    sidebar.classList.add('mobile-open');
    sidebarOverlay.classList.add('visible');
    state.mobileSidebarOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('visible');
    state.mobileSidebarOpen = false;
    document.body.style.overflow = '';
  }

  // ============ LANGUAGE ============
  function setLanguage(lang) {
    state.language = lang;
    document.querySelectorAll('.lang-choice').forEach(btn => {
      btn.classList.toggle('active-btn', btn.dataset.lang === lang);
    });
    showToast(`🌐 Language: ${lang}`);

    // If switching to Hindi, navigate to hindi page
    if (lang === 'HI' && state.currentPage !== 'hindi') {
      navigateTo('hindi');
    }
  }

  // ============ TOAST ============
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px">check_circle</span> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  window.showToast = showToast;

  // ============ WIRING NAV ITEMS ============
  function wireNavItems() {
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
      el.addEventListener('click', () => {
        navigateTo(el.dataset.page);
      });
    });
  }

  // ============ KEYBOARD SHORTCUT ============
  document.addEventListener('keydown', e => {
    // Ctrl + B = toggle sidebar
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      toggleSidebarCollapse();
    }
    // Ctrl + D = toggle dark
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      toggleDarkMode();
    }
  });

  // ============ INIT ============
  document.addEventListener('DOMContentLoaded', () => {
    // Restore dark mode
    const savedDark = localStorage.getItem('medsimplify-dark');
    applyDarkMode(savedDark === '1');

    // Restore sidebar state (desktop)
    const savedCollapsed = localStorage.getItem('medsimplify-sidebar-collapsed');
    if (savedCollapsed === '1') toggleSidebarCollapse();

    // Wire events
    wireNavItems();

    if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        if (window.innerWidth < 769) {
          state.mobileSidebarOpen ? closeMobileSidebar() : openMobileSidebar();
        } else {
          toggleSidebarCollapse();
        }
      });
    }

    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileSidebar);

    if (collapseBtn) collapseBtn.addEventListener('click', toggleSidebarCollapse);

    langBtns.forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && state.mobileSidebarOpen) {
        closeMobileSidebar();
      }
    });

    // Wire quick-access cards
    document.querySelectorAll('[data-nav-to]').forEach(el => {
      el.addEventListener('click', () => navigateTo(el.dataset.navTo));
    });

    // Route from hash
    readHashRoute();
  });

})();
