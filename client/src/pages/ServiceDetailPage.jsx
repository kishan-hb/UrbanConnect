import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getServiceById } from '../api/servicesApi';
import './ServiceDetailPage.css';

function formatPrice(price) {
  if (typeof price !== 'number') return 'Custom quote';
  return `From $${price}`;
}

function ServiceDetailPage() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setErrorMessage('');

      try {
        const data = await getServiceById(id);
        setService(data || null);
      } catch (error) {
        setService(null);
        setErrorMessage(error.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

  const locationLabel = useMemo(() => {
    if (!service?.location) return 'Location not specified';
    const parts = [service.location.area, service.location.city, service.location.zipCode]
      .filter(Boolean)
      .map((part) => String(part).trim());
    return parts.length ? parts.join(', ') : 'Location not specified';
  }, [service]);

  if (loading) {
    return (
      <main className="service-detail-page">
        <p>Loading service details...</p>
      </main>
    );
  }

  if (errorMessage || !service) {
    return (
      <main className="service-detail-page">
        <nav className="service-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/services">Services</Link>
          <span>/</span>
          <span>Service not found</span>
        </nav>

        <section className="service-detail-panel">
          <h2>Service unavailable</h2>
          <p>{errorMessage || 'The requested service could not be found.'}</p>
          <Link to="/services" className="service-detail-primary-action">
            Back to Services
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="service-detail-page">
      <nav className="service-detail-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/services">Services</Link>
        <span>/</span>
        <span>{service.title}</span>
      </nav>

      <section className="service-detail-hero">
        <div className="service-detail-main">
          <div className="service-detail-copy">
            <p className="service-detail-category">{service.category || 'Service'}</p>
            <h1>{service.title}</h1>
            <p className="service-detail-description">
              {service.description || 'No detailed description provided yet.'}
            </p>

            <div className="service-detail-trust-bar">
              <span>{locationLabel}</span>
              <span>Provider ID: {service.providerClerkId || 'N/A'}</span>
              <span>Live listing</span>
            </div>
          </div>

          <div className="service-detail-visual service-detail-visual-default">
            <div className="service-detail-visual-chip">Premium service</div>
          </div>
        </div>

        <aside className="service-detail-booking-card">
          <p className="service-detail-card-label">Booking summary</p>
          <div className="service-detail-price-block">
            <strong>{formatPrice(service.price)}</strong>
            <span>{locationLabel}</span>
          </div>

          <div className="service-detail-card-list">
            <p>Category: {service.category || 'N/A'}</p>
            <p>Service ID: {service.serviceId || 'N/A'}</p>
            <p>Created: {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="service-detail-card-actions">
            <Link
              to={`/booking?serviceId=${encodeURIComponent(service.serviceId || '')}&title=${encodeURIComponent(service.title || '')}&provider=${encodeURIComponent(service.providerClerkId || '')}&price=${encodeURIComponent(service.price ?? '')}`}
              className="service-detail-primary-action"
            >
              Book Now
            </Link>
            <Link to="/services" className="service-detail-secondary-action">
              Back to Services
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default ServiceDetailPage;