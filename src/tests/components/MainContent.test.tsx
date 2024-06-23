// src/tests/components/MainContent.test.tsx

import { render, screen, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { MainContent, SectionData } from '../../components/MainContent';

const mockSections: { [key: string]: SectionData } = {
  inGameFeatures: {
    title: 'In-Game Features',
    cards: [
      {
        link: '#',
        imgSrc: 'https://placehold.co/100x100.png?text=Surf+Maps',
        title: 'Surf Maps',
        description: 'Catch the wave with our custom surf maps. No sunscreen required!',
        detailedDescription: 'Surf Maps are custom-designed maps that challenge players to navigate complex environments using surfing techniques.',
        category: '',
        slug: 'surf-maps',
        matches: {
          title: true,
          description: false,
          detailedDescription: false,
        },
      },
    ],
    category: ''
  }
};

describe('MainContent Component', () => {
  it('should render the sections and cards correctly', () => {
    render(
      <MainContent
        sections={mockSections}
        totalResults={1}
        isSearching={false}
        searchQuery=""
        onCardClick={() => {}}
        currentItemCount={1}
      />
    );

    expect(screen.getByText('In-Game Features')).toBeInTheDocument();
    expect(screen.getByText('Surf Maps')).toBeInTheDocument();
    expect(screen.getByText('Catch the wave with our custom surf maps. No sunscreen required!')).toBeInTheDocument();
  });

  it('should call onCardClick when a card is clicked', () => {
    const mockCardClick = vi.fn();
    render(
      <MainContent
        sections={mockSections}
        totalResults={1}
        isSearching={false}
        searchQuery=""
        onCardClick={mockCardClick}
        currentItemCount={1}
      />
    );

    fireEvent.click(screen.getByText('Surf Maps'));
    expect(mockCardClick).toHaveBeenCalled();
  });

  it('should display a message when no results are found', () => {
    render(
      <MainContent
        sections={{}}
        totalResults={0}
        isSearching={false}
        searchQuery="nonexistent"
        onCardClick={() => {}}
        currentItemCount={0}
      />
    );

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('should display searching message when search is in progress', () => {
    render(
      <MainContent
        sections={mockSections}
        totalResults={1}
        isSearching={true}
        searchQuery="test"
        onCardClick={() => {}}
        currentItemCount={1}
      />
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('should display the help message when no search is performed', () => {
    render(
      <MainContent
        sections={mockSections}
        totalResults={1}
        isSearching={false}
        searchQuery=""
        onCardClick={() => {}}
        currentItemCount={1}
      />
    );

    expect(screen.getByText('Hi, how can we help you?')).toBeInTheDocument();
  });

  it('should display the number of results found', () => {
    render(
      <MainContent
        sections={mockSections}
        totalResults={1}
        isSearching={false}
        searchQuery="surf"
        onCardClick={() => {}}
        currentItemCount={1}
      />
    );

    expect(screen.getByText('Found 1 result.')).toBeInTheDocument();
  });
});
