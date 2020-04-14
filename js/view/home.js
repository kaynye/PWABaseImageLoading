export default function Home(page, data) {
  page.innerHTML = "";
  const constructor = document.createElement('div');
  constructor.innerHTML = `
    <article class="card">
      <a href="#">
        <header>
          <figure>
            <div class="placeholder"></div>
            <img src="" alt="">
          </figure>
        </header>
        <main>
          <h1></h1>
          <p></p>
        </main>
      </a>
    </article>
  `;

  const cards = data.map(item => {
    const card = constructor
      .querySelector('.card')
      .cloneNode(true);

    const cover = card.querySelector('img');
    cover.dataset.src = item.image;
    cover.alt = item.content.title;

    const placeholder = card.querySelector('.placeholder');
    placeholder.style.cssText = `background-image: url(${item.placeholder})`;

    const title = card.querySelector('h1');
    title.innerHTML = item.content.title;
    const description = card.querySelector('p');
    description.innerHTML = item.content.description;

    const link = card.querySelector('a');
    link.href = `/read/${_slugify(item.content.title)}`;

    page.appendChild(card);
    return card;
  });

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
   */
  const options = {
    rootMarging : '0px 0px 0px 0px'
  };


  const callback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        const placeholder = image
          .parentNode
          .querySelector('.placeholder');

        image.src = image.dataset.src;
        image.onload = () => {
          placeholder.classList.add('fade');
          console.log('intercesc')
        };
      }
    });
  }

  const io = new IntersectionObserver(callback, options);
  cards.forEach(card => {
    const image = card.querySelector('img');
    io.observe(image);
  });
};

function _slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
