import { Routes, Route, Navigate } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida";
import Login from "./pages/Login";
import Inicio from "./pages/Inicio";
import Productores from "./pages/Productores";
import ProductorForm from "./pages/ProductorForm";
import ProductorDetalle from "./pages/ProductorDetalle";
import Productos from "./pages/Productos";
import ProductoForm from "./pages/ProductoForm";
import ProductoDetalle from "./pages/ProductoDetalle";
import Reportes from "./pages/Reportes";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RutaProtegida />}>
        <Route path="/" element={<Inicio />} />

        <Route path="/productores" element={<Productores />} />
        <Route path="/productores/nuevo" element={<ProductorForm />} />
        <Route path="/productores/:id" element={<ProductorDetalle />} />
        <Route path="/productores/:id/editar" element={<ProductorForm />} />

        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/nuevo" element={<ProductoForm />} />
        <Route path="/productos/:id" element={<ProductoDetalle />} />
        <Route path="/productos/:id/editar" element={<ProductoForm />} />

        <Route path="/reportes" element={<Reportes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}