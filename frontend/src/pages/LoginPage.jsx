import React, { useState } from 'react'
import Topbar from '../components/Topbar'
import RegisterModal from '../components/RegisterModal'
import './LoginPage.css'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    // Login logic will be implemented later
    console.log('Login attempt')
  }

  return (
    <div className="page">
      <Topbar />

      <main className="main">
        {/* LEFT: Login */}
        <div className="panel-left">
          <div className="login-card">
            <h1>Se connecter</h1>
            <p className="subtitle">
              Bienvenue ! Entrez vos identifiants pour accéder à votre compte.
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Adresse e-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    className="eye-btn"
                    type="button"
                    onClick={togglePassword}
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="row-check">
                <label className="checkbox-wrap">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="custom-check">
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="checkbox-label">Se souvenir de moi</span>
                </label>
                <a href="#" className="forgot">Mot de passe oublié ?</a>
              </div>

              <button className="btn-primary" type="submit">
                Connexion
              </button>
            </form>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="divider"></div>

        {/* RIGHT: Sign up CTA */}
        <div className="panel-right">
          <div className="right-content">
            <div className="icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff7900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <h2>Vous n'avez pas encore de compte ?</h2>
            <p>
              Rejoignez Catalogue IN pour gérer et suivre les offres et services d'Orange Tunisie.
            </p>
            <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
              S'inscrire
            </button>
          </div>
        </div>
      </main>

      <RegisterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

export default LoginPage
