import api, { authHeader } from "../../../lib/axiosConfig";

export const getProveedoresPaginado = (page, size = 10) =>
  api.get("/proveedores/paginado", { params: { page, size }, headers: authHeader() });

export const getProveedores = () =>
  api.get("/proveedores", { headers: authHeader() });

export const createProveedor = (form) =>
  api.post("/proveedor", form, { headers: authHeader() });

export const updateProveedor = (id, form) =>
  api.put(`/proveedor/${id}`, form, { headers: authHeader() });

export const deleteProveedor = (id) =>
  api.delete(`/proveedor/${id}`, { headers: authHeader() });
