import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import Home from './pages/website/Home';
import Placeholder from './pages/dashboard/Placeholder';
import RequireAuth from './guards/RequireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          {/* Add more routes as needed */}
        </Route>
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Placeholder />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;