import './App.css';
import properties from "./properties.json";
import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function App() {
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [postcode, setPostcode] = useState("");
  const [startDate, setStartDate] = useState(""); // Date filter
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [sort, setSort] = useState("");
  const [mainImage, setMainImage] = useState(""); // Gallery main image

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
        (!filterDate || propertyDate >= filterDate)
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "date") return new Date(b.dateAdded) - new Date(a.dateAdded);
      return 0;
    });

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    setMainImage(property.images[0]);
  };

  const addToFavourites = (property) => {
    if (!favourites.find(fav => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    }
  };

  const removeFromFavourites = (id) => {
    setFavourites(favourites.filter(fav => fav.id !== id));
  };

  const clearAllFavourites = () => {
    setFavourites([]);
  };

  return (
    <div className="App">
      <h1>UrbanNest Properties</h1>

      {!selectedProperty && (
        <div className="search-section">
          <div className="filters">
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
            
            {/* FIXED: Label now correctly wraps the date input */}
            <label className="date-filter">
              Added after:
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </label>
          </div>

          {favourites.length > 0 && (
            <div className="favourites-container">
              <h2>⭐ Favourites ({favourites.length})</h2>
              <button onClick={clearAllFavourites} className="clear-btn">Clear All</button>
              <div className="property-grid">
                {favourites.map(property => (
                  <div key={property.id} className="property-card mini">
                    <img src={property.images[0]} alt="fav" className="card-image" />
                    <button onClick={() => removeFromFavourites(property.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedProperty ? (
        <div className="property-details">
          <button onClick={() => setSelectedProperty(null)} className="back-btn">← Back to Search</button>

          <div className="details-header">
            <div className="gallery">
              <img src={mainImage} alt="Main" className="main-image" />
              <div className="thumbnails">
                {selectedProperty.images.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt="thumbnail" 
                    onClick={() => setMainImage(img)}
                    className={mainImage === img ? "active-thumb" : ""}
                  />
                ))}
              </div>
            </div>

            <div className="quick-info">
              <h2>{selectedProperty.type}</h2>
              <p className="price">£{selectedProperty.price.toLocaleString()}</p>
              <button
                className="fav-btn-large"
                onClick={() => addToFavourites(selectedProperty)}
                disabled={favourites.find(fav => fav.id === selectedProperty.id)}
              >
                {favourites.find(fav => fav.id === selectedProperty.id) ? "Saved ⭐" : "Save to Favourites"}
              </button>
            </div>
          </div>

          <Tabs className="property-tabs">
            <TabList>
              <Tab>Description</Tab>
              <Tab>Floor Plan</Tab>
              <Tab>Location</Tab>
            </TabList>

            <TabPanel>
              <p className="long-description">{selectedProperty.longDescription}</p>
            </TabPanel>
            <TabPanel>
              <img src={selectedProperty.floorPlan} alt="Floor Plan" className="floor-plan-img" />
            </TabPanel>
            <TabPanel>
              <div className="map-placeholder">
                <iframe 
                  title="Google Map"
                  width="100%" 
                  height="300" 
                  src={`https://maps.google.com/maps?q=${selectedProperty.postcode}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      ) : (
        <div className="property-grid">
          {filteredProperties.length === 0 ? (
            <p>No properties found matching your criteria.</p>
          ) : (
            filteredProperties.map(property => (
              <div key={property.id} className="property-card" onClick={() => handleSelectProperty(property)}>
                <img src={property.images[0]} alt="property" className="card-image" />
                <h3>{property.type}</h3>
                <p className="price">£{property.price.toLocaleString()}</p>
                <p>{property.bedrooms} Bed • {property.postcode}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;