import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
    buscarEmpleadoPorCorreo, 
    crearEmpleadoBD,
    listarEmpleadosBD
} from "../model/empleadoModel.js";

// LOGIN EMPLEADO POR CORREO
export async function loginEmpleado(req, res) {

    const { correo, password } = req.body;

    try {
        if (!correo || !password) {
            return res.status(400).json({ message: "Correo y contraseña obligatorios." });
        }

        // Buscar empleado por correo
        const empleado = await buscarEmpleadoPorCorreo(correo);

        if (!empleado) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        // Comparar contraseña usando bcryptjs
        const coincide = await bcrypt.compare(password, empleado.password);

        if (!coincide) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        // Datos dentro del token
        const payload = {
            idEmpleado: empleado.idEmpleado,
            correo: empleado.correo,
            rol: empleado.rol,
            idSucursal: empleado.idSucursal
        };

        // Crear token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

        return res.status(200).json({
            message: "Login exitoso",
            token,
            empleado: {
                idEmpleado: empleado.idEmpleado,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                rol: empleado.rol,
                correo: empleado.correo
            }
        });

    } catch (error) {
        console.error("Error login empleado:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}



// CREAR EMPLEADO (ADMIN) CON CONTRASEÑA AUTOMÁTICA
export async function crearEmpleado(req, res) {
    const { rut, correo, nombre, apellido, rol, idEstadoEmpleado, idSucursal } = req.body;

    try {
        if (!rut || !correo || !nombre || !apellido || !rol || !idEstadoEmpleado || !idSucursal) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        } 

        const empleadoExistente = await buscarEmpleadoPorCorreo(correo);
        if (empleadoExistente) {
            return res.status(409).json({ message: "El correo ya está en uso." });
        }

        // Generar contraseña automática
        const passwordGenerada = generarPasswordAutomatico();

        // Hashear con bcryptjs
        const hashedPassword = await bcrypt.hash(passwordGenerada, 10);

        const nuevoEmpleado = {
            rut,
            correo,
            password: hashedPassword,
            nombre,
            apellido,
            rol,
            idEstadoEmpleado,
            idSucursal
        };

        await crearEmpleadoBD(nuevoEmpleado);
        
        return res.status(201).json({ 
            message: "Empleado creado exitosamente.",
            contraseñaTemporal: passwordGenerada  // El admin se la entrega al empleado
        });

    } catch (error) {
        console.error("Error al crear empleado:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    } 
}

// LISTAR EMPLEADOS
export async function listarEmpleados(req, res) {
    try {
        const empleados = await listarEmpleadosBD();
        return res.status(200).json(empleados);

    } catch (error) {
        console.error("Error al listar empleados:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}

// CAMBIAR CONTRASEÑA (EMPLEADO LOGUEADO)
export async function cambiarPasswordEmpleado(req, res) {
    const idEmpleado = req.user?.idEmpleado; // viene del token JWT
    const { passwordActual, passwordNueva } = req.body;

    try {
        if (!idEmpleado) {
            return res.status(401).json({ message: "No autenticado." });
        }

        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({ message: "Debes enviar contraseña actual y nueva." });
        }

        const empleado = await buscarEmpleadoPorId(idEmpleado);

        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado." });
        }

        const coincide = await bcrypt.compare(passwordActual, empleado.password);
        if (!coincide) {
            return res.status(401).json({ message: "La contraseña actual es incorrecta." });
        }

        const hashed = await bcrypt.hash(passwordNueva, 10);

        await actualizarPasswordEmpleado(idEmpleado, hashed);

        return res.status(200).json({ 
            message: "Contraseña cambiada exitosamente."
        });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        return res.status(500).json({ message: "Error interno al cambiar contraseña." });
    }
}

// MODIFICAR EMPLEADO(ADMIN)
export async function modificarEmpleado(req, res) {
    const idEmpleado = req.params.idEmpleado;
    const { nombre, apellido, rol, idEstadoEmpleado, idSucursal, password } = req.body;

    try {
        if (!nombre || !apellido || !rol || !idEstadoEmpleado || !idSucursal) {
            return res.status(400).json({ 
                message: "Nombre, apellido, rol, estado e idSucursal son obligatorios."
            });
        }

        // Sin cambio de contraseña
        if (!password || password.trim() === "") {
            await actualizarEmpleadoSinPassword({
                idEmpleado,
                nombre,
                apellido,
                rol,
                idEstadoEmpleado,
                idSucursal
            });
        } 
        // Con cambio de contraseña
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            await actualizarEmpleadoConPassword({
                idEmpleado,
                nombre,
                apellido,
                rol,
                idEstadoEmpleado,
                idSucursal,
                password: hashedPassword
            });
        }

        return res.status(200).json({
            message: "Empleado actualizado exitosamente."
        });

    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        return res.status(500).json({ message: "Error interno al actualizar empleado." });
    }
}

