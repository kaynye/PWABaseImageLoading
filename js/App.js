'user strict';

(async () => {
  const style = document.createElement('link');
  style.rel = "stylesheet";
  style.href = "/style/card.css";
  document.head.appendChild(style);

  const app = document.querySelector('#app main');

  const result = await fetch('/data/spacex.json');
  const data = await result.json();
  
  const constructor = document.createElement('div');
  constructor.innerHTML = `
    <section class="card">
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
    </section>
  `;
  
  const cards = data.map(item => {
    const card = constructor
      .querySelector('.card')
      .cloneNode(true);

    initCard(card, item);
    app.appendChild(card);
    return card;
  });

  // setTimeout(() => {
  //   cards.forEach(card => {
  //     const cover = card.querySelector('img');
  //     cover.src = cover.dataset.src;

  //     const placeholder = card.querySelector('.placeholder');
  //     placeholder.classList.add('fade');
  //   });
  // }, 2000);

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
   */
  const options = {
    rootMarging : '0px 0px 0px 0px'
  };

  const callback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = image.dataset.src;

        image.onload = () => {
          image.parentNode.querySelector('.placeholder').classList.add('fade');
        }
      }
    });
  }

  const io = new IntersectionObserver(callback, options);
  cards.forEach(card => {
    const image = card.querySelector('img');
    io.observe(image);
  });
})();


function initCard(card, data) {
  const placeholder = card.querySelector('.placeholder');
  placeholder.style.cssText = `background-image: url(${data.placeholder})`;

  const image = card.querySelector('img');
  image.dataset.src = data.image;
  image.alt = data.content.title;

  const title = card.querySelector('h1');
  title.innerHTML = data.content.title;

  const description = card.querySelector('p');
  description.innerHTML = data.content.description;

}