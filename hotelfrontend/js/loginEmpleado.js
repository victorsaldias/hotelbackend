async function loginEmpleado() {
    const correo = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const res = await fetch("http://localhost:3000/api/empleados/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
    });

    const data = await res.json();

    if (!data.ok) {
        alert(data.message);
        return;
    }

    
    const sesionRes = await fetch("http://localhost:3000/api/empleados/sesion", {
        credentials: "include"
    });

    const sesion = await sesionRes.json();
    if (!sesion.ok) return alert("Error obteniendo sesión");

    const rol = sesion.empleado.rol;

    if (rol === "Administrador")
        window.location.href = "dashboard-admin.html";

    if (rol === "Recepcionista")
        window.location.href = "recepcionista.html";

    if (rol === "Aseo")
        window.location.href = "personal-aseo.html";
}
