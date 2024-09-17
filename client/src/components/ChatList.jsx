import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'
import "./ChatList.css"

export default function ChatList() {
  const [sessions, setSessions] = useState([]);

  useEffect(() =>{
    async function fetchSessions(){
      try{
        const response = await axios.get('http://localhost:8000/api/sessions/');
        console.log(response);
        if(response.status === 200){
          setSessions(response.data);
        } else {
          alert('Failed to load sessions '+response.status);
        }
      } catch(error){
        alert(error.message);
      }
    }
    fetchSessions();
  }, [])

  return (
    <div className='chatList'>
      <span className='title'>Dashboard</span>
      <Link to="/dashboard">Create a new session</Link>
      <hr/>
      <span className="title">Your Sessions</span>
      <div className="list">
        {
          sessions.length > 0 ? (
            sessions.map(item => (
              <Link key={item.session_id} to={`/dashboard/sessions/${item.session_id}`}>
                {item.session_title}
              </Link>
            ))
          ) : (
            <p>No sessions available</p>
          ) 
        }
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
