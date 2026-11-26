const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("has-js");

/* Footer bird peek */
const footer = document.querySelector(".cf-footer");
if (footer && "IntersectionObserver" in window && !reduceMotion) {
  const peek = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      footer.classList.add("is-seen");
      peek.disconnect();
    },
    { threshold: 0.35 }
  );
  peek.observe(footer);
} else if (footer) {
  footer.classList.add("is-seen");
}

/* Eyes */
if (!reduceMotion) {
  document.querySelectorAll("img.js-bird").forEach((img) => {
    inlineBird(img).then((svg) => {
      if (svg) watchEyes(svg);
    });
  });
}

async function inlineBird(img) {
  try {
    const res = await fetch(img.src);
    if (!res.ok) return null;
    const doc = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg || !svg.querySelector("#bird-pupil-l-wrap")) return null;
    svg.classList.add("bird-svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", img.alt);
    svg.setAttribute("focusable", "false");
    img.replaceWith(svg);
    return svg;
  } catch {
    return null;
  }
}

function watchEyes(svg) {
  const pupils = ["#bird-pupil-l-wrap", "#bird-pupil-r-wrap"]
    .map((sel) => svg.querySelector(sel))
    .filter(Boolean)
    .map((g) => {
      const box = g.getBBox();
      return { g, cx: box.x + box.width / 2, cy: box.y + box.height / 2, dx: 0, dy: 0 };
    });

  const MAX_X = 5.5;
  const MAX_Y = 7;
  let pointer = null;
  let blink = 1;
  let queued = false;

  const draw = () => {
    queued = false;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    pupils.forEach((p) => {
      if (pointer) {
        const centre = new DOMPoint(p.cx, p.cy).matrixTransform(ctm);
        const vx = pointer.x - centre.x;
        const vy = pointer.y - centre.y;
        const dist = Math.hypot(vx, vy) || 1;
        const pull = Math.min(dist / 180, 1);
        p.dx = (vx / dist) * pull * MAX_X;
        p.dy = (vy / dist) * pull * MAX_Y;
      }
      p.g.setAttribute(
        "transform",
        `translate(${p.cx + p.dx} ${p.cy + p.dy}) scale(1 ${blink}) translate(${-p.cx} ${-p.cy})`
      );
    });
  };

  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(draw);
    }
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      pointer = { x: e.clientX, y: e.clientY };
      queue();
    },
    { passive: true }
  );

  const scheduleBlink = () => {
    setTimeout(() => {
      blink = 0.1;
      queue();
      setTimeout(() => {
        blink = 1;
        queue();
        scheduleBlink();
      }, 130);
    }, 2500 + Math.random() * 4000);
  };
  scheduleBlink();
}
