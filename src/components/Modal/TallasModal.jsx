import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Pencil, Plus, Check, Trash2 } from "lucide-react";

const API = "https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1";

// Modal para visualizar y CRUD de PrendaTalla
export default function TallasModal({ open, onClose, tallas, prendaId }) {
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [editTalla, setEditTalla] = useState(null);
  const [localTallas, setLocalTallas] = useState([]);
  const [tallasOptions, setTallasOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sincroniza tallas iniciales
  useEffect(() => {
    if (open) {
      setLocalTallas(tallas || []);
      setEditTalla(null);
      setModalFormOpen(false);
      fetchTallasOptions();
    }
    // eslint-disable-next-line
  }, [open, tallas]);

  // Obtener opciones de tallas
  const fetchTallasOptions = async () => {
    try {
      const { data } = await axios.get(`${API}/tallas`);
      setTallasOptions(Array.isArray(data.object) ? data.object : []);
    } catch {
      setTallasOptions([]);
    }
  };

  // Crear o editar PrendaTalla
  const handleSave = async (form) => {
    setLoading(true);
    try {
      if (form.id) {
        // PUT
        const body = {
          id: form.id,
          prendaId: prendaId,
          tallaId: form.tallaId,
          stock: form.stock,
        };
        const { data } = await axios.put(`${API}/prenda-talla/${form.id}`, body);
        setLocalTallas((prev) =>
          prev.map((t) =>
            t.id === data.object.id
              ? { ...t, ...data.object, talla: tallasOptions.find((ta) => ta.id === data.object.tallaId) }
              : t
          )
        );
      } else {
        // POST
        const body = {
          prendaId: prendaId,
          tallaId: form.tallaId,
          stock: form.stock,
        };
        const { data } = await axios.post(`${API}/prenda-talla`, body);
        setLocalTallas((prev) => [
          ...prev,
          { ...data.object, talla: tallasOptions.find((ta) => ta.id === data.object.tallaId) },
        ]);
      }
      setModalFormOpen(false);
      setEditTalla(null);
    } catch (e) {
      alert("Error guardando talla.");
    }
    setLoading(false);
  };

  // Eliminar PrendaTalla
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta talla?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/prenda-talla/${id}`);
      setLocalTallas((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert("Error eliminando talla.");
    }
    setLoading(false);
  };

  // Formulario modal interno para crear/editar
  function TallaFormModal({ open, onClose, onSubmit, inicial }) {
    const [form, setForm] = useState({
      id: inicial?.id || null,
      tallaId: inicial?.talla?.id || "",
      stock: inicial?.stock || "",
    });

    useEffect(() => {
      if (inicial) {
        setForm({
          id: inicial.id || null,
          tallaId: inicial.talla?.id || "",
          stock: inicial.stock || "",
        });
      } else {
        setForm({ id: null, tallaId: "", stock: "" });
      }
    }, [inicial, open]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!form.tallaId || !form.stock) {
        alert("Talla y stock son requeridos");
        return;
      }
      onSubmit({ ...form, tallaId: Number(form.tallaId), stock: Number(form.stock) });
    };

    if (!open) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
              <X />
            </button>
            <h4 className="text-lg font-semibold mb-4">
              {form.id ? "Editar Talla" : "Agregar Talla"}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-semibold">Talla</label>
                <select
                  required
                  name="tallaId"
                  value={form.tallaId}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  disabled={!!form.id}
                >
                  <option value="">Selecciona</option>
                  {tallasOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nomTalla}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold">Stock</label>
                <input
                  type="number"
                  min={1}
                  required
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  disabled={loading}
                >
                  <Check className="h-4 w-4" /> Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
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
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" /> Tallas y Stock
            </h3>
            <div className="flex justify-end mb-2">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => {
                  setEditTalla(null);
                  setModalFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Agregar talla
              </motion.button>
            </div>
            <table className="min-w-full border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Talla</th>
                  <th className="py-2 px-4 text-left">Stock</th>
                  <th className="py-2 px-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {localTallas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Sin tallas asociadas
                    </td>
                  </tr>
                ) : (
                  localTallas.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2 px-4">{t.id}</td>
                      <td className="py-2 px-4">{t.talla?.nomTalla || "Sin nombre"}</td>
                      <td className="py-2 px-4">{t.stock}</td>
                      <td className="py-2 px-4 flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.97 }}
                          title="Editar"
                          className="p-2 rounded hover:bg-blue-100 text-blue-700"
                          onClick={() => {
                            setEditTalla(t);
                            setModalFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.97 }}
                          title="Eliminar"
                          className="p-2 rounded hover:bg-red-100 text-red-700"
                          onClick={() => handleDelete(t.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <TallaFormModal
              open={modalFormOpen}
              onClose={() => {
                setModalFormOpen(false);
                setEditTalla(null);
              }}
              onSubmit={handleSave}
              inicial={editTalla}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}