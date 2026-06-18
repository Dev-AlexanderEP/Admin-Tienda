import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const tableVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ── Header ────────────────────────────────────────────────────────────────────

interface TableHeaderProps {
  columns: string[];
}

function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col) => (
          <th key={col} className="py-2 px-4 text-left">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ── Body ──────────────────────────────────────────────────────────────────────

interface TableBodyProps {
  loading: boolean;
  colSpan: number;
  empty: boolean;
  emptyText?: string;
  children?: React.ReactNode;
}

function TableBody({
  loading,
  colSpan,
  empty,
  emptyText = "Sin datos",
  children,
}: TableBodyProps) {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={colSpan} className="py-6 text-center">
            Cargando...
          </td>
        </tr>
      ) : empty ? (
        <tr>
          <td colSpan={colSpan} className="py-6 text-center">
            {emptyText}
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  show?: boolean;
}

function TablePagination({
  page,
  totalPages,
  onPrev,
  onNext,
  show = true,
}: TablePaginationProps) {
  if (!show) return null;

  return (
    <div className="flex justify-between items-center py-3 px-4 bg-gray-50">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPrev}
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
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente
      </motion.button>
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
// Pagination children are rendered after <table>; Header and Body go inside it.

interface TableProps {
  animKey: React.Key;
  children: React.ReactNode;
}

function Table({ animKey, children }: TableProps) {
  const tableChildren: React.ReactNode[] = [];
  const afterChildren: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TablePagination) {
      afterChildren.push(child);
    } else {
      tableChildren.push(child);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={tableVariants}
        transition={{ duration: 0.25 }}
        className="overflow-x-auto rounded shadow bg-white"
      >
        <table className="min-w-full">{tableChildren}</table>
        {afterChildren}
      </motion.div>
    </AnimatePresence>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Pagination = TablePagination;

export default Table;
