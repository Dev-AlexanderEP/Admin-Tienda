import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, CreditCard, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../components/Table";
import {
  getMetodosPagoPaginado,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago,
} from "./api/metodoPago";

// ─── Modal ────────────────────────────────────────────────────────────────────

function MetodoPagoFormModal({ open, onClose, onSubmit, metodo, submitting }) {
  const [tipoPago, setTipoPago] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTipoPago(metodo?.tipoPago ?? "");
      setError("");
    }
  }, [open, metodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = tipoPago.trim();
    if (!trimmed) {
      setError("El tipo de pago es requerido");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 50) {
      setError("Debe tener entre 2 y 50 caracteres");
      return;
    }
    onSubmit({ tipoPago: trimmed });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 min-w-[360px] relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={onClose}
              disabled={submitting}
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              {metodo ? "Editar Método de Pago" : "Nuevo Método de Pago"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Tipo de Pago <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tipoPago}
                  onChange={(e) => {
                    setTipoPago(e.target.value);
                    setError("");
                  }}
                  placeholder="Ej: VISA, MASTERCARD, YAPE..."
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    error ? "border-red-400" : "border-gray-300"
                  }`}
                  disabled={submitting}
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 disabled:opacity-60"
                >
                  <Check className="h-4 w-4" />
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── CRUD principal ───────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function MetodoPagoCrud() {
  const [metodos, setMetodos]       = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editMetodo, setEditMetodo] = useState(null);

  const fetchMetodos = async (currentPage = 0) => {
    setLoading(true);
    try {
      const { data } = await getMetodosPagoPaginado(currentPage + 1, PAGE_SIZE);
      if (Array.isArray(data?.data)) {
        setMetodos(data.data);
        setTotalPages(data?.metadata?.totalPages || 1);
      } else {
        setMetodos([]);
        setTotalPages(1);
      }
    } catch {
      setMetodos([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetodos(page);
    // eslint-disable-next-line
  }, [page]);

  const openCreate = () => {
    setEditMetodo(null);
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditMetodo(m);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditMetodo(null);
  };

  const handleSave = async (form) => {
    setSubmitting(true);
    try {
      if (editMetodo) {
        await updateMetodoPago(editMetodo.id, form);
      } else {
        await createMetodoPago(form);
      }
      closeModal();
      fetchMetodos(page);
    } catch (e) {
      const msg = e?.response?.data?.message ?? "Error guardando método de pago";
      alert(msg);
    }
    setSubmitting(false);
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`¿Eliminar el método de pago "${m.tipoPago}"?`)) return;
    try {
      await deleteMetodoPago(m.id);
      fetchMetodos(page);
    } catch {
      alert("Error eliminando método de pago");
    }
  };

  const sorted = [...metodos].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-6 w-6" /> Métodos de Pago
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Plus className="h-5 w-5" /> Nuevo método
        </motion.button>
      </div>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Tipo de Pago", "Creado", "Acciones"]} />
        <Table.Body
          loading={loading}
          colSpan={4}
          empty={sorted.length === 0}
          emptyText="Sin métodos de pago"
        >
          {sorted.map((m) => (
            <motion.tr
              key={m.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{m.id}</td>
              <td className="py-2 px-4 font-medium">{m.tipoPago}</td>
              <td className="py-2 px-4 text-sm text-gray-500">
                {m.createdAt ? new Date(m.createdAt).toLocaleDateString("es-PE") : "—"}
              </td>
              <td className="py-2 px-4 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 0.95 }}
                  title="Editar"
                  className="p-2 rounded hover:bg-blue-100 text-blue-700"
                  onClick={() => openEdit(m)}
                >
                  <Pencil className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 0.95 }}
                  title="Eliminar"
                  className="p-2 rounded hover:bg-red-100 text-red-700"
                  onClick={() => handleDelete(m)}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </Table.Body>
        <Table.Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage(Math.max(page - 1, 0))}
          onNext={() => setPage(Math.min(page + 1, totalPages - 1))}
        />
      </Table>

      <MetodoPagoFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        metodo={editMetodo}
        submitting={submitting}
      />
    </div>
  );
}
