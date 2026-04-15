const journeySteps = [
  {
    title: 'Initial Request',
    description: 'Detail your needs through our intuitive concierge platform. Specify preferences, urgency, and specific household requirements.',
    icon: 'hub',
    meta: 'EST. 2-4 HOURS'
  },
  {
    title: 'Professional Matching',
    description: 'Our algorithm selects the top-tier professional best suited for your specific sanctuary needs and architectural style.',
    icon: 'person_search',
    meta: 'VETTING COMPLETE'
  },
  {
    title: 'Journey Tracking',
    description: 'Monitor progress in real-time. Receive high-resolution photographic updates and professional milestones as they occur.',
    icon: 'analytics',
    meta: 'LIVE UPDATES'
  },
  {
    title: 'Final Completion',
    description: 'Confirm your satisfaction. Secure payment is processed automatically once the premium quality standards are met.',
    icon: 'verified',
    meta: 'QUALITY ASSURED'
  },
];

function JourneySection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden" id="journey">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 border border-blue-100">
          Service Flow
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tighter mb-4">
          Seamless Project Execution
        </h2>
        <div className="w-16 md:w-24 h-1 md:h-1.5 bg-yellow-400 mx-auto rounded-full mb-12 md:mb-16" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-px bg-slate-100 -z-10" />
          
          {journeySteps.map((step, idx) => (
            <div key={step.title} className="relative group p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-left md:text-center lg:text-left">
              <div className="absolute top-4 right-6 md:right-8 text-6xl md:text-8xl font-black text-slate-100 italic group-hover:text-blue-50 transition-colors">
                0{idx + 1}
              </div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-900 flex items-center justify-center mb-6 md:mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-icons text-white text-2xl md:text-3xl">{step.icon}</span>
                </div>
                
                <h3 className="text-lg md:text-xl font-extrabold text-blue-900 mb-3 md:mb-4 tracking-tight">
                  {step.title}
                </h3>
                
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
                  {step.description}
                </p>

                <div className="pt-4 md:pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-yellow-600 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-500" />
                    {step.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JourneySection;