import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Courses from '@/components/portfolio/Courses';
import FreeLessons from '@/components/portfolio/FreeLessons';
import StudentPortal from '@/components/portfolio/StudentPortal';
import Testimonials from '@/components/portfolio/Testimonials';
import ScheduleFees from '@/components/portfolio/ScheduleFees';
import ClassFees from '@/components/portfolio/ClassFees';
import Events from '@/components/portfolio/Events';
import Resources from '@/components/portfolio/Resources';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import WhatsAppButton from '@/components/portfolio/WhatsAppButton';
import MediaShowcase from '@/components/portfolio/MediaShowcase';
import Gallery from '@/components/portfolio/Gallery';

import './Portfolio.css';
import portfolioService, {
  TestimonialDTO,
  EventDTO,
  OLTimetableDTO,
  ALTimetableDTO,
  GalleryImageDTO,
  BranchImageDTO,
  FreeLessonDTO
} from '@/services/portfolioService';

// Create context for portfolio data
const PortfolioDataContext = React.createContext<{
  testimonials: TestimonialDTO[];
  events: EventDTO[];
  olTimetable: OLTimetableDTO[];
  alTimetable: ALTimetableDTO[];
  gallery: GalleryImageDTO[];
  branchImages: BranchImageDTO[];
  freeLessons: FreeLessonDTO[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
} | null>(null);

export const usePortfolioData = () => {
  const context = React.useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within PortfolioDataProvider');
  }
  return context;
};

const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<TestimonialDTO[]>([]);
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [olTimetable, setOlTimetable] = useState<OLTimetableDTO[]>([]);
  const [alTimetable, setAlTimetable] = useState<ALTimetableDTO[]>([]);
  const [gallery, setGallery] = useState<GalleryImageDTO[]>([]);
  const [branchImages, setBranchImages] = useState<BranchImageDTO[]>([]);
  const [freeLessons, setFreeLessons] = useState<FreeLessonDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [data, galleryImages, branches, lessons] = await Promise.all([
        portfolioService.getAllPortfolioData(),
        portfolioService.getGalleryImages(),
        portfolioService.getBranchImages(),
        portfolioService.getFreeLessons()
      ]);
      
      if (data) {
        setTestimonials(data.testimonials || []);
        setEvents(data.events || []);
        setOlTimetable(data.olTimetable || []);
        setAlTimetable(data.alTimetable || []);
        setGallery(galleryImages);
        setBranchImages(branches);
        setFreeLessons(lessons || []);
      } else {
        setError('Failed to load portfolio data');
      }
    } catch (err) {
      setError('An error occurred while loading data');
      console.error('Error loading portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <PortfolioDataContext.Provider value={{
      testimonials,
      events,
      olTimetable,
      alTimetable,
      gallery,
      branchImages,
      freeLessons,
      loading,
      error,
      refreshData: loadData
    }}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

const PortfolioContent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/dashboard");
    }

    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });

    // Navbar scrolled class (keeps previous behavior)
    const applyScrolled = (nav: HTMLElement | null, scrolled: boolean) => {
      if (!nav) return;
      nav.classList.toggle('scrolled', scrolled);
    };

    const navbarEl = document.querySelector('.navbar') as HTMLElement | null;
    if (navbarEl) applyScrolled(navbarEl, window.scrollY > 50);

    // Cache nav elements
    const navToggle = document.querySelector('.nav-toggle, .navbar-toggler') as HTMLElement | null;
    const nav = document.querySelector('.navbar') as HTMLElement | null;
    const navLinks = Array.from(document.querySelectorAll('.navbar .nav-link')) as HTMLElement[];
    const sections = Array.from(document.querySelectorAll('section[id]')) as HTMLElement[];

    // Scroll handler (applies scrolled class and updates active link)
    let rafId: number | null = null;
    const updateOnScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        applyScrolled(nav, window.scrollY > 50);

        // scroll-spy: pick the section nearest to top (with some offset)
        let currentId = '';
        const offsetViewport = window.innerHeight * 0.35;
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= offsetViewport) currentId = sec.id;
        }
        // update link active state
        navLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          const matches = href === `#${currentId}`;
          link.classList.toggle('active', matches);
        });
      });
    };

    // Toggler behavior: toggle .open and update aria-expanded
    const toggleNav = () => {
      if (!nav) return;
      nav.classList.toggle('open');
      if (navToggle) {
        const expanded = nav.classList.contains('open');
        navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    };

    const closeNav = () => {
      if (!nav) return;
      nav.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    };

    // Attach listeners
    window.addEventListener('scroll', updateOnScroll, { passive: true });
    navToggle?.addEventListener('click', toggleNav);
    navLinks.forEach(link => link.addEventListener('click', closeNav));
    const onResize = () => { if (window.innerWidth > 768) closeNav(); };
    window.addEventListener('resize', onResize);

    // initial active update
    updateOnScroll();

    // cleanup
    return () => {
      window.removeEventListener('scroll', updateOnScroll);
      navToggle?.removeEventListener('click', toggleNav);
      navLinks.forEach(link => link.removeEventListener('click', closeNav));
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      // restore classes
      if (nav) {
        nav.classList.remove('scrolled', 'open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    };
  }, [navigate]);

  return (
    <div className="portfolio">
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container">
          <a className="navbar-brand" href="#home">
            <img
              className="navbar-logo"
              src="/Logo%5B1%5D-4.png"
              alt="Next Level ICT logo"
              width={140}
              height={40}
            />
            <span className="sr-only">Next Level ICT</span>
          </a>

          <button className="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" type="button">
            <span className="bar" aria-hidden="true"></span>
            <span className="bar" aria-hidden="true"></span>
            <span className="bar" aria-hidden="true"></span>
          </button>

          <ul className="navbar-nav">
            <li><a className="nav-link" href="#home">Home</a></li>
            <li><a className="nav-link" href="#about">About</a></li>
            <li><a className="nav-link" href="#courses">Courses</a></li>
            <li><a className="nav-link" href="#free-lessons">Free Lessons</a></li>
            <li><a className="nav-link" href="#student-portal">Student Portal</a></li>
            <li><a className="nav-link" href="#schedule">Class Timetable</a></li>
            <li><a className="nav-link" href="#fees">Class Fees</a></li>
            <li><a className="nav-link" href="#events">Events</a></li>
            <li><a className="nav-link" href="#gallery">Gallery</a></li>
            <li><a className="nav-link" href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <Hero />
      <MediaShowcase />
      <About />
      <Courses />
      <FreeLessons />
      <StudentPortal />
      <Testimonials />
      <ScheduleFees />
      <ClassFees />
      <Events />
      <Gallery />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const Portfolio = () => {
  return (
    <PortfolioDataProvider>
      <PortfolioContent />
    </PortfolioDataProvider>
  );
};

export default Portfolio;
