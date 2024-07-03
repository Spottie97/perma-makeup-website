import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation } from 'react-router-dom';

const services = [
  { value: 'Brows', label: 'Brows', subServices: ['Microblading', 'Hybrid Brows', 'Powder Brows'] },
  { value: 'Lips', label: 'Lips', subServices: ['Blended Ombre Liner', 'Full Lip Contour'] },
  { value: 'Eyeliner', label: 'Eyeliner', subServices: ['Liner Top or Bottom', 'Liner Top & Bottom', 'Designer Liner Top'] },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Booking() {
  const query = useQuery();
  const preselectedService = query.get('service') || '';
  const preselectedSubService = query.get('subService') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(new Date());
  const [service, setService] = useState(preselectedService);
  const [subService, setSubService] = useState(preselectedSubService);
  const [subServices, setSubServices] = useState([]);

  useEffect(() => {
    const selectedService = services.find(s => s.value === service);
    setSubServices(selectedService? selectedService.subServices : []);
    setSubService('');
  }, [service]);

  const handleServiceChange = (e) => {
    const selectedService = services.find(s => s.value === e.target.value);
    setSubServices(selectedService? selectedService.subServices : []);
    setSubService('');
    setService(e.target.value);
  };

  const handleBooking = (e) => {
    e.preventDefault();
  
    // Get the form data
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const date = date.toLocaleDateString();
    const service = formData.get('service');
    const subService = formData.get('subService');
  
    // Create a JSON object to send to the server
    const bookingData = {
      name,
      email,
      date,
      service,
      subService,
    };
  
    // Send a POST request to the server
    fetch('/book-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
   .then((response) => response.json())
   .then((data) => {
      if (data.success) {
        alert('Booking submitted successfully!');
      } else {
        alert('Error submitting booking: ', data.error);
      }
    })
   .catch((error) => {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking: Please try again later.');
    });
  };

  return (
    <div className="booking-container">
      <div className="booking-calendar">
        <h1>Bookings</h1>
        <Calendar onChange={setDate} value={date} className="calendar" />
      </div>
      <div className="booking-form">
        <form onSubmit={handleBooking}>
          <h2>Book an Appointment</h2>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <select value={service} onChange={handleServiceChange} required>
            <option value="">Select a Service</option>
            {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {subServices.length > 0 && (
            <select value={subService} onChange={(e) => setSubService(e.target.value)} required>
              <option value="">Select a Sub-Service</option>
              {subServices.map(ss => <option key={ss} value={ss}>{ss}</option>)}
            </select>
          )}
          <input type="submit" value="Book Now" />
        </form>
      </div>
    </div>
  );
}

export default Booking;