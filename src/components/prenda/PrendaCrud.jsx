import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Shirt,
  Eye,
  Layers,
  DollarSign,
  ToggleRight,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TallasModal from "../Modal/TallasModal";
import PrendaFormModal from "../Modal/PrendaFormModal";
import ImagenesModal from "../Modal/ImagenesModal";
import PrendaUpdateFormModal from "../Modal/PrendaUpdateFormModal"; // Nuevo componente para editar

const API = "http://localhost:8080/api/v1";
const IMG_BASE = "http://localhost:8080/";

export default function PrendaCrud() {
  const [prendas, setPrendas] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Para modal imágenes y tallas
  const [imagenesModal, setImagenesModal] = useState({ open: false, imagen: null });
  const [tallasModal, setTallasModal] = useState({ open: false, tallas: null });

  // Modal de formulario (crear)
  const [modalOpen, setModalOpen] = useState(false);

  // Modal de edición
  const [editModal, setEditModal] = useState({ open: false, prenda: null });

  // Select options
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  // Animaciones para tabla
  const tableVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Cargar selects
  const fetchSelects = async () => {
    try {
      const [
        { data: dataMarcas },
        { data: dataCategorias },
        { data: dataProveedores },
      ] = await Promise.all([
        axios.get(`${API}/marcas`),
        axios.get(`${API}/categorias`),
        axios.get(`${API}/proveedores`),
      ]);
      setMarcas(Array.isArray(dataMarcas.object) ? dataMarcas.object : []);
      setCategorias(Array.isArray(dataCategorias.object) ? dataCategorias.object : []);
      setProveedores(Array.isArray(dataProveedores.object) ? dataProveedores.object : []);
    } catch (e) {
      setMarcas([]);
      setCategorias([]);
      setProveedores([]);
    }
  };

  // Fetch paginado
  const fetchPrendas = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/prendas/paginado`, {
        params: { page, size: 10 },
      });
      if (data.object && Array.isArray(data.object.content)) {
        setPrendas(data.object.content);
        setTotalPages(data.object.totalPages || 1);
        setPage(data.object.page || 0);
      } else {
        setPrendas([]);
        setTotalPages(1);
        setPage(0);
      }
    } catch (e) {
      setPrendas([]);
      setTotalPages(1);
      setPage(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrendas(page);
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (modalOpen || editModal.open) {
      fetchSelects();
    }
  }, [modalOpen, editModal.open]);

  // CREAR Prenda
  const handleSave = async (formData) => {
    try {
      await axios.post(`${API}/prenda`, formData);
      setModalOpen(false);
      fetchPrendas(page);
    } catch (e) {
      alert("Error guardando prenda");
    }
  };

  // EDITAR Prenda
  const handleUpdate = async () => {
    setEditModal({ open: false, prenda: null });
    fetchPrendas(page);
  };

  // ELIMINAR Prenda y carpeta de imágenes
  // ELIMINAR Prenda y carpeta de imágenes
const handleDelete = async (prenda) => {
  if (
    !window.confirm(
      "¿Seguro que quieres eliminar esta prenda? Se eliminarán también las imágenes."
    )
  )
    return;
  try {
    // 1. Elimina la carpeta de imágenes (ruta relativa extraída de la imagen principal)
    if (prenda?.imagen?.principal) {
      let path = prenda.imagen.principal.replace(/^\/?uploads\//, "");
      let arr = path.split("/");
      arr.pop(); // quita el archivo
      const carpetaRel = arr.join("/"); // ejemplo: "Casacas/123312"
      if (carpetaRel) {
        await axios.delete(`${API}/archivos/eliminar-carpeta`, {
          params: { rutaRelativa: carpetaRel },
        });
      }
    }
    // 2. Elimina la prenda
    await axios.delete(`${API}/prenda/${prenda.id}`);
    fetchPrendas(page);
  } catch (e) {
    alert("Error eliminando prenda");
  }
};
  const sortedPrendas = [...prendas].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shirt className="h-6 w-6" /> Prendas
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <Plus className="h-5 w-5" /> Nueva prenda
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page + "-" + sortedPrendas.length}
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
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Descripción</th>
                <th className="py-2 px-4 text-left">Marca</th>
                <th className="py-2 px-4 text-left">Categoría</th>
                <th className="py-2 px-4 text-left">Proveedor</th>
                <th className="py-2 px-4 text-left">Precio</th>
                <th className="py-2 px-4 text-left">Activo</th>
                <th className="py-2 px-4 text-left">Imágenes</th>
                <th className="py-2 px-4 text-left">Tallas</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-6 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : sortedPrendas.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-6 text-center">
                    Sin prendas
                  </td>
                </tr>
              ) : (
                sortedPrendas.map((p) => (
                  <motion.tr
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="py-2 px-4">{p.id}</td>
                    <td className="py-2 px-4">{p.nombre}</td>
                    <td className="py-2 px-4 truncate max-w-[240px]">{p.descripcion}</td>
                    <td className="py-2 px-4">{p.marca?.nomMarca}</td>
                    <td className="py-2 px-4">{p.categoria?.nomCategoria}</td>
                    <td className="py-2 px-4">{p.proveedor?.nomProveedor}</td>
                    <td className="py-2 px-4">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> {p.precio}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="flex items-center gap-1">
                        <ToggleRight className={`h-4 w-4 ${p.activo ? "text-green-500" : "text-gray-400"}`} />
                        {p.activo ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.96 }}
                        title="Ver imágenes"
                        className="p-2 rounded hover:bg-blue-100 text-blue-700"
                        onClick={() => setImagenesModal({ open: true, imagen: p.imagen })}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    </td>
                    <td className="py-2 px-4">
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.96 }}
                        title="Ver tallas"
                        className="p-2 rounded hover:bg-blue-100 text-blue-700"
                        onClick={() => setTallasModal({ open: true, tallas: p.tallas, prendaId: p.id })}
                      >
                        <Layers className="h-4 w-4" />
                      </motion.button>
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.96 }}
                        title="Editar"
                        className="p-2 rounded hover:bg-yellow-100 text-yellow-700"
                        onClick={() => setEditModal({ open: true, prenda: p })}
                      >
                        <Pencil className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.96 }}
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
      {/* Modal para crear prenda */}
      <PrendaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        categorias={categorias}
        marcas={marcas}
        proveedores={proveedores}
      />
      {/* Modal para editar prenda */}
      <PrendaUpdateFormModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, prenda: null })}
        prenda={editModal.prenda}
        marcas={marcas}
        proveedores={proveedores}
        onUpdated={handleUpdate}
      />
      {/* Modal imágenes */}
      <ImagenesModal
        open={imagenesModal.open}
        imagen={imagenesModal.imagen}
        onClose={() => setImagenesModal({ open: false, imagen: null })}
      />
      {/* Modal tallas */}
      <TallasModal
        open={tallasModal.open}
        tallas={tallasModal.tallas}
        onClose={() => setTallasModal({ open: false, tallas: null })}
        prendaId={tallasModal.prendaId}
      />
    </div>
  );
}