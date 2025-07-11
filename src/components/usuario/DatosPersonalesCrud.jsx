import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  User,
  Check,
  X,
  MapPin,
  Phone,
  UserCircle2,
  AlignJustify,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1";

function DatosPersonalesFormModal({ open, onClose, onSubmit, datos }) {
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
    telefono: "",
  });

  useEffect(() => {
    if (datos) {
      setForm({
        nombres: datos.nombres ?? "",
        apellidos: datos.apellidos ?? "",
        usuarioId: datos.usuarioId ?? "",
        dni: datos.dni ?? "",
        departamento: datos.departamento ?? "",
        provincia: datos.provincia ?? "",
        distrito: datos.distrito ?? "",
        calle: datos.calle ?? "",
        detalle: datos.detalle ?? "",
        telefono: datos.telefono ?? "",
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
        telefono: "",
      });
    }
  }, [datos, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
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
              <User className="h-6 w-6" /> {datos ? "Editar Datos Personales" : "Nuevo Dato Personal"}
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

export default function DatosPersonalesCrud() {
  const [datosList, setDatosList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDatos, setEditDatos] = useState(null);

  // Animaciones para tabla
  const tableVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Fetch paginado
  const fetchDatos = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/datos-personales/paginado`, {
        params: { page, size: 10 },
      });
      if (data.object && Array.isArray(data.object.content)) {
        setDatosList(data.object.content);
        setTotalPages(data.object.totalPages || 1);
        setPage(data.object.page || 0);
      } else {
        setDatosList([]);
        setTotalPages(1);
        setPage(0);
      }
    } catch (e) {
      setDatosList([]);
      setTotalPages(1);
      setPage(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatos(page);
    // eslint-disable-next-line
  }, [page]);

  const handleSave = async (form) => {
    try {
      if (editDatos) {
        // PUT para actualizar
        await axios.put(`${API}/dato-personal/${editDatos.id}`, form);
      } else {
        // POST para crear
        await axios.post(`${API}/dato-personal`, form);
      }
      setModalOpen(false);
      setEditDatos(null);
      fetchDatos(page);
    } catch (e) {
      alert("Error guardando datos personales");
    }
  };

  const handleDelete = async (dato) => {
    if (window.confirm(`¿Eliminar datos personales de ${dato.nombres} ${dato.apellidos}?`)) {
      try {
        await axios.delete(`${API}/dato-personal/${dato.id}`);
        fetchDatos(page);
      } catch (e) {
        alert("Error eliminando datos personales");
      }
    }
  };

  // Sin inputs de filtro, solo muestra paginado real del backend
  const sortedDatos = [...datosList].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-6 w-6" /> Datos Personales
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditDatos(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <User className="h-5 w-5" /> Nuevo dato personal
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page + "-" + sortedDatos.length}
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
              ) : sortedDatos.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-6 text-center">
                    Sin datos personales
                  </td>
                </tr>
              ) : (
                sortedDatos.map((d) => (
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
                          setEditDatos(d);
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
      <DatosPersonalesFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditDatos(null);
        }}
        onSubmit={handleSave}
        datos={editDatos}
      />
    </div>
  );
}