import React, { useEffect, useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import { getVentasPaginado } from "./api/ventas";

// ── helpers ──────────────────────────────────────────────────────────────────

const parsePaginated = (data) => {
  const items = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.items)
    ? data.data.items
    : [];
  const totalPages =
    data?.metadata?.totalPages ??
    (Math.ceil((data?.data?.totalCount ?? 0) / (data?.data?.pageSize ?? 10)) || 1);
  return { items, totalPages };
};

const ESTADO_COLORS = {
  PAGADO:    "bg-green-100 text-green-700",
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CANCELADO: "bg-red-100 text-red-700",
  ENVIADO:   "bg-blue-100 text-blue-700",
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("es-PE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── componente principal ──────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function VentaRealizadaCrud() {
  const [items, setItems]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [busqueda, setBusqueda]     = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");

  const fetchData = async (currentPage = 0, nombre = busquedaActiva) => {
    setLoading(true);
    try {
      const { data } = await getVentasPaginado(currentPage + 1, PAGE_SIZE, nombre);
      const { items: arr, totalPages: tp } = parsePaginated(data);
      setItems(arr);
      setTotalPages(tp);
    } catch {
      setItems([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(page); }, [page]); // eslint-disable-line

  const handleBuscar = (e) => {
    e.preventDefault();
    setBusquedaActiva(busqueda);
    setPage(0);
    fetchData(0, busqueda);
  };

  const handleLimpiar = () => {
    setBusqueda("");
    setBusquedaActiva("");
    setPage(0);
    fetchData(0, "");
  };

  const sorted = [...items];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" /> Ventas Realizadas
        </h2>
      </div>

      {/* Buscador */}
      <form onSubmit={handleBuscar} className="flex gap-2 mb-4 items-end">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Buscar por usuario</label>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Alexander..."
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          <Search className="h-4 w-4" /> Buscar
        </motion.button>
        {busquedaActiva && (
          <button
            type="button"
            onClick={handleLimpiar}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
          >
            Limpiar
          </button>
        )}
      </form>

      {busquedaActiva && (
        <p className="text-sm text-gray-500 mb-3">
          Mostrando resultados para <span className="font-medium text-gray-700">"{busquedaActiva}"</span>
        </p>
      )}

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Usuario ID", "Nombre", "Estado", "Fecha Creación", "Última actualiz."]} />
        <Table.Body loading={loading} colSpan={6} empty={sorted.length === 0} emptyText="Sin ventas">
          {sorted.map((item) => (
            <motion.tr
              key={item.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4 font-medium">#{item.id}</td>
              <td className="py-2 px-4">{item.usuarioId}</td>
              <td className="py-2 px-4 font-medium">{item.nombreUsuario ?? "—"}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COLORS[item.estado] ?? "bg-gray-100 text-gray-600"}`}>
                  {item.estado}
                </span>
              </td>
              <td className="py-2 px-4 text-sm">{formatDate(item.fechaCreacion)}</td>
              <td className="py-2 px-4 text-sm text-gray-500">{item.updatedAt ? formatDate(item.updatedAt) : "—"}</td>
            </motion.tr>
          ))}
        </Table.Body>
        <Table.Pagination
          page={page} totalPages={totalPages}
          onPrev={() => setPage(Math.max(page - 1, 0))}
          onNext={() => setPage(Math.min(page + 1, totalPages - 1))}
        />
      </Table>
    </div>
  );
}
