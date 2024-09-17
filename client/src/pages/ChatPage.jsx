import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios'
import Prompt from '../components/Prompt'
import "./ChatPage.css"

export default function ChatPage(){
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  useEffect(() => {
      if(id){
        async function fetchMessages(){
          try{await axios.get(`http://localhost:8000/api/sessions/${id}`);
            const response = 
            console.log(response.data);
            if(response.status === 200){
              setMessages(response.data);
            } else {
              alert('Failed to load messages '+response.status);
            }
          } catch(error){
            console.error(error);
          }
        }
        fetchMessages();
      }
  }, [id]);

  return (
    <div className="chatPage">
      <div className='wrapper'>
        <div className="chat">
          {
            messages.map((message, index) => (
              <div key={index} className={`message ${message.is_bot ? '' : 'user'}`}>
                {message.text}
              </div>
            ))
          }
          <Prompt />
        </div>
      </div>
    </div>
  )
}
