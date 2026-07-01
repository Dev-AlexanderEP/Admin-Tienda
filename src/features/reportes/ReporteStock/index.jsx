import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Package, Filter, X } from "lucide-react";
import { downloadReporteStock, triggerDownload } from "../api/reportes";
import { getGenerosPaginado } from "../../genero/api/generos";
import { getCategorias } from "../../categoria/api/categorias";

const EMPTY = { nombre: "", genero: "", categoria: "" };

export default function ReporteStockFeature() {
  const [filters, setFilters]     = useState(EMPTY);
  const [generos, setGeneros]     = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  useEffect(() => {
    const fetchOpciones = async () => {
      const [genRes, catRes] = await Promise.allSettled([
        getGenerosPaginado(1, 100),
        getCategorias(),
      ]);

      if (genRes.status === "fulfilled") {
        const raw = genRes.value.data;
        const items = Array.isArray(raw?.data) ? raw.data : (raw?.data?.items ?? []);
        setGeneros(items);
      }
      if (catRes.status === "fulfilled") {
        const raw = catRes.value.data;
        const items = Array.isArray(raw?.data) ? raw.data : (raw?.data?.items ?? []);
        setCategorias(items);
      }
    };
    fetchOpciones();
  }, []);

  const hasFilters = Object.values(filters).some((v) => v.trim() !== "");

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleClear = () => {
    setFilters(EMPTY);
    setError("");
    setSuccess(false);
  };

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await downloadReporteStock(filters);
      triggerDownload(response, "reporte_stock.xlsx");
      setSuccess(true);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setError("Sesión expirada. Vuelve a iniciar sesión.");
      else if (status === 403) setError("No tienes permisos para descargar este reporte.");
      else setError("Error al generar el reporte. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const selectClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white";

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <Package className="h-7 w-7 text-green-500" />
        <h2 className="text-xl font-semibold">Reporte de Stock</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Genera un Excel con el inventario actual de prendas activas. Incluye detalle por SKU y
        resumen por categoría y género.
      </p>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-600">Filtros opcionales</span>
          {hasFilters && (
            <button
              onClick={handleClear}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
            >
              <X className="h-3 w-3" /> Limpiar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Nombre — texto libre */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Nombre de prenda</label>
            <input
              type="text"
              name="nombre"
              value={filters.nombre}
              onChange={handleChange}
              placeholder="Ej: polo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Género — select */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Género</label>
            <select name="genero" value={filters.genero} onChange={handleChange} className={selectClass}>
              <option value="">Todos los géneros</option>
              {generos.map((g) => (
                <option key={g.id} value={g.nomGenero}>
                  {g.nomGenero}
                </option>
              ))}
            </select>
          </div>

          {/* Categoría — select */}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Categoría</label>
            <select name="categoria" value={filters.categoria} onChange={handleChange} className={selectClass}>
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.nomCategoria}>
                  {c.nomCategoria}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters && (
          <p className="text-xs text-gray-400 mt-3">
            El reporte se filtrará por:{" "}
            {[
              filters.nombre    && `nombre "${filters.nombre}"`,
              filters.genero    && `género "${filters.genero}"`,
              filters.categoria && `categoría "${filters.categoria}"`,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Hoja 1", desc: "Detalle por SKU (prenda + talla) con colores por estado de stock" },
          { label: "Hoja 2", desc: "Resumen con KPIs, stock por categoría y stock por género" },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-green-50 border border-green-100 rounded-lg p-3">
            <span className="text-xs font-bold text-green-700">{label}</span>
            <p className="text-xs text-green-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-4">
          ¡Reporte descargado correctamente!
        </p>
      )}

      {/* Download button */}
      <motion.button
        onClick={handleDownload}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg text-sm transition-colors"
      >
        <Download className="h-4 w-4" />
        {loading ? "Generando Excel..." : "Descargar Excel"}
      </motion.button>
    </div>
  );
}
