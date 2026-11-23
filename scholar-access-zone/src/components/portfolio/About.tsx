import React from 'react';
import { stats } from '@/data/mockData';

const About: React.FC = () => {
    return (
        <section id="about" className="section-padding">
            <div className="container">
                <h2 className="section-title " data-aos="fade-up">Behind the expertise</h2>
                <div className="row align-items-center">
                    <div className="col-lg-6" data-aos="fade-right" data-aos-duration="800">
                        <h3 className="mb-4" style={{ fontWeight: '700' }}>Kavishna Munasinghe</h3>
                        <p className="mb-4">
                            Having completed his Advanced Level in Maths at Isipathana College, Colombo, he completed his Advanced Diploma in Software Engineering, which is offered by a leading private university in Colombo and a recognized university in Britain, and is currently pursuing higher education in Cyber ​​Security and Artificial Intelligence.
                        </p>
                        <p className="mb-4">
                            In addition, he has completed a Diploma in Information and Communication Technology and a Diploma in Business Management. In the field of tutoring classes, he is known as the teacher who has won the trust of the largest number of children in the Colombo District for Ordinary Level Information and Communication Technology and has produced the best results in the Colombo District.
                        </p>
                        <p>
                            Also, your teacher is not only qualified to teach Ordinary Level, but also teaches Advanced Level Information and Communication Technology and is currently gaining the trust of those children and their parents in a short period of time in several major cities in the Colombo District.
                        </p>
                    </div>
                    <div className="col-lg-6 mt-5 mt-lg-0 d-flex justify-content-center align-items-start" data-aos="fade-left" data-aos-duration="800" data-aos-delay="300">
                        <img
                            src="https://i.postimg.cc/Yqdz4Fbc/490764019_3972867666363769_9050074516526758299_n_Photoroom.png"
                            alt="Kavishna Munasinghe"
                            className="img-fluid rounded-3"
                            style={{
                                width: '100%',
                                maxWidth: 350,
                                height: 'auto',
                                objectFit: 'cover',
                                transform: 'translateY(-18px)',
                                transition: 'transform 220ms ease',
                                // subtle fade at the bottom: start fading around 70% -> fully transparent at 100%
                                WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                                maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                            }}
                        />
                    </div>
                </div>

                <div className="row mt-5 pt-5 justify-content-center text-center"
                     style={{ ['--statBoxMinHeight' as any]: '160px', ['--statBoxPadding' as any]: '1.5rem', flexWrap: 'wrap' }}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="col-12 col-sm-6 col-md-3 mb-4" // stack on mobile, 2-up on small, 4-up on md+
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay={index * 100}
                        >
                            <div className="stat-box" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center', // center text within box
                                minHeight: 'var(--statBoxMinHeight, 140px)', // resize via --statBoxMinHeight on the row
                                padding: 'var(--statBoxPadding, 1.25rem)',   // resize via --statBoxPadding on the row
                                // keep visual styles minimal to not conflict with existing .stat-box CSS
                            }}>
                                <p className="stat-number">{stat.number}</p>
                                <p className="stat-text">{stat.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;