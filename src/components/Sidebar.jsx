import * as React from "react";
import { Card, List, Typography } from "@material-tailwind/react";
import {
  User, Shirt, Ruler, Tags, Landmark, ShoppingBag, Truck,
  Percent, Code, CheckCircle, CreditCard, Banknote,
  LogOut, ChevronRight, Users, Store, FileDown, Package,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const sections = [
  {
    title: "Usuario",
    icon: Users,
    subItems: [
      { title: "Usuario", icon: User, path: "/usuario/usuario" },
    ],
  },
  {
    title: "Prenda",
    icon: Shirt,
    subItems: [
      { title: "Talla", icon: Ruler, path: "/prenda/talla" },
      { title: "Categoría", icon: Tags, path: "/prenda/categoria" },
      { title: "Marca", icon: Landmark, path: "/prenda/marca" },
      { title: "Prenda", icon: Shirt, path: "/prenda/prenda" },
      { title: "Proveedor", icon: Store, path: "/prenda/proveedor" },
      { title: "Género", icon: Users, path: "/prenda/genero" },
      { title: "Reseñas", icon: Star, path: "/prenda/resenia" },
    ],
  },
  {
    title: "Descuento",
    icon: Percent,
    subItems: [
      { title: "Por Categoría", icon: Tags, path: "/descuento/por-categoria" },
      { title: "Por Código", icon: Code, path: "/descuento/por-codigo" },
      { title: "Por Prenda", icon: Shirt, path: "/descuento/por-prenda" },
      { title: "Por Usuario", icon: Users, path: "/descuento/por-usuario" },
    ],
  },
  {
    title: "Venta",
    icon: ShoppingBag,
    subItems: [
      { title: "Venta Realizada", icon: CheckCircle, path: "/venta/venta-realizada" },
      { title: "Envío", icon: Truck, path: "/venta/envio" },
    ],
  },
  {
    title: "Pago",
    icon: CreditCard,
    subItems: [
      { title: "Método de Pago", icon: Banknote, path: "/pago/metodo-de-pago" },
    ],
  },
  {
    title: "Reportes",
    icon: FileDown,
    subItems: [
      { title: "Stock", icon: Package, path: "/reporte/stock" },
      { title: "Ventas", icon: ShoppingBag, path: "/reporte/ventas" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = React.useState({});

  // Auto-expand the section that contains the current route
  React.useEffect(() => {
    const idx = sections.findIndex((section) =>
      section.subItems.some((item) => item.path === location.pathname)
    );
    if (idx !== -1) {
      setOpenSections((prev) => ({ ...prev, [idx]: true }));
    }
  }, [location.pathname]);

  const handleToggle = (idx) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <Card className="max-w-[280px] min-h-screen shadow-md flex flex-col">
      <div className="px-4 py-5 border-b sticky top-0 bg-white z-10">
        <Typography className="font-semibold text-lg">Panel Admin</Typography>
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
                    {section.subItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.2 }}
                        >
                          <List.Item
                            className={`text-sm flex items-center cursor-pointer ${
                              isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                            }`}
                            onClick={() => navigate(item.path)}
                          >
                            {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                            {item.title}
                          </List.Item>
                        </motion.div>
                      );
                    })}
                  </List>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <hr className="my-4 border-gray-200" />
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <List.Item
            className="text-red-500 hover:bg-red-50 cursor-pointer flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar sesión
          </List.Item>
        </motion.div>
      </List>
    </Card>
  );
}
