import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, User, Check, X, Search, MapPin, Phone, UserCircle2, AlignJustify, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api/v1";

function DireccionFormModal({ open, onClose, onSubmit, direccion }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    usuarioId: "",
    dni: "",
    departamento: "",
    provincia: "",
    distrito: "",
    calle: "",
    detalle: "",
    telefono: ""
  });

  useEffect(() => {
    if (direccion) {
      setForm({
        nombres: direccion.nombres ?? "",
        apellidos: direccion.apellidos ?? "",
        usuarioId: direccion.usuarioId ?? "",
        dni: direccion.dni ?? "",
        departamento: direccion.departamento ?? "",
        provincia: direccion.provincia ?? "",
        distrito: direccion.distrito ?? "",
        calle: direccion.calle ?? "",
        detalle: direccion.detalle ?? "",
        telefono: direccion.telefono ?? ""
      });
    } else {
      setForm({
        nombres: "",
        apellidos: "",
        usuarioId: "",
        dni: "",
        departamento: "",
        provincia: "",
        distrito: "",
        calle: "",
        detalle: "",
        telefono: ""
      });
    }
  }, [direccion, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value
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
              <MapPin className="h-6 w-6" /> {direccion ? "Editar dirección" : "Nueva dirección"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4" /> Nombres
                  </label>
                  <input
                    type="text"
                    required
                    name="nombres"
                    value={form.nombres}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" /> Apellidos
                  </label>
                  <input
                    type="text"
                    required
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" /> Usuario ID
                  </label>
                  <input
                    type="number"
                    required
                    name="usuarioId"
                    value={form.usuarioId}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" /> DNI
                  </label>
                  <input
                    type="text"
                    required
                    name="dni"
                    value={form.dni}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <AlignJustify className="h-4 w-4" /> Departamento
                  </label>
                  <input
                    type="text"
                    required
                    name="departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <AlignJustify className="h-4 w-4" /> Provincia
                  </label>
                  <input
                    type="text"
                    required
                    name="provincia"
                    value={form.provincia}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm flex items-center gap-2">
                    <AlignJustify className="h-4 w-4" /> Distrito
                  </label>
                  <input
                    type="text"
                    required
                    name="distrito"
                    value={form.distrito}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Calle
                </label>
                <input
                  type="text"
                  required
                  name="calle"
                  value={form.calle}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="text-sm flex items-center gap-2">
                  <AlignJustify className="h-4 w-4" /> Detalle
                </label>
                <input
                  type="text"
                  required
                  name="detalle"
                  value={form.detalle}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Casa, referencia, etc."
                />
              </div>
              <div>
                <label className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Teléfono
                </label>
                <input
                  type="text"
                  required
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Número de contacto"
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

export default function DireccionCrud() {
  const [direcciones, setDirecciones] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDireccion, setEditDireccion] = useState(null);

  // Filtros simples: buscar por nombres, apellidos, usuarioId o telefono
  const [search, setSearch] = useState("");

  // Animaciones para tabla
  const tableVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Fetch paginado
  const fetchDirecciones = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/direcciones/paginado`, {
        params: { page, size: 10 },
        });
      if (data.object && Array.isArray(data.object.content)) {
        console.log("Respuesta API:", data);
        setDirecciones(data.object.content);
        setTotalPages(data.object.totalPages || 1);
        setPage(data.object.page || 0);
      } else {
        setDirecciones([]);
        setTotalPages(1);
        setPage(0);
      }
    } catch (e) {
      setDirecciones([]);
      setTotalPages(1);
      setPage(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDirecciones(page);
    // eslint-disable-next-line
  }, [page]);

  const handleSave = async (form) => {
    try {
      if (editDireccion) {
        // PUT para actualizar
        await axios.put(`${API}/direccion/${editDireccion.id}`, form);
      } else {
        // POST para crear
        await axios.post(`${API}/direccion`, form);
      }
      setModalOpen(false);
      setEditDireccion(null);
      fetchDirecciones(page);
    } catch (e) {
      alert("Error guardando dirección");
    }
  };

  const handleDelete = async (direccion) => {
    if (window.confirm(`¿Eliminar dirección de ${direccion.nombres} ${direccion.apellidos}?`)) {
      try {
        await axios.delete(`${API}/direccion/${direccion.id}`);
        fetchDirecciones(page);
      } catch (e) {
        alert("Error eliminando dirección");
      }
    }
  };

  // Filtrado simple en frontend sobre lo ya cargado (no consulta al backend)
  const filteredDirecciones = direcciones
    .filter((d) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        (d.nombres && d.nombres.toLowerCase().includes(lower)) ||
        (d.apellidos && d.apellidos.toLowerCase().includes(lower)) ||
        (d.usuarioId && String(d.usuarioId).includes(lower)) ||
        (d.telefono && d.telefono.toLowerCase().includes(lower)) ||
        (d.dni && d.dni.toLowerCase().includes(lower))
      );
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="h-6 w-6" /> Direcciones
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditDireccion(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <MapPin className="h-5 w-5" /> Nueva dirección
        </motion.button>
      </div>

      {/* Buscador simple */}
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <div>
          <label className="text-xs font-semibold block mb-1">Buscar</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nombres, apellidos, usuarioId, teléfono, DNI..."
            className="border rounded px-2 py-1 w-60"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded"
          disabled
        >
          <Search className="h-4 w-4" /> Buscar
        </motion.button>
        <button
          onClick={() => setSearch("")}
          className="ml-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-500"
          disabled={!search}
        >
          Limpiar
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page + "-" + filteredDirecciones.length}
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
                <th className="py-2 px-4 text-left">Nombres</th>
                <th className="py-2 px-4 text-left">Apellidos</th>
                <th className="py-2 px-4 text-left">Usuario ID</th>
                <th className="py-2 px-4 text-left">DNI</th>
                <th className="py-2 px-4 text-left">Departamento</th>
                <th className="py-2 px-4 text-left">Provincia</th>
                <th className="py-2 px-4 text-left">Distrito</th>
                <th className="py-2 px-4 text-left">Calle</th>
                <th className="py-2 px-4 text-left">Detalle</th>
                <th className="py-2 px-4 text-left">Teléfono</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : filteredDirecciones.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-6 text-center">
                    Sin direcciones
                  </td>
                </tr>
              ) : (
                filteredDirecciones.map((d) => (
                  <motion.tr
                    key={d.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="py-2 px-4">{d.id}</td>
                    <td className="py-2 px-4">{d.nombres}</td>
                    <td className="py-2 px-4">{d.apellidos}</td>
                    <td className="py-2 px-4">{d.usuarioId}</td>
                    <td className="py-2 px-4">{d.dni}</td>
                    <td className="py-2 px-4">{d.departamento}</td>
                    <td className="py-2 px-4">{d.provincia}</td>
                    <td className="py-2 px-4">{d.distrito}</td>
                    <td className="py-2 px-4">{d.calle}</td>
                    <td className="py-2 px-4">{d.detalle}</td>
                    <td className="py-2 px-4">{d.telefono}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.10 }}
                        whileTap={{ scale: 0.95 }}
                        title="Editar"
                        className="p-2 rounded hover:bg-blue-100 text-blue-700"
                        onClick={() => {
                          setEditDireccion(d);
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
                        onClick={() => handleDelete(d)}
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
      <DireccionFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditDireccion(null);
        }}
        onSubmit={handleSave}
        direccion={editDireccion}
      />
    </div>
  );
}