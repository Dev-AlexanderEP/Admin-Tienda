import { motion } from "framer-motion";

/**
 * MetricCard
 * @param {string} label - Label for the metric (e.g., "Usuarios registrados")
 * @param {number|string} value - Value to display
 * @param {string} [className] - Extra classes for the card
 * @param {React.ReactNode} [icon] - Optional icon
 */
export default function MetricCard({ label, value, className = "", icon = null }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-xl shadow-lg bg-white p-6 flex flex-col items-center justify-center transition ${className}`}
    >
      {icon && <span className="mb-2">{icon}</span>}
      <span className="text-gray-500 text-sm mb-2">{label}</span>
      <span className="text-3xl font-bold text-blue-600">{value}</span>
    </motion.div>
  );
}