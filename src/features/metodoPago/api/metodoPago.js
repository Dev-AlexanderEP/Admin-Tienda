import api, { authHeader } from "../../../lib/axiosConfig";

export const getMetodosPagoPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/MetodoPago", { params: { page, pageSize }, headers: authHeader() });

export const getMetodoPagoById = (id) =>
  api.get(`/api/MetodoPago/${id}`, { headers: authHeader() });

export const createMetodoPago = (form) =>
  api.post("/api/MetodoPago", form, { headers: authHeader() });

export const updateMetodoPago = (id, form) =>
  api.put(`/api/MetodoPago/${id}`, form, { headers: authHeader() });

export const deleteMetodoPago = (id) =>
  api.delete(`/api/MetodoPago/${id}`, { headers: authHeader() });
