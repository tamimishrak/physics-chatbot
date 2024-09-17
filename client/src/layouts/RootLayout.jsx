import { Outlet } from 'react-router-dom';

import './RootLayout.css';

const RootLayout = () => {
  return (
    <div className='rootLayout'>
      <header>
        <div className='logo'>
          <img src='/logo.png'/>
          <span>PhyMate</span>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout;