import React from 'react';
import { usePortfolioData } from '@/pages/Portfolio';
import YouTubeEmbed from './YouTubeEmbed';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@ictwithkavishnamunasingha';

export const FreeLessons: React.FC = () => {
  const { freeLessons, loading, error, refreshData } = usePortfolioData();

  // Loading state with skeleton cards
  if (loading) {
    return (
      <section id="free-lessons" className="section-padding bg-light-custom">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-badge mb-2">FREE LESSONS</span>
            <h2 className="section-title text-center">Learn a full unit for free</h2>
            <p className="lead text-center mb-4">
              Master essential ICT topics with comprehensive, high-quality video lessons covering entire syllabus units.
            </p>
          </div>

          <div className="row">
            {[1, 2, 3].map((index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="card free-lesson-card border-0 shadow-sm h-100 rounded-2xl overflow-hidden bg-white animate-pulse">
                  <div className="w-full aspect-video bg-slate-200"></div>
                  <div className="card-body p-4 space-y-3">
                    <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && (!freeLessons || freeLessons.length === 0)) {
    return (
      <section id="free-lessons" className="section-padding bg-light-custom">
        <div className="container text-center">
          <span className="section-badge mb-2">FREE LESSONS</span>
          <h2 className="section-title text-center">Learn a full unit for free</h2>
          <p className="text-muted mt-3 mb-4">Unable to load free lessons right now.</p>
          <button className="btn btn-outline-primary" onClick={refreshData}>
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Empty state - if no lessons available
  if (!freeLessons || freeLessons.length === 0) {
    return null; // Gracefully hide when no content exists
  }

  return (
    <section id="free-lessons" className="section-padding bg-light-custom">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="section-badge mb-2">FREE LESSONS</span>
          <h2 className="section-title text-center">Learn a full unit for free</h2>
          <p className="lead text-center mb-4">
            Master essential ICT topics with comprehensive, high-quality video lessons covering entire syllabus units.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="row justify-content-center">
          {freeLessons.map((lesson, index) => (
            <div
              key={lesson.id || index}
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={index * 100}
            >
              <div className="card free-lesson-card border-0 shadow-sm h-100 rounded-2xl overflow-hidden bg-white flex flex-col justify-between">
                <div>
                  {/* YouTube Video Area */}
                  <div className="free-lesson-video-wrapper">
                    <YouTubeEmbed
                      youtubeUrl={lesson.youtubeUrl}
                      title={lesson.title}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="card-body p-4">
                    {/* Unit Label */}
                    <div className="mb-2">
                      <span className="free-lesson-unit-badge">
                        {lesson.unitLabel || 'FREE LESSON'}
                      </span>
                    </div>

                    {/* Lesson Title */}
                    <h5 className="card-title free-lesson-title mb-0">
                      {lesson.title}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Channel CTA Button */}
        <div className="text-center mt-5" data-aos="fade-up" data-aos-duration="800">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary free-lessons-channel-btn"
          >
            <i className="fab fa-youtube me-2"></i>
            View the full YouTube channel
          </a>
        </div>
      </div>
    </section>
  );
};

export default FreeLessons;
