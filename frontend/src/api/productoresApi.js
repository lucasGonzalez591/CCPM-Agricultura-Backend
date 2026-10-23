import http, { limpiarParams } from "./http";

export const listarProductores = (filtros) =>
  http
    .get("/productores", { params: limpiarParams(filtros) })
    .then((r) => r.data.content ?? r.data);

export const obtenerProductor = (id) =>
  http.get(`/productores/${id}`).then((r) => r.data);

export const productosDeProductor = (id) =>
  http.get(`/productores/${id}/productos`).then((r) => r.data);

export const crearProductor = (datos) =>
  http.post("/productores", datos).then((r) => r.data);

export const actualizarProductor = (id, datos) =>
  http.put(`/productores/${id}`, datos).then((r) => r.data);

export const eliminarProductor = (id) => http.delete(`/productores/${id}`);