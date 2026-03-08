import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './RegisterModal.css'

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero: '',
    direction_id: '',
    departement_id: ''
  })

  const [directions, setDirections] = useState([])
  const [departements, setDepartements] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Charger les directions au montage
  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await axios.get('/api/auth/directions')
        setDirections(response.data.data)
      } catch (err) {
        console.error('Erreur lors du chargement des directions:', err)
      }
    }
    fetchDirections()
  }, [])

  // Charger les départements quand direction change
  useEffect(() => {
    const fetchDepartements = async () => {
      if (formData.direction_id) {
        try {
          const response = await axios.get(`/api/auth/departements/${formData.direction_id}`)
          setDepartements(response.data.data)
          setFormData(prev => ({ ...prev, departement_id: '' }))
        } catch (err) {
          console.error('Erreur lors du chargement des départements:', err)
        }
      } else {
        setDepartements([])
        setFormData(prev => ({ ...prev, departement_id: '' }))
      }
    }
    fetchDepartements()
  }, [formData.direction_id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/auth/register', formData)
      
      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setFormData({
            nom: '',
            prenom: '',
            email: '',
            numero: '',
            direction_id: '',
            departement_id: ''
          })
        }, 3000)
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => e.message).join(', ')
        setError(errorMessages)
      } else {
        setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay open') {
      onClose()
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  if (success) {
    return (
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
        <div className="modal">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'var(--orange-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2>Inscription réussie !</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: '12px', lineHeight: '1.6' }}>
              Un email de vérification a été envoyé à votre adresse.<br/>
              Veuillez vérifier votre boîte mail et cliquer sur le lien pour confirmer votre compte.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2>Créer un compte</h2>
        <p className="modal-sub">
          Rejoignez <span>Catalogue IN</span> dès aujourd'hui.
        </p>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c33',
            fontSize: '0.9rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prenom">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="***@orange.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Numéro de téléphone</label>
            <input
              type="text"
              id="numero"
              name="numero"
              placeholder="5001XXXX"
              value={formData.numero}
              onChange={handleChange}
              maxLength="8"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="direction_id">Direction</label>
            <select
              id="direction_id"
              name="direction_id"
              value={formData.direction_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une direction</option>
              {directions.map(dir => (
                <option key={dir.id} value={dir.id}>{dir.nom}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="departement_id">Département</label>
            <select
              id="departement_id"
              name="departement_id"
              value={formData.departement_id}
              onChange={handleChange}
              disabled={!formData.direction_id}
              required
            >
              <option value="">Sélectionnez un département</option>
              {departements.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.nom}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="modal-footer">
          Déjà inscrit ? <a onClick={onClose}>Se connecter</a>
        </p>
      </div>
    </div>
  )
}

export default RegisterModal
