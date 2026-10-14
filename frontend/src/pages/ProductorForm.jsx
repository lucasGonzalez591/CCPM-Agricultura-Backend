import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { actualizarProductor, crearProductor, obtenerProductor } from "../api/productoresApi";
import { interpretarError } from "../utils/errores";
import { SEXOS } from "../utils/constantes";
import Alerta from "../components/Alerta";
import Campo from "../components/Campo";

const VACIO = {
  apellido: "", nombre: "", dni: "", sexo: "", telefono: "", email: "",
  maximoTitulo: "", fechaNacimiento: "", departamento: "", municipio: "", domicilio: "",
};

function validar(d) {
  const e = {};
  if (!d.apellido.trim()) e.apellido = "El apellido es obligatorio";
  if (!d.nombre.trim()) e.nombre = "El nombre es obligatorio";
  if (!/^\d{7,8}$/.test(d.dni)) e.dni = "El DNI debe tener 7 u 8 dígitos";
  if (!d.sexo) e.sexo = "El sexo es obligatorio";
  if (d.telefono && !/^[0-9+\-\s]{6,20}$/.test(d.telefono)) e.telefono = "Teléfono inválido";
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Email inválido";
  if (!d.fechaNacimiento) e.fechaNacimiento = "La fecha de nacimiento es obligatoria";
  else if (d.fechaNacimiento >= new Date().toISOString().slice(0, 10))
    e.fechaNacimiento = "La fecha de nacimiento debe ser pasada";
  if (!d.departamento.trim()) e.departamento = "El departamento es obligatorio";
  if (!d.municipio.trim()) e.municipio = "El municipio es obligatorio";
  if (!d.domicilio.trim()) e.domicilio = "El domicilio es obligatorio";
  return e;
}

export default function ProductorForm() {
  const { id } = useParams();
  const editando = Boolean(id);
  const navigate = useNavigate();

  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!editando) return;
    obtenerProductor(id)
      .then((p) => {
        // Los campos opcionales pueden venir en null
        setDatos(Object.fromEntries(Object.keys(VACIO).map((k) => [k, p[k] ?? ""])));
      })
      .catch((e) => setErrorGeneral(interpretarError(e).mensaje))
      .finally(() => setCargando(false));
  }, [id, editando]);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: undefined });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorGeneral("");

    const encontrados = validar(datos);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    // El backend valida el formato de los opcionales: vacío debe viajar como null
    const cuerpo = {
      ...datos,
      telefono: datos.telefono.trim() || null,
      email: datos.email.trim() || null,
      maximoTitulo: datos.maximoTitulo.trim() || null,
    };

    setGuardando(true);
    try {
      if (editando) await actualizarProductor(id, cuerpo);
      else await crearProductor(cuerpo);
      navigate("/productores", {
        state: { exito: editando ? "Productor actualizado correctamente." : "Productor creado correctamente." },
      });
    } catch (err) {
      const { mensaje, campos } = interpretarError(err);
      setErrorGeneral(mensaje);
      setErrores(campos);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <h1 className="h3 mb-3">{editando ? "Editar productor" : "Nuevo productor"}</h1>
      <Alerta tipo="danger" onCerrar={() => setErrorGeneral("")}>{errorGeneral}</Alerta>

      <form onSubmit={guardar} noValidate className="card card-tabla">
        <div className="card-body">
          <div className="row g-3">
            <Campo label="Apellido *" name="apellido" value={datos.apellido} onChange={cambiar} error={errores.apellido} maxLength={80} />
            <Campo label="Nombre *" name="nombre" value={datos.nombre} onChange={cambiar} error={errores.nombre} maxLength={80} />
            <Campo label="DNI *" name="dni" value={datos.dni} onChange={cambiar} error={errores.dni} maxLength={8} inputMode="numeric" />
            <Campo label="Sexo *" name="sexo" value={datos.sexo} onChange={cambiar} error={errores.sexo} opciones={SEXOS} />
            <Campo label="Teléfono" name="telefono" value={datos.telefono} onChange={cambiar} error={errores.telefono} maxLength={20} />
            <Campo label="Email" name="email" type="email" value={datos.email} onChange={cambiar} error={errores.email} maxLength={120} />
            <Campo label="Máximo título alcanzado" name="maximoTitulo" value={datos.maximoTitulo} onChange={cambiar} error={errores.maximoTitulo} maxLength={100} />
            <Campo label="Fecha de nacimiento *" name="fechaNacimiento" type="date" value={datos.fechaNacimiento} onChange={cambiar} error={errores.fechaNacimiento} max={hoy} />
            <Campo label="Departamento *" name="departamento" value={datos.departamento} onChange={cambiar} error={errores.departamento} maxLength={80} />
            <Campo label="Municipio *" name="municipio" value={datos.municipio} onChange={cambiar} error={errores.municipio} maxLength={80} />
            <Campo label="Domicilio *" name="domicilio" col="col-12" value={datos.domicilio} onChange={cambiar} error={errores.domicilio} maxLength={150} />
          </div>
        </div>
        <div className="card-footer d-flex gap-2 justify-content-end">
          <Link to="/productores" className="btn btn-outline-secondary">Cancelar</Link>
          <button type="submit" className="btn btn-success" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}