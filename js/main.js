/*
  Main JS — Theme toggle, mobile menu, scroll animations
*/
(() => {
  const root = document.documentElement;
  const key = "theme";

  // ─── Theme ───
  function setTheme(t) {
    if (!t) { root.removeAttribute("data-theme"); return; }
    root.setAttribute("data-theme", t);
    localStorage.setItem(key, t);
  }

  const saved = localStorage.getItem(key);
  if (saved === "light") setTheme("light");

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const isLight = root.getAttribute("data-theme") === "light";
      setTheme(isLight ? "" : "light");
      btn.setAttribute("aria-pressed", String(!isLight));
      btn.textContent = isLight ? "☀︎" : "🌙";
    });
  }

  // ─── Mobile menu ───
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ─── Scroll-triggered fade-in animations ───
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // ─── Active nav link on scroll ───
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach((a) => {
          a.classList.remove("active");
          if (a.getAttribute("href") === `#${id}`) {
            a.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  // ─── Smooth header background on scroll ───
  const header = document.querySelector(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.style.borderBottomColor = "rgba(0, 212, 255, 0.08)";
      } else {
        header.style.borderBottomColor = "";
      }
    }, { passive: true });
  }
})();
