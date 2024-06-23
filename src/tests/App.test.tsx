// src/tests/App.test.tsx

import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { App } from '../app.tsx';

describe('App', () => {
  it('renders header and footer', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    const footer = screen.getByRole('contentinfo');
    
    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(screen.getByAltText(/Imperfect Gamers Logo, a gaming community/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2024 Imperfect Gamers. All rights reserved./i)).toBeInTheDocument();
  });

  it('updates search query and filters content', () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.input(searchInput, { target: { value: 'Surf Maps' } });

    const results = screen.getAllByText(/Surf Maps/i);
    expect(results.length).toBeGreaterThan(0);
  });

  it('navigates to article page on card click', () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.input(searchInput, { target: { value: 'Surf Maps' } });

    const cardTitles = screen.getAllByText(/Surf Maps/i);
    fireEvent.click(cardTitles[0]);

    expect(screen.getByText(/Surf Maps are custom-designed maps that challenge players/i)).toBeInTheDocument();
  });

  it('shows not found page for invalid routes', () => {
    window.history.pushState({}, 'Test Page', '/invalid-route');
    render(<App />);
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });
});
