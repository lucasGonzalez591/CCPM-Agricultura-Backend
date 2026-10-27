import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { haySesion } from "../utils/sesion";

export default function RutaProtegida() {
  const location = useLocation();

  if (!haySesion()) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}