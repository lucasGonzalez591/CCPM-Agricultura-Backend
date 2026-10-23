import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  obtenerResumen, productoresPorDepartamento, productoresPorMunicipio,
  productosPorProductor, productosPorLugarVenta, precioPromedioPorProducto,
} from "../api/reportesApi";
import { interpretarError } from "../utils/errores";
import Alerta from "../components/Alerta";

const COLORES = ["#198754", "#20c997", "#0d6efd", "#fd7e14", "#6f42c1", "#d63384", "#ffc107", "#6c757d"];

const lista = (d) => (Array.isArray(d) ? d : d?.content ?? []);
const conteos = (d) =>
  lista(d).map((r) => ({ nombre: r.etiqueta ?? "Sin dato", cantidad: Number(r.cantidad) }));
const promedios = (d) =>
  lista(d).map((r) => ({ nombre: r.etiqueta ?? "Sin dato", promedio: Number(r.promedio), cantidad: Number(r.cantidad) }));

const pesos = (v) =>
  Number(v ?? 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

function Indicador({ titulo, valor }) {
  return (
    <div className="col-6 col-md-4 col-lg-2">
      <div className="card card-tabla h-100">
        <div className="card-body text-center">
          <div className="text-muted small">{titulo}</div>
          <div className="h4 mb-0 mt-1">{valor}</div>
        </div>
      </div>
    </div>
  );
}

function Tarjeta({ titulo, children }) {
  return (
    <div className="card card-tabla h-100">
      <div className="card-body">
        <h2 className="h6 mb-3">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

function SinDatos() {
  return <p className="text-muted mb-0">No hay datos para mostrar.</p>;
}

// Barras horizontales: las etiquetas largas se leen bien y la altura crece con la cantidad de filas
function BarrasHorizontales({ datos, clave, formato, color = "#198754" }) {
  if (datos.length === 0) return <SinDatos />;
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, datos.length * 38)}>
      <BarChart data={datos} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" allowDecimals={false} tickFormatter={formato} />
        <YAxis type="category" dataKey="nombre" width={130} />
        <Tooltip formatter={(v) => (formato ? formato(v) : v)} />
        <Bar dataKey={clave} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function TablaConteo({ datos, columna }) {
  if (datos.length === 0) return <SinDatos />;
  return (
    <div className="table-responsive" style={{ maxHeight: 320 }}>
      <table className="table table-sm table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>{columna}</th>
            <th className="text-end">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.nombre}>
              <td>{d.nombre}</td>
              <td className="text-end">{d.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reportes() {
  const [resumen, setResumen] = useState(null);
  const [porDepto, setPorDepto] = useState([]);
  const [porMunicipio, setPorMunicipio] = useState([]);
  const [porProductor, setPorProductor] = useState([]);
  const [porLugar, setPorLugar] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const [res, dep, mun, prod, lug, pre] = await Promise.all([
          obtenerResumen(),
          productoresPorDepartamento(),
          productoresPorMunicipio(),
          productosPorProductor(),
          productosPorLugarVenta(),
          precioPromedioPorProducto(),
        ]);
        setResumen(res);
        setPorDepto(conteos(dep));
        setPorMunicipio(conteos(mun));
        setPorProductor(conteos(prod));
        setPorLugar(conteos(lug));
        setPrecios(promedios(pre));
      } catch (e) {
        setError(interpretarError(e).mensaje);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="h3 mb-3">Reportes y estadísticas</h1>

      <Alerta tipo="danger" onCerrar={() => setError("")}>{error}</Alerta>

      {resumen && (
        <div className="row g-3 mb-4">
          <Indicador titulo="Productores" valor={resumen.totalProductores} />
          <Indicador titulo="Productos" valor={resumen.totalProductos} />
          <Indicador
            titulo="Productos por productor"
            valor={Number(resumen.promedioProductosPorProductor ?? 0).toLocaleString("es-AR", { maximumFractionDigits: 2 })}
          />
          <Indicador titulo="Precio promedio" valor={pesos(resumen.precioPromedio)} />
          <Indicador titulo="Precio mínimo" valor={pesos(resumen.precioMinimo)} />
          <Indicador titulo="Precio máximo" valor={pesos(resumen.precioMaximo)} />
        </div>
      )}

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <Tarjeta titulo="Productores por departamento">
            <BarrasHorizontales datos={porDepto} clave="cantidad" />
          </Tarjeta>
        </div>
        <div className="col-12 col-lg-6">
          <Tarjeta titulo="Distribución de productos por lugar de venta">
            {porLugar.length === 0 ? (
              <SinDatos />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={porLugar} dataKey="cantidad" nameKey="nombre" outerRadius={100} label>
                    {porLugar.map((_, i) => (
                      <Cell key={i} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Tarjeta>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <Tarjeta titulo="Precio promedio por producto">
            <BarrasHorizontales datos={precios} clave="promedio" formato={pesos} color="#0d6efd" />
          </Tarjeta>
        </div>
        <div className="col-12 col-lg-6">
          <Tarjeta titulo="Productos por productor">
            <BarrasHorizontales datos={porProductor} clave="cantidad" color="#fd7e14" />
          </Tarjeta>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <Tarjeta titulo="Productores por municipio">
            <TablaConteo datos={porMunicipio} columna="Municipio" />
          </Tarjeta>
        </div>
        <div className="col-12 col-lg-6">
          <Tarjeta titulo="Detalle de precios promedio">
            {precios.length === 0 ? (
              <SinDatos />
            ) : (
              <div className="table-responsive" style={{ maxHeight: 320 }}>
                <table className="table table-sm table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Promedio</th>
                      <th className="text-end">Registros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {precios.map((p) => (
                      <tr key={p.nombre}>
                        <td>{p.nombre}</td>
                        <td className="text-end">{pesos(p.promedio)}</td>
                        <td className="text-end">{p.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}