import React from 'react'
import { Outlet } from 'react-router-dom';
import './DashBoardLayout.css';
import ChatList from '../components/ChatList';

export default function DashBoardLayout() {
  return (
    <div className='dashboardLayout'>
      <div className='menu'>
        <ChatList />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
