import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Ruler, Shield, MessageCircle } from 'lucide-react';
import { products } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const product = products.find(p => p.id === id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="container" style={{textAlign: 'center', padding: '10rem 0'}}>
        <h2>{t('productNotFound')}</h2>
        <button onClick={() => navigate('/catalog')} className="btn btn-primary" style={{marginTop: '2rem'}}>
          {t('backToCatalog')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.page}>
      <div className="container">
        
        {/* Back Button */}
        <Link to="/catalog" style={styles.backButton}>
          <ArrowLeft size={20} /> {t('backToCatalog')}
        </Link>

        {/* Product Grid */}
        <div style={styles.grid}>
          {/* Left Column - Image */}
          <div style={styles.imageCol}>
            <div style={styles.imageWrapper}>
              <img src={product.image} alt={product.title} style={styles.mainImage} />
            </div>
          </div>

          {/* Right Column - Details */}
          <div style={styles.detailsCol}>
            <h1 style={styles.title}>{product.title}</h1>
            <p style={styles.price}>€{product.price.toFixed(2)}</p>
            
            <p style={styles.description}>{product.description}</p>
            
            <div style={styles.specs}>
              <div style={styles.specItem}>
                <Shield size={20} color="var(--color-primary)" />
                <div>
                  <h4 style={styles.specTitle}>{t('material')}</h4>
                  <p style={styles.specDesc}>{product.material}</p>
                </div>
              </div>
              
              <div style={styles.specItem}>
                <Ruler size={20} color="var(--color-primary)" />
                <div>
                  <h4 style={styles.specTitle}>{t('dimensions')}</h4>
                  <p style={styles.specDesc}>{product.dimensions}</p>
                </div>
              </div>

              <div style={styles.specItem}>
                <Package size={20} color="var(--color-primary)" />
                <div>
                  <h4 style={styles.specTitle}>{t('weight')}</h4>
                  <p style={styles.specDesc}>{product.weight}</p>
                </div>
              </div>
            </div>

            <div style={styles.tags}>
               {product.tags.map(tag => (
                  <span key={tag} style={styles.tag}>{tag}</span>
               ))}
            </div>

            <hr style={styles.divider} />

            <div style={styles.orderCard}>
               <h3 style={styles.orderTitle}>{t('readyToOrder')}</h3>
               <p style={styles.orderText}>{t('orderDesc')}</p>
               <Link to={`/contact?product=${encodeURIComponent(product.title)}`} className="btn btn-primary" style={styles.orderButton}>
                 <MessageCircle size={20} /> {t('requestThisPrint')}
               </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    paddingTop: '3rem',
    paddingBottom: '5rem'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-text-muted)',
    marginBottom: '2rem',
    fontWeight: 500,
    transition: 'color var(--transition-fast)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'start'
  },
  imageCol: {
    width: '100%'
  },
  imageWrapper: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
    lineHeight: 1.1
  },
  price: {
    fontSize: '2rem',
    color: 'var(--color-primary)',
    fontWeight: 'bold',
    marginBottom: '2rem'
  },
  description: {
    fontSize: '1.1rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.7,
    marginBottom: '3rem'
  },
  specs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  specItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem'
  },
  specTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-text-muted)',
    marginBottom: '0.2rem'
  },
  specDesc: {
    fontSize: '1.1rem',
    color: 'var(--color-text)'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  },
  tag: {
    padding: '0.3rem 0.8rem',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '50px',
    fontSize: '0.85rem'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--color-border)',
    margin: '2rem 0'
  },
  orderCard: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '2rem',
    textAlign: 'center'
  },
  orderTitle: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  orderText: {
    color: 'var(--color-text-muted)',
    marginBottom: '1.5rem'
  },
  orderButton: {
    width: '100%'
  }
};

// basic media query injection for layout
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @media (max-width: 900px) {
    div[style*="column-gap: 4rem"] {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }
  }
`;
document.head.appendChild(styleTag);
