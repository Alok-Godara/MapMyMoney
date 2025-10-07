import React from 'react'

function Logo({ className = "", size = 40 }) {
  return (
    <div className={`flex items-center justify-center bg-gray-800 rounded-full ${className}`} style={{ width: size, height: size }}>
  <img src="/inr.png" alt="Finsync Logo" className="w-3/4 h-3/4 object-contain" />
    </div>
  );
}

export default Logo
