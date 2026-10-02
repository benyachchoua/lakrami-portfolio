import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { usePortfolio } from '../../contexts/PortfolioContext'
import { apiRequest, jsonRequest } from '../../utils/api'
import { getImageUrl } from '../../utils/imageUtils'
import WysiwygEditor from '../../components/admin/WysiwygEditor'
import toast from 'react-hot-toast'
import { UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' }

// Same check the browser applies to type="url" (kept explicit because the form uses noValidate for accessible inline errors).
const urlRule = {
  validate: (value) => {
    if (!value) return true
    try { new URL(value); return true } catch { return 'Adresse invalide (exemple : https://exemple.org)' }
  },
}

// Label + control + hint + error, wired together with ids (control id must be `${prefix}-${name}`).
const Field = ({ prefix = 'profile', name, label, required, hint, error, className = '', children }) => (
  <div className={`admin-field !mt-0 ${className}`}>
    <label htmlFor={`${prefix}-${name}`}>
      {label}{required && <span aria-hidden="true"> *</span>}
    </label>
    {children}
    {hint && <p id={`${prefix}-${name}-hint`} className="admin-hint">{hint}</p>}
    {error && <p id={`${prefix}-${name}-error`} role="alert" className="form-error">{error}</p>}
  </div>
)

const PasswordField = ({ name, label, hint, ...inputProps }) => {
  const [visible, setVisible] = React.useState(false)
  return (
    <Field prefix="password" name={name} label={label} hint={hint}>
      <div className="password-field">
        <input
          {...inputProps}
          id={`password-${name}`}
          name={name}
          type={visible ? 'text' : 'password'}
          className="input-field"
          aria-describedby={hint ? `password-${name}-hint` : undefined}
          required
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={`${visible ? 'Masquer' : 'Afficher'} le champ ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeSlashIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
        </button>
      </div>
    </Field>
  )
}

const ProfileEditor = () => {
  const { portfolioData, updateProfile, loading } = usePortfolio()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { ...portfolioData.profile }
  })
  const [missionContent, setMissionContent] = React.useState(portfolioData.profile.mission || '')
  const [photoPreview, setPhotoPreview] = React.useState(portfolioData.profile.photo || '')
  const [photoUploading, setPhotoUploading] = React.useState(false)
  const [passwordData, setPasswordData] = React.useState(EMPTY_PASSWORDS)
  const [passwordLoading, setPasswordLoading] = React.useState(false)
  const photoInput = React.useRef(null)

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Formats acceptés : JPEG, PNG, GIF et WebP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La photo ne doit pas dépasser 2 Mo.')
      return
    }
    setPhotoUploading(true)
    try {
      const data = new FormData()
      data.append('photo', file)
      const result = await apiRequest('/api/upload/photo', { method: 'POST', body: data })
      if (!getImageUrl(result.url)) throw new Error('Adresse de photo invalide.')
      setPhotoPreview(result.url)
      toast.success('Photo importée. Enregistrez le profil pour finaliser.')
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    if (passwordLoading) return
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas.')
      return
    }
    if (passwordData.newPassword.length < 12 || new TextEncoder().encode(passwordData.newPassword).length > 72) {
      toast.error('Utilisez au moins 12 caractères et au maximum 72 octets.')
      return
    }
    setPasswordLoading(true)
    try {
      await apiRequest('/api/change-password', jsonRequest('POST', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }))
      toast.success('Mot de passe modifié avec succès !')
      setPasswordData(EMPTY_PASSWORDS)
    } catch (failure) {
      toast.error(failure.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const resetProfile = () => {
    reset(portfolioData.profile)
    setMissionContent(portfolioData.profile.mission || '')
    setPhotoPreview(portfolioData.profile.photo || '')
  }

  const onSubmit = async (data) => {
    if (photoUploading || loading) return
    const result = await updateProfile({ ...data, photo: photoPreview || null, mission: missionContent })
    if (result.success) {
      reset({ ...data, photo: photoPreview || null, mission: missionContent })
      toast.success('Profil mis à jour avec succès !')
    } else {
      toast.error(result.error || 'Erreur lors de la mise à jour du profil')
    }
  }

  // Shared attributes for registered inputs: id, invalid state and link to hint/error messages.
  const control = (name, hint) => ({
    id: `profile-${name}`,
    className: 'input-field',
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': [hint && `profile-${name}-hint`, errors[name] && `profile-${name}-error`].filter(Boolean).join(' ') || undefined,
  })
  const photoSrc = getImageUrl(photoPreview)
  const setPassword = (key) => (e) => setPasswordData({ ...passwordData, [key]: e.target.value })

  return (
    <>
      <header className="admin-page-header">
        <div>
          <p className="eyebrow">Profil</p>
          <h1>Informations <em>personnelles.</em></h1>
          <p>Ces informations alimentent l’en-tête, la section À propos et le contact du site public.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <section className="admin-panel" aria-labelledby="profile-identity-title">
          <div className="admin-panel-header">
            <div>
              <h2 id="profile-identity-title">Identité</h2>
              <p>Les champs marqués d’un astérisque (*) sont obligatoires.</p>
            </div>
          </div>
          <div className="admin-panel-body grid gap-5">
            <div className="admin-grid-2">
              <Field name="titre" label="Titre (affiché avant le prénom)">
                <input {...register('titre')} {...control('titre')} type="text" autoComplete="honorific-prefix" placeholder="Dr." />
              </Field>
              <Field name="prenom" label="Prénom" required error={errors.prenom?.message}>
                <input {...register('prenom', { required: 'Le prénom est requis' })} {...control('prenom')} type="text" autoComplete="given-name" aria-required="true" />
              </Field>
              <Field name="nom" label="Nom" required error={errors.nom?.message}>
                <input {...register('nom', { required: 'Le nom est requis' })} {...control('nom')} type="text" autoComplete="family-name" aria-required="true" />
              </Field>
              <Field name="nationalite" label="Nationalité">
                <input {...register('nationalite')} {...control('nationalite')} type="text" />
              </Field>
            </div>
            <Field name="tagline" label="Accroche (bandeau d’accueil)">
              <input {...register('tagline')} {...control('tagline')} type="text" placeholder="Recherche · Enseignement · Transmission" />
            </Field>
          </div>
        </section>

        <section className="admin-panel" aria-labelledby="profile-photo-title">
          <div className="admin-panel-header">
            <h2 id="profile-photo-title">Photo de profil</h2>
          </div>
          <div className="admin-panel-body flex flex-wrap items-start gap-6">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt="Aperçu de la photo de profil"
                className="object-cover rounded-[4px] border"
                style={{ width: 160, height: 160, borderColor: 'var(--line)' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <div className="grid place-items-center rounded-[4px] border" style={{ width: 160, height: 160, borderColor: 'var(--line)', background: '#eceee8', color: 'var(--muted)' }}>
                <UserIcon className="h-12 w-12" aria-hidden="true" />
                <span className="sr-only">Aucune photo</span>
              </div>
            )}
            <div className="min-w-0 flex-1" style={{ minWidth: 200 }}>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-secondary" onClick={() => photoInput.current?.click()} disabled={photoUploading} aria-describedby="profile-photo-hint">
                  Choisir une photo
                </button>
                <button type="button" className="btn-danger" onClick={() => setPhotoPreview('')} disabled={!photoPreview || photoUploading}>
                  Supprimer
                </button>
                <input
                  ref={photoInput}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading}
                  className="hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>
              <p id="profile-photo-hint" className="mt-3 text-[11px]" style={{ color: 'var(--muted)' }}>
                Formats JPEG, PNG, GIF ou WebP, 2 Mo maximum. Format carré recommandé. La photo est appliquée après l’enregistrement du profil.
              </p>
              <p role="status" className="mt-2 text-xs" style={{ color: 'var(--teal)' }}>
                {photoUploading ? 'Importation de la photo en cours…' : ''}
              </p>
            </div>
          </div>
        </section>

        <section className="admin-panel" aria-labelledby="profile-affiliation-title">
          <div className="admin-panel-header">
            <h2 id="profile-affiliation-title">Fonction &amp; affiliation</h2>
          </div>
          <div className="admin-panel-body grid gap-5">
            <div className="admin-grid-2">
              <Field name="grade" label="Grade">
                <input {...register('grade')} {...control('grade')} type="text" />
              </Field>
              <Field name="fonction" label="Fonction">
                <input {...register('fonction')} {...control('fonction')} type="text" />
              </Field>
            </div>
            <Field name="affiliation" label="Affiliation">
              <textarea {...register('affiliation')} {...control('affiliation')} rows={3} className="input-field resize-y" />
            </Field>
            <Field name="laboratoire" label="Laboratoire">
              <textarea {...register('laboratoire')} {...control('laboratoire')} rows={3} className="input-field resize-y" />
            </Field>
            <Field name="equipe" label="Équipe de recherche">
              <textarea {...register('equipe')} {...control('equipe')} rows={3} className="input-field resize-y" />
            </Field>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Les langues parlées et les formations se modifient dans la section « À propos ».{' '}
              <Link to="/admin/sections" className="underline underline-offset-4" style={{ color: 'var(--teal)' }}>Ouvrir les sections</Link>
            </p>
          </div>
        </section>

        <section className="admin-panel" aria-labelledby="profile-contact-title">
          <div className="admin-panel-header">
            <h2 id="profile-contact-title">Coordonnées</h2>
          </div>
          <div className="admin-panel-body">
            <div className="admin-grid-2">
              <Field name="email" label="Email de contact" error={errors.email?.message}>
                <input
                  {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format d’email invalide' } })}
                  {...control('email')}
                  type="email"
                  autoComplete="email"
                />
              </Field>
              <Field name="gsm" label="Téléphone">
                <input {...register('gsm')} {...control('gsm')} type="tel" autoComplete="tel" />
              </Field>
            </div>
          </div>
        </section>

        <section className="admin-panel" aria-labelledby="profile-mission-title">
          <div className="admin-panel-header">
            <h2 id="profile-mission-title">Présentation</h2>
          </div>
          <div className="admin-panel-body">
            <Field name="mission" label="Mission">
              <WysiwygEditor id="profile-mission" value={missionContent} onChange={setMissionContent} placeholder="Décrivez votre mission professionnelle." />
            </Field>
          </div>
        </section>

        <section className="admin-panel" aria-labelledby="profile-social-title">
          <div className="admin-panel-header">
            <h2 id="profile-social-title">Réseaux académiques</h2>
          </div>
          <div className="admin-panel-body">
            <div className="admin-grid-2">
              <Field name="linkedin" label="LinkedIn" error={errors.linkedin?.message}>
                <input {...register('linkedin', urlRule)} {...control('linkedin')} type="url" autoComplete="url" placeholder="https://linkedin.com/in/..." />
              </Field>
              <Field name="researchgate" label="ResearchGate" error={errors.researchgate?.message}>
                <input {...register('researchgate', urlRule)} {...control('researchgate')} type="url" autoComplete="url" placeholder="https://researchgate.net/profile/..." />
              </Field>
              <Field name="youtube" label="Chaîne YouTube" error={errors.youtube?.message}>
                <input {...register('youtube', urlRule)} {...control('youtube')} type="url" autoComplete="url" placeholder="https://youtube.com/..." />
              </Field>
            </div>
          </div>
        </section>

        <div className="admin-form-footer">
          <button type="button" className="btn-secondary" onClick={resetProfile}>Annuler</button>
          <button type="submit" className="btn-primary" disabled={loading || photoUploading}>
            {loading ? 'Enregistrement…' : 'Sauvegarder'}
          </button>
        </div>
      </form>

      <section className="admin-panel mt-6" aria-labelledby="profile-security-title">
        <div className="admin-panel-header">
          <div>
            <h2 id="profile-security-title">Sécurité</h2>
            <p>Modifiez le mot de passe de votre compte administrateur.</p>
          </div>
        </div>
        <form aria-labelledby="profile-security-title" onSubmit={handlePasswordChange} className="admin-panel-body grid gap-5" style={{ maxWidth: 560 }}>
          <PasswordField
            name="currentPassword"
            label="Mot de passe actuel"
            autoComplete="current-password"
            value={passwordData.currentPassword}
            onChange={setPassword('currentPassword')}
          />
          <PasswordField
            name="newPassword"
            label="Nouveau mot de passe"
            hint="12 caractères minimum, 72 octets maximum."
            autoComplete="new-password"
            value={passwordData.newPassword}
            onChange={setPassword('newPassword')}
            minLength={12}
            maxLength={72}
          />
          <PasswordField
            name="confirmPassword"
            label="Confirmer le nouveau mot de passe"
            autoComplete="new-password"
            value={passwordData.confirmPassword}
            onChange={setPassword('confirmPassword')}
            minLength={12}
            maxLength={72}
          />
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Modification…' : 'Changer le mot de passe'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setPasswordData(EMPTY_PASSWORDS)}>Annuler</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default ProfileEditor
