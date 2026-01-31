import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData,setFormData]=useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
   
  };
  //creating functions for login and signup
  const login=async()=>{
    let respondData;
    await fetch(process.env.REACT_APP_API_URL+'/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':"application/json"
      },
      body:JSON.stringify(formData)
    }).then(res=>res.json()).then(data=>respondData=data);
    if(respondData.success)
    {
      localStorage.setItem('auth-token',respondData.token);
      window.location.replace('/');
    }
    else
    {
      alert(respondData.error);
    }
  };

  const signup=async()=>{
    let respondData;
    await fetch(process.env.REACT_APP_API_URL+'/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':"application/json"
      },
      body:JSON.stringify(formData)
    }).then(res=>res.json()).then(data=>respondData=data);
    if(respondData.success)
    {
      localStorage.setItem('auth-token',respondData.token);
      window.location.replace('/');
    }
    else
    {
      alert(respondData.error);
    }
  };
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <input type="text" placeholder="Your Name" name="username" value={formData.username} onChange={changeHandler}/>
          ) : (
            <></>
          )}
          <input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={changeHandler}/>
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler}/>
        </div>
        <button onClick={()=>state==='Login'?login():signup()}>Continue</button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account? <span onClick={()=>setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? <span onClick={()=>setState("Sign Up")}>Click here</span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, I agree to the terms of the use & privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
