import React from 'react';
import { useNavigate } from 'react-router-dom';
import browsImage from '../../assets/images/brows.jpg'; // Update the path

const browOptions = [
  { name: 'Microblading', price: 'R1500' },
  { name: 'Hybrid Brows', price: 'R1600' },
  { name: 'Powder Brows', price: 'R1750' },
];

function Brows() {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    navigate(`/booking?service=${option.name}`);
  };

  return (
    <div className="section section-light brows-section">
      <h1>Eyebrows</h1>
      <div className="brows-content">
        <img src={browsImage} alt="Brows" className="brows-image" />
        <div className="brows-options">
          {browOptions.map(option => (
            <div key={option.name} className="brow-option" onClick={() => handleOptionClick(option)}>
              <p>{option.name}</p>
              <p>{option.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Brows;
