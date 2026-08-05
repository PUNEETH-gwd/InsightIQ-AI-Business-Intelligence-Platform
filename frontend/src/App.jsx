import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionStudio from "./pages/PredictionStudio";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
  path="/prediction"
  element={<PredictionStudio />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;