import React, { useState, useEffect, useCallback } from "react";
import MetricCard from "./MetricCard";
import PeriodoSelector from "./PeriodoSelector";
import PieVentasCategoria from "./PieVentasCategoria";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, Shirt, ShoppingBag, TrendingDown } from "lucide-react";
import {
  getTotalVentas,
  getTotalUsuarios,
  getResumenPrendas,
  getVentasPorPeriodo,
  getVentasPorGenero,
} from "./api/analytics";

export default function DashboardFeature() {
  const [period, setPeriod] = useState("diario");

  const [cards, setCards] = useState({
    ventas: null,
    usuarios: null,
    prendasActivas: null,
    prendasInactivas: null,
  });
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingBar, setLoadingBar] = useState(false);
  const [loadingPie, setLoadingPie] = useState(true);

  // Fetch cards + pie once on mount
  useEffect(() => {
    const fetchStatic = async () => {
      setLoadingCards(true);
      setLoadingPie(true);
      try {
        const [ventasRes, usuariosRes, prendasRes, generoRes] = await Promise.allSettled([
          getTotalVentas(),
          getTotalUsuarios(),
          getResumenPrendas(),
          getVentasPorGenero(),
        ]);

        setCards({
          ventas:           ventasRes.status   === "fulfilled" ? ventasRes.value.data?.data    ?? 0  : "—",
          usuarios:         usuariosRes.status === "fulfilled" ? usuariosRes.value.data?.data   ?? 0  : "—",
          prendasActivas:   prendasRes.status  === "fulfilled" ? prendasRes.value.data?.data?.activas   ?? 0 : "—",
          prendasInactivas: prendasRes.status  === "fulfilled" ? prendasRes.value.data?.data?.inactivas ?? 0 : "—",
        });

        if (generoRes.status === "fulfilled") {
          const raw = generoRes.value.data?.data ?? [];
          setPieData(raw.map((d) => ({ name: d.genero, value: d.cantidadVentas })));
        }
      } finally {
        setLoadingCards(false);
        setLoadingPie(false);
      }
    };
    fetchStatic();
  }, []);

  // Fetch bar chart on period change
  const fetchBar = useCallback(async (agrupacion) => {
    setLoadingBar(true);
    try {
      const { data } = await getVentasPorPeriodo(agrupacion);
      const raw = data?.data ?? [];
      setBarData(raw.map((d) => ({ name: d.periodo, ventas: d.cantidadVentas })));
    } catch {
      setBarData([]);
    } finally {
      setLoadingBar(false);
    }
  }, []);

  useEffect(() => {
    fetchBar(period);
  }, [period, fetchBar]);

  const handlePeriodChange = (p) => setPeriod(p);

  const cardVal = (v) => (loadingCards ? "..." : v ?? 0);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Bienvenido al Panel de Administración</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Ventas realizadas"
          value={cardVal(cards.ventas)}
          icon={<ShoppingBag className="h-8 w-8 text-pink-400" />}
        />
        <MetricCard
          label="Usuarios registrados"
          value={cardVal(cards.usuarios)}
          icon={<Users className="h-8 w-8 text-blue-400" />}
        />
        <MetricCard
          label="Prendas activas"
          value={cardVal(cards.prendasActivas)}
          icon={<Shirt className="h-8 w-8 text-green-400" />}
        />
        <MetricCard
          label="Prendas inactivas"
          value={cardVal(cards.prendasInactivas)}
          icon={<TrendingDown className="h-8 w-8 text-gray-400" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-500" /> Ventas por período
          </h2>
          <PeriodoSelector value={period} onChange={handlePeriodChange} />
          <div className="w-full h-64 relative">
            {loadingBar && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                Cargando...
              </div>
            )}
            {!loadingBar && barData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                Sin datos para este período
              </div>
            )}
            {!loadingBar && barData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    formatter={(v) => [v, "Ventas"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="ventas" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="font-semibold mb-4 text-lg">Ventas por género</h2>
          {loadingPie ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              Cargando...
            </div>
          ) : pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              Sin datos
            </div>
          ) : (
            <PieVentasCategoria data={pieData} width={320} height={280} />
          )}
        </div>
      </div>
    </>
  );
}
