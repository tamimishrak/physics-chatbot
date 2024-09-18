import {useState, useeffect} from 'react'
import axios from 'axios'

import "./Prompt.css"

export default function Prompt({onPromptSubmit}) {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(question){
      onPromptSubmit(question);
      setQuestion('');
    } 
  }

  return (
    <>
      {question && <div className='message user'>{question}</div>}
      <div className='endChat'>
          <form className="newForm" onSubmit={handleSubmit}>
            <input 
              type='text' 
              name='text' 
              placeholder='Ask anything...'
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type='submit'>
              <img src="/arrow.png" alt="" />
            </button>
          </form>
        </div>
      </>
  )
}
