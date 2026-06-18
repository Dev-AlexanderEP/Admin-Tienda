import api, { authHeader } from "../../../lib/axiosConfig";

export const getReporteVentas = (params) =>
  api.get("/reportes/ventas", { params, headers: authHeader() });

export const getReporteVentasPorFecha = (desde, hasta) =>
  api.get("/reportes/ventas/fecha", { params: { desde, hasta }, headers: authHeader() });

export const getReporteVentasPorCategoria = (params) =>
  api.get("/reportes/ventas/categoria", { params, headers: authHeader() });
