import api, { authHeader } from "../../../lib/axiosConfig";

export const getUsuariosPaginado = (page) =>
  api.get("/usuarios", { params: { pageNo: page + 1 }, headers: authHeader() });

export const buscarUsuarios = (params) =>
  api.get("/usuarios", { params, headers: authHeader() });

export const createUsuario = (form) =>
  api.post("/usuarios/create", form, { headers: authHeader() });

export const updateUsuario = (id, form) =>
  api.put(`/usuario/${id}`, form, { headers: authHeader() });

export const deleteUsuario = (id) =>
  api.delete(`/usuario/${id}`, { headers: authHeader() });
