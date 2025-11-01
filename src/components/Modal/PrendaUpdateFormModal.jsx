import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import axios from "axios";

const API = "http://localhost:8080/api/v1";
// const API = "https://mixmatch.zapto.org/api/v1";


export default function PrendaUpdateFormModal({
  open,
  onClose,
  prenda,
  marcas,
  proveedores,
  categorias,
  generos,
  onUpdated,
}) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    marcaId: "",
    proveedorId: "",
    categoriaId: "",
    generoId: "",
    precio: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);
    const accessToken = localStorage.getItem("accessToken"); // Obtener el token del localStorage

  // Para saber si renombrar carpeta
  const [nombreAntiguo, setNombreAntiguo] = useState("");
  const [rutaBase, setRutaBase] = useState("");

  useEffect(() => {
    if (open && prenda) {
      setForm({
        nombre: prenda.nombre || "",
        descripcion: prenda.descripcion || "",
        marcaId: prenda.marca?.id || "",
        proveedorId: prenda.proveedor?.id || "",
        categoriaId: prenda.categoria?.id || "",
        generoId: prenda.genero?.id || "",
        precio: prenda.precio || "",
        activo: prenda.activo ?? true,
      });

      if (prenda.imagen?.principal) {
        // ejemplo: uploads/Casacas/Camisa-Rosa/Camisa-RosaP.webp
        let path = prenda.imagen.principal.replace(/^uploads\//, "");
        let arr = path.split("/");
        // arr = [Casacas, Camisa-Rosa, Camisa-RosaP.webp]
        if (arr.length >= 3) {
          // Ruta base relativa: uploads/Casacas
          setRutaBase(`uploads/${arr[0]}`);
          setNombreAntiguo(arr[1]);
        } else {
          setRutaBase("");
          setNombreAntiguo("");
        }
      }
    }
  }, [open, prenda]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let hizoRenombrado = false;
      let nuevoNombreCarpeta = nombreAntiguo;

      // Si cambió el nombre de la prenda, renombra la carpeta
      const nombreFormateado = form.nombre.trim().replace(/\s+/g, "-");
      if (
        nombreAntiguo &&
        rutaBase &&
        nombreFormateado !== nombreAntiguo
      ) {
        nuevoNombreCarpeta = nombreFormateado;
        // PUT a la API de renombrar carpeta (rutaBase relativa!)
        await axios.put(`${API}/archivos/renombrar-carpeta`, null, {
          params: {
            rutaBase,
            nombreAntiguo,
            nombreNuevo: nuevoNombreCarpeta,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`, // Agregar el encabezado Authorization
          },
        });
        hizoRenombrado = true;
      }

      // Actualiza las rutas en la entidad imagen si el nombre fue cambiado
      if (hizoRenombrado && prenda.imagen) {
        // Recalcula el path relativo
        const relPath = `${rutaBase.split("/").pop()}/${nuevoNombreCarpeta}`;
        const nuevoNombreBase = nuevoNombreCarpeta;
        // El video puede no ser mp4, conserva la extensión si es así
        const getVideoExtension = (v) =>
          v ? v.split(".").pop() : "mp4";
        const videoExt = getVideoExtension(prenda.imagen.video);

        const imagenBody = {
          id: prenda.imagen.id,
          principal: `uploads/${relPath}/${nuevoNombreBase}P.webp`,
          hover: `uploads/${relPath}/${nuevoNombreBase}H.webp`,
          img1: `uploads/${relPath}/${nuevoNombreBase}S.webp`,
          img2: `uploads/${relPath}/${nuevoNombreBase}T.webp`,
          video: `uploads/${relPath}/${nuevoNombreBase}V.${videoExt}`,
        };
        // PUT imagen (actualiza las rutas)
        await axios.put(`${API}/imagen/${prenda.imagen.id}`, imagenBody);
      }

      // Construir body con los datos editables y los que no cambian
      // PrendaRequestDto con todos los campos
      const body = {
        id: prenda.id,
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagenId: prenda.imagen?.id,
        marcaId: Number(form.marcaId),
        categoriaId: Number(form.categoriaId),
        proveedorId: Number(form.proveedorId),
        generoId: Number(form.generoId),
        precio: Number(form.precio),
        activo: !!form.activo,
      };

      await axios.put(`${API}/prenda/${prenda.id}`, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Agregar el encabezado Authorization
        },
      });
      if (typeof onUpdated === "function") onUpdated();
      onClose();
    } catch (e) {
      alert("Error al actualizar prenda");
    }
    setLoading(false);
  };

  if (!open || !prenda) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 min-w-[340px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <X />
          </button>
          <h2 className="text-lg font-semibold mb-4">Editar Prenda</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-semibold">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-semibold">Categoría</label>
                <select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Selecciona</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nomCategoria}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold">Marca</label>
                <select
                  name="marcaId"
                  value={form.marcaId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Selecciona</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nomMarca}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold">Proveedor</label>
                <select
                  name="proveedorId"
                  value={form.proveedorId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Selecciona</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nomProveedor}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold">Género</label>
                <select
                  name="generoId"
                  value={form.generoId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
                  required
                >
                  <option value="">Selecciona</option>
                  {generos &&
                    generos.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nomGenero}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">Precio</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="precio"
                value={form.precio}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Activo
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                disabled={loading}
              >
                <Check className="h-4 w-4" /> Guardar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}