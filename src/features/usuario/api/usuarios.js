import api, { authHeader } from "../../../lib/axiosConfig";

export const getUsuariosPaginado = (page = 1, pageSize = 10, filters = {}) => {
  const params = { page, pageSize };
  if (filters.nombre?.trim())  params.nombre  = filters.nombre.trim();
  if (filters.email?.trim())   params.email   = filters.email.trim();
  if (filters.rol)             params.rol     = filters.rol;
  if (filters.activo !== "")   params.activo  = filters.activo;
  return api.get("/api/Usuarios", { params, headers: authHeader() });
};

export const createUsuario = (body) =>
  api.post("/api/Usuarios", body, { headers: authHeader() });

export const updateUsuario = (id, body) =>
  api.put(`/api/Usuarios/${id}`, body, { headers: authHeader() });

export const deleteUsuario = (id) =>
  api.delete(`/api/Usuarios/${id}`, { headers: authHeader() });
