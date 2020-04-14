'user strict';
import page from '/node_modules/page/page.mjs';

(async () => {
  const app = document.querySelector('#app main');

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
    if (slug) {
      const article = data.find(item => _slugify(item.content.title) === slug);
      Read(readCtn, article);

      pages.forEach(page => page.removeAttribute('active'));
      readCtn.setAttribute('active', true);

      const docTitle = document.head.querySelector('title');
      document.title = `${docTitle.dataset.base} - ${article.content.title}`;
    }
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
