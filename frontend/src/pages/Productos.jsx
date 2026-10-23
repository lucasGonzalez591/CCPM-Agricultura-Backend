
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listarProductos, eliminarProducto } from "../api/productosApi";
import { interpretarError } from "../utils/errores";
import { SEXOS } from "../utils/constantes";
import Alerta from "../components/Alerta";
import ConfirmarModal from "../components/ConfirmarModal";

const FILTROS_VACIOS = {
  nombre: "", lugarVenta: "", precioMin: "", precioMax: "",
  productorApellido: "", productorNombre: "", productorDni: "",
  sexo: "", departamento: "", municipio: "",
};

const formatoPrecio = (valor) =>
  Number(valor).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

function Filtro({ label, name, value, onChange, type = "text", children }) {
  return (
    <div className="col-6 col-md-3">
      <label className="form-label small mb-1" htmlFor={name}>{label}</label>
      {children ?? (
        <input id={name} name={name} type={type} value={value} onChange={onChange}
               className="form-control form-control-sm" />
      )}
    </div>
  );
}

export default function Productos() {
  const location = useLocation();
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(location.state?.exito || "");
  const [mostrarMas, setMostrarMas] = useState(false);
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const cargar = useCallback(async (f) => {
    setCargando(true);
    setError("");
    try {
      const data = await listarProductos(f);
      setProductos(Array.isArray(data) ? data : data?.content ?? []);
    } catch (e) {
      setError(interpretarError(e).mensaje);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(FILTROS_VACIOS);
  }, [cargar]);

  const cambiar = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const buscar = (e) => {
    e.preventDefault();
    setExito("");
    cargar(filtros);
  };

  const limpiar = () => {
    setFiltros(FILTROS_VACIOS);
    cargar(FILTROS_VACIOS);
  };

  const confirmarEliminar = async () => {
    setEliminando(true);
    try {
      await eliminarProducto(aEliminar.id);
      setExito(`Se eliminó el producto ${aEliminar.nombre}.`);
      setAEliminar(null);
      cargar(filtros);
    } catch (e) {
      setError(interpretarError(e).mensaje);
      setAEliminar(null);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <Link to="/productos/nuevo" className="btn btn-success">+ Nuevo producto</Link>
      </div>

      <Alerta tipo="success" onCerrar={() => setExito("")}>{exito}</Alerta>
      <Alerta tipo="danger" onCerrar={() => setError("")}>{error}</Alerta>

      <form onSubmit={buscar} className="card card-tabla mb-3">
        <div className="card-body">
          <div className="row g-2">
            <Filtro label="Nombre" name="nombre" value={filtros.nombre} onChange={cambiar} />
            <Filtro label="Lugar de venta" name="lugarVenta" value={filtros.lugarVenta} onChange={cambiar} />
            <Filtro label="Precio mínimo" name="precioMin" type="number" value={filtros.precioMin} onChange={cambiar} />
            <Filtro label="Precio máximo" name="precioMax" type="number" value={filtros.precioMax} onChange={cambiar} />
          </div>

          {mostrarMas && (
            <div className="row g-2 mt-1">
              <Filtro label="Apellido del productor" name="productorApellido" value={filtros.productorApellido} onChange={cambiar} />
              <Filtro label="Nombre del productor" name="productorNombre" value={filtros.productorNombre} onChange={cambiar} />
              <Filtro label="DNI del productor" name="productorDni" value={filtros.productorDni} onChange={cambiar} />
              <Filtro label="Sexo" name="sexo">
                <select id="sexo" name="sexo" value={filtros.sexo} onChange={cambiar}
                        className="form-select form-select-sm">
                  <option value="">Todos</option>
                  {SEXOS.map((s) => (
                    <option key={s.valor} value={s.valor}>{s.etiqueta}</option>
                  ))}
                </select>
              </Filtro>
              <Filtro label="Departamento" name="departamento" value={filtros.departamento} onChange={cambiar} />
              <Filtro label="Municipio" name="municipio" value={filtros.municipio} onChange={cambiar} />
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button type="submit" className="btn btn-success btn-sm">Buscar</button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={limpiar}>
              Limpiar
            </button>
            <button type="button" className="btn btn-link btn-sm ms-auto"
                    onClick={() => setMostrarMas(!mostrarMas)}>
              {mostrarMas ? "Menos filtros" : "Más filtros"}
            </button>
          </div>
        </div>
      </form>

      <div className="card card-tabla">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th className="text-end">Precio unitario</th>
                <th>Lugar de venta</th>
                <th>Productor</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
                <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
              )}
              {!cargando && productos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
              {!cargando && productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td className="text-end">{formatoPrecio(p.precioUnitario)}</td>
                  <td>{p.lugarVenta}</td>
                  <td>
                    <Link to={`/productores/${p.productorId}`}>{p.productorNombre}</Link>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link to={`/productos/${p.id}`} className="btn btn-outline-primary btn-sm me-1">Ver</Link>
                    <Link to={`/productos/${p.id}/editar`} className="btn btn-outline-secondary btn-sm me-1">Editar</Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => setAEliminar(p)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmarModal
        abierto={!!aEliminar}
        titulo="Eliminar producto"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
        procesando={eliminando}
      >
        {aEliminar && (
          <p className="mb-0">
            ¿Seguro que querés eliminar el producto <strong>{aEliminar.nombre}</strong>?
          </p>
        )}
      </ConfirmarModal>
    </div>
  );
}