import React, { useState } from 'react';
import './styles/Login.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
      <div className="login-container">
          <div className="login-box">
              <div className="login-title">Login</div>
              <form onSubmit={handleSubmit}>
                  <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                      <label htmlFor="password">Password:</label>
                      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <button type="submit">Login</button>
              </form>
          </div>
      </div>
  );
}

export default Login;
