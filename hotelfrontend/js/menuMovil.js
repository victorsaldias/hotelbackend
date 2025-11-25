const menu = document.querySelector(".sidebar");
const overlay = document.getElementById("overlayMenu");

function toggleMenu() {
    menu.classList.toggle("show");
    overlay.classList.toggle("active");
}

overlay.addEventListener("click", toggleMenu);
