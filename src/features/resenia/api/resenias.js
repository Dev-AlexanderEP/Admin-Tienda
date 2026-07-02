import api, { authHeader } from "../../../lib/axiosConfig";

export const getReseniasPaginado = (page = 1, pageSize = 10, filters = {}) =>
  api.get("/api/Resenias", {
    params: { page, pageSize, ...filters },
    headers: authHeader(),
  });

export const contarPendientes = () =>
  api.get("/api/Resenias", {
    params: { page: 1, pageSize: 1, estado: "PENDIENTE" },
    headers: authHeader(),
  }).then((r) => r.data?.metadata?.totalCount ?? 0);

export const deleteResenia = (id) =>
  api.delete(`/api/Resenias/${id}`, { headers: authHeader() });

export const moderarResenia = (id, body) =>
  api.patch(`/api/Resenias/${id}/estado`, body, { headers: authHeader() });
