import api, { authHeader } from "../../../lib/axiosConfig";

export const getProveedoresPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/proveedores", { params: { page, pageSize }, headers: authHeader() });

export const getProveedores = () =>
  api.get("/api/proveedores", { headers: authHeader() });

export const getProveedorById = (id) =>
  api.get(`/api/proveedores/${id}`, { headers: authHeader() });

export const createProveedor = (form) =>
  api.post("/api/proveedores", form, { headers: authHeader() });

export const updateProveedor = (id, form) =>
  api.put(`/api/proveedores/${id}`, form, { headers: authHeader() });

export const deleteProveedor = (id) =>
  api.delete(`/api/proveedores/${id}`, { headers: authHeader() });
