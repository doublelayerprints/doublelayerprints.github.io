import React, { useState } from 'react';
import { products, categories } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { t } = useLanguage();

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="animate-fade-in" style={styles.page}>
      
      {/* Page Header */}
      <header style={styles.header}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={styles.title}>{t('catalogTitle')}</h1>
          <p style={styles.subtitle}>{t('catalogSubtitle')}</p>
        </div>
      </header>

      <div className="container">
        {/* Filters */}
        <div style={styles.filterSection}>
           <div style={styles.filterHeader}>
              <Filter size={20} color="var(--color-text-muted)" />
              <span style={{color: 'var(--color-text-muted)', fontWeight: 500}}>{t('categories')}</span>
           </div>
           <div style={styles.chipsWrapper}>
              {categories.map((cat) => (
                 <button
                   key={cat.id}
                   style={{
                     ...styles.chip,
                     backgroundColor: activeCategory === cat.id ? 'var(--color-primary)' : 'var(--color-surface)',
                     color: activeCategory === cat.id ? '#fff' : 'var(--color-text)',
                     borderColor: activeCategory === cat.id ? 'var(--color-primary)' : 'var(--color-border)'
                   }}
                   onClick={() => setActiveCategory(cat.id)}
                 >
                   {cat.name}
                 </button>
              ))}
           </div>
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div style={{textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)'}}>
            <h3>{t('noProducts')}</h3>
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  page: {
    paddingBottom: 'var(--spacing-xl)'
  },
  header: {
    padding: '4rem 0',
    backgroundColor: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    marginBottom: 'var(--spacing-xl)'
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-text-muted)'
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: 'var(--spacing-xl)'
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  chipsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  chip: {
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    border: '1px solid',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.2s ease'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'var(--spacing-lg)'
  }
};
