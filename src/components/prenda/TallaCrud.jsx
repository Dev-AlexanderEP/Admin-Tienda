import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Ruler,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api/v1";

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

export default function TallaCrud() {
  const [tallas, setTallas] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTalla, setEditTalla] = useState(null);

  // Animaciones para tabla
  const tableVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Fetch paginado
  const fetchTallas = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/tallas/paginado`, {
        params: { page, size: 10 },
      });
      if (data.object && Array.isArray(data.object.content)) {
        setTallas(data.object.content);
        setTotalPages(data.object.totalPages || 1);
        setPage(data.object.page || 0);
      } else {
        setTallas([]);
        setTotalPages(1);
        setPage(0);
      }
    } catch (e) {
      setTallas([]);
      setTotalPages(1);
      setPage(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTallas(page);
    // eslint-disable-next-line
  }, [page]);

  const handleSave = async (form) => {
    try {
      if (editTalla) {
        // PUT para actualizar
        await axios.put(`${API}/talla/${editTalla.id}`, form);
      } else {
        // POST para crear
        await axios.post(`${API}/talla`, form);
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
        await axios.delete(`${API}/talla/${talla.id}`);
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
      <AnimatePresence mode="wait">
        <motion.div
          key={page + "-" + sortedTallas.length}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={tableVariants}
          transition={{ duration: 0.25 }}
          className="overflow-x-auto rounded shadow bg-white"
        >
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Nombre de Talla</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : sortedTallas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    Sin tallas
                  </td>
                </tr>
              ) : (
                sortedTallas.map((t) => (
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
                ))
              )}
            </tbody>
          </table>
          {/* Paginación real */}
          <div className="flex justify-between items-center py-3 px-4 bg-gray-50">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(Math.max(page - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </motion.button>
            <span>
              Página <b>{page + 1}</b> de <b>{totalPages}</b>
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
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