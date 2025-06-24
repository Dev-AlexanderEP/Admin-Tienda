import * as React from "react";
import {
  Card,
  List,
  Typography,
} from "@material-tailwind/react";
import {
  User,
  MapPin,
  Shirt,
  Ruler,
  Tags,
  Landmark,
  ShoppingBag,
  Truck,
  Percent,
  Code,
  ShoppingCart,
  CheckCircle,
  CreditCard,
  Banknote,
  LogOut,
  ChevronRight,
  Users,
  Store,
  BarChart2,
  LineChart,
  PieChart,
  AreaChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "Usuario",
    icon: Users,
    subItems: [
      { title: "Datos Personales", icon: User },
      { title: "Dirección", icon: MapPin },
      { title: "Usuario", icon: User },
    ],
  },
  {
    title: "Prenda",
    icon: Shirt,
    subItems: [
      { title: "Talla", icon: Ruler },
      { title: "Categoría", icon: Tags },
      { title: "Marca", icon: Landmark },
      { title: "Prenda", icon: Shirt },
      { title: "Proveedor", icon: Store },
    ],
  },
  {
    title: "Descuento",
    icon: Percent,
    subItems: [
      { title: "Por Categoría", icon: Tags },
      { title: "Por Código", icon: Code },
      { title: "Por Prenda", icon: Shirt },
      { title: "Por Usuario", icon: Users },
    ],
  },
  {
    title: "Venta",
    icon: ShoppingBag,
    subItems: [
      { title: "Carrito", icon: ShoppingCart },
      { title: "Venta Realizada", icon: CheckCircle },
      { title: "Envío", icon: Truck },
      { title: "Reporte Ventas (Barra)", icon: BarChart2 },
      { title: "Reporte Ventas (Línea)", icon: LineChart },
      { title: "Reporte Ventas (Pie)", icon: PieChart },
      { title: "Reporte Ventas (Área)", icon: AreaChart },
    ],
  },
  {
    title: "Pago",
    icon: CreditCard,
    subItems: [
      { title: "Método de Pago", icon: Banknote },
      { title: "Pagos Realizados", icon: CheckCircle },
    ],
  },
];

// ...tus imports...

export default function Sidebar({ onSectionChange }) {
  const [openSections, setOpenSections] = React.useState({});

  const handleToggle = (idx) => {
    setOpenSections((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <Card className="max-w-[280px] min-h-screen shadow-md flex flex-col ">
      <div className="px-4 py-5 border-b sticky top-0 bg-white z-10">
        <Typography className="font-semibold text-lg">
          Panel Admin
        </Typography>
      </div>
      <List className="p-2 flex-1 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={section.title}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <List.Item
                className="cursor-pointer select-none flex items-center"
                onClick={() => handleToggle(idx)}
              >
                <section.icon className="h-5 w-5 mr-2" />
                {section.title}
                <motion.span
                  className="ml-auto flex"
                  animate={{ rotate: openSections[idx] ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.span>
              </List.Item>
            </motion.div>
            <AnimatePresence initial={false}>
              {openSections[idx] && (
                <motion.div
                  key="submenu"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <List className="ml-6">
                    {section.subItems.map((item) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2 }}
                      >
                        <List.Item
                          className="text-sm flex items-center cursor-pointer"
                          onClick={() => {
                            // Aquí llamas el cambio de sección
                            if (onSectionChange) {
                              onSectionChange(`${section.title.toLowerCase()}-${item.title.toLowerCase().replace(/\s/g, "")}`);
                            }
                          }}
                        >
                          {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                          {item.title}
                        </List.Item>
                      </motion.div>
                    ))}
                  </List>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <hr className="my-4 border-gray-200" />
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <List.Item className="text-red-500 hover:bg-red-50 cursor-pointer flex items-center">
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar sesión
          </List.Item>
        </motion.div>
      </List>
    </Card>
  );
}