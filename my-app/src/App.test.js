import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Estate Agent App Tests', () => {

  // Test 1: Title Check
  test('renders the main UrbanNest heading', () => {
    render(<App />);
    expect(screen.getByText(/UrbanNest Properties/i)).toBeInTheDocument();
  });

  // Test 2: Search Input Check (10% functionality mark)
  test('allows typing in the postcode field', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Postcode/i);
    fireEvent.change(input, { target: { value: 'BR1' } });
    expect(input.value).toBe('BR1');
  });

  // Test 3: Navigation Logic (5% gallery/property page mark)
  test('shows property details when a card is clicked', () => {
    render(<App />);
    const propertyCards = screen.getAllByRole('heading', { level: 3 });
    fireEvent.click(propertyCards[0].parentElement);
    expect(screen.getByText(/Description:/i)).toBeInTheDocument();
  });

  // Test 4: Duplicate Prevention (8% add to favourites mark)
  test('disables favourite button after one click', () => {
    render(<App />);
    const propertyCards = screen.getAllByRole('heading', { level: 3 });
    fireEvent.click(propertyCards[0].parentElement);
    
    const favBtn = screen.getByRole('button', { name: /Add to favourites/i });
    fireEvent.click(favBtn);
    expect(favBtn).toBeDisabled();
  });

  // Test 5: Removal Logic (7% remove favourites mark)
  test('removes item from favourites when clicking Remove', () => {
    render(<App />);
    // Add item first
    const propertyCards = screen.getAllByRole('heading', { level: 3 });
    fireEvent.click(propertyCards[0].parentElement);
    fireEvent.click(screen.getByRole('button', { name: /Add to favourites/i }));
    fireEvent.click(screen.getByText(/Back/i));
    
    // Remove item
    const removeBtn = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(removeBtn);
    expect(screen.queryByText(/Remove/i)).not.toBeInTheDocument();
  });
});