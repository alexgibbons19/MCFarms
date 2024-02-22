import { useState } from "react";
import './assets/Login.css';
import { Link } from "react-router-dom";


function Login() 
{
  const [formValues, setFormValues] = useState({});

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);

  };

  return (
    <div className="login-page-container">
      <div className="center">
        <div className="backbox">
          <div>
            <header className="App-header">
              <h2>
                MCGardens Login
              </h2>
            </header>
          </div>

        
          <form onSubmit={handleSubmit} autoComplete="on">
            <div>
              <label htmlFor="username"><b>Username</b></label><br />
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Username"
                className="textbox"
                value={formValues.username || ""}
                onChange={handleChange} 
                required 
              /><br />
            </div>

            <div>
              <label htmlFor="password"><b>Password</b></label><br />
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Password" 
                className="textbox" 
                value={formValues.password || ""}
                onChange={handleChange} 
                required 
              /><br />
            </div>
            
            <div>
              <Link to="/home-page" onClick={handleSubmit}><button className="sign-in-button">Sign In</button></Link>
              
            </div>
          </form>


          <div>
            <a href="signup.html">Sign Up</a>
            <a href="forgotpassword.html">Forgot Password</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
