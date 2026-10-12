import { ui, defaultLang, type Lang, type UIKey } from './ui';

// Segmenti di rotta: IT = canonico, EN = tradotto
const itToEn: Record<string, string> = {
  lavori: 'works',
  'chi-siamo': 'about',
  contatti: 'contact',
};
const enToIt: Record<string, string> = Object.fromEntries(
  Object.entries(itToEn).map(([it, en]) => [en, it]),
);

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/doublelayer'

/** Rotta "pulita" dall'URL corrente, senza base e senza slash: 'lavori/drago' | 'en/works/dragon' | '' */
export function getRoute(url: URL): string {
  let p = url.pathname;
  if (baseUrl && p.startsWith(baseUrl)) p = p.slice(baseUrl.length);
  return p.replace(/^\/+|\/+$/g, '');
}

/** Lingua corrente: 'en' se la rotta inizia con /en, altrimenti 'it' */
export function getLangFromUrl(url: URL): Lang {
  const route = getRoute(url);
  return route === 'en' || route.startsWith('en/') ? 'en' : 'it';
}

/** Rotta canonica IT (senza prefisso lingua) a partire dall'URL corrente */
export function getCanonicalRoute(url: URL): string {
  const route = getRoute(url);
  if (route === 'en') return '';
  if (!route.startsWith('en/')) return route;
  // traduci i segmenti EN -> IT
  return route
    .slice(3)
    .split('/')
    .map((seg, i) => (i === 0 ? (enToIt[seg] ?? seg) : seg))
    .join('/');
}

/** URL completo (con base) per una rotta canonica IT, nella lingua richiesta */
export function pathFor(canonicalRoute: string, lang: Lang): string {
  if (lang === 'it') {
    return canonicalRoute ? `${baseUrl}/${canonicalRoute}/` : `${baseUrl}/`;
  }
  const mapped = canonicalRoute
    .split('/')
    .map((seg, i) => (i === 0 ? (itToEn[seg] ?? seg) : seg))
    .join('/');
  return mapped ? `${baseUrl}/en/${mapped}/` : `${baseUrl}/en/`;
}

/** URL della pagina corrente nell'altra lingua */
export function altLangUrl(url: URL, target: Lang): string {
  return pathFor(getCanonicalRoute(url), target);
}

/** Helper per gli asset in public/ con base path */
export function asset(path: string): string {
  return `${baseUrl}/${path.replace(/^\//, '')}`;
}

/** t() — traduzione chiavi UI con fallback IT */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Slug di un pezzo a partire dall'id della collection ('drago.it' -> 'drago') */
export function workSlug(id: string): string {
  return id.replace(/\.(it|en)$/, '');
}

/** Lingua di una entry della collection */
export function workLang(id: string): Lang {
  return id.endsWith('.en') ? 'en' : 'it';
}
