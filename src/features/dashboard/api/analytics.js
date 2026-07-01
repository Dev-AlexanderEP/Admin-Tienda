import api, { authHeader } from "../../../lib/axiosConfig";

export const getTotalVentas = () =>
  api.get("/api/Ventas/total", { headers: authHeader() });

export const getTotalUsuarios = () =>
  api.get("/api/Usuarios/total", { headers: authHeader() });

export const getResumenPrendas = () =>
  api.get("/api/Prendas/resumen", { headers: authHeader() });

export const getVentasPorPeriodo = (agrupacion = "diario") =>
  api.get("/api/Ventas/por-periodo", { params: { agrupacion }, headers: authHeader() });

export const getVentasPorGenero = () =>
  api.get("/api/Ventas/por-genero", { headers: authHeader() });
