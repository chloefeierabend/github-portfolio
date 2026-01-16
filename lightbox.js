/**
 * Lightbox - Click to view images full size
 */

document.addEventListener("DOMContentLoaded", () => {
  // Create lightbox elements
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
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

  // Get all design images
  const designImages = document.querySelectorAll(".design-img");
  let currentIndex = 0;

  // Add click handlers to each image
  designImages.forEach((item, index) => {
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption");

    // Add cursor pointer and aria role
    item.style.cursor = "pointer";
    item.setAttribute("role", "button");
    item.setAttribute("tabindex", "0");
    item.setAttribute(
      "aria-label",
      `View ${caption?.textContent || "image"} full size`
    );

    // Click handler
    item.addEventListener("click", () => {
      openLightbox(index);
    });

    // Keyboard handler
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    // Return focus to the image that was clicked
    designImages[currentIndex]?.focus();
  }

  function updateLightboxContent() {
    const item = designImages[currentIndex];
    const img = item.querySelector("img");
    const caption = item.querySelector("figcaption");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption?.textContent || "";

    // Update nav button visibility
    prevBtn.style.display = currentIndex > 0 ? "flex" : "none";
    nextBtn.style.display =
      currentIndex < designImages.length - 1 ? "flex" : "none";
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateLightboxContent();
    }
  }

  function showNext() {
    if (currentIndex < designImages.length - 1) {
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
    }
  });
});
