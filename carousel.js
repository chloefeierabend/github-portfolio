// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(initCarousel);
});

function initCarousel(root) {
  const track    = root.querySelector('.carousel-track');
  const slides   = Array.from(root.querySelectorAll('.slide'));
  const prevBtn  = root.querySelector('.carousel-arrow.prev');
  const nextBtn  = root.querySelector('.carousel-arrow.next');
  const caption  = root.querySelector('.carousel-caption');
  const viewport = root.querySelector('.carousel-viewport');

  if (!track || slides.length === 0) {
    console.warn('Carousel: missing track or slides', root);
    return;
  }

  let index = 0;

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
    if (caption) caption.textContent = slides[index].dataset.caption || '';
  }

  prevBtn && prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn && nextBtn.addEventListener('click', () => go(index + 1));

  // Keyboard + basic swipe
  if (viewport) {
    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });
    let startX = null;
    viewport.addEventListener('pointerdown', e => { startX = e.clientX; });
    viewport.addEventListener('pointerup',   e => {
      if (startX == null) return;
      const dx = e.clientX - startX;
      if (dx > 40) go(index - 1);
      else if (dx < -40) go(index + 1);
      startX = null;
    });
  }

  console.log(`Carousel initialized (${slides.length} slides)`, root);
  go(0);
}
