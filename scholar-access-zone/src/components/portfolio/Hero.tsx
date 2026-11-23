import React, { useEffect, useState } from 'react';
import Particles from './Particles';

const Hero: React.FC = () => {
    // Slideshow images — replace these with your preferred image paths
    const slides = [
        'https://i.postimg.cc/C5KcXbbp/Untitled-3.jpg',
        'https://i.postimg.cc/TYgtS2WZ/Untitled-4.jpg', // replace or add your own images in the public folder
        'https://i.postimg.cc/XvM9d9J3/Untitled-1.jpg'
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000); // change slide every 6s
        return () => clearInterval(id);
    }, [slides.length]);

    useEffect(() => {
        // Prevent small horizontal white space by hiding horizontal overflow site-wide while this component is mounted
        const prev = {
            htmlOverflowX: document.documentElement.style.overflowX,
            bodyOverflowX: document.body.style.overflowX
        };
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
        return () => {
            document.documentElement.style.overflowX = prev.htmlOverflowX || '';
            document.body.style.overflowX = prev.bodyOverflowX || '';
        };
    }, []);

    return (
        <section
            id="home"
            className="hero-section"
            // keep the original blue background and ensure slideshow sits above it
            style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#0d6efd', width: '100%', boxSizing: 'border-box' }}
        >
            {/* Background slideshow (fills the section) */}
            <div
                className="hero-slideshow"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 0,
                    backgroundImage: `url(${slides[current]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'opacity 1s ease, background-image 0.5s ease',
                    opacity: 0.2, // reduce opacity so the blue background shows through
                    pointerEvents: 'none',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                }}
                aria-hidden="true"
            />

            {/* Particles should sit above the slideshow but under the content */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
                <Particles />
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row align-items-center min-vh-100">
                    <div className="col-lg-6 hero-content" data-aos="fade-right" data-aos-duration="1000">
                        <h1 className="slogan mb-3">NEXT LEVEL ICT</h1>
                        <h2 className="mb-4">Expert ICT Tuition for O/L & A/L Students</h2>
                        <p className="lead my-4">
                            Transform your understanding of Information & Communication Technology with personalized, engaging lessons designed to help you excel in your exams.
                        </p>
                        <div className="hero-buttons d-flex gap-3 flex-wrap">
                            <a href="#schedule" className="btn btn-light btn-lg px-4 py-3">Class Timetable</a>
                            <a href="#contact" className="btn btn-outline-light btn-lg px-4 py-3">Contact</a>
                        </div>
                    </div>
                    {/* <div className="col-lg-6 text-center" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="300">
                        <img
                            src="public\Logo[1]-4.png"
                            alt="Kavishna Munasinghe"
                            className="hero-image img-fluid rounded-3"
                            // style={{ maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        />
                    </div> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;