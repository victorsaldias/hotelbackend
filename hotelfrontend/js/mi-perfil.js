/* ============================================================
   PERFIL CLIENTE – VERSIÓN FINAL OPTIMIZADA
============================================================ */

let usuario = JSON.parse(localStorage.getItem("usuarioCliente"));
const idCliente = usuario?.idCliente;

// ========================================
// Validar sesión ANTES de cargar todo
// ========================================
document.addEventListener("DOMContentLoaded", () => {

    if (!usuario || !idCliente) {
        window.location.href = "../pages/login.html";
        return;
    }

    // Forzar niceSelect solo en selects que no lo bloqueen
    $('select[data-nice!="false"]').niceSelect();

    // Campos del formulario
    const rutInput       = document.getElementById("rut");
    const correoInput    = document.getElementById("correo");
    const nombreInput    = document.getElementById("nombre");
    const apellidoInput  = document.getElementById("apellido");
    const telefonoInput  = document.getElementById("telefono");
    const direccionInput = document.getElementById("direccion");

    const regionSelect     = document.getElementById("region");
    const provinciaSelect  = document.getElementById("provincia");
    const comunaSelect     = document.getElementById("comuna");

    const btnEditar  = document.getElementById("btnEditar");
    const btnGuardar = document.getElementById("btnGuardar");

    /* ============================================================
       BLOQUEAR / HABILITAR CAMPOS
    ============================================================ */
    function bloquearCampos() {
        [
            rutInput, correoInput, nombreInput, apellidoInput,
            telefonoInput, direccionInput,
            regionSelect, provinciaSelect, comunaSelect
        ].forEach(el => el.setAttribute("disabled", true));

        btnGuardar.setAttribute("disabled", true);
        btnGuardar.style.opacity = "0.5";
    }

    function habilitarCampos() {
        [
            rutInput, correoInput, nombreInput, apellidoInput,
            telefonoInput, direccionInput,
            regionSelect, provinciaSelect, comunaSelect
        ].forEach(el => el.removeAttribute("disabled"));

        btnGuardar.removeAttribute("disabled");
        btnGuardar.style.opacity = "1";
    }

    bloquearCampos();

    /* ============================================================
       CARGAR PERFIL
    ============================================================ */
    async function cargarPerfil() {
        try {
            const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/clientes/id/${idCliente}`);
            const cliente = await resp.json();

            if (!resp.ok) {
                return Swal.fire("Error", "No se pudo cargar el perfil", "error");
            }

            console.log("CLIENTE RECIBIDO:", cliente);

            // Cargar valores
            rutInput.value       = cliente.rut || "";
            correoInput.value    = cliente.correo || "";
            nombreInput.value    = cliente.nombre || "";
            apellidoInput.value  = cliente.apellido || "";
            telefonoInput.value  = cliente.telefono || "";
            direccionInput.value = cliente.direccion || "";

            // Backend ahora entrega idRegion e idProvincia
            await cargarRegiones(cliente.idRegion);
            await cargarProvincias(cliente.idRegion, cliente.idProvincia);
            await cargarComunas(cliente.idProvincia, cliente.idComuna);

        } catch (err) {
            console.error("Error cargando perfil:", err);
            Swal.fire("Error", "No se pudieron cargar tus datos de perfil", "error");
        }
    }

    cargarPerfil();

    /* ============================================================
       CARGA DE REGIONES / PROVINCIAS / COMUNAS
    ============================================================ */

    async function cargarRegiones(idRegionActual) {
        const resp = await fetch("https://hotelbackend-hzc4.onrender.com/api/regiones");
        const regiones = await resp.json();

        regionSelect.innerHTML = "";
        regiones.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));

        regiones.forEach(r => {
            regionSelect.innerHTML += `
                <option value="${r.idRegion}" ${r.idRegion == idRegionActual ? "selected" : ""}>
                    ${r.nombre}
                </option>`;
        });
    }

    async function cargarProvincias(idRegion, idProvinciaActual) {
        if (!idRegion) return;

       const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/provincias/${idRegion}`);
        const provincias = await resp.json();

        provinciaSelect.innerHTML = "";
        provincias.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));

        provincias.forEach(p => {
            provinciaSelect.innerHTML += `
                <option value="${p.idProvincia}" ${p.idProvincia == idProvinciaActual ? "selected" : ""}>
                    ${p.nombre}
                </option>`;
        });
    }

    async function cargarComunas(idProvincia, idComunaActual) {
        if (!idProvincia) return;

        const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/comunas/por-provincia/${idProvincia}`);
        const comunas = await resp.json();

        comunaSelect.innerHTML = "";
        comunas.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));

        comunas.forEach(c => {
            comunaSelect.innerHTML += `
                <option value="${c.idComuna}" ${c.idComuna == idComunaActual ? "selected" : ""}>
                    ${c.nombre}
                </option>`;
        });
    }

    /* ============================================================
       SELECT DEPENDIENTES
    ============================================================ */
    regionSelect.addEventListener("change", () => {
        provinciaSelect.innerHTML = `<option disabled selected>Seleccione provincia</option>`;
        comunaSelect.innerHTML    = `<option disabled selected>Seleccione comuna</option>`;
        cargarProvincias(regionSelect.value, null);
    });

    provinciaSelect.addEventListener("change", () => {
        comunaSelect.innerHTML = `<option disabled selected>Seleccione comuna</option>`;
        cargarComunas(provinciaSelect.value, null);
    });

    /* ============================================================
       EDITAR PERFIL
    ============================================================ */
    btnEditar.addEventListener("click", () => {
        habilitarCampos();
    });

    /* ============================================================
       GUARDAR PERFIL (PUT)
    ============================================================ */
    document.getElementById("perfilForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!comunaSelect.value) {
            return Swal.fire("Error", "Debes seleccionar una comuna válida", "error");
        }

        const payload = {
            rut: rutInput.value.trim(),
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            correo: correoInput.value.trim(),
            telefono: telefonoInput.value.trim(),
            direccion: direccionInput.value.trim(),
            idComuna: parseInt(comunaSelect.value)
        };

        try {
            const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/clientes/id/${idCliente}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const err = await resp.json();
                throw new Error(err.message);
            }

            Swal.fire({
                icon: "success",
                title: "Cambios guardados",
                timer: 1500,
                showConfirmButton: false
            });

            bloquearCampos();
            cargarPerfil();

        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    });

});


/* ============================================================
   CAMBIO DE CONTRASEÑA
============================================================ */
const modalPw        = document.getElementById("modalPassword");
const btnCambiarPw   = document.getElementById("btnCambiarPassword");
const btnCerrarPw    = document.getElementById("btnCerrarModal");
const btnConfirmarPw = document.getElementById("btnConfirmarCambio");

btnCambiarPw.addEventListener("click", () => modalPw.style.display = "flex");
btnCerrarPw.addEventListener("click", () => modalPw.style.display = "none");

btnConfirmarPw.addEventListener("click", async () => {
    const actual = document.getElementById("pwActual").value.trim();
    const nueva  = document.getElementById("pwNueva").value.trim();
    const nueva2 = document.getElementById("pwNueva2").value.trim();

    if (!actual || !nueva || !nueva2)
        return Swal.fire("Error", "Completa todos los campos", "warning");

    if (nueva !== nueva2)
        return Swal.fire("Error", "Las contraseñas no coinciden", "error");

    try {
        const resp = await fetch(
            `https://hotelbackend-hzc4.onrender.com/api/clientes/cambiar-password/${idCliente}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passwordActual: actual, passwordNueva: nueva })
            }
        );

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.message);

        Swal.fire("Éxito", "Contraseña actualizada", "success");
        modalPw.style.display = "none";

    } catch (err) {
        Swal.fire("Error", err.message, "error");
    }
});
