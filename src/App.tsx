import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AddWorkerForm from './components/AddWorkerForm';
import AddServiceButton from './components/AddServiceButton';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/add" element={<AddWorkerForm />} />
        <Route path="*" element={<Home />} />
     
      </Routes>
    </HashRouter>
  );
}