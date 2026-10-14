import http, { limpiarParams } from "./http";

export const listarProductos = (filtros) =>
  http.get("/productos", { params: limpiarParams(filtros) }).then((r) => r.data);

export const obtenerProducto = (id) =>
  http.get(`/productos/${id}`).then((r) => r.data);

export const crearProducto = (datos) =>
  http.post("/productos", datos).then((r) => r.data);

export const actualizarProducto = (id, datos) =>
  http.put(`/productos/${id}`, datos).then((r) => r.data);

export const eliminarProducto = (id) => http.delete(`/productos/${id}`);