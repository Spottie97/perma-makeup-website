import React, { useState } from 'react';

function Booking() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    // Handle booking logic here
    alert('Booking submitted');
  };

  return (
    <div className="container section section-light">
      <h1>Book an Appointment</h1>
      <form onSubmit={handleBooking}>
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={service} onChange={(e) => setService(e.target.value)} required>
          <option value="">Select a Service</option>
          <option value="service1">Service 1</option>
          <option value="service2">Service 2</option>
          <option value="service3">Service 3</option>
        </select>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default Booking;
