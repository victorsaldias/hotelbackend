document.addEventListener("DOMContentLoaded", () => {

    $('select[data-nice!="false"]').niceSelect();
    // ============================
    // VALIDAR SESIÓN
    // ============================
    let usuario = JSON.parse(localStorage.getItem("usuarioCliente"));

    if (!usuario || !usuario.idCliente || isNaN(usuario.idCliente)) {
        window.location.href = "/hotelfrontend/pages/login.html";
        return;
    }

    const idCliente = usuario.idCliente;

    // ============================
    // CAMPOS DEL FORM
    // ============================
    const rutInput       = document.getElementById("rut");
    const correoInput    = document.getElementById("correo");
    const nombreInput    = document.getElementById("nombre");
    const apellidoInput  = document.getElementById("apellido");
    const telefonoInput  = document.getElementById("telefono");
    const direccionInput = document.getElementById("direccion");
    const btnEditar  = document.getElementById("btnEditar");
    const btnGuardar = document.getElementById("btnGuardar");
    const comunaSelect   = document.getElementById("comuna");
    const regionSelect = document.getElementById("region");
    const provinciaSelect = document.getElementById("provincia");

console.log("regionSelect     =", regionSelect);
console.log("provinciaSelect  =", provinciaSelect);
console.log("comunaSelect     =", comunaSelect);

regionSelect.addEventListener("change", () => {
    console.log("🔥 Cambió región:", regionSelect.value);

    console.log("Antes provinciaSelect.value =", provinciaSelect.value);
    console.log("Antes provinciaSelect.innerHTML =", provinciaSelect.innerHTML);

    // NO CAMBIAMOS NADA, SOLO MOSTRAMOS
});

provinciaSelect.addEventListener("change", () => {
    console.log("🔥 Cambió provincia:", provinciaSelect.value);
});
    // ============================
    // BLOQUEAR / HABILITAR CAMPOS
    // ============================

    function bloquearCampos() {
        [
            rutInput,
            correoInput,
            nombreInput,
            apellidoInput,
            telefonoInput,
            direccionInput,
            regionSelect,
            provinciaSelect,
            comunaSelect
        ].forEach(i => i.setAttribute("disabled", true));
    }

    function habilitarCampos() {
        [   
            rutInput,
            correoInput,
            nombreInput,
            apellidoInput,
            telefonoInput,
            direccionInput,
            regionSelect,
            provinciaSelect,
            comunaSelect
        ].forEach(i => i.removeAttribute("disabled"));
    }

    bloquearCampos(); // INICIAL

    // ============================
    // CARGAR PERFIL
    // ============================

    async function cargarPerfil() {
        try {
            const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/clientes/id/${idCliente}`);
            const cliente = await resp.json();
            console.log("regionSelect:", regionSelect);
console.log("provinciaSelect:", provinciaSelect);
console.log("comunaSelect:", comunaSelect);
            
console.log("CLIENTE RAW:", cliente);

for (const [k, v] of Object.entries(cliente)) {
    console.log("CAMPO:", k, "=>", v);
}
            if (!resp.ok) {
                console.error("Cliente no encontrado:", cliente);
                return Swal.fire("Error", "No se pudo cargar el perfil", "error");
            }

            rutInput.value       = cliente.rut || "";
            correoInput.value    = cliente.correo || "";
            nombreInput.value    = cliente.nombre || "";
            apellidoInput.value  = cliente.apellido || "";
            telefonoInput.value  = cliente.telefono || "";
            direccionInput.value = cliente.direccion || "";

            await cargarRegiones(cliente.idRegion);
await cargarProvincias(cliente.idRegion, cliente.idProvincia);
await cargarComunas(cliente.idProvincia, cliente.idComuna);

        } catch (err) {
            console.error("Error cargando perfil:", err);
            Swal.fire("Error", "No se pudieron cargar tus datos de perfil", "error");
        }
    }

    cargarPerfil();

    // ============================
    // EDITAR → HABILITAR CAMPOS
    // ============================

    btnEditar.addEventListener("click", () => {
        habilitarCampos();
        btnGuardar.removeAttribute("disabled");
        btnGuardar.style.opacity = "1";
    });

    // ============================
    // GUARDAR CAMBIOS (PUT)
    // ============================

    const form = document.getElementById("perfilForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

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
                throw new Error(err.message || "No se pudo actualizar el perfil");
            }

            Swal.fire({
                icon: "success",
                title: "Cambios guardados",
                text: "Tu perfil se actualizó correctamente",
                timer: 1800,
                showConfirmButton: false
            });

            bloquearCampos();
            btnGuardar.setAttribute("disabled", true);
            btnGuardar.style.opacity = "0.5";

            cargarPerfil();

        } catch (err) {
            console.error("Error actualizando perfil:", err);
            Swal.fire("Error", err.message, "error");
        }
    });

async function cargarRegiones(idRegionActual) {
    const resp = await fetch("https://hotelbackend-hzc4.onrender.com/api/regiones");
    let regiones = await resp.json();

    regiones.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es',{sensitivity:'base'}));

    regionSelect.innerHTML = "";

    regiones.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.idRegion;
        opt.textContent = r.nombre;

        if (r.idRegion == idRegionActual) opt.selected = true;

        regionSelect.appendChild(opt);
    });
}

async function cargarProvincias(idRegion, idProvinciaActual) {
    const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/provincias/${idRegion}`);
    let provincias = await resp.json();

    provincias.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es',{sensitivity:'base'}));

    provinciaSelect.innerHTML = "";

    provincias.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.idProvincia;
        opt.textContent = p.nombre;

        if (p.idProvincia == idProvinciaActual) opt.selected = true;

        provinciaSelect.appendChild(opt);
    });
}

async function cargarProvincias(idRegion, idProvinciaActual) {
    const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/provincias/${idRegion}`);
    let provincias = await resp.json();

    provincias.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es',{sensitivity:'base'}));

    provinciaSelect.innerHTML = "";

    provincias.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.idProvincia;
        opt.textContent = p.nombre;

        if (p.idProvincia == idProvinciaActual) opt.selected = true;

        provinciaSelect.appendChild(opt);
    });
}

async function cargarComunas(idProvincia, idComunaActual) {
    const resp = await fetch(`https://hotelbackend-hzc4.onrender.com/api/comunas/${idProvincia}`);
    //hzc4
    let comunas = await resp.json();

    comunas.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es',{sensitivity:'base'}));

    comunaSelect.innerHTML = "";

    comunas.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.idComuna;
        opt.textContent = c.nombre;

        if (c.idComuna == idComunaActual) opt.selected = true;

        comunaSelect.appendChild(opt);
    });
}
regionSelect.addEventListener("change", () => {

    // Reiniciar selects correctamente
    provinciaSelect.value = "";
    provinciaSelect.innerHTML = `<option value='' disabled selected>Seleccione provincia</option>`;

    comunaSelect.value = "";
    comunaSelect.innerHTML = `<option value='' disabled selected>Seleccione comuna</option>`;

    // Cargar provincias reales de la región seleccionada
    cargarProvincias(regionSelect.value, null);
});

provinciaSelect.addEventListener("change", () => {

    comunaSelect.value = "";
    comunaSelect.innerHTML = `<option value='' disabled selected>Seleccione comuna</option>`;

    cargarComunas(provinciaSelect.value, null);
});

});

document.addEventListener("DOMContentLoaded", () => {
    if (typeof $ !== "undefined" && $('#comuna').length) {
        try {
            $('#comuna').niceSelect('destroy');  // destruir aunque no haya clase
        } catch (e) {
            console.warn("No había nice-select activo todavía", e);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (typeof $ !== "undefined" && $('#region').length) {
        try {
            $('#region').niceSelect('destroy');  // destruir aunque no haya clase
        } catch (e) {
            console.warn("No había nice-select activo todavía", e);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (typeof $ !== "undefined" && $('#provincia').length) {
        try {
            $('#provincia').niceSelect('destroy');  // destruir aunque no haya clase
        } catch (e) {
            console.warn("No había nice-select activo todavía", e);
        }
    }
});