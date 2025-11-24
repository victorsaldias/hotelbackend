document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a").forEach(a => {
        if (a.textContent.includes("Reservar")) {
            a.addEventListener("click", (e) => {
                const token = localStorage.getItem("token");
                if (!token) {
                    e.preventDefault();
                    window.location.href = "login.html";
                }
            });
        }
    });
});
