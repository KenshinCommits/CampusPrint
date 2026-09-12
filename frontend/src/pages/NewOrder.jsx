import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { Upload, FileText, X, ArrowRight, Minus, Plus, AlertCircle } from 'lucide-react';

export function NewOrder() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [pages, setPages] = useState(0);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw');
  const [sided, setSided] = useState('double');
  const [paperSize, setPaperSize] = useState('A4');
  const [binding, setBinding] = useState('staple');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('counter');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Cost calculation matching backend:
  // RATE_BW = 2, RATE_COLOR = 8, none: 0, staple: 5, spiral: 30
  const ratePerPage = colorMode === 'color' ? 8 : 2;
  const printCost = file && pages > 0 ? ratePerPage * pages * copies : 0;
  const bindingFee = binding === 'spiral' ? 30 : binding === 'staple' ? 5 : 0;
  const bindingCost = file && pages > 0 ? bindingFee * copies : 0;
  const totalCost = printCost + bindingCost;

  async function handleFileSelect(selectedFile) {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Please upload a PDF document.');
      return;
    }
    setError('');
    setFile(selectedFile);

    // Accurately parse PDF page count from file buffer
    try {
      const buffer = await selectedFile.slice(0, 150000).arrayBuffer();
      const text = new TextDecoder('latin1').decode(buffer);
      const countMatch = text.match(/\/Count\s+(\d+)/);
      if (countMatch && Number(countMatch[1]) > 0) {
        setPages(Number(countMatch[1]));
        return;
      }
      
      const fullBuffer = await selectedFile.arrayBuffer();
      const fullText = new TextDecoder('latin1').decode(fullBuffer);
      const pageMatches = fullText.match(/\/Type\s*\/Page\b/g);
      if (pageMatches && pageMatches.length > 0) {
        setPages(pageMatches.length);
        return;
      }
    } catch {
      // fallback
    }
    setPages(1);
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
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          fontWeight: 900,
          marginBottom: '24px',
          letterSpacing: '-0.02em',
        }}
      >
        LET'S GET IT PRINTED.
      </h1>

      {error && (
        <div
          style={{
            background: '#FEE2E2',
            border: '2px solid #EF4444',
            color: '#991B1B',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '28px',
          alignItems: 'start',
        }}
        className="order-grid"
      >
        {/* Left Column: Steps 1 & 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Upload Document */}
          <div className="neo-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  background: '#000',
                  color: '#fff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                }}
              >
                1
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                Upload Document
              </h2>
            </div>

            {!file ? (
              <div
                className={`dropzone ${dragActive ? 'drag-active' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={36} strokeWidth={2.2} />
                <div className="dropzone-title">DROP YOUR PDF HERE</div>
                <div className="dropzone-desc">or</div>
                <button
                  type="button"
                  className="neo-btn sm primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  BROWSE FILES
                </button>
                <div className="dropzone-desc" style={{ marginTop: '4px' }}>
                  PDF only · Maximum 25 MB
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div
                style={{
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  background: '#FFFDF9',
                  boxShadow: '2px 2px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      background: '#FEE2E2',
                      border: '1.5px solid #000',
                      borderRadius: '6px',
                      padding: '8px',
                      color: '#DC2626',
                    }}
                  >
                    <FileText size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · {pages} pages
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Pages:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={pages}
                    onChange={(e) => setPages(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    style={{
                      width: '60px',
                      padding: '4px 8px',
                      border: '2px solid #000',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPages(0);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Print Options */}
          <div className="neo-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  background: '#000',
                  color: '#fff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                }}
              >
                2
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                Print Options
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Copies */}
              <div>
                <label className="neo-label">Copies</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    className="neo-btn sm"
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      minWidth: '36px',
                      textAlign: 'center',
                    }}
                  >
                    {copies}
                  </span>
                  <button
                    type="button"
                    className="neo-btn sm"
                    onClick={() => setCopies(copies + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Color Mode */}
              <div>
                <label className="neo-label">Color Mode</label>
                <div className="option-group">
                  <button
                    type="button"
                    className={`option-btn ${colorMode === 'bw' ? 'selected' : ''}`}
                    onClick={() => setColorMode('bw')}
                  >
                    B&W (₹2/pg)
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${colorMode === 'color' ? 'selected' : ''}`}
                    onClick={() => setColorMode('color')}
                  >
                    Color (₹8/pg)
                  </button>
                </div>
              </div>

              {/* Sided */}
              <div>
                <label className="neo-label">Sides</label>
                <div className="option-group">
                  <button
                    type="button"
                    className={`option-btn ${sided === 'single' ? 'selected' : ''}`}
                    onClick={() => setSided('single')}
                  >
                    Single-sided
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${sided === 'double' ? 'selected' : ''}`}
                    onClick={() => setSided('double')}
                  >
                    Double-sided
                  </button>
                </div>
              </div>

              {/* Paper Size */}
              <div>
                <label className="neo-label">Paper Size</label>
                <div className="option-group">
                  <button
                    type="button"
                    className={`option-btn ${paperSize === 'A4' ? 'selected' : ''}`}
                    onClick={() => setPaperSize('A4')}
                  >
                    A4 (Standard)
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${paperSize === 'A3' ? 'selected' : ''}`}
                    onClick={() => setPaperSize('A3')}
                  >
                    A3 (Poster)
                  </button>
                </div>
              </div>

              {/* Binding */}
              <div>
                <label className="neo-label">Binding</label>
                <div className="option-group">
                  <button
                    type="button"
                    className={`option-btn ${binding === 'none' ? 'selected' : ''}`}
                    onClick={() => setBinding('none')}
                  >
                    None (₹0)
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${binding === 'staple' ? 'selected' : ''}`}
                    onClick={() => setBinding('staple')}
                  >
                    Stapled (₹5)
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${binding === 'spiral' ? 'selected' : ''}`}
                    onClick={() => setBinding('spiral')}
                  >
                    Spiral (₹30)
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="neo-label">Special Instructions (Optional)</label>
                <textarea
                  className="neo-textarea"
                  rows="2"
                  placeholder="e.g. Please print page 1 in color, rest B&W"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card */}
        <div className="sticky-receipt">
          <div className="receipt-header">
            <span className="receipt-title">YOUR PRINT</span>
          </div>

          <div className="receipt-body">
            <div className="receipt-row">
              <span className="receipt-row-label">Pages</span>
              <span className="receipt-row-val">
                {file && pages > 0 ? `${pages} ${pages === 1 ? 'page' : 'pages'}` : '—'}
              </span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Copies</span>
              <span className="receipt-row-val">{copies}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Color</span>
              <span className="receipt-row-val">
                {colorMode === 'color' ? 'Color' : 'B&W'}
              </span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Sides</span>
              <span className="receipt-row-val">
                {sided === 'double' ? 'Double' : 'Single'}
              </span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Paper</span>
              <span className="receipt-row-val">{paperSize}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Binding</span>
              <span className="receipt-row-val" style={{ textTransform: 'capitalize' }}>
                {binding === 'none' ? 'None' : binding === 'staple' ? 'Stapled' : 'Spiral'}
              </span>
            </div>

            <div className="receipt-divider" />

            <div className="receipt-row">
              <span className="receipt-row-label">PRINT COST</span>
              <span className="receipt-row-val">₹{printCost}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">BINDING</span>
              <span className="receipt-row-val">₹{bindingCost}</span>
            </div>

            <div className="receipt-total-bar">
              <span className="receipt-total-label">TOTAL</span>
              <span className="receipt-total-amt">₹{totalCost}</span>
            </div>

            <button
              type="button"
              className="neo-btn primary full-width"
              disabled={submitting || !file || pages <= 0}
              onClick={handleSubmit}
              style={{ padding: '14px', fontSize: '1.05rem', marginTop: '6px' }}
            >
              <span>
                {submitting
                  ? 'PROCESSING…'
                  : !file
                  ? 'ATTACH PDF FIRST'
                  : 'PLACE ORDER'}
              </span>
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
