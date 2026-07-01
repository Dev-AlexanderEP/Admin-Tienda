import api, { authHeader } from "../../../lib/axiosConfig";

export const getMarcasPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/marcas", { params: { page, pageSize }, headers: authHeader() });

export const getMarcas = () =>
  api.get("/api/marcas", { headers: authHeader() });

export const getMarcaById = (id) =>
  api.get(`/api/marcas/${id}`, { headers: authHeader() });

export const createMarca = (form) =>
  api.post("/api/marcas", form, { headers: authHeader() });

export const updateMarca = (id, form) =>
  api.put(`/api/marcas/${id}`, form, { headers: authHeader() });

export const deleteMarca = (id) =>
  api.delete(`/api/marcas/${id}`, { headers: authHeader() });
