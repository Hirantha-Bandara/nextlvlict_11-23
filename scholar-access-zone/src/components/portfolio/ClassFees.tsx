import React from 'react';

interface FeeStructure {
  grade: string;
  monthlyFee: number;
  description: string;
}

const ClassFees: React.FC = () => {
  const feeStructure: FeeStructure[] = [
    {
      grade: "2028 O/L Theory",
      monthlyFee: 1300,
      description: "Comprehensive O/L ICT preparation with theory and practical sessions"
    },
    {
      grade: "2027 O/L Theory",
      monthlyFee: 1500,
      description: "Advanced O/L ICT with exam-focused revision and paper classes"
    },
    {
      grade: "2028 A/L Theory",
      monthlyFee: 2800,
      description: "Complete A/L ICT theory classes covering all syllabus topics"
    },
    {
      grade: "2027 A/L Theory",
      monthlyFee: 2500,
      description: "Intensive A/L theory, revision, and paper discussion classes"
    }
  ];

  return (
    <section id="fees" className="section-padding bg-light-custom">
      <div className="container">
        <h2 className="section-title text-center" data-aos="fade-up">Class Fees</h2>
        <p className="lead text-center mb-5" data-aos="fade-up" data-aos-delay="100">
          Affordable monthly fees with quality education and comprehensive study materials
        </p>

        <div className="row justify-content-center">
          {feeStructure.map((fee, index) => (
            <div 
              key={index} 
              className="col-md-6 col-lg-3 mb-4" 
              data-aos="fade-up" 
              data-aos-duration="800" 
              data-aos-delay={index * 100}
            >
              <div className="fee-card">
                <div className="fee-header">
                  <h4>{fee.grade}</h4>
                </div>
                <div className="fee-amount">
                  <span className="currency">LKR</span>
                  <span className="amount">{fee.monthlyFee.toLocaleString()}</span>
                  <span className="period">/month</span>
                </div>
                <div className="fee-description">
                  <p>{fee.description}</p>
                </div>
                {/* <div className="fee-features">
                  <ul>
                    <li><i className="fas fa-check-circle"></i> Weekly classes</li>
                    <li><i className="fas fa-check-circle"></i> Study materials</li>
                    <li><i className="fas fa-check-circle"></i> Past papers</li>
                    <li><i className="fas fa-check-circle"></i> Online support</li>
                  </ul>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5" data-aos="fade-up" data-aos-delay="200">
          <div className="col-12">
            <div className="fee-note">
              <h5><i className="fas fa-info-circle"></i> Important Information</h5>
              <ul>
                <li>Registration fee: LKR 1,000 (one-time payment)</li>
                <li>Fees are payable monthly in advance</li>
                {/* <li>Special discounts available for siblings</li> */}
                <li>All study materials and past papers included in the fee</li>
                <li>Online payment options available through student portal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fee-card {
          background: var(--white);
          border-radius: var(--border-radius);
          padding: 2rem;
          height: 100%;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border: 2px solid var(--medium-gray);
          display: flex;
          flex-direction: column;
        }

        .fee-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-blue);
        }

        .fee-header {
          text-align: center;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--light-gray);
          margin-bottom: 1.5rem;
        }

        .fee-header h4 {
          color: var(--dark-blue);
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .fee-amount {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .fee-amount .currency {
          font-size: 1rem;
          color: var(--text-light);
          vertical-align: super;
        }

        .fee-amount .amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-blue);
          margin: 0 0.3rem;
        }

        .fee-amount .period {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .fee-description {
          text-align: center;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }

        .fee-description p {
          color: var(--text-light);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .fee-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .fee-features li {
          padding: 0.6rem 0;
          color: var(--text-dark);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.95rem;
        }

        .fee-features li i {
          color: var(--secondary-teal);
          font-size: 1rem;
        }

        .fee-note {
          background: var(--white);
          border-left: 4px solid var(--secondary-teal);
          padding: 1.5rem 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
        }

        .fee-note h5 {
          color: var(--dark-blue);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fee-note h5 i {
          color: var(--secondary-teal);
        }

        .fee-note ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .fee-note li {
          padding: 0.5rem 0;
          color: var(--text-dark);
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
        }

        .fee-note li:before {
          content: '•';
          color: var(--secondary-teal);
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .fee-amount .amount {
            font-size: 2rem;
          }
          
          .fee-card {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default ClassFees;