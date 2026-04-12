import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllServices } from '../api/servicesApi';
import './ServicesPage.css';

const serviceCategories = [
  'All Services',
  'Plumbing',
  'Cleaning',
  'Electrical',
  'Painting',
  'Concierge',
];

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [zipInput, setZipInput] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [zipQuery, setZipQuery] = useState('');

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await getAllServices({ search: searchQuery, zip: zipQuery });
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        setServices([]);
        setErrorMessage(error.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [searchQuery, zipQuery]);

  function handleSearchSubmit() {
    setSearchQuery(searchInput.trim());
    setZipQuery(zipInput.trim());
  }

  function handleSearchKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  }

  const servicesCountLabel = useMemo(() => {
    if (loading) return 'Loading services...';
    if (errorMessage) return errorMessage;
    if (services.length === 0) return 'No services found for current filters.';
    return `${services.length} service(s) available.`;
  }, [loading, errorMessage, services.length]);

  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-hero-copy">
          <p className="services-kicker">Curated marketplace</p>
          <h1>Explore premium services for every part of your home.</h1>
          <p>
            Browse trusted service categories, compare premium offerings, and
            select the one you want to explore in more detail.
          </p>
        </div>

        <div className="services-search-panel">
          <label className="services-search-field">
            <span className="services-search-label">Service</span>
            <input
              type="text"
              placeholder="Search for plumbing, cleaning, electrical..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </label>

          <label className="services-search-field">
            <span className="services-search-label">Zip code</span>
            <input
              type="text"
              placeholder="Enter your zip code"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </label>

          <button type="button" className="services-search-button" onClick={handleSearchSubmit}>
            Search
          </button>
        </div>
      </section>

      <section className="services-toolbar">
        <div className="services-category-chips" aria-label="Service categories">
          {serviceCategories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={
                index === 0
                  ? 'services-category-chip services-category-chip-active'
                  : 'services-category-chip'
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="services-sort-group">
          <span className="services-sort-label">Sort by</span>
          <button type="button" className="services-sort-button">
            Recommended
          </button>
        </div>
      </section>

      <section className="services-results">
        <div className="services-results-header">
          <div>
            <h2>Available Services</h2>
            <p>{servicesCountLabel}</p>
          </div>
          <p className="services-results-meta">Showing latest matches first</p>
        </div>

        {!loading && !errorMessage && services.length === 0 ? (
          <p>No matching services. Try a different service keyword or zip code.</p>
        ) : null}

        <div className="services-grid">
          {services.map((service) => (
            <article key={service._id} className="service-card">
              <div className="service-card-visual">
                <span className="service-card-category">{service.category || 'Service'}</span>
              </div>

              <div className="service-card-body">
                <div className="service-card-copy">
                  <h3>{service.title}</h3>
                  <p>{service.description || 'No description provided yet.'}</p>
                </div>

                <div className="service-card-footer">
                  <div className="service-card-meta">
                    <strong>{typeof service.price === 'number' ? `From $${service.price}` : 'Custom quote'}</strong>
                    <span>{service.location?.zipCode || service.location?.city || 'Location not specified'}</span>
                  </div>

                  <Link to={`/services/${service._id}`} className="service-card-link">
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ServicesPage;