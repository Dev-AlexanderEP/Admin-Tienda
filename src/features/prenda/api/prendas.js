import api, { authHeader } from "../../../lib/axiosConfig";

export const getPrendasPaginado = (page = 1, pageSize = 10) =>
  api.get("/api/prendas", { params: { page, pageSize }, headers: authHeader() });

export const getPrendaDetalle = (id) =>
  api.get(`/api/prendas/${id}/detalle`, { headers: authHeader() });

export const createPrenda = (body) =>
  api.post("/api/prendas", body, { headers: authHeader() });

export const updatePrenda = (id, body) =>
  api.put(`/api/prendas/${id}`, body, { headers: authHeader() });

export const deletePrenda = (id) =>
  api.delete(`/api/prendas/${id}`, { headers: authHeader() });

export const getGeneros = () =>
  api.get("/api/generos", { headers: authHeader() });

export const uploadImagen = (prendaId, archivo, tipo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("tipo", tipo);
  return api.post(`/api/prendas/${prendaId}/imagenes`, formData, {
    headers: authHeader(),
  });
};

// Crea registro de imagen con URL directa (sin subida de archivo)
export const createImagen = ({ prendaId, tipo, url, orden }) =>
  api.post("/api/prendaImagenes", { prendaId, tipo, url, orden }, { headers: authHeader() });

export const updateImagen = (id, { tipo, url, orden }) =>
  api.put(`/api/prendaImagenes/${id}`, { tipo, url, orden }, { headers: authHeader() });

export const deleteImagen = (id) =>
  api.delete(`/api/prendaImagenes/${id}`, { headers: authHeader() });
