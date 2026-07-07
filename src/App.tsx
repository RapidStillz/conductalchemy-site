import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Licensing from "./pages/licensing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Keep the public homepage isolated from the working licensing and admin routes. */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/licensing" element={<Licensing />} />
      </Routes>
    </BrowserRouter>
  );
}
