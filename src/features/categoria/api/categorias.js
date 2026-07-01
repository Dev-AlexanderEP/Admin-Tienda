import api, { authHeader } from "../../../lib/axiosConfig";

export const getCategoriasPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/categorias", { params: { page, pageSize }, headers: authHeader() });

export const getCategorias = () =>
  api.get("/api/categorias", { headers: authHeader() });

export const getCategoriaById = (id) =>
  api.get(`/api/categorias/${id}`, { headers: authHeader() });

export const createCategoria = (form) =>
  api.post("/api/categorias", form, { headers: authHeader() });

export const updateCategoria = (id, form) =>
  api.put(`/api/categorias/${id}`, form, { headers: authHeader() });

export const deleteCategoria = (id) =>
  api.delete(`/api/categorias/${id}`, { headers: authHeader() });
