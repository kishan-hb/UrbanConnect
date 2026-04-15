import { Link } from 'react-router-dom';

const categories = [
  { title: "Housekeeping", desc: "Premium standards for every sanctuary.", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600", to: "/services?category=Cleaning", icon: "clean_hands" },
  { title: "Plumbing", desc: "Expert care for your essential infrastructure.", img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600", to: "/services?category=Plumbing", icon: "plumbing" },
  { title: "Electrical", desc: "Precision wiring and smart home integration.", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600", to: "/services?category=Electrical", icon: "electrical_services" },
  { title: "Painting", desc: "Artisanal finishes and curated color palettes.", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=600", to: "/services?category=Painting", icon: "format_paint" },
  { title: "A/V & Automation", desc: "Seamless entertainment and smart security.", img: "https://images.unsplash.com/photo-1558002038-103792e09a84?auto=format&fit=crop&q=80&w=600", to: "/services?category=Concierge", icon: "settings_input_component" }
];

function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div className="max-w-xl text-left">
            <span className="text-[#003366] font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Curated Categories</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#003366] tracking-tighter mb-2">Home Management Essentials</h2>
            <p className="text-slate-500 text-sm font-medium">Exceptional care for every corner of your sanctuary.</p>
          </div>
          <Link to="/services" className="group flex items-center gap-1.5 text-[#003366] font-bold hover:text-blue-700 transition-colors text-xs">
            View All Categories <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link 
              to={cat.to} 
              key={cat.title} 
              className={`group relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 ${idx === 0 ? 'sm:col-span-2 sm:row-span-1 aspect-[2/1] lg:aspect-[16/9]' : 'aspect-square'}`}
            >
              <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/90 via-[#003366]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 shadow-lg">
                  <span className="material-icons text-white text-xl">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1 tracking-tight">{cat.title}</h3>
                <p className="text-blue-100 text-xs line-clamp-1 font-medium opacity-80">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;