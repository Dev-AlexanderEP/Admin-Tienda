import api, { authHeader } from "../../../lib/axiosConfig";

export const downloadReporteStock = (filters = {}) => {
  const params = {};
  if (filters.nombre?.trim())    params.nombre    = filters.nombre.trim();
  if (filters.genero?.trim())    params.genero    = filters.genero.trim();
  if (filters.categoria?.trim()) params.categoria = filters.categoria.trim();
  return api.get("/api/Reportes/stock", {
    params,
    headers: authHeader(),
    responseType: "blob",
  });
};

export const downloadReporteVentas = (periodo = "diario") =>
  api.get("/api/Reportes/ventas", {
    params: { periodo },
    headers: authHeader(),
    responseType: "blob",
  });

// Helper: trigger browser file download from a blob response
export const triggerDownload = (response, fallbackName) => {
  const disposition = response.headers["content-disposition"];
  const match = disposition?.match(/filename[^;=\n]*=(?:(\\?['"])(.*?)\1|([^;\n]*))/i);
  const filename = match?.[2] ?? match?.[3] ?? fallbackName;
  const url = URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
