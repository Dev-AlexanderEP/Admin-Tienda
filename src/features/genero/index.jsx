import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, Users, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../components/Table";
import { getGenerosPaginado, createGenero, updateGenero, deleteGenero } from "./api/generos";

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

// ── Modal ────────────────────────────────────────────────────────────────────

function GeneroModal({ open, onClose, onSubmit, genero, submitting }) {
  const [nomGenero, setNomGenero] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNomGenero(genero?.nomGenero ?? "");
      setError("");
    }
  }, [open, genero]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = nomGenero.trim();
    if (!trimmed) { setError("El nombre es requerido"); return; }
    if (trimmed.length < 2 || trimmed.length > 50) { setError("Debe tener entre 2 y 50 caracteres"); return; }
    onSubmit({ nomGenero: trimmed });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] relative"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose} disabled={submitting}>
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Users className="h-5 w-5" /> {genero ? "Editar Género" : "Nuevo Género"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  value={nomGenero}
                  onChange={(e) => { setNomGenero(e.target.value); setError(""); }}
                  placeholder="Ej: Hombre, Mujer, Unisex..."
                  className={`w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? "border-red-400" : "border-gray-300"}`}
                  disabled={submitting}
                  autoFocus
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={onClose} disabled={submitting}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 disabled:opacity-60">
                  <Check className="h-4 w-4" /> {submitting ? "Guardando..." : "Guardar"}
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

export default function GeneroCrud() {
  const [generos, setGeneros]       = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);

  const fetchData = async (currentPage = 0) => {
    setLoading(true);
    try {
      const { data } = await getGenerosPaginado(currentPage + 1, PAGE_SIZE);
      const { items, totalPages: tp } = parsePaginated(data);
      setGeneros(items);
      setTotalPages(tp);
    } catch {
      setGeneros([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(page); }, [page]); // eslint-disable-line

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit   = (item) => { setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleSave = async (form) => {
    setSubmitting(true);
    try {
      if (editItem) {
        await updateGenero(editItem.id, form);
      } else {
        await createGenero(form);
      }
      closeModal();
      fetchData(page);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) alert("El género ya existe.");
      else alert(e?.response?.data?.message ?? "Error guardando género");
    }
    setSubmitting(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar el género "${item.nomGenero}"?`)) return;
    try {
      await deleteGenero(item.id);
      fetchData(page);
    } catch {
      alert("Error eliminando género");
    }
  };

  const sorted = [...generos].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-6 w-6" /> Géneros
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Plus className="h-5 w-5" /> Nuevo género
        </motion.button>
      </div>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Nombre", "Acciones"]} />
        <Table.Body loading={loading} colSpan={3} empty={sorted.length === 0} emptyText="Sin géneros">
          {sorted.map((g) => (
            <motion.tr
              key={g.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{g.id}</td>
              <td className="py-2 px-4 font-medium">{g.nomGenero}</td>
              <td className="py-2 px-4 flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-blue-100 text-blue-700" onClick={() => openEdit(g)} title="Editar">
                  <Pencil className="h-4 w-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-red-100 text-red-700" onClick={() => handleDelete(g)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </motion.button>
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

      <GeneroModal
        open={modalOpen} onClose={closeModal}
        onSubmit={handleSave} genero={editItem} submitting={submitting}
      />
    </div>
  );
}
