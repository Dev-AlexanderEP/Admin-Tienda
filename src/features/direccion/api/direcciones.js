import api from "../../../lib/axiosConfig";

export const getDireccionesPaginado = (page, size = 10) =>
  api.get("/direcciones/paginado", { params: { page, size } });

export const createDireccion = (form) =>
  api.post("/direccion", form);

export const updateDireccion = (id, form) =>
  api.put(`/direccion/${id}`, form);

export const deleteDireccion = (id) =>
  api.delete(`/direccion/${id}`);
