import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge.jsx';
import { formatCurrency } from '../utils/format.js';

export function OrderCard({ order }) {
  return (
    <Link to={`/orders/${order.orderId}`} className="order-card">
      <div className="order-main">
        <div className="token">{order.orderId}</div>
        <div className="order-file">
          {order.fileName} · {order.pages} pages · {order.options.copies} cop{order.options.copies > 1 ? 'ies' : 'y'}
        </div>
      </div>
      <div className="order-side">
        <span className="order-price">{formatCurrency(order.cost.total)}</span>
        <StatusBadge status={order.status} />
      </div>
    </Link>
  );
}
