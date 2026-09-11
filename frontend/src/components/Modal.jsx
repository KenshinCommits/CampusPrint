export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        {children}
        {footer && <div className="btn-row" style={{ marginTop: 18 }}>{footer}</div>}
      </div>
    </div>
  );
}
