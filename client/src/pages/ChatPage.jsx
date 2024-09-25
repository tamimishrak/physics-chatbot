import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Markdown from 'react-markdown'

import axios from 'axios'
import Prompt from '../components/Prompt'
import "./ChatPage.css"

export default function ChatPage(){
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  useEffect(() => {
      if(id){
        async function fetchMessages(){
          try{
            const response = await axios.get(`http://localhost:8000/api/sessions/${id}`); 
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

  const handlePromptSubmit = async (newMessage) => {
    try {
      let response;
      if (id) {
        response = await axios.post(`http://localhost:8000/api/sessions/${id}/`, { text: newMessage });
      } else {
        response = await axios.post('http://localhost:8000/api/sessions/', { text: newMessage });
        const newSessionId = response.data.session_id;
        navigate(`/dashboard/sessions/${newSessionId}`);
      }

      // updating user and bot messages
      const botMessage = response.data.answer;
      setMessages(prevMessages => [
        ...prevMessages,
        { text: newMessage, is_bot: false },
        { text: botMessage, is_bot: true }
      ]);
    } catch (error) {
      alert('Failed to send the message');
    }
  };

  return (
    <div className="chatPage">
      <div className='wrapper'>
        <div className="chat">
          {
            messages.map((message, index) => (
              <div key={index} className={`message ${message.is_bot ? '' : 'user'}`}>
                <Markdown>{message.text}</Markdown>
              </div>
            ))
          }
          <Prompt onPromptSubmit={handlePromptSubmit} />
        </div>
      </div>
    </div>
  )
}
