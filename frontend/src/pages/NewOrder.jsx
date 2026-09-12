import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { PixelUploadDoc } from '../components/PixelArt.jsx';
import { PixelArt } from '../components/pixel/index.js';
import { NeoCard, NeoButton } from '../components/ui/index.js';
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
            color: '#000814',
            marginBottom: '12px',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.8vw, 2.6rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            margin: 0,
            textTransform: 'uppercase',
            color: '#000814',
          }}
        >
          NEW PRINT ORDER
        </h1>
        <p style={{ color: '#4B5563', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>
          Upload your file and customize print configuration
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FECACA',
            border: '2px solid #000814',
            borderRadius: '12px',
            boxShadow: '3px 3px 0px 0px #000814',
            padding: '12px 16px',
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#991B1B',
            fontFamily: 'var(--font-heading)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Dropzone & Price Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Dropzone Card: border-2 border-dashed border-black bg-white rounded-2xl */}
            <div
              style={{
                border: '2px dashed #000814',
                borderRadius: '16px', // rounded-2xl
                backgroundColor: dragActive ? '#FEF08A' : '#FFFFFF',
                boxShadow: '4px 4px 0px 0px #000814',
                textAlign: 'center',
                padding: '44px 24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                transition: 'background-color 0.15s ease',
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

              {/* Authentic 16-bit Pixel Art Poster Document & File Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <PixelArt name="goodIdeasDoc" size={76} style={{ filter: 'drop-shadow(3px 3px 0px #000814)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <PixelArt name="pdfBadge" size={26} />
                  <PixelArt name="wordBadge" size={26} />
                  <PixelArt name="imageBadge" size={26} />
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    color: '#000814',
                  }}
                >
                  DROP YOUR PDF HERE
                </div>
                <div style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
                  or
                </div>
              </div>

              {/* Primary button: "Choose a file" (Yellow #FFC300 with 2px black border and shadow) */}
              <NeoButton
                type="button"
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose a file
              </NeoButton>

              {/* Uploaded File Pill Banner Below */}
              {file && (
                <div
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    backgroundColor: '#BBF7D0',
                    border: '2px solid #000814',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: '3px 3px 0px 0px #000814',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', minWidth: 0 }}>
                    <CheckCircle2 size={20} color="#000814" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: '0.88rem',
                          fontFamily: 'var(--font-heading)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: '#000814',
                        }}
                      >
                        {file.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#1F2937', fontWeight: 700 }}>
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
                    title="Remove file"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#000814',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary Card */}
            <NeoCard variant="default" style={{ padding: '24px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  marginBottom: '16px',
                }}
              >
                PRICE SUMMARY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B5563', fontWeight: 600 }}>Print cost</span>
                  <span style={{ fontWeight: 900, fontFamily: 'var(--font-heading)' }}>₹{printCost}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B5563', fontWeight: 600 }}>Binding</span>
                  <span style={{ fontWeight: 900, fontFamily: 'var(--font-heading)' }}>₹{bindingCost}</span>
                </div>

                <div style={{ borderTop: '2px dashed #000814', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.15rem' }}>
                    Total
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.6rem', color: '#000814' }}>
                    ₹{totalCost}
                  </span>
                </div>
              </div>

              {/* Full-width CTA button: "PLACE ORDER ->" (bg-[#FFC300] font-black text-lg py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000]) */}
              <button
                type="submit"
                disabled={submitting || !file}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  backgroundColor: '#FFC300',
                  color: '#000814',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  padding: '14px',
                  borderRadius: '12px', // rounded-xl
                  border: '2px solid #000814',
                  boxShadow: '4px 4px 0px 0px #000814',
                  cursor: submitting || !file ? 'not-allowed' : 'pointer',
                  opacity: submitting || !file ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'transform 0.08s ease, box-shadow 0.08s ease',
                }}
              >
                <span>{submitting ? 'PLACING ORDER…' : 'PLACE ORDER ->'}</span>
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </NeoCard>
          </div>

          {/* Right Column: PRINT SETTINGS */}
          <NeoCard variant="default" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderBottom: '2px solid #000814',
                paddingBottom: '12px',
                color: '#000814',
              }}
            >
              PRINT SETTINGS
            </div>

            {/* Copies Counter: stepper input with bold + and - square buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Copies
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    border: '2px solid #000814',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '2px 2px 0px 0px #000814',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 900,
                  }}
                  onClick={() => setCopies((c) => Math.max(1, c - 1))}
                >
                  <Minus size={16} strokeWidth={3} />
                </button>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    minWidth: '32px',
                    textAlign: 'center',
                  }}
                >
                  {copies}
                </span>
                <button
                  type="button"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    border: '2px solid #000814',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '2px 2px 0px 0px #000814',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 900,
                  }}
                  onClick={() => setCopies((c) => Math.min(50, c + 1))}
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Color Mode: Radio selector pills for B&W and Color */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                Color
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { id: 'bw', label: 'B&W' },
                  { id: 'color', label: 'Color' },
                ].map((item) => {
                  const selected = colorMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setColorMode(item.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '2px solid #000814',
                        backgroundColor: selected ? '#FFC300' : '#FFFFFF',
                        boxShadow: selected ? '2px 2px 0px 0px #000814' : 'none',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sides: Radio selector pills for Single and Double */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                Sides
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { id: 'single', label: 'Single' },
                  { id: 'double', label: 'Double' },
                ].map((item) => {
                  const selected = sided === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSided(item.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '2px solid #000814',
                        backgroundColor: selected ? '#FFC300' : '#FFFFFF',
                        boxShadow: selected ? '2px 2px 0px 0px #000814' : 'none',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paper Size: A4 and A3 selection pills */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                Paper Size
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['A4', 'Letter', 'A3'].map((size) => {
                  const selected = paperSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPaperSize(size)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: '2px solid #000814',
                        backgroundColor: selected ? '#FFC300' : '#FFFFFF',
                        boxShadow: selected ? '2px 2px 0px 0px #000814' : 'none',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Binding: None, Staple, and Spiral */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                Binding
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: 'none', label: 'None' },
                  { id: 'staple', label: 'Staple' },
                  { id: 'spiral', label: 'Spiral' },
                ].map((item) => {
                  const selected = binding === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBinding(item.id)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: '2px solid #000814',
                        backgroundColor: selected ? '#FFC300' : '#FFFFFF',
                        boxShadow: selected ? '2px 2px 0px 0px #000814' : 'none',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                Notes (optional)
              </span>
              <textarea
                rows={2}
                placeholder="Any special instructions for the print shop?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #000814',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  resize: 'none',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '2px 2px 0px 0px #000814',
                }}
              />
            </div>
          </NeoCard>
        </div>
      </form>
    </div>
  );
}

export default NewOrder;
