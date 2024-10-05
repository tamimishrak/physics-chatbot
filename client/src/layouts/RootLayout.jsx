import { Outlet, Navigate } from 'react-router-dom';

import './RootLayout.css';

const RootLayout = () => {
  const handleLogout = () => {
    localStorage.clear();
    return <Navigate to='\sign-in'/>
  }
  
  return (
    <div className='rootLayout'>
      <header>
        <div className='logo'>
          {/* <img src='/logo.png'/> */}
          <span>PhyMate</span>
        </div>
        <div>
          <button className='logout' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout;