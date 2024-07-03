import React from 'react';
import { useNavigate } from 'react-router-dom';
import browsImage from '../assets/images/brows.jpg';
import lipsImage from '../assets/images/lips.jpg';
import eyelinerImage from '../assets/images/eyeliner.jpg';

const services = [
  {
    id: 1,
    name: 'Brows',
    image: browsImage,
  },
  {
    id: 2,
    name: 'Lips',
    image: lipsImage,
  },
  {
    id: 3,
    name: 'Eyeliner',
    image: eyelinerImage,
  },
];

function Services() {
  const navigate = useNavigate();

  const handleServiceClick = (service) => {
    navigate(`/${service.name.toLowerCase()}`);
  };

  return (
    <div className="section section-light services-section">
      <h1>Services</h1>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card" onClick={() => handleServiceClick(service)}>
            <img src={service.image} alt={service.name} className="service-image" />
            <h3>{service.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;