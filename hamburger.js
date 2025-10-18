const navbar = document.querySelector(".navbar");
const toggleBtn = navbar.querySelector(".nav-toggle");
const menu = navbar.querySelector("#site-menu");

toggleBtn.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("is-open");
  toggleBtn.setAttribute("aria-expanded", isOpen);
  toggleBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close menu on link click (mobile convenience)
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navbar.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", false);
    toggleBtn.setAttribute("aria-label", "Open menu");
  }
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    navbar.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", false);
    toggleBtn.setAttribute("aria-label", "Open menu");
  }
});
