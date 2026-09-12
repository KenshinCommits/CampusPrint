import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { StudentDashboard } from './pages/StudentDashboard.jsx';
import { NewOrder } from './pages/NewOrder.jsx';
import { MyOrders } from './pages/MyOrders.jsx';
import { OrderDetail } from './pages/OrderDetail.jsx';
import { OrderSuccess } from './pages/OrderSuccess.jsx';
import { StaffDashboard } from './pages/StaffDashboard.jsx';

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
        Loading session…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'staff' ? '/staff' : '/dashboard'} replace />;
  }
  return children;
}

function Home() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'staff' ? '/staff' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Protected role="student">
              <StudentDashboard />
            </Protected>
          }
        />

        {/* New Order Creator */}
        <Route
          path="/order"
          element={
            <Protected role="student">
              <NewOrder />
            </Protected>
          }
        />
        <Route
          path="/new-order"
          element={
            <Protected role="student">
              <NewOrder />
            </Protected>
          }
        />

        {/* Order Success / Placed Screen */}
        <Route
          path="/order/:id/success"
          element={
            <Protected>
              <OrderSuccess />
            </Protected>
          }
        />
        <Route
          path="/order-placed"
          element={
            <Protected>
              <OrderSuccess />
            </Protected>
          }
        />

        {/* Order Live Status / Details */}
        <Route
          path="/order/:id"
          element={
            <Protected>
              <OrderDetail />
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

        {/* My Orders List */}
        <Route
          path="/orders"
          element={
            <Protected role="student">
              <MyOrders />
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

        {/* Staff Shop Queue */}
        <Route
          path="/staff"
          element={
            <Protected role="staff">
              <StaffDashboard />
            </Protected>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
