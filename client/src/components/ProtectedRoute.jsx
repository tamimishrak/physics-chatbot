import {useEffect, useState} from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try{
      const response = await axios.post("http://localhost:8000/api/token/refresh/", {
        refresh: refreshToken,
      });

      if(response.status === 200){
        console.log(response.data);
        localStorage.setItem("access_token", response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch(error){
      alert(error.message);
      setIsAuthorized(false);
    }
  }

  const auth = async () => {
    const token = localStorage.getItem("access_token");
    console.log(`Token : ${token}`);
    
    if(!token){
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log(`Decoded: ${decoded}`);
      const currentTime = Date.now() / 1000;

      if(decoded.exp < currentTime){
        refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch(error){
      alert(error.message);
      setIsAuthorized(false);
    } 
  }

  return isAuthorized ? children : navigate("/sign-in");
}
