import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, Ticket, Plus, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../../components/Table";
import {
  getDescuentosCodigosPaginado,
  createDescuentoCodigo,
  updateDescuentoCodigo,
  deleteDescuentoCodigo,
} from "../api/descuentos";

// ── helpers ─────────────────────────────────────────────────────────────────

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

const EMPTY = {
  codigo: "",
  descripcion: "",
  porcentaje: "",
  fechaInicio: "",
  fechaFin: "",
  usoMaximo: "",
  activo: true,
};

const validate = (f) => {
  const e = {};
  if (!f.codigo.trim()) e.codigo = "Requerido";
  if (!f.descripcion.trim()) e.descripcion = "Requerido";
  const p = Number(f.porcentaje);
  if (isNaN(p) || p <= 0 || p > 100) e.porcentaje = "Debe ser entre 0 y 100";
  if (!f.fechaInicio) e.fechaInicio = "Requerido";
  if (f.fechaFin && f.fechaFin < f.fechaInicio) e.fechaFin = "Debe ser posterior al inicio";
  const u = Number(f.usoMaximo);
  if (!Number.isInteger(u) || u < 1) e.usoMaximo = "Mínimo 1 (entero)";
  return e;
};

// ── Modal ────────────────────────────────────────────────────────────────────

function DescuentoCodigoModal({ open, onClose, onSubmit, descuento, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        descuento
          ? {
              codigo:      descuento.codigo ?? "",
              descripcion: descuento.descripcion ?? "",
              porcentaje:  descuento.porcentaje ?? "",
              fechaInicio: toDateInput(descuento.fechaInicio),
              fechaFin:    toDateInput(descuento.fechaFin),
              usoMaximo:   descuento.usoMaximo ?? "",
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
      codigo:      form.codigo.trim(),
      descripcion: form.descripcion.trim(),
      porcentaje:  Number(form.porcentaje),
      fechaInicio: form.fechaInicio,
      fechaFin:    form.fechaFin || null,
      usoMaximo:   Number(form.usoMaximo),
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
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-auto"
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose} disabled={submitting}>
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {descuento ? "Editar Cupón" : "Nuevo Cupón"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Código" error={errors.codigo} required>
                <input
                  value={form.codigo} onChange={set("codigo")}
                  placeholder="Ej: PROMO20"
                  className={input(errors.codigo)}
                  disabled={submitting}
                />
              </Field>

              <Field label="Descripción" error={errors.descripcion} required>
                <textarea
                  value={form.descripcion} onChange={set("descripcion")}
                  placeholder="Descripción visible al cliente"
                  rows={2}
                  className={input(errors.descripcion)}
                  disabled={submitting}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Porcentaje (%)" error={errors.porcentaje} required>
                  <input
                    type="number" step="0.01" min="0.01" max="100"
                    value={form.porcentaje} onChange={set("porcentaje")}
                    placeholder="Ej: 20"
                    className={input(errors.porcentaje)}
                    disabled={submitting}
                  />
                </Field>
                <Field label="Uso máximo" error={errors.usoMaximo} required>
                  <input
                    type="number" min="1" step="1"
                    value={form.usoMaximo} onChange={set("usoMaximo")}
                    placeholder="Ej: 100"
                    className={input(errors.usoMaximo)}
                    disabled={submitting}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha inicio" error={errors.fechaInicio} required>
                  <input
                    type="date"
                    value={form.fechaInicio} onChange={set("fechaInicio")}
                    className={input(errors.fechaInicio)}
                    disabled={submitting}
                  />
                </Field>
                <Field label="Fecha fin (opcional)" error={errors.fechaFin}>
                  <input
                    type="date"
                    value={form.fechaFin} onChange={set("fechaFin")}
                    className={input(errors.fechaFin)}
                    disabled={submitting}
                  />
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

export default function DescuentoCodigoCrud() {
  const [items, setItems]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);

  const fetchData = async (currentPage = 0) => {
    setLoading(true);
    try {
      const { data } = await getDescuentosCodigosPaginado(currentPage + 1, PAGE_SIZE);
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

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit   = (item) => { setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleSave = async (form) => {
    setSubmitting(true);
    try {
      if (editItem) {
        await updateDescuentoCodigo(editItem.id, form);
      } else {
        await createDescuentoCodigo(form);
      }
      closeModal();
      fetchData(page);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) alert("El código de descuento ya existe.");
      else alert(e?.response?.data?.message ?? "Error guardando cupón");
    }
    setSubmitting(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar el cupón "${item.codigo}"?`)) return;
    try {
      await deleteDescuentoCodigo(item.id);
      fetchData(page);
    } catch {
      alert("Error eliminando cupón");
    }
  };

  const sorted = [...items].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Ticket className="h-6 w-6" /> Descuentos por Código
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Plus className="h-5 w-5" /> Nuevo cupón
        </motion.button>
      </div>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Código", "Descripción", "%", "Inicio", "Fin", "Uso Máx.", "Activo", "Acciones"]} />
        <Table.Body loading={loading} colSpan={9} empty={sorted.length === 0} emptyText="Sin cupones">
          {sorted.map((item) => (
            <motion.tr
              key={item.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4 font-mono font-semibold text-blue-700">{item.codigo}</td>
              <td className="py-2 px-4 max-w-[200px] truncate">{item.descripcion}</td>
              <td className="py-2 px-4">{item.porcentaje}%</td>
              <td className="py-2 px-4 text-sm">{formatDate(item.fechaInicio)}</td>
              <td className="py-2 px-4 text-sm">{item.fechaFin ? formatDate(item.fechaFin) : <span className="text-gray-400">Sin venc.</span>}</td>
              <td className="py-2 px-4">{item.usoMaximo}</td>
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

      <DescuentoCodigoModal
        open={modalOpen} onClose={closeModal}
        onSubmit={handleSave} descuento={editItem} submitting={submitting}
      />
    </div>
  );
}

// ── utilidades compartidas ────────────────────────────────────────────────────

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
