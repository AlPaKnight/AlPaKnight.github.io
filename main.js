/* =============================================
   main.js — Nav burger, Dark mode, i18n FR/EN
   ============================================= */

/* ═══════════════════════════════════════════
   1. DARK MODE
   ═══════════════════════════════════════════ */
const THEME_KEY = 'pdl-theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const isDark = theme === 'dark';
  btn.setAttribute('aria-label', isDark ? 'Passer en mode clair' : 'Passer en mode sombre');
  btn.querySelector('.icon-sun').style.display  = isDark ? 'block' : 'none';
  btn.querySelector('.icon-moon').style.display = isDark ? 'none'  : 'block';
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(saved || preferred);
}

/* ═══════════════════════════════════════════
   2. i18n — FR / EN
   ═══════════════════════════════════════════ */
const LANG_KEY = 'pdl-lang';

function applyLang(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem(LANG_KEY, lang);

  /* Traduit tous les éléments portant data-fr et data-en */
  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    el.innerHTML = lang === 'fr' ? el.dataset.fr : el.dataset.en;
  });

  /* Traduit les attributs aria-label et placeholder */
  document.querySelectorAll('[data-fr-label][data-en-label]').forEach(el => {
    el.setAttribute('aria-label', lang === 'fr' ? el.dataset.frLabel : el.dataset.enLabel);
  });
  document.querySelectorAll('[data-fr-placeholder][data-en-placeholder]').forEach(el => {
    el.setAttribute('placeholder', lang === 'fr' ? el.dataset.frPlaceholder : el.dataset.enPlaceholder);
  });

  /* Met à jour le switcher */
  const switcher = document.getElementById('lang-toggle');
  if (switcher) {
    switcher.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }
}

function initLang() {
  const saved = localStorage.getItem(LANG_KEY);
  const browser = navigator.language.startsWith('fr') ? 'fr' : 'en';
  applyLang(saved || browser);
}

/* ═══════════════════════════════════════════
   3. BURGER MOBILE
   ═══════════════════════════════════════════ */
function initBurger() {
  const burger   = document.querySelector('.nav__burger');
  const navLinks = document.querySelector('.nav__links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    const bars = burger.querySelectorAll('span');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
    });
  });
}

/* ═══════════════════════════════════════════
   4. LIEN ACTIF
   ═══════════════════════════════════════════ */
function initActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ═══════════════════════════════════════════
   5. BOOT
   ═══════════════════════════════════════════ */

/* Thème appliqué immédiatement (avant DOMContentLoaded) pour éviter le flash */
initTheme();

document.addEventListener('DOMContentLoaded', () => {

  /* Bouton theme */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
    /* Forcer la mise à jour des icônes après rendu DOM */
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }

  /* Switcher langue */
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
  }

  initLang();
  initBurger();
  initActiveLink();
});
