import { ArrowUpRightIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

const ContactSection = ({ profile = {} }) => (
  <section id="contact" className="section-padding contact-section" aria-labelledby="contact-heading">
    <div className="container-max contact-grid">
      <div className="section-heading"><p className="eyebrow">Échangeons</p><h2 id="contact-heading">Une question,<br /><em>une collaboration ?</em></h2><p>Pour un échange académique, un projet de recherche ou une demande d’encadrement, vous pouvez me joindre directement.</p></div>
      <div className="contact-details">
        {profile.email && <a className="contact-link" href={'mailto:' + profile.email}><EnvelopeIcon aria-hidden="true" /><span><small>Adresse professionnelle</small><strong>{profile.email}</strong></span><ArrowUpRightIcon aria-hidden="true" /></a>}
        {profile.gsm && <a className="contact-link" href={'tel:' + profile.gsm.replace(/[^+\d]/g, '')}><PhoneIcon aria-hidden="true" /><span><small>Téléphone</small><strong>{profile.gsm}</strong></span><ArrowUpRightIcon aria-hidden="true" /></a>}
        {profile.affiliation && <address>{profile.affiliation}</address>}
      </div>
    </div>
  </section>
)

export default ContactSection

