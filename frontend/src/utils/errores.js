export function interpretarError(error) {
  // El servidor respondió con un error (400, 404, 409, 500...)
  if (error.response) {
    const { status, data } = error.response;
    const cuerpo = data && typeof data === "object" ? data : {};

    // Errores del servidor (5xx): el mensaje suele ser técnico, no se lo mostramos al usuario
    if (status >= 500) {
      console.error("Error del servidor:", cuerpo.message || data);
      return {
        mensaje: "Ocurrió un problema en el servidor. Intentá de nuevo más tarde.",
        campos: {},
      };
    }

    if (status === 404) {
      return {
        mensaje: cuerpo.message || "No se encontró lo que buscabas.",
        campos: {},
      };
    }

    // 400, 409, etc.: mensajes de validación o de negocio, útiles para el usuario
    return {
      mensaje: cuerpo.message || "Ocurrió un error inesperado.",
      campos: cuerpo.fieldErrors || {},
    };
  }

  // No hubo respuesta: backend apagado o sin conexión
  return {
    mensaje: "No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.",
    campos: {},
  };
}