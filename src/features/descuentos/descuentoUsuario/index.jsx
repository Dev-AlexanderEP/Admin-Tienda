import React, { useEffect, useState } from "react";
import { Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import Table from "../../../components/Table";
import {
  getDescuentosUsuariosPaginado,
  deleteDescuentoUsuario,
} from "../api/descuentos";

// ── helpers ──────────────────────────────────────────────────────────────────

const parsePaginated = (data) => {
  const items = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.items)
    ? data.data.items
    : [];
  const totalPages =
    data?.metadata?.totalPages ??
    (Math.ceil((data?.data?.totalCount ?? 0) / (data?.data?.pageSize ?? 10)) || 1);
  return { items, totalPages };
};

function formatDate(d) {
  if (!d) return "—";
  return new Date(d + (d.includes("T") ? "" : "T00:00:00")).toLocaleDateString("es-PE");
}

// ── CRUD principal (solo lectura + eliminar) ──────────────────────────────────

const PAGE_SIZE = 10;

export default function DescuentoUsuarioCrud() {
  const [items, setItems]           = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  const fetchData = async (currentPage = 0) => {
    setLoading(true);
    try {
      const { data } = await getDescuentosUsuariosPaginado(currentPage + 1, PAGE_SIZE);
      const { items: arr, totalPages: tp } = parsePaginated(data);
      setItems(arr);
      setTotalPages(tp);
    } catch {
      setItems([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(page); }, [page]); // eslint-disable-line

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar el registro de uso #${item.id}?`)) return;
    try {
      await deleteDescuentoUsuario(item.id);
      fetchData(page);
    } catch {
      alert("Error eliminando registro");
    }
  };

  const sorted = [...items].sort((a, b) => a.id - b.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-6 w-6" /> Historial de Uso de Cupones
        </h2>
      </div>

      <Table animKey={page + "-" + sorted.length}>
        <Table.Header columns={["ID", "Cupón ID", "Usuario ID", "Fecha Uso", "Registrado", "Acciones"]} />
        <Table.Body loading={loading} colSpan={6} empty={sorted.length === 0} emptyText="Sin registros de uso">
          {sorted.map((item) => (
            <motion.tr
              key={item.id} layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="border-b hover:bg-blue-50 transition"
            >
              <td className="py-2 px-4">{item.id}</td>
              <td className="py-2 px-4">{item.descuentoCodigoId}</td>
              <td className="py-2 px-4">{item.usuarioId}</td>
              <td className="py-2 px-4 text-sm">{formatDate(item.fechaUso)}</td>
              <td className="py-2 px-4 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
              <td className="py-2 px-4">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="p-2 rounded hover:bg-red-100 text-red-700" onClick={() => handleDelete(item)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </Table.Body>
        <Table.Pagination
          page={page} totalPages={totalPages}
          onPrev={() => setPage(Math.max(page - 1, 0))}
          onNext={() => setPage(Math.min(page + 1, totalPages - 1))}
        />
      </Table>
    </div>
  );
}
