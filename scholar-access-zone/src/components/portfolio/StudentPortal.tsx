import React from 'react';
import { Link } from 'react-router-dom';
import { portalFeatures } from '@/data/mockData';

const StudentPortal: React.FC = () => {
  return (
    <section id="student-portal" className="portal-section">
      {/* animated background (keeps markup small and accessible) */}
      <div className="portal-bg" aria-hidden="true">
        <ul className="bg-bubbles">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>
      </div>

      <div className="container">
        
        <h2 className="section-title text-center text-white" data-aos="fade-up">Student Portal</h2>
        <p className="lead text-center mb-5 text-white" data-aos="fade-up" data-aos-delay="100">
          Access your personalized learning dashboard with course materials, assignments, and progress tracking.
        </p>

        <div className="row align-items-center">

          
          <div className="col-lg-12 mb-5 mb-lg-0" data-aos="fade-right" data-aos-duration="800">
            <div className="portal-card ">

              
              <div className='text-center'>
                <i className="fas fa-tachometer-alt portal-icon"></i>
                <h3 className="mb-4">Personalized Learning Dashboard</h3>
                <p className="mb-4">Access all your course materials, and progress tracking in one convenient location.</p>
              </div>

              <div className="portal-feature">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h5 className="mb-0">Course Materials</h5>
                  <p className="mb-0">Download notes, presentations, and resources</p>
                </div>
              </div>

              {/* <div className="portal-feature">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h5 className="mb-0">Assignment Submission</h5>
                  <p className="mb-0">Submit assignments and receive feedback</p>
                </div>
              </div> */}

              {/* <div className="portal-feature">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h5 className="mb-0">Progress Tracking</h5>
                  <p className="mb-0">Monitor your learning progress and performance</p>
                </div>
              </div> */}

              <div className="portal-feature">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h5 className="mb-0">Class Schedule</h5>
                  <p className="mb-0">View upcoming classes and events</p>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link to="/login" className="btn btn-light btn-lg mt-3 freaky-btn" aria-label="Access Portal">
                  {/* decorative layers for freaky animation (aria-hidden so screen readers only read the link text) */}
                  <span className="freaky-layers" aria-hidden="true">
                    <span className="freaky-ring"></span>
                    <span className="freaky-ring small"></span>
                    <span className="freaky-glow"></span>
                  </span>
                  Access Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          {portalFeatures.map((feature, index) => (
            <div key={index} className="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100}>
              <div className="portal-card text-center">
                <i className={`${feature.icon} portal-icon`}></i>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* inline styles for the animated background (increased opacity) */}
      <style>{`
        /* Ensure section can contain absolutely positioned background */
        .portal-section { position: relative; overflow: hidden; }

        /* Keep portal content above animated elements */
        .portal-section .container { position: relative; z-index: 3; }

        /* subtle tint behind content (keep low so bubbles are visible) */
        .portal-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,25,47,0.05), rgba(10,25,47,0.08));
          z-index: 1;
          pointer-events: none;
        }

        /* Background wrapper covers the whole section and sits behind the tint */
        .portal-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 1; }

        .bg-bubbles { position: absolute; inset: 0; margin: 0; padding: 0; list-style: none; overflow: hidden; }

        .bg-bubbles li {
          position: absolute;
          bottom: -40px;
          display: block;
          border-radius: 50%;
          /* stronger visibility and a light bluish tint to stand out on dark background */
          background: linear-gradient(135deg, rgba(255,255,255,0.22), rgba(180,220,255,0.16));
          filter: blur(2px);
          animation: floatUp linear infinite, sway ease-in-out infinite;
          will-change: transform, opacity;
        }

        /* variety for size, position, speed and delay */
        .bg-bubbles li:nth-child(1)  { left: 5%;   width: 80px;  height: 80px;  animation-duration: 16s, 6s; animation-delay: 0s, 0s; }
        .bg-bubbles li:nth-child(2)  { left: 15%;  width: 40px;  height: 40px;  animation-duration: 10s, 5s; animation-delay: 1s, 0.5s;  }
        .bg-bubbles li:nth-child(3)  { left: 25%;  width: 60px;  height: 60px;  animation-duration: 14s, 7s; animation-delay: 2s, 1s;  }
        .bg-bubbles li:nth-child(4)  { left: 40%;  width: 28px;  height: 28px;  animation-duration: 9s, 4s;  animation-delay: 0.5s, 0.2s;  }
        .bg-bubbles li:nth-child(5)  { left: 55%;  width: 100px; height: 100px; animation-duration: 20s, 8s; animation-delay: 3s, 1.2s;  }
        .bg-bubbles li:nth-child(6)  { left: 70%;  width: 48px;  height: 48px;  animation-duration: 12s, 6s; animation-delay: 1.5s, 0.7s;  }
        .bg-bubbles li:nth-child(7)  { left: 80%;  width: 72px;  height: 72px;  animation-duration: 18s, 7.5s; animation-delay: 2.5s, 1s;  }
        .bg-bubbles li:nth-child(8)  { left: 88%;  width: 32px;  height: 32px;  animation-duration: 11s, 4.5s; animation-delay: 0.8s, 0.3s;  }
        .bg-bubbles li:nth-child(9)  { left: 50%;  width: 44px;  height: 44px;  animation-duration: 13s, 6.5s; animation-delay: 2.2s, 0.9s;  }
        .bg-bubbles li:nth-child(10) { left: 35%;  width: 90px;  height: 90px;  animation-duration: 22s, 9s; animation-delay: 1.8s, 1.1s;  }

        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.36;
          }
          20% {
            opacity: 0.48;
          }
          60% {
            opacity: 0.38;
          }
          100% {
            transform: translateY(-120vh) scale(1.15);
            opacity: 0;
          }
        }

        /* subtle horizontal sway to make motion more obvious */
        @keyframes sway {
          0%   { transform: translateX(0); }
          25%  { transform: translateX(8px); }
          50%  { transform: translateX(0); }
          75%  { transform: translateX(-8px); }
          100% { transform: translateX(0); }
        }

        /* reduce motion on small screens to avoid visual clutter but keep visibility */
        @media (max-width: 768px) {
          .bg-bubbles li { filter: blur(1.5px); opacity: 0.32; }
          .bg-bubbles li:nth-child(5), .bg-bubbles li:nth-child(10) { display: none; }
        }

        /* ----------------------------
           Freaky Access Portal Button
           ---------------------------- */
        .freaky-btn {
          position: relative;
          overflow: visible;
          isolation: isolate;
          transition: transform .18s ease, box-shadow .18s ease;
          z-index: 4; /* above background */
        }
        .freaky-btn .freaky-layers {
          pointer-events: none;
          position: absolute;
          inset: 0;
          display: block;
          z-index: -1;
        }
        .freaky-ring, .freaky-ring.small {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          border-radius: 50%;
          box-shadow: 0 0 18px rgba(120,200,255,0.25), inset 0 0 8px rgba(120,200,255,0.06);
          border: 1px solid rgba(120,200,255,0.12);
          width: 140%;
          height: 140%;
          opacity: 0.12;
          animation: freaky-rotate 6.5s linear infinite, freaky-pulse 2.8s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .freaky-ring.small {
          width: 90%;
          height: 90%;
          opacity: 0.18;
          animation-duration: 5s, 2.2s;
          filter: blur(1px);
        }
        .freaky-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 220%;
          height: 220%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 20%, rgba(150,220,255,0.18), rgba(90,160,255,0.06) 30%, transparent 60%);
          opacity: 0.08;
          animation: freaky-float 4s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: blur(10px);
        }
        .freaky-btn:hover, .freaky-btn:focus {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 30px rgba(20,40,80,0.28);
        }
        .freaky-btn:active {
          transform: translateY(0) scale(.99);
        }

        /* small glitch burst on hover */
        .freaky-btn:hover .freaky-ring,
        .freaky-btn:focus .freaky-ring {
          animation-name: freaky-rotate, freaky-pulse, freaky-glitch;
          animation-duration: 6.5s, 2.8s, 0.6s;
          animation-timing-function: linear, ease-in-out, steps(4);
        }

        @keyframes freaky-rotate {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes freaky-pulse {
          0%,100% { opacity: 0.10; transform: translate(-50%, -50%) scale(1); }
          50%     { opacity: 0.20; transform: translate(-50%, -50%) scale(1.04); }
        }
        @keyframes freaky-float {
          0% { transform: translate(-50%, -50%) scale(1) translateY(0); }
          50% { transform: translate(-50%, -50%) scale(1.02) translateY(-6px); }
          100% { transform: translate(-50%, -50%) scale(1) translateY(0); }
        }
        @keyframes freaky-glitch {
          0%   { transform: translate(-50%, -50%) rotate(0deg) translateX(0); opacity: .12; }
          25%  { transform: translate(-50%, -50%) rotate(-3deg) translateX(-6px); opacity: .2; }
          50%  { transform: translate(-50%, -50%) rotate(3deg) translateX(6px); opacity: .16; }
          75%  { transform: translate(-50%, -50%) rotate(-2deg) translateX(-3px); opacity: .18; }
          100% { transform: translate(-50%, -50%) rotate(0deg) translateX(0); opacity: .12; }
        }

        /* keep things subtle on small screens */
        @media (max-width: 576px) {
          .freaky-ring { display: none; }
          .freaky-glow { opacity: 0.06; filter: blur(6px); }
        }
      `}</style>
    </section>
  );
};

export default StudentPortal;