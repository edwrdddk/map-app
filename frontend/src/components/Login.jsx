import "./login.css"
import PlaceIcon from '@mui/icons-material/Place';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";

export default function Login({setShowLogin, myStorage, setCurrentUser}) {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
      <PlaceIcon />
      DDK PIN
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef}/>
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className="loginBtn">Login</button>
        {error && <span className="failure">Ups. Something went wrong.</span>}
        <CloseIcon className="loginCancel" onClick={()=>setShowLogin(false)}/>
      </form>
    </div>
  )
}