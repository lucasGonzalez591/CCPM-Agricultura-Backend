import axios from "axios";

const http = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Quita los filtros vacíos para no mandar ?apellido=&dni=
export function limpiarParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );
}

export default http;