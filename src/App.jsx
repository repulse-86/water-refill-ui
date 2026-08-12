import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import AppLayout from './layouts/AppLayout';
import Home from './pages/website/Home';
import ModulePage from './pages/dashboard/ModulePage';
import Settings from './pages/settings/Settings';
import Products from './pages/inventory/Products';
import Customers from './pages/customers/Customers';
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
          <Route path="/pos" element={<ModulePage title="POS & Refill Sales" />} />
          <Route path="/orders" element={<ModulePage title="Order Management & Delivery" />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/meter-reading" element={<ModulePage title="Meter Reading & Shift Audit" />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/inventory" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
