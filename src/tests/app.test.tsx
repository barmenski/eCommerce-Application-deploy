import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../components/app.tsx';

describe('react-component', () => {
  it('h1 title should be equal to something', () => {
    render(<App />);
    const h1 = screen.getByTestId('h1');
    // screen.debug();
    expect(h1.tagName).toBe('H1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent(/Hello World$/);
  });
});
