// src/tests/reducer.test.tsx

import { describe, it, expect } from 'vitest';
import { reducer, initialState, AppState, Action } from '../app.tsx';

describe('reducer', () => {
  it('should update search query and set isSearching to true', () => {
    const action: Action = { type: 'UPDATE_SEARCH', value: 'test' };
    const expectedState: AppState = { ...initialState, searchQuery: 'test', isSearching: true };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should clear search and reset state', () => {
    const action: Action = { type: 'CLEAR_SEARCH' };
    const expectedState: AppState = { ...initialState, searchQuery: '', isSearching: false, selectedItem: null };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should select an item and stop searching', () => {
    const mockItem = { link: '#', imgSrc: '', title: 'Test', description: '', detailedDescription: '', category: '', slug: '', matches: { title: false, description: false, detailedDescription: false } };
    const action: Action = { type: 'SELECT_ITEM', item: mockItem };
    const expectedState: AppState = { ...initialState, selectedItem: mockItem, isSearching: false, searchQuery: '' };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
