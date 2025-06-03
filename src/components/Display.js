import React from 'react';

const Display = ({ display, preview }) => {
  return (
    <div className="screen">
      <div className="display">{display}</div>
      <div className="preview">{preview}</div>
    </div>
  );
};

export default Display;