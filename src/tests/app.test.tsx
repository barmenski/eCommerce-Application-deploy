import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import SignUp from '../pages/SignUp/sign-up.tsx';
import App from '../components/app.tsx';
import { formatString } from '../utility/format-string.ts';
import { baseRegexDelivery } from '../utility/regexp-patterns.ts';
import { MemoryRouter } from 'react-router';
import Login from '../pages/Login/login.tsx';
import { activeCartMockdata, activeCartMockdataWithDiscount, mockData } from './mock-data.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { calculateOldPrice, calculatePrice } from '../utility/calculat-price.ts';

// test isolated component
describe('sign up component', () => {
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

describe('login component', () => {
  it('h1 title should be equal to Login', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>{<Login />}</MemoryRouter>,
    );
    const h1 = container.querySelector('.login-title');
    // screen.debug();
    if (h1) {
      expect(h1).toBeInTheDocument();
      expect(h1.tagName).toBe('H1');
      expect(h1).toHaveTextContent(/Login$/);
    }
  });

  it('email field should display error message', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>{<Login />}</MemoryRouter>,
    );
    const email = container.querySelector('#email');
    const error = email?.nextElementSibling;

    if (email && email instanceof HTMLInputElement && error) {
      expect(email).toBeInTheDocument();
      expect(email.tagName).toBe('INPUT');
      fireEvent.click(email);
      fireEvent.change(email, { target: { value: 'bj' } });
      expect(email).toHaveValue('bj');
      expect(error).toHaveTextContent('Invalid email format');
    }
  });

  it('password field should display error message', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>{<Login />}</MemoryRouter>,
    );
    const password = container.querySelector('#password');
    const error = password?.nextElementSibling;

    if (password && password instanceof HTMLInputElement && error) {
      expect(password).toBeInTheDocument();
      expect(password.tagName).toBe('INPUT');
      fireEvent.click(password);
      fireEvent.change(password, { target: { value: 'qwe' } });
      expect(password).toHaveValue('qwe');
      expect(error).toHaveTextContent('Must be at least 8 characters');
    }
  });
});

// test app
describe('test navigation', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => mockData,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const queryClient = new QueryClient();

  it('nav menu should contain href /LogIn', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
    const login: HTMLLinkElement = screen.getByText('LogIn');
    expect(login.href).toMatch(/(?<=\S+?)LogIn$/);
  });

  it('should redirect to login page', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
    const login: HTMLLinkElement = screen.getByText('LogIn');
    fireEvent.click(login);
    const h1 = container.querySelector('.login-title');
    expect(h1).toBeInTheDocument();
  });

  it('should redirect to catalog page', async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
    const catalog: HTMLLinkElement = screen.getByText('catalog');
    fireEvent.click(catalog);
    const catalogWrapper = container.querySelector('.product-card-wrapper');
    expect(catalogWrapper).toBeInTheDocument();
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

  describe('calculate price', () => {
    it('should return old price with 2 numbers after dot', () => {
      expect(calculateOldPrice(activeCartMockdataWithDiscount)).toBe('89.99');
    });

    it('should return price with 2 numbers after dot', () => {
      expect(calculatePrice(activeCartMockdata)).toBe('69.00');
    });
  });
});
