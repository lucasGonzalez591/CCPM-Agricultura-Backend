import http from "./http";

const get = (ruta) => http.get(`/reportes/${ruta}`).then((r) => r.data);

export const obtenerResumen = () => get("resumen");
export const productoresPorDepartamento = () => get("productores-por-departamento");
export const productoresPorMunicipio = () => get("productores-por-municipio");
export const productosPorProductor = () => get("productos-por-productor");
export const productosPorLugarVenta = () => get("productos-por-lugar-venta");
export const precioPromedioPorProducto = () => get("precio-promedio-por-producto");
