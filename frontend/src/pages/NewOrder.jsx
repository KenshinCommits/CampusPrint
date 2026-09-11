import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

// Mirrors backend/src/utils/cost.js defaults, purely for the *live preview*
// shown while the student is still choosing options. The backend always
// recomputes the authoritative price on submit - this is just UX, not trust.
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
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState('');
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw');
  const [sided, setSided] = useState('single');
  const [paperSize, setPaperSize] = useState('A4');
  const [binding, setBinding] = useState('none');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const estimate = useMemo(
    () => estimateCost({ pages: Number(pages), copies: Number(copies), colorMode, binding }),
    [pages, copies, colorMode, binding]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!file) return setError('Please choose a file to upload');
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (pages) formData.append('pages', pages);
      formData.append('copies', copies);
      formData.append('colorMode', colorMode);
      formData.append('sided', sided);
      formData.append('paperSize', paperSize);
      formData.append('binding', binding);
      formData.append('notes', notes);
      formData.append('paymentMethod', paymentMethod);

      const { order } = await api.placeOrder(formData);
      navigate(`/orders/${order.orderId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h1>Place a print order</h1>
      <form onSubmit={onSubmit} className="order-form">
        <label>
          Document (PDF works best - page count is detected automatically)
          <input
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0] || null)}
            required
          />
        </label>

        <label>
          Pages{' '}
          <span className="hint-inline">
            (leave blank for PDFs - auto-detected; required for other file types)
          </span>
          <input type="number" min="1" value={pages} onChange={(e) => setPages(e.target.value)} />
        </label>

        <div className="grid-2">
          <label>
            Copies
            <input type="number" min="1" value={copies} onChange={(e) => setCopies(e.target.value)} />
          </label>
          <label>
            Color
            <select value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
              <option value="bw">Black & White</option>
              <option value="color">Color</option>
            </select>
          </label>
          <label>
            Sides
            <select value={sided} onChange={(e) => setSided(e.target.value)}>
              <option value="single">Single-sided</option>
              <option value="double">Double-sided</option>
            </select>
          </label>
          <label>
            Paper size
            <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
            </select>
          </label>
          <label>
            Binding
            <select value={binding} onChange={(e) => setBinding(e.target.value)}>
              <option value="none">None</option>
              <option value="staple">Staple</option>
              <option value="spiral">Spiral</option>
            </select>
          </label>
          <label>
            Payment
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="online">Pay online now</option>
              <option value="counter">Pay at counter</option>
            </select>
          </label>
        </div>

        <label>
          Notes for the shop (optional)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </label>

        <div className="cost-preview">
          {estimate ? (
            <>
              <div>Print: ₹{estimate.printCost.toFixed(2)}</div>
              <div>Binding: ₹{estimate.bindingCost.toFixed(2)}</div>
              <div className="total">Estimated total: ₹{estimate.total.toFixed(2)}</div>
            </>
          ) : (
            <div className="hint">Enter a page count (or upload a PDF) to see a live price estimate</div>
          )}
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          {busy ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
