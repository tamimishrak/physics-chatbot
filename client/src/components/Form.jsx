import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Form.css'
import axios from 'axios';

export default function Form({method}) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const name = method === 'sign-up' ? 'Sign Up' : 'Sign In';
  const link = method === 'sign-up' ? 'sign-in' : 'sign-up';
  const linkText = method === 'sign-up' ? "Sign In" : "Sign Up";
  console.log(method);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(method === "sign-up"){
        const response = await axios.post("http://localhost:8000/api/user/register/", {
          username, 
          password
        });
  
        if(response.status === 201){
          navigate('/sign-in');
        } else {
          alert("Your credentials should be unique.");
        }
      } else if(method === "sign-in"){
        const response = await axios.post("http://localhost:8000/api/token/", {
          username, 
          password
        });

        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        navigate('/dashboard');
      }
    } catch(error){
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="form-box">
      <div className="button-box">
        <h1>{name}</h1>
      </div>
      <form className='input-group' onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className='input-field' 
          placeholder='Username' 
          required 
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='input-field' 
          placeholder='Password' 
          required 

        />
        <button type='submit' className='submit-btn'>{name}</button>
        {
          linkText === 'Sign In' ? 
            (<p>Already have an account? <Link to={`/${link}`} className='sign-in'>{linkText}</Link></p>) 
            : 
            (<p>Don't have an account? <Link to={`/${link}`} className='sign-in'>{linkText}</Link></p>) 
        }
      </form>
    </div>
  )
}
