import {useState} from 'react'
import { Link } from 'react-router-dom'
import './Form.css'

export default function Form({method}) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const name = method === 'sign-up' ? 'Sign Up' : 'Sign In';
  const link = method === 'sign-up' ? 'sign-in' : 'sign-up';
  const linkText = method === 'sign-up' ? "Sign In" : "Sign Up";
  
  return (
    <div className="form-box">
      <div className="button-box">
        <h1>{name}</h1>
      </div>
      <form className='input-group'>
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
