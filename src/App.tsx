import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";

function Home() {
  return <div style={{ padding: 40 }}>Conduct Alchemy</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}