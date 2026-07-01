import api, { authHeader } from "../../../lib/axiosConfig";

export const createPrendaTalla = (body) =>
  api.post("/api/prendaTallas", body, { headers: authHeader() });

// Solo actualiza stock — prendaId y tallaId son inmutables
export const updatePrendaTalla = (id, { stock }) =>
  api.put(`/api/prendaTallas/${id}`, { stock }, { headers: authHeader() });

export const deletePrendaTalla = (id) =>
  api.delete(`/api/prendaTallas/${id}`, { headers: authHeader() });

export const decrementarStock = (prendaId, tallaId) =>
  api.put("/api/prendaTallas/stock/decremento", null, {
    params: { prendaId, tallaId },
    headers: authHeader(),
  });

export const incrementarStock = (prendaId, tallaId) =>
  api.put("/api/prendaTallas/stock/incremento", null, {
    params: { prendaId, tallaId },
    headers: authHeader(),
  });

export const sumarStock = (prendaId, tallaId, cantidad) =>
  api.put("/api/prendaTallas/stock/suma", null, {
    params: { prendaId, tallaId, cantidad },
    headers: authHeader(),
  });
