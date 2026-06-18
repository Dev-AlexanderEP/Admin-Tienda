import api, { authHeader } from "../../../lib/axiosConfig";

export const getCategoriasPaginado = (page, size = 10) =>
  api.get("/categorias/paginado", { params: { page, size }, headers: authHeader() });

export const getCategorias = () =>
  api.get("/categorias", { headers: authHeader() });

export const createCategoria = (form) =>
  api.post("/categoria", form, { headers: authHeader() });

export const updateCategoria = (id, form) =>
  api.put(`/categoria/${id}`, form, { headers: authHeader() });

export const deleteCategoria = (id) =>
  api.delete(`/categoria/${id}`, { headers: authHeader() });
