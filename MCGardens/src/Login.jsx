import { useState } from "react";
import './App.css';


function App() 
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
    <div className="body">
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
              <input type="submit" value="Sign In"  className="button"></input>
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

export default App;
