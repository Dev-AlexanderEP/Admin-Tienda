import React, { useEffect, useState } from "react";
import { Trash2, Check, X, Star, ShieldCheck, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../components/Table";
import { getReseniasPaginado, deleteResenia, moderarResenia, contarPendientes } from "./api/resenias";

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
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  APROBADA:  "bg-green-100 text-green-700",
  RECHAZADA: "bg-red-100 text-red-700",
};

const Stars = ({ n }) => (
  <span className="text-yellow-400 tracking-tight">
    {"★".repeat(n)}{"☆".repeat(5 - n)}
  </span>
);

// ── Modal de moderación ───────────────────────────────────────────────────────

function ModerarModal({ open, onClose, onSubmit, resenia, submitting }) {
  const [estado, setEstado]               = useState("APROBADA");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [error, setError]                 = useState("");

  useEffect(() => {
    if (open) {
      setEstado("APROBADA");
      setMotivoRechazo("");
      setError("");
    }
  }, [open, resenia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (estado === "RECHAZADA" && !motivoRechazo.trim()) {
      setError("El motivo de rechazo es requerido");
      return;
    }
    onSubmit({
      estado,
      motivoRechazo: estado === "RECHAZADA" ? motivoRechazo.trim() : null,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose} disabled={submitting}>
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" /> Moderar Reseña
            </h2>

            {resenia && (
              <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm space-y-1">
                <p><span className="font-medium">Prenda:</span> {resenia.nombrePrenda ?? `#${resenia.prendaId}`}</p>
                <p><span className="font-medium">Usuario:</span> #{resenia.usuarioId}</p>
                <p><span className="font-medium">Calificación:</span> <Stars n={resenia.calificacion} /></p>
                <p className="text-gray-600 italic">"{resenia.comentario}"</p>
                {resenia.estado !== "PENDIENTE" && (
                  <p>
                    <span className="font-medium">Estado actual:</span>{" "}
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${ESTADO_COLORS[resenia.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {resenia.estado}
                    </span>
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Decisión <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  {["APROBADA", "RECHAZADA"].map((s) => (
                    <label key={s} className={`flex-1 flex items-center justify-center gap-2 border rounded-lg p-2 cursor-pointer text-sm font-medium transition ${
                      estado === s
                        ? s === "APROBADA" ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}>
                      <input type="radio" name="estado" value={s} checked={estado === s}
                        onChange={() => { setEstado(s); setError(""); }}
                        className="sr-only" />
                      {s === "APROBADA" ? "✓ Aprobar" : "✗ Rechazar"}
                    </label>
                  ))}
                </div>
              </div>

              {estado === "RECHAZADA" && (
                <div>
                  <label className="text-sm font-semibold block mb-1">
                    Motivo de Rechazo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={motivoRechazo}
                    onChange={(e) => { setMotivoRechazo(e.target.value); setError(""); }}
                    placeholder="Explica por qué se rechaza la reseña..."
                    rows={3}
                    className={`w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? "border-red-400" : "border-gray-300"}`}
                    disabled={submitting}
                  />
                  {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={onClose} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting}
                  className={`px-4 py-1.5 rounded text-white flex items-center gap-1 disabled:opacity-60 ${
                    estado === "APROBADA" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }`}>
                  <Check className="h-4 w-4" /> {submitting ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── CRUD principal ───────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function ReseniaCrud() {
  const [items, setItems]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [moderarModal, setModerarModal] = useState({ open: false, resenia: null });

  // filtros
  const [filtroPrendaId, setFiltroPrendaId]         = useState("");
  const [filtroCalificacion, setFiltroCalificacion] = useState("");
  const [filtroEstado, setFiltroEstado]             = useState("PENDIENTE");
  const [pendientesCount, setPendientesCount]       = useState(0);

  const fetchData = async (currentPage = 0) => {
    setLoading(true);
    try {
      const filters = {};
      if (filtroPrendaId)     filters.prendaId     = Number(filtroPrendaId);
      if (filtroCalificacion)  filters.calificacion  = Number(filtroCalificacion);
      if (filtroEstado)        filters.estado        = filtroEstado;
      const { data } = await getReseniasPaginado(currentPage + 1, PAGE_SIZE, filters);
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

  useEffect(() => {
    contarPendientes().then(setPendientesCount).catch(() => {});
  }, [items]); // refresca el badge cada vez que cambia la lista

  const handleBuscar = (e) => {
    e.preventDefault();
    setPage(0);
    fetchData(0);
  };

  const handleModerar = async (form) => {
    setSubmitting(true);
    try {
      await moderarResenia(moderarModal.resenia.id, form);
      setModerarModal({ open: false, resenia: null });
      fetchData(page);
    } catch (e) {
      alert(e?.response?.data?.message ?? "Error al moderar reseña");
    }
    setSubmitting(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar la reseña #${item.id}?`)) return;
    try {
      await deleteResenia(item.id);
      fetchData(page);
    } catch {
      alert("Error eliminando reseña");
    }
  };

  const sorted = [...items].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Star className="h-6 w-6" /> Reseñas
          {pendientesCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">
              {pendientesCount} pendiente{pendientesCount !== 1 ? "s" : ""}
            </span>
          )}
        </h2>
      </div>

      {/* Filtros */}
      <form onSubmit={handleBuscar} className="flex gap-3 mb-4 flex-wrap items-end">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="APROBADA">Aprobada</option>
            <option value="RECHAZADA">Rechazada</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ID Prenda</label>
          <input
            type="number" min="1" value={filtroPrendaId}
            onChange={(e) => setFiltroPrendaId(e.target.value)}
            placeholder="Todos"
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Calificación</label>
          <select
            value={filtroCalificacion}
            onChange={(e) => setFiltroCalificacion(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todas</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} estrella{n > 1 ? "s" : ""}</option>)}
          </select>
        </div>
        <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <Search className="h-4 w-4" /> Buscar
        </motion.button>
      </form>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Prenda", "Usuario", "Calif.", "Comentario", "Estado", "Moderado en", "Acciones"]} />
        <Table.Body loading={loading} colSpan={8} empty={sorted.length === 0} emptyText="Sin reseñas">
          {sorted.map((item) => (
            <motion.tr
              key={item.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">
                <span className="font-medium">{item.nombrePrenda ?? `#${item.prendaId}`}</span>
              </td>
              <td className="py-2 px-4">#{item.usuarioId}</td>
              <td className="py-2 px-4"><Stars n={item.calificacion} /></td>
              <td className="py-2 px-4 max-w-[200px] truncate text-sm" title={item.comentario}>{item.comentario ?? "—"}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COLORS[item.estado] ?? "bg-gray-100 text-gray-600"}`}>
                  {item.estado}
                </span>
              </td>
              <td className="py-2 px-4">
                <span className="text-xs text-gray-400">
                  {item.estado === "RECHAZADA" && item.motivoRechazo
                    ? <span title={item.motivoRechazo} className="cursor-help underline decoration-dotted">{item.motivoRechazo.length > 20 ? item.motivoRechazo.slice(0,20) + "…" : item.motivoRechazo}</span>
                    : item.moderadoEn ? new Date(item.moderadoEn).toLocaleDateString("es-PE") : "—"}
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center gap-1">
                  <motion.button whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium"
                    onClick={() => setModerarModal({ open: true, resenia: item })}
                    title="Moderar reseña">
                    <ShieldCheck className="h-3.5 w-3.5" /> Moderar
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className="p-2 rounded hover:bg-red-100 text-red-700" onClick={() => handleDelete(item)} title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
        </Table.Body>
        <Table.Pagination
          page={page} totalPages={totalPages}
          onPrev={() => setPage(Math.max(page - 1, 0))}
          onNext={() => setPage(Math.min(page + 1, totalPages - 1))}
        />
      </Table>

      <ModerarModal
        open={moderarModal.open}
        onClose={() => setModerarModal({ open: false, resenia: null })}
        onSubmit={handleModerar}
        resenia={moderarModal.resenia}
        submitting={submitting}
      />
    </div>
  );
}
