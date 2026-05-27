import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar.jsx";

function App() {
  return (
    <div className="min-h-screen pb-16 md:pb-0 md:pl-[140px]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
