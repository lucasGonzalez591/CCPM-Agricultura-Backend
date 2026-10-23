export default function Alerta({ tipo = "danger", children, onCerrar }) {
  if (!children) return null;
  return (
    <div className={`alert alert-${tipo} d-flex justify-content-between align-items-start`} role="alert">
      <div>{children}</div>
      {onCerrar && (
        <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
      )}
    </div>
  );
}