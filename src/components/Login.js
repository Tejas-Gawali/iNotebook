import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Login = (props) => {
  const [credentials, setcredentials] = useState({email:"" , password :""});
  let navigate = useNavigate();

  

    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
              
            },
            body: JSON.stringify({email : credentials.email , password : credentials.password}) 
            
          });
          const json = await response.json();
          console.log(json);
          if(json.success){
            //save auth token and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Account Created Successfully", "success");
          }
          else{
            props.showAlert("Invalid Credentials", "danger");
          }
    }

    const onchange =(e)=>{
      setcredentials({...credentials,[e.target.name]: e.target.value})
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input onChange={onchange} value={credentials.email} type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input onChange={onchange} value={credentials.password} type="password" className="form-control" id="password" name='password' />
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default Login