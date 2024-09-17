import React from 'react'

import Prompt from '../components/Prompt'
import "./ChatPage.css"

export default function ChatPage(){
  return (
    <div className="chatPage">
      <div className='wrapper'>
        <div className="chat">
          
          <Prompt />
        </div>
      </div>
    </div>
  )
}


