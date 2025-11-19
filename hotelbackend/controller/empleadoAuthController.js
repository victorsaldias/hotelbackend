import { buscarEmpleadoPorCorreo } from "../model/empleadoModel.js";

export async function loginEmpleado(req, res) {
    const { correo, password } = req.body;

    if (!correo || !password)
        return res.json({ ok: false, message: "Completa todos los campos" });

    try {
        const empleado = await buscarEmpleadoPorCorreo(correo);

        if (!empleado)
            return res.json({ ok: false, message: "Correo no registrado" });

       
        if (password !== empleado.password)
            return res.json({ ok: false, message: "Contraseña incorrecta" });

       
        req.session.empleado = {
            idEmpleado: empleado.idEmpleado,
            rut: empleado.rut,
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            rol: empleado.rol,
            idSucursal: empleado.idSucursal,
            correo: empleado.correo
        };

        console.log("SESIÓN GUARDADA:", req.session.empleado);

        return res.json({ ok: true });

    } catch (error) {
        console.log("ERROR LOGIN EMPLEADO:", error);
        return res.json({ ok: false, message: "Error interno" });
    }
}

export function obtenerSesion(req, res) {
    console.log("SESION CONSULTADA:", req.session.empleado);

    if (!req.session.empleado)
        return res.json({ ok: false });

    return res.json({
        ok: true,
        empleado: req.session.empleado
    });
}
