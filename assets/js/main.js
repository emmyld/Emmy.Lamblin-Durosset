/* =================================================================
Ce site a été réalisé à l'aide de connaissances personnelles et 
non professionnelles en développement web.
================================================================= */


/* -------------------------
ANIMATION ECRAN D'INTRODUCTION
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const words = ["Créative", "Passionnée", "Curieuse", "Persévérante", "Engagée"];
  const wordElement = document.getElementById("intro-word");
  const overlay = document.getElementById("intro-overlay");
  const progress = document.querySelector(".progress-bar");

  let index = 0;
  const interval = 400;

  function showNextWord() {
    if (index < words.length - 1) {
      wordElement.textContent = words[index++];
      setTimeout(showNextWord, interval);
    } else {
      wordElement.textContent = words[index];
      wordElement.style.transition = "opacity 0.6s ease";
      setTimeout(() => wordElement.style.opacity = 0, interval);
    }
  }

  showNextWord();
  setTimeout(() => progress.style.width = "100%", 50);

  const totalDuration = interval * (words.length + 1);
  setTimeout(() => {
    overlay.style.transition = "opacity 1s ease, transform 1s ease";
    overlay.style.opacity = "0";
    overlay.style.transform = "scale(1.05)";
  }, totalDuration);

  setTimeout(() => overlay.style.display = "none", totalDuration + 1000);
});


/* -------------------------
SCROLLSPY - NAVBAR ACTIVE
------------------------- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
  let scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }

    if (scrollY < 100) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#accueil") {
          link.classList.add("active");
        }
      });
    }
  });
}
window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);


/* -------------------------
NAVBAR ACTIVE - DROPDOWN "PORTFOLIO"
------------------------- */
window.addEventListener('scroll', function () {
  const scrollY = window.scrollY;
  const offset = window.innerHeight / 2;

  const sections = [
    { id: 'accueil', linkIds: ['link-accueil'] },
    { id: 'qui-suis-je', linkIds: ['link-quisuisje'] },
    { id: 'portfolio', linkIds: ['portfolio-link-desktop', 'portfolio-link-mobile'] },
    { id: 'podcast', linkIds: ['link-podcast', 'link-podcast-mobile', 'portfolio-link-desktop', 'portfolio-link-mobile'] },
    { id: 'photographies', linkIds: ['link-photographies', 'link-photographies-mobile', 'portfolio-link-desktop', 'portfolio-link-mobile'] },
  ];

  document.querySelectorAll('.nav-links a, .portfolio-title').forEach(el => el.classList.remove('active'));

  for (let section of sections) {
    const elem = document.getElementById(section.id);
    if (!elem) continue;

    const top = elem.offsetTop;
    const bottom = top + elem.offsetHeight;

    if (scrollY + offset >= top && scrollY + offset < bottom) {
      section.linkIds.forEach(id => {
        const link = document.getElementById(id);
        if (link) link.classList.add('active');
      });
      break;
    }
  }
});


/* -------------------------
MENU BURGER - NAVIGATION RESPONSIVE
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");

  let outsideClickListener = null;

  function toggleMenu() {
    const isOpen = nav.classList.toggle("active");
    burger.classList.toggle("open", isOpen);

    if (isOpen) {
      document.addEventListener(
        "click",
        outsideClickListener = (e) => {
          if (!nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove("active");
            burger.classList.remove("open");
            document.removeEventListener("click", outsideClickListener);
          }
        }
      );
    } else {

      document.removeEventListener("click", outsideClickListener);
    }
  }

  if (burger && nav) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        burger.classList.remove("open");
        document.removeEventListener("click", outsideClickListener);
      });
    });
  }
});


/* -------------------------
 MOT DYNAMIQUE DANS LE HERO
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const words = ["social media", "content", "influence"];
  let i = 0;

  const spanDesktop = document.querySelector(".desktop-only #changing-word");
  const spanMobile = document.querySelector(".mobile-only #changing-word");

  setInterval(() => {
    i = (i + 1) % words.length;

    if (spanDesktop) spanDesktop.textContent = words[i];
    if (spanMobile) spanMobile.textContent = words[i];
  }, 1000);
});


/* -------------------------
SLIDER PHOTOGRAPHIES
------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  const isMobile = window.innerWidth <= 991;

  const slider = document.getElementById(isMobile ? "portfolio-slider-mobile" : "portfolio-slider-desktop");
  const btnPrev = document.getElementById(isMobile ? "prev-portfolio-mobile" : "prev-portfolio-desktop");
  const btnNext = document.getElementById(isMobile ? "next-portfolio-mobile" : "next-portfolio-desktop");

  const slideStep = isMobile ? 228 : 261;
  const photoIndexToCenter = isMobile ? 5 : 5;
  let isAnimating = false;

  const centerPhoto = () => {
    const sliderWidth = slider.clientWidth;
    const offset = (slideStep * photoIndexToCenter) - (sliderWidth / 2) + (slideStep / 2);

    slider.style.scrollBehavior = "auto";
    slider.scrollLeft = offset;

    requestAnimationFrame(() => {
      slider.style.scrollBehavior = "smooth";
      updateArrowState();
    });
  };

  const updateArrowState = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    btnPrev.classList.toggle("disabled", scrollLeft <= 0);
    btnNext.classList.toggle("disabled", scrollLeft >= maxScrollLeft - 1);
  };

  const goTo = (direction = "next") => {
    if (isAnimating) return;
    isAnimating = true;

    const delta = direction === "next" ? slideStep : -slideStep;
    slider.scrollBy({ left: delta, behavior: "smooth" });

    setTimeout(() => {
      isAnimating = false;
      updateArrowState();
    }, 400);
  };

  btnNext.addEventListener("click", () => goTo("next"));
  btnPrev.addEventListener("click", () => goTo("prev"));
  slider.addEventListener("scroll", updateArrowState);

const waitAndCenter = () => {
  const isMobile = window.innerWidth <= 991;
  if (isMobile) {
    setTimeout(centerPhoto, 500);
  } else {
    centerPhoto();
  }
};

window.addEventListener("load", waitAndCenter);

});


/* -------------------------
BOUTON SCROLL HAUT / BAS
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scroll-toggle");

  const svgDown = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
    </svg>`;

  const svgUp = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
    </svg>`;

  const isAtBottom = () => window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

  const updateIcon = () => {
    btn.innerHTML = isAtBottom() ? svgUp : svgDown;
    btn.setAttribute("aria-label", isAtBottom() ? "Remonter en haut" : "Aller en bas");
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: isAtBottom() ? 0 : document.body.scrollHeight, behavior: "smooth" });
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.scrollTo({ top: isAtBottom() ? 0 : document.body.scrollHeight, behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", updateIcon);
  updateIcon();
});



