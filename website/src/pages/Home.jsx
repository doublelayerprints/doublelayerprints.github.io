import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Printer, Zap, Trophy } from 'lucide-react';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="animate-fade-in" style={styles.containerWrapper}>
      <section style={{...styles.sectionCommon, ...styles.hero}}>
        <div style={styles.heroBg}></div>
        <div style={styles.heroGradient}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            {t('heroTitle_1')}<span className="text-glow" style={{ color: 'var(--color-primary)' }}>{t('heroTitle_2')}</span>
          </h1>
          <p style={styles.heroSubtitle}>
            {t('heroSubtitle')}
          </p>
          <div style={styles.heroButtons}>
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {t('exploreCatalog')} <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="btn" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {t('requestCustomPrint')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section style={{...styles.sectionCommon, ...styles.features}}>
         <div style={styles.featuresWrapper}>
            <div style={styles.featuresGrid}>
              <div style={styles.featureItem}>
                <Printer size={32} color="var(--color-primary)" />
                <h3 style={styles.featureTitle}>{t('feature1_title')}</h3>
                <p style={styles.featureText}>{t('feature1_desc')}</p>
              </div>
              <div style={styles.featureItem}>
                <Zap size={32} color="var(--color-primary)" />
                <h3 style={styles.featureTitle}>{t('feature2_title')}</h3>
                <p style={styles.featureText}>{t('feature2_desc')}</p>
              </div>
              <div style={styles.featureItem}>
                <Trophy size={32} color="var(--color-primary)" />
                <h3 style={styles.featureTitle}>{t('feature3_title')}</h3>
                <p style={styles.featureText}>{t('feature3_desc')}</p>
              </div>
            </div>
         </div>
      </section>

      {/* Featured Products */}
      <section style={{...styles.sectionCommon, ...styles.featured}}>
        <div style={styles.featuredWrapper}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>{t('latestCreations')}</h2>
            <Link to="/catalog" style={styles.viewAll}>{t('viewAllModels')} <ArrowRight size={16} /></Link>
          </div>
          <div style={styles.productGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Teaser */}
      <section style={{...styles.sectionCommon, ...styles.about}}>
         <div style={styles.aboutContainer}>
           <div style={styles.aboutContent}>
             <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>{t('aboutHello')}</h2>
             <p style={{fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2rem'}}>
               {t('aboutText')}
             </p>
             <Link to="/contact" className="btn btn-primary">{t('getInTouch')}</Link>
           </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  containerWrapper: {
    height: '100vh',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth',
  },
  sectionCommon: {
    minHeight: '100vh',
    scrollSnapAlign: 'start',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 0', // base padding for vertical breathing room
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid var(--color-border)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '800px',
    textAlign: 'center',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '1.5rem',
    letterSpacing: '-0.04em'
  },
  heroSubtitle: {
    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
    color: 'var(--color-text-muted)',
    marginBottom: '3rem',
    maxWidth: '650px',
    marginInline: 'auto'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url("/foto_home_page.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.25,
    zIndex: 1,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(15, 16, 20, 0.1) 0%, var(--color-bg) 100%)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  features: {
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)'
  },
  featuresWrapper: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--spacing-md)'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '3rem',
    textAlign: 'center',
    width: '100%'
  },
  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  featureTitle: {
    fontSize: '1.25rem'
  },
  featureText: {
    color: 'var(--color-text-muted)',
    fontSize: '0.95rem'
  },
  featured: {
    backgroundColor: 'var(--color-bg)'
  },
  featuredWrapper: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--spacing-md)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '2.5rem'
  },
  viewAll: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-primary)',
    fontWeight: 600
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'var(--spacing-lg)'
  },
  about: {
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)'
  },
  aboutContainer: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '1200px',
    padding: '0 var(--spacing-md)'
  },
  aboutContent: {
    maxWidth: '700px'
  }
};
