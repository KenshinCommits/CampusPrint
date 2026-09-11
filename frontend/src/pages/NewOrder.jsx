import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { FileUploader } from '../components/FileUploader.jsx';
import { Stepper } from '../components/Stepper.jsx';
import { OptionCard } from '../components/OptionCard.jsx';
import { PriceSummary } from '../components/PriceSummary.jsx';
import { Button } from '../components/Button.jsx';
import { estimatePdfPages } from '../utils/pdfPages.js';

const RATES = { bw: 2, color: 8, bindingStaple: 0, bindingSpiral: 20 };

function estimateCost({ pages, copies, colorMode, binding }) {
  if (!pages || pages <= 0) return null;
  const perPage = colorMode === 'color' ? RATES.color : RATES.bw;
  const printCost = perPage * pages * copies;
  const bindingFee = binding === 'staple' ? RATES.bindingStaple : binding === 'spiral' ? RATES.bindingSpiral : 0;
  const bindingCost = bindingFee * copies;
  return { printCost, bindingCost, total: printCost + bindingCost };
}

export function NewOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [file, setFile] = useState(null);
  const [estimatedPages, setEstimatedPages] = useState(null);
  const [manualPages, setManualPages] = useState('');
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw');
  const [sided, setSided] = useState('single');
  const [paperSize, setPaperSize] = useState('A4');
  const [binding, setBinding] = useState('none');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isPdf = file && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name));

  useEffect(() => {
    if (file && isPdf) {
      setEstimatedPages(null);
      estimatePdfPages(file).then(setEstimatedPages);
    } else {
      setEstimatedPages(null);
    }
  }, [file, isPdf]);

  const pages = isPdf ? estimatedPages : Number(manualPages) || null;

  const estimate = useMemo(
    () => estimateCost({ pages, copies: Number(copies), colorMode, binding }),
    [pages, copies, colorMode, binding]
  );

  function onFile(f) {
    setFile(f);
    setManualPages('');
    setError('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!file) return setError("DROP A FILE FIRST — that's what we'll print.");
    if (!isPdf && !manualPages) return setError('Please enter a page count for this file type.');
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (!isPdf) formData.append('pages', manualPages);
      formData.append('copies', copies);
      formData.append('colorMode', colorMode);
      formData.append('sided', sided);
      formData.append('paperSize', paperSize);
      formData.append('binding', binding);
      formData.append('notes', notes);
      formData.append('paymentMethod', 'counter');

      const { order } = await api.placeOrder(formData);
      toast(`🎉 Order ${order.orderId} placed!`, 'success');
      navigate(`/orders/${order.orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <h1>LET'S GET IT PRINTED.</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Upload, configure, and see your price update live.</p>

      <form onSubmit={onSubmit}>
        <div className="two-col">
          <div className="stack">
            <div className="card">
              <h3 className="upper">1. Your Document</h3>
              <FileUploader file={file} onSelect={onFile} onRemove={() => setFile(null)} pages={isPdf ? estimatedPages : Number(manualPages) || null} />
              {file && !isPdf && (
                <div className="field" style={{ marginTop: 14 }}>
                  <label>Number of pages</label>
                  <input type="number" min="1" value={manualPages} onChange={(e) => setManualPages(e.target.value)} required />
                  <span className="field-hint">This file type needs a manual page count.</span>
                </div>
              )}
              {file && isPdf && estimatedPages === null && (
                <p className="hint" style={{ marginTop: 10 }}>Detecting page count…</p>
              )}
            </div>

            <div className="card">
              <h3 className="upper">2. Print Options</h3>

              <div className="field">
                <label>Copies</label>
                <Stepper value={copies} onChange={setCopies} />
              </div>

              <div className="field">
                <label>Color</label>
                <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <OptionCard title="Black &amp; White" sub={`₹${RATES.bw}/page`} selected={colorMode === 'bw'} onClick={() => setColorMode('bw')} />
                  <OptionCard title="Color" sub={`₹${RATES.color}/page`} selected={colorMode === 'color'} onClick={() => setColorMode('color')} tone="blue" />
                </div>
              </div>

              <div className="field">
                <label>Sides</label>
                <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <OptionCard title="Single-sided" selected={sided === 'single'} onClick={() => setSided('single')} />
                  <OptionCard title="Double-sided" selected={sided === 'double'} onClick={() => setSided('double')} tone="blue" />
                </div>
              </div>

              <div className="field">
                <label>Paper Size</label>
                <div className="option-grid">
                  {['A4', 'A3', 'Letter'].map((size) => (
                    <OptionCard key={size} title={size} selected={paperSize === size} onClick={() => setPaperSize(size)} />
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Binding</label>
                <div className="option-grid">
                  <OptionCard title="None" selected={binding === 'none'} onClick={() => setBinding('none')} />
                  <OptionCard title="Stapled" sub="Free" selected={binding === 'staple'} onClick={() => setBinding('staple')} tone="blue" />
                  <OptionCard title="Spiral" sub={`+₹${RATES.bindingSpiral}`} selected={binding === 'spiral'} onClick={() => setBinding('spiral')} tone="blue" />
                </div>
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label>Notes</label>
                <textarea placeholder="Any special instructions?" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
              </div>
            </div>
          </div>

          <PriceSummary
            pages={pages}
            options={{ copies, colorMode, sided, paperSize, binding }}
            estimate={estimate}
            actions={
              <div style={{ marginTop: 18 }}>
                {error && <p className="error-text">{error}</p>}
                <Button type="submit" className="btn-block" disabled={busy || !estimate}>
                  {busy ? 'Placing order…' : 'Place Order →'}
                </Button>
              </div>
            }
          />
        </div>
      </form>
    </div>
  );
}
