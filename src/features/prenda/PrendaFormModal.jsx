import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shirt, Check, UploadCloud } from "lucide-react";
import { createPrenda, uploadImagen } from "./api/prendas";

const schema = z.object({
  nombre:      z.string().min(1, "Requerido"),
  descripcion: z.string().min(1, "Requerido"),
  precio:      z.coerce.number().positive("Debe ser mayor a 0"),
  activo:      z.boolean().default(true),
  categoriaId: z.coerce.number().min(1, "Selecciona una categoría"),
  marcaId:     z.coerce.number().min(1, "Selecciona una marca"),
  proveedorId: z.coerce.number().min(1, "Selecciona un proveedor"),
  generoId:    z.coerce.number().min(1, "Selecciona un género"),
});

const FILE_SLOTS = [
  { key: "principal", label: "Imagen Principal",  tipo: "PRINCIPAL",  orden: null, required: true,  accept: "image/*" },
  { key: "hover",     label: "Imagen Hover",      tipo: "HOVER",      orden: null, required: true,  accept: "image/*" },
  { key: "img1",      label: "Imagen Secundaria", tipo: "SECUNDARIA", orden: null, required: true,  accept: "image/*" },
  { key: "img2",      label: "Imagen Terciaria",  tipo: "TERCIARIA",  orden: null, required: true,  accept: "image/*" },
  { key: "video",     label: "Video",             tipo: "DETALLE",    orden: null, required: false, accept: "video/*" },
];

const EMPTY_FILES = { principal: null, hover: null, img1: null, img2: null, video: null };

export default function PrendaFormModal({ open, onClose, onSuccess, categorias, marcas, proveedores, generos }) {
  const [imgFiles, setImgFiles]     = useState(EMPTY_FILES);
  const [imgPreview, setImgPreview] = useState(EMPTY_FILES);
  const [uploading, setUploading]   = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { activo: true },
  });

  useEffect(() => {
    if (open) {
      reset({ activo: true });
      setImgFiles(EMPTY_FILES);
      setImgPreview(EMPTY_FILES);
    }
  }, [open, reset]);

  useEffect(() => {
    const urls = {};
    Object.entries(imgFiles).forEach(([k, f]) => {
      urls[k] = f ? URL.createObjectURL(f) : "";
    });
    setImgPreview(urls);
    return () => Object.values(urls).forEach((u) => u && URL.revokeObjectURL(u));
  }, [imgFiles]);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("El archivo no debe superar 10MB"); return; }
    setImgFiles((prev) => ({ ...prev, [key]: file }));
  };

  const onSubmit = async (values) => {
    const missing = FILE_SLOTS.filter((s) => s.required && !imgFiles[s.key]).map((s) => s.label);
    if (missing.length) { alert(`Faltan archivos: ${missing.join(", ")}`); return; }

    setUploading(true);
    try {
      // 1. Crear prenda → obtener prendaId
      const body = {
        nombre:      values.nombre,
        descripcion: values.descripcion,
        precio:      values.precio,
        activo:      values.activo,
        marcaId:     values.marcaId,
        categoriaId: values.categoriaId,
        proveedorId: values.proveedorId,
        generoId:    values.generoId,
      };
      const { data } = await createPrenda(body);
      const prendaId = data?.data?.id;
      if (!prendaId) throw new Error("No se recibió el ID de la prenda creada");

      // 2. Subir cada archivo a R2
      for (const slot of FILE_SLOTS) {
        const file = imgFiles[slot.key];
        if (file) await uploadImagen(prendaId, file, slot.tipo);
      }

      onSuccess?.();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Error al crear la prenda o subir imágenes");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 min-w-[380px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
        >
          <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
            <X />
          </button>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shirt className="h-6 w-6" /> Nueva Prenda
          </h2>

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
                  {generos.map((g) => <option key={g.id} value={g.id}>{g.nomGenero}</option>)}
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

            <div className="grid grid-cols-2 gap-4">
              {FILE_SLOTS.map((slot) => (
                <div key={slot.key}>
                  <label className="text-sm font-semibold">
                    {slot.label}{slot.required ? "" : " (opcional)"} (máx 10MB)
                  </label>
                  <input
                    type="file"
                    accept={slot.accept}
                    onChange={(e) => handleFileChange(e, slot.key)}
                  />
                  {slot.accept === "image/*" && imgPreview[slot.key] && (
                    <img src={imgPreview[slot.key]} alt={slot.key} className="w-24 h-24 mt-2 object-cover rounded" />
                  )}
                  {slot.accept === "video/*" && imgPreview[slot.key] && (
                    <video src={imgPreview[slot.key]} controls className="w-24 h-24 mt-2 object-cover rounded" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={onClose}
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                disabled={uploading}
              >
                {uploading && <UploadCloud className="h-4 w-4 animate-bounce" />}
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
