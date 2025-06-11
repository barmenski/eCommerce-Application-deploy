import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { JSX } from 'react';
import './login-form.css';

type LoginFormProps = {
  onLogin: (_email: string, _password: string) => void;
  loginError?: string;
};

export default function LoginForm({ onLogin, loginError }: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const validate = (): { email?: string; password?: string } => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    const emailNotTrimmed = email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (emailNotTrimmed !== trimmedEmail) {
      newErrors.email = 'Email address must not contain leading or trailing whitespace';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Invalid email format';
    }
    const trimmedPassword = password.trim();
    if (trimmedPassword) {
      if (trimmedPassword.length < 8) {
        newErrors.password = 'Must be at least 8 characters';
      } else if (!/[A-Z]/.test(trimmedPassword)) {
        newErrors.password = 'Must contain uppercase letter';
      } else if (!/[a-z]/.test(trimmedPassword)) {
        newErrors.password = 'Must contain lowercase letter';
      } else if (!/\d/.test(trimmedPassword)) {
        newErrors.password = 'Must contain a digit';
      } else if (password !== trimmedPassword) {
        newErrors.password = 'No leading or trailing spaces allowed';
      }
    } else {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };
  useEffect(() => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [email, password]);

  const handleSubmit = (event_: React.FormEvent): void => {
    event_.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(validationErrors).length === 0) {
      onLogin(email.trim(), password);
    }
  };
  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>

        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(event_) => {
            setEmail(event_.target.value);
            if (!touched.email) setTouched((previous) => ({ ...previous, email: true }));
          }}
          placeholder="you@example.com"
          className="login-input"
        />
        <div className="error-message" style={{ minHeight: '1.2em' }}>
          {touched.email && errors.email}
        </div>
        <label htmlFor="password" className="login-label mt-6">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event_) => {
            setPassword(event_.target.value);
            if (!touched.password) setTouched((previous) => ({ ...previous, password: true }));
          }}
          placeholder="••••••••"
          className="login-input"
        />
        <div className="error-message  min-heigh">{touched.password && errors.password}</div>
        <div className="checkbox-wrapper">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((previous) => !previous)}
              className="checkbox-input"
            />
            Show password
          </label>
        </div>
        <p className="redirect">
          You are not registered?{' '}
          <Link className="redirect-to-login-link" to={'/signUp'}>
            Signup
          </Link>
        </p>
        {loginError && <div className="error-message">{loginError}</div>}
        <button type="submit" className="login-button mt-8" disabled={!isValid}>
          Login
        </button>
      </form>
    </div>
  );
}
