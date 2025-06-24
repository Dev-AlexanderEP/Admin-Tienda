import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MetricCard from "../components/MetricCard";
import PeriodoSelector from "../components/PeriodoSelector";
import PieVentasCategoria from "../components/PieVentasCategoria";
import UsuarioCrud from "../components/usuario/UsuarioCrud";
import DireccionCrud from "../components/usuario/DireccionCrud";
import DatosPersonalesCrud from "../components/usuario/DatosPersonalesCrud";
import ProveedorCrud from "../components/prenda/ProveedorCrud";
import TallaCrud from "../components/prenda/TallaCrud";
import MarcaCrud from "../components/prenda/MarcaCrud";
import CategoriaCrud from "../components/prenda/CategoriaCrud";
import PrendaCrud from "../components/prenda/PrendaCrud";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Shirt, ShoppingBag } from "lucide-react";

// Datos mock para métricas
const metricas = [
  {
    label: "Usuarios registrados",
    value: 120,
    icon: <Users className="h-8 w-8 text-blue-400" />,
  },
  {
    label: "Prendas activas",
    value: 80,
    icon: <Shirt className="h-8 w-8 text-green-400" />,
    extra: {
      label: "Prendas inactivas",
      value: 15,
    },
  },
  {
    label: "Ventas realizadas",
    value: 350,
    icon: <ShoppingBag className="h-8 w-8 text-pink-400" />,
  },
];

// Datos mock para ventas por periodo
const ventasPorPeriodo = {
  diario: [
    { name: "Lun", ventas: 5 },
    { name: "Mar", ventas: 12 },
    { name: "Mié", ventas: 8 },
    { name: "Jue", ventas: 15 },
    { name: "Vie", ventas: 20 },
    { name: "Sáb", ventas: 7 },
    { name: "Dom", ventas: 3 },
  ],
  semanal: [
    { name: "Semana 1", ventas: 40 },
    { name: "Semana 2", ventas: 60 },
    { name: "Semana 3", ventas: 55 },
    { name: "Semana 4", ventas: 80 },
  ],
  mensual: [
    { name: "Ene", ventas: 120 },
    { name: "Feb", ventas: 98 },
    { name: "Mar", ventas: 130 },
    { name: "Abr", ventas: 145 },
    { name: "May", ventas: 160 },
    { name: "Jun", ventas: 110 },
    { name: "Jul", ventas: 90 },
    { name: "Ago", ventas: 100 },
    { name: "Sep", ventas: 140 },
    { name: "Oct", ventas: 180 },
    { name: "Nov", ventas: 170 },
    { name: "Dic", ventas: 200 },
  ],
  anual: [
    { name: "2021", ventas: 900 },
    { name: "2022", ventas: 1300 },
    { name: "2023", ventas: 1500 },
    { name: "2024", ventas: 1700 },
    { name: "2025", ventas: 800 },
  ],
};

// Datos mock para pastel categorías
const pieData = [
  { name: "Mujer", value: 210 },
  { name: "Hombre", value: 95 },
  { name: "Accesorios", value: 30 },
  { name: "Infantil", value: 15 },
];

export default function AdminTiendaPage() {
  const [period, setPeriod] = useState("diario");
  const [currentSection, setCurrentSection] = useState("dashboard");

  // Esta función la pasaremos al Sidebar para cambiar la sección activa
  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar onSectionChange={handleSectionChange} />
      <main className="flex-1 p-6 overflow-y-auto">
        {currentSection === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">
              Bienvenido al Panel de Administración
            </h1>
            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {metricas.map((m, i) => (
                <div key={i} className="relative">
                  <MetricCard label={m.label} value={m.value} icon={m.icon} />
                  {m.extra && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-100 rounded-lg px-2 py-1 text-xs text-gray-700 shadow">
                      {m.extra.label}:{" "}
                      <span className="font-semibold">{m.extra.value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart de barras con selector de periodo */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-500" /> Ventas realizadas
                </h2>
                <PeriodoSelector value={period} onChange={setPeriod} />
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventasPorPeriodo[period]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="ventas" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Chart de pastel */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                <h2 className="font-semibold mb-4 text-lg">Ventas por categoría</h2>
                <PieVentasCategoria data={pieData} width={320} height={320} />
              </div>
            </div>
          </>
        )}
        {currentSection === "usuario-usuario" && <UsuarioCrud />}
        {currentSection === "usuario-dirección" && <DireccionCrud />}
        {currentSection === "usuario-datospersonales" && <DatosPersonalesCrud />}
        {currentSection === "prenda-talla" && <TallaCrud />}
        {currentSection === "prenda-proveedor" && <ProveedorCrud />}
        {currentSection === "prenda-marca" && <MarcaCrud />}
        {currentSection === "prenda-categoría" && <CategoriaCrud />}
        {currentSection === "prenda-prenda" && <PrendaCrud />}
      </main>
    </div>
  );
}