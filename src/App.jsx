import "./index.css";
import "./assets/fonts/fonts.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsuarioPage from "./pages/UsuarioPage";
import TallaPage from "./pages/TallaPage";
import CategoriaPage from "./pages/CategoriaPage";
import MarcaPage from "./pages/MarcaPage";
import PrendaPage from "./pages/PrendaPage";
import ProveedorPage from "./pages/ProveedorPage";
import DescuentoCategoriaPage from "./pages/DescuentoCategoriaPage";
import DescuentoCodigoPage from "./pages/DescuentoCodigoPage";
import DescuentoPrendaPage from "./pages/DescuentoPrendaPage";
import DescuentoUsuarioPage from "./pages/DescuentoUsuarioPage";
import VentaRealizadaPage from "./pages/VentaRealizadaPage";
import EnvioPage from "./pages/EnvioPage";
import MetodoPagoPage from "./pages/MetodoPagoPage";
import GeneroPage from "./pages/GeneroPage";
import ReseniaPage from "./pages/ReseniaPage";
import ReporteStockPage from "./pages/ReporteStockPage";
import ReporteVentasPage from "./pages/ReporteVentasPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="usuario/usuario" element={<UsuarioPage />} />
            <Route path="prenda/talla" element={<TallaPage />} />
            <Route path="prenda/categoria" element={<CategoriaPage />} />
            <Route path="prenda/marca" element={<MarcaPage />} />
            <Route path="prenda/prenda" element={<PrendaPage />} />
            <Route path="prenda/proveedor" element={<ProveedorPage />} />
            <Route path="descuento/por-categoria" element={<DescuentoCategoriaPage />} />
            <Route path="descuento/por-codigo" element={<DescuentoCodigoPage />} />
            <Route path="descuento/por-prenda" element={<DescuentoPrendaPage />} />
            <Route path="descuento/por-usuario" element={<DescuentoUsuarioPage />} />
            <Route path="venta/venta-realizada" element={<VentaRealizadaPage />} />
            <Route path="venta/envio" element={<EnvioPage />} />
            <Route path="pago/metodo-de-pago" element={<MetodoPagoPage />} />
            <Route path="prenda/genero" element={<GeneroPage />} />
            <Route path="prenda/resenia" element={<ReseniaPage />} />
            <Route path="reporte/stock" element={<ReporteStockPage />} />
            <Route path="reporte/ventas" element={<ReporteVentasPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
