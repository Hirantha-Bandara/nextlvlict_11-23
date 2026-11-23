import React, { useState, useEffect } from 'react';
import { Event } from '@/data/mockData';

interface EventModalProps {
    event: Event | null;
    show: boolean;
    onHide: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, show, onHide }) => {
    if (!event) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onHide();
        }
    };

    // Slideshow state (moved out of nested function so hooks follow rules)
    const images = event.images || [];
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // reset to first slide when modal opens
        if (show) setIndex(0);
    }, [show, event]);

    useEffect(() => {
        if (!show) return;
        if (images.length <= 1) return;
        if (isPaused) return;
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % images.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [show, images.length, isPaused]);

    // Function to extract date, time, location from fullDescription
    const extractEventInfo = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = event.fullDescription;

        const dateMatch = event.fullDescription.match(/<strong>Date:<\/strong>\s*([^<]+)/);
        const timeMatch = event.fullDescription.match(/<strong>Time:<\/strong>\s*([^<]+)/);
        const locationMatch = event.fullDescription.match(/<strong>Location:<\/strong>\s*([^<]+)/);
        const feeMatch = event.fullDescription.match(/<strong>Fee:<\/strong>\s*([^<]+)/);

        return {
            date: dateMatch ? dateMatch[1].trim() : event.date,
            time: timeMatch ? timeMatch[1].trim() : "9:00 AM - 4:00 PM",
            location: locationMatch ? locationMatch[1].trim() : event.location,
            fee: feeMatch ? feeMatch[1].trim() : (event.fee || "Rs. 2,500")
        };
    };

    const eventInfo = extractEventInfo();

    return (
        <div
            className={`modal ${show ? 'show' : ''}`}
            onClick={handleBackdropClick}
            style={{ display: show ? 'flex' : 'none' }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{event.title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onHide}
                            aria-label="Close"
                        >×</button>
                    </div>
                    <div className="modal-body">
                        {/* Image Carousel */}
                        {images.length > 0 && (
                            (() => {
                                // simple animated slideshow using opacity + translate
                                const itemStyle: React.CSSProperties = {
                                    position: 'absolute',
                                    inset: 0,
                                    transition: 'opacity 450ms ease, transform 450ms ease',
                                    opacity: 0,
                                    transform: 'translateY(6px)',
                                    display: 'block',
                                };
                                const activeStyle: React.CSSProperties = {
                                    opacity: 1,
                                    transform: 'translateY(0)',
                                };

                                const prev = (e?: React.MouseEvent) => {
                                    e?.stopPropagation();
                                    setIndex((i) => (i - 1 + images.length) % images.length);
                                };
                                const next = (e?: React.MouseEvent) => {
                                    e?.stopPropagation();
                                    setIndex((i) => (i + 1) % images.length);
                                };

                                return (
                                    <div
                                        className="custom-slideshow"
                                        onMouseEnter={() => setIsPaused(true)}
                                        onMouseLeave={() => setIsPaused(false)}
                                        style={{ position: 'relative', height: 320, overflow: 'hidden' }}
                                    >
                                        {images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`slideshow-item ${idx === index ? 'active' : ''}`}
                                                style={{ ...(itemStyle), ...(idx === index ? activeStyle : {}) }}
                                                aria-hidden={idx === index ? 'false' : 'true'}
                                            >
                                                <img
                                                    src={img}
                                                    className="event-modal-img"
                                                    alt={`${event.title} - Image ${idx + 1}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                        ))}

                                        {images.length > 1 && (
                                            <>
                                                <div className="slideshow-controls" style={{ position: 'absolute', top: '50%', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                                    <button style={{ pointerEvents: 'auto' }} className="prev" onClick={prev} aria-label="Previous">‹</button>
                                                    <button style={{ pointerEvents: 'auto' }} className="next" onClick={next} aria-label="Next">›</button>
                                                </div>
                                                <div className="slideshow-indicators" style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                                                    {images.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            className={`indicator ${idx === index ? 'active' : ''}`}
                                                            onClick={(e) => { e.stopPropagation(); setIndex(idx); }}
                                                            aria-label={`Go to slide ${idx + 1}`}
                                                            style={{
                                                                width: 10, height: 10, borderRadius: '50%',
                                                                border: 'none', background: idx === index ? '#fff' : 'rgba(255,255,255,0.5)', padding: 0,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })()
                        )}

                        <div className="event-details">
                            {/* Event Information Cards */}
                            <div className="event-info-cards">
                                <div className="event-info-card">
                                    <h5>Date</h5>
                                    <p>{eventInfo.date}</p>
                                </div>
                                <div className="event-info-card">
                                    <h5>Time</h5>
                                    <p>{eventInfo.time}</p>
                                </div>
                                <div className="event-info-card">
                                    <h5>Location</h5>
                                    <p>{eventInfo.location}</p>
                                </div>
                            </div>

                            {/* Event Description - Using dangerouslySetInnerHTML */}
                            <div dangerouslySetInnerHTML={{ __html: event.fullDescription }} />

                            {/* Fee Highlight Section */}
                            <div className="event-fee">
                                <h4>Registration Fee</h4>
                                <p>{eventInfo.fee}</p>
                                <small>Includes materials and lunch • Limited seats available</small>
                            </div>

                            {/* Register Button */}
                            <a
                                href="#contact"
                                className="event-register-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onHide();
                                    // Scroll to contact section
                                    const contactSection = document.getElementById('contact');
                                    if (contactSection) {
                                        contactSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                Register Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;