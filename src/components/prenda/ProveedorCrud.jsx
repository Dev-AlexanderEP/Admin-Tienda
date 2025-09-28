import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api/v1";

function ProveedorFormModal({ open, onClose, onSubmit, proveedor }) {
  const [form, setForm] = useState({
    nomProveedor: "",
  });

  useEffect(() => {
    if (proveedor) {
      setForm({
        nomProveedor: proveedor.nomProveedor ?? "",
      });
    } else {
      setForm({
        nomProveedor: "",
      });
    }
  }, [proveedor, open]);

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
              <Store className="h-6 w-6" /> {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm flex items-center gap-2">
                  <Store className="h-4 w-4" /> Nombre del Proveedor
                </label>
                <input
                  type="text"
                  required
                  name="nomProveedor"
                  value={form.nomProveedor}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Ej: Pradas"
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

export default function ProveedorCrud() {
  const [proveedores, setProveedores] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProveedor, setEditProveedor] = useState(null);

  // Animaciones para tabla
  const tableVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Fetch paginado
  const fetchProveedores = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/proveedores/paginado`, {
        params: { page, size: 10 },
      });
      if (data.object && Array.isArray(data.object.content)) {
        setProveedores(data.object.content);
        setTotalPages(data.object.totalPages || 1);
        setPage(data.object.page || 0);
      } else {
        setProveedores([]);
        setTotalPages(1);
        setPage(0);
      }
    } catch (e) {
      setProveedores([]);
      setTotalPages(1);
      setPage(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProveedores(page);
    // eslint-disable-next-line
  }, [page]);

  const handleSave = async (form) => {
    try {
      if (editProveedor) {
        // PUT para actualizar
        await axios.put(`${API}/proveedor/${editProveedor.id}`, form);
      } else {
        // POST para crear
        await axios.post(`${API}/proveedor`, form);
      }
      setModalOpen(false);
      setEditProveedor(null);
      fetchProveedores(page);
    } catch (e) {
      alert("Error guardando proveedor");
    }
  };

  const handleDelete = async (proveedor) => {
    if (window.confirm(`¿Eliminar proveedor "${proveedor.nomProveedor}"?`)) {
      try {
        await axios.delete(`${API}/proveedor/${proveedor.id}`);
        fetchProveedores(page);
      } catch (e) {
        alert("Error eliminando proveedor");
      }
    }
  };

  // Sin inputs de filtro, solo muestra paginado real del backend
  const sortedProveedores = [...proveedores].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Store className="h-6 w-6" /> Proveedores
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditProveedor(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Store className="h-5 w-5" /> Nuevo proveedor
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page + "-" + sortedProveedores.length}
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
                <th className="py-2 px-4 text-left">Nombre del Proveedor</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : sortedProveedores.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    Sin proveedores
                  </td>
                </tr>
              ) : (
                sortedProveedores.map((p) => (
                  <motion.tr
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="py-2 px-4">{p.id}</td>
                    <td className="py-2 px-4">{p.nomProveedor}</td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.10 }}
                        whileTap={{ scale: 0.95 }}
                        title="Editar"
                        className="p-2 rounded hover:bg-blue-100 text-blue-700"
                        onClick={() => {
                          setEditProveedor(p);
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
                        onClick={() => handleDelete(p)}
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
      <ProveedorFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProveedor(null);
        }}
        onSubmit={handleSave}
        proveedor={editProveedor}
      />
    </div>
  );
}