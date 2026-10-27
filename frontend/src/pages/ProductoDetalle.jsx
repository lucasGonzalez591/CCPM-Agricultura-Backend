import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../api/productosApi";
import { interpretarError } from "../utils/errores";
import Alerta from "../components/Alerta";

function Carrusel({ fotos, nombre }) {
  const [actual, setActual] = useState(0);
  const total = fotos.length;

  const anterior = () => setActual((i) => (i - 1 + total) % total);
  const siguiente = () => setActual((i) => (i + 1) % total);

  const teclas = (e) => {
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") siguiente();
  };

  return (
    <div tabIndex={0} onKeyDown={teclas} style={{ maxWidth: 640, outline: "none" }}>
      <div
        className="position-relative rounded overflow-hidden bg-dark"
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={fotos[actual]}
          alt={`${nombre} ${actual + 1} de ${total}`}
          className="w-100 h-100"
          style={{ objectFit: "contain" }}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              className="btn btn-dark position-absolute top-50 start-0 translate-middle-y ms-2 opacity-75"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={siguiente}
              className="btn btn-dark position-absolute top-50 end-0 translate-middle-y me-2 opacity-75"
              aria-label="Foto siguiente"
            >
              ›
            </button>
            <span className="badge text-bg-dark position-absolute bottom-0 end-0 m-2 opacity-75">
              {actual + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="d-flex gap-2 mt-2">
          {fotos.map((foto, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActual(i)}
              className={"p-0 border-2 rounded overflow-hidden bg-transparent " +
                (i === actual ? "border border-success" : "border border-light")}
              style={{ width: 72, height: 54, opacity: i === actual ? 1 : 0.6 }}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === actual}
            >
              <img src={foto} alt="" className="w-100 h-100" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
            <div className="row g-4">
              <div className="col-12 col-lg-6">
                {producto.fotos && producto.fotos.length > 0 ? (
                  <Carrusel key={producto.id} fotos={producto.fotos} nombre={producto.nombre} />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center rounded bg-light text-muted"
                    style={{ aspectRatio: "4 / 3", maxWidth: 640 }}
                  >
                    Este producto no tiene fotos.
                  </div>
                )}
              </div>

              <div className="col-12 col-lg-6">
                <h2 className="h4">{producto.nombre}</h2>
                <p className="text-muted">{producto.descripcion || "Sin descripción."}</p>

                <dl className="row mb-0">
                  <dt className="col-sm-4">Precio unitario</dt>
                  <dd className="col-sm-8">
                    {Number(producto.precioUnitario).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </dd>

                  <dt className="col-sm-4">Lugar de venta</dt>
                  <dd className="col-sm-8">{producto.lugarVenta}</dd>

                  <dt className="col-sm-4">Productor</dt>
                  <dd className="col-sm-8">
                    <Link to={`/productores/${producto.productorId}`}>{producto.productorNombre}</Link>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}