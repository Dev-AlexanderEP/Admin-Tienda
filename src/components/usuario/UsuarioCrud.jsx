import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  UserPlus,
  User,
  Mail,
  KeyRound,
  Shield,
  Check,
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api/v1";

function UsuarioFormModal({ open, onClose, onSubmit, usuario }) {
  const [form, setForm] = useState({
    nombreUsuario: "",
    email: "",
    contrasenia: "",
    rol: "USER",
    activo: true,
  });

  useEffect(() => {
    if (usuario) {
      setForm({
        nombreUsuario: usuario.nombreUsuario ?? "",
        email: usuario.email ?? "",
        contrasenia: "",
        rol: usuario.rol ?? "USER",
        activo:
          typeof usuario.activo === "boolean" ? usuario.activo : true,
      });
    } else {
      setForm({
        nombreUsuario: "",
        email: "",
        contrasenia: "",
        rol: "USER",
        activo: true,
      });
    }
  }, [usuario, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
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
              onClick={onClose}aa
            >
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="h-6 w-6" /> {usuario ? "Editar usuario" : "Crear usuario"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" /> Nombre de usuario
                </label>
                <input
                  type="text"
                  required
                  name="nombreUsuario"
                  value={form.nombreUsuario}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="text-sm flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Contraseña
                </label>
                <input
                  type="password"
                  name="contrasenia"
                  value={form.contrasenia}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder={usuario ? "Dejar en blanco para no cambiar" : ""}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Rol
                </label>
                <select
                  name="rol"
                  value={form.rol || "USER"}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleChange}
                  className="accent-blue-500"
                />
                <span className="text-sm">Activo</span>
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

export default function UsuarioCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUsuario, setEditUsuario] = useState(null);

  // Buscadores
  const [searchId, setSearchId] = useState("");
  const [searchNombre, setSearchNombre] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Si algún campo tiene valor, los otros deben estar deshabilitados
  const isAnySearchActive =
    searchId.length > 0 || searchNombre.length > 0 || searchEmail.length > 0;

  // Framer Motion variants para la tabla de usuarios (animación al cambiar de página)
  const tableVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Buscar usuarios con API personalizada
  const buscarUsuarios = async () => {
  setLoading(true);
  try {
    const params = {};
    if (searchId) params.id = searchId;
    if (searchNombre) params.nombreUsuario = searchNombre;
    if (searchEmail) params.email = searchEmail;

    const { data } = await axios.get(`${API}/usuarios`, { params });

    // El array viene en data.object
    if (Array.isArray(data.object)) {
      setUsuarios(data.object);
      setTotalPages(1);
      setPage(0);
    } else {
      setUsuarios([]);
      setTotalPages(1);
      setPage(0);
    }
  } catch (e) {
    setUsuarios([]);
    setTotalPages(1);
    setPage(0);
  }
  setLoading(false);
};

  // Fetch paginado normal
  const fetchUsuarios = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/usuarios`);
      setUsuarios(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (e) {
      alert("Error cargando usuarios");
    }
    setLoading(false);
  };

  // Si hay búsqueda, no paginar; si no hay, sí.
  useEffect(() => {
    if (!isAnySearchActive) {
      fetchUsuarios(page);
    }
    // eslint-disable-next-line
  }, [page]);

  // Cuando los campos de búsqueda cambian, resetea la tabla y busca
  useEffect(() => {
    if (isAnySearchActive) {
      buscarUsuarios();
    } else {
      fetchUsuarios(0);
    }
    // eslint-disable-next-line
  }, [searchId, searchNombre, searchEmail]);

  const handleSave = async (form) => {
    try {
      if (editUsuario) {
        // PUT para actualizar
        const payload = {
          nombreUsuario: form.nombreUsuario,
          email: form.email,
          rol: form.rol,
          activo: form.activo,
        };
        await axios.put(`${API}/usuario/${editUsuario.id}`, payload);
      } else {
        // POST para crear
        const payload = {
          nombreUsuario: form.nombreUsuario,
          email: form.email,
          contrasenia: form.contrasenia,
          rol: form.rol,
          activo: form.activo,
        };
        await axios.post(`${API}/usuario`, payload);
      }
      setModalOpen(false);
      setEditUsuario(null);
      if (isAnySearchActive) {
        buscarUsuarios();
      } else {
        fetchUsuarios(page);
      }
    } catch (e) {
      alert("Error guardando usuario");
    }
  };

  const handleDelete = async (usuario) => {
    if (window.confirm(`¿Eliminar usuario ${usuario.nombreUsuario}?`)) {
      try {
        await axios.delete(`${API}/usuario/${usuario.id}`);
        if (isAnySearchActive) {
          buscarUsuarios();
        } else {
          fetchUsuarios(page);
        }
      } catch (e) {
        alert("Error eliminando usuario");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-6 w-6" /> Usuarios
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditUsuario(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <UserPlus className="h-5 w-5" /> Nuevo usuario
        </motion.button>
      </div>

      {/* Buscadores */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Buscar por ID</label>
          <input
            type="number"
            min="1"
            value={searchId}
            onChange={e => {
              setSearchId(e.target.value);
              if (e.target.value) {
                setSearchNombre("");
                setSearchEmail("");
              }
            }}
            disabled={searchNombre.length > 0 || searchEmail.length > 0}
            placeholder="ID"
            className="border rounded px-2 py-1 w-32"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Buscar por Nombre</label>
          <input
            type="text"
            value={searchNombre}
            onChange={e => {
              setSearchNombre(e.target.value);
              if (e.target.value) {
                setSearchId("");
                setSearchEmail("");
              }
            }}
            disabled={searchId.length > 0 || searchEmail.length > 0}
            placeholder="Nombre"
            className="border rounded px-2 py-1 w-40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Buscar por Email</label>
          <input
            type="email"
            value={searchEmail}
            onChange={e => {
              setSearchEmail(e.target.value);
              if (e.target.value) {
                setSearchId("");
                setSearchNombre("");
              }
            }}
            disabled={searchId.length > 0 || searchNombre.length > 0}
            placeholder="Email"
            className="border rounded px-2 py-1 w-52"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={buscarUsuarios}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          disabled={!isAnySearchActive}
        >
          <Search className="h-4 w-4" /> Buscar
        </motion.button>
        <button
          onClick={() => {
            setSearchId("");
            setSearchNombre("");
            setSearchEmail("");
          }}
          className="ml-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-500"
          disabled={!isAnySearchActive}
        >
          Limpiar
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page + "-" + usuarios.length}
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
                <th className="py-2 px-4 text-left">Usuario</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Rol</th>
                <th className="py-2 px-4 text-left">Activo</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center">
                    Sin usuarios
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <motion.tr
                    key={u.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="py-2 px-4">{u.id}</td>
                    <td className="py-2 px-4">{u.nombreUsuario}</td>
                    <td className="py-2 px-4">{u.email}</td>
                    <td className="py-2 px-4">{u.rol ?? <span className="italic text-gray-400">Sin rol</span>}</td>
                    <td className="py-2 px-4">
                      {u.activo === true ? (
                        <span className="text-green-600 font-semibold">Sí</span>
                      ) : (
                        <span className="text-red-500 font-semibold">No</span>
                      )}
                    </td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.10 }}
                        whileTap={{ scale: 0.95 }}
                        title="Editar"
                        className="p-2 rounded hover:bg-blue-100 text-blue-700"
                        onClick={() => {
                          setEditUsuario(u);
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
                        onClick={() => handleDelete(u)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
          {/* Paginación solo si no hay búsqueda */}
          {!isAnySearchActive && (
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
          )}
        </motion.div>
      </AnimatePresence>
      <UsuarioFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditUsuario(null);
        }}
        onSubmit={handleSave}
        usuario={editUsuario}
      />
    </div>
  );
}