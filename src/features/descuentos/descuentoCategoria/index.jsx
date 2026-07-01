import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, Tag, Plus, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../../components/Table";
import {
  getDescuentosCategoriasPaginado,
  createDescuentoCategoria,
  updateDescuentoCategoria,
  deleteDescuentoCategoria,
} from "../api/descuentos";
import { getCategorias } from "../../categoria/api/categorias";

// ── helpers ──────────────────────────────────────────────────────────────────

const toDateInput = (v) => (v ? v.split("T")[0] : "");

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

const EMPTY = { categoriaId: "", porcentaje: "", fechaInicio: "", fechaFin: "", activo: true };

const validate = (f) => {
  const e = {};
  if (!f.categoriaId) e.categoriaId = "Selecciona una categoría";
  const p = Number(f.porcentaje);
  if (isNaN(p) || p <= 0 || p > 100) e.porcentaje = "Debe ser entre 0 y 100";
  if (!f.fechaInicio) e.fechaInicio = "Requerido";
  if (f.fechaFin && f.fechaFin < f.fechaInicio) e.fechaFin = "Debe ser posterior al inicio";
  return e;
};

// ── Modal ────────────────────────────────────────────────────────────────────

function DescuentoCategoriaModal({ open, onClose, onSubmit, descuento, submitting, categorias }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        descuento
          ? {
              categoriaId: descuento.categoriaId ?? "",
              porcentaje:  descuento.porcentaje ?? "",
              fechaInicio: toDateInput(descuento.fechaInicio),
              fechaFin:    toDateInput(descuento.fechaFin),
              activo:      descuento.activo ?? true,
            }
          : EMPTY
      );
    }
  }, [open, descuento]);

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      categoriaId: Number(form.categoriaId),
      porcentaje:  Number(form.porcentaje),
      fechaInicio: form.fechaInicio,
      fechaFin:    form.fechaFin || null,
      activo:      form.activo,
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
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {descuento ? "Editar Descuento por Categoría" : "Nuevo Descuento por Categoría"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Categoría" error={errors.categoriaId} required>
                <select value={form.categoriaId} onChange={set("categoriaId")} className={input(errors.categoriaId)} disabled={submitting}>
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nomCategoria}</option>
                  ))}
                </select>
              </Field>

              <Field label="Porcentaje (%)" error={errors.porcentaje} required>
                <input
                  type="number" step="0.01" min="0.01" max="100"
                  value={form.porcentaje} onChange={set("porcentaje")}
                  placeholder="Ej: 15"
                  className={input(errors.porcentaje)}
                  disabled={submitting}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha inicio" error={errors.fechaInicio} required>
                  <input type="date" value={form.fechaInicio} onChange={set("fechaInicio")} className={input(errors.fechaInicio)} disabled={submitting} />
                </Field>
                <Field label="Fecha fin (opcional)" error={errors.fechaFin}>
                  <input type="date" value={form.fechaFin} onChange={set("fechaFin")} className={input(errors.fechaFin)} disabled={submitting} />
                </Field>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
                <input type="checkbox" checked={form.activo} onChange={set("activo")} disabled={submitting} />
                Activo
              </label>

              <div className="flex justify-end gap-2 pt-2">
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

export default function DescuentoCategoriaCrud() {
  const [items, setItems]           = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);

  const fetchData = async (currentPage = 0) => {
    setLoading(true);
    try {
      const { data } = await getDescuentosCategoriasPaginado(currentPage + 1, PAGE_SIZE);
      const { items: arr, totalPages: tp } = parsePaginated(data);
      setItems(arr);
      setTotalPages(tp);
    } catch {
      setItems([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const fetchCategorias = async () => {
    try {
      const { data } = await getCategorias();
      setCategorias(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setCategorias([]);
    }
  };

  useEffect(() => {
    fetchData(page);
    fetchCategorias();
  }, [page]); // eslint-disable-line

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit   = (item) => { setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleSave = async (form) => {
    setSubmitting(true);
    try {
      if (editItem) {
        await updateDescuentoCategoria(editItem.id, form);
      } else {
        await createDescuentoCategoria(form);
      }
      closeModal();
      fetchData(page);
    } catch (e) {
      alert(e?.response?.data?.message ?? "Error guardando descuento");
    }
    setSubmitting(false);
  };

  const handleDelete = async (item) => {
    const cat = categorias.find((c) => c.id === item.categoriaId);
    const nombre = cat?.nomCategoria ?? `ID ${item.categoriaId}`;
    if (!window.confirm(`¿Eliminar descuento de ${item.porcentaje}% para "${nombre}"?`)) return;
    try {
      await deleteDescuentoCategoria(item.id);
      fetchData(page);
    } catch {
      alert("Error eliminando descuento");
    }
  };

  const catNombre = (id) => categorias.find((c) => c.id === id)?.nomCategoria ?? `#${id}`;
  const sorted = [...items].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Tag className="h-6 w-6" /> Descuentos por Categoría
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Plus className="h-5 w-5" /> Nuevo descuento
        </motion.button>
      </div>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Categoría", "%", "Inicio", "Fin", "Activo", "Acciones"]} />
        <Table.Body loading={loading} colSpan={7} empty={sorted.length === 0} emptyText="Sin descuentos por categoría">
          {sorted.map((item) => (
            <motion.tr
              key={item.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4 font-medium">{catNombre(item.categoriaId)}</td>
              <td className="py-2 px-4">{item.porcentaje}%</td>
              <td className="py-2 px-4 text-sm">{formatDate(item.fechaInicio)}</td>
              <td className="py-2 px-4 text-sm">{item.fechaFin ? formatDate(item.fechaFin) : <span className="text-gray-400">Sin venc.</span>}</td>
              <td className="py-2 px-4">
                <span className={`flex items-center gap-1 text-sm ${item.activo ? "text-green-600" : "text-gray-400"}`}>
                  <ToggleRight className="h-4 w-4" /> {item.activo ? "Sí" : "No"}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-blue-100 text-blue-700" onClick={() => openEdit(item)} title="Editar">
                  <Pencil className="h-4 w-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-red-100 text-red-700" onClick={() => handleDelete(item)} title="Eliminar">
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

      <DescuentoCategoriaModal
        open={modalOpen} onClose={closeModal}
        onSubmit={handleSave} descuento={editItem}
        submitting={submitting} categorias={categorias}
      />
    </div>
  );
}

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function input(error) {
  return `w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
    error ? "border-red-400" : "border-gray-300"
  }`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d + (d.includes("T") ? "" : "T00:00:00")).toLocaleDateString("es-PE");
}
