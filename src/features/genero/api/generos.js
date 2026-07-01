import api, { authHeader } from "../../../lib/axiosConfig";

export const getGenerosPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/Generos", { params: { page, pageSize }, headers: authHeader() });

export const createGenero = (body) =>
  api.post("/api/Generos", body, { headers: authHeader() });

export const updateGenero = (id, body) =>
  api.put(`/api/Generos/${id}`, body, { headers: authHeader() });

export const deleteGenero = (id) =>
  api.delete(`/api/Generos/${id}`, { headers: authHeader() });
