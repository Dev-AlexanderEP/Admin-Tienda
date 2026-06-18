import React, { useEffect, useState } from "react";
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
import Table from "../../components/Table";
import TallasModal from "./TallasModal";
import PrendaFormModal from "./PrendaFormModal";
import ImagenesModal from "./ImagenesModal";
import PrendaUpdateFormModal from "./PrendaUpdateFormModal";
import {
  getPrendasPaginado,
  createPrenda,
  deletePrenda,
  eliminarCarpeta,
  getGeneros,
} from "./api/prendas";
import { getMarcas } from "../marca/api/marcas";
import { getCategorias } from "../categoria/api/categorias";
import { getProveedores } from "../proveedor/api/proveedores";

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
  const [generos, setGeneros] = useState([]);

  // Cargar selects
  const fetchSelects = async () => {
    try {
      const [
        { data: dataMarcas },
        { data: dataCategorias },
        { data: dataProveedores },
        { data: dataGeneros },
      ] = await Promise.all([
        getMarcas(),
        getCategorias(),
        getProveedores(),
        getGeneros(),
      ]);
      setMarcas(Array.isArray(dataMarcas.object) ? dataMarcas.object : []);
      setCategorias(Array.isArray(dataCategorias.object) ? dataCategorias.object : []);
      setProveedores(Array.isArray(dataProveedores.object) ? dataProveedores.object : []);
      setGeneros(Array.isArray(dataGeneros.object) ? dataGeneros.object : []);
    } catch (e) {
      setMarcas([]);
      setCategorias([]);
      setProveedores([]);
      setGeneros([]);
    }
  };

  // Fetch paginado
  const fetchPrendas = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await getPrendasPaginado(page);
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
      await createPrenda(formData);
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
  const handleDelete = async (prenda) => {
    if (
      !window.confirm(
        "¿Seguro que quieres eliminar esta prenda? Se eliminarán también las imágenes."
      )
    )
      return;
    try {
      if (prenda?.imagen?.principal) {
        let path = prenda.imagen.principal.replace(/^\/?uploads\//, "");
        let arr = path.split("/");
        arr.pop();
        const carpetaRel = arr.join("/");
        if (carpetaRel) {
          await eliminarCarpeta(carpetaRel);
        }
      }
      await deletePrenda(prenda.id);
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
      <Table animKey={page + "-" + sortedPrendas.length}>
        <Table.Header columns={["ID", "Nombre", "Descripción", "Marca", "Categoría", "Proveedor", "Género", "Precio", "Activo", "Imágenes", "Tallas", "Acciones"]} />
        <Table.Body loading={loading} colSpan={12} empty={sortedPrendas.length === 0} emptyText="Sin prendas">
          {sortedPrendas.map((p) => (
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
              <td className="py-2 px-4">{p.genero?.nomGenero}</td>
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
          ))}
        </Table.Body>
        <Table.Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage(Math.max(page - 1, 0))}
          onNext={() => setPage(Math.min(page + 1, totalPages - 1))}
        />
      </Table>
      {/* Modal para crear prenda */}
      <PrendaFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        categorias={categorias}
        marcas={marcas}
        proveedores={proveedores}
        generos={generos}
      />
      {/* Modal para editar prenda */}
      <PrendaUpdateFormModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, prenda: null })}
        prenda={editModal.prenda}
        marcas={marcas}
        proveedores={proveedores}
        categorias={categorias}
        generos={generos}
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