import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layers, Pencil, Plus, Check, Trash2 } from "lucide-react";
import { getTallas } from "../talla/api/tallas";
import { getPrendaDetalle } from "./api/prendas";
import { createPrendaTalla, updatePrendaTalla, deletePrendaTalla } from "./api/prendaTallas";

const tallaFormSchema = z.object({
  tallaId: z.coerce.number().min(1, "Selecciona una talla"),
  stock:   z.coerce.number().int("Debe ser entero").min(1, "Mínimo 1"),
});

export default function TallasModal({ open, onClose, prendaId }) {
  const [localTallas, setLocalTallas]     = useState([]);
  const [tallasOptions, setTallasOptions] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [editTalla, setEditTalla]         = useState(null);

  useEffect(() => {
    if (open && prendaId) {
      setModalFormOpen(false);
      setEditTalla(null);
      fetchTallas();
      fetchTallasOptions();
    }
    // eslint-disable-next-line
  }, [open, prendaId]);

  const fetchTallas = async () => {
    setLoading(true);
    try {
      const { data } = await getPrendaDetalle(prendaId);
      const tallas = data?.data?.tallas ?? [];
      setLocalTallas(
        tallas.map((t) => ({
          id:     t.prendaTallaId,
          tallaId: t.tallaId,
          talla:  { id: t.tallaId, nomTalla: t.nomTalla },
          stock:  t.stock,
        }))
      );
    } catch {
      setLocalTallas([]);
    }
    setLoading(false);
  };

  const fetchTallasOptions = async () => {
    try {
      const { data } = await getTallas();
      setTallasOptions(Array.isArray(data.data) ? data.data : []);
    } catch {
      setTallasOptions([]);
    }
  };

  const handleSave = async (form) => {
    setLoading(true);
    try {
      if (form.id) {
        // Solo se puede cambiar el stock
        const { data } = await updatePrendaTalla(form.id, { stock: form.stock });
        const updated = data?.data;
        setLocalTallas((prev) =>
          prev.map((t) => (t.id === form.id ? { ...t, stock: updated?.stock ?? form.stock } : t))
        );
      } else {
        const { data } = await createPrendaTalla({ prendaId, tallaId: form.tallaId, stock: form.stock });
        const created = data?.data;
        setLocalTallas((prev) => [
          ...prev,
          {
            id:     created.id,
            tallaId: created.tallaId,
            talla:  tallasOptions.find((ta) => ta.id === created.tallaId) ?? { nomTalla: "?" },
            stock:  created.stock,
          },
        ]);
      }
      setModalFormOpen(false);
      setEditTalla(null);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) alert("Esa talla ya está asociada a esta prenda.");
      else alert("Error guardando talla.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta talla?")) return;
    setLoading(true);
    try {
      await deletePrendaTalla(id);
      setLocalTallas((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Error eliminando talla.");
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" /> Tallas y Stock
            </h3>

            <div className="flex justify-end mb-2">
              <motion.button
                whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => { setEditTalla(null); setModalFormOpen(true); }}
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
                {loading ? (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-400">Cargando...</td></tr>
                ) : localTallas.length === 0 ? (
                  <tr><td colSpan={4} className="py-4 text-center">Sin tallas asociadas</td></tr>
                ) : (
                  localTallas.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2 px-4">{t.id}</td>
                      <td className="py-2 px-4">{t.talla?.nomTalla ?? "—"}</td>
                      <td className="py-2 px-4">{t.stock}</td>
                      <td className="py-2 px-4 flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}
                          title="Editar stock"
                          className="p-2 rounded hover:bg-blue-100 text-blue-700"
                          onClick={() => { setEditTalla(t); setModalFormOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}
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
              onClose={() => { setModalFormOpen(false); setEditTalla(null); }}
              onSubmit={handleSave}
              inicial={editTalla}
              tallasOptions={tallasOptions}
              submitting={loading}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TallaFormModal({ open, onClose, onSubmit, inicial, tallasOptions, submitting }) {
  const isEdit = !!inicial?.id;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(tallaFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset({
        tallaId: inicial?.talla?.id ?? "",
        stock:   inicial?.stock    ?? "",
      });
    }
  }, [open, inicial, reset]);

  const onFormSubmit = (values) => {
    onSubmit({ id: inicial?.id ?? null, ...values });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        >
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
            <X />
          </button>
          <h4 className="text-lg font-semibold mb-4">
            {isEdit ? "Editar Stock" : "Agregar Talla"}
          </h4>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
            <div>
              <label className="text-sm font-semibold">Talla</label>
              <select
                {...register("tallaId")}
                className="w-full border rounded px-2 py-1"
                disabled={isEdit}
              >
                <option value="">Selecciona</option>
                {tallasOptions.map((t) => (
                  <option key={t.id} value={t.id}>{t.nomTalla}</option>
                ))}
              </select>
              {errors.tallaId && <p className="text-xs text-red-500 mt-0.5">{errors.tallaId.message}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold">Stock</label>
              <input
                type="number"
                min={1}
                {...register("stock")}
                className="w-full border rounded px-2 py-1"
              />
              {errors.stock && <p className="text-xs text-red-500 mt-0.5">{errors.stock.message}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                disabled={submitting}
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
