import './App.css'; 
import './components/Admin.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentScanner from "./components/StudentScanner.jsx";
import AdminQR from "./components/Admin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminQR />} />
        <Route path="/student" element={<StudentScanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
