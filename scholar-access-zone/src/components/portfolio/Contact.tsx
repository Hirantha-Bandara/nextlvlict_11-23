import React, { useState } from 'react';

interface ContactForm {
    name: string;
    email: string;
    phone: string;
    school: string;
    message: string;
    newsletter: boolean;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        phone: '',
        school: '',
        message: '',
        newsletter: false
    });
    
    const WHATSAPP_NUMBER = '1234567890'; // Replace with your WhatsApp number (include country code)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const whatsappMessage = `Hello! My name is ${formData.name}.\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSchool: ${formData.school}\nMessage: ${formData.message}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            school: '',
            message: '',
            newsletter: false
        });
    };

    return (
        <section id="contact" className="section-padding">
            <div className="container">
                <h2 className="section-title text-center" data-aos="fade-up">Get In Touch</h2>
                <p className="lead text-center mb-5" data-aos="fade-up" data-aos-delay="100">
                    Have questions or ready to enroll? Contact me today to discuss how I can help you achieve ICT excellence.
                </p>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="contact-form" data-aos="fade-up" data-aos-duration="800">
                            <form onSubmit={handleWhatsAppSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="name" className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email Address *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="subject" className="form-label">School *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="school"
                                            name="school"
                                            value={formData.school}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message *</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                {/* <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="newsletter"
                                        name="newsletter"
                                        checked={formData.newsletter}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="newsletter">
                                        Subscribe to newsletter for updates and study tips
                                    </label>
                                </div> */}
                                <div className="text-center">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg"
                                    >
                                        📱 Send via WhatsApp
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;