$("#loginForm").on("submit", async function (e) {
    e.preventDefault();

    const correo = $("#correo").val();
    const password = $("#password").val();

    const res = await fetch("http://localhost:3000/api/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    alert("Login exitoso");
    window.location.href = "index.html"; // o dashboard
});
