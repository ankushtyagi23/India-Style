import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <Services />
      <Gallery />
      <Reviews />
      <About />
    </div>
  );
}
