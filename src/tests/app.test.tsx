import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SignUp from '../pages/SignUp/sign-up.tsx';
import App from '../components/app.tsx';
import { formatString } from '../utility/format-string.ts';
import { baseRegexDelivery } from '../utility/regexp-patterns.ts';
import { MemoryRouter } from 'react-router';

// test isolated component
describe('react-component', () => {
  it('h1 title should be equal to Sign Up', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/signUp']}>{<SignUp />}</MemoryRouter>,
    );
    const h1 = container.querySelector('.sign-up-h1');
    // screen.debug();
    if (h1) {
      expect(h1).toBeInTheDocument();
      expect(h1.tagName).toBe('H1');
      expect(h1).toHaveTextContent(/Sign Up$/);
    }
  });
});

// test app
describe('test navigation', () => {
  it('nav menu should contain href /LogIn', () => {
    render(<App />);
    const login: HTMLLinkElement = screen.getByText('LogIn');
    expect(login.href).toMatch(/(?<=\S+?)LogIn$/);
  });

  it('should redirect to login page', () => {
    const { container } = render(<App />);
    const login: HTMLLinkElement = screen.getByText('LogIn');
    fireEvent.click(login);
    const h1 = container.querySelector('.login-title');
    expect(h1).toBeInTheDocument();
  });
});

// test util funcs
describe('format-string', () => {
  it('should follow the pattern', () => {
    expect(formatString('testSomeString', '-')).toBe('test-some-string');
  });
});

describe('validate birth date', () => {
  const validate: ((value: string) => boolean | string) | undefined =
    baseRegexDelivery().get('dateOfBirth')?.validate;
  it('user should be 13 or older', () => {
    if (validate) {
      expect(validate('2024-01-01')).toBe('User must be 13 or older!');
      expect(validate('2000-02-03')).toBe(true);
      expect(validate('2013-01-01')).toBe('User must be 13 or older!');
      expect(validate('2012-12-31')).toBe('User must be 13 or older!');
      expect(validate('2010-11-01')).toBe(true);
    }
  });
});
