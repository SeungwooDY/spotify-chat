import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "../src/components/Navbar.jsx";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors md:pb-0 md:pl-[140px]">
      <Navbar />
      <main className="min-h-screen bg-background text-foreground transition-colors">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
