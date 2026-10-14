// "1988-06-15" -> "15/06/1988" (sin pasar por Date para evitar problemas de zona horaria)
export function formatearFecha(iso) {
  if (!iso) return "-";
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function formatearPrecio(valor) {
  return Number(valor).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}