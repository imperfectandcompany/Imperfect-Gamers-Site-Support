import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import Home from '../../components/Home';
import { content } from '../../content';

const mockOnCardClick = vi.fn();

describe('Home', () => {
  it('renders the Home component with filtered sections', () => {
    render(<Home onCardClick={mockOnCardClick} searchQuery="" isSearching={false} currentItemCount={0} path="/" />);
    
    // Verify that the sections and cards are rendered
    expect(screen.getByText(content.sections.inGameFeatures.title)).toBeInTheDocument();
    content.sections.inGameFeatures.cards.forEach(card => {
      expect(screen.getAllByText(card.title)[0]).toBeInTheDocument();
    });
  });

  it('calls onCardClick when a card is clicked', () => {
    render(<Home onCardClick={mockOnCardClick} searchQuery="" isSearching={false} currentItemCount={0} path="/" />);

    const cardTitle = screen.getAllByText(/Surf Maps/i)[0];
    fireEvent.click(cardTitle);

    expect(mockOnCardClick).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Surf Maps'
    }));
  });
});
