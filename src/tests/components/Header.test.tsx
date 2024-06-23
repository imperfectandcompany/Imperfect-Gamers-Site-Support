import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../../components/Header';

describe('Header', () => {
  it('renders the header with logo and search input', () => {
    render(<Header onSearchChange={() => {}} onLogoClick={() => {}} searchQuery="" />);
    
    expect(screen.getByAltText(/Imperfect Gamers Logo, a gaming community/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search input', () => {
    const mockOnSearchChange = vi.fn();
    render(<Header onSearchChange={mockOnSearchChange} onLogoClick={() => {}} searchQuery="" />);

    const searchInput = screen.getByPlaceholderText(/Search.../i);
    fireEvent.input(searchInput, { target: { value: 'Surf Maps' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith(expect.any(Object)); // Expecting the event object
  });

  it('matches the snapshot', () => {
    const { asFragment } = render(<Header onSearchChange={() => {}} onLogoClick={() => {}} searchQuery="" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls onLogoClick when logo is clicked', () => {
    const mockOnLogoClick = vi.fn();
    render(<Header onSearchChange={() => {}} onLogoClick={mockOnLogoClick} searchQuery="" />);

    const logo = screen.getByAltText(/Imperfect Gamers Logo, a gaming community/i);
    fireEvent.click(logo);

    expect(mockOnLogoClick).toHaveBeenCalled();
  });
});
