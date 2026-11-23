// Events.tsx
import React, { useState } from 'react';
import EventModal from './EventModal';
import { usePortfolioData } from '../../pages/Portfolio';

const Events: React.FC = () => {
    const { events, loading, error, refreshData } = usePortfolioData();
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    if (loading) {
        return (
            <section id="events" className="section-padding">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading events...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="events" className="section-padding">
                <div className="container text-center text-danger">
                    <p>{error}</p>
                    <button className="btn btn-outline-primary" onClick={refreshData}>
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="events" className="section-padding">
                <div className="container">
                    <h2 className="section-title" data-aos="fade-up">Special Events & Seminars</h2>
                    <p className="lead mb-5" data-aos="fade-up" data-aos-delay="100">
                        Enhance your ICT knowledge through our exclusive events, workshops, and seminars designed to provide deeper insights beyond regular classes.
                    </p>

                    {events.length === 0 ? (
                        <p className="text-center">No events available.</p>
                    ) : (
                        <div className="event-grid">
                            {events.map((event, index) => (
                                <div
                                    key={event.id}
                                    className="card event-card"
                                    onClick={() => handleEventClick(event)}
                                    data-aos="fade-up"
                                    data-aos-duration="800"
                                    data-aos-delay={index * 100}
                                >
                                    <img src={event.image} className="card-img-top event-image" alt={event.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{event.title}</h5>
                                        <p className="card-text">{event.description}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                <i className="fas fa-calendar me-2"></i>{event.date}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-5" data-aos="fade-up" data-aos-duration="800">
                        <a href="#contact" className="btn btn-outline-primary">View All Upcoming Events</a>
                    </div>
                </div>
            </section>

            <EventModal event={selectedEvent} show={showModal} onHide={handleCloseModal} />
        </>
    );
};

export default Events;