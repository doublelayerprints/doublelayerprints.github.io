// ============================================================
// Stringhe UI bilingui — tutto il testo "di interfaccia" vive qui.
// I contenuti lunghi (descrizioni pezzi, about) vivono nei content
// collections e nelle pagine.
// ============================================================

export const languages = { it: 'IT', en: 'EN' } as const;
export const defaultLang = 'it' as const;
export type Lang = keyof typeof ui;

export const ui = {
  it: {
    // Meta
    'site.title':
      'Double LayeR Prints — oggetti stampati in 3D, uno strato alla volta',
    'site.description':
      'Double LayeR Prints: oggetti stampati in 3D, progettati e realizzati da Tancredi e Rachele. Strato dopo strato.',

    // Nav
    'nav.works': 'Lavori',
    'nav.about': 'Chi siamo',
    'nav.contact': 'Contatti',
    'nav.openMenu': 'Apri il menu',
    'nav.closeMenu': 'Chiudi il menu',
    'nav.skip': 'Salta al contenuto',
    'nav.theme': 'Tema',
    'nav.themeDark': 'Attiva il tema scuro',
    'nav.themeLight': 'Attiva il tema chiaro',
    'nav.themeLang': 'Tema / Lingua',

    // Rail "piano di stampa"
    'rail.aria': 'Indice della pagina, per strati',
    'rail.intro': 'Intro',
    'rail.selected': 'Lavori selezionati',
    'rail.process': 'Come lavoriamo',
    'rail.duo': 'Due strati',
    'rail.talk': 'Parliamone',
    'rail.piece': 'Il pezzo',
    'rail.specs': 'Specifiche',
    'rail.about': 'Chi siamo',
    'rail.printers': 'Le stampanti',
    'rail.archive': 'Archivio stampe',
    'rail.pieces': 'I pezzi',

    // Home — hero
    'hero.tagline':
      'Siamo Tancredi e Rachele: due persone, due stampanti, un\u2019ossessione per gli oggetti fatti bene. Ogni pezzo che vedi qui è uscito strato dopo strato dal nostro laboratorio.',
    'hero.cta.works': 'Vedi i lavori',
    'hero.cta.contact': 'Scrivici',
    'hero.photoCaption': 'Il laboratorio: Kobra 3 e Kobra X',
    'hero.photoAlt':
      'Le due stampanti del laboratorio: una Anycubic Kobra 3 e una Anycubic Kobra X con le bobine di filamento',

    // Home — lavori selezionati
    'home.selected.title': 'Lavori selezionati',
    'home.selected.intro':
      'I pezzi di cui andiamo più fieri: figure, oggetti per la casa e piccole sculture. Ognuno è stampato, controllato e rifinito da noi.',
    'home.selected.all': 'Tutti i lavori',

    // Home — processo
    'process.title': 'Come lavoriamo',
    'process.1.title': 'Progettiamo',
    'process.1.text':
      'Ogni pezzo nasce da un modello 3D: lo disegniamo o lo adattiamo, poi lo affettiamo con attenzione a orientamento, supporti e riempimento.',
    'process.2.title': 'Stampiamo',
    'process.2.text':
      'Le nostre due stampanti lavorano in parallelo. Scegliamo il filamento giusto per ogni oggetto: PLA silk per brillare, PETG per resistere.',
    'process.3.title': 'Rifiniamo',
    'process.3.text':
      'Rimuoviamo supporti, controlliamo le superfici e sistemiamo i dettagli a mano. Se un pezzo non ci convince, lo ristampiamo.',

    // Home — about teaser
    'home.about.title': 'Due strati, come noi',
    'home.about.text':
      'Double LayeR è il nome del nostro modo di lavorare: la stampa 3D costruisce gli oggetti uno strato alla volta, e noi siamo in due a costruire questo progetto. Tancredi smanetta con firmware e slicer, Rachele sceglie colori e finiture.',
    'home.about.cta': 'La nostra storia',

    // Lavori
    'works.eyebrow': '; ARCHIVIO STAMPE / 0.12-0.28 MM',
    'works.title': 'I lavori',
    'works.intro':
      'Tutto quello che è uscito dalle nostre stampanti e vale la pena mostrare. Filtra per categoria, apri un pezzo per vedere foto e specifiche.',
    'works.filter.all': 'Tutti',
    'works.filterLabel': 'Filtra per categoria',
    'works.empty': 'Nessun pezzo in questa categoria, per ora.',
    'works.count': 'pezzi',

    // Categorie
    'cat.figures': 'Figure',
    'cat.home': 'Casa',
    'cat.tools': 'Strumenti',
    'cat.art': 'Arte',

    // Dettaglio pezzo
    'work.back': 'Tutti i lavori',
    'work.specs': 'Specifiche di stampa',
    'spec.material': 'Materiale',
    'spec.dimensions': 'Dimensioni',
    'spec.layer': 'Altezza layer',
    'spec.weight': 'Peso',
    'spec.time': 'Tempo di stampa',
    'work.cta': 'Scrivici su WhatsApp',
    'work.whatsappPrefill': 'Ciao! Ho visto "{title}" sul vostro sito e vorrei qualche informazione in più.',
    'work.photoPlaceholder': 'Foto in arrivo — il pezzo esiste, la foto professionale no (ancora).',

    // Chi siamo
    'about.eyebrow': '; IL LABORATORIO & LE MACCHINE',
    'about.title': 'Chi siamo',
    'about.printers.title': 'Le nostre stampanti',
    'about.cta': 'Vieni a vedere i pezzi',

    // Contatti
    'contact.eyebrow': '; CANALI DIRETTI / RISPOSTA 24H',
    'contact.title': 'Parliamone',
    'contact.intro':
      'Vuoi un pezzo che hai visto qui, un colore diverso, o hai un\u2019idea da stampare insieme? Scegli il canale che preferisci: rispondiamo sempre.',
    'contact.ig.desc': 'Dove pubblichiamo le foto dei pezzi appena usciti dal piatto. Scrivici in DM.',
    'contact.ig.action': 'Apri Instagram',
    'contact.email.desc': 'Per richieste più lunghe, file .stl o collaborazioni. Rispondiamo entro un giorno.',
    'contact.email.action': 'Scrivici una email',
    'contact.wa.desc': 'Il modo più rapido: chat diretta per domande, colori e disponibilità.',
    'contact.wa.action': 'Apri la chat',
    'contact.whatsappPrefill': 'Ciao! Vi scrivo dal vostro sito Double LayeR Prints.',

    // Footer
    'footer.tagline': 'Oggetti stampati in 3D, uno strato alla volta.',
    'footer.menu': 'Menu',
    'footer.contacts': 'Contatti',
    'footer.colophonCode': '; PRINT COMPLETE',
    'footer.colophonCopy': '© 2026 Double LayeR Prints — stampato a 0,2 mm',

    // 404
    '404.title': 'Layer mancante',
    '404.text':
      'Questa pagina non esiste: è come uno strato saltato nella stampa. Torna alla home e riparti dal piano.',
    '404.cta': 'Torna alla home',
  },

  en: {
    'site.title':
      'Double LayeR Prints — 3D printed objects, one layer at a time',
    'site.description':
      'Double LayeR Prints: 3D printed objects, designed and made by Tancredi and Rachele. Layer by layer.',

    'nav.works': 'Works',
    'nav.about': 'About us',
    'nav.contact': 'Contact',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.skip': 'Skip to content',
    'nav.theme': 'Theme',
    'nav.themeDark': 'Switch to dark theme',
    'nav.themeLight': 'Switch to light theme',
    'nav.themeLang': 'Theme / Language',

    'rail.aria': 'Page index, layer by layer',
    'rail.intro': 'Intro',
    'rail.selected': 'Selected works',
    'rail.process': 'How we work',
    'rail.duo': 'Two layers',
    'rail.talk': "Let's talk",
    'rail.piece': 'The piece',
    'rail.specs': 'Print specs',
    'rail.about': 'About us',
    'rail.printers': 'Our printers',
    'rail.archive': 'Print archive',
    'rail.pieces': 'The pieces',

    'hero.tagline':
      'We are Tancredi and Rachele: two people, two printers, one obsession with well-made objects. Every piece you see here came out of our workshop, layer after layer.',
    'hero.cta.works': 'See the works',
    'hero.cta.contact': 'Get in touch',
    'hero.photoCaption': 'The workshop: Kobra 3 and Kobra X',
    'hero.photoAlt':
      'The two printers in the workshop: an Anycubic Kobra 3 and an Anycubic Kobra X with filament spools',

    'home.selected.title': 'Selected works',
    'home.selected.intro':
      'The pieces we are most proud of: figures, home objects and small sculptures. Each one is printed, checked and finished by us.',
    'home.selected.all': 'All works',

    'process.title': 'How we work',
    'process.1.title': 'We design',
    'process.1.text':
      'Every piece starts as a 3D model: we draw or adapt it, then slice it with care for orientation, supports and infill.',
    'process.2.title': 'We print',
    'process.2.text':
      'Our two printers work in parallel. We pick the right filament for each object: silk PLA to shine, PETG to last.',
    'process.3.title': 'We finish',
    'process.3.text':
      'We remove supports, check surfaces and fix details by hand. If a piece does not convince us, we print it again.',

    'home.about.title': 'Two layers, like us',
    'home.about.text':
      'Double LayeR is the name of how we work: 3D printing builds objects one layer at a time, and we are two people building this project. Tancredi tinkers with firmware and slicers, Rachele picks colors and finishes.',
    'home.about.cta': 'Our story',

    // Works
    'works.eyebrow': '; PRINT ARCHIVE / 0.12-0.28 MM',
    'works.title': 'The works',
    'works.intro':
      'Everything that came out of our printers and is worth showing. Filter by category, open a piece for photos and specs.',
    'works.filter.all': 'All',
    'works.filterLabel': 'Filter by category',
    'works.empty': 'No pieces in this category, yet.',
    'works.count': 'pieces',

    'cat.figures': 'Figures',
    'cat.home': 'Home',
    'cat.tools': 'Tools',
    'cat.art': 'Art',

    'work.back': 'All works',
    'work.specs': 'Print specs',
    'spec.material': 'Material',
    'spec.dimensions': 'Dimensions',
    'spec.layer': 'Layer height',
    'spec.weight': 'Weight',
    'spec.time': 'Print time',
    'work.cta': 'Message us on WhatsApp',
    'work.whatsappPrefill': 'Hi! I saw "{title}" on your site and I\u2019d like to know more about it.',
    'work.photoPlaceholder': 'Photos coming soon — the piece exists, the professional photo does not (yet).',

    'about.eyebrow': '; TWO PRINTERS · TWO PEOPLE',
    'about.title': 'About us',
    'about.printers.title': 'Our printers',
    'about.cta': 'Come see the pieces',

    'contact.eyebrow': '; DIRECT CHANNELS / RESPONSE 24H',
    'contact.title': 'Let\u2019s talk',
    'contact.intro':
      'Want a piece you saw here, a different color, or have an idea to print together? Pick the channel you prefer: we always reply.',
    'contact.ig.desc': 'Where we post photos of pieces fresh off the build plate. DM us.',
    'contact.ig.action': 'Open Instagram',
    'contact.email.desc': 'For longer requests, .stl files or collaborations. We reply within a day.',
    'contact.email.action': 'Send us an email',
    'contact.wa.desc': 'The fastest way: direct chat for questions, colors and availability.',
    'contact.wa.action': 'Open the chat',
    'contact.whatsappPrefill': 'Hi! I\u2019m writing from your Double LayeR Prints site.',

    'footer.tagline': '3D printed objects, one layer at a time.',
    'footer.menu': 'Menu',
    'footer.contacts': 'Contact',
    'footer.colophonCode': '; PRINT COMPLETE',
    'footer.colophonCopy': '© 2026 Double LayeR Prints — printed at 0.2 mm',

    '404.title': 'Missing layer',
    '404.text':
      'This page does not exist: like a skipped layer in a print. Head back home and restart from the bed.',
    '404.cta': 'Back to home',
  },
} as const;

export type UIKey = keyof (typeof ui)['it'];
