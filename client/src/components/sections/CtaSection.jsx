function CtaSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative overflow-hidden bg-[#003366] rounded-[2.5rem] p-10 md:p-20 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/architectural-drawings.png")', backgroundSize: '400px'}} />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
              Elevate your living standard today.
            </h2>
            
            <p className="text-blue-100/70 text-sm md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
              Join the UrbanConnect circle and rediscover the joy of an impeccably managed home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-2">
              <a href="/services" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-[#003366] px-10 py-4 rounded-xl font-black text-sm md:text-base transition-all shadow-xl hover:shadow-yellow-500/20 active:scale-95">
                Book First Service
              </a>
              <a href="/provider-onboarding" className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white border-2 border-white/20 px-10 py-4 rounded-xl font-black text-sm md:text-base transition-all active:scale-95">
                Become a Provider
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;