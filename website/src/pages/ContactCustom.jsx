import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactCustom() {
  const [activeTab, setActiveTab] = useState('general');
  const location = useLocation();
  const { t } = useLanguage();

  // If a user clicked "Request this print" on a product, it passes ?product=Name
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const prod = params.get('product');
    if (prod) {
      setActiveTab('general');
      // In a real app we'd pre-fill the textarea with this 'prod' value
    }
  }, [location]);

  return (
    <div className="animate-fade-in" style={styles.page}>
      <header style={styles.header}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={styles.title}>{t('contactTitle')}</h1>
          <p style={styles.subtitle}>{t('contactSubtitle')}</p>
        </div>
      </header>

      <div className="container" style={styles.content}>
        <div style={styles.tabs}>
           <button 
             style={{...styles.tabBtn, borderBottomColor: activeTab === 'general' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'general' ? 'var(--color-text)' : 'var(--color-text-muted)'}}
             onClick={() => setActiveTab('general')}
           >
             {t('tabGeneral')}
           </button>
           <button 
             style={{...styles.tabBtn, borderBottomColor: activeTab === 'custom' ? 'var(--color-primary)' : 'transparent', color: activeTab === 'custom' ? 'var(--color-text)' : 'var(--color-text-muted)'}}
             onClick={() => setActiveTab('custom')}
           >
             {t('tabCustom')}
           </button>
        </div>

        <div style={styles.formContainer}>
          {activeTab === 'general' ? (
             <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('yourName')}</label>
                 <input type="text" style={styles.input} placeholder="John Doe" />
               </div>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('emailAddress')}</label>
                 <input type="email" style={styles.input} placeholder="john@example.com" />
               </div>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('messageContent')}</label>
                 <textarea style={styles.textarea} placeholder="I would like to order the Modern Geometric Planter in Black..." rows={5}></textarea>
               </div>
               <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                 {t('sendMessage')} <Send size={18} />
               </button>
             </form>
          ) : (
             <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
               <div style={styles.warningBox}>
                  <p>{t('stlNote')}</p>
               </div>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('yourName')}</label>
                 <input type="text" style={styles.input} placeholder="Jane Doe" />
               </div>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('emailAddress')}</label>
                 <input type="email" style={styles.input} placeholder="jane@example.com" />
               </div>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('linkToFile')}</label>
                 <div style={styles.inputWithIcon}>
                    <LinkIcon size={18} color="var(--color-text-muted)" style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)'}} />
                    <input type="url" style={{...styles.input, paddingLeft: '2.5rem'}} placeholder="https://drive.google.com/open?id=..." />
                 </div>
               </div>
               <div style={styles.inputGroup}>
                 <label style={styles.label}>{t('projectDetails')}</label>
                 <textarea style={styles.textarea} placeholder="Please specify desired material (PLA/PETG), color, size scaling, or any special requirements." rows={5}></textarea>
               </div>
               <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                 {t('requestQuote')} <Send size={18} />
               </button>
             </form>
          )}
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
  content: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--color-border)',
    marginBottom: '2rem'
  },
  tabBtn: {
    flex: 1,
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    transition: 'all 0.2s',
  },
  formContainer: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: 600,
    color: 'var(--color-text)',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  inputWithIcon: {
    position: 'relative'
  },
  submitBtn: {
    padding: '1rem',
    fontSize: '1.1rem',
    marginTop: '0.5rem'
  },
  warningBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid var(--color-primary)',
    padding: '1rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-muted)',
    fontSize: '0.95rem',
    lineHeight: 1.5
  }
};
