import './App.css';
import properties from "./properties.json";
import { useState } from "react";

function App() {
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [postcode, setPostcode] = useState("");
  const [startDate, setStartDate] = useState(""); // New: Date Filter [cite: 28]
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [sort, setSort] = useState("");

  const filteredProperties = properties
    .filter(property => {
      const propertyDate = new Date(property.dateAdded);
      const filterDate = startDate ? new Date(startDate) : null;

      return (
        (type === "" || property.type === type) &&
        (minPrice === "" || property.price >= Number(minPrice)) &&
        (maxPrice === "" || property.price <= Number(maxPrice)) &&
        (bedrooms === "" || property.bedrooms >= Number(bedrooms)) &&
        (postcode === "" || property.postcode.toLowerCase().includes(postcode.toLowerCase())) &&
        (!filterDate || propertyDate >= filterDate) // Logic for Date Filter 
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "date") return new Date(b.dateAdded) - new Date(a.dateAdded);
      return 0;
    });

  const addToFavourites = (property) => {
    if (!favourites.find(fav => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    }
  };

  const removeFromFavourites = (id) => {
    setFavourites(favourites.filter(fav => fav.id !== id));
  };

  // New: Clear All Favourites Logic 
  const clearFavourites = () => {
    setFavourites([]);
  };

  return (
    <div className="App">
      <h1>UrbanNest Properties</h1>

      {!selectedProperty && (
        <div className="search">
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">No sorting</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="date">Date Added (Newest)</option>
          </select>

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="">Any Type</option>
            <option value="House">House</option>
            <option value="Flat">Flat</option>
            <option value="Bungalow">Bungalow</option>
          </select>

          <input type="number" placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <input type="number" placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
          <input type="number" placeholder="Bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} />
          <input type="text" placeholder="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} />
          
          {/* New: Date Added Input Field [cite: 28, 76] */}
          <div className="date-filter">
            <label>Added after: </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
        </div>
      )}

      {selectedProperty ? (
        <div className="property-details">
          <button onClick={() => setSelectedProperty(null)}>← Back</button>
          <img src={selectedProperty.image} alt="property" className="details-image" />
          <h2>{selectedProperty.type}</h2>
          <p><strong>Price:</strong> £{selectedProperty.price.toLocaleString()}</p>
          <p><strong>Description:</strong> {selectedProperty.description}</p>
          <button 
            onClick={() => addToFavourites(selectedProperty)}
            disabled={favourites.find(fav => fav.id === selectedProperty.id)}
          >
            {favourites.find(fav => fav.id === selectedProperty.id) ? "Added ⭐" : "Add to favourites ⭐"}
          </button>
        </div>
      ) : (
        <>
          {favourites.length > 0 && (
            <div className="favourites">
              <h2>⭐ Favourites ({favourites.length})</h2>
              {/* New: Clear All Button  */}
              <button onClick={clearFavourites} className="clear-btn">Clear All Favourites</button>
              <div className="property-grid">
                {favourites.map(property => (
                  <div key={property.id} className="property-card">
                    <h3>{property.type}</h3>
                    <button onClick={() => removeFromFavourites(property.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="property-grid">
            {filteredProperties.length === 0 ? (
              <p>No properties found matching your criteria.</p>
            ) : (
              filteredProperties.map(property => (
                <div key={property.id} className="property-card" onClick={() => setSelectedProperty(property)}>
                  <img src={property.image} alt="property" className="card-image" />
                  <h3>{property.type}</h3>
                  <p className="price">£{property.price.toLocaleString()}</p>
                  <p>Added: {property.dateAdded}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;