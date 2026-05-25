import './App.css'
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <>
      {/* Page Content */}
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
