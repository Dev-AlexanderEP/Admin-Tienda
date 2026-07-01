import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Check, X, Truck, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../components/Table";
import { getEnviosPaginado, createEnvio, updateEnvio, deleteEnvio } from "./api/envio";

// ── helpers ──────────────────────────────────────────────────────────────────

const ESTADOS = ["PENDIENTE", "EN_TRANSITO", "ENTREGADO", "CANCELADO"];

const ESTADO_COLORS = {
  PENDIENTE:   "bg-yellow-100 text-yellow-700",
  EN_TRANSITO: "bg-blue-100 text-blue-700",
  ENTREGADO:   "bg-green-100 text-green-700",
  CANCELADO:   "bg-red-100 text-red-700",
};

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

const toDateInput = (v) => (v ? v.split("T")[0] : "");

const EMPTY = {
  ventaId:       "",
  datosEnvioId:  "",
  costoEnvio:    "0",
  fechaEnvio:    "",
  fechaEntrega:  "",
  estado:        "PENDIENTE",
  metodoEnvio:   "",
  trackingNumber: "",
};

const validate = (f) => {
  const e = {};
  if (!f.ventaId || Number(f.ventaId) < 1)         e.ventaId       = "ID de venta requerido";
  if (!f.datosEnvioId || Number(f.datosEnvioId) < 1) e.datosEnvioId = "ID de datos de envío requerido";
  if (f.costoEnvio === "" || Number(f.costoEnvio) < 0) e.costoEnvio  = "Costo debe ser ≥ 0";
  if (!f.fechaEnvio)                                e.fechaEnvio    = "Requerido";
  if (!f.fechaEntrega)                              e.fechaEntrega  = "Requerido";
  if (f.fechaEntrega && f.fechaEntrega < f.fechaEnvio) e.fechaEntrega = "Debe ser posterior a fecha de envío";
  if (!f.estado)                                    e.estado        = "Requerido";
  if (!f.metodoEnvio.trim())                        e.metodoEnvio   = "Requerido";
  if (!f.trackingNumber.trim())                     e.trackingNumber = "Requerido";
  return e;
};

// ── Modal ────────────────────────────────────────────────────────────────────

function EnvioModal({ open, onClose, onSubmit, envio, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        envio
          ? {
              ventaId:        envio.ventaId ?? "",
              datosEnvioId:   envio.datosEnvioId ?? "",
              costoEnvio:     envio.costoEnvio ?? "0",
              fechaEnvio:     toDateInput(envio.fechaEnvio),
              fechaEntrega:   toDateInput(envio.fechaEntrega),
              estado:         envio.estado ?? "PENDIENTE",
              metodoEnvio:    envio.metodoEnvio ?? "",
              trackingNumber: envio.trackingNumber ?? "",
            }
          : EMPTY
      );
    }
  }, [open, envio]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      ventaId:        Number(form.ventaId),
      datosEnvioId:   Number(form.datosEnvioId),
      costoEnvio:     Number(form.costoEnvio),
      fechaEnvio:     form.fechaEnvio,
      fechaEntrega:   form.fechaEntrega,
      estado:         form.estado,
      metodoEnvio:    form.metodoEnvio.trim(),
      trackingNumber: form.trackingNumber.trim(),
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
              <Truck className="h-5 w-5" /> {envio ? "Editar Envío" : "Nuevo Envío"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="ID de Venta" error={errors.ventaId} required>
                  <input type="number" min="1" value={form.ventaId} onChange={set("ventaId")}
                    placeholder="ID de la venta" className={inp(errors.ventaId)} disabled={submitting} />
                </Field>
                <Field label="ID Datos de Envío" error={errors.datosEnvioId} required>
                  <input type="number" min="1" value={form.datosEnvioId} onChange={set("datosEnvioId")}
                    placeholder="ID dirección de envío" className={inp(errors.datosEnvioId)} disabled={submitting} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Costo de Envío" error={errors.costoEnvio} required>
                  <input type="number" step="0.01" min="0" value={form.costoEnvio} onChange={set("costoEnvio")}
                    placeholder="0.00" className={inp(errors.costoEnvio)} disabled={submitting} />
                </Field>
                <Field label="Estado" error={errors.estado} required>
                  <select value={form.estado} onChange={set("estado")} className={inp(errors.estado)} disabled={submitting}>
                    {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Fecha Envío" error={errors.fechaEnvio} required>
                  <input type="date" value={form.fechaEnvio} onChange={set("fechaEnvio")}
                    className={inp(errors.fechaEnvio)} disabled={submitting} />
                </Field>
                <Field label="Fecha Entrega" error={errors.fechaEntrega} required>
                  <input type="date" value={form.fechaEntrega} onChange={set("fechaEntrega")}
                    className={inp(errors.fechaEntrega)} disabled={submitting} />
                </Field>
              </div>

              <Field label="Método de Envío" error={errors.metodoEnvio} required>
                <input value={form.metodoEnvio} onChange={set("metodoEnvio")}
                  placeholder="Ej: Delivery, Recojo en tienda..." className={inp(errors.metodoEnvio)} disabled={submitting} />
              </Field>

              <Field label="Tracking Number" error={errors.trackingNumber} required>
                <input value={form.trackingNumber} onChange={set("trackingNumber")}
                  placeholder="Ej: TRK-00123" className={inp(errors.trackingNumber)} disabled={submitting} />
              </Field>

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

export default function EnvioCrud() {
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
      const { data } = await getEnviosPaginado(currentPage + 1, PAGE_SIZE);
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
        await updateEnvio(editItem.id, form);
      } else {
        await createEnvio(form);
      }
      closeModal();
      fetchData(page);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) alert("La venta ya tiene un envío registrado.");
      else if (status === 403) alert("No tienes acceso a esta venta.");
      else alert(e?.response?.data?.message ?? "Error guardando envío");
    }
    setSubmitting(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar el envío #${item.id} (Venta #${item.ventaId})?`)) return;
    try {
      await deleteEnvio(item.id);
      fetchData(page);
    } catch {
      alert("Error eliminando envío");
    }
  };

  const sorted = [...items].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Truck className="h-6 w-6" /> Envíos
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Plus className="h-5 w-5" /> Nuevo envío
        </motion.button>
      </div>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Venta", "Estado", "Método", "Tracking", "F. Envío", "F. Entrega", "Costo", "Acciones"]} />
        <Table.Body loading={loading} colSpan={9} empty={sorted.length === 0} emptyText="Sin envíos">
          {sorted.map((item) => (
            <motion.tr
              key={item.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">#{item.ventaId}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_COLORS[item.estado] ?? "bg-gray-100 text-gray-600"}`}>
                  {item.estado}
                </span>
              </td>
              <td className="py-2 px-4 text-sm">{item.metodoEnvio}</td>
              <td className="py-2 px-4 font-mono text-sm">{item.trackingNumber}</td>
              <td className="py-2 px-4 text-sm">{formatDate(item.fechaEnvio)}</td>
              <td className="py-2 px-4 text-sm">{formatDate(item.fechaEntrega)}</td>
              <td className="py-2 px-4 text-sm">S/ {Number(item.costoEnvio ?? 0).toFixed(2)}</td>
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

      <EnvioModal
        open={modalOpen} onClose={closeModal}
        onSubmit={handleSave} envio={editItem} submitting={submitting}
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

function inp(error) {
  return `w-full border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
    error ? "border-red-400" : "border-gray-300"
  }`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d + (d.includes("T") ? "" : "T00:00:00")).toLocaleDateString("es-PE");
}
