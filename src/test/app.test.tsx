import { render, screen } from '@testing-library/react';
import App from '@/src/App';

describe('App', () => {
  it('renders the portfolio identity', () => {
    render(<App />);

    expect(screen.getAllByText(/Manjunathan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chettiar/i).length).toBeGreaterThan(0);
  });
});
