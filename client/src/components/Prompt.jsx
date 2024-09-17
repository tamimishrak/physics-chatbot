import React from 'react'

import "./Prompt.css"

export default function Prompt() {
  return (
    <div className='endChat'>
        <form className="newForm">
          <input 
            type='text' 
            name='text' 
            placeholder='Ask anything...'
          />
          <button type='submit'>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
  )
}
