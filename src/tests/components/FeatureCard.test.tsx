import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { FeatureCard } from '../../components/FeatureCard';
import { route } from 'preact-router';

// Mock the route function and the Link component
vi.mock('preact-router', () => ({
  route: vi.fn(),
}));
vi.mock('preact-router/match', () => ({
  Link: ({ href, children }: { href: string, children: any }) => (
    <a href={href} onClick={() => route(href)}>
      {children}
    </a>
  ),
}));

const mockCard = {
  title: 'Test Card',
  description: 'This is a test card',
  detailedDescription: 'Detailed description of the test card',
  imgSrc: 'https://placehold.co/100x100.png?text=Test+Image',
  link: '/article/test-category/test-card',
  category: 'Test Category',
  slug: 'test-card',
  matches: {
    title: false,
    description: false,
    detailedDescription: false,
  },
  searchQuery: '',
};

describe('FeatureCard Component', () => {
  it('should render the card correctly', () => {
    const mockOnClick = vi.fn();
    render(<FeatureCard {...mockCard} onClick={mockOnClick} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('This is a test card')).toBeInTheDocument();
    expect(screen.getByAltText('Icon representing Test Card')).toBeInTheDocument();
  });

  it('should call onClick when the card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<FeatureCard {...mockCard} onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Test Card'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should navigate to the correct link when the card is clicked', () => {
    render(<FeatureCard {...mockCard} onClick={vi.fn()} />);
    fireEvent.click(screen.getByText('Test Card'));
    expect(route).toHaveBeenCalledWith(mockCard.link);
  });
});
