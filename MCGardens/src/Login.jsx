import { useState } from "react";
import './assets/Login.css';
import { signIn } from '../backend/Firebase';
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.email || !formValues.password) {
        setError("Email and password are required.");
        return;
    }

    try {
        await signIn(formValues.email, formValues.password);
        navigate('/home');
    } catch (error) {
        console.error("Login error:", error);
        if (error.message.includes("verify your email")) {
            setError("Please verify your email before signing in.");
        } else {
            setError("Incorrect username or password.");
        }
    }
  };

  return (
    <div className="login-main">
      <div className="login-center">
        <div className="login-backbox">
          <div>
            <header className="login-header">
              <h2> MCGardens Login </h2>
            </header>
          </div>
        
          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label htmlFor="email" className="login-label"><b>Email</b></label><br />
              <input 
                type="email" 
                id="email" 
                name="email"
                autoComplete="email"
                placeholder="Email"
                className="login-textbox"
                value={formValues.email || ""}
                onChange={handleChange} 
                required 
              /><br />
            </div>

            <div>
              <label htmlFor="password" className="login-label"><b>Password</b></label><br />
              <input 
                type="password" 
                id="password" 
                name="password"
                autoComplete="current-password"
                placeholder="Password" 
                className="login-textbox" 
                value={formValues.password || ""}
                onChange={handleChange} 
                required
              /><br />
            </div>
            
            <div>
              <button type="submit" className="login-button">Sign In</button>
            </div>
          </form>

          <div className="login-errorMessage">{error && <p className="login-error-message">{error}</p>}</div>

          <div className="login-additionalOptions">
            <a href="/sign-up" className="login-additionalOptions-link">Sign Up</a>
            <a href="/forgot-password" className="login-additionalOptions-link" style={{ cursor: 'pointer' }}>Forgot Password</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
