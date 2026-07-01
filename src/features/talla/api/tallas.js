import api, { authHeader } from "../../../lib/axiosConfig";

export const getTallasPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/tallas", { params: { page, pageSize }, headers: authHeader() });

export const getTallas = () =>
  api.get("/api/tallas", { headers: authHeader() });

export const getTallaById = (id) =>
  api.get(`/api/tallas/${id}`, { headers: authHeader() });

export const getTallaPorNombre = (nomTalla) =>
  api.get(`/api/tallas/por-nombre/${nomTalla}`, { headers: authHeader() });

export const createTalla = (form) =>
  api.post("/api/tallas", form, { headers: authHeader() });

export const updateTalla = (id, form) =>
  api.put(`/api/tallas/${id}`, form, { headers: authHeader() });

export const deleteTalla = (id) =>
  api.delete(`/api/tallas/${id}`, { headers: authHeader() });
