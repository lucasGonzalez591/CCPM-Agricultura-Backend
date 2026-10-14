export default function ConfirmarModal({ abierto, titulo, children, onConfirmar, onCancelar, procesando }) {
  if (!abierto) return null;
  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancelar} />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onCancelar} disabled={procesando}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={onConfirmar} disabled={procesando}>
                {procesando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}