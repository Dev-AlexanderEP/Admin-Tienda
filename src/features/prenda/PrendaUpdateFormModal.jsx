import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { updatePrenda } from "./api/prendas";

const schema = z.object({
  nombre:      z.string().min(1, "Requerido"),
  descripcion: z.string().min(1, "Requerido"),
  precio:      z.coerce.number().positive("Debe ser mayor a 0"),
  activo:      z.boolean(),
  categoriaId: z.coerce.number().min(1, "Selecciona una categoría"),
  marcaId:     z.coerce.number().min(1, "Selecciona una marca"),
  proveedorId: z.coerce.number().min(1, "Selecciona un proveedor"),
  generoId:    z.coerce.number().min(1, "Selecciona un género"),
});

export default function PrendaUpdateFormModal({ open, onClose, prenda, marcas, proveedores, categorias, generos, onUpdated }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open && prenda) {
      reset({
        nombre:      prenda.nombre      ?? "",
        descripcion: prenda.descripcion ?? "",
        precio:      prenda.precio      ?? "",
        activo:      prenda.activo      ?? true,
        categoriaId: prenda.categoriaId ?? prenda.categoria?.id ?? "",
        marcaId:     prenda.marcaId     ?? prenda.marca?.id     ?? "",
        proveedorId: prenda.proveedorId ?? prenda.proveedor?.id ?? "",
        generoId:    prenda.generoId    ?? prenda.genero?.id    ?? "",
      });
    }
  }, [open, prenda, reset]);

  const onSubmit = async (values) => {
    try {
      await updatePrenda(prenda.id, {
        nombre:      values.nombre,
        descripcion: values.descripcion,
        precio:      values.precio,
        activo:      values.activo,
        marcaId:     values.marcaId,
        categoriaId: values.categoriaId,
        proveedorId: values.proveedorId,
        generoId:    values.generoId,
      });
      onUpdated?.();
      onClose();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Error al actualizar prenda");
    }
  };

  if (!open || !prenda) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        >
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
            <X />
          </button>
          <h2 className="text-lg font-semibold mb-4">Editar Prenda</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Field label="Nombre" error={errors.nombre}>
              <input {...register("nombre")} className="w-full border rounded px-2 py-1" />
            </Field>

            <Field label="Descripción" error={errors.descripcion}>
              <textarea {...register("descripcion")} className="w-full border rounded px-2 py-1" />
            </Field>

            <div className="flex gap-2">
              <Field label="Categoría" error={errors.categoriaId} className="flex-1">
                <select {...register("categoriaId")} className="w-full border rounded px-2 py-1">
                  <option value="">Selecciona</option>
                  {categorias.map((c) => <option key={c.id} value={c.id}>{c.nomCategoria}</option>)}
                </select>
              </Field>
              <Field label="Marca" error={errors.marcaId} className="flex-1">
                <select {...register("marcaId")} className="w-full border rounded px-2 py-1">
                  <option value="">Selecciona</option>
                  {marcas.map((m) => <option key={m.id} value={m.id}>{m.nomMarca}</option>)}
                </select>
              </Field>
              <Field label="Proveedor" error={errors.proveedorId} className="flex-1">
                <select {...register("proveedorId")} className="w-full border rounded px-2 py-1">
                  <option value="">Selecciona</option>
                  {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nomProveedor}</option>)}
                </select>
              </Field>
              <Field label="Género" error={errors.generoId} className="flex-1">
                <select {...register("generoId")} className="w-full border rounded px-2 py-1">
                  <option value="">Selecciona</option>
                  {generos?.map((g) => <option key={g.id} value={g.id}>{g.nomGenero}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Precio" error={errors.precio}>
              <input type="number" step="0.01" min="0" {...register("precio")} className="w-full border rounded px-2 py-1" />
            </Field>

            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" {...register("activo")} className="mr-2" />
              Activo
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                disabled={isSubmitting}
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

function Field({ label, error, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error.message}</p>}
    </div>
  );
}
