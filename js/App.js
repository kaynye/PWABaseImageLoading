'user strict';

(async () => {
 const app = document.querySelector('#app main');

  const result = await fetch('/data/spacex.json');
  const data = await result.json();
  
  
  const cards = data.map(item => {
    const constructor = document.createElement('div');
    constructor.innerHTML = `
      <section class="card">
        <header>
          <div class="placeholder"></div>
          <figure><img src="" alt=""></figure>
        </header>
        <main>
          <h1></h1>
          <p></p>
        </main>
      </section>
    `;
    const card = constructor.querySelector('.card');
    initCard(card, item);

    app.appendChild(card);
    return card;
  });

  setTimeout(() => {
    cards.forEach(card => {
      const cover = card.querySelector('img');
      cover.src = cover.dataset.src;

      const placeholder = card.querySelector('.placeholder');
      placeholder.classList.add('fade');
    });
  }, 2000);

})();

function initCard(card, data) {
  const placeholder = card.querySelector('.placeholder');
  placeholder.style.cssText = `background-image: url(${data.placeholder})`;

  const image = card.querySelector('img');
  image.dataset.src = data.image;
  image.alt = data.content.title;

  // ...

}