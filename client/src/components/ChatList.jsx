import React from 'react'
import { Link } from 'react-router-dom'

import "./ChatList.css"

export default function ChatList() {
  return (
    <div className='chatList'>
      <span className='title'>Dashboard</span>
      <Link to="/dashboard">Create a new session</Link>
      <hr/>
      <span className="title">Your Sessions</span>
      <div className="list">
        <Link to='/dashboard'>Chat hada</Link>
        <Link to='/dashboard'>Chat Title</Link>
        <Link to='/dashboard'>Chat Title</Link>
        <Link to='/dashboard'>Chat Title</Link>
        <Link to='/dashboard'>Chat Title</Link>
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to PhyMate Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  )
}
