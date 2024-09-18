import React from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import "./DashBoardPage.css"

export default function DashBoardPage() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;

    try{
      const response = await axios.post(
        `http://localhost:8000/api/sessions/`,
        {text},
        {withCredentials: true}
      );
      console.log(response.data);
      const id = response.data.id;
      if(id){
        navigate(`/dashboard/sessions/${id}`);
      } else {
        alert("Chat cannot be created...");
      }
    }catch(error){
      alert(error.message);
    }
  }
  
  return (
    <div className="dashboardPage">
      <div className="texts">
        <div className="logo">
          <h1>PhyMate</h1>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder="Ask me anything..." />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}
