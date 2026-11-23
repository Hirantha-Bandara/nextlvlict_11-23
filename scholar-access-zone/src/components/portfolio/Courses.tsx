import React from 'react';
import { courses } from '@/data/mockData';

const Courses: React.FC = () => {
    return (
        <section id="courses" className="section-padding bg-light-custom">
            <div className="container">
                <h2 className="section-title text-center" data-aos="fade-up">ICT Courses Offered</h2>
                <p className="lead text-center mb-5" data-aos="fade-up" data-aos-delay="100">
                    Comprehensive ICT courses tailored to the Sri Lankan curriculum, designed to help students excel in their examinations and develop practical skills.
                </p>

                <div className="row">
                    {courses.map((course, index) => (
                        <div key={course.id} className="col-lg-6 mb-4" data-aos={index === 0 ? "fade-right" : "fade-left"} data-aos-duration="800">
                            <div className="card course-card">
                                <div className="card-body">
                                    <div className="text-center mb-4">
                                        <div className="card-icon">
                                            <i className={course.icon}></i>
                                        </div>
                                        <h3 className="card-title">{course.title}</h3>
                                        <p className="text-muted">{course.description}</p>
                                    </div>
                                    {/* <ul className="list-unstyled">
                                        {course.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="mb-3">
                                                <i className="fas fa-check-circle text-primary me-2"></i> {feature}
                                            </li>
                                        ))}
                                    </ul> */}
                                    {/* <div className="text-center mt-4">
                                        <a href="#contact" className="btn btn-primary">Learn More</a>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Courses;