import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, ShoppingBag } from "lucide-react";
import { downloadReporteVentas, triggerDownload } from "../api/reportes";

const PERIODOS = [
  {
    key: "diario",
    label: "Diario",
    desc: "Últimos 30 días, agrupado por fecha",
  },
  {
    key: "mensual",
    label: "Mensual",
    desc: "Últimos 12 meses, agrupado por mes",
  },
  {
    key: "trimestral",
    label: "Trimestral",
    desc: "Últimos 12 meses, agrupado por trimestre",
  },
];

export default function ReporteVentasFeature() {
  const [periodo, setPeriodo] = useState("diario");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await downloadReporteVentas(periodo);
      triggerDownload(response, `reporte_ventas_${periodo}.xlsx`);
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

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <ShoppingBag className="h-7 w-7 text-blue-500" />
        <h2 className="text-xl font-semibold">Reporte de Ventas</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Genera un Excel con las ventas realizadas (PAGADO, ENVIADO o ENTREGADO). Incluye detalle
        por venta y resumen agrupado por el período seleccionado.
      </p>

      {/* Period selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <p className="text-sm font-semibold text-gray-600 mb-3">Período del reporte</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PERIODOS.map(({ key, label, desc }) => (
            <button
              key={key}
              onClick={() => { setPeriodo(key); setSuccess(false); setError(""); }}
              className={`text-left rounded-lg border-2 p-3 transition-all ${
                periodo === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
              }`}
            >
              <span className={`text-sm font-semibold block ${periodo === key ? "text-blue-700" : "text-gray-700"}`}>
                {label}
              </span>
              <span className="text-xs text-gray-500 mt-0.5 block">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Hoja 1", desc: "Detalle de ventas con totales y colores por estado (PAGADO/ENVIADO/ENTREGADO)" },
          { label: "Hoja 2", desc: "Resumen con KPIs (total ventas, monto, ticket promedio) y desglose por período" },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <span className="text-xs font-bold text-blue-700">{label}</span>
            <p className="text-xs text-blue-600 mt-1">{desc}</p>
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
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg text-sm transition-colors"
      >
        <Download className="h-4 w-4" />
        {loading ? "Generando Excel..." : `Descargar Excel (${PERIODOS.find((p) => p.key === periodo)?.label})`}
      </motion.button>
    </div>
  );
}
