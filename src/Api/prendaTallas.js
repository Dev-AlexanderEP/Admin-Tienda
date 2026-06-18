import api, { authHeader } from "./axiosConfig";

export const createPrendaTalla = (body) =>
  api.post("/prenda-talla", body, { headers: authHeader() });

export const updatePrendaTalla = (id, body) =>
  api.put(`/prenda-talla/${id}`, body, { headers: authHeader() });

export const deletePrendaTalla = (id) =>
  api.delete(`/prenda-talla/${id}`, { headers: authHeader() });
