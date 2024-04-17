import { useState } from "react";
import './assets/Login.css';
import { signIn, createUser, resetPassword } from '../backend/Firebase';
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
        navigate('/home-page');
    } catch (error) {
        console.error("Login error:", error); // For debugging purposes
        setError("Incorrect username or password."); // Display Firebase error message to the user
    }
  }

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!formValues.email || !formValues.password) {
      setError("Email and password are required for registration.");
      return;
    }

    try {
      await createUser(formValues.email, formValues.password);
      console.log("User created successfully");
      navigate('/home-page'); // Navigate or show a success message
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to create an account. " + error.message); // Display error message
    }
  };

  const handleForgotPassword = async () => {
    if (!formValues.email) {
        setError("Please enter your email to reset your password.");
        return;
    }
    const { success, message } = await resetPassword(formValues.email);
    if (success) {
        setError("Please check your email to reset your password.");
    } else {
        setError("Failed to reset password: " + message);
    }
  };

  return (
    <div className="main">
      <div className="center">
        <div className="backbox">
          <div>
            <header className="App-header">
              <h2> MCGardens Login </h2>
            </header>
          </div>
        
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email"><b>Email</b></label><br />
              <input 
                type="email" 
                id="email" 
                name="email"
                autoComplete="email"
                placeholder="Email"
                className="textbox"
                value={formValues.email || ""}
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
                autoComplete="current-password"
                placeholder="Password" 
                className="textbox" 
                value={formValues.password || ""}
                onChange={handleChange} 
                required
              /><br />
            </div>
            
            <div>
              <button type="submit" className="sign-in-button">Sign In</button>
            </div>
          </form>

          <div className="errorMessage">{error && <p className="error-message">{error}</p>}</div>

          <div className="additionalOptions">
            <a onClick={handleRegistration} href="signup.html">Sign Up</a>
            <a onClick={handleForgotPassword} href="#" style={{ cursor: 'pointer' }}>Forgot Password</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;