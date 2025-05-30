import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import mainLogo from '../assets/mainLogo.png';
import SignUpForm from './SignUpForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null); // null, 'success', or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    console.log('Attempting login with:', { email, password });
    
    try {
      const apiUrl = 'http://localhost:5000/api/auth/login';
      console.log('Sending request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', response.status);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      if (response.ok) {
        console.log('Login successful!');
        if (responseData && responseData.token) {
          localStorage.setItem('authToken', responseData.token);
        }
        setLoginStatus('success');
        navigate('/home'); // Navigate to home page after successful login
      } else {
        console.log('Login failed:', responseData?.message || response.statusText);
        setErrorMessage(responseData?.message || 'Login failed. Please check your credentials.');
        setLoginStatus('error');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please check if the server is running.');
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-main-bg">
      <div className="login-main-wrapper">
        {!showSignUp && (
          <div className="login-left">
            <img src={mainLogo} alt="Gebeya Mereb Logo" className="main-logo-large" />
            <h2 className="tagline-large">Connect, Collaborate, Grow</h2>
            <p className="description-large">
              Gebeya Mereb connects vendors and businesses for 
              seamless collaboration, efficient transactions, and
              growth-driven partnerships—all in one platform.
            </p>
          </div>
        )}
        <div className={`login-right${showSignUp ? ' signup-centered' : ''}`}>
          {showSignUp && (
            <img src={mainLogo} alt="Gebeya Mereb Logo" className="signup-logo-corner" />
          )}
          <div className="login-form-card">
            {showSignUp ? (
              <SignUpForm onBackToLogin={() => setShowSignUp(false)} />
            ) : (
              <>
                <h2 className="login-title login-title-center">USER LOGIN</h2>
                {loginStatus === 'error' && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="email" className="login-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="login-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="login-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="login-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="form-actions-row">
                    <button
                      type="submit"
                      className={`login-button-main ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                    <button
                      type="button"
                      className="signup-link-main"
                      onClick={() => setShowSignUp(true)}
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <footer className="login-footer login-footer-centered">
        <p>© 2025 Gebeya Mereb. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a> | <a href="/help">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;