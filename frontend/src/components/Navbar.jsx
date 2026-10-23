import { NavLink } from "react-router-dom";

export default function Navbar() {
  const clase = ({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "");

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
        </div>
      </div>
    </nav>
  );
}