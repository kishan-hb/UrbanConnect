import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();
  const [service, setService] = useState('');
  const [zipCode, setZipCode] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set('service', service.trim());
    if (zipCode.trim()) params.set('zipCode', zipCode.trim());
    const queryString = params.toString();
    navigate(queryString ? `/services?$\{queryString}` : '/services');
  }

  return (
    <section className="relative min-h-[450px] md:min-h-[600px] flex items-center bg-[#f8f9fa] pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* High-Fidelity Asset-Based Background */}
      <div className="absolute top-0 right-0 w-full md:w-[80%] h-full pointer-events-none select-none overflow-hidden">
        <img 
          src="/screen.png"
          alt="" 
          className="absolute -right-20 md:-right-40 -top-20 w-[120%] h-[120%] object-cover object-right-top opacity-70 transform-gpu"
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9fa] via-[#f8f9fa]/80 to-transparent md:from-30% md:via-50%" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full text-left">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 backdrop-blur-sm text-[#003366] text-[10px] md:text-xs font-bold tracking-wide uppercase border border-blue-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Bespoke Home Management
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#003366] leading-[1.1] tracking-tighter drop-shadow-sm">
            Your home, perfectly <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003366] via-blue-700 to-blue-500">orchestrated.</span>
          </h1>

          <p className="text-sm md:text-lg text-slate-600 leading-relaxed max-w-xl font-medium">
            Experience the pinnacle of urban living with our elite network of verified domestic specialists and home managers.
          </p>

          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 max-w-xl">
            <div className="flex-1 flex items-center px-4 py-3 gap-3 bg-slate-50/50 rounded-xl border border-transparent focus-within:border-blue-200 transition-all">
              <span className="material-icons text-slate-400 text-sm">search</span>
              <input
                className="w-full bg-transparent text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none"
                type="text"
                placeholder="What service?"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 gap-3 bg-slate-50/50 rounded-xl border border-transparent focus-within:border-blue-200 transition-all">
              <span className="material-icons text-slate-400 text-sm">location_on</span>
              <input
                className="w-full bg-transparent text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none"
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-[#003366] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-900 transition-all active:scale-95 shadow-lg">
              Explore
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;