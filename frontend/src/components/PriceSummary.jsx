import { formatCurrency, optionsSummary } from '../utils/format.js';

export function PriceSummary({ pages, options, estimate, actions }) {
  return (
    <div className="card price-summary">
      <h3 className="upper">Your Print</h3>
      {pages ? (
        <div className="stack" style={{ gap: 4, marginBottom: 14 }}>
          <div className="price-line muted"><span>Pages</span><span>{pages}</span></div>
          <div className="price-line muted"><span>Copies</span><span>{options.copies}</span></div>
          <div className="price-line muted"><span>Options</span><span style={{ textAlign: 'right' }}>{optionsSummary(options)}</span></div>
        </div>
      ) : (
        <p className="hint">Upload a document to see your live price.</p>
      )}

      {estimate ? (
        <>
          <div className="price-line"><span>Print cost</span><span>{formatCurrency(estimate.printCost)}</span></div>
          <div className="price-line"><span>Binding</span><span>{formatCurrency(estimate.bindingCost)}</span></div>
          <div className="price-total">
            <span className="label">Total</span>
            <span className="amount">{formatCurrency(estimate.total)}</span>
          </div>
        </>
      ) : null}

      {actions}
    </div>
  );
}
