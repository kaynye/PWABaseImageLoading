'use strict';
import page from '/node_modules/page/page.mjs';
import checkConnectivity from './network.js';

(async () => {
  document.offline = false;
  const app = document.querySelector('#app main');
  window.addEventListener('beforeinstallprompt', e => {
    console.log('Application is ready to install');
    e.preventDefault();
    window.installPrompt = e;
  });

  document.addEventListener('conectivity-changed', e => {
    const root = document.documentElement;
    document.offline = !e.detail;
    if (e.detail) {
      console.log('Back online');
      root.style.setProperty('--app-blue', '#007eef');
    } else {
      console.log('Offline mode');
      root.style.setProperty('--app-blue', '#7D7D7D');
    }
  });
  checkConnectivity({});

  const result = await fetch('/data/spacex.json');
  const data = await result.json();

  const skeleton = app.querySelector('.skeleton');
  skeleton.setAttribute('hidden', '');

  const homeCtn = app.querySelector('[page=home]');
  const readCtn = app.querySelector('[page=read]');

  const pages = [
    homeCtn,
    readCtn    
  ];

  page('/', async ctx => {
    const module = await import('./view/home.js');
    const Home = module.default;

    Home(homeCtn, data);

    pages.forEach(page => page.removeAttribute('active'));
    homeCtn.setAttribute('active', true);

    const docTitle = document.head.querySelector('title');
    document.title = `${docTitle.dataset.base} - Home`;
  });

  page('/read/:slug', async ctx => {
    const module = await import('./view/read.js');
    const Read = module.default;
    
    const readStyle = document.head.querySelectorAll('#read-style');
    if (!readStyle.length) {
      const link = document.createElement('link');
      link.id = 'read-style';
      link.rel = "stylesheet";
      link.href = '/style/view.css';
      document.head.appendChild(link);
    }

    const slug = ctx.params.slug;
    const article = data.find(item => _slugify(item.content.title) === slug);
    Read(readCtn, article);

    pages.forEach(page => page.removeAttribute('active'));
    readCtn.setAttribute('active', true);

    const docTitle = document.head.querySelector('title');
    document.title = `${docTitle.dataset.base} - ${article.content.title}`;

    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    const btn = readCtn.querySelector('.install');
    btn.addEventListener('click', () => {
      window.installPrompt.prompt();
      window.installPrompt.userChoice
        .then(choice => {
          if ( choice.outcome === 'accepted' ) {
            console.log('Installation accepted');
          } else {
            console.log('Installation refused');
          }
        });
      window.installPrompt = null;
    });
    setTimeout(() => {
      if (window.installPrompt) {
        btn.classList.remove('hidden');
      }
    }, 3000);
  });

  page();
})();

function _slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
