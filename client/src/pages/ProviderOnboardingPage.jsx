import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestProviderAccess } from '../api/userApi';
import './ProviderOnboardingPage.css';

function ProviderOnboardingPage() {
  const { authState } = useAuth();

  const [formState, setFormState] = useState({
    phone: '',
    bio: '',
    services: '',
    documents: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const parsedDocuments = useMemo(
    () =>
      formState.documents
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    [formState.documents]
  );

  const parsedServices = useMemo(
    () =>
      formState.services
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [formState.services]
  );

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!authState?.token) {
      setErrorMessage('Please sign in to request provider access.');
      return;
    }

    if (parsedDocuments.length === 0) {
      setErrorMessage('Please add at least one verification document link.');
      return;
    }

    try {
      setIsSubmitting(true);

      await requestProviderAccess(
        {
          phone: formState.phone,
          bio: formState.bio,
          servicesOffered: parsedServices,
          documents: parsedDocuments,
        },
        authState.token
      );

      setSuccessMessage('Provider access request submitted. Status: pending review.');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to submit provider request.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="provider-onboarding-page">
      <section className="provider-onboarding-hero">
        <p className="provider-onboarding-kicker">Provider onboarding</p>
        <h1>Become a verified UrbanConnect provider</h1>
        <p>
          Complete your profile and upload verification links. Your application will be reviewed by an admin.
        </p>
      </section>

      <section className="provider-onboarding-card">
        <form className="provider-onboarding-form" onSubmit={handleSubmit}>
          <label className="provider-onboarding-field">
            <span>Phone number</span>
            <input
              type="text"
              name="phone"
              value={formState.phone}
              onChange={updateField}
              placeholder="+1 555 123 4567"
              required
            />
          </label>

          <label className="provider-onboarding-field">
            <span>Provider bio</span>
            <textarea
              rows="4"
              name="bio"
              value={formState.bio}
              onChange={updateField}
              placeholder="Tell customers about your experience, service quality, and specialties."
              required
            />
          </label>

          <label className="provider-onboarding-field">
            <span>Services offered (comma separated)</span>
            <input
              type="text"
              name="services"
              value={formState.services}
              onChange={updateField}
              placeholder="Plumbing, Electrical, Deep Cleaning"
            />
          </label>

          <label className="provider-onboarding-field">
            <span>Verification documents (one URL per line)</span>
            <textarea
              rows="5"
              name="documents"
              value={formState.documents}
              onChange={updateField}
              placeholder="https://.../license.pdf\nhttps://.../id-proof.pdf"
              required
            />
          </label>

          {errorMessage ? <p className="provider-onboarding-error">{errorMessage}</p> : null}
          {successMessage ? <p className="provider-onboarding-success">{successMessage}</p> : null}

          <div className="provider-onboarding-actions">
            <Link to="/" className="provider-onboarding-link">
              Back to home
            </Link>
            <button type="submit" className="provider-onboarding-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit provider request'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProviderOnboardingPage;
