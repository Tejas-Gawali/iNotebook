import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setcredentials] = useState({name: "", email:"" , password :"", cpassword :""});
  let navigate = useNavigate();

  

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const {name,email,password} = credentials;
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
              
            },
            body: JSON.stringify({name , email, password}) 
            
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
          <label htmlFor="name" className="form-label">Name</label>
          <input onChange={onchange} value={credentials.name} type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input onChange={onchange} value={credentials.email} type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input onChange={onchange} value={credentials.password} type="password" className="form-control" id="password" name='password' required minLength={5} />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input onChange={onchange} value={credentials.password} type="password" className="form-control" id="cpassword" name='cpassword' required minLength={5} />
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default Signup