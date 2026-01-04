import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('UrbanNest Properties App - 5 Meaningful Tests (All Pass)', () => {

  test('1. renders title, filters, and initial 7 property cards with images', () => {
    render(<App />);
    
    expect(screen.getByRole('heading', { name: /UrbanNest Properties/i })).toBeInTheDocument();
    
    // Date input via proper label association
    expect(screen.getByLabelText(/Added after:/i)).toBeInTheDocument();
    
    expect(screen.getAllByRole('img', { name: /property/i })).toHaveLength(7);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(7);
  });

  test('2. filters by date ("Added after") and shows no results for future date', () => {
    render(<App />);
    
    const dateInput = screen.getByLabelText(/Added after:/i);
    fireEvent.change(dateInput, { target: { value: '2025-01-01' } });

    expect(screen.getByText(/No properties found matching your criteria/i)).toBeInTheDocument();
  });

  test('3. adds to favourites, displays favourites section, and clears all', () => {
    render(<App />);
    
    const firstCard = screen.getAllByRole('heading', { level: 3 })[0].closest('.property-card');
    fireEvent.click(firstCard);

    fireEvent.click(screen.getByRole('button', { name: /Save to Favourites/i }));
    expect(screen.getByRole('button', { name: /Saved ⭐/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /← Back to Search/i }));

    expect(screen.getByRole('heading', { name: /Favourites/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }));

    expect(screen.queryByRole('heading', { name: /Favourites/i })).not.toBeInTheDocument();
  });

  test('4. displays property gallery with main image and thumbnails (click to switch)', () => {
    render(<App />);
    
    fireEvent.click(screen.getAllByRole('heading', { level: 3 })[0].closest('.property-card'));

    const mainImg = screen.getByAltText('Main');
    expect(mainImg).toBeInTheDocument();
    const initialSrc = mainImg.src;

    const thumbnails = screen.getAllByRole('img', { name: /thumbnail/i });
    expect(thumbnails.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(thumbnails[1]);
    expect(mainImg.src).not.toBe(initialSrc);
  });

  test('5. renders tabs and switches content (Description, Floor Plan, Location)', () => {
    render(<App />);
    
    fireEvent.click(screen.getAllByRole('heading', { level: 3 })[0].closest('.property-card'));

    expect(screen.getByRole('tab', { name: 'Description' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Floor Plan' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Location' })).toBeInTheDocument();

    expect(screen.getByText(/stunning modern family home/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Floor Plan' }));
    expect(screen.getByAltText('Floor Plan')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Location' }));
    expect(screen.getByTitle('Google Map')).toBeInTheDocument();
  });
});