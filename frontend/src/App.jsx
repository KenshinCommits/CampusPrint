import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { NewOrder } from './pages/NewOrder.jsx';
import { MyOrders } from './pages/MyOrders.jsx';
import { OrderDetail } from './pages/OrderDetail.jsx';
import { StaffDashboard } from './pages/StaffDashboard.jsx';
import { Loader } from './components/EmptyState.jsx';

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'staff') return <Navigate to="/staff" replace />;
  return <Dashboard />;
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
