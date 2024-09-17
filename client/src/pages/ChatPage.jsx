import React from 'react'

import Prompt from '../components/Prompt'
import "./ChatPage.css"

export default function ChatPage(){
  return (
    <div className="chatPage">
      <div className='wrapper'>
        <div className="chat">
          <div className='message user'>Hello</div>
          <div className='message'>Hello welcome to phymate</div>
          <Prompt />
        </div>
      </div>
    </div>
  )
}


