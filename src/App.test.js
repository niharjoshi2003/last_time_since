import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  expect(screen.getAllByText(/Last Time Since/i).length).toBeGreaterThanOrEqual(1);
});
