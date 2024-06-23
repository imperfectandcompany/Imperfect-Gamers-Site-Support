// src/tests/components/Categories.test.tsx

import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { Categories } from '../../components/Categories';
import { h } from 'preact';
import { route } from 'preact-router';

// Mocking preact-router
vi.mock('preact-router', () => ({
  route: vi.fn(),
  Link: ({ href, children }: { href: string, children: preact.ComponentChildren }) => h('a', { href, onClick: (e) => { e.preventDefault(); route(href); } }, children),
}));

describe('Categories Component', () => {
  it('should render the categories correctly', () => {
    render(<Categories />);
    expect(screen.getByText('In-Game Features')).toBeInTheDocument();
    expect(screen.getByText('Website Resources')).toBeInTheDocument();
    expect(screen.getByText('Rules & Support')).toBeInTheDocument();
  });

  it('should navigate to the correct category page on click', () => {
    render(<Categories />);

    fireEvent.click(screen.getByText('In-Game Features'));
    expect(route).toHaveBeenCalledWith('/category/in-game-features');

    fireEvent.click(screen.getByText('Website Resources'));
    expect(route).toHaveBeenCalledWith('/category/website-resources');

    fireEvent.click(screen.getByText('Rules & Support'));
    expect(route).toHaveBeenCalledWith('/category/rules-&-support');
  });
});
