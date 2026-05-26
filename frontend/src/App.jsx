import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar.jsx";

function App() {
  return (
    <main className="md:ml-30">
      <Navbar />
      <Outlet />
    </main>
  );
}

export default App;
