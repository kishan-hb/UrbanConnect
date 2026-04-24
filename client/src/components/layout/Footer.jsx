function Footer() {
  return (
    <footer className="bg-slate-50 pt-16 pb-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-[#003366]">
              UrbanConnect
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Bespoke Home Management
            </span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            &copy; 2024 UrbanConnect. Dedicated to architectural precision in home care.
          </p>
          <div className="flex gap-3">
            {['share', 'public'].map((icon) => (
              <a href="/" key={icon} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#003366] hover:text-white transition-all shadow-sm">
                <span className="material-icons text-sm">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[#003366] font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Company</h3>
          <ul className="space-y-3 text-[11px] font-bold text-slate-500">
            <li><a href="/" className="hover:text-[#003366] transition-colors">About Us</a></li>
            <li><a href="/" className="hover:text-[#003366] transition-colors">Careers</a></li>
            <li><a href="/" className="hover:text-[#003366] transition-colors">Service Areas</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#003366] font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Support</h3>
          <ul className="space-y-3 text-[11px] font-bold text-slate-500">
            <li><a href="/" className="hover:text-[#003366] transition-colors">Concierge Support</a></li>
            <li><a href="/" className="hover:text-[#003366] transition-colors">Terms of Service</a></li>
            <li><a href="/" className="hover:text-[#003366] transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#003366] font-bold uppercase tracking-[0.2em] text-[10px] mb-6">Experience</h3>
          <p className="text-slate-400 text-[10px] font-medium mb-4 leading-relaxed">
            Download our mobile companion for real-time tracking.
          </p>
          <div className="flex flex-col gap-2">
            <button className="bg-[#003366] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-[10px] shadow-md">
               <span className="material-icons text-sm">apple</span> App Store
            </button>
            <button className="bg-[#003366] text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-[10px] shadow-md">
               <span className="material-icons text-sm">play_arrow</span> Google Play
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
           Secure Payments via Stripe | Concierge Level Service
        </p>
        <div className="flex gap-6 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
           <span className="material-icons text-[10px] align-middle">lock</span>
           <span className="material-icons text-[10px] align-middle">notifications</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;