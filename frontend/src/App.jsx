import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { NewOrder } from './pages/NewOrder.jsx';
import { MyOrders } from './pages/MyOrders.jsx';
import { OrderDetail } from './pages/OrderDetail.jsx';
import { StaffDashboard } from './pages/StaffDashboard.jsx';

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'staff' ? '/staff' : '/new-order'} replace />;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/new-order"
            element={
              <Protected role="student">
                <NewOrder />
              </Protected>
            }
          />
          <Route
            path="/my-orders"
            element={
              <Protected role="student">
                <MyOrders />
              </Protected>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <Protected>
                <OrderDetail />
              </Protected>
            }
          />
          <Route
            path="/staff"
            element={
              <Protected role="staff">
                <StaffDashboard />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
