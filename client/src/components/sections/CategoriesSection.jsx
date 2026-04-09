import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';

function CategoriesSection() {
  return (
    <section className="categories-section" id="categories">
      <div className="section-header-row">
        <SectionHeading
          title="Curated Service Categories"
          description="Selected professionals specializing in maintenance, renovation, and lifestyle enhancement."
        />

        <Link to="/services" className="section-link">
          Browse all services
        </Link>
      </div>

      <div className="categories-bento">
        <article className="category-featured-card">
          <div className="category-badge">&gt;</div>
          <div className="category-content">
            <h3>Premium Plumbing</h3>
            <p>
              Master plumbers for intricate systems, renovations, and emergency
              architectural care.
            </p>
          </div>
          <div
            className="category-feature-image"
            role="img"
            aria-label="Premium Plumbing"
          >
            <div className="category-feature-spout" />
            <div className="category-feature-neck" />
          </div>
        </article>

        <div className="category-right-column">
          <article className="category-wide-card">
            <div className="category-wide-copy">
              <div className="category-badge">H</div>
              <div className="category-content">
                <h3>Artisanal Cleaning</h3>
                <p>
                  Editorial-level home detailing and deep sterilization
                  services.
                </p>
              </div>
            </div>
            <div
              className="category-wide-image"
              role="img"
              aria-label="Artisanal Cleaning"
            />
          </article>

          <div className="category-small-grid">
            <article className="category-small-card">
              <div className="category-badge">+</div>
              <div className="category-content">
                <h3>Electrical</h3>
                <p>Smart home integration and precision wiring.</p>
              </div>
            </article>

            <article className="category-small-card">
              <div className="category-badge">#</div>
              <div className="category-content">
                <h3>Design &amp; Paint</h3>
                <p>High-end finishes and color consultation.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
