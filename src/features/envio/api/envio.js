import api, { authHeader } from "../../../lib/axiosConfig";

export const getEnviosPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/Envio", { params: { page, pageSize }, headers: authHeader() });

export const createEnvio = (body) =>
  api.post("/api/Envio", body, { headers: authHeader() });

export const updateEnvio = (id, body) =>
  api.put(`/api/Envio/${id}`, body, { headers: authHeader() });

export const deleteEnvio = (id) =>
  api.delete(`/api/Envio/${id}`, { headers: authHeader() });
