/**
 * Lightbox - Click to view images full size
 */

document.addEventListener("DOMContentLoaded", () => {
  // Create lightbox elements
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image viewer");
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="lightbox-content">
      <img src="" alt="">
      <p class="lightbox-caption"></p>
    </div>
    <button class="lightbox-prev" aria-label="Previous image">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="lightbox-next" aria-label="Next image">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  // Get all lightbox-enabled images, grouped by their nearest <section> so
  // Prev/Next only cycle through images that actually belong together
  // (e.g. a feature highlight shouldn't jump into the unrelated final-designs gallery).
  const designImages = Array.from(document.querySelectorAll(".design-img, .lightbox-img"));
  const groups = new Map();

  function groupKeyFor(item) {
    return item.closest("section") || document.body;
  }

  let currentGroup = [];
  let currentIndex = 0;

  // Add click/keyboard handlers to each image
  designImages.forEach((item) => {
    const caption = item.querySelector("figcaption");
    const key = groupKeyFor(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);

    item.style.cursor = "pointer";
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute(
      "aria-label",
      `View ${caption?.textContent || "image"} full size`
    );

    item.addEventListener("click", () => openLightbox(item));

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  function getFocusableInLightbox() {
    return [closeBtn, prevBtn, nextBtn].filter(
      (btn) => btn.style.display !== "none"
    );
  }

  function trapFocus(e) {
    const focusable = getFocusableInLightbox();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!focusable.includes(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Keep the rest of the page out of the accessibility tree while the
  // lightbox is open, so Tab and screen-reader virtual cursors can't
  // reach hidden background content.
  function setBackgroundInert(isInert) {
    Array.from(document.body.children).forEach((el) => {
      if (el === lightbox) return;
      if (isInert) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });
  }

  function openLightbox(item) {
    currentGroup = groups.get(groupKeyFor(item));
    currentIndex = currentGroup.indexOf(item);
    updateLightboxContent();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setBackgroundInert(true);
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setBackgroundInert(false);
    // Return focus to the image that was clicked
    currentGroup[currentIndex]?.focus();
  }

  function updateLightboxContent() {
    const item = currentGroup[currentIndex];
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption");
    const dataCaption = item.closest("[data-caption]")?.dataset.caption;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption?.textContent || dataCaption || "";

    // Update nav button visibility
    prevBtn.style.display = currentIndex > 0 ? "flex" : "none";
    nextBtn.style.display =
      currentIndex < currentGroup.length - 1 ? "flex" : "none";
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightboxContent();
    }
  }

  function showNext() {
    if (currentIndex < currentGroup.length - 1) {
      currentIndex++;
      updateLightboxContent();
    }
  }

  // Event listeners
  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", showPrev);
  nextBtn.addEventListener("click", showNext);

  // Close on backdrop click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrev();
        break;
      case "ArrowRight":
        showNext();
        break;
      case "Tab":
        trapFocus(e);
        break;
    }
  });
});
