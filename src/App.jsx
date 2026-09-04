import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import GuestLayout from './layouts/GuestLayout';
import AppLayout from './layouts/AppLayout';
import Home from './pages/website/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Settings from './pages/settings/Settings';
import Products from './pages/inventory/Products';
import Customers from './pages/customers/Customers';
import Orders from './pages/orders/Orders';
import Delivery from './pages/delivery/Delivery';
import PosTerminal from './pages/pos/PosTerminal';
import MeterReadings from './pages/meter/MeterReadings';
import Reports from './pages/reports/Reports';
import RequireAuth from './guards/RequireAuth';

function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<PosTerminal />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/meter-reading" element={<MeterReadings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory" element={<Products />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
