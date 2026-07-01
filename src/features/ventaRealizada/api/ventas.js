import api, { authHeader } from "../../../lib/axiosConfig";

export const getVentasPaginado = (page = 1, pageSize = 10, nombreUsuario = "") => {
  const params = { page, pageSize };
  if (nombreUsuario.trim()) params.nombreUsuario = nombreUsuario.trim();
  return api.get("/api/Ventas", { params, headers: authHeader() });
};
