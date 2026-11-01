'use strict';

const themeButton = document.querySelector('.theme-toggle');
let theme = 'dark';
try {
  const savedTheme = localStorage.getItem('appfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
} catch { /* The page also works when browser storage is unavailable. */ }

function applyTheme() {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton.querySelector('use').setAttribute('href', theme === 'dark' ? '#sun' : '#moon');
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#1e1e1e' : '#faf8f5';
}
applyTheme();
themeButton.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  try { localStorage.setItem('appfolio-theme', theme); } catch {}
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menüyü aç');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
document.querySelector('.filter[data-filter="all"] span').textContent = String(projects.length).padStart(2, '0');
document.querySelector('.project-result').textContent = `${projects.length} proje gösteriliyor.`;
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  let visibleCount = 0;
  projects.forEach(project => {
    project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
    if (!project.hidden) visibleCount++;
  });
  document.querySelector('.project-result').textContent = `${visibleCount} proje gösteriliyor.`;
}));

const dialog = document.querySelector('.app-dialog');
document.querySelectorAll('[data-open-echo]').forEach(button => {
  button.addEventListener('click', () => dialog.showModal());
});
document.querySelectorAll('.close-dialog, .dialog-done').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.querySelector('#year').textContent = new Date().getFullYear();
