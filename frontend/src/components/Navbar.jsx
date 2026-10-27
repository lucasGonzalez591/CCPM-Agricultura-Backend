import { NavLink, useNavigate } from "react-router-dom";
import { cerrarSesion, obtenerUsuario } from "../utils/sesion";

export default function Navbar() {
  const navigate = useNavigate();
  const clase = ({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "");

  const salir = () => {
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-success">
      <div className="container">
        <NavLink className="navbar-brand" to="/">PAF</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className={clase} to="/productores">Productores</NavLink></li>
            <li className="nav-item"><NavLink className={clase} to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className={clase} to="/reportes">Reportes</NavLink></li>
          </ul>
          <div className="d-flex align-items-center gap-2 ms-md-3 mt-2 mt-md-0">
            <span className="text-white-50 small">{obtenerUsuario()}</span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={salir}>
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}