import React from 'react'
import './Topbar.css'

const Topbar = () => {
  return (
    <header className="topbar">
      <a href="/" className="logo">
        <img
          src="..\public\assets\Untitled design.png"
          alt="Catalogue IN"
          style={{ height: '44px' }}
        />
        <span className="logo-text">
          Catalogue <span>In</span>
        </span>
      </a>
      <div style={{ marginLeft: 'auto', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
        <img
          src="..\public\assets\Orange_logo.png"
          alt="Orange Tunisie"
          style={{ height: '50px' }}
        />
      </div>
    </header>
  )
}

export default Topbar
