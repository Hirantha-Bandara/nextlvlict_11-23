import React from 'react';
import { testimonials as fallbackTestimonials } from '@/data/mockData';
import { usePortfolioData } from '@/pages/Portfolio';

const Testimonials: React.FC = () => {
    const { testimonials } = usePortfolioData();
    const items = testimonials.length ? testimonials : fallbackTestimonials;
    return (
        <section id="testimonials" className="section-padding">
            <div className="container">
                <h2 className="section-title text-center" data-aos="fade-up">What My Students Say</h2>
                <div className="row">
                    {items.map((testimonial, index) => (
                        <div key={testimonial.id} className="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100}>
                            <div className="testimonial-card">
                                <div className="d-flex align-items-center mb-3">
                                    <img src={testimonial.image || 'https://placehold.co/70x70/3c6299/FFFFFF?text=ST'} alt={testimonial.name} className="testimonial-img" />
                                    <div>
                                        <h5 className="mb-0">{testimonial.name}</h5>
                                        <small className="text-muted">{testimonial.role}</small>
                                    </div>
                                </div>
                                <p className="testimonial-text mb-0">"{testimonial.text}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    //     <section id="media" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={{ padding: 0, margin: 0 }}>
    //         <div className="container-fluid p-0" style={{ margin: 0, padding: 0 }}>
    //             <div className="w-100" style={{ margin: 0, padding: 0 }}>

    //                 {/* Image Section - Full Height */}
    //                 <div className="position-relative w-100 overflow-hidden" style={{ margin: 0, padding: 0, lineHeight: 0 }} data-aos="fade-up" data-aos-duration="800">
    //                     <div className="position-relative w-100 h-100">
    //                         <img
    //                             src={`${import.meta.env.BASE_URL}final_page-0006.jpg`}
    //                             alt="Platform showcase"
    //                             className="w-100 h-100"
    //                             style={{ objectFit: 'cover', display: 'block', margin: 0, padding: 0 }}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         <style>{`
    //     #media {
    //       padding: 0 !important;
    //       margin: 0 !important;
    //       background: none !important;
    //       line-height: 0;
    //     }

    //     #media .section-title,
    //     #media .lead {
    //       display: none;
    //     }

    //     .media-card {
    //       background: none;
    //       backdrop-filter: none;
    //       border: none;
    //       transition: all 0.3s ease;
    //       width: 100%;
    //       height: 100%;
    //       margin: 0;
    //       padding: 0;
    //       line-height: 0;
    //     }

    //     .media-card:hover {
    //       background: none;
    //       border-color: transparent;
    //       box-shadow: none;
    //     }

    //     .video-card, .image-card {
    //       min-height: 100vh;
    //       display: flex;
    //       align-items: center;
    //       justify-content: center;
    //       margin: 0;
    //       padding: 0;
    //       line-height: 0;
    //     }

    //     video, img {
    //       display: block !important;
    //       margin: 0 !important;
    //       padding: 0 !important;
    //       line-height: 0;
    //     }

    //     .play-btn {
    //       transition: all 0.3s ease;
    //       backdrop-filter: blur(5px);
    //       background: rgba(255, 255, 255, 0.9) !important;
    //       border: none;
    //       z-index: 10;
    //     }

    //     .play-btn:hover {
    //       transform: scale(1.1);
    //       background: white !important;
    //       box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    //     }

    //     @media (max-width: 768px) {
    //       .play-btn {
    //         width: 70px !important;
    //         height: 70px !important;
    //       }

    //       #media {
    //         padding: 0 !important;
    //         margin: 0 !important;
    //         background: transparent !important;
    //         line-height: 0 !important;
    //       }

    //       .container-fluid {
    //         padding: 0 !important;
    //         margin: 0 !important;
    //         line-height: 0;
    //       }

    //       .w-100 {
    //         margin: 0 !important;
    //         padding: 0 !important;
    //         line-height: 0;
    //       }

    //       .position-relative.w-100 {
    //         margin: 0 !important;
    //         padding: 0 !important;
    //         gap: 0 !important;
    //         line-height: 0 !important;
    //         font-size: 0;
    //       }

    //       video, img {
    //         display: block !important;
    //         margin: 0 !important;
    //         padding: 0 !important;
    //         line-height: 0;
    //       }
    //     }
    //   `}</style>
    //     </section>
    );
};


export default Testimonials;
