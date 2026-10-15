import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../api/productosApi";
import { interpretarError } from "../utils/errores";
import Alerta from "../components/Alerta";

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setProducto(await obtenerProducto(id));
      } catch (e) {
        setError(interpretarError(e).mensaje);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Detalle del producto</h1>
        <div className="d-flex gap-2">
          <Link to="/productos" className="btn btn-outline-secondary">Volver</Link>
          {producto && (
            <Link to={`/productos/${producto.id}/editar`} className="btn btn-success">Editar</Link>
          )}
        </div>
      </div>

      <Alerta tipo="danger" onCerrar={() => setError("")}>{error}</Alerta>

      {producto && (
        <div className="card card-tabla">
          <div className="card-body">
            <h2 className="h4">{producto.nombre}</h2>
            <p className="text-muted">{producto.descripcion || "Sin descripción."}</p>

            <dl className="row mb-0">
              <dt className="col-sm-3">Precio unitario</dt>
              <dd className="col-sm-9">
                {Number(producto.precioUnitario).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </dd>

              <dt className="col-sm-3">Lugar de venta</dt>
              <dd className="col-sm-9">{producto.lugarVenta}</dd>

              <dt className="col-sm-3">Productor</dt>
              <dd className="col-sm-9">
                <Link to={`/productores/${producto.productorId}`}>{producto.productorNombre}</Link>
              </dd>
            </dl>

            <h3 className="h6 mt-4">Fotografías</h3>
            {producto.fotos && producto.fotos.length > 0 ? (
              <div className="d-flex flex-wrap gap-3">
                {producto.fotos.map((url, i) => (
                  <img key={i} src={url} alt={`${producto.nombre} ${i + 1}`}
                       className="img-thumbnail" style={{ maxWidth: 220 }} />
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">Este producto no tiene fotos.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}