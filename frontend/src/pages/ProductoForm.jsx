import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { obtenerProducto, crearProducto, actualizarProducto } from "../api/productosApi";
import { listarProductores } from "../api/productoresApi";
import { interpretarError } from "../utils/errores";
import Alerta from "../components/Alerta";

const MAX_FOTOS = 3;
const LADO_MAXIMO = 800;

const VACIO = {
  nombre: "",
  descripcion: "",
  precioUnitario: "",
  lugarVenta: "",
  productorId: "",
  fotos: [],
};

// Lee un archivo de imagen, lo reduce y lo devuelve como data URL en Base64
function imagenABase64(archivo) {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith("image/")) {
      reject(new Error(`"${archivo.name}" no es una imagen.`));
      return;
    }
    const lector = new FileReader();
    lector.onerror = () => reject(new Error(`No se pudo leer "${archivo.name}".`));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`"${archivo.name}" no es una imagen válida.`));
      img.onload = () => {
        const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // fondo blanco para PNG con transparencia
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

export default function ProductoForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [datos, setDatos] = useState(VACIO);
  const [productores, setProductores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [errorFoto, setErrorFoto] = useState("");
  const [campos, setCampos] = useState({});

  useEffect(() => {
    async function iniciar() {
      try {
        const lista = await listarProductores({});
        setProductores(Array.isArray(lista) ? lista : lista?.content ?? []);

        if (editando) {
          const p = await obtenerProducto(id);
          setDatos({
            nombre: p.nombre ?? "",
            descripcion: p.descripcion ?? "",
            precioUnitario: p.precioUnitario ?? "",
            lugarVenta: p.lugarVenta ?? "",
            productorId: p.productorId ?? "",
            fotos: p.fotos ?? [],
          });
        }
      } catch (e) {
        setError(interpretarError(e).mensaje);
      } finally {
        setCargando(false);
      }
    }
    iniciar();
  }, [id, editando]);

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const agregarFotos = async (e) => {
    const archivos = Array.from(e.target.files);
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (archivos.length === 0) return;

    setErrorFoto("");
    const disponibles = MAX_FOTOS - datos.fotos.length;
    if (archivos.length > disponibles) {
      setErrorFoto(`Solo podés agregar ${disponibles} foto(s) más (máximo ${MAX_FOTOS}).`);
      return;
    }

    try {
      const nuevas = await Promise.all(archivos.map(imagenABase64));
      setDatos((d) => ({ ...d, fotos: [...d.fotos, ...nuevas] }));
    } catch (err) {
      setErrorFoto(err.message);
    }
  };

  const quitarFoto = (indice) =>
    setDatos({ ...datos, fotos: datos.fotos.filter((_, i) => i !== indice) });

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setCampos({});

    const payload = {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim() || null,
      precioUnitario: datos.precioUnitario === "" ? null : Number(datos.precioUnitario),
      lugarVenta: datos.lugarVenta.trim(),
      productorId: datos.productorId === "" ? null : Number(datos.productorId),
      fotos: datos.fotos,
    };

    try {
      if (editando) {
        await actualizarProducto(id, payload);
      } else {
        await crearProducto(payload);
      }
      navigate("/productos", {
        state: {
          exito: editando
            ? `Se actualizó el producto ${payload.nombre}.`
            : `Se creó el producto ${payload.nombre}.`,
        },
      });
    } catch (e) {
      const r = interpretarError(e);
      setError(r.mensaje);
      setCampos(r.campos || {});
    } finally {
      setGuardando(false);
    }
  };

  const errorCampo = (nombre) =>
    campos[nombre] ? <div className="invalid-feedback d-block">{campos[nombre]}</div> : null;

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="h3 mb-3">{editando ? "Editar producto" : "Nuevo producto"}</h1>

      <Alerta tipo="danger" onCerrar={() => setError("")}>{error}</Alerta>

      <form onSubmit={guardar} className="card card-tabla">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="nombre">Nombre *</label>
              <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar}
                     className="form-control" maxLength={100} />
              {errorCampo("nombre")}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="precioUnitario">Precio unitario *</label>
              <input id="precioUnitario" name="precioUnitario" type="number" step="0.01" min="0"
                     value={datos.precioUnitario} onChange={cambiar} className="form-control" />
              {errorCampo("precioUnitario")}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="lugarVenta">Lugar de venta *</label>
              <input id="lugarVenta" name="lugarVenta" value={datos.lugarVenta} onChange={cambiar}
                     className="form-control" maxLength={150} />
              {errorCampo("lugarVenta")}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="productorId">Productor *</label>
              <select id="productorId" name="productorId" value={datos.productorId}
                      onChange={cambiar} className="form-select">
                <option value="">Seleccionar...</option>
                {productores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.apellido}, {p.nombre} (DNI {p.dni})
                  </option>
                ))}
              </select>
              {errorCampo("productorId")}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" rows="3" value={datos.descripcion}
                        onChange={cambiar} className="form-control" maxLength={1000} />
              {errorCampo("descripcion")}
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="fotos">
                Fotografías ({datos.fotos.length}/{MAX_FOTOS})
              </label>
              <input id="fotos" type="file" accept="image/*" multiple
                     onChange={agregarFotos}
                     disabled={datos.fotos.length >= MAX_FOTOS}
                     className="form-control" />
              {errorFoto && <div className="text-danger small mt-1">{errorFoto}</div>}
              {errorCampo("fotos")}

              {datos.fotos.length > 0 && (
                <div className="d-flex flex-wrap gap-3 mt-3">
                  {datos.fotos.map((foto, i) => (
                    <div key={i} className="position-relative">
                      <img src={foto} alt={`Foto ${i + 1}`} className="img-thumbnail"
                           style={{ width: 160, height: 160, objectFit: "cover" }} />
                      <button type="button" onClick={() => quitarFoto(i)}
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                              aria-label={`Quitar foto ${i + 1}`}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-success" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </button>
            <Link to="/productos" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </div>
      </form>
    </div>
  );
}