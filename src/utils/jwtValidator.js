const jwt = require('jsonwebtoken');

/**
 * Valida un token JWT y extrae los datos del usuario
 * @param {string} authHeader - Header Authorization completo
 * @returns {Object} - Datos del usuario decodificados
 * @throws {Error} - Si el token es inválido
 */
function validateJWT(authHeader) {
    // Verificar que existe el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Missing or invalid Authorization header');
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        throw new Error('Token not provided');
    }

    try {
        // Verificar el token con el mismo JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        return {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role
        };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = { validateJWT };
