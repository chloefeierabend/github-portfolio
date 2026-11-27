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

/* Hero bird */
if (!reduceMotion) {
  document.querySelectorAll("img.js-bird").forEach(async (img) => {
    const art = img.parentElement;
    const assets = img.src.replace(/[^/]*$/, "");
    const alt = img.alt;
    setupFeathers(art, assets);

    const svg = await loadSvg(img.src);
    if (!svg) return;
    svg.classList.add("bird-svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", alt);
    img.replaceWith(svg);
    watchEyes().add(svg);

    const connect = art.closest(".bird-hero")?.querySelector(".btn--solid");
    if (connect) celebrate(svg, connect);
  });
}

async function loadSvg(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg || !svg.querySelector("#left-pupil")) return null;
    svg.setAttribute("focusable", "false");
    return svg;
  } catch {
    return null;
  }
}

/* Celebration on "Let's connect" */
function celebrate(svg, connect) {
  const arms = {
    stand: svg.querySelector("#arms-stand"),
    out: svg.querySelector("#arms-out"),
    up: svg.querySelector("#arms-up"),
  };
  if (!arms.stand || !arms.out || !arms.up) return;

  Object.entries(arms).forEach(([key, el]) => {
    el.setAttribute("visibility", "visible");
    el.style.opacity = key === "stand" ? "1" : "0";
    el.style.transition = "opacity 30ms linear";
  });

  let pose = "stand";
  let timer;
  arms.up.style.transformBox = "fill-box";
  arms.up.style.transformOrigin = "50% 100%";

  // In-between swing
  const swing = [...arms.out.children]
    .map((el) => ({ el, x: el.getBBox().x }))
    .sort((a, b) => a.x - b.x)
    .map(({ el }, i) => {
      el.style.transformBox = "fill-box";
      el.style.transformOrigin = i === 0 ? "100% 50%" : "0% 50%";
      return { el, raise: i === 0 ? 1 : -1 };
    });
  let swingAnims = [];
  const tilt = (from, to) => {
    swingAnims.forEach((a) => a.cancel());
    swingAnims = swing.map(({ el, raise }) =>
      el.animate(
        [{ transform: `rotate(${from * raise}deg)` }, { transform: `rotate(${to * raise}deg)` }],
        { duration: 150, easing: "linear", fill: "forwards" }
      )
    );
  };

  const show = (name) => {
    pose = name;
    Object.entries(arms).forEach(([key, el]) => {
      el.style.opacity = key === name ? "1" : "0";
    });
    if (name === "up") {
      arms.up.animate(
        [
          { transform: "scale(0.99)" },
          { transform: "scale(1.012)", offset: 0.45 },
          { transform: "scale(0.998)", offset: 0.75 },
          { transform: "scale(1)" },
        ],
        { duration: 260, easing: "ease-out" }
      );
    }
  };
  let target = "stand";
  let busy = false;

  const settle = () => {
    busy = false;
    if (target !== pose) run(target);
  };
  const run = (to) => {
    busy = true;
    tilt(...(to === "up" ? [0, 18] : [18, -12]));
    show("out");
    timer = setTimeout(() => {
      show(to);
      timer = setTimeout(settle, to === "up" ? 300 : 120);
    }, 70);
  };
  const up = () => {
    target = "up";
    if (!busy && pose !== "up") run("up");
  };
  const down = () => {
    target = "stand";
    if (!busy && pose !== "stand") run("stand");
  };

  connect.addEventListener("pointerenter", up);
  connect.addEventListener("focus", up);
  connect.addEventListener("pointerleave", down);
  connect.addEventListener("blur", down);
}

/* Eyes */
function watchEyes() {
  const sets = [];

  const MAX_X = 5.5;
  const MAX_Y = 7;
  let pointer = null;
  let blink = 1;
  let queued = false;

  const draw = () => {
    queued = false;
    sets.forEach(({ svg, pupils }) => {
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

  return {
    add(svg) {
      const pupils = ["#left-pupil", "#right-pupil"]
        .map((sel) => svg.querySelector(sel))
        .filter(Boolean)
        .map((pupil) => {
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          pupil.replaceWith(g);
          g.append(pupil);
          const box = g.getBBox();
          return { g, cx: box.x + box.width / 2, cy: box.y + box.height / 2, dx: 0, dy: 0 };
        });
      sets.push({ svg, pupils });
      queue();
    },
  };
}

/* Feathers */
function setupFeathers(art, assets) {
  const sources = [1, 2, 3].map((n) => `${assets}feather-${n}.svg`);
  const pick = () => sources[Math.floor(Math.random() * sources.length)];
  const rand = (min, max) => min + Math.random() * (max - min);

  const drop = ({ startX, startY, driftX, fallY, delay, size }) => {
    const feather = document.createElement("img");
    feather.className = "feather";
    feather.src = pick();
    feather.alt = "";
    feather.style.width = `${size}px`;
    feather.style.left = `${startX}px`;
    feather.style.top = `${startY}px`;
    art.append(feather);

    const spin = rand(18, 32) * (Math.random() < 0.5 ? -1 : 1);
    const sway = rand(10, 16) * (Math.random() < 0.5 ? -1 : 1);
    const animation = feather.animate(
      [
        { transform: `translate(0, 0) rotate(${spin}deg)`, opacity: 0 },
        { transform: `translate(${driftX * 0.5}px, ${-fallY * 0.3}px) rotate(${spin + sway}deg)`, opacity: 1, offset: 0.2 },
        { transform: `translate(${driftX * 0.7 + sway}px, ${fallY * 0.4}px) rotate(${spin - sway}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${driftX - sway * 0.5}px, ${fallY}px) rotate(${spin + sway * 0.6}deg)`, opacity: 0 },
      ],
      { duration: rand(1600, 2100), delay, easing: "ease-out", fill: "both" }
    );
    animation.onfinish = () => feather.remove();
  };

  const birdBox = () => {
    const bird = art.querySelector(".bird-svg, img.js-bird");
    const a = art.getBoundingClientRect();
    const b = bird.getBoundingClientRect();
    return { x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height };
  };

  // Clicking the bird sheds a feather
  art.addEventListener("click", (e) => {
    if (!e.target.closest(".bird-svg, img.js-bird")) return;
    const b = birdBox();
    const startY = b.y + b.h * rand(0.3, 0.45);
    drop({
      startX: b.x + b.w * rand(0.3, 0.6),
      startY,
      driftX: rand(-40, 40),
      fallY: (b.y + b.h * 0.95 - startY) * rand(0.85, 0.95),
      delay: 0,
      size: rand(34, 42),
    });
  });
}
