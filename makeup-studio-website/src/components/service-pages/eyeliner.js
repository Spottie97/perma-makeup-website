import React from 'react';
import { useNavigate } from 'react-router-dom';

const eyelinerOptions = [
  { name: 'Liner Top or Bottom', price: 'R1000' },
  { name: 'Liner Top & Bottom', price: 'R1600' },
  { name: 'Designer Liner Top', price: 'R1400' },
];

function Eyeliner() {
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    navigate(`/booking?service=${option.name}`);
  };

  return (
    <div className="section section-light eyeliner-section">
      <h1>Eyeliner</h1>
      <div className="eyeliner-content">
        <img src="/path-to-eyeliner-image.jpg" alt="Eyeliner" className="eyeliner-image" />
        <div className="eyeliner-options">
          {eyelinerOptions.map(option => (
            <div key={option.name} className="eyeliner-option" onClick={() => handleOptionClick(option)}>
              <p>{option.name}</p>
              <p>{option.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Eyeliner;
