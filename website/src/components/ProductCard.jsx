import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  return (
    <Link to={`/product/${product.id}`} style={styles.card} className="product-card">
      <div style={styles.imageContainer}>
        <img src={product.image} alt={product.title} style={styles.image} />
        <div style={styles.overlay}>
          <span className="btn btn-primary">{t('viewDetails')}</span>
        </div>
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.price}>€{product.price.toFixed(2)}</p>
        <div style={styles.tags}>
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      <style>{`
        .product-card {
           display: block;
           text-decoration: none;
           background: var(--color-surface);
           border-radius: var(--radius-lg);
           overflow: hidden;
           border: 1px solid var(--color-border);
           transition: all var(--transition-normal);
        }
        .product-card:hover {
           transform: translateY(-5px);
           box-shadow: var(--shadow-md);
           border-color: var(--color-primary);
        }
        .product-card hover .overlay {
           opacity: 1;
        }
        /* Needs custom JS or standard CSS hover for the overlay */
      `}</style>
    </Link>
  );
}

const styles = {
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 16, 20, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  content: {
    padding: '1.25rem',
  },
  title: {
    fontSize: '1.1rem',
    color: 'var(--color-text)',
    marginBottom: '0.25rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  price: {
    color: 'var(--color-text-muted)',
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '1rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  tag: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--color-text-muted)',
    borderRadius: '4px',
    border: '1px solid var(--color-border)'
  }
};
