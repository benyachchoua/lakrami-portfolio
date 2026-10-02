import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm } from 'react-hook-form'
import { EyeIcon, EyeSlashIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const { user, signIn, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  if (user) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (data) => {
    await signIn(data.email, data.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <AcademicCapIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            Connexion Administrateur
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Accédez à votre espace de gestion du portfolio
          </p>
        </div>

        <div className="card p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Adresse email
              </label>
              <input
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format d\'email invalide'
                  }
                })}
                type="email"
                className="input-field"
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-secondary-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-secondary-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-secondary-500">
              Accès réservé aux administrateurs autorisés
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login