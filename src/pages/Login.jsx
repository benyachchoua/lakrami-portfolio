import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { user, signIn, loading } = useAuth()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  // Only follow in-app admin paths so the redirect target can't leave the site.
  const from = location.state?.from?.pathname
  const target = typeof from === 'string' && from.startsWith('/admin') ? from : '/admin'

  if (user) return <Navigate to={target} replace />

  const onSubmit = data => signIn(data.email, data.password)

  return (
    <main className="login-page">
      <div className="login-shell">
        <Link to="/" className="login-back"><ArrowLeftIcon aria-hidden="true" />Retour au portfolio</Link>
        <div className="login-heading">
          <span className="brand-monogram" aria-hidden="true">FL</span>
          <h1>Espace administration</h1>
          <p>Connectez-vous pour gérer le contenu du portfolio.</p>
        </div>
        <div className="login-card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className="input-field"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', {
                  required: 'L’email est requis',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Format d’email invalide' },
                })}
              />
              {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-field"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password', { required: 'Le mot de passe est requis' })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} aria-pressed={showPassword}>
                  {showPassword ? <EyeSlashIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="form-error" role="alert">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Connexion…' : 'Se connecter'}</button>
          </form>
        </div>
        <p className="login-note">Accès réservé aux administrateurs autorisés.</p>
      </div>
    </main>
  )
}

export default Login
