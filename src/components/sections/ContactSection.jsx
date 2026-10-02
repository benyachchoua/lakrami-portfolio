import { ArrowUpRightIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import SectionHeading from './SectionHeading'
import SectionBlocks from './SectionBlocks'

const ContactSection = ({ section, profile = {}, number, anchor }) => (
  <section id={anchor} className="section-padding contact-section" aria-labelledby={`${anchor}-heading`}>
    <div className="container-max">
      <div className="contact-grid">
        <SectionHeading section={section} number={number} anchor={anchor} split={false} />
        <div className="contact-details">
          {profile.email && <a className="contact-link" href={'mailto:' + profile.email}><EnvelopeIcon aria-hidden="true" /><span><small>Adresse professionnelle</small><strong>{profile.email}</strong></span><ArrowUpRightIcon aria-hidden="true" /></a>}
          {profile.gsm && <a className="contact-link" href={'tel:' + profile.gsm.replace(/[^+\d]/g, '')}><PhoneIcon aria-hidden="true" /><span><small>Téléphone</small><strong>{profile.gsm}</strong></span><ArrowUpRightIcon aria-hidden="true" /></a>}
          {profile.affiliation && <address>{profile.affiliation}</address>}
        </div>
      </div>
      <SectionBlocks section={section} />
    </div>
  </section>
)

export default ContactSection
