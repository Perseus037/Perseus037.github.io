const languageButton = document.getElementById('language');
const themeButton = document.getElementById('theme-toggle');
let language = 'en';
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  const label = language === 'zh' ? (dark ? '切换至浅色主题' : '切换至深色主题') : (dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101114' : '#ffffff';
  updateThemeButton();
  try { localStorage.setItem('homepage-theme', theme); } catch {}
}
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
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
