import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { usePortfolio } from '../../contexts/PortfolioContext'
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const PublicationsEditor = () => {
  const { portfolioData, updateSection, loading } = usePortfolio()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState('reseauxSecurite')
  
  const publicationsSection = portfolioData.sections.find(section => section.id === 'publications')
  const existingPublications = publicationsSection?.content || {
    reseauxSecurite: { title: "Réseaux et Sécurité", icon: "ShieldCheckIcon", color: "from-red-500 to-pink-500", articles: [] },
    ia: { title: "Intelligence Artificielle", icon: "ComputerDesktopIcon", color: "from-blue-500 to-cyan-500", articles: [] },
    education: { title: "Technologies Éducatives", icon: "AcademicCapIcon", color: "from-green-500 to-teal-500", articles: [] }
  }

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      domains: existingPublications
    }
  })

  const domains = [
    { key: 'reseauxSecurite', title: 'Réseaux et Sécurité', icon: ShieldCheckIcon, color: 'from-red-500 to-pink-500' },
    { key: 'ia', title: 'Intelligence Artificielle', icon: ComputerDesktopIcon, color: 'from-blue-500 to-cyan-500' },
    { key: 'education', title: 'Technologies Éducatives', icon: AcademicCapIcon, color: 'from-green-500 to-teal-500' }
  ]

  const publicationTypes = [
    'Web Of Sciences',
    'SCOPUS',
    'Book Chapter',
    'Conference',
    'Journal',
    'Thomson/Web of Sciences'
  ]

  const [articles, setArticles] = useState(existingPublications[selectedDomain]?.articles || [])

  const handleEdit = () => {
    setIsEditing(true)
    setArticles(existingPublications[selectedDomain]?.articles || [])
  }

  const handleCancel = () => {
    setIsEditing(false)
    setArticles(existingPublications[selectedDomain]?.articles || [])
  }

  const addArticle = () => {
    const newArticle = {
      id: Date.now(),
      title: '',
      authors: '',
      journal: '',
      pages: '',
      year: new Date().getFullYear().toString(),
      type: 'SCOPUS'
    }
    setArticles([...articles, newArticle])
  }

  const removeArticle = (index) => {
    setArticles(articles.filter((_, i) => i !== index))
  }

  const updateArticle = (index, field, value) => {
    const updatedArticles = articles.map((article, i) => 
      i === index ? { ...article, [field]: value } : article
    )
    setArticles(updatedArticles)
  }

  const onSubmit = async () => {
    try {
      const updatedPublications = {
        ...existingPublications,
        [selectedDomain]: {
          ...existingPublications[selectedDomain],
          articles: articles.filter(article => article.title.trim() !== '')
        }
      }

      const result = await updateSection('publications', {
        content: updatedPublications
      })

      if (result.success) {
        toast.success('Publications mises à jour avec succès')
        setIsEditing(false)
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
              <DocumentTextIcon className="h-8 w-8 mr-3 text-primary-600" />
              Gestion des Publications
            </h2>
            <p className="text-secondary-600 mt-2">
              Gérez vos publications scientifiques par domaine de recherche
            </p>
          </div>
          <div className="flex space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Voir sur le site
            </a>
            <button
              onClick={handleEdit}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Modifier les publications
            </button>
          </div>
        </div>

        {/* Sélection du domaine */}
        <div className="flex space-x-4 mb-6">
          {domains.map((domain) => {
            const Icon = domain.icon
            const articlesCount = existingPublications[domain.key]?.articles?.length || 0
            return (
              <button
                key={domain.key}
                onClick={() => setSelectedDomain(domain.key)}
                className={`flex items-center px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedDomain === domain.key
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{domain.title}</div>
                  <div className="text-sm opacity-75">{articlesCount} articles</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Aperçu des publications du domaine sélectionné */}
        <div className="space-y-4">
          {(existingPublications[selectedDomain]?.articles || []).map((article, index) => (
            <div key={article.id} className="card p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-secondary-600 mb-2">
                    <strong>Auteurs:</strong> {article.authors}
                  </p>
                  <p className="text-secondary-600 mb-2">
                    <strong>Journal:</strong> {article.journal}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {article.type}
                    </span>
                    <span className="text-secondary-500">{article.year}</span>
                    {article.pages && (
                      <span className="text-secondary-500">Pages: {article.pages}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {(existingPublications[selectedDomain]?.articles || []).length === 0 && (
            <div className="text-center py-12 text-secondary-500">
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune publication dans ce domaine</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 flex items-center">
            <DocumentTextIcon className="h-8 w-8 mr-3 text-primary-600" />
            Édition - {domains.find(d => d.key === selectedDomain)?.title}
          </h2>
          <p className="text-secondary-600 mt-2">
            Ajoutez ou modifiez les publications de ce domaine
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Sélection du domaine en mode édition */}
      <div className="flex space-x-4 mb-6">
        {domains.map((domain) => {
          const Icon = domain.icon
          return (
            <button
              key={domain.key}
              onClick={() => {
                setSelectedDomain(domain.key)
                setArticles(existingPublications[domain.key]?.articles || [])
              }}
              className={`flex items-center px-4 py-3 rounded-lg border-2 transition-all ${
                selectedDomain === domain.key
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {domain.title}
            </button>
          )
        })}
      </div>

      {/* Formulaire d'édition des articles */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-secondary-900">
            Articles ({articles.length})
          </h3>
          <button
            onClick={addArticle}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Ajouter un article
          </button>
        </div>

        {articles.map((article, index) => (
          <div key={article.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-medium text-secondary-900">
                Article {index + 1}
              </h4>
              <button
                onClick={() => removeArticle(index)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => updateArticle(index, 'title', e.target.value)}
                  className="input-field"
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Auteurs *
                </label>
                <input
                  type="text"
                  value={article.authors}
                  onChange={(e) => updateArticle(index, 'authors', e.target.value)}
                  className="input-field"
                  placeholder="Noms des auteurs"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Journal/Conférence *
                </label>
                <input
                  type="text"
                  value={article.journal}
                  onChange={(e) => updateArticle(index, 'journal', e.target.value)}
                  className="input-field"
                  placeholder="Nom du journal ou de la conférence"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Type de publication *
                </label>
                <select
                  value={article.type}
                  onChange={(e) => updateArticle(index, 'type', e.target.value)}
                  className="input-field"
                  required
                >
                  {publicationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Année *
                </label>
                <input
                  type="number"
                  value={article.year}
                  onChange={(e) => updateArticle(index, 'year', e.target.value)}
                  className="input-field"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Pages (optionnel)
                </label>
                <input
                  type="text"
                  value={article.pages || ''}
                  onChange={(e) => updateArticle(index, 'pages', e.target.value)}
                  className="input-field"
                  placeholder="ex: 190-210"
                />
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="text-center py-12 text-secondary-500">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun article ajouté</p>
            <button
              onClick={addArticle}
              className="btn-primary mt-4 flex items-center mx-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Ajouter le premier article
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicationsEditor