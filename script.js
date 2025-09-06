// Navbar toggle for mobile
const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Scroll animations
const animatedItems = document.querySelectorAll(".animate-fade, .animate-up");
function showOnScroll() {
  const trigger = window.innerHeight * 0.85;
  animatedItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < trigger) {
      item.classList.add("animate-show");
    }
  });
}
window.addEventListener("scroll", showOnScroll);
window.addEventListener("load", showOnScroll);
