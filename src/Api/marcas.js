import api, { authHeader } from "./axiosConfig";

export const getMarcasPaginado = (page, size = 10) =>
  api.get("/marcas/paginado", { params: { page, size }, headers: authHeader() });

export const getMarcas = () =>
  api.get("/marcas", { headers: authHeader() });

export const createMarca = (form) =>
  api.post("/marca", form, { headers: authHeader() });

export const updateMarca = (id, form) =>
  api.put(`/marca/${id}`, form, { headers: authHeader() });

export const deleteMarca = (id) =>
  api.delete(`/marca/${id}`, { headers: authHeader() });
