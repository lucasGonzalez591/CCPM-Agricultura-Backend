import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { haySesion, iniciarSesion } from "../utils/sesion";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");

  if (haySesion()) return <Navigate to="/" replace />;

  const ingresar = (e) => {
    e.preventDefault();
    if (usuario.trim() === "" || clave === "") {
      setError("Ingresá tu usuario y tu contraseña.");
      return;
    }
    iniciarSesion(usuario.trim());
    navigate(location.state?.desde ?? "/", { replace: true });
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: "linear-gradient(135deg, #198754 0%, #20c997 100%)" }}
    >
      <div className="card shadow border-0" style={{ width: "100%", maxWidth: 400 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="display-5 fw-bold text-success">PAF</div>
            <div className="text-muted">Productos de Agricultura Familiar</div>
          </div>

          <form onSubmit={ingresar} noValidate>
            {error && (
              <div className="alert alert-danger py-2 small" role="alert">{error}</div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                className="form-control"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="clave">Contraseña</label>
              <div className="input-group">
                <input
                  id="clave"
                  className="form-control"
                  type={verClave ? "text" : "password"}
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setVerClave(!verClave)}
                >
                  {verClave ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100">Ingresar</button>
          </form>

          <p className="text-muted small text-center mt-3 mb-0">
            Acceso demostrativo: se acepta cualquier usuario y contraseña.
          </p>
        </div>
      </div>
    </div>
  );
}