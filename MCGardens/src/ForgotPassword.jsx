import { useState } from "react";
import './assets/Login.css';
import { resetPassword } from '../backend/Authentication';
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await resetPassword(email);
      setSuccessMessage(`An email has been sent to ${email} with instructions to reset your password.`);
      setEmail('');
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Failed to reset password. Please try again later.");
    }
  };

  return (
    <div className="main">
      <div className="center">
        <div className="backbox">
          <header className="App-header">
            <h2>Forgot Password</h2>
          </header>

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
                value={email}
                onChange={handleChange} 
                required 
              /><br />
            </div>
            
            <div>
              <button type="submit" className="sign-in-button">Reset Password</button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <div className="additionalOptions">
            <a href="/">Back to Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
