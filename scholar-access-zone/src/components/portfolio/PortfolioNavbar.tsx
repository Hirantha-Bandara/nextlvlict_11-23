import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioNavbar: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light sticky-top">
            <div className="container">
                <a className="navbar-brand" href="https://portfolio.nextlvlict.com/">Next Level ICT</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#about">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#courses">Courses</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#free-lessons">Free Lessons</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#student-portal">Student Portal</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#testimonials">Testimonials</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#schedule">Schedule & Fees</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#events">Events</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#resources">Resources</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact">Contact</a>
                        </li>
                        <li className="nav-item ms-lg-3">
                            <Link to="/login" className="btn btn-primary">
                                Student Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default PortfolioNavbar;