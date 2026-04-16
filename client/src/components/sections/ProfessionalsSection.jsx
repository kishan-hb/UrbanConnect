import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfessionalsSection() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      try {
        const data = [
          { id: 1, username: "Julian Thorne", rating: 4.9, reviews: 124, price: 120, role: "MASTER ELECTRICIAN", profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", description: "Specializing in high-end lighting installations and smart home integration for Manhattan's finest residences." },
          { id: 2, username: "Elena Rossi", rating: 5.0, reviews: 89, price: 95, role: "SENIOR CONCIERGE", profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", description: "Providing unparalleled organizational management and lifestyle concierge services for the city's busy elite." },
          { id: 3, username: "Marcus Sterling", rating: 4.8, reviews: 215, price: 150, role: "FINE FINISH PAINTER", profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400", description: "Master of archival-grade finishes and bespoke mural applications for contemporary and classic interiors." }
        ];
        setProfessionals(data);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[#003366] font-bold uppercase tracking-widest text-[9px] mb-2 block">Vetted Specialists</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#003366] tracking-tighter">Our Resident Specialists</h2>
            <p className="text-slate-500 text-sm font-medium">The most requested professionals in your metropolitan area.</p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#003366] hover:text-white transition-all shadow-sm">
              <span className="material-icons text-base">chevron_left</span>
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#003366] hover:text-white transition-all shadow-sm">
              <span className="material-icons text-base">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && professionals.map((pro) => (
            <article key={pro.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={pro.profilePicture} alt={pro.username} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <span className="material-icons text-yellow-500 text-[10px]">star</span>
                  <span className="text-[#003366] font-bold text-[10px]">{pro.rating.toFixed(1)} ({pro.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <p className="text-blue-600 font-bold text-[8px] tracking-widest uppercase mb-1">{pro.role}</p>
                  <h3 className="text-lg font-black text-[#003366] tracking-tight">{pro.username}</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3 font-medium">
                  {pro.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                  <p className="text-[#003366] font-black text-sm">${pro.price}<span className="text-[10px] text-slate-400 font-bold italic ml-0.5">/hr</span></p>
                  <button 
                    onClick={() => navigate(`/professionals/${pro.id}`)}
                    className="bg-[#003366] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-blue-800 transition-all shadow-lg active:scale-95"
                  >
                    Book
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProfessionalsSection;