import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import "./ChatList.css"

export default function ChatList() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() =>{
    async function fetchSessions(){
      try{
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/sessions/',{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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
  }, []);

  const handleDeleteSession = async (sessionId) => {
    try{
      const token = localStorage.getItem('access_token');
      const response = await axios.delete(`http://localhost:8000/api/sessions/${sessionId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 204){
        setSessions(prevSessions => 
          prevSessions.filter(session => session.session_id !== sessionId)
        );
        alert('Session deleted successfully!');
      } else {
        alert("Failed to delete session.");
      }
    } catch(error){
      alert(error.message)
    }
  };

  const handleClick = (sessionId) => {
    setActiveSession(sessionId);
  }

  return (
    <div className='chatList'>
      <span className='title'>Dashboard</span>
      <Link to="/dashboard">Create a new session</Link>
      <hr/>
      <span className="title">Your Sessions</span>
      <div className="list">
        {
          sessions.length > 0 ? (
            [...sessions].reverse().map(item => (
              <div 
                key={item.session_id} 
                className="chat-item"
                onClick={() => handleClick(item.session_id)}  
              >
                <Link 
                  to={`/dashboard/sessions/${item.session_id}`}
                  className="chat-title"
                >
                  {item.session_title}
                </Link>
                <button 
                  className="delete-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(item.session_id)
                  }}>
                    Delete
                  </button>
              </div>
            ))
          ) : (
            <p>No sessions available</p>
          ) 
        }
      </div>
      <hr />
      <div className="us">
        {/* <img src="/logo.png" alt="" /> */}
        <div className="texts">
          <span>Made by us</span>
          <span>Unlimited access hehe</span>
        </div>
      </div>
    </div>
  )
}
