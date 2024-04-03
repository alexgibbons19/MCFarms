import { useState } from "react";
import './assets/Login.css';
import { Link, redirect, useNavigate } from "react-router-dom";


function Login() 
{
  useEffect(() => {
    // This code runs after the component is rendered
    document.title = "My New Page Title";
  }, []); // The empty array means this effect runs once on mount

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store credentials to local storage.
    localStorage.setItem('credentials', JSON.stringify(formValues))

    // Retrieve credentials from local storage
    let credentials = JSON.parse(localStorage.getItem('credentials'));
    console.log(credentials['email']);
    console.log(credentials['password']);

    navigate('/home-page');
  };


  return (
    <div className="main">
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
              <label htmlFor="email"><b>Email</b></label><br />
              <input 
                type="text" 
                id="email" 
                name="email" 
                placeholder="Email"
                className="textbox"
                value={formValues.email || ""}
                onChange={handleChange} 
                required 
              /><br />
            </div>

            <div>
              <label htmlFor="password" autoComplete="on"><b>Password</b></label><br />
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


          <div className="additionalOptions">
            <a href="signup.html">Sign Up</a>
            <a href="forgotpassword.html">Forgot Password</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
