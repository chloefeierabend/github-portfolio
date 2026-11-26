const header = document.querySelector(".cf-header");
const menuBtn = header && header.querySelector(".cf-menu-btn");

if (menuBtn) {
  const label = menuBtn.querySelector("span");

  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "close" : "menu";
  };

  menuBtn.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      setOpen(false);
      menuBtn.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) setOpen(false);
  });
}
