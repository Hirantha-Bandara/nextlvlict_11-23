import React from 'react';
import { usePortfolioData } from '../../pages/Portfolio';

const ScheduleFees: React.FC = () => {
    const { olTimetable, alTimetable, branchImages, loading, error, refreshData } = usePortfolioData();
    const branchImage = (branch: string) => branchImages.find(image => image.branch_name === branch)?.image_url;

    // Separate online and physical classes for O/L
    const olPhysicalClasses = olTimetable.map(branch => ({
        ...branch,
        grade10: (branch.grade10 || []).filter(item => !item.location?.includes('ONLINE')),
        grade11: (branch.grade11 || []).filter(item => !item.location?.includes('ONLINE'))
    })).filter(branch => (branch.grade10?.length || 0) > 0 || (branch.grade11?.length || 0) > 0);

    const olOnlineClasses = olTimetable.map(branch => ({
        ...branch,
        grade10: (branch.grade10 || []).filter(item => item.location?.includes('ONLINE')),
        grade11: (branch.grade11 || []).filter(item => item.location?.includes('ONLINE'))
    })).filter(branch => (branch.grade10?.length || 0) > 0 || (branch.grade11?.length || 0) > 0);

    // Separate online and physical classes for A/L
    const alPhysicalClasses = alTimetable.filter(item => !item.branch?.includes('ONLINE'));
    const alOnlineClasses = alTimetable.filter(item => item.branch?.includes('ONLINE'));

    if (loading) {
        return (
            <section id="schedule" className="section-padding bg-light-custom">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading timetables...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="schedule" className="section-padding bg-light-custom">
                <div className="container text-center text-danger">
                    <p>{error}</p>
                    <button className="btn btn-outline-primary" onClick={refreshData}>
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    if (olTimetable.length === 0 && alTimetable.length === 0) {
        return (
            <section id="schedule" className="section-padding bg-light-custom">
                <div className="container">
                    <h2 className="section-title" data-aos="fade-up">Class Timetables</h2>
                    <p className="text-center">No timetable data available.</p>
                </div>
            </section>
        );
    }
    return (
        <section id="schedule" className="section-padding bg-light-custom">
            <div className="container">
                <h2 className="section-title" data-aos="fade-up">Class Timetables</h2>
                <div className="row">
                    {/* O/L Timetable */}
                    <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right" data-aos-duration="800">
                        <h3 className="mb-4">O/L Timetable</h3>
                        <div className="schedule-card">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-header">
                                        <tr>
                                            <th style={{ width: '35%' }}>Location</th>
                                            <th style={{ width: '20%' }}>Grade</th>
                                            <th style={{ width: '30%' }}>Time</th>
                                            <th style={{ width: '15%' }}>Group</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        
                                        {/* Physical Classes Section */}
                                        {olPhysicalClasses.length > 0 && (
                                            <>
                                                <tr className="section-divider">
                                                    <td colSpan={4}>
                                                        <i className="fas fa-building me-2"></i>
                                                        <strong>Physical Classes</strong>
                                                    </td>
                                                </tr>
                                                {olPhysicalClasses.map((branch, branchIndex) => (
                                                    <React.Fragment key={`physical-${branchIndex}`}>
                                                        {/* Branch Header */}
                                                        <tr className="branch-header">
                                                            <td colSpan={4}>
                                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                                {branchImage(branch.branch) && <img src={branchImage(branch.branch)} alt="" className="me-2 rounded-circle" style={{ width: 28, height: 28, objectFit: 'cover' }} />}
                                                                {branch.branch}
                                                            </td>
                                                        </tr>

                                                        {/* Grade 10 Classes */}
                                                        {branch.grade10.map((item, index) => (
                                                            <tr key={`grade10-${branchIndex}-${index}`}>
                                                                <td>{item.location}</td>
                                                                <td>
                                                                    <span className="badge bg-info text-dark">{item.grade}</span>
                                                                </td>
                                                                <td>
                                                                    <i className="far fa-clock me-2"></i>
                                                                    {item.time}
                                                                </td>
                                                                <td>
                                                                    {item.group ? (
                                                                        <span className="badge bg-secondary">{item.group}</span>
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Grade 11 Classes */}
                                                        {branch.grade11.map((item, index) => (
                                                            <tr key={`grade11-${branchIndex}-${index}`}>
                                                                <td>{item.location}</td>
                                                                <td>
                                                                    <span className="badge bg-warning text-dark">{item.grade}</span>
                                                                </td>
                                                                <td>
                                                                    <i className="far fa-clock me-2"></i>
                                                                    {item.time}
                                                                </td>
                                                                <td>
                                                                    {item.group ? (
                                                                        <span className="badge bg-secondary">{item.group}</span>
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Spacer row between branches */}
                                                        <tr className="spacer-row">
                                                            <td colSpan={4} className="py-2"></td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                            </>
                                        )}
                                        {/* Online Classes Section */}
                                        {olOnlineClasses.length > 0 && (
                                            <>
                                                <tr className="section-divider online-section">
                                                    <td colSpan={4}>
                                                        <i className="fas fa-laptop me-2"></i>
                                                        <strong>Online Classes</strong>
                                                    </td>
                                                </tr>
                                                {olOnlineClasses.map((branch, branchIndex) => (
                                                    <React.Fragment key={`online-${branchIndex}`}>
                                                        {/* Grade 10 Classes */}
                                                        {branch.grade10.map((item, index) => (
                                                            <tr key={`online-grade10-${branchIndex}-${index}`} className="online-row">
                                                                <td>
                                                                    <i className="fas fa-video me-2 text-primary"></i>
                                                                    {item.location}
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-info text-dark">{item.grade}</span>
                                                                </td>
                                                                <td>
                                                                    <i className="far fa-clock me-2"></i>
                                                                    {item.time}
                                                                </td>
                                                                <td>
                                                                    {item.group ? (
                                                                        <span className="badge bg-secondary">{item.group}</span>
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {/* Grade 11 Classes */}
                                                        {branch.grade11.map((item, index) => (
                                                            <tr key={`online-grade11-${branchIndex}-${index}`} className="online-row">
                                                                <td>
                                                                    <i className="fas fa-video me-2 text-primary"></i>
                                                                    {item.location}
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-warning text-dark">{item.grade}</span>
                                                                </td>
                                                                <td>
                                                                    <i className="far fa-clock me-2"></i>
                                                                    {item.time}
                                                                </td>
                                                                <td>
                                                                    {item.group ? (
                                                                        <span className="badge bg-secondary">{item.group}</span>
                                                                    ) : (
                                                                        <span className="text-muted">—</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </>
                                        )}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* A/L Timetable */}
                    <div className="col-lg-6" data-aos="fade-left" data-aos-duration="800">
                        <h3 className="mb-4">A/L Timetable</h3>
                        <div className="schedule-card">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-header">
                                        <tr>
                                            <th style={{ width: '30%' }}>Location</th>
                                            <th style={{ width: '20%' }}>Year/Type</th>
                                            <th style={{ width: '25%' }}>Class Type</th>
                                            <th style={{ width: '25%' }}>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Physical Classes */}
                                        {alPhysicalClasses.length > 0 && (
                                            <>
                                                <tr className="section-divider">
                                                    <td colSpan={4}>
                                                        <i className="fas fa-building me-2"></i>
                                                        <strong>Physical Classes</strong>
                                                    </td>
                                                </tr>
                                                {['2026', '2027', 'Grade 11'].map((year) => {
                                                    const yearClasses = alPhysicalClasses.filter(item => item.year === year);

                                                    if (yearClasses.length === 0) return null;

                                                    return (
                                                        <React.Fragment key={year}>
                                                            {/* Year Header */}
                                                            <tr className="branch-header">
                                                                <td colSpan={4}>
                                                                    <i className="fas fa-calendar-alt me-2"></i>
                                                                    {year === 'Grade 11' ? 'Additional Classes' : `${year} Batch`}
                                                                </td>
                                                            </tr>

                                                            {/* Classes for this year */}
                                                            {yearClasses.map((item, index) => (
                                                                <tr key={`${year}-${index}`}>
                                                                    <td>{branchImage(item.branch) && <img src={branchImage(item.branch)} alt="" className="me-2 rounded-circle" style={{ width: 28, height: 28, objectFit: 'cover' }} />}{item.branch}</td>
                                                                    <td>
                                                                        {item.year === '2026' || item.year === '2027' ? (
                                                                            <span className="badge bg-danger">{item.year}</span>
                                                                        ) : (
                                                                            <span className="badge bg-success">{item.year}</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {item.type === 'Theory' ? (
                                                                            <span className="badge bg-primary" style={{ color: 'white' }}>{item.type}</span>
                                                                        ) : (
                                                                            <span className="badge bg-warning text-dark">{item.type}</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <i className="far fa-clock me-2"></i>
                                                                        {item.time}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                            {/* Spacer row between years */}
                                                            <tr className="spacer-row">
                                                                <td colSpan={4} className="py-2"></td>
                                                            </tr>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </>
                                        )}

                                        {/* Online Classes */}
                                        {alOnlineClasses.length > 0 && (
                                            <>
                                                <tr className="section-divider online-section">
                                                    <td colSpan={4}>
                                                        <i className="fas fa-laptop me-2"></i>
                                                        <strong>Online Classes</strong>
                                                    </td>
                                                </tr>
                                                {['2026', '2027', 'Grade 11'].map((year) => {
                                                    const yearClasses = alOnlineClasses.filter(item => item.year === year);

                                                    if (yearClasses.length === 0) return null;

                                                    return (
                                                        <React.Fragment key={`online-${year}`}>
                                                            {/* Year Header */}
                                                            <tr className="branch-header">
                                                                <td colSpan={4}>
                                                                    <i className="fas fa-calendar-alt me-2"></i>
                                                                    {year === 'Grade 11' ? 'Additional Classes' : `${year} Batch`}
                                                                </td>
                                                            </tr>

                                                            {/* Classes for this year */}
                                                            {yearClasses.map((item, index) => (
                                                                <tr key={`online-${year}-${index}`} className="online-row">
                                                                    <td>
                                                                        <i className="fas fa-video me-2 text-primary"></i>
                                                                        {branchImage(item.branch) && <img src={branchImage(item.branch)} alt="" className="me-2 rounded-circle" style={{ width: 28, height: 28, objectFit: 'cover' }} />}{item.branch}
                                                                    </td>
                                                                    <td>
                                                                        {item.year === '2026' || item.year === '2027' ? (
                                                                            <span className="badge bg-danger">{item.year}</span>
                                                                        ) : (
                                                                            <span className="badge bg-success">{item.year}</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {item.type === 'Theory' ? (
                                                                            <span className="badge bg-primary" style={{ color: 'white' }}>{item.type}</span>
                                                                        ) : (
                                                                            <span className="badge bg-warning text-dark">{item.type}</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <i className="far fa-clock me-2"></i>
                                                                        {item.time}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                            {/* Spacer row between years */}
                                                            <tr className="spacer-row">
                                                                <td colSpan={4} className="py-2"></td>
                                                            </tr>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Contact Information */}
                            <div className="mt-4 p-4 bg-light rounded">
                                <h5 className="mb-3 text-primary">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Contact Information
                                </h5>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-2">
                                        <i className="fas fa-user-graduate text-primary me-2"></i>
                                        <strong>Teacher:</strong> Kavishna Munasingha
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-phone text-primary me-2"></i>
                                        <strong>Phone:</strong> 078 480 0385
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add some custom CSS for better styling */}
            <style>{`
                .schedule-card {
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .table-responsive {
                    border-radius: 12px 12px 0 0;
                    flex: 1;
                    overflow-y: auto;
                }
                
                .col-lg-6 {
                    display: flex;
                    flex-direction: column;
                }
                
                .col-lg-6 > .schedule-card {
                    flex: 1;
                }
                
                .table-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .table-header th {
                    color: white;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 0.5px;
                    padding: 1rem 0.75rem;
                    border: none;
                    white-space: nowrap;
                }
                
                .table td, .table th {
                    vertical-align: middle;
                    padding: 0.85rem 0.75rem;
                }
                
                .table td {
                    white-space: nowrap;
                }
                
                .table tbody tr {
                    transition: background-color 0.2s ease;
                }
                
                .table tbody tr:hover {
                    background-color: #f8f9fa !important;
                }
                
                .branch-header {
                    background: linear-gradient(to right, #f8f9fa, #e9ecef) !important;
                }
                
                .branch-header td {
                    font-weight: 600;
                    color: #495057;
                    padding: 0.75rem;
                    border-top: 2px solid #dee2e6;
                    border-bottom: 1px solid #dee2e6;
                    font-size: 0.95rem;
                }
                
                .spacer-row {
                    height: 0.5rem;
                }
                
                .spacer-row td {
                    background-color: transparent;
                    border: none;
                    padding: 0.25rem;
                }
                
                .badge {
                    font-size: 0.8rem;
                    padding: 0.4rem 0.75rem;
                    font-weight: 500;
                    border-radius: 6px;
                }
                
                .text-muted {
                    font-size: 1.2rem;
                }
                
                .section-divider {
                    background: linear-gradient(to right, #e3f2fd, #bbdefb) !important;
                }
                
                .section-divider.online-section {
                    background: linear-gradient(to right, #e8f5e9, #c8e6c9) !important;
                }
                
                .section-divider td {
                    font-weight: 700;
                    color: #1976d2;
                    padding: 0.85rem;
                    border-top: 3px solid #1976d2;
                    border-bottom: 2px solid #1976d2;
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .online-section td {
                    color: #2e7d32 !important;
                    border-top-color: #2e7d32 !important;
                    border-bottom-color: #2e7d32 !important;
                }
                
                .online-row {
                    background-color: #f1f8f4 !important;
                }
                
                .online-row:hover {
                    background-color: #e8f5e9 !important;
                }
                
                @media (max-width: 768px) {
                    .col-lg-6 {
                        display: block;
                    }
                    
                    .schedule-card {
                        height: auto;
                    }
                    
                    .table td, .table th {
                        padding: 0.6rem 0.4rem;
                        font-size: 0.85rem;
                    }
                    
                    .badge {
                        font-size: 0.7rem;
                        padding: 0.25rem 0.5rem;
                    }
                    
                    .table td {
                        white-space: normal;
                    }
                }
            `}</style>
        </section>
    );
};

export default ScheduleFees;
