import HeroSection from '../components/sections/HeroSection.jsx';
import CategoriesSection from '../components/sections/CategoriesSection.jsx';
import JourneySection from '../components/sections/JourneySection.jsx';
import ProfessionalsSection from '../components/sections/ProfessionalsSection.jsx';
import CtaSection from '../components/sections/CtaSection.jsx';
import './LandingPage.css';

function LandingPage() {
  return (
    <main className="landing-page">
      <HeroSection />
      <CategoriesSection />
      <JourneySection />
      <ProfessionalsSection />
      <CtaSection />
    </main>
  );
}

export default LandingPage;
