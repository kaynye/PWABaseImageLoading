export default function Read(page, data) {
  page.innerHTML = "";
  const constructor = document.createElement('div');
  constructor.innerHTML = `
  <article class="view">
    <header><figure><div class="placeholder"></div><img src="" alt=""></figure></header>
    <div><button class="install hidden">Install</button></div>
    <main><h1></h1><p></p></main>
  </article>
  `;

  const view = constructor
    .querySelector('.view')
    .cloneNode(true);

  const image = view.querySelector('img');
  const placeholderElement = view.querySelector('.placeholder');
  const title = view.querySelector('h1');
  const content = view.querySelector('p');

  title.innerHTML = data.content.title;
  content.innerHTML = data.content.content;

  image.dataset.src = data.image;
  image.alt = data.content.title;

  placeholderElement.style.cssText = `background-image: url('${data.placeholder}');`;

  page.appendChild(view);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // If image element in view
      if (entry.isIntersecting) {
        // Actualy load image
        const image = entry.target
        image.src = image.dataset.src;
        image.onload = () => {
          // Add the `fade` class to the placeholder
          image.parentNode.querySelector('.placeholder').classList.add('fade');
        }
      }
    });
  });
  io.observe(image);
}
