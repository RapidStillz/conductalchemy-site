import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Licensing from "./pages/licensing";
import DesignGate from "./pages/designGate";

function Home() {
  return <div style={{ padding: 40 }}>Conduct Alchemy</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/licensing" element={<Licensing />} />
        <Route path="/design-gate" element={<DesignGate />} />
      </Routes>
    </BrowserRouter>
  );
}
