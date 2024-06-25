import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="container">
      <motion.div
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to Permanent Make-Up Studio</h1>
      </motion.div>
      <motion.div
        className="section section-light"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2>About Our Studio</h2>
        <p>Your beauty, our passion. We offer a range of permanent make-up services to enhance your natural beauty.</p>
      </motion.div>
      <motion.div
        className="section section-dark"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
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
      </motion.div>
    </div>
  );
}

export default Home;
