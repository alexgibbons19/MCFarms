import { useState } from "react";
import './assets/Login.css';
import { resetPassword } from '../backend/Firebase';
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
    <div className="login-main">
      <div className="login-center">
        <div className="login-backbox">
          <header className="login-header">
            <h2>Forgot Password</h2>
          </header>

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
                value={email}
                onChange={handleChange} 
                required 
              /><br />
            </div>
            
            <div>
              <button type="submit" className="login-button">Reset Password</button>
            </div>
          </form>

          <div className="login-errorMessage">
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>

          <div className="login-additionalOptions">
            <a href="/" className="login-link">Back to Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
