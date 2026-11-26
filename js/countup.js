const statNumbers = document.querySelectorAll(".stat-number");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (statNumbers.length && !reduceMotion && "IntersectionObserver" in window) {
  const duration = 1200;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const prepare = (el) => {
    const finalText = el.textContent.trim();
    const match = finalText.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return null;

    const [, prefix, number, suffix] = match;
    const target = parseFloat(number);
    const decimals = (number.split(".")[1] || "").length;

    el.textContent = "";
    const shown = document.createElement("span");
    shown.setAttribute("aria-hidden", "true");
    shown.textContent = prefix + (0).toFixed(decimals) + suffix;
    const spoken = document.createElement("span");
    spoken.className = "sr-only";
    spoken.textContent = finalText;
    el.append(shown, spoken);

    return { shown, prefix, suffix, target, decimals };
  };

  const run = ({ shown, prefix, suffix, target, decimals }) => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      shown.textContent = prefix + (target * easeOut(t)).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = new Map();
  statNumbers.forEach((el) => {
    const counter = prepare(el);
    if (counter) counters.set(el, counter);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(counters.get(entry.target));
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((_, el) => observer.observe(el));
}
