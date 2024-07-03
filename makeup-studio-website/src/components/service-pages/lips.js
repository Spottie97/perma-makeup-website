import React from 'react';
import { useNavigate } from 'react-router-dom';
import lipsImage from '../../assets/images/lips.jpg'; // Update the path

const lipOptions = [
  { name: 'Blended Ombre Liner', price: 'R1210' },
  { name: 'Full Lip Contour', price: 'R1700' },
];

function Lips() {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    navigate(`/booking?service=${option.name}`);
  };

  return (
    <div className="section section-light lips-section">
      <h1>Lips</h1>
      <div className="lips-content">
        <img src={lipsImage} alt="Lips" className="lips-image" />
        <div className="lips-options">
          {lipOptions.map(option => (
            <div key={option.name} className="lip-option" onClick={() => handleOptionClick(option)}>
              <p>{option.name}</p>
              <p>{option.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lips;
