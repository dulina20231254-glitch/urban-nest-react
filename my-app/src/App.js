import './App.css';
import properties from "./properties.json";
import { useState } from "react";

function App() {
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [postcode, setPostcode] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [sort, setSort] = useState("");

  const filteredProperties = properties
    .filter(property => {
      return (
        (type === "" || property.type === type) &&
        (minPrice === "" || property.price >= Number(minPrice)) &&
        (maxPrice === "" || property.price <= Number(maxPrice)) &&
        (bedrooms === "" || property.bedrooms >= Number(bedrooms)) &&
        (postcode === "" ||
          property.postcode.toLowerCase().includes(postcode.toLowerCase()))
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

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Bedrooms"
            value={bedrooms}
            onChange={e => setBedrooms(e.target.value)}
          />

          <input
            type="text"
            placeholder="Postcode"
            value={postcode}
            onChange={e => setPostcode(e.target.value)}
          />
        </div>
      )}

      {selectedProperty ? (
        <div className="property-details">
          <button onClick={() => setSelectedProperty(null)}>← Back</button>

          <h2>{selectedProperty.type}</h2>
          <p><strong>Price:</strong> £{selectedProperty.price}</p>
          <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
          <p><strong>Postcode:</strong> {selectedProperty.postcode}</p>
          <p><strong>Date Added:</strong> {selectedProperty.dateAdded}</p>

          <button
            onClick={() => addToFavourites(selectedProperty)}
            disabled={favourites.find(fav => fav.id === selectedProperty.id)}
          >
            {favourites.find(fav => fav.id === selectedProperty.id)
              ? "Added ⭐"
              : "Add to favourites ⭐"}
          </button>
        </div>
      ) : (
        <>
          {favourites.length > 0 && (
            <div className="favourites">
              <h2>⭐ Favourites</h2>

              {favourites.map(property => (
                <div key={property.id} className="property-card">
                  <h3>{property.type}</h3>
                  <p>£{property.price}</p>
                  <p>{property.postcode}</p>

                  <button onClick={() => removeFromFavourites(property.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="property-grid">
            {filteredProperties.map(property => (
              <div
                key={property.id}
                className="property-card"
                onClick={() => setSelectedProperty(property)}
              >
                <h3>{property.type}</h3>
                <p><strong>Price:</strong> £{property.price}</p>
                <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                <p><strong>Postcode:</strong> {property.postcode}</p>
                <p><strong>Date Added:</strong> {property.dateAdded}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
