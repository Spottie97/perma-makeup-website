import React, { useState } from 'react';
import { GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleContact = (e) => {
    e.preventDefault();
    // Handle contact form submission
    alert('Message sent');
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: -25.747867, // Replace with the latitude of your studio location
    lng: 28.229271, // Replace with the longitude of your studio location
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container section section-dark contact-section">
      <h1>Contact Us</h1>
      <form onSubmit={handleContact}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <input type="submit" value="Send Message" />
      </form>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
        {/* Use the new AdvancedMarkerElement */}
        <google.maps.marker.AdvancedMarkerElement position={center} />
      </GoogleMap>
    </div>
  );
}

export default Contact;
