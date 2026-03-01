import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first open by default
  const { t, language } = useLanguage();

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in" style={styles.page}>
      <header style={styles.header}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={styles.title}>{t('faqPageTitle')}</h1>
          <p style={styles.subtitle}>{t('faqSubtitle')}</p>
        </div>
      </header>

      <div className="container" style={{maxWidth: '800px', margin: '0 auto'}}>
        <div style={styles.faqList}>
          {t('faqsList').map((faq, index) => {
             const isOpen = openIndex === index;
             return (
               <div 
                 key={index} 
                 style={{
                   ...styles.faqItem,
                   borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)'
                 }}
               >
                 <button 
                   style={styles.questionBtn} 
                   onClick={() => toggleFaq(index)}
                 >
                   {faq.question}
                   {isOpen ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="var(--color-text-muted)" />}
                 </button>
                 
                 {isOpen && (
                   <div style={styles.answerWrapper}>
                     <p style={styles.answerText}>{faq.answer}</p>
                   </div>
                 )}
               </div>
             );
          })}
        </div>
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
    marginBottom: '3rem'
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--color-text-muted)'
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  faqItem: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    transition: 'border-color 0.3s'
  },
  questionBtn: {
    width: '100%',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'left',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--color-text)'
  },
  answerWrapper: {
    padding: '0 1.5rem 1.5rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  answerText: {
    color: 'var(--color-text-muted)',
    lineHeight: 1.6,
    paddingTop: '1rem'
  }
};
