import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Ruler,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../components/Table";
import {
  getTallasPaginado,
  createTalla,
  updateTalla,
  deleteTalla,
} from "./api/tallas";

function TallaFormModal({ open, onClose, onSubmit, talla }) {
  const [form, setForm] = useState({
    nomTalla: "",
  });

  useEffect(() => {
    if (talla) {
      setForm({
        nomTalla: talla.nomTalla ?? "",
      });
    } else {
      setForm({
        nomTalla: "",
      });
    }
  }, [talla, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
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
            className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={onClose}
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Ruler className="h-6 w-6" /> {talla ? "Editar Talla" : "Nueva Talla"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm flex items-center gap-2">
                  <Ruler className="h-4 w-4" /> Nombre de Talla
                </label>
                <input
                  type="text"
                  required
                  name="nomTalla"
                  value={form.nomTalla}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Ej: S, M, L, XL"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                >
                  <Check className="h-4 w-4" /> Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PAGE_SIZE = 10;

export default function TallaCrud() {
  const [tallas, setTallas] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTalla, setEditTalla] = useState(null);

  const fetchTallas = async (currentPage = 0) => {
    setLoading(true);
    try {
      const { data } = await getTallasPaginado(currentPage + 1, PAGE_SIZE);
      if (Array.isArray(data?.data)) {
        setTallas(data.data);
        setTotalPages(data?.metadata?.totalPages || 1);
      } else {
        setTallas([]);
        setTotalPages(1);
      }
    } catch {
      setTallas([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTallas(page);
  }, [page]);

  const handleSave = async (form) => {
    try {
      if (editTalla) {
        await updateTalla(editTalla.id, form);
      } else {
        await createTalla(form);
      }
      setModalOpen(false);
      setEditTalla(null);
      fetchTallas(page);
    } catch (e) {
      alert("Error guardando talla");
    }
  };

  const handleDelete = async (talla) => {
    if (window.confirm(`¿Eliminar talla "${talla.nomTalla}"?`)) {
      try {
        await deleteTalla(talla.id);
        fetchTallas(page);
      } catch (e) {
        alert("Error eliminando talla");
      }
    }
  };

  // Sin inputs de filtro, solo muestra paginado real del backend
  const sortedTallas = [...tallas].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Ruler className="h-6 w-6" /> Tallas
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditTalla(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Ruler className="h-5 w-5" /> Nueva talla
        </motion.button>
      </div>
      <Table animKey={page + "-" + sortedTallas.length}>
        <Table.Header columns={["ID", "Nombre de Talla", "Acciones"]} />
        <Table.Body loading={loading} colSpan={3} empty={sortedTallas.length === 0} emptyText="Sin tallas">
          {sortedTallas.map((t) => (
            <motion.tr
              key={t.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{t.id}</td>
              <td className="py-2 px-4">{t.nomTalla}</td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <motion.button
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 0.95 }}
                  title="Editar"
                  className="p-2 rounded hover:bg-blue-100 text-blue-700"
                  onClick={() => {
                    setEditTalla(t);
                    setModalOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 0.95 }}
                  title="Eliminar"
                  className="p-2 rounded hover:bg-red-100 text-red-700"
                  onClick={() => handleDelete(t)}
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
      <TallaFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTalla(null);
        }}
        onSubmit={handleSave}
        talla={editTalla}
      />
    </div>
  );
}