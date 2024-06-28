import React from 'react';

function Services() {
  return (
    <div className="section section-light">
      <h1>Our Services</h1>
      <div className="card">
        <img src="/path-to-service-image.jpg" alt="Service 1" />
        <h3>Service 1</h3>
        <p>Description of Service 1.</p>
      </div>
      <div className="card">
        <img src="/path-to-service-image.jpg" alt="Service 2" />
        <h3>Service 2</h3>
        <p>Description of Service 2.</p>
      </div>
      <div className="card">
        <img src="/path-to-service-image.jpg" alt="Service 3" />
        <h3>Service 3</h3>
        <p>Description of Service 3.</p>
      </div>
    </div>
  );
}

export default Services;
