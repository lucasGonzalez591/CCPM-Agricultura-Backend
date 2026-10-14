import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProductor, productosDeProductor } from "../api/productoresApi";
import { interpretarError } from "../utils/errores";
import { formatearFecha, formatearPrecio } from "../utils/formato";
import Alerta from "../components/Alerta";

function Dato({ etiqueta, valor }) {
  return (
    <div className="col-sm-6 col-lg-4">
      <div className="text-muted small">{etiqueta}</div>
      <div>{valor || "-"}</div>
    </div>
  );
}

export default function ProductorDetalle() {
  const { id } = useParams();
  const [productor, setProductor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([obtenerProductor(id), productosDeProductor(id)])
      .then(([p, prods]) => {
        setProductor(p);
        setProductos(prods);
      })
      .catch((e) => setError(interpretarError(e).mensaje))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <p>Cargando...</p>;
  if (error) {
    return (
      <>
        <Alerta tipo="danger">{error}</Alerta>
        <Link to="/productores" className="btn btn-outline-secondary">Volver</Link>
      </>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">{productor.apellido}, {productor.nombre}</h1>
        <div className="d-flex gap-2">
          <Link to="/productores" className="btn btn-outline-secondary">Volver</Link>
          <Link to={`/productores/${id}/editar`} className="btn btn-success">Editar</Link>
        </div>
      </div>

      <div className="card card-tabla mb-4">
        <div className="card-body">
          <div className="row g-3">
            <Dato etiqueta="DNI" valor={productor.dni} />
            <Dato etiqueta="Sexo" valor={productor.sexo} />
            <Dato etiqueta="Fecha de nacimiento" valor={formatearFecha(productor.fechaNacimiento)} />
            <Dato etiqueta="Teléfono" valor={productor.telefono} />
            <Dato etiqueta="Email" valor={productor.email} />
            <Dato etiqueta="Máximo título" valor={productor.maximoTitulo} />
            <Dato etiqueta="Departamento" valor={productor.departamento} />
            <Dato etiqueta="Municipio" valor={productor.municipio} />
            <Dato etiqueta="Domicilio" valor={productor.domicilio} />
          </div>
        </div>
      </div>

      <h2 className="h5">Productos ({productos.length})</h2>
      <div className="card card-tabla">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr><th>Producto</th><th>Precio unitario</th><th>Lugar de venta</th></tr>
            </thead>
            <tbody>
              {productos.length === 0 && (
                <tr><td colSpan="3" className="text-center text-muted py-3">Este productor todavía no cargó productos.</td></tr>
              )}
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{formatearPrecio(p.precioUnitario)}</td>
                  <td>{p.lugarVenta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}