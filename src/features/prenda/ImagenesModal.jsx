import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, UploadCloud } from "lucide-react";
import { getPrendaDetalle, uploadImagen } from "./api/prendas";

// Mapeo: campo en la respuesta del detalle → slot visual
const SLOTS = [
  { key: "principal", label: "Principal",  tipo: "PRINCIPAL",  field: "imagenPrincipal", accept: "image/*" },
  { key: "hover",     label: "Hover",      tipo: "HOVER",      field: "imagenHover",     accept: "image/*" },
  { key: "img1",      label: "Secundaria", tipo: "SECUNDARIA", field: "imagenExtra1",    accept: "image/*" },
  { key: "img2",      label: "Terciaria",  tipo: "TERCIARIA",  field: "imagenExtra2",    accept: "image/*" },
  { key: "video",     label: "Video",      tipo: "DETALLE",    field: "imagenVideo",     accept: "video/*" },
];

export default function ImagenesModal({ open, onClose, prendaId }) {
  const [urls, setUrls]         = useState({});
  const [files, setFiles]       = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading]   = useState(false);
  const [busy, setBusy]         = useState({});

  useEffect(() => {
    if (open && prendaId) {
      setFiles({});
      setPreviews({});
      fetchImagenes();
    }
    // eslint-disable-next-line
  }, [open, prendaId]);

  const fetchImagenes = async () => {
    setLoading(true);
    try {
      const { data } = await getPrendaDetalle(prendaId);
      const prenda = data?.data;
      const mapped = {};
      SLOTS.forEach((slot) => {
        const url = prenda?.[slot.field];
        if (url) mapped[slot.key] = url;
      });
      setUrls(mapped);
    } catch {
      setUrls({});
    }
    setLoading(false);
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("Máximo 10MB"); return; }
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleUpload = async (slot) => {
    const file = files[slot.key];
    if (!file) return;
    setBusy((prev) => ({ ...prev, [slot.key]: true }));
    try {
      await uploadImagen(prendaId, file, slot.tipo);
      setFiles((prev) => ({ ...prev, [slot.key]: null }));
      setPreviews((prev) => ({ ...prev, [slot.key]: null }));
      await fetchImagenes();
    } catch {
      alert("Error al subir imagen.");
    }
    setBusy((prev) => ({ ...prev, [slot.key]: false }));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 min-w-[340px] max-w-[95vw] max-h-[90vh] overflow-auto relative"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500" onClick={onClose}>
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> Imágenes de la Prenda
            </h3>

            {loading ? (
              <p className="text-center text-gray-400 py-8">Cargando...</p>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                {SLOTS.map((slot) => {
                  const currentUrl = previews[slot.key] || urls[slot.key];
                  const file   = files[slot.key];
                  const isBusy = !!busy[slot.key];

                  return (
                    <div key={slot.key} className="border rounded-lg p-3 flex flex-col gap-2">
                      <div className="font-semibold text-sm text-gray-700">{slot.label}</div>

                      {currentUrl ? (
                        slot.accept === "video/*" ? (
                          <video src={currentUrl} controls className="w-full max-h-40 rounded object-cover" />
                        ) : (
                          <img src={currentUrl} alt={slot.label} className="w-full max-h-40 rounded object-cover border" />
                        )
                      ) : (
                        <div className="w-full h-28 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}

                      <input
                        type="file"
                        accept={slot.accept}
                        disabled={isBusy}
                        onChange={(e) => handleFileChange(e, slot.key)}
                        className="text-xs"
                      />

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpload(slot)}
                        disabled={!file || isBusy}
                        className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-sm ${
                          file && !isBusy
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <UploadCloud className="h-4 w-4" />
                        {urls[slot.key] ? "Reemplazar" : "Subir"}
                      </motion.button>

                      {urls[slot.key] && (
                        <p className="text-[10px] text-gray-400 break-all">{urls[slot.key]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
