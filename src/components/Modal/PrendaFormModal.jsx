import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shirt, Check, UploadCloud } from "lucide-react";
import axios from "axios";

const API = "/api/v1";

export default function PrendaFormModal({
  open,
  onClose,
  onSubmit,
  categorias,
  marcas,
  proveedores,
  generos,
}) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    activo: true,
    categoriaId: "",
    marcaId: "",
    proveedorId: "",
    generoId: "",
    imagenId: null,
  });

  const [imgFiles, setImgFiles] = useState({
    principal: null,
    hover: null,
    img1: null,
    img2: null,
    video: null,
  });

  const [imgPreview, setImgPreview] = useState({
    principal: "",
    hover: "",
    img1: "",
    img2: "",
    video: "",
  });

  // Para mostrar URL generada
  const [urlGen, setUrlGen] = useState({
    principal: "",
    hover: "",
    img1: "",
    img2: "",
    video: "",
  });

  const [imagenUploading, setImagenUploading] = useState(false);

  // Reset modal state
  useEffect(() => {
    if (open) {
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        activo: true,
        categoriaId: "",
        marcaId: "",
        proveedorId: "",
        generoId: "",
        imagenId: null,
      });
      setImgFiles({
        principal: null,
        hover: null,
        img1: null,
        img2: null,
        video: null,
      });
      setUrlGen({
        principal: "",
        hover: "",
        img1: "",
        img2: "",
        video: "",
      });
      setImgPreview({
        principal: "",
        hover: "",
        img1: "",
        img2: "",
        video: "",
      });
    }
  }, [open]);

  // URL generator when selecting files
  useEffect(() => {
    if (!form.categoriaId) return;
    const categoria = categorias.find((c) => c.id === Number(form.categoriaId));
    const catName = categoria
      ? categoria.nomCategoria.replace(/\s+/g, "-")
      : "categoria";
    const nombreBase = form.nombre
      ? form.nombre.trim().replace(/\s+/g, "-")
      : "imagen";
    setUrlGen({
      principal: `uploads/${catName}/${nombreBase}/${nombreBase}P.webp`,
      hover: `uploads/${catName}/${nombreBase}/${nombreBase}H.webp`,
      img1: `uploads/${catName}/${nombreBase}/${nombreBase}S.webp`,
      img2: `uploads/${catName}/${nombreBase}/${nombreBase}T.webp`,
      video: `uploads/${catName}/${nombreBase}/${nombreBase}V.${imgFiles.video
        ? imgFiles.video.name.split(".").pop()
        : "mp4"
      }`,
    });
    // eslint-disable-next-line
  }, [form.categoriaId, form.nombre, categorias, imgFiles.video]);

  // Preview images when files selected
  useEffect(() => {
    const getImgUrl = (file) => (file ? URL.createObjectURL(file) : "");
    setImgPreview({
      principal: getImgUrl(imgFiles.principal),
      hover: getImgUrl(imgFiles.hover),
      img1: getImgUrl(imgFiles.img1),
      img2: getImgUrl(imgFiles.img2),
      video: getImgUrl(imgFiles.video),
    });
    // cleanup
    return () => {
      Object.values(imgPreview).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
    // eslint-disable-next-line
  }, [imgFiles]);

  // Validate file upload (maxSize in MB)
  const validateFile = (file, type) => {
    if (!file) return true;
    if (file.size > 10 * 1024 * 1024)
      return type === "video"
        ? "El video no debe superar 10MB"
        : "Las imágenes no deben superar 10MB";
    return true;
  };

  // Handle file inputs
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    const valid = validateFile(file, type);
    if (valid !== true) {
      alert(valid);
      return;
    }
    setImgFiles((prev) => ({ ...prev, [type]: file }));
  };

  // Subir una imagen/video al backend y devolver la URL
  const uploadArchivo = async (file, subcarpeta, nombreArchivo) => {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("subcarpeta", subcarpeta);
    formData.append("nombreArchivo", nombreArchivo);
    await axios.post(`${API}/archivos/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return `uploads/${subcarpeta}/${nombreArchivo}`;
  };

  // Upload images/videos and get imagenId
    const handleUploadImagen = async () => {
    if (
      !imgFiles.principal ||
      !imgFiles.hover ||
      !imgFiles.img1 ||
      !imgFiles.img2 
    ) {
      alert("Debes subir todas las imágenes");
      return false;
    }
    setImagenUploading(true);
  
    try {
      // Obtener la subcarpeta y nombre base según el form
      const categoria =
        categorias.find((c) => c.id === Number(form.categoriaId)) || {};
      const catName = categoria.nomCategoria
        ? categoria.nomCategoria.replace(/\s+/g, "-")
        : "categoria";
      const nombreBase = form.nombre
        ? form.nombre.trim().replace(/\s+/g, "-")
        : "imagen";
  
      // Subir cada archivo y obtener url
      const principalUrl = await uploadArchivo(
        imgFiles.principal,
        `${catName}/${nombreBase}`,
        `${nombreBase}P.webp`
      );
      const hoverUrl = await uploadArchivo(
        imgFiles.hover,
        `${catName}/${nombreBase}`,
        `${nombreBase}H.webp`
      );
      const img1Url = await uploadArchivo(
        imgFiles.img1,
        `${catName}/${nombreBase}`,
        `${nombreBase}S.webp`
      );
      const img2Url = await uploadArchivo(
        imgFiles.img2,
        `${catName}/${nombreBase}`,
        `${nombreBase}T.webp`
      );
      
      // Subir video solo si existe
      let videoUrl = null;
      if (imgFiles.video) {
        const videoExt = imgFiles.video.name.split('.').pop();
        videoUrl = await uploadArchivo(
          imgFiles.video,
          `${catName}/${nombreBase}`,
          `${nombreBase}V.${videoExt}`
        );
      }
  
      // Crear la imagen en la BD
      const imagenData = {
        principal: principalUrl,
        hover: hoverUrl,
        img1: img1Url,
        img2: img2Url,
        video: videoUrl,
      };
  
      const res = await axios.post(`${API}/imagen`, imagenData);
      setImagenUploading(false);
      if (res.data.object && res.data.object.id) {
        setForm((f) => ({ ...f, imagenId: res.data.object.id }));
        return res.data.object.id;
      } else {
        alert("Error al guardar la imagen");
        return false;
      }
    } catch (e) {
      setImagenUploading(false);
      alert("Error al subir archivos de imagen o video");
      return false;
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 1. Subir imágenes y obtener imagenId
    let imagenId = form.imagenId;
    if (!imagenId) {
      imagenId = await handleUploadImagen();
      if (!imagenId) return; // Abort if error
    }

    // 2. Crear prenda (PrendaRequestDto)
    try {
      const body = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagenId: imagenId,
        marcaId: Number(form.marcaId),
        categoriaId: Number(form.categoriaId),
        proveedorId: Number(form.proveedorId),
        generoId: Number(form.generoId),
        precio: Number(form.precio),
        activo: !!form.activo,
      };
      await onSubmit(body);
      onClose();
    } catch (e) {
      alert("Error al guardar prenda");
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl p-8 min-w-[380px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
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
            <Shirt className="h-6 w-6" /> Nueva Prenda
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-semibold">Nombre de prenda</label>
              <input
                type="text"
                required
                name="nombre"
                value={form.nombre}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Descripción</label>
              <textarea
                required
                name="descripcion"
                value={form.descripcion}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-semibold">Categoría</label>
                <select
                  required
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
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
                  required
                  name="marcaId"
                  value={form.marcaId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
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
                  required
                  name="proveedorId"
                  value={form.proveedorId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
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
                  required
                  name="generoId"
                  value={form.generoId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1"
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
                required
                name="precio"
                value={form.precio}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">
                  Imagen Principal (máx 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleFileChange(e, "principal")}
                />
                {imgPreview.principal && (
                  <img
                    src={imgPreview.principal}
                    alt="principal"
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
                <div className="text-xs text-gray-500 break-all mt-1">
                  {urlGen.principal}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">
                  Imagen Hover (máx 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleFileChange(e, "hover")}
                />
                {imgPreview.hover && (
                  <img
                    src={imgPreview.hover}
                    alt="hover"
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
                <div className="text-xs text-gray-500 break-all mt-1">
                  {urlGen.hover}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">
                  Imagen Secundaria (máx 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleFileChange(e, "img1")}
                />
                {imgPreview.img1 && (
                  <img
                    src={imgPreview.img1}
                    alt="secundaria"
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
                <div className="text-xs text-gray-500 break-all mt-1">
                  {urlGen.img1}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">
                  Imagen Terciaria (máx 10MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => handleFileChange(e, "img2")}
                />
                {imgPreview.img2 && (
                  <img
                    src={imgPreview.img2}
                    alt="terciaria"
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
                <div className="text-xs text-gray-500 break-all mt-1">
                  {urlGen.img2}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">
                  Video (máx 10MB)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  
                  onChange={(e) => handleFileChange(e, "video")}
                />
                {imgPreview.video && (
                  <video
                    src={imgPreview.video}
                    controls
                    className="w-24 h-24 mt-2 object-cover rounded"
                  />
                )}
                <div className="text-xs text-gray-500 break-all mt-1">
                  {urlGen.video}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={onClose}
                disabled={imagenUploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                disabled={imagenUploading}
              >
                {imagenUploading && (
                  <UploadCloud className="h-4 w-4 animate-bounce" />
                )}
                <Check className="h-4 w-4" /> Guardar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}