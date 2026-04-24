function BookingStepper({ steps, currentStep }) {
  return (
    <section className="booking-stepper" aria-label="Booking progress">
      {steps.map((step) => {
        const stateClass =
          step.number === currentStep
            ? 'booking-step booking-step-active'
            : step.number < currentStep
              ? 'booking-step booking-step-complete'
              : 'booking-step';

        return (
          <div key={step.number} className={stateClass}>
            <div className="booking-step-marker">{step.number}</div>
            <div className="booking-step-copy">
              <span className="booking-step-label">Step {step.number}</span>
              <strong>{step.label}</strong>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default BookingStepper;
