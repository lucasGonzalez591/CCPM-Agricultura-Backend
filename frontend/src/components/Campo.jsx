export default function Campo({
  label, name, value, onChange, error, type = "text", opciones, col = "col-md-6", ...resto
}) {
  const clase = (opciones ? "form-select" : "form-control") + (error ? " is-invalid" : "");
  return (
    <div className={col}>
      <label htmlFor={name} className="form-label">{label}</label>
      {opciones ? (
        <select id={name} name={name} value={value} onChange={onChange} className={clase} {...resto}>
          <option value="">Seleccionar...</option>
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
          ))}
        </select>
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange} className={clase} {...resto} />
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
