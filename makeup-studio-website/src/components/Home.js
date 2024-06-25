function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to Permanent Make-Up Studio</h1>
      </div>
      <div className="section section-light">
        <h2>About Our Studio</h2>
        <p>Your beauty, our passion. We offer a range of permanent make-up services to enhance your natural beauty.</p>
      </div>
      <div className="section section-dark">
        <h2>Our Services</h2>
        <div className="card">
          <img src="/path-to-service-image.jpg" alt="Service" />
          <h3>Service Name</h3>
          <p>Description of the service.</p>
        </div>
        <div className="card">
          <img src="/path-to-service-image.jpg" alt="Service" />
          <h3>Service Name</h3>
          <p>Description of the service.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
