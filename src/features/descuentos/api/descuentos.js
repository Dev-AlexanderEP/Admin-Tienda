import api, { authHeader } from "../../../lib/axiosConfig";

// ── Descuento por Código ────────────────────────────────────────────────────
export const getDescuentosCodigosPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/DescuentoCodigos", { params: { page, pageSize }, headers: authHeader() });

export const createDescuentoCodigo = (body) =>
  api.post("/api/DescuentoCodigos", body, { headers: authHeader() });

export const updateDescuentoCodigo = (id, body) =>
  api.put(`/api/DescuentoCodigos/${id}`, body, { headers: authHeader() });

export const deleteDescuentoCodigo = (id) =>
  api.delete(`/api/DescuentoCodigos/${id}`, { headers: authHeader() });

// ── Descuento por Prenda ────────────────────────────────────────────────────
export const getDescuentosPrendasPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/DescuentoPrendas", { params: { page, pageSize }, headers: authHeader() });

export const createDescuentoPrenda = (body) =>
  api.post("/api/DescuentoPrendas", body, { headers: authHeader() });

export const updateDescuentoPrenda = (id, body) =>
  api.put(`/api/DescuentoPrendas/${id}`, body, { headers: authHeader() });

export const deleteDescuentoPrenda = (id) =>
  api.delete(`/api/DescuentoPrendas/${id}`, { headers: authHeader() });

// ── Descuento por Categoría ─────────────────────────────────────────────────
export const getDescuentosCategoriasPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/DescuentoCategorias", { params: { page, pageSize }, headers: authHeader() });

export const createDescuentoCategoria = (body) =>
  api.post("/api/DescuentoCategorias", body, { headers: authHeader() });

export const updateDescuentoCategoria = (id, body) =>
  api.put(`/api/DescuentoCategorias/${id}`, body, { headers: authHeader() });

export const deleteDescuentoCategoria = (id) =>
  api.delete(`/api/DescuentoCategorias/${id}`, { headers: authHeader() });

// ── Historial de uso de cupones ─────────────────────────────────────────────
export const getDescuentosUsuariosPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/DescuentoUsuarios", { params: { page, pageSize }, headers: authHeader() });

export const deleteDescuentoUsuario = (id) =>
  api.delete(`/api/DescuentoUsuarios/${id}`, { headers: authHeader() });
