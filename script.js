const languageButton = document.getElementById('language');
const themeButton = document.getElementById('theme-toggle');
let language = 'en';
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = language === 'zh' ? (dark ? '切换至浅色主题' : '切换至深色主题') : (dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  themeButton.setAttribute('role', 'switch');
  themeButton.setAttribute('aria-checked', String(dark));
  themeButton.style.setProperty('--night', dark ? 1 : 0);
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101114' : '#ffffff';
  updateThemeButton();
  try { localStorage.setItem('homepage-theme', theme); } catch {}
}
let drag = null;
let suppressClick = false;
themeButton.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  suppressClick = false;
  drag = { id: event.pointerId, x: event.clientX, start: document.documentElement.dataset.theme === 'dark' ? 1 : 0, moved: false };
  themeButton.setPointerCapture(event.pointerId);
});
themeButton.addEventListener('pointermove', event => {
  if (!drag || event.pointerId !== drag.id) return;
  const delta = event.clientX - drag.x;
  if (Math.abs(delta) > 4) drag.moved = true;
  if (!drag.moved) return;
  themeButton.classList.add('dragging');
  drag.value = Math.max(0, Math.min(1, drag.start + delta / 44));
  themeButton.style.setProperty('--night', drag.value);
});
function finishDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const previous = drag;
  drag = null;
  themeButton.classList.remove('dragging');
  if (previous.moved) {
    suppressClick = true;
    setTheme(event.type === 'pointerup' ? (previous.value >= .5 ? 'dark' : 'light') : (previous.start ? 'dark' : 'light'));
  }
}
themeButton.addEventListener('pointerup', finishDrag);
themeButton.addEventListener('pointercancel', finishDrag);
themeButton.addEventListener('lostpointercapture', finishDrag);
themeButton.addEventListener('click', event => {
  if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
  suppressClick = false;
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});
themeButton.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    setTheme(event.key === 'ArrowRight' ? 'dark' : 'light');
  }
});
setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
function setLanguage(next) {
  language = next;
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(element => { element.textContent = element.dataset[next]; });
  languageButton.innerHTML = next === 'en' ? '中文 <span aria-hidden="true">↗</span>' : 'EN <span aria-hidden="true">↗</span>';
  languageButton.setAttribute('aria-label', next === 'en' ? '切换至中文' : 'Switch to English');
  updateThemeButton();
  try { localStorage.setItem('homepage-language', next); } catch {}
}
try { if (localStorage.getItem('homepage-language') === 'zh') setLanguage('zh'); } catch {}
languageButton.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
const links = [...document.querySelectorAll('nav a')];
const sections = [...document.querySelectorAll('main > section')];
let scheduled = false;
function updateNavigation() {
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 160) || sections[0];
  links.forEach(link => {
    const active = link.hash === '#' + current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); } }, {passive:true});
updateNavigation();
document.getElementById('year').textContent = new Date().getFullYear();
