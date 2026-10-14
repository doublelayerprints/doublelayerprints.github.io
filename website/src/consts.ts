// ============================================================
// Dati del sito — MODIFICA QUI i contatti e le stampanti.
// I valori attuali sono placeholder da sostituire con quelli veri.
// ============================================================

export const SITE = {
  name: 'Double LayeR Prints',
  instagram: {
    handle: 'doublelayerprints', // TODO: handle Instagram reale
    url: 'https://instagram.com/doublelayerprints',
  },
  email: 'doublelayerprints@gmail.com', // TODO: email reale
  whatsapp: {
    number: '393333333333', // TODO: numero reale, formato internazionale senza +
    display: '+39 333 333 3333',
  },
  // Form dei contatti: invii via Formspree (account gratuito collegato
  // all'email sopra). A ID vuoto il form resta visibile ma l'invio
  // fallisce: lo stato d'errore propone comunque la mail diretta.
  formspree: {
    formId: 'f/xjygadgb',
  },
} as const;

export const PRINTERS = [
  { model: 'Anycubic Kobra 3', type: { it: 'Bedslinger multicolore', en: 'Multicolor bedslinger' } },
  { model: 'Anycubic Kobra X', type: { it: 'FDM ad alta velocità', en: 'High-speed FDM' } },
] as const;

// Prefill WhatsApp: testo del messaggio che parte quando si clicca
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

// Endpoint della form contatti: vuoto se l'ID non è ancora configurato.
// Tollerante ai formati: "xjygadgb", "f/xjygadgb" e "/f/xjygadgb" sono uguali.
export const formspreeEndpoint = (() => {
  const raw = SITE.formspree.formId.replace(/^\/?(?:f\/)?/, '');
  return raw ? `https://formspree.io/f/${raw}` : '';
})();
