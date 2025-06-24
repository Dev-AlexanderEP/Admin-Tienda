import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0ea5e9", // azul
  "#f472b6", // rosa
  "#facc15", // amarillo
  "#34d399", // verde
];

/**
 * PieVentasCategoria
 * @param {Array} data - Array of { name: string, value: number }
 * @param {number} [width=300] - Chart width
 * @param {number} [height=300] - Chart height
 */
export default function PieVentasCategoria({ data, width = 300, height = 300 }) {
  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}