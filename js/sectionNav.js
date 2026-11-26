/* Section nav */

document.addEventListener("DOMContentLoaded", () => {
  const navDots = document.querySelectorAll(".section-nav .nav-dot");
  const sections = document.querySelectorAll("section[id]");

  if (!navDots.length || !sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute("id");

        navDots.forEach((dot) => dot.classList.remove("active"));

        const activeDot = document.querySelector(
          `.nav-dot[data-section="${sectionId}"]`,
        );
        if (activeDot) {
          activeDot.classList.add("active");
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Smooth scroll
  navDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = dot.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
