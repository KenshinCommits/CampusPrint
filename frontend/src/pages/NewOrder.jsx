import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { PixelDoc } from '../components/PixelArt.jsx';
import { ArrowLeft, Trash2, CheckCircle2, ArrowRight, Minus, Plus } from 'lucide-react';

export function NewOrder() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw');
  const [sided, setSided] = useState('double');
  const [paperSize, setPaperSize] = useState('A4');
  const [binding, setBinding] = useState('none');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('counter');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cost calculation matching backend:
  // RATE_BW = 2, RATE_COLOR = 8, none: 0, staple: 5, spiral: 30
  const ratePerPage = colorMode === 'color' ? 8 : 2;
  const printCost = ratePerPage * pages * copies;
  const bindingFee = binding === 'spiral' ? 30 : binding === 'staple' ? 5 : 0;
  const bindingCost = bindingFee * copies;
  const totalCost = printCost + bindingCost;

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Please upload a PDF document.');
      return;
    }
    setError('');
    setFile(selectedFile);

    // Estimate pages based on PDF file size if not available
    const estPages = Math.max(1, Math.min(50, Math.round(selectedFile.size / 65000)));
    setPages(estPages || 1);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please attach a PDF document to print.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('copies', copies);
      formData.append('colorMode', colorMode);
      formData.append('sided', sided);
      formData.append('paperSize', paperSize);
      formData.append('binding', binding);
      formData.append('manualPages', pages);
      formData.append('notes', notes);
      formData.append('paymentMethod', paymentMethod);

      const res = await api.placeOrder(formData);
      navigate(`/order/${res.order.orderId}/success`, { state: { order: res.order } });
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Link & Title */}
      <div>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#000',
            marginBottom: '10px',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          NEW PRINT ORDER
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
          Upload your file and select print options
        </p>
      </div>

      {error && (
        <div
          style={{
            background: '#FECACA',
            border: '2px solid #000',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#991B1B',
          }}
        >
          {error}
        </div>
      )}

      {/* Two-Column Grid: Left Upload & Price, Right Settings */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Dropzone & Price Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Dropzone Card */}
            <div
              className="neo-card"
              style={{
                border: '2px dashed #000',
                background: dragActive ? '#FEF08A' : '#FFFFFF',
                textAlign: 'center',
                padding: '40px 24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                transition: 'background 0.15s ease',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />

              <PixelDoc size={72} />

              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.04em' }}>
                  DROP YOUR PDF HERE
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                  or
                </div>
              </div>

              <button
                type="button"
                className="neo-btn primary sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose a File
              </button>

              {/* Uploaded File Item Pill */}
              {file && (
                <div
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    background: '#F0FDF4',
                    border: '2px solid #000',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: '2px 2px 0px #000',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', minWidth: 0 }}>
                    <CheckCircle2 size={18} color="#166534" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {(file.size / (1024 * 1024)).toFixed(1)} MB · {pages} pages
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPages(1);
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary Card */}
            <div className="neo-card">
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.82rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: '14px',
                }}
              >
                PRICE SUMMARY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Print cost</span>
                  <span style={{ fontWeight: 800 }}>₹{printCost}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Binding</span>
                  <span style={{ fontWeight: 800 }}>₹{bindingCost}</span>
                </div>

                <div style={{ borderTop: '2px dashed #000', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem' }}>
                    Total
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.4rem' }}>
                    ₹{totalCost}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !file}
                className="neo-btn primary full-width"
                style={{
                  marginTop: '18px',
                  padding: '12px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{submitting ? 'PLACING ORDER…' : 'PLACE ORDER'}</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Right Column: PRINT SETTINGS */}
          <div className="neo-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.88rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #000',
                paddingBottom: '10px',
              }}
            >
              PRINT SETTINGS
            </div>

            {/* Copies Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="neo-label">Copies</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="neo-btn sm"
                  style={{ width: '34px', height: '34px', padding: 0 }}
                  onClick={() => setCopies((c) => Math.max(1, c - 1))}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', minWidth: '24px', textAlign: 'center' }}>
                  {copies}
                </span>
                <button
                  type="button"
                  className="neo-btn sm"
                  style={{ width: '34px', height: '34px', padding: 0 }}
                  onClick={() => setCopies((c) => Math.min(50, c + 1))}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Color Mode */}
            <div>
              <span className="neo-label" style={{ marginBottom: '8px' }}>Color</span>
              <div className="option-grid">
                <button
                  type="button"
                  className={`option-btn ${colorMode === 'bw' ? 'selected' : ''}`}
                  onClick={() => setColorMode('bw')}
                >
                  B&W
                </button>
                <button
                  type="button"
                  className={`option-btn ${colorMode === 'color' ? 'selected' : ''}`}
                  onClick={() => setColorMode('color')}
                >
                  Color
                </button>
              </div>
            </div>

            {/* Sides */}
            <div>
              <span className="neo-label" style={{ marginBottom: '8px' }}>Sides</span>
              <div className="option-grid">
                <button
                  type="button"
                  className={`option-btn ${sided === 'single' ? 'selected' : ''}`}
                  onClick={() => setSided('single')}
                >
                  Single
                </button>
                <button
                  type="button"
                  className={`option-btn ${sided === 'double' ? 'selected' : ''}`}
                  onClick={() => setSided('double')}
                >
                  Double
                </button>
              </div>
            </div>

            {/* Paper Size */}
            <div>
              <span className="neo-label" style={{ marginBottom: '8px' }}>Paper Size</span>
              <div className="option-grid">
                {['A4', 'Letter', 'A3'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`option-btn ${paperSize === size ? 'selected' : ''}`}
                    onClick={() => setPaperSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Binding */}
            <div>
              <span className="neo-label" style={{ marginBottom: '8px' }}>Binding</span>
              <div className="option-grid">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'staple', label: 'Staple' },
                  { id: 'spiral', label: 'Spiral' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`option-btn ${binding === b.id ? 'selected' : ''}`}
                    onClick={() => setBinding(b.id)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="neo-input-group" style={{ marginBottom: 0 }}>
              <span className="neo-label">Notes (optional)</span>
              <textarea
                rows={2}
                className="neo-textarea"
                placeholder="Any special instructions?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
