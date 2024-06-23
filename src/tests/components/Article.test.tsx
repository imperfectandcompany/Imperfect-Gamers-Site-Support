import { render, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import Article from '../../components/Article';

// Mocking preact-router
vi.mock('preact-router', () => ({
  useLocation: vi.fn(() => ({
    path: '/article/surf-maps',
    url: '/article/surf-maps',
  })),
  useParams: vi.fn(() => ({ id: 'surf-maps' })),
}));


describe('Article Component', () => {
  it('should render NotFound component if the article is not found', async () => {
    vi.mock('preact-router', () => ({
      useParams: vi.fn(() => ({ id: 'nonexistent-article' })),
    }));
    render(<Article path="/article/:id" lastRoute="/" />);
    expect(screen.getByText('Item not found')).toBeInTheDocument();
  });

});