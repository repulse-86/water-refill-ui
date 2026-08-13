import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import AppLayout from './layouts/AppLayout';
import Home from './pages/website/Home';
import ModulePage from './pages/dashboard/ModulePage';
import Settings from './pages/settings/Settings';
import Products from './pages/inventory/Products';
import Customers from './pages/customers/Customers';
import Orders from './pages/orders/Orders';
import Delivery from './pages/delivery/Delivery';
import PosTerminal from './pages/pos/PosTerminal';
import MeterReadings from './pages/meter/MeterReadings';
import RequireAuth from './guards/RequireAuth';

function App() {
  return (
    <BrowserRouter>
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
          <Route path="/dashboard" element={<ModulePage title="Dashboard" />} />
          <Route path="/pos" element={<PosTerminal />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/meter-reading" element={<MeterReadings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
