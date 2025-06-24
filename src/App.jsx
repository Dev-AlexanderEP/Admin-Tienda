import './index.css';
import './assets/fonts/fonts.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const AdminTiendaPage = lazy(() => import("./pages/AdminTiendaPage"));

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin-tienda"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <AdminTiendaPage />
            </Suspense>
          }
        />
        {/* Redirección de cualquier otra ruta a /admin-tienda */}
        <Route path="*" element={<Navigate to="/admin-tienda" replace />} />
      </Routes>
    </Router>
  );
}

export default App;