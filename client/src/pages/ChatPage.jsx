import React from 'react'

export default function ChatPage(){
  return (
    <div className="chatPage">
      <div className='wrapper'>
        <div className="chat">
          {message.map((message, index) => (
            <div key={index} className={`message ${message.is_bot ? '' : 'user'}`}>
              {message.text}
            </div>
          ))}
          <NewPrompt onPromptSubmit={handlePromptSubmit} />
        </div>
      </div>
    </div>
  )
}


