import React from "react";

/**
 * PeriodoSelector
 * @param {string} value - Valor actual seleccionado
 * @param {function} onChange - Callback cuando cambia el periodo
 */
export default function PeriodoSelector({ value, onChange }) {
  const options = [
    { key: "diario", label: "Diario" },
    { key: "semanal", label: "Semanal" },
    { key: "mensual", label: "Mensual" },
    { key: "anual", label: "Anual" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`px-4 py-1 rounded-full border text-sm font-medium ${
            value === opt.key
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}