import api, { authHeader } from "../../../lib/axiosConfig";

export const getReseniasPaginado = (page = 1, pageSize = 10, filters = {}) =>
  api.get("/api/Resenias", {
    params: { page, pageSize, ...filters },
    headers: authHeader(),
  });

export const deleteResenia = (id) =>
  api.delete(`/api/Resenias/${id}`, { headers: authHeader() });

export const moderarResenia = (id, body) =>
  api.patch(`/api/Resenias/${id}/estado`, body, { headers: authHeader() });
