import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Topbar from '../components/Topbar'
import './VerifyEmailPage.css'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('Token de vérification manquant.')
        return
      }

      try {
        const response = await axios.post('/api/auth/verify-email', { token })
        
        if (response.data.success) {
          setStatus('success')
          setMessage(response.data.message)
        }
      } catch (error) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Erreur lors de la vérification de l\'email.')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="verify-page">
      <Topbar />
      
      <main className="verify-main">
        <div className="verify-card">
          {status === 'loading' && (
            <>
              <div className="spinner-wrap">
                <div className="spinner"></div>
              </div>
              <h1>Vérification en cours...</h1>
              <p>Veuillez patienter pendant que nous vérifions votre email.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="icon-circle success">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h1>Email vérifié avec succès !</h1>
              <p className="success-message">
                Votre compte est en attente de validation par l'administrateur.<br/>
                Vous recevrez un email une fois votre compte approuvé.
              </p>
              <button 
                className="btn-return" 
                onClick={() => navigate('/')}
              >
                Retour à la connexion
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="icon-circle error">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h1>Erreur de vérification</h1>
              <p className="error-message">{message}</p>
              <button 
                className="btn-return" 
                onClick={() => navigate('/')}
              >
                Retour à l'accueil
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default VerifyEmailPage
