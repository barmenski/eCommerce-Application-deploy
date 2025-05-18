import React, { useState } from 'react';
import type { JSX } from 'react';
import './login-form.css';

type LoginFormProps = {
  onLogin: (_email: string, _password: string) => void;
};

export default function LoginForm({ onLogin }: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event_: React.FormEvent): void => {
    event_.preventDefault();
    if (validate()) {
      onLogin(email, password);
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
          type="email"
          value={email}
          onChange={(event_) => setEmail(event_.target.value)}
          placeholder="you@example.com"
          className="login-input"
        />
        {errors.email && <div className="error-message">{errors.email}</div>}

        <label htmlFor="password" className="login-label mt-6">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event_) => setPassword(event_.target.value)}
          placeholder="••••••••"
          className="login-input"
        />
        {errors.password && <div className="error-message">{errors.password}</div>}

        <button type="submit" className="login-button mt-8">
          Login
        </button>
      </form>
    </div>
  );
}
