const CLAVE = "paf_usuario";

export function haySesion() {
  try {
    return Boolean(sessionStorage.getItem(CLAVE));
  } catch {
    return false;
  }
}

export function obtenerUsuario() {
  try {
    return sessionStorage.getItem(CLAVE) ?? "";
  } catch {
    return "";
  }
}

export function iniciarSesion(usuario) {
  try {
    sessionStorage.setItem(CLAVE, usuario);
  } catch {
    // si el navegador bloquea el almacenamiento, no hay sesión
  }
}

export function cerrarSesion() {
  try {
    sessionStorage.removeItem(CLAVE);
  } catch {
    // nada que limpiar
  }
}