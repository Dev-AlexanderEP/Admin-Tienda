import api, { authHeader } from "./axiosConfig";

export const getTallasPaginado = (page, size = 10) =>
  api.get("/tallas/paginado", { params: { page, size }, headers: authHeader() });

export const getTallas = () =>
  api.get("/tallas", { headers: authHeader() });

export const createTalla = (form) =>
  api.post("/talla", form, { headers: authHeader() });

export const updateTalla = (id, form) =>
  api.put(`/talla/${id}`, form, { headers: authHeader() });

export const deleteTalla = (id) =>
  api.delete(`/talla/${id}`, { headers: authHeader() });
