import './App.css'
import { Outlet } from 'react-router-dom';
import Navbar from "../src/components/Navbar.jsx";

function App() {

  return (
    <>
      {/* Page Content */}
      <main>
        <Navbar />
        <Outlet />
      </main>
    </>
  )
}

export default App
