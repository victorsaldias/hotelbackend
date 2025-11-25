import bcrypt from "bcrypt";
import { buscarEmpleadoPorCorreo } from "../model/empleadoAuthModel.js";

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function normalizarRol(rol) {
    const roles = {
        'administrador': 'admin',
        'recepcionista': 'recepcionista',
        'aseo': 'aseo'
    };
    return roles[rol.toLowerCase()] || rol.toLowerCase();
}

export async function loginEmpleado(req, res) {
    try {
        const { correo, password } = req.body;

        console.log("📥 Intento de login:", correo);

        // Validaciones
        if (!correo || !password) {
            return res.status(400).json({ 
                message: "Correo y contraseña son obligatorios" 
            });
        }

        if (!validarCorreo(correo)) {
            return res.status(400).json({ 
                message: "Formato de correo inválido" 
            });
        }

        // Buscar empleado
        const empleado = await buscarEmpleadoPorCorreo(correo);

        if (!empleado) {
            console.log("❌ Empleado no encontrado");
            return res.status(401).json({ 
                message: "Correo o contraseña incorrectos" 
            });
        }

        console.log("✅ Empleado encontrado:", empleado.nombre);

        // Verificar contraseña
        let passwordValida = false;

        // Si está hasheada con bcrypt
        if (empleado.password.startsWith('$2b$') || empleado.password.startsWith('$2a$')) {
            passwordValida = await bcrypt.compare(password, empleado.password);
            console.log("🔑 Comparación bcrypt:", passwordValida ? "✅" : "❌");
        } else {
            // Si está en texto plano (SOLO PARA DESARROLLO)
            passwordValida = (password === empleado.password);
            console.log("⚠️ Comparación texto plano:", passwordValida ? "✅" : "❌");
        }

        if (!passwordValida) {
            console.log("❌ Contraseña incorrecta");
            return res.status(401).json({ 
                message: "Correo o contraseña incorrectos" 
            });
        }

        console.log("✅ Contraseña correcta");

        // Normalizar rol
        const rolNormalizado = normalizarRol(empleado.rol);

        // Guardar en sesión
        req.session.userId = empleado.idEmpleado;
        req.session.rol = rolNormalizado;

        console.log("💾 Sesión guardada:", {
            userId: req.session.userId,
            rol: req.session.rol
        });

        // Respuesta exitosa
        return res.status(200).json({
            message: "Login exitoso",
            idEmpleado: empleado.idEmpleado,
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            rol: rolNormalizado,
            sucursal: empleado.idSucursal
        });

    } catch (error) {
        console.error("❌ Error en loginEmpleado:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor" 
        });
    }
}