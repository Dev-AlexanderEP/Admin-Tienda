import api from "./axiosConfig";

export const getDatosPaginado = (page, size = 10) =>
  api.get("/datos-personales/paginado", { params: { page, size } });

export const createDato = (form) =>
  api.post("/dato-personal", form);

export const updateDato = (id, form) =>
  api.put(`/dato-personal/${id}`, form);

export const deleteDato = (id) =>
  api.delete(`/dato-personal/${id}`);
