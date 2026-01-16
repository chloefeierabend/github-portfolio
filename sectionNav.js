/**
 * Section Navigation - Highlights current section in sticky nav
 */

document.addEventListener("DOMContentLoaded", () => {
  const navDots = document.querySelectorAll(".section-nav .nav-dot");
  const sections = document.querySelectorAll("section[id]");

  if (!navDots.length || !sections.length) return;

  // Intersection Observer to track which section is visible
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Trigger when section is in upper-middle of viewport
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute("id");

        // Remove active class from all dots
        navDots.forEach((dot) => dot.classList.remove("active"));

        // Add active class to corresponding dot
        const activeDot = document.querySelector(
          `.nav-dot[data-section="${sectionId}"]`
        );
        if (activeDot) {
          activeDot.classList.add("active");
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all sections with IDs
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Smooth scroll on nav dot click
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
