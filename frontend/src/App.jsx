import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Occupancy from "./pages/Occupancy";
import Electricity from "./pages/Electricity";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Rental 360</h1>

        <hr />

        <nav>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/rooms">Rooms</Link> |{" "}
          <Link to="/tenants">Tenants</Link> |{" "}
          <Link to="/occupancy">Occupancy</Link> |{" "}
          <Link to="/electricity">Electricity</Link> |{" "}
          <Link to="/payments">Payments</Link> |{" "}
          <Link to="/reports">Reports</Link>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/occupancy" element={<Occupancy />} />
          <Route path="/electricity" element={<Electricity />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;