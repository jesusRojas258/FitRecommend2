import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Layout      from "./componentes/Layout";
import Inicio      from "./paginas/Inicio";
import Perfil      from "./paginas/Perfil";
import Rutinas     from "./paginas/Rutinas";
import Calendario  from "./paginas/Calendario";
import MisRutinas  from "./paginas/MisRutinas";
import Login       from "./paginas/Login";
import Verificar   from "./paginas/Verificar";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/login"            element={<Login />} />
        <Route path="/verificar/:token" element={<Verificar />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index                  element={<Inicio />} />
          <Route path="perfil"          element={<Perfil />} />
          <Route path="rutinas"         element={<Rutinas />} />
          <Route path="calendario"      element={<Calendario />} />
          <Route path="mis-rutinas"     element={<MisRutinas />} />
        </Route>

        {/* Cualquier ruta desconocida redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;