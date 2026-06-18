import "./index.css";
import "./assets/fonts/fonts.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import UsuarioPage from "./pages/UsuarioPage";
import DireccionPage from "./pages/DireccionPage";
import DatosPersonalesPage from "./pages/DatosPersonalesPage";
import TallaPage from "./pages/TallaPage";
import CategoriaPage from "./pages/CategoriaPage";
import MarcaPage from "./pages/MarcaPage";
import PrendaPage from "./pages/PrendaPage";
import ProveedorPage from "./pages/ProveedorPage";
import DescuentoCategoriaPage from "./pages/DescuentoCategoriaPage";
import DescuentoCodigoPage from "./pages/DescuentoCodigoPage";
import DescuentoPrendaPage from "./pages/DescuentoPrendaPage";
import DescuentoUsuarioPage from "./pages/DescuentoUsuarioPage";
import CarritoPage from "./pages/CarritoPage";
import VentaRealizadaPage from "./pages/VentaRealizadaPage";
import EnvioPage from "./pages/EnvioPage";
import ReporteVentasBarraPage from "./pages/ReporteVentasBarraPage";
import ReporteVentasLineaPage from "./pages/ReporteVentasLineaPage";
import ReporteVentasPiePage from "./pages/ReporteVentasPiePage";
import ReporteVentasAreaPage from "./pages/ReporteVentasAreaPage";
import MetodoPagoPage from "./pages/MetodoPagoPage";
import PagosRealizadosPage from "./pages/PagosRealizadosPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="usuario/datos-personales" element={<DatosPersonalesPage />} />
          <Route path="usuario/direccion" element={<DireccionPage />} />
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
          <Route path="venta/carrito" element={<CarritoPage />} />
          <Route path="venta/venta-realizada" element={<VentaRealizadaPage />} />
          <Route path="venta/envio" element={<EnvioPage />} />
          <Route path="venta/reporte-barra" element={<ReporteVentasBarraPage />} />
          <Route path="venta/reporte-linea" element={<ReporteVentasLineaPage />} />
          <Route path="venta/reporte-pie" element={<ReporteVentasPiePage />} />
          <Route path="venta/reporte-area" element={<ReporteVentasAreaPage />} />
          <Route path="pago/metodo-de-pago" element={<MetodoPagoPage />} />
          <Route path="pago/pagos-realizados" element={<PagosRealizadosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
