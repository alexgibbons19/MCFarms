import { useState, useEffect } from "react";
import './assets/Login.css';
import { createUserAndSendVerification, resendVerificationEmail } from '../backend/Firebase';
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!formValues.email || !formValues.password || !formValues.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserAndSendVerification(formValues.email, formValues.password);
      setUser(userCredential.user);
      setError("A verification email has been sent. Please verify your email before logging in.");
      setShowResend(true);
      startCountdown();
    } catch (error) {
      console.error("Registration error:", error);
      setError("Failed to create an account. " + error.message);
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    let timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendVerification = async () => {
    if (formValues.email) {
      try {
        await resendVerificationEmail(formValues.email);
        setError("A new verification email has been sent.");
        startCountdown();
      } catch (error) {
        setError("Failed to resend verification email. " + error.message);
      }
    }
  };

  useEffect(() => {
    if (user && user.emailVerified) {
      navigate('/home-page');
    }
  }, [user, navigate]);

  return (
    <div className="login-main">
      <div className="login-center">
        <div className="login-backbox">
          <div>
            <header className="login-header">
              <h2> MCGardens Create User </h2>
            </header>
          </div>
  
          <form onSubmit={handleRegistration} className="login-form">
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
                autoComplete="new-password"
                placeholder="Password" 
                className="login-textbox" 
                value={formValues.password || ""}
                onChange={handleChange} 
                required
              /><br />
            </div>
  
            <div>
              <label htmlFor="confirmPassword" className="login-label"><b>Confirm Password</b></label><br />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm Password"
                className="login-textbox"
                value={formValues.confirmPassword || ""}
                onChange={handleChange}
                required
              /><br />
            </div>
            
            <div>
              {!showResend ? (
                <button type="submit" className="login-button">Sign Up</button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResendVerification} 
                  disabled={countdown > 0} 
                  className="login-button"
                >
                  Resend Email {countdown > 0 ? `(${countdown}s)` : ""}
                </button>
              )}
            </div>
          </form>
  
          <div className="login-errorMessage">{error && <p className="error-message">{error}</p>}</div>
  
          <div className="login-additionalOptions">
            <a href="/" className="login-link">Sign In</a>
            <a href="/forgot-password" className="login-link" style={{ cursor: 'pointer' }}>Forgot Password</a>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default SignUp;
