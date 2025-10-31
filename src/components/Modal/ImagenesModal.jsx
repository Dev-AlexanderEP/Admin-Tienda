import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, UploadCloud, Check } from "lucide-react";
import axios from "axios";

const API = "/api/v1";
const IMG_BASE = "http://localhost:8080/"; // Cambia si es necesario

export default function ImagenesModal({ open, onClose, imagen }) {
  // State para inputs de archivo y previews
  const [files, setFiles] = useState({
    principal: null,
    hover: null,
    img1: null,
    img2: null,
    video: null,
  });
  const [preview, setPreview] = useState({
    principal: "",
    hover: "",
    img1: "",
    img2: "",
    video: "",
  });
  const [uploading, setUploading] = useState(false);

  // Actualiza previews al seleccionar archivo
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreview((prev) => ({
      ...prev,
      [key]: file ? URL.createObjectURL(file) : "",
    }));
  };

  // Subir archivo individual y actualizar imagen en backend
  const handleUpload = async (type) => {
    if (!imagen?.id || !files[type]) {
      alert("Debes seleccionar un archivo para actualizar.");
      return;
    }
    setUploading(true);

    // Extrae la subcarpeta y nombre del archivo desde la URL actual
    // Ejemplo: "/uploads/Abrigos/dsdsdP.webp" -> subcarpeta: "Abrigos", nombreArchivo: "dsdsdP.webp"
    let path = imagen[type];
    if (!path) {
      alert("No se encontró la ruta del archivo.");
      setUploading(false);
      return;
    }
    // Quita el prefijo "/uploads/"
    path = path.replace(/^\/app\/uploads\/uploads\//, "").replace(/^uploads\//, "");

    const parts = path.split("/");
    const subcarpeta = parts.slice(0, -1).join("/");
    const nombreArchivo = parts[parts.length - 1];

    try {
      // 1. Subir el nuevo archivo al backend (sobrescribe)
      const formData = new FormData();
      formData.append("archivo", files[type]);
      formData.append("subcarpeta", subcarpeta);
      formData.append("nombreArchivo", nombreArchivo);

      await axios.post(`${API}/archivos/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Hacer PUT para actualizar el registro "imagen"
      // El nombre y path no cambian: solo se reemplaza el archivo físico en el servidor.
      // El backend no necesita el campo actualizado, porque la URL no cambia, pero igual puedes reenviar todo el objeto imagen actual.
      const imagenUpdated = { ...imagen };
      // Opcional: podrías actualizar la fecha/modificar otros campos si deseas.

      await axios.put(`${API}/imagen/${imagen.id}`, imagenUpdated);

      alert("Archivo actualizado correctamente.");
      setFiles((prev) => ({ ...prev, [type]: null }));
      setPreview((prev) => ({ ...prev, [type]: "" }));
    } catch (e) {
      alert("Error al subir archivo o actualizar imagen.");
    }
    setUploading(false);
  };

  if (!open || !imagen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
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
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> Imágenes de la Prenda (Editar)
          </h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {["principal", "hover", "img1", "img2", "video"].map((key) =>
              imagen[key] ? (
                <div key={key}>
                  <div className="font-bold capitalize">{key}</div>
                  {key === "video" ? (
                    <>
                      <video
                        src={preview.video || IMG_BASE + imagen[key]}
                        controls
                        className="max-w-full max-h-56 rounded"
                      />
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, key)}
                        className="block mt-2"
                        disabled={uploading}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={preview[key] || IMG_BASE + imagen[key]}
                        alt={key}
                        className="max-w-full max-h-56 rounded border"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, key)}
                        className="block mt-2"
                        disabled={uploading}
                      />
                    </>
                  )}
                  <div className="text-xs mt-2 break-all text-gray-600">
                    {IMG_BASE + imagen[key]}
                  </div>
                  <button
                    onClick={() => handleUpload(key)}
                    className={`mt-2 px-3 py-1 rounded flex items-center gap-1 ${
                      files[key]
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!files[key] || uploading}
                    type="button"
                  >
                    {uploading ? (
                      <UploadCloud className="h-4 w-4 animate-bounce" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {`Actualizar ${key === "video" ? "video" : "imagen"}`}
                  </button>
                </div>
              ) : null
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}