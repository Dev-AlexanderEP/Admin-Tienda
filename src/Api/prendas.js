import api, { authHeader } from "./axiosConfig";

export const getPrendasPaginado = (page, size = 10) =>
  api.get("/prendas/paginado", { params: { page, size }, headers: authHeader() });

export const createPrenda = (body) =>
  api.post("/prenda", body, { headers: authHeader() });

export const updatePrenda = (id, body) =>
  api.put(`/prenda/${id}`, body, { headers: authHeader() });

export const deletePrenda = (id) =>
  api.delete(`/prenda/${id}`, { headers: authHeader() });

export const getGeneros = () =>
  api.get("/generos", { headers: authHeader() });

export const uploadArchivo = (formData) =>
  api.post("/archivos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data", ...authHeader() },
  });

export const createImagen = (imagenData) =>
  api.post("/imagen", imagenData, { headers: authHeader() });

export const updateImagen = (id, imagenData) =>
  api.put(`/imagen/${id}`, imagenData, { headers: authHeader() });

export const eliminarCarpeta = (rutaRelativa) =>
  api.delete("/archivos/eliminar-carpeta", { params: { rutaRelativa }, headers: authHeader() });

export const renombrarCarpeta = (rutaBase, nombreAntiguo, nombreNuevo) =>
  api.put("/archivos/renombrar-carpeta", null, {
    params: { rutaBase, nombreAntiguo, nombreNuevo },
    headers: authHeader(),
  });
