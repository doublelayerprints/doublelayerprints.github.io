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
} as const;

export const PRINTERS = [
  { model: 'Anycubic Kobra 3', type: { it: 'Bedslinger multicolore', en: 'Multicolor bedslinger' } },
  { model: 'Anycubic Kobra X', type: { it: 'FDM ad alta velocità', en: 'High-speed FDM' } },
] as const;

// Prefill WhatsApp: testo del messaggio che parte quando si clicca
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp.number}?text=${encodeURIComponent(message)}`;
}
