import api, { authHeader } from "../../../lib/axiosConfig";

// Descuento por Categoría
export const getDescuentosCategorias = (page, size = 10) =>
  api.get("/descuentos/categorias/paginado", { params: { page, size }, headers: authHeader() });
export const createDescuentoCategoria = (body) =>
  api.post("/descuento/categoria", body, { headers: authHeader() });
export const updateDescuentoCategoria = (id, body) =>
  api.put(`/descuento/categoria/${id}`, body, { headers: authHeader() });
export const deleteDescuentoCategoria = (id) =>
  api.delete(`/descuento/categoria/${id}`, { headers: authHeader() });

// Descuento por Código
export const getDescuentosCodigos = (page, size = 10) =>
  api.get("/descuentos/codigos/paginado", { params: { page, size }, headers: authHeader() });
export const createDescuentoCodigo = (body) =>
  api.post("/descuento/codigo", body, { headers: authHeader() });
export const updateDescuentoCodigo = (id, body) =>
  api.put(`/descuento/codigo/${id}`, body, { headers: authHeader() });
export const deleteDescuentoCodigo = (id) =>
  api.delete(`/descuento/codigo/${id}`, { headers: authHeader() });

// Descuento por Prenda
export const getDescuentosPrendas = (page, size = 10) =>
  api.get("/descuentos/prendas/paginado", { params: { page, size }, headers: authHeader() });
export const createDescuentoPrenda = (body) =>
  api.post("/descuento/prenda", body, { headers: authHeader() });
export const updateDescuentoPrenda = (id, body) =>
  api.put(`/descuento/prenda/${id}`, body, { headers: authHeader() });
export const deleteDescuentoPrenda = (id) =>
  api.delete(`/descuento/prenda/${id}`, { headers: authHeader() });

// Descuento por Usuario
export const getDescuentosUsuarios = (page, size = 10) =>
  api.get("/descuentos/usuarios/paginado", { params: { page, size }, headers: authHeader() });
export const createDescuentoUsuario = (body) =>
  api.post("/descuento/usuario", body, { headers: authHeader() });
export const updateDescuentoUsuario = (id, body) =>
  api.put(`/descuento/usuario/${id}`, body, { headers: authHeader() });
export const deleteDescuentoUsuario = (id) =>
  api.delete(`/descuento/usuario/${id}`, { headers: authHeader() });
