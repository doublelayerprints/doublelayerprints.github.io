import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.grid}>
          {/* Brand */}
          <div style={styles.col}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <img src="/logo.png" alt="Double LayeR Prints" style={{height: '32px'}} />
              <h3 style={styles.brand}>
                <span style={{ color: 'var(--color-primary)' }}>Double</span>
                <span style={{ color: 'var(--color-accent)' }}>LayeR</span>
                {' '}Prints
              </h3>
            </div>
            <p style={styles.text}>
              {t('brandDesc')}
            </p>
          </div>

          {/* Links */}
          <div style={styles.col}>
            <h4 style={styles.heading}>{t('explore')}</h4>
            <Link to="/catalog" style={styles.link}>{t('catalog')}</Link>
            <Link to="/contact" style={styles.link}>{t('customPrints')}</Link>
            <Link to="/faq" style={styles.link}>{t('faqTitle')}</Link>
          </div>

          {/* Social */}
          <div style={styles.col}>
            <h4 style={styles.heading}>{t('connect')}</h4>
            <div style={styles.socials}>
              <a href="#" style={styles.iconLink}><Instagram size={20} /></a>
              <a href="#" style={styles.iconLink}><Twitter size={20} /></a>
              <a href="#" style={styles.iconLink}><Mail size={20} /></a>
            </div>
            <p style={styles.contactEmail}>hello@doublelayer.com</p>
          </div>
        </div>

        <div style={styles.bottom}>
            © {new Date().getFullYear()} Double LayeR Prints. Built with <Heart size={14} style={{color: 'var(--color-error)', display: 'inline', verticalAlign: 'middle'}}/> by Tancredi & GF.
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    paddingTop: 'var(--spacing-xl)',
    marginTop: 'auto' // pushes footer to bottom
  },
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-xl)'
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)'
  },
  brand: {
    fontSize: '1.5rem',
    color: 'var(--color-text)'
  },
  text: {
    color: 'var(--color-text-muted)',
    fontSize: '0.95rem',
    lineHeight: 1.6
  },
  heading: {
    fontSize: '1.1rem',
    color: 'var(--color-text)'
  },
  link: {
    color: 'var(--color-text-muted)',
    fontSize: '0.95rem'
  },
  socials: {
    display: 'flex',
    gap: '1rem'
  },
  iconLink: {
    color: 'var(--color-text-muted)',
    padding: '0.5rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  contactEmail: {
    color: 'var(--color-primary)',
    fontWeight: 600,
    marginTop: '0.5rem'
  },
  bottom: {
    borderTop: '1px solid var(--color-border)',
    padding: '1.5rem 0',
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '0.85rem'
  }
};
