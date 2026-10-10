const languageButton = document.getElementById('language');
const copyButton = document.getElementById('copy-email');
const status = document.getElementById('copy-status');
let language = 'en';
function setLanguage(next) {
  language = next;
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach(element => { element.textContent = element.dataset[next]; });
  languageButton.innerHTML = next === 'en' ? '中文 <span aria-hidden="true">↗</span>' : 'EN <span aria-hidden="true">↗</span>';
  languageButton.setAttribute('aria-label', next === 'en' ? '切换至中文' : 'Switch to English');
  copyButton.setAttribute('aria-label', next === 'en' ? 'Copy email address' : '复制邮箱地址');
  status.textContent = '';
  try { localStorage.setItem('homepage-language', next); } catch {}
}
try { if (localStorage.getItem('homepage-language') === 'zh') setLanguage('zh'); } catch {}
languageButton.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('zzheng186@connect.hkust-gz.edu.cn');
    status.textContent = language === 'en' ? 'Email address copied.' : '邮箱地址已复制。';
  } catch {
    status.textContent = language === 'en' ? 'Please select the email address to copy it, or click it to send an email.' : '请选中邮箱地址手动复制，或点击地址发送邮件。';
  }
});
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
