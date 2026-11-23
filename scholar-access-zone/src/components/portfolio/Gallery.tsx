import React from 'react';
import { usePortfolioData } from '@/pages/Portfolio';
const Gallery: React.FC = () => {
  const { gallery, loading } = usePortfolioData();
  if (loading || !gallery.length) return null;
  return <section id="gallery" className="section-padding bg-light-custom"><div className="container"><h2 className="section-title text-center" data-aos="fade-up">Portfolio Gallery</h2><div className="row">{gallery.map((image, index) => <div key={image.id} className="col-6 col-md-4 col-lg-3 mb-4" data-aos="fade-up" data-aos-delay={index * 75}><img src={image.image_url} alt="NextLevel ICT gallery" className="w-100 rounded shadow-sm" style={{ aspectRatio: '1', objectFit: 'cover' }} /></div>)}</div></div></section>;
};
export default Gallery;
