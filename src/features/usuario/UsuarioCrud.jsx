import React, { useEffect, useState } from "react";
import {
  Pencil, Trash2, UserPlus, User, Mail, KeyRound,
  Shield, Check, X, Search, ToggleRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "../../components/Table";
import { getUsuariosPaginado, createUsuario, updateUsuario, deleteUsuario } from "./api/usuarios";

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = (form, isEdit) => {
  const e = {};
  if (!form.nombreUsuario.trim()) e.nombreUsuario = "Requerido";
  else if (form.nombreUsuario.trim().length < 3) e.nombreUsuario = "Mínimo 3 caracteres";
  if (!form.email.trim()) e.email = "Requerido";
  else if (!EMAIL_RE.test(form.email.trim())) e.email = "Formato de email inválido";
  if (!isEdit && !form.contrasenia) e.contrasenia = "Requerida";
  return e;
};

// ── Modal ────────────────────────────────────────────────────────────────────

const EMPTY_CREATE = { nombreUsuario: "", email: "", contrasenia: "", rol: "CLIENTE", activo: true };
const EMPTY_EDIT   = { nombreUsuario: "", email: "", nuevaContrasenia: "", rol: "CLIENTE", activo: true };

function UsuarioFormModal({ open, onClose, onSubmit, usuario, submitting }) {
  const isEdit = !!usuario;
  const [form, setForm]     = useState(EMPTY_CREATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (usuario) {
        setForm({
          nombreUsuario:   usuario.nombreUsuario ?? "",
          email:           usuario.email ?? "",
          nuevaContrasenia: "",
          rol:             usuario.rol ?? "CLIENTE",
          activo:          usuario.activo ?? true,
        });
      } else {
        setForm(EMPTY_CREATE);
      }
    }
  }, [open, usuario]);

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm(form, isEdit);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (isEdit) {
      const body = {
        nombreUsuario: form.nombreUsuario.trim(),
        email:         form.email.trim(),
        rol:           form.rol,
        activo:        form.activo,
      };
      if (form.nuevaContrasenia?.trim()) body.nuevaContrasenia = form.nuevaContrasenia.trim();
      onSubmit(body);
    } else {
      onSubmit({
        nombreUsuario: form.nombreUsuario.trim(),
        email:         form.email.trim(),
        contrasenia:   form.contrasenia,
        rol:           form.rol,
        activo:        form.activo,
      });
    }
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
              <UserPlus className="h-5 w-5" /> {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nombre de usuario" error={errors.nombreUsuario} required>
                <div className="relative">
                  <User className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                  <input
                    value={form.nombreUsuario} onChange={set("nombreUsuario")}
                    placeholder="Ej: alexander"
                    className={inp(errors.nombreUsuario) + " pl-8"}
                    disabled={submitting}
                  />
                </div>
              </Field>

              <Field label="Email" error={errors.email} required>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="email" value={form.email} onChange={set("email")}
                    placeholder="usuario@gmail.com"
                    className={inp(errors.email) + " pl-8"}
                    disabled={submitting}
                  />
                </div>
              </Field>

              <Field
                label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
                error={errors.contrasenia ?? errors.nuevaContrasenia}
                required={!isEdit}
              >
                <div className="relative">
                  <KeyRound className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={isEdit ? form.nuevaContrasenia : form.contrasenia}
                    onChange={set(isEdit ? "nuevaContrasenia" : "contrasenia")}
                    placeholder={isEdit ? "Dejar vacío para no cambiar" : "Contraseña segura"}
                    autoComplete="new-password"
                    className={inp((errors.contrasenia ?? errors.nuevaContrasenia)) + " pl-8"}
                    disabled={submitting}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Rol" error={errors.rol}>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                    <select value={form.rol} onChange={set("rol")} className={inp(errors.rol) + " pl-8"} disabled={submitting}>
                      <option value="CLIENTE">CLIENTE</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </Field>

                <Field label="Estado">
                  <label className="flex items-center gap-2 h-[34px] cursor-pointer select-none text-sm">
                    <input type="checkbox" checked={form.activo} onChange={set("activo")} disabled={submitting} />
                    <span>{form.activo ? "Activo" : "Inactivo"}</span>
                  </label>
                </Field>
              </div>

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
const FILTROS_EMPTY = { nombre: "", email: "", rol: "", activo: "" };

export default function UsuarioCrud() {
  const [usuarios, setUsuarios]     = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editUsuario, setEditUsuario] = useState(null);

  // filtros en borrador (lo que el usuario escribe)
  const [draft, setDraft]       = useState(FILTROS_EMPTY);
  // filtros aplicados (lo que se envía a la API)
  const [applied, setApplied]   = useState(FILTROS_EMPTY);

  const fetchData = async (currentPage = 0, filters = applied) => {
    setLoading(true);
    try {
      const { data } = await getUsuariosPaginado(currentPage + 1, PAGE_SIZE, filters);
      const { items, totalPages: tp } = parsePaginated(data);
      setUsuarios(items);
      setTotalPages(tp);
    } catch {
      setUsuarios([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(page, applied); }, [page]); // eslint-disable-line

  const handleBuscar = (e) => {
    e.preventDefault();
    setApplied(draft);
    setPage(0);
    fetchData(0, draft);
  };

  const handleLimpiar = () => {
    setDraft(FILTROS_EMPTY);
    setApplied(FILTROS_EMPTY);
    setPage(0);
    fetchData(0, FILTROS_EMPTY);
  };

  const setD = (field) => (e) => setDraft((f) => ({ ...f, [field]: e.target.value }));

  const openCreate = () => { setEditUsuario(null); setModalOpen(true); };
  const openEdit   = (u) => { setEditUsuario(u); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditUsuario(null); };

  const handleSave = async (body) => {
    setSubmitting(true);
    try {
      if (editUsuario) {
        await updateUsuario(editUsuario.id, body);
      } else {
        await createUsuario(body);
      }
      closeModal();
      fetchData(page, applied);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 409) alert(e?.response?.data?.message ?? "El usuario o email ya existe.");
      else if (status === 400) alert(e?.response?.data?.message ?? "Datos inválidos.");
      else alert("Error guardando usuario");
    }
    setSubmitting(false);
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`¿Eliminar al usuario "${u.nombreUsuario}"?`)) return;
    try {
      await deleteUsuario(u.id);
      fetchData(page, applied);
    } catch {
      alert("Error eliminando usuario");
    }
  };

  const hayFiltros = Object.values(applied).some((v) => v !== "");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-6 w-6" /> Usuarios
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <UserPlus className="h-5 w-5" /> Nuevo usuario
        </motion.button>
      </div>

      {/* Filtros */}
      <form onSubmit={handleBuscar} className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Nombre</label>
          <input value={draft.nombre} onChange={setD("nombre")}
            placeholder="Buscar por nombre..."
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
          <input value={draft.email} onChange={setD("email")}
            placeholder="Buscar por email..."
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Rol</label>
          <select value={draft.rol} onChange={setD("rol")}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Todos</option>
            <option value="CLIENTE">CLIENTE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Estado</label>
          <select value={draft.activo} onChange={setD("activo")}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
          <Search className="h-4 w-4" /> Buscar
        </motion.button>
        {hayFiltros && (
          <button type="button" onClick={handleLimpiar}
            className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm">
            Limpiar
          </button>
        )}
      </form>

      <Table animKey={page + "-" + usuarios.length}>
        <Table.Header columns={["ID", "Usuario", "Email", "Rol", "Activo", "Creado", "Acciones"]} />
        <Table.Body loading={loading} colSpan={7} empty={usuarios.length === 0} emptyText="Sin usuarios">
          {usuarios.map((u) => (
            <motion.tr
              key={u.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{u.id}</td>
              <td className="py-2 px-4 font-medium">{u.nombreUsuario}</td>
              <td className="py-2 px-4 text-sm">{u.email}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  u.rol === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {u.rol ?? "—"}
                </span>
              </td>
              <td className="py-2 px-4">
                <span className={`flex items-center gap-1 text-sm ${u.activo ? "text-green-600" : "text-gray-400"}`}>
                  <ToggleRight className="h-4 w-4" /> {u.activo ? "Sí" : "No"}
                </span>
              </td>
              <td className="py-2 px-4 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
              <td className="py-2 px-4 flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-blue-100 text-blue-700" onClick={() => openEdit(u)} title="Editar">
                  <Pencil className="h-4 w-4" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-red-100 text-red-700" onClick={() => handleDelete(u)} title="Eliminar">
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

      <UsuarioFormModal
        open={modalOpen} onClose={closeModal}
        onSubmit={handleSave} usuario={editUsuario} submitting={submitting}
      />
    </div>
  );
}

// ── utilidades ────────────────────────────────────────────────────────────────

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
  return new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
