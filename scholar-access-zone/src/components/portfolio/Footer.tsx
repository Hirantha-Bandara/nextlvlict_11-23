import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 mb-4 mb-lg-0" data-aos="fade-up" data-aos-duration="800">
                        <h4 className="mb-4">Next Level ICT</h4>
                        <p>Providing quality ICT education to O/L and A/L students in Sri Lanka, helping them achieve academic excellence and build strong foundations for technology careers.</p>
                        <div className="mt-3">
                            <a href="https://www.facebook.com/kavishna.munasingha" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                            <a href="https://www.instagram.com/kavishnamunasingha/" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-instagram"></i></a>
                            <a href="https://www.youtube.com/@ictwithkavishnamunasingha" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-youtube"></i></a>
                            <a href="https://www.linkedin.com/in/kavishna-munasingha-814a2a194/" target="_blank" rel="noopener noreferrer" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-4 mb-4 mb-lg-0" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
                        <h5 className="mb-4">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="#home" className="text-white">Home</a></li>
                            <li className="mb-2"><a href="#about" className="text-white">About</a></li>
                            <li className="mb-2"><a href="#media" className="text-white">Media</a></li>
                            <li className="mb-2"><a href="#courses" className="text-white">Courses</a></li>
                            <li className="mb-2"><a href="#schedule" className="text-white">Class Timetable</a></li>
                            <li className="mb-2"><a href="#fees" className="text-white">Class Fees</a></li>
                            <li className="mb-2"><a href="#contact" className="text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
                        <h5 className="mb-4">Contact Information</h5>
                        <ul className="list-unstyled">
                            <li className="mb-3"><i className="fas fa-map-marker-alt me-2"></i>Colombo, Sri Lanka</li>
                            <li className="mb-3"><i className="fas fa-phone me-2"></i> +94 78 480 0385</li>
                            <li className="mb-3"><i className="fas fa-phone me-2"></i> +94 76 133 8551</li>
                            <li className="mb-3"><i className="fas fa-envelope me-2"></i> nextlevelict.info@gmail.com</li>
                        </ul>
                        {/* <div className="mt-4">
                            <h6>Subscribe to our newsletter</h6>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Your email address" />
                                <button className="btn btn-secondary" type="button">Subscribe</button>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <p className="mb-0">&copy; 2025 Next Level ICT. All rights reserved.</p>
                        <p className="mb-0">&reg; Developed by KaleoX Software Solutions.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <a href="/privacy-policy.html" className="text-light">Privacy Policy</a>&nbsp;|&nbsp;
                        <a href="/terms-and-conditions.html" className="text-light">Terms of Service</a>&nbsp;|&nbsp;
                        <a href="/refund-policy.html" className="text-light">Refund Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;