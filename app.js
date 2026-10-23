import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';

// Chave pública (anon). Os dados ficam protegidos pelas regras de acesso do banco:
// cada conta só enxerga os próprios livros.
const SUPABASE_URL = 'https://urbanjbjenjbgljxokje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyYmFuamJqZW5qYmdsanhva2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3MTAxMzIsImV4cCI6MjEwODI4NjEzMn0._Mmm31Uqe-ijEOBhwR7LgUzlKx4lYCrvbvvi5ZlZ400';

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

/* ---------------- vocabulário da Kassi ---------------- */
const STATUSES = [
  { id: 'lendo', tab: 'Lendo', one: 'Lendo' },
  { id: 'lido', tab: 'Lidos', one: 'Lido' },
  { id: 'tbr', tab: 'TBR', one: 'TBR' },
  { id: 'hopeful', tab: 'Hopeful', one: 'Hopeful' },
  { id: 'biblioteca', tab: 'Biblioteca', one: 'Biblioteca' },
  { id: 'abandonado', tab: 'Abandonados', one: 'Abandonado' },
];
const OBSESSION = [
  { id: 'obsessed', label: 'OBSESSED ❤️‍🔥🔥' },
  { id: 'destruiu', label: 'Me destruiu 💀😭' },
  { id: 'amei', label: 'Amei ❤️🤩' },
  { id: 'gostei', label: 'Gostei 🥰' },
  { id: 'bonzinho', label: 'Bonzinho 🙂' },
  { id: 'gastei', label: 'Gastei tempo 😒' },
];
const LANGUAGES = [
  { id: 'pt', label: 'Português' },
  { id: 'en', label: 'Inglês' },
];
const GENRES = ['Romance', 'Romantasia', 'Sports Romance', 'Mafia Romance', 'Dark Romance', 'Cowboy', 'SMUT'];
const COLLECTIONS = [
  { id: 'favoritos', label: 'Favoritos', cls: 'c-blush', test: (b) => (b.sparkles || 0) > 0 },
  { id: 'boyfriends', label: 'Book boyfriends', cls: 'c-sage', test: (b) => (b.book_boyfriends || []).length > 0 },
  { id: 'hot', label: 'Mais hot', cls: 'c-peach', test: (b) => (b.spicy || 0) >= 4 },
  { id: 'damage', label: 'Emotional damage', cls: 'c-blush', test: (b) => b.obsession === 'destruiu' },
  { id: 'reler', label: 'Quero reler', cls: 'c-sage', test: (b) => b.want_reread },
  { id: 'nao', label: 'Não indicaria', cls: 'c-peach', test: (b) => b.wouldnt_recommend },
];
const COVER_COLORS = ['#4A2F3F', '#3E3A6B', '#2F4A5C', '#6F7F52', '#9A6B4A', '#A0675A', '#B5747B', '#4F5E73', '#5C3A4E', '#26232A'];

/* ---------------- ícones ---------------- */
const ic = {
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  plus: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  out: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/></svg>',
  star: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/></svg>',
  sparkle: '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 3l1.8 6.2L18 11l-6.2 1.8L10 19l-1.8-6.2L2 11l6.2-1.8z"/><path d="M18.5 2.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><path d="M18 15.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"/></svg>',
  // Pimenta com cores de emoji: corpo vermelho e cabinho verde.
  pepperOn: '<svg width="21" height="21" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9c4-1 10 1 10 7 0 3-3 5-6 4S6 15 8 9z" fill="#D7263D" stroke="#B51D31" stroke-width="1.2"/><path d="M8 9c-1-2 0-4 2-5" fill="none" stroke="#3E9142" stroke-width="2"/><path d="M6.5 9.5c1-.9 2.4-1 3.6-.6" fill="none" stroke="#3E9142" stroke-width="2"/></svg>',
  pepperOff: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9c4-1 10 1 10 7 0 3-3 5-6 4S6 15 8 9z"/><path d="M8 9c-1-2 0-4 2-5"/></svg>',
  chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  palette: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.8 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.1" fill="currentColor"/><circle cx="10" cy="7" r="1.1" fill="currentColor"/><circle cx="15" cy="7" r="1.1" fill="currentColor"/></svg>',
  moon: '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.2A8.5 8.5 0 1 0 20.8 15 6.8 6.8 0 0 1 15.5 3.2z" fill="#B9A4E8"/></svg>',
};

/* ---------------- temas ---------------- */
// As cores de cada tema ficam no styles.css; aqui ficam o nome, a prévia e a fonte do título.
const THEMES = [
  { id: 'editorial', name: 'Editorial', note: 'Claro ou escuro conforme o aparelho', bg: '#FAF6F2', ink: '#2B2326', accent: '#8C5A6A', meta: '#8C5A6A', font: "'Cormorant Garamond', Georgia, serif", style: 'italic', weight: 500, caps: false, spines: ['#4A2F3F', '#B5747B', '#3E3A6B'] },
  { id: 'noite', name: 'Noite Estrelada', note: 'Romantasia de cortes feéricas', bg: '#141A33', ink: '#E9E6F5', accent: '#C9CCE8', meta: '#D9B76A', font: "Cinzel, Georgia, serif", style: 'normal', weight: 600, caps: false, spines: ['#3E3A6B', '#4F5E73', '#D9B76A'], fonts: 'Cinzel:wght@500;600' },
  { id: 'lua', name: 'Lua Crescente', note: 'Fantasia urbana', bg: '#1C1B22', ink: '#EDE8F2', accent: '#B9A4E8', meta: '#7FD1C7', font: "Italiana, Didot, Georgia, serif", style: 'normal', weight: 400, caps: false, spines: ['#4A2F3F', '#B9A4E8', '#2F4A5C'], fonts: 'Italiana' },
  { id: 'rancho', name: 'Rancho', note: 'Cowboy romance', bg: '#F3EBDD', ink: '#2E2A26', accent: '#3E5C7A', meta: '#A0612F', font: "Bitter, Rockwell, Georgia, serif", style: 'italic', weight: 700, caps: false, spines: ['#9A6B4A', '#3E5C7A', '#6F7F52'], fonts: 'Bitter:ital,wght@1,600;1,700' },
  { id: 'rinque', name: 'Rinque', note: 'Sports romance', bg: '#F4F7FA', ink: '#142235', accent: '#C8102E', meta: '#C8102E', font: "Oswald, 'Arial Narrow', sans-serif", style: 'normal', weight: 600, caps: true, spines: ['#1D3A6B', '#C8102E', '#2F4A5C'], fonts: 'Oswald:wght@500;600' },
  { id: 'famiglia', name: 'Famiglia', note: 'Mafia romance', bg: '#121011', ink: '#F2E9DC', accent: '#C9A45C', meta: '#C9A45C', font: "'Bodoni Moda', Didot, Georgia, serif", style: 'italic', weight: 500, caps: false, spines: ['#26232A', '#5C3A4E', '#C9A45C'], fonts: 'Bodoni+Moda:ital,opsz,wght@1,6..96,500' },
  { id: 'sombra', name: 'Sombra', note: 'Dark romance', bg: '#0B0A0B', ink: '#EDE4E4', accent: '#B3122E', meta: '#D8475E', font: "'Playfair Display', Georgia, serif", style: 'italic', weight: 800, caps: false, spines: ['#26232A', '#B3122E', '#4A2F3F'], fonts: 'Playfair+Display:ital,wght@1,700;1,800' },
];
const THEME_KEY = 'bo.theme';
const themeById = (id) => THEMES.find((t) => t.id === id) || THEMES[0];

const loadedFonts = new Set();
function ensureFont(t) {
  if (!t.fonts || loadedFonts.has(t.id)) return;
  loadedFonts.add(t.id);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${t.fonts}&display=swap`;
  document.head.appendChild(link);
}

function applyTheme(id) {
  const t = themeById(id);
  ensureFont(t);
  if (t.id === 'editorial') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t.id;
  state.theme = t.id;
  try { localStorage.setItem(THEME_KEY, t.id); } catch { /* sem armazenamento local */ }
  // Cor da barra do navegador acompanha o fundo do tema.
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => { m.content = bg; m.removeAttribute('media'); });
}

async function chooseTheme(id) {
  applyTheme(id);
  render();
  const { error } = await sb.auth.updateUser({ data: { theme: id } });
  if (error) toast('O tema mudou aqui, mas não consegui salvar na sua conta.', true);
}

function ornamentHTML() {
  switch (state.theme) {
    case 'noite': return `<svg class="orn-stars" width="190" height="120" viewBox="0 0 190 120" aria-hidden="true">
        <path d="M110 18l2.5 9 9 2.5-9 2.5-2.5 9-2.5-9-9-2.5 9-2.5z" fill="#D9B76A"/>
        <path d="M155 50l1.6 6 6 1.6-6 1.6-1.6 6-1.6-6-6-1.6 6-1.6z" fill="#C9CCE8"/>
        <path d="M72 62l1.2 4.5 4.5 1.2-4.5 1.2-1.2 4.5-1.2-4.5-4.5-1.2 4.5-1.2z" fill="#C9CCE8"/>
        <circle cx="30" cy="16" r="1.2" fill="#C9CCE8"/><circle cx="182" cy="10" r="1" fill="#C9CCE8"/>
        <circle cx="128" cy="84" r="1" fill="#D9B76A"/><circle cx="12" cy="46" r=".9" fill="#C9CCE8"/></svg>`;
    case 'rancho': return '<div class="orn orn-stitch" aria-hidden="true"></div>';
    case 'rinque': return '<div class="orn orn-stripes" aria-hidden="true"><i></i><i></i></div>';
    case 'famiglia': return '<div class="orn orn-double" aria-hidden="true"><i></i><i></i></div>';
    case 'sombra': return '<div class="orn orn-drop" aria-hidden="true"><i></i><svg width="10" height="14" viewBox="0 0 10 14"><path d="M5 0C5 0 0 6.5 0 9.2A5 5 0 0 0 10 9.2C10 6.5 5 0 5 0z" fill="#B3122E"/></svg><i></i></div>';
    default: return '';
  }
}

/* ---------------- estado ---------------- */
const state = {
  session: null,
  books: [],
  loaded: false,
  filter: { type: 'status', value: 'lido' },
  query: '',
  sheet: null, // { kind: 'book'|'add'|'cover'|'themes', id?, ... }
  dd: null, // menu suspenso aberto
  theme: 'editorial',
  view: 'library', // 'library' | 'shelf'
  shelfYear: null,
  goalEdit: null, // { value } enquanto edita a meta
  authMode: 'login',
  authMsg: null,
  coverJob: null, // { done, total }
};

const app = document.getElementById('app');
const toastEl = document.getElementById('toast');

/* ---------------- utilidades ---------------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byId = (id) => state.books.find((b) => b.id === id);
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const cleanTitle = (t) => String(t || '').replace(/^\[[^\]]+\]\s*/, '').trim();
const colorFor = (t) => {
  let h = 0;
  for (const ch of String(t)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
};
const obsLabel = (id) => OBSESSION.find((o) => o.id === id)?.label || '';
const fmtDate = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

let toastTimer;
let toastUndo = null;
let toastGo = null;
// undo: função do botão "Desfazer"; go: função do botão "Ver na estante".
function toast(msg, isError = false, undo = null, go = null) {
  toastUndo = undo;
  toastGo = go;
  toastEl.innerHTML = `<span>${esc(msg)}</span>`
    + (go ? '<button class="toast-btn" data-action="toast-go">Ver na estante</button>' : '')
    + (undo ? '<button class="toast-btn" data-action="toast-undo">Desfazer</button>' : '');
  toastEl.classList.toggle('error', isError);
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; toastUndo = null; toastGo = null; }, isError ? 4000 : (undo || go) ? 7000 : 1800);
}

// Nome da fonte de onde a capa veio, para mostrar embaixo dela.
function sourceName(url) {
  const u = String(url || '');
  if (u === 'upload') return 'Foto enviada';
  if (/google/.test(u)) return 'Google Books';
  if (/openlibrary|archive\.org/.test(u)) return 'Open Library';
  return '';
}
const coverSource = (b) => (b.cover_url ? sourceName(b.cover_source_url || b.cover_url) : '');
const resultSource = (r) => (r.source === 'google' ? 'Google Books' : r.source === 'openlibrary' ? 'Open Library' : '');

// Menu suspenso desenhado pelo app (o nativo fica ilegível no modo escuro em alguns aparelhos).
function ddHTML(key, current, options, { placeholder = 'escolher', cls = '', label = '' } = {}) {
  const open = state.dd === key;
  const cur = options.find((o) => o.id === current);
  return `<div class="dd ${cls}">
    <button type="button" class="dd-btn" data-action="dd-open" data-dd="${key}" aria-haspopup="listbox" aria-expanded="${open}" ${label ? `aria-label="${esc(label)}: ${esc(cur ? cur.label : placeholder)}"` : ''}>
      <span class="${cur ? '' : 'dd-ph'}">${esc(cur ? cur.label : placeholder)}</span>${ic.chevron}</button>
    ${open ? `<div class="dd-menu" role="listbox">
      ${options.map((o) => `<button type="button" role="option" class="dd-opt" aria-selected="${o.id === current}" data-action="dd-pick" data-dd="${key}" data-value="${esc(o.id)}">
        <span>${esc(o.label)}</span>${o.id === current ? ic.check : ''}</button>`).join('')}
    </div>` : ''}
  </div>`;
}

function coverHTML(b, size = '') {
  const title = cleanTitle(b.title);
  const img = b.cover_url
    ? `<img src="${esc(b.cover_url)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
    : '';
  return `<div class="cover ${size}" style="background:${colorFor(title)}" role="img" aria-label="Capa de ${esc(title)}">
    <div class="typo"><span class="ct">${esc(title)}</span><span class="ca">${esc(b.author || '')}</span></div>${img}</div>`;
}

/* ---------------- Google Books ---------------- */
function gbCover(info) {
  const l = info.imageLinks;
  if (!l) return null;
  const raw = l.thumbnail || l.smallThumbnail;
  if (!raw) return null;
  return raw.replace(/^http:/, 'https:').replace('&edge=curl', '');
}
function gbLang(code) {
  if (!code) return null;
  if (code.startsWith('pt')) return 'pt';
  if (code.startsWith('en')) return 'en';
  return null;
}
// Chave restrita ao site (andreteixas.github.io) e à Books API.
const GOOGLE_BOOKS_KEY = 'AIzaSyBQj2zWWbfeQrkp03KfideegDS6J98iils';

class SearchError extends Error {
  constructor(kind) { super(kind); this.kind = kind; }
}
function searchErrorText(err) {
  if (err?.kind === 'offline') return 'Parece que você está sem internet. Confira a conexão e tente de novo.';
  if (err?.kind === 'limit') return 'O Google Books atingiu o limite de buscas agora. Tente de novo daqui a pouco.';
  return 'Não consegui falar com o Google Books nem com o Open Library. Tente de novo em instantes.';
}

async function gbSearch(q, { lang = '', max = 20 } = {}) {
  const params = new URLSearchParams({ q, maxResults: String(max), printType: 'books', key: GOOGLE_BOOKS_KEY });
  if (lang) params.set('langRestrict', lang);
  // O Google Books recusa buscas aleatoriamente com 503; tentar de novo costuma funcionar.
  const waits = [300, 600, 900, 1200];
  let res;
  for (let attempt = 0; ; attempt++) {
    try { res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`); }
    catch { throw new SearchError(navigator.onLine === false ? 'offline' : 'network'); }
    if ((res.status !== 503 && res.status !== 500) || attempt >= waits.length) break;
    await new Promise((r) => setTimeout(r, waits[attempt]));
  }
  if (res.status === 429) throw new SearchError('limit');
  if (!res.ok) throw new SearchError('google');
  const data = await res.json();
  return (data.items || []).map((it) => {
    const v = it.volumeInfo || {};
    return {
      gid: it.id,
      title: [v.title, v.subtitle].filter(Boolean).join(': '),
      author: (v.authors || []).join(', '),
      pages: v.pageCount || null,
      year: (v.publishedDate || '').slice(0, 4),
      language: gbLang(v.language),
      cover: gbCover(v),
      publisher: v.publisher || '',
      source: 'google',
    };
  });
}

/* ---------------- Open Library (reserva) ---------------- */
async function olSearch(q, { max = 20, author = '' } = {}) {
  const params = new URLSearchParams({
    limit: String(max),
    fields: 'key,title,subtitle,author_name,number_of_pages_median,cover_i,language,first_publish_year,cover_edition_key',
  });
  if (author) params.set('author', author);
  else params.set('q', q.replace(/\b(intitle|inauthor):/g, ' ').replace(/\s+/g, ' ').trim());
  let res;
  try { res = await fetch(`https://openlibrary.org/search.json?${params}`); }
  catch { throw new SearchError(navigator.onLine === false ? 'offline' : 'network'); }
  if (!res.ok) throw new SearchError('openlibrary');
  const data = await res.json();
  return (data.docs || []).map((d) => {
    const langs = d.language || [];
    const language = langs.includes('por') ? 'pt' : langs.includes('eng') ? 'en' : null;
    return {
      gid: `ol:${d.cover_edition_key || d.key}`,
      title: [d.title, d.subtitle].filter(Boolean).join(': '),
      author: (d.author_name || []).slice(0, 2).join(', '),
      pages: d.number_of_pages_median || null,
      year: d.first_publish_year ? String(d.first_publish_year) : '',
      language,
      cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg` : null,
      publisher: '',
      source: 'openlibrary',
    };
  });
}

// Google Books primeiro; Open Library completa quando o Google falha ou não traz nada.
// Busca só livros escritos pela autora: filtra quem apenas cita o nome e junta edições repetidas.
async function searchByAuthor(name, { max = 40 } = {}) {
  const who = name.replace(/"/g, '').trim();
  let google = [];
  let gErr = null;
  try { google = await gbSearch(`inauthor:"${who}"`, { max }); } catch (err) { gErr = err; }
  let ol = [];
  if (google.length < 10) {
    try { ol = await olSearch('', { max, author: who }); } catch (err) { if (gErr) throw gErr; }
    if (gErr && !ol.length) throw gErr;
  }
  const target = norm(who);
  const all = [...google, ...ol];
  const strict = all.filter((r) => norm(r.author).includes(target));
  const list = strict.length ? strict : all;
  // Uma entrada por título e idioma, preferindo a que tem capa.
  const byKey = new Map();
  for (const r of list) {
    const key = norm(r.title).replace(/[^a-z0-9]/g, '') + '|' + (r.language || '');
    const prev = byKey.get(key);
    if (!prev || (!prev.cover && r.cover)) byKey.set(key, r);
  }
  return [...byKey.values()];
}

async function searchBooks(q, { lang = '', max = 20 } = {}) {
  let google = [];
  let gErr = null;
  try { google = await gbSearch(q, { lang, max }); } catch (err) { gErr = err; }
  if (google.length >= 5) return google;
  let ol = [];
  try { ol = await olSearch(q, { max }); } catch (err) { if (gErr) throw gErr; }
  if (gErr && !ol.length) throw gErr;
  const seen = new Set(google.map((r) => norm(r.title) + '|' + norm(r.author)));
  return [...google, ...ol.filter((r) => !seen.has(norm(r.title) + '|' + norm(r.author)))];
}

/* ---------------- dados ---------------- */
async function loadBooks() {
  const { data, error } = await sb.from('books').select('*').order('created_at', { ascending: true });
  if (error) { toast('Não consegui carregar os livros. Confira a internet e recarregue.', true); return; }
  state.books = data || [];
  state.loaded = true;
  render();
  // Capas que ainda apontam para sites externos são copiadas para o Storage em segundo plano.
  migrateExternalCovers();
}

const pending = new Map();
function updateBook(id, patch, { quiet = false, rerender = true } = {}) {
  const b = byId(id);
  if (!b) return;
  Object.assign(b, patch);
  if (rerender) render();
  const prev = pending.get(id) || {};
  pending.set(id, { ...prev, ...patch });
  clearTimeout(updateBook.t?.[id]);
  updateBook.t = updateBook.t || {};
  updateBook.t[id] = setTimeout(async () => {
    const p = pending.get(id);
    pending.delete(id);
    const { error } = await sb.from('books').update(p).eq('id', id);
    if (error) toast('Não salvou. Tente de novo em instantes.', true);
    else if (!quiet && !toastUndo && !toastGo) toast('Salvo'); // não esconde um aviso com botões
  }, 500);
}

async function insertBook(row) {
  const { data, error } = await sb.from('books').insert(row).select().single();
  if (error) { toast('Não consegui adicionar o livro.', true); return null; }
  state.books.push(data);
  return data;
}

async function deleteBook(id) {
  const { error } = await sb.from('books').delete().eq('id', id);
  if (error) { toast('Não consegui excluir.', true); return; }
  state.books = state.books.filter((b) => b.id !== id);
  state.sheet = null;
  toast('Livro excluído');
  render();
}

/* ---------------- capas guardadas no Supabase ---------------- */
const STORED_MARK = '/storage/v1/object/public/covers/';
const isStored = (url) => typeof url === 'string' && url.includes(STORED_MARK);

// Copia a capa externa para o Storage. Se não der certo, o livro continua com o endereço externo.
async function cacheCover(bookId, url) {
  if (!url || isStored(url)) return false;
  try {
    const { data, error } = await sb.functions.invoke('cache-cover', { body: { book_id: bookId, url } });
    if (error || !data?.cover_url) return false;
    const b = byId(bookId);
    if (b) { b.cover_url = data.cover_url; b.cover_source_url = url; }
    return true;
  } catch { return false; }
}

// Reduz a foto para no máximo 900px de altura e salva como JPEG, para ficar leve.
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 900 / img.height, 600 / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('blob'))), 'image/jpeg', 0.86);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });
}

async function uploadOwnCover(b, file) {
  if (!file.type.startsWith('image/')) { toast('Escolha uma imagem (foto ou print da capa).', true); return; }
  state.sheet.uploading = true; state.sheet.keepScroll = true; render();
  try {
    const blob = await shrinkImage(file);
    const uid = state.session.user.id;
    const path = `${uid}/${b.id}-foto-${Date.now()}.jpg`;
    const up = await sb.storage.from('covers').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
    if (up.error) throw up.error;
    const publicUrl = sb.storage.from('covers').getPublicUrl(path).data.publicUrl;
    const old = b.cover_url;
    const { error } = await sb.from('books').update({ cover_url: publicUrl, cover_source_url: 'upload', google_books_id: null }).eq('id', b.id);
    if (error) { await sb.storage.from('covers').remove([path]); throw error; }
    b.cover_url = publicUrl; b.cover_source_url = 'upload'; b.google_books_id = null;
    // Apaga a capa anterior guardada para este livro, se havia.
    if (isStored(old)) {
      const oldPath = decodeURIComponent(old.split(STORED_MARK)[1] || '');
      if (oldPath.startsWith(uid + '/')) sb.storage.from('covers').remove([oldPath]);
    }
    toast('Capa enviada');
  } catch {
    toast('Não consegui enviar a foto. Tente de novo.', true);
  }
  if (state.sheet) { state.sheet.uploading = false; state.sheet.keepScroll = true; }
  render();
}

let migrating = false;
async function migrateExternalCovers() {
  if (migrating) return;
  migrating = true;
  const list = state.books.filter((b) => b.cover_url && !isStored(b.cover_url));
  for (const b of list) {
    await cacheCover(b.id, b.cover_url);
    await new Promise((r) => setTimeout(r, 300));
  }
  migrating = false;
}

/* ---------------- capas em lote ---------------- */
// v3: a busca automática mudou, então todos os livros sem capa são procurados de novo.
const TRIED_KEY = 'bo.coverTried.v3';
function triedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(TRIED_KEY) || '[]')); } catch { return new Set(); }
}
function saveTried(set) {
  try { localStorage.setItem(TRIED_KEY, JSON.stringify([...set])); } catch { /* sem armazenamento local */ }
}
// Todos os livros sem capa (é o número que o aviso mostra).
function missingCovers() {
  return state.books.filter((b) => !b.cover_url);
}
// Os que ainda não foram procurados com a busca atual.
function pendingCovers() {
  const tried = triedSet();
  return missingCovers().filter((b) => !tried.has(b.id));
}

const simpleText = (s) => norm(s).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const mainTitle = (s) => simpleText(String(s || '').split(':')[0]);

// Escolhe, entre os resultados, uma edição do mesmo livro, da mesma autora e no idioma da leitura.
function pickCover(b, results) {
  const want = mainTitle(cleanTitle(b.title));
  const authorLast = simpleText((b.author || '').split(',')[0]).split(' ').pop() || '';
  return results.find((r) => {
    if (!r.cover) return false;
    const got = mainTitle(r.title);
    if (!got || !(got === want || got.startsWith(want) || want.startsWith(got))) return false;
    if (authorLast && !simpleText(r.author).includes(authorLast)) return false;
    if (b.language && r.language !== b.language) return false;
    return true;
  }) || null;
}

// Busca em texto livre (o filtro de título do Google falha para várias edições brasileiras).
async function findCover(b) {
  const q = `${cleanTitle(b.title)} ${(b.author || '').split(',')[0]}`.trim();
  let gOk = false;
  let lastErr = null;
  let hit = null;
  try {
    hit = pickCover(b, await gbSearch(q, { max: 20 }));
    gOk = true;
  } catch (err) { lastErr = err; }
  if (!hit) {
    try { hit = pickCover(b, await olSearch(q, { max: 20 })); } catch (err) { lastErr = lastErr || err; }
  }
  return { hit, gOk, lastErr };
}

async function fetchMissingCovers() {
  const list = pendingCovers();
  if (!list.length) return;
  const tried = triedSet();
  state.coverJob = { done: 0, total: list.length, found: 0 };
  render();
  let lastErr = null;
  let failures = 0;
  for (const b of list) {
    try {
      const res = await findCover(b);
      const hit = res.hit;
      const gOk = res.gOk;
      if (res.lastErr) lastErr = res.lastErr;
      if (hit) {
        b.cover_url = hit.cover;
        b.google_books_id = hit.gid;
        const { error } = await sb.from('books').update({ cover_url: hit.cover, google_books_id: hit.gid }).eq('id', b.id);
        if (error) throw new SearchError('save');
        await cacheCover(b.id, hit.cover);
        state.coverJob.found++;
      }
      // Só desiste do livro se o Google respondeu de verdade (ou se achou capa).
      if (gOk || hit) { tried.add(b.id); saveTried(tried); }
      else failures++;
    } catch (err) {
      // Falha de rede ou de serviço: não marca como tentado, para dar para buscar de novo.
      lastErr = err;
      failures++;
    }
    state.coverJob.done++;
    render();
    await new Promise((r) => setTimeout(r, 250));
  }
  const { found, total } = state.coverJob;
  state.coverJob = null;
  if (failures === total) toast(searchErrorText(lastErr), true);
  else toast(`${found} de ${total} capas encontradas${failures ? `; ${failures} ficaram para tentar de novo` : ''}`);
  render();
}

/* ---------------- render: auth ---------------- */
const SITE_URL = location.origin + location.pathname;

function renderAuth() {
  const mode = state.authMode; // login | signup | forgot
  const msg = state.authMsg;
  const tagline = { login: 'Entre para abrir sua Library.', signup: 'Crie sua conta para guardar suas leituras.', forgot: 'Digite seu e-mail e enviamos um link para criar uma senha nova.' }[mode];
  const submit = { login: 'Entrar', signup: 'Criar conta', forgot: 'Enviar link' }[mode];
  app.innerHTML = `
  <main class="auth">
    <div>
      <span class="eyebrow">for readers who feel too much</span>
      <h1>Booked &amp; Obsessed</h1>
      <p class="tagline">${tagline}</p>
    </div>
    <form id="authForm" novalidate>
      <div class="field"><label for="email">E-mail</label>
        <input class="input" id="email" name="email" type="email" autocomplete="email" required value="${esc(state.authEmail || '')}"></div>
      ${mode === 'forgot' ? '' : `<div class="field"><label for="password">Senha</label>
        <input class="input" id="password" name="password" type="password" autocomplete="${mode === 'signup' ? 'new-password' : 'current-password'}" minlength="6" required></div>`}
      ${msg ? `<p class="msg ${msg.error ? 'error' : ''}">${esc(msg.text)}</p>` : ''}
      <button class="btn primary" type="submit">${submit}</button>
    </form>
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px">
      ${mode === 'login' ? '<button class="linkbtn" type="button" data-action="auth-mode" data-value="forgot">Esqueci minha senha</button>' : ''}
      ${mode !== 'login' ? '<button class="linkbtn" type="button" data-action="auth-mode" data-value="login">Voltar para entrar</button>' : ''}
      ${mode === 'login' ? '<button class="linkbtn" type="button" data-action="auth-mode" data-value="signup">Primeira vez aqui? Criar conta</button>' : ''}
    </div>
  </main>`;
}

function renderRecovery() {
  const msg = state.authMsg;
  app.innerHTML = `
  <main class="auth">
    <div>
      <span class="eyebrow">Booked &amp; Obsessed</span>
      <h1>Nova senha</h1>
      <p class="tagline">Escolha uma senha nova para entrar na sua Library.</p>
    </div>
    <form id="recoveryForm" novalidate>
      <div class="field"><label for="newpass">Senha nova</label>
        <input class="input" id="newpass" name="newpass" type="password" autocomplete="new-password" minlength="6" required></div>
      ${msg ? `<p class="msg ${msg.error ? 'error' : ''}">${esc(msg.text)}</p>` : ''}
      <button class="btn primary" type="submit">Salvar senha</button>
    </form>
  </main>`;
}

async function onRecoverySubmit(form) {
  const password = form.newpass.value;
  if (password.length < 6) { state.authMsg = { error: true, text: 'A senha precisa ter pelo menos 6 caracteres.' }; renderRecovery(); return; }
  form.querySelector('button[type=submit]').disabled = true;
  const { error } = await sb.auth.updateUser({ password });
  if (error) { state.authMsg = { error: true, text: traduzErro(error.message) }; renderRecovery(); return; }
  state.recovery = false;
  state.authMsg = null;
  toast('Senha atualizada');
  render();
  if (!state.loaded) loadBooks();
}

async function onAuthSubmit(form) {
  const email = form.email.value.trim();
  state.authEmail = email;
  if (state.authMode === 'forgot') {
    if (!email) { state.authMsg = { error: true, text: 'Digite o e-mail da sua conta.' }; renderAuth(); return; }
    form.querySelector('button[type=submit]').disabled = true;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: SITE_URL });
    state.authMsg = error && /rate limit/i.test(error.message)
      ? { error: true, text: traduzErro(error.message) }
      : { error: false, text: `Se ${email} tiver conta, o link para criar uma senha nova já está a caminho. Confira também a caixa de spam.` };
    renderAuth();
    return;
  }
  const password = form.password.value;
  if (!email || password.length < 6) {
    state.authMsg = { error: true, text: 'Preencha o e-mail e uma senha com pelo menos 6 caracteres.' };
    renderAuth();
    return;
  }
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  if (state.authMode === 'signup') {
    const { data, error } = await sb.auth.signUp({
      email, password,
      options: { emailRedirectTo: SITE_URL },
    });
    if (error) state.authMsg = { error: true, text: traduzErro(error.message) };
    else if (!data.session) state.authMsg = { error: false, text: `Enviamos um e-mail de confirmação para ${email}. Abra o link e depois entre aqui.` };
  } else {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) state.authMsg = { error: true, text: traduzErro(error.message) };
  }
  if (!state.session) renderAuth();
}

function traduzErro(m = '') {
  if (/invalid login/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/email not confirmed/i.test(m)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (/already registered/i.test(m)) return 'Esse e-mail já tem conta. Use "Já tenho conta".';
  if (/signups? not allowed|not allowed/i.test(m)) return 'Novos cadastros estão fechados.';
  if (/rate limit/i.test(m)) return 'Muitas tentativas. Espere alguns minutos e tente de novo.';
  if (/different from the old|same password/i.test(m)) return 'A senha nova precisa ser diferente da antiga.';
  if (/weak|at least/i.test(m)) return 'Escolha uma senha mais forte, com pelo menos 6 caracteres.';
  return 'Algo deu errado. Tente de novo.';
}

/* ---------------- render: library ---------------- */
function visibleBooks() {
  const q = norm(state.query);
  let list = state.books;
  if (state.filter.type === 'status') list = list.filter((b) => b.status === state.filter.value);
  else if (state.filter.type === 'nocover') list = list.filter((b) => !b.cover_url);
  else {
    const c = COLLECTIONS.find((x) => x.id === state.filter.value);
    list = list.filter(c.test);
  }
  if (q) {
    list = state.books.filter((b) =>
      [b.title, b.author, b.series, ...(b.tropes || []), ...(b.genres || []), ...(b.characters || []), ...(b.book_boyfriends || [])]
        .some((f) => norm(f).includes(q)));
  }
  return [...list].sort((a, b) => {
    if (a.finished_at && b.finished_at) return b.finished_at.localeCompare(a.finished_at);
    if (a.finished_at) return -1;
    if (b.finished_at) return 1;
    return (b.created_at || '').localeCompare(a.created_at || '');
  });
}

function cardMeta(b) {
  if (b.status === 'lendo' && b.pages) return `${Math.round(((b.current_page || 0) / b.pages) * 100)}% lido`;
  if (b.obsession) return obsLabel(b.obsession);
  if (b.sparkles) return 'Favorito';
  return '';
}

function renderLibrary() {
  const total = state.books.length;
  return `
  <div class="page">
    ${state.theme === 'noite' ? ornamentHTML() : ''}
    <header class="lib-head">
      <div>
        <span class="eyebrow">${total} ${total === 1 ? 'livro' : 'livros'}</span>
        <h1>Library</h1>
      </div>
      <div class="actions">
        ${state.theme === 'lua' ? ic.moon : ''}
        <button class="iconbtn" data-action="themes" aria-label="Temas">${ic.palette}</button>
        <button class="iconbtn" data-action="logout" aria-label="Sair da conta">${ic.out}</button>
        <button class="fab" data-action="add" aria-label="Adicionar livro">${ic.plus}</button>
      </div>
    </header>
    ${state.theme !== 'noite' ? ornamentHTML() : ''}

    <label class="search" for="q">${ic.search}
      <input id="q" type="search" placeholder="Buscar título, autora ou trope" value="${esc(state.query)}" autocomplete="off">
    </label>

    <div id="libBody" class="lib-body">${libBodyHTML()}</div>
  </div>`;
}

// Só esta parte é redesenhada enquanto a busca é digitada.
function updateLibBody() {
  const el = document.getElementById('libBody');
  if (el) el.innerHTML = libBodyHTML();
}

function libBodyHTML() {
  const total = state.books.length;
  const counts = Object.fromEntries(STATUSES.map((s) => [s.id, state.books.filter((b) => b.status === s.id).length]));
  const list = visibleBooks();
  const missing = missingCovers().length;
  const pending = pendingCovers().length;
  const job = state.coverJob;
  const filterLabel = state.query
    ? `Resultados para “${esc(state.query)}”`
    : state.filter.type === 'status'
      ? STATUSES.find((s) => s.id === state.filter.value).tab
      : state.filter.type === 'nocover'
        ? 'Sem capa'
        : COLLECTIONS.find((c) => c.id === state.filter.value).label;
  const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
  const showBtn = state.filter.type === 'nocover'
    ? ''
    : '<button class="btn small" data-action="show-nocover">Ver quais</button>';

  const banner = job
    ? `<div class="banner"><p>Buscando capas… ${job.done} de ${job.total}</p></div>`
    : missing && total
      ? pending
        ? `<div class="banner"><p>${plural(missing, 'livro está', 'livros estão')} sem capa. Posso buscar no Google Books e no Open Library; você troca as que vierem erradas.</p>
           <button class="btn small dark" data-action="fetch-covers">Buscar capas</button></div>`
        : `<div class="banner"><p>${plural(missing, 'livro está', 'livros estão')} sem capa porque ${missing === 1 ? 'a edição não foi encontrada' : 'as edições não foram encontradas'} no Google Books nem no Open Library. Abra o livro e use “Trocar capa” para buscar pela autora, ou envie uma foto da capa.</p>
           ${showBtn}</div>`
      : '';

  const body = !state.loaded
    ? '<div class="empty">Abrindo sua Library…</div>'
    : !total
      ? `<div class="empty"><span class="serif">Sua estante está esperando.</span>Toque em + para adicionar o primeiro livro.</div>`
      : !list.length
        ? `<div class="empty"><span class="serif">Nada por aqui ainda.</span>${state.query ? 'Tente outro termo.' : 'Quando um livro entrar aqui, ele aparece nesta prateleira.'}</div>`
        : `<div class="grid">${list.map((b) => `
            <button class="card" data-action="open" data-id="${b.id}">
              ${coverHTML(b)}
              <span class="ttl">${esc(cleanTitle(b.title))}</span>
              <span class="meta">${esc(cardMeta(b))}</span>
            </button>`).join('')}</div>`;

  return `
    <div class="tabs" role="tablist" aria-label="Status">
      ${STATUSES.map((s) => `<button class="tab" role="tab" data-action="status" data-value="${s.id}" aria-selected="${!state.query && state.filter.type === 'status' && state.filter.value === s.id}">${s.tab} <sup>${counts[s.id]}</sup></button>`).join('')}
    </div>

    <div class="collections" aria-label="Coleções">
      ${COLLECTIONS.map((c) => {
        const n = state.books.filter(c.test).length;
        const on = !state.query && state.filter.type === 'collection' && state.filter.value === c.id;
        return `<button class="coll ${c.cls}" data-action="collection" data-value="${c.id}" aria-pressed="${on}">
          <span class="t">${c.label}</span><span class="n">${n ? `${n} ${n === 1 ? 'livro' : 'livros'}` : 'para preencher'}</span></button>`;
      }).join('')}
    </div>

    ${banner}

    <div class="section-line"><h2>${filterLabel}</h2><span>${list.length} ${list.length === 1 ? 'livro' : 'livros'}</span></div>
    ${body}`;
}

function renderNav() {
  const item = (view, label) => `<button class="nav-item" data-action="nav" data-value="${view}" ${state.view === view ? 'aria-current="page"' : ''}>${label}<span class="dot"></span></button>`;
  return `<nav class="nav" aria-label="Navegação"><div class="nav-inner">
    ${item('shelf', 'Minha Estante')}
    ${item('library', 'Library')}
    <button class="nav-item" disabled>Séries<span class="soon">em breve</span></button>
    <button class="nav-item" disabled>Stats<span class="soon">em breve</span></button>
  </div></nav>`;
}

/* ---------------- Minha Estante ---------------- */
const DEFAULT_GOAL = 50;
const SHELF_STYLES = [
  { id: 'classica', label: 'Clássica' },
  { id: 'flutuante', label: 'Flutuante' },
  { id: 'luzinhas', label: 'Luzinhas' },
];
const DARK_THEMES = ['noite', 'lua', 'famiglia', 'sombra'];
const meta = () => state.session?.user?.user_metadata || {};
const thisYear = () => new Date().getFullYear();
const bookYear = (b) => Number((b.finished_at || b.created_at || '').slice(0, 4)) || thisYear();
function goalFor(year) {
  const g = meta().goals?.[year];
  return Number.isFinite(g) && g > 0 ? g : DEFAULT_GOAL;
}
function shelfStyle() {
  const s = meta().shelfStyle;
  if (SHELF_STYLES.some((x) => x.id === s)) return s;
  const dark = DARK_THEMES.includes(state.theme) || (state.theme === 'editorial' && matchMedia('(prefers-color-scheme: dark)').matches);
  return dark ? 'luzinhas' : 'classica';
}
async function saveMeta(patch) {
  const before = { ...meta() };
  if (state.session?.user) state.session.user.user_metadata = { ...before, ...patch };
  render();
  const { error } = await sb.auth.updateUser({ data: patch });
  if (error) {
    state.session.user.user_metadata = before;
    render();
    toast('Não consegui salvar na sua conta. Tente de novo.', true);
    return false;
  }
  return true;
}

// Cor da lombada: a cor predominante da capa, calculada uma vez e guardada.
const SPINE_KEY = 'bo.spineColors';
let spineCache = {};
try { spineCache = JSON.parse(localStorage.getItem(SPINE_KEY) || '{}'); } catch { spineCache = {}; }
const spineInk = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150 ? '#2B2326' : '#F6EBDD';
};
function coverColor(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = 12; c.height = 18;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 12, 18);
        const d = ctx.getImageData(0, 0, 12, 18).data;
        let r = 0, g = 0, bl = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; bl += d[i + 2]; n++; }
        r /= n; g /= n; bl /= n;
        // Deixa a cor com cara de lombada: nem clara nem escura demais.
        const max = Math.max(r, g, bl);
        const k = max > 175 ? 175 / max : max < 45 ? 45 / Math.max(max, 1) : 1;
        const hex = '#' + [r, g, bl].map((x) => Math.round(Math.min(255, x * k)).toString(16).padStart(2, '0')).join('');
        resolve(hex);
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}
let paintingSpines = false;
async function paintSpines() {
  if (paintingSpines) return;
  paintingSpines = true;
  const els = [...document.querySelectorAll('.spine[data-cover]')].filter((el) => !spineCache[el.dataset.cover]);
  for (const el of els) {
    const url = el.dataset.cover;
    if (spineCache[url] === undefined) {
      const hex = await coverColor(url);
      spineCache[url] = hex || '';
      try { localStorage.setItem(SPINE_KEY, JSON.stringify(spineCache)); } catch { /* sem armazenamento */ }
    }
    const hex = spineCache[url];
    if (hex) document.querySelectorAll(`.spine[data-cover="${CSS.escape(url)}"]`).forEach((s) => { s.style.background = hex; s.style.color = spineInk(hex); });
  }
  paintingSpines = false;
}

const hashOf = (s) => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

// Livros que ela ainda não tinha visto na estante entram com animação.
const SEEN_KEY = 'bo.shelfSeen';
function seenSet() { try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); } catch { return new Set(); } }

function shelfItemsHTML(list, year, goal) {
  const seen = seenSet();
  const firstVisit = seen.size === 0;
  const parts = [];
  list.forEach((b, i) => {
    const title = cleanTitle(b.title);
    const h = hashOf(b.id + title);
    // Livro que ela ainda não viu na estante fica escondido até a animação de chegada.
    const isNew = !firstVisit && !seen.has(b.id);
    const cls = isNew ? ' pending' : '';
    if (b.sparkles) {
      parts.push(`<div class="slot${cls}" data-id="${b.id}"><button class="face" data-action="open" data-id="${b.id}" style="--tilt:${(h % 3) - 1}deg" aria-label="${esc(title)}, favorito">
        ${coverHTML(b)}<span class="face-spark" aria-hidden="true">${ic.sparkle}</span></button></div>`);
    } else {
      const w = Math.max(17, Math.min(34, Math.round(12 + (b.pages || 380) / 46)));
      const hh = 88 + (h % 30);
      const lean = i > 0 && h % 5 === 0;
      const cached = b.cover_url && spineCache[b.cover_url];
      const bg = cached || colorFor(title);
      parts.push(`<div class="slot${cls}${lean ? ' lean' : ''}" data-id="${b.id}" style="--lean:${-(5 + (h % 4))}deg">
        <button class="spine" data-action="open" data-id="${b.id}" ${b.cover_url && !cached ? `data-cover="${esc(b.cover_url)}"` : ''}
          style="width:${w}px;height:${hh}px;background:${bg};color:${spineInk(bg)}" aria-label="${esc(title)}">
          <span>${esc(title)}</span></button></div>`);
    }
    if (i === 8) parts.push('<div class="slot deco" aria-hidden="true"><svg width="46" height="78" viewBox="0 0 46 78"><path d="M23 46C22 34 14 26 6 24c3 9 9 16 17 22z" fill="#6F8A5E"/><path d="M23 46c1-13 8-22 17-25-2 10-8 18-17 25z" fill="#7F9C6B"/><path d="M23 46c-2-14 0-26 4-36 4 11 3 23-4 36z" fill="#5E7A50"/><path d="M10 46h26l-3 30H13z" fill="#C46F4E"/><rect x="8" y="44" width="30" height="5" rx="1.5" fill="#A65A3D"/></svg></div>');
    if (i === 20) parts.push('<div class="slot deco" aria-hidden="true"><svg width="30" height="70" viewBox="0 0 30 70"><ellipse cx="15" cy="14" rx="7" ry="9" fill="#FFD98A" opacity="0.35"/><path d="M15 6c3 4 3 8 0 10-3-2-3-6 0-10z" fill="#F2A93B"/><rect x="14.4" y="15" width="1.2" height="5" fill="#3A2E29"/><rect x="7" y="20" width="16" height="44" rx="2" fill="#F4EBDD"/><rect x="4" y="63" width="22" height="5" rx="2" fill="#A65A3D"/></svg></div>');
  });
  if (list.length) parts.push('<div class="slot deco" aria-hidden="true"><svg width="22" height="64" viewBox="0 0 22 64"><path d="M2 64V16c0-8 6-14 14-14h4v62z" fill="var(--bookend)"/></svg></div>');
  if (year === thisYear()) {
    for (let k = 0; k < Math.max(0, goal - list.length); k++) parts.push(`<div class="slot" aria-hidden="true"><i class="ghost" style="height:${92 + ((k * 7) % 18)}px"></i></div>`);
  }
  return parts.join('');
}

function renderShelf() {
  const lidos = state.books.filter((b) => b.status === 'lido');
  const years = [...new Set([thisYear(), ...lidos.map(bookYear)])].sort((a, b) => b - a);
  const year = years.includes(state.shelfYear) ? state.shelfYear : thisYear();
  const list = lidos.filter((b) => bookYear(b) === year)
    .sort((a, b) => (a.finished_at || a.created_at || '').localeCompare(b.finished_at || b.created_at || ''));
  const isCurrent = year === thisYear();
  const goal = goalFor(year);
  const n = list.length;
  const pct = Math.min(100, Math.round((n / goal) * 100));
  const style = shelfStyle();
  const ge = state.goalEdit;

  const summary = !isCurrent
    ? `<span><b>${n} ${n === 1 ? 'livro lido' : 'livros lidos'}</b> em ${year}</span>`
    : n >= goal
      ? `<span><b>Meta batida! 🎉</b> ${n} lidos · meta de ${goal}</span>`
      : `<span><b>${n} ${n === 1 ? 'lido' : 'lidos'}</b> · faltam ${goal - n} para a meta de ${goal}</span>`;

  return `
  <div class="page shelf-page">
    <header class="shelf-head">
      <span class="eyebrow">Minha Estante</span>
      <div class="shelf-title-row">
        <h1 class="disp">${year}</h1>
        ${years.length > 1 ? `<div class="year-chips" role="group" aria-label="Ano">
          ${years.map((y) => `<button class="chip" data-action="shelf-year" data-value="${y}" aria-pressed="${y === year}">${y}</button>`).join('')}
        </div>` : ''}
      </div>
      <div class="shelf-progress">
        <div class="shelf-sum">${summary}
          ${isCurrent && !ge ? '<button class="linkbtn small" data-action="goal-edit">Editar meta</button>' : ''}</div>
        ${isCurrent ? `<div class="bar" role="img" aria-label="${pct}% da meta"><div style="width:${pct}%"></div></div>` : ''}
      </div>
      ${ge ? `
      <form id="goalForm" class="goal-edit" novalidate>
        <span class="label">Meta de ${year}</span>
        <div class="stepper">
          <button type="button" class="iconbtn step" data-action="goal-step" data-value="-1" aria-label="Diminuir meta">–</button>
          <input id="goalInput" type="number" inputmode="numeric" min="1" max="999" value="${ge.value}" aria-label="Meta de livros">
          <button type="button" class="iconbtn step" data-action="goal-step" data-value="1" aria-label="Aumentar meta">+</button>
        </div>
        <div class="goal-actions">
          <button type="button" class="btn small" data-action="goal-cancel">Cancelar</button>
          <button type="submit" class="btn small primary">Salvar</button>
        </div>
      </form>` : ''}
      <div class="segmented small" role="group" aria-label="Estilo da estante">
        ${SHELF_STYLES.map((s) => `<button data-action="shelf-style" data-value="${s.id}" aria-pressed="${style === s.id}">${s.label}</button>`).join('')}
      </div>
    </header>

    ${!state.loaded ? '<div class="empty">Arrumando sua estante…</div>' : `
    <section class="bookcase bc-${style}" aria-label="Estante de ${year}">
      <div class="shelves">${shelfItemsHTML(list, year, goal)}</div>
    </section>
    ${!n ? `<p class="hint center">Quando um livro for marcado como Lido, ele aparece aqui.</p>` : '<p class="hint center">Favoritos ficam de frente · toque num livro para abrir a ficha</p>'}`}
  </div>`;
}

function markShelfSeen(ids = state.books.filter((b) => b.status === 'lido').map((b) => b.id)) {
  const all = seenSet();
  ids.forEach((id) => all.add(id));
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...all])); } catch { /* sem armazenamento */ }
}

/* ---------------- chegada de livros novos na estante ---------------- */
let arrival = null; // { skip: false } enquanto a animação roda
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollToSlot(slot) {
  const r = slot.getBoundingClientRect();
  const top = window.scrollY + r.top - (window.innerHeight - r.height) / 2;
  window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion() ? 'auto' : 'smooth' });
}

function revealSlot(slot, cls = 'landed') {
  slot.classList.remove('pending');
  slot.classList.add(cls);
  markShelfSeen([slot.dataset.id]);
  setTimeout(() => slot.classList.remove(cls), 1400);
}

function confetti() {
  const colors = ['#F5C542', '#D7263D', '#8C5A6A', '#7FD1C7', '#B9A4E8', '#F2B01E', '#3E9142'];
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.width = `${6 + Math.random() * 6}px`;
    p.style.height = `${8 + Math.random() * 8}px`;
    layer.appendChild(p);
    p.animate([
      { transform: `translate(0, -20px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 160}px, ${window.innerHeight + 40}px) rotate(${Math.random() * 720}deg)`, opacity: 0.9 },
    ], { duration: 1800 + Math.random() * 1200, delay: Math.random() * 400, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 3600);
}

// Livros novos: capa grande no centro → a página desce sozinha → o livro voa até a vaga.
async function playArrivals() {
  if (arrival || state.sheet || state.view !== 'shelf') return;
  const pendingIds = [...document.querySelectorAll('.slot.pending')].map((s) => s.dataset.id);
  if (!pendingIds.length) return;
  arrival = { skip: false };
  const year = state.shelfYear && state.shelfYear !== thisYear() ? state.shelfYear : thisYear();
  const goal = goalFor(year);
  const lidosNoAno = state.books.filter((b) => b.status === 'lido' && bookYear(b) === year).length;
  const metaAgora = year === thisYear() && lidosNoAno >= goal && lidosNoAno - pendingIds.length < goal;

  const slotOf = (id) => document.querySelector(`.slot[data-id="${CSS.escape(id)}"]`);

  // Quem prefere menos movimento: só rola até o livro e destaca.
  if (reducedMotion()) {
    for (const id of pendingIds) { const s = slotOf(id); if (s) { scrollToSlot(s); revealSlot(s, 'highlight'); await wait(700); } }
    arrival = null;
    if (metaAgora) toast(`Meta batida! 🎉 ${lidosNoAno} livros em ${year}`);
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'arrival';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Livro terminado');
  overlay.innerHTML = '<div class="arrival-card"><span class="eyebrow">Livro terminado!</span><div class="arrival-cover"></div><h2 class="disp arrival-title"></h2><p class="arrival-count"></p><span class="arrival-skip">toque para pular</span></div>';
  document.body.appendChild(overlay);
  const skipAll = () => { arrival.skip = true; };
  overlay.addEventListener('click', skipAll);

  let count = lidosNoAno - pendingIds.length;
  for (let i = 0; i < pendingIds.length; i++) {
    const id = pendingIds[i];
    const b = byId(id);
    const slot0 = slotOf(id);
    if (!b || !slot0) continue;
    if (arrival.skip) { revealSlot(slot0); continue; }
    count++;

    // 1. Capa grande no centro.
    overlay.querySelector('.arrival-cover').innerHTML = coverHTML(b, 'lg');
    overlay.querySelector('.arrival-title').textContent = cleanTitle(b.title);
    overlay.querySelector('.arrival-count').textContent = year !== thisYear()
      ? `${count}º livro de ${year}`
      : count > goal ? `${count} livros em ${year} · meta batida` : `${count} de ${goal} em ${year}`;
    overlay.classList.remove('flying');
    overlay.classList.add('show');
    await wait(i === 0 ? 1400 : 900);
    if (arrival.skip) { revealSlot(slot0); continue; }

    // 2. A página desce até a vaga.
    overlay.classList.add('flying');
    scrollToSlot(slot0);
    await wait(750);
    const slot = slotOf(id) || slot0;
    if (arrival.skip) { revealSlot(slot); continue; }

    // 3. A capa voa e pousa na prateleira.
    const from = overlay.querySelector('.arrival-cover .cover').getBoundingClientRect();
    const target = (slot.querySelector('.spine, .face') || slot).getBoundingClientRect();
    const flyer = overlay.querySelector('.arrival-cover .cover').cloneNode(true);
    flyer.classList.add('flyer');
    Object.assign(flyer.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, transformOrigin: 'top left' });
    document.body.appendChild(flyer);
    overlay.querySelector('.arrival-cover').style.visibility = 'hidden';
    const sx = target.width / from.width;
    const sy = target.height / from.height;
    const dx = target.left - from.left;
    const dy = target.top - from.top;
    await flyer.animate([
      { transform: 'translate(0,0) scale(1,1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 60}px) scale(${(1 + sx) / 2}, ${(1 + sy) / 2}) rotate(-8deg)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6 },
    ], { duration: 750, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }).finished.catch(() => {});
    flyer.remove();
    overlay.querySelector('.arrival-cover').style.visibility = '';
    revealSlot(slot);
    overlay.classList.remove('show');
    await wait(550);
  }

  // Pulou: mostra todos de uma vez, já no lugar.
  if (arrival.skip) {
    document.querySelectorAll('.slot.pending').forEach((s) => revealSlot(s));
    const last = slotOf(pendingIds[pendingIds.length - 1]);
    if (last) scrollToSlot(last);
  }
  overlay.remove();
  document.querySelectorAll('.flyer').forEach((f) => f.remove());
  arrival = null;

  if (metaAgora) {
    confetti();
    toast(`Meta batida! 🎉 ${lidosNoAno} livros em ${year}`);
  }
}

// Leva para a estante no ano do livro; a animação começa sozinha.
function goToShelf(b) {
  state.sheet = null;
  state.view = 'shelf';
  state.shelfYear = bookYear(b);
  state.goalEdit = null;
  try { localStorage.setItem('bo.view', 'shelf'); } catch { /* sem armazenamento */ }
  window.scrollTo(0, 0);
  render();
}

/* ---------------- render: ficha ---------------- */
// Duas notas independentes: estrelas (rating) e brilhos (sparkles), de 1 a 5 cada.
function ratingHTML(b) {
  const row = (field, cls, icon, um, varios) => {
    const v = b[field] || 0;
    return `<div class="rating ${cls}" role="group" aria-label="${varios}">${[1, 2, 3, 4, 5].map((i) =>
      `<button data-action="rate" data-field="${field}" data-value="${i}" class="${v >= i ? 'on' : 'off'}" aria-label="${i} ${i === 1 ? um : varios}" aria-pressed="${v === i}">${icon}</button>`).join('')}</div>`;
  };
  return row('rating', 'is-star', ic.star, 'estrela', 'estrelas') + row('sparkles', 'is-sparkle', ic.sparkle, 'brilho', 'brilhos');
}

function spicyHTML(b) {
  const s = b.spicy || 0;
  return `<div class="spicy">${[1, 2, 3, 4, 5].map((i) => `<button data-action="spicy" data-value="${i}" class="${s >= i ? 'on' : 'off'}" aria-label="Spicy ${i} de 5">${s >= i ? ic.pepperOn : ic.pepperOff}</button>`).join('')}</div>`;
}

function chipList(b, field, placeholder) {
  const items = b[field] || [];
  return `<div class="chips">
    ${items.map((t, i) => `<span class="chip">${esc(t)}<button class="x" data-action="chip-del" data-field="${field}" data-index="${i}" aria-label="Remover ${esc(t)}">×</button></span>`).join('')}
    <input class="chip-input" data-chip="${field}" placeholder="${placeholder}" aria-label="${placeholder}" enterkeyhint="done">
  </div>`;
}

function renderBook(b) {
  const pct = b.pages ? Math.min(100, Math.round(((b.current_page || 0) / b.pages) * 100)) : 0;
  const confirming = state.sheet.confirmDelete;
  return `
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(cleanTitle(b.title))}"><div class="sheet-inner">
    <div class="sheet-top">
      <button class="iconbtn back" data-action="close" aria-label="Voltar para a Library">${ic.back}</button>
      <span class="eyebrow">${esc(STATUSES.find((s) => s.id === b.status)?.one || '')}${b.status === 'lido' && b.finished_at ? ' · ' + fmtDate(b.finished_at) : ''}</span>
    </div>

    <div class="hero">
      ${coverHTML(b, 'lg')}
      ${coverSource(b) ? `<span class="cover-src">${coverSource(b)}</span>` : ''}
      <div class="covertools">
        <button class="linkbtn" data-action="cover">${b.cover_url ? 'Trocar capa' : 'Buscar capa'}</button>
        <label class="linkbtn" for="coverFile" role="button" tabindex="0">${state.sheet.uploading ? 'Enviando…' : 'Enviar foto'}</label>
        <input id="coverFile" type="file" accept="image/*" hidden>
        ${b.cover_url ? '<button class="linkbtn" data-action="cover-remove">Usar tipográfica</button>' : ''}
      </div>
      <h1>${esc(cleanTitle(b.title))}</h1>
      <span class="by">${esc(b.author || 'Autora desconhecida')}${b.series ? ` · ${esc(b.series)}${b.series_position ? ', ' + esc(b.series_position) : ''}` : ''}</span>
    </div>

    ${b.status === 'lendo' ? `
    <div class="progress">
      <div class="nums"><span class="pct">${pct}%</span><span class="pg">${b.current_page || 0} / ${b.pages || '?'}</span></div>
      <div class="bar"><div style="width:${pct}%"></div></div>
    </div>` : ''}

    <div class="stats3">
      <div><span class="label">Rating</span>${ratingHTML(b)}</div>
      <div><span class="label">Obsession</span>
        ${ddHTML('obsession', b.obsession, [...OBSESSION, { id: '', label: 'Sem nível' }], { cls: 'dd-obs', label: 'Obsession level' })}</div>
      <div><span class="label">Spicy</span>${spicyHTML(b)}</div>
    </div>

    <div class="marked">
      <label for="why">Por que isso me marcou?</label>
      <textarea id="why" data-field="why_it_marked" rows="2" placeholder="Em uma frase, o que esse livro fez com você">${esc(b.why_it_marked || '')}</textarea>
    </div>

    <div class="rows">
      <div class="row"><label for="f-title">Título</label><div class="ctrl"><input id="f-title" type="text" data-field="title" value="${esc(b.title)}" autocomplete="off"></div></div>
      <div class="row"><label for="f-author">Autora</label><div class="ctrl"><input id="f-author" type="text" data-field="author" value="${esc(b.author || '')}" autocomplete="off"></div></div>
      <div class="row"><span class="label-plain">Status</span><div class="ctrl">
        ${ddHTML('status', b.status, STATUSES.map((s) => ({ id: s.id, label: s.one })), { cls: 'dd-right', label: 'Status' })}</div></div>
      ${b.status === 'lendo' ? `<div class="row"><label for="f-cur">Página atual</label><div class="ctrl"><input id="f-cur" class="num" type="number" inputmode="numeric" min="0" data-field="current_page" value="${b.current_page ?? ''}"></div></div>` : ''}
      <div class="row"><label for="f-pages">Páginas</label><div class="ctrl"><input id="f-pages" class="num" type="number" inputmode="numeric" min="0" data-field="pages" value="${b.pages ?? ''}"></div></div>
      ${b.status === 'lido' ? `<div class="row"><label for="f-fim">Terminei em</label><div class="ctrl"><input id="f-fim" type="date" data-field="finished_at" value="${b.finished_at || ''}"></div></div>` : ''}
      <div class="row"><span class="label-plain">Idioma</span><div class="ctrl">
        ${ddHTML('language', b.language, LANGUAGES, { placeholder: '—', cls: 'dd-right', label: 'Idioma' })}</div></div>
      <div class="row"><label for="f-series">Série</label><div class="ctrl"><input id="f-series" type="text" data-field="series" placeholder="nome da série" value="${esc(b.series || '')}"></div></div>
      <div class="row"><label for="f-pos">Livro nº</label><div class="ctrl"><input id="f-pos" class="num" type="number" inputmode="decimal" step="0.5" min="0" data-field="series_position" value="${b.series_position ?? ''}"></div></div>
      <div class="row stack"><span class="label-plain label">Gênero</span>
        <div class="chips">${GENRES.map((g) => `<button class="chip" data-action="genre" data-value="${esc(g)}" aria-pressed="${(b.genres || []).includes(g)}">${g}</button>`).join('')}</div></div>
      <div class="row stack"><span class="label">Tropes</span>${chipList(b, 'tropes', '+ trope')}</div>
      <div class="row stack"><span class="label">Personagens</span>${chipList(b, 'characters', '+ personagem')}</div>
      <div class="row stack"><span class="label">Book boyfriends</span>${chipList(b, 'book_boyfriends', '+ book boyfriend')}</div>
      <label class="switch" for="f-reler">Quero reler<input id="f-reler" type="checkbox" data-field="want_reread" ${b.want_reread ? 'checked' : ''}></label>
      <label class="switch" for="f-nao">Não indicaria<input id="f-nao" type="checkbox" data-field="wouldnt_recommend" ${b.wouldnt_recommend ? 'checked' : ''}></label>
    </div>

    <div class="danger-zone">
      ${confirming
        ? `<div class="confirm"><span>Excluir este livro de vez?</span>
             <button class="btn small" data-action="delete-cancel">Cancelar</button>
             <button class="btn small dark" data-action="delete-yes">Excluir</button></div>`
        : '<button class="linkbtn" data-action="delete">Excluir livro</button>'}
    </div>
  </div></div>`;
}

/* ---------------- render: adicionar ---------------- */
function renderAdd() {
  const s = state.sheet;
  const results = (s.results || []).filter((r) => !s.lang || r.language === s.lang);
  const picked = s.picked;
  return `
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Adicionar livro"><div class="sheet-inner">
    <div class="sheet-top">
      <button class="iconbtn back" data-action="close" aria-label="Fechar">${ic.back}</button>
      <span class="eyebrow">Google Books · Open Library</span>
    </div>
    <h2 class="sheet-title">Adicionar livro</h2>

    ${s.manual ? `
      <form id="manualForm" class="picked" novalidate>
        <div class="field"><label for="m-title">Título</label><input class="input" id="m-title" name="title" required value="${esc(s.mTitle || '')}"></div>
        <div class="field"><label for="m-author">Autora</label><input class="input" id="m-author" name="author" value="${esc(s.mAuthor || '')}"></div>
        <div class="field"><label for="m-pages">Páginas</label><input class="input" id="m-pages" name="pages" type="number" inputmode="numeric" min="0" value="${esc(s.mPages || '')}"></div>
        <div class="field"><span class="label">Status</span>${ddHTML('m-status', s.mStatus || 'tbr', STATUSES.map((x) => ({ id: x.id, label: x.one })), { cls: 'dd-field', label: 'Status' })}</div>
        <button class="btn primary" type="submit">Adicionar à Library</button>
      </form>
      <button class="linkbtn" data-action="manual-off">Voltar para a busca</button>
    ` : `
    <div class="segmented" role="group" aria-label="Buscar por">
      <button data-action="search-mode" data-value="title" aria-pressed="${s.mode !== 'author'}">Título</button>
      <button data-action="search-mode" data-value="author" aria-pressed="${s.mode === 'author'}">Autora</button>
    </div>
    <label class="search" for="gq">${ic.search}
      <input id="gq" type="search" placeholder="${s.mode === 'author' ? 'Nome da autora, ex.: Elsie Silver' : 'Título do livro'}" value="${esc(s.q || '')}" autocomplete="off" enterkeyhint="search">
    </label>
    <div class="lang-filter">
      ${[['', 'Todos'], ['pt', 'Português'], ['en', 'Inglês']].map(([v, l]) => `<button class="chip" data-action="lang" data-value="${v}" aria-pressed="${(s.lang || '') === v}">${l}</button>`).join('')}
    </div>

    ${picked ? `
      <div class="picked">
        <div style="display:flex;gap:14px;align-items:flex-start">
          ${coverHTML({ title: picked.title, author: picked.author, cover_url: picked.cover }, 'sm')}
          <div style="display:flex;flex-direction:column;gap:3px;min-width:0">
            <span class="serif" style="font-weight:600;font-size:20px;line-height:1.1">${esc(picked.title)}</span>
            <span class="hint">${esc(picked.author)}${picked.pages ? ` · ${picked.pages} págs.` : ''}</span>
            ${picked.cover ? `<span class="cover-src">Capa: ${resultSource(picked)}</span>` : ''}
          </div>
        </div>
        <div class="field"><span class="label">Entra como</span>${ddHTML('p-status', s.pStatus || 'tbr', STATUSES.map((x) => ({ id: x.id, label: x.one })), { cls: 'dd-field', label: 'Entra como' })}</div>
        <button class="btn primary" data-action="add-confirm">Adicionar à Library</button>
      </div>` : ''}

    <div class="results">
      ${s.loading ? '<p class="hint">Buscando…</p>' : ''}
      ${s.error ? `<p class="hint">${esc(s.error)}</p>` : ''}
      ${!s.loading && s.q && s.results && !results.length ? '<p class="hint">Nenhuma edição encontrada com esse filtro.</p>' : ''}
      ${results.map((r) => `
        <button class="result" data-action="pick" data-gid="${esc(r.gid)}" aria-pressed="${picked?.gid === r.gid}">
          ${coverHTML({ title: r.title, author: r.author, cover_url: r.cover }, 'sm')}
          <span class="info">
            <span class="rt">${esc(r.title)}</span>
            <span class="ra">${esc(r.author || 'Autora desconhecida')}</span>
            <span class="rm">${[r.language === 'pt' ? 'Português' : r.language === 'en' ? 'Inglês' : '', r.pages ? `${r.pages} págs.` : '', r.year].filter(Boolean).join(' · ')}</span>
            <span class="cover-src">${r.cover ? 'Capa: ' : 'Sem capa · '}${resultSource(r)}</span>
          </span>
        </button>`).join('')}
    </div>
    <button class="linkbtn" data-action="manual-on">Não achei, quero adicionar à mão</button>
    `}
  </div></div>`;
}

/* ---------------- render: trocar capa ---------------- */
function renderCover(b) {
  const s = state.sheet;
  const opts = (s.results || []).filter((r) => r.cover);
  return `
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Escolher capa"><div class="sheet-inner">
    <div class="sheet-top">
      <button class="iconbtn back" data-action="back-to-book" aria-label="Voltar para a ficha">${ic.back}</button>
      <span class="eyebrow">Escolher capa</span>
    </div>
    <h2 class="sheet-title">${esc(cleanTitle(b.title))}</h2>
    <div class="segmented" role="group" aria-label="Buscar capa por">
      <button data-action="cover-mode" data-value="title" aria-pressed="${s.mode !== 'author'}">Título</button>
      <button data-action="cover-mode" data-value="author" aria-pressed="${s.mode === 'author'}">Autora</button>
    </div>
    <label class="search" for="cq">${ic.search}
      <input id="cq" type="search" value="${esc(s.q || '')}" placeholder="${s.mode === 'author' ? 'Nome da autora' : 'Buscar outra edição'}" autocomplete="off" enterkeyhint="search">
    </label>
    ${s.loading ? '<p class="hint">Buscando edições…</p>' : ''}
    ${s.error ? `<p class="hint">${esc(s.error)}</p>` : ''}
    ${!s.loading && !s.error && !opts.length ? '<p class="hint">Nenhuma capa encontrada. Tente buscar pelo título em inglês ou pelo nome da autora.</p>' : ''}
    <div class="covergrid">
      ${opts.map((r) => `<button data-action="cover-pick" data-gid="${esc(r.gid)}" aria-pressed="${b.google_books_id === r.gid}" aria-label="${esc(r.title)} ${r.year || ''}">
        <img src="${esc(r.cover)}" alt="" loading="lazy" referrerpolicy="no-referrer">
        ${s.mode === 'author' ? `<span class="cover-caption">${esc(r.title)}</span>` : ''}
        <span class="cover-src">${resultSource(r)}</span></button>`).join('')}
    </div>
  </div></div>`;
}

/* ---------------- render: temas ---------------- */
function renderThemes() {
  return `
  <div class="sheet" role="dialog" aria-modal="true" aria-label="Temas"><div class="sheet-inner">
    <div class="sheet-top">
      <button class="iconbtn back" data-action="close" aria-label="Voltar para a Library">${ic.back}</button>
      <span class="eyebrow">Fica salvo na sua conta</span>
    </div>
    <h2 class="sheet-title">Temas</h2>
    <div class="theme-list">
      ${THEMES.map((t) => {
        ensureFont(t);
        const on = state.theme === t.id;
        return `<button class="theme-card" data-action="theme-pick" data-value="${t.id}" aria-pressed="${on}" style="background:${t.bg};color:${t.ink}">
          <span class="tc-title" style="font-family:${t.font};font-style:${t.style};font-weight:${t.weight};${t.caps ? 'text-transform:uppercase;letter-spacing:1px;' : ''}">Library</span>
          <span class="tc-spines" aria-hidden="true">${t.spines.map((c) => `<i style="background:${c}"></i>`).join('')}<b style="background:${t.accent}"></b></span>
          <span class="tc-name">${t.name}</span>
          <span class="tc-note" style="color:${t.meta}">${t.note}</span>
          ${on ? `<span class="tc-check" style="background:${t.accent};color:${t.bg}">${ic.check}</span>` : ''}
        </button>`;
      }).join('')}
    </div>
  </div></div>`;
}

/* ---------------- render principal ---------------- */
let lastSheetKey = '';
function render() {
  if (state.recovery) {
    // Não apaga a senha que está sendo digitada se outra parte do app pedir um redesenho.
    if (!document.getElementById('recoveryForm') || state.authMsg) renderRecovery();
    return;
  }
  if (!state.session) { renderAuth(); return; }
  const active = document.activeElement;
  const focusId = active?.id;
  const selStart = active?.selectionStart;
  const sheetScroll = document.querySelector('.sheet')?.scrollTop;

  let sheet = '';
  if (state.sheet?.kind === 'book') { const b = byId(state.sheet.id); sheet = b ? renderBook(b) : ''; }
  else if (state.sheet?.kind === 'add') sheet = renderAdd();
  else if (state.sheet?.kind === 'cover') { const b = byId(state.sheet.id); sheet = b ? renderCover(b) : ''; }
  else if (state.sheet?.kind === 'themes') sheet = renderThemes();

  const main = state.view === 'shelf' ? renderShelf() : renderLibrary();
  app.innerHTML = `<div class="shell" ${sheet ? 'aria-hidden="true"' : ''}>${main}</div>${renderNav()}${sheet}`;
  document.body.style.overflow = sheet ? 'hidden' : '';
  if (state.view === 'shelf' && state.loaded) {
    paintSpines();
    if (seenSet().size === 0) markShelfSeen(); // primeira visita: tudo já conta como visto
    else if (!sheet) setTimeout(playArrivals, 350);
  }
  // Se a tela mudou no meio da animação, os livros que faltavam aparecem direto.
  if (arrival && (state.sheet || state.view !== 'shelf')) arrival.skip = true;

  const sh = document.querySelector('.sheet');
  // A animação de entrada só roda quando uma tela nova abre, não a cada alteração.
  const sheetKey = state.sheet ? `${state.sheet.kind}:${state.sheet.id || ''}` : '';
  if (sh && sheetKey !== lastSheetKey) sh.classList.add('enter');
  lastSheetKey = sheetKey;
  if (sh && sheetScroll != null && state.sheet?.keepScroll) sh.scrollTop = sheetScroll;
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); try { if (selStart != null) el.setSelectionRange(selStart, selStart); } catch { /* campos sem seleção */ } }
  }
}

/* ---------------- ações ---------------- */
let searchTimer;
let libTimer;
async function runAddSearch(q) {
  const s = state.sheet;
  s.q = q;
  if (!q.trim()) { s.results = null; render(); return; }
  s.loading = true; s.error = null; render();
  try {
    s.results = s.mode === 'author' ? await searchByAuthor(q) : await searchBooks(q, { max: 30 });
  } catch (err) { s.error = searchErrorText(err); s.results = []; }
  if (state.sheet === s) { s.loading = false; render(); }
}
async function runCoverSearch(q) {
  const s = state.sheet;
  s.q = q; s.loading = true; s.error = null; render();
  if (s.mode === 'author') s.authorQ = q; else s.titleQ = q;
  if (!q.trim()) { s.loading = false; s.results = []; render(); return; }
  try {
    s.results = s.mode === 'author' ? await searchByAuthor(q) : await searchBooks(q, { max: 30 });
  } catch (err) { s.error = searchErrorText(err); s.results = []; }
  if (state.sheet === s) { s.loading = false; render(); }
}

// Grava um campo do livro com as regras automáticas de status.
function setField(b, field, v) {
  const before = { status: b.status, finished_at: b.finished_at, current_page: b.current_page };
  const patch = { [field]: v };
  const today = new Date().toISOString().slice(0, 10);
  const markedRead = field === 'status' && v === 'lido' && b.status !== 'lido';
  if (field === 'status' && v === 'lido' && !b.finished_at) patch.finished_at = today;
  if (field === 'status' && v === 'lido' && b.pages) patch.current_page = b.pages;
  if (field === 'status' && v === 'lendo' && b.current_page == null) patch.current_page = 0;
  // Chegou na última página: o livro vira "Lido".
  const cur = field === 'current_page' ? v : b.current_page;
  const total = field === 'pages' ? v : b.pages;
  const finishedNow = b.status === 'lendo' && (field === 'current_page' || field === 'pages') && total && cur != null && cur >= total;
  if (finishedNow) {
    patch.status = 'lido';
    patch.current_page = total;
    if (!b.finished_at) patch.finished_at = today;
  }
  if (state.sheet) state.sheet.keepScroll = true;
  updateBook(b.id, patch, { quiet: finishedNow || markedRead });
  if (finishedNow || markedRead) {
    toast('Livro terminado! Foi para Lidos.', false, () => {
      if (state.sheet) state.sheet.keepScroll = true;
      updateBook(b.id, before, { quiet: true });
    }, () => goToShelf(b));
  }
}

document.addEventListener('click', async (e) => {
  // Clique fora de um menu suspenso aberto fecha o menu.
  if (state.dd && !e.target.closest('.dd')) {
    state.dd = null;
    if (state.sheet) state.sheet.keepScroll = true;
    render();
  }
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  const sheet = state.sheet;
  const b = sheet?.id ? byId(sheet.id) : null;

  switch (a) {
    case 'dd-open': {
      const k = el.dataset.dd;
      state.dd = state.dd === k ? null : k;
      if (sheet) sheet.keepScroll = true;
      render();
      const menu = document.querySelector('.dd-menu');
      menu?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      menu?.querySelector('[aria-selected="true"], .dd-opt')?.focus({ preventScroll: true });
      break;
    }
    case 'dd-pick': {
      const k = el.dataset.dd;
      const v = el.dataset.value || null;
      state.dd = null;
      if (sheet) sheet.keepScroll = true;
      if (k === 'p-status') { sheet.pStatus = v; render(); break; }
      if (k === 'm-status') { sheet.mStatus = v; render(); break; }
      if (b && ['obsession', 'status', 'language'].includes(k)) setField(b, k, v);
      else render();
      break;
    }
    case 'toast-go': {
      const fn = toastGo;
      toastGo = null; toastUndo = null;
      toastEl.hidden = true;
      if (fn) fn();
      break;
    }
    case 'toast-undo': {
      const fn = toastUndo;
      toastUndo = null; toastGo = null;
      toastEl.hidden = true;
      if (fn) fn();
      break;
    }
    case 'themes':
      state.sheet = { kind: 'themes' }; render(); document.querySelector('.sheet')?.scrollTo(0, 0); break;
    case 'nav': {
      const v = el.dataset.value;
      if (state.view === v) { window.scrollTo({ top: 0, behavior: 'smooth' }); break; }
      state.view = v; state.goalEdit = null;
      try { localStorage.setItem('bo.view', v); } catch { /* sem armazenamento */ }
      render(); window.scrollTo(0, 0); break;
    }
    case 'shelf-year':
      state.shelfYear = Number(el.dataset.value); state.goalEdit = null; render(); break;
    case 'shelf-style':
      saveMeta({ shelfStyle: el.dataset.value }); break;
    case 'goal-edit':
      state.goalEdit = { value: goalFor(thisYear()) }; render(); document.getElementById('goalInput')?.focus(); break;
    case 'goal-cancel':
      state.goalEdit = null; render(); break;
    case 'goal-step': {
      const input = document.getElementById('goalInput');
      const cur = Number(input?.value) || goalFor(thisYear());
      const next = Math.max(1, Math.min(999, cur + Number(el.dataset.value)));
      if (input) input.value = next;
      state.goalEdit = { value: next };
      break;
    }
    case 'theme-pick':
      if (sheet) sheet.keepScroll = true;
      chooseTheme(el.dataset.value); break;
    case 'auth-mode': {
      const em = document.getElementById('email')?.value;
      if (em) state.authEmail = em.trim();
      state.authMode = el.dataset.value; state.authMsg = null; renderAuth(); break;
    }
    case 'logout':
      await sb.auth.signOut(); break;
    case 'status':
      state.query = ''; state.filter = { type: 'status', value: el.dataset.value }; render(); break;
    case 'collection': {
      const v = el.dataset.value;
      state.query = '';
      state.filter = state.filter.type === 'collection' && state.filter.value === v ? { type: 'status', value: 'lido' } : { type: 'collection', value: v };
      render(); break;
    }
    case 'fetch-covers': fetchMissingCovers(); break;
    case 'show-nocover':
      state.query = ''; state.filter = { type: 'nocover' }; render();
      document.querySelector('.section-line')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 'open':
      state.sheet = { kind: 'book', id: el.dataset.id }; render(); document.querySelector('.sheet')?.scrollTo(0, 0); break;
    case 'close':
      state.sheet = null; render(); break;
    case 'add':
      state.sheet = { kind: 'add', q: '', lang: '' }; render(); document.getElementById('gq')?.focus(); break;
    case 'search-mode': {
      const mode = el.dataset.value;
      if (sheet.mode === mode || (!sheet.mode && mode === 'title')) break;
      sheet.mode = mode; sheet.picked = null; sheet.results = null;
      render();
      document.getElementById('gq')?.focus();
      if (sheet.q?.trim()) runAddSearch(sheet.q);
      break;
    }
    case 'lang':
      sheet.lang = el.dataset.value; render(); break;
    case 'pick':
      sheet.picked = sheet.results.find((r) => r.gid === el.dataset.gid); sheet.keepScroll = true; render(); document.querySelector('.picked')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
    case 'add-confirm': {
      const p = sheet.picked;
      const status = sheet.pStatus || 'tbr';
      el.disabled = true;
      const row = await insertBook({ title: p.title, author: p.author || null, pages: p.pages, language: p.language, cover_url: p.cover, google_books_id: p.gid, status, current_page: status === 'lendo' ? 0 : null });
      if (row) {
        state.sheet = { kind: 'book', id: row.id }; toast('Adicionado à Library'); render();
        if (p.cover && await cacheCover(row.id, p.cover)) render();
      }
      else el.disabled = false;
      break;
    }
    case 'manual-on': sheet.manual = true; render(); document.getElementById('m-title')?.focus(); break;
    case 'manual-off': sheet.manual = false; render(); break;
    case 'rate': {
      // Estrelas e brilhos mudam cada um sozinho; tocar de novo na mesma nota limpa aquela linha.
      const f = el.dataset.field === 'sparkles' ? 'sparkles' : 'rating';
      const v = Number(el.dataset.value);
      sheet.keepScroll = true;
      updateBook(b.id, { [f]: b[f] === v ? null : v }); break;
    }
    case 'spicy': {
      const v = Number(el.dataset.value);
      sheet.keepScroll = true;
      updateBook(b.id, { spicy: b.spicy === v ? null : v }); break;
    }
    case 'genre': {
      const g = el.dataset.value;
      const set = new Set(b.genres || []);
      set.has(g) ? set.delete(g) : set.add(g);
      sheet.keepScroll = true;
      updateBook(b.id, { genres: [...set] }); break;
    }
    case 'chip-del': {
      const f = el.dataset.field;
      const arr = [...(b[f] || [])];
      arr.splice(Number(el.dataset.index), 1);
      sheet.keepScroll = true;
      updateBook(b.id, { [f]: arr }); break;
    }
    case 'cover': {
      const q = `${cleanTitle(b.title)} ${(b.author || '').split(',')[0]}`.trim();
      state.sheet = { kind: 'cover', id: b.id, q, mode: 'title', results: [] };
      runCoverSearch(q); break;
    }
    case 'cover-mode': {
      const mode = el.dataset.value;
      if ((sheet.mode || 'title') === mode) break;
      sheet.mode = mode;
      sheet.results = [];
      // Cada modo lembra a própria busca; na primeira vez, Autora começa com o nome da autora do livro.
      const q = mode === 'author'
        ? (sheet.authorQ ?? (b.author || '').split(',')[0].trim())
        : (sheet.titleQ ?? `${cleanTitle(b.title)} ${(b.author || '').split(',')[0]}`.trim());
      runCoverSearch(q); break;
    }
    case 'cover-pick': {
      const r = sheet.results.find((x) => x.gid === el.dataset.gid);
      const oldCover = b.cover_url;
      const oldSource = b.cover_source_url;
      b.cover_url = r.cover; b.google_books_id = r.gid; b.cover_source_url = r.cover;
      state.sheet = { kind: 'book', id: b.id }; render();
      // A função copia a imagem para o Storage e já grava o novo endereço no livro.
      if (await cacheCover(b.id, r.cover)) {
        await sb.from('books').update({ google_books_id: r.gid }).eq('id', b.id);
        toast('Capa trocada');
      } else {
        const { error } = await sb.from('books').update({ cover_url: r.cover, google_books_id: r.gid, cover_source_url: r.cover }).eq('id', b.id);
        if (error) { b.cover_url = oldCover; b.cover_source_url = oldSource; toast('Não consegui trocar a capa.', true); } else toast('Capa trocada');
      }
      render(); break;
    }
    case 'cover-remove':
      sheet.keepScroll = true;
      updateBook(b.id, { cover_url: null, google_books_id: null, cover_source_url: null }); break;
    case 'back-to-book':
      state.sheet = { kind: 'book', id: sheet.id }; render(); break;
    case 'delete': sheet.confirmDelete = true; sheet.keepScroll = true; render(); break;
    case 'delete-cancel': sheet.confirmDelete = false; sheet.keepScroll = true; render(); break;
    case 'delete-yes': deleteBook(b.id); break;
  }
});

document.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target.id === 'authForm') onAuthSubmit(e.target);
  if (e.target.id === 'recoveryForm') onRecoverySubmit(e.target);
  if (e.target.id === 'goalForm') {
    const v = Math.round(Number(document.getElementById('goalInput')?.value));
    if (!Number.isFinite(v) || v < 1) { toast('A meta precisa ser de pelo menos 1 livro.', true); return; }
    const goal = Math.min(999, v);
    state.goalEdit = null;
    const goals = { ...(meta().goals || {}), [thisYear()]: goal };
    if (await saveMeta({ goals })) toast(`Meta de ${thisYear()}: ${goal} livros`);
  }
  if (e.target.id === 'manualForm') {
    const f = e.target;
    const title = f.title.value.trim();
    if (!title) { toast('Escreva pelo menos o título.', true); return; }
    const status = state.sheet.mStatus || 'tbr';
    const row = await insertBook({ title, author: f.author.value.trim() || null, pages: f.pages.value ? Number(f.pages.value) : null, status, current_page: status === 'lendo' ? 0 : null });
    if (row) { state.sheet = { kind: 'book', id: row.id }; toast('Adicionado à Library'); render(); }
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'q') {
    state.query = t.value;
    clearTimeout(libTimer);
    libTimer = setTimeout(updateLibBody, 140);
    return;
  }
  if (t.id === 'gq') { clearTimeout(searchTimer); const v = t.value; state.sheet.q = v; searchTimer = setTimeout(() => runAddSearch(v), 450); return; }
  if (t.id === 'cq') { clearTimeout(searchTimer); const v = t.value; searchTimer = setTimeout(() => runCoverSearch(v), 450); return; }
  // Guarda o que foi digitado no cadastro manual, para não perder ao abrir o menu de status.
  if (t.form?.id === 'manualForm' && state.sheet) {
    const k = { title: 'mTitle', author: 'mAuthor', pages: 'mPages' }[t.name];
    if (k) state.sheet[k] = t.value;
    return;
  }
  if (t.id === 'why') {
    const b = byId(state.sheet.id);
    updateBook(b.id, { why_it_marked: t.value || null }, { rerender: false, quiet: true });
  }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.id === 'coverFile') {
    const file = t.files?.[0];
    const b = state.sheet?.id && byId(state.sheet.id);
    if (file && b) uploadOwnCover(b, file);
    t.value = '';
    return;
  }
  const field = t.dataset.field;
  if (!field || !state.sheet?.id || field === 'why_it_marked') return;
  const b = byId(state.sheet.id);
  let v;
  if (t.type === 'checkbox') v = t.checked;
  else if (t.type === 'number') v = t.value === '' ? null : Number(t.value);
  else v = t.value.trim() === '' ? null : t.value.trim();
  if (field === 'title' && !v) { toast('O título não pode ficar vazio.', true); t.value = b.title; return; }
  setField(b, field, v);
});

document.addEventListener('keydown', (e) => {
  const t = e.target;
  if (t.dataset?.chip && e.key === 'Enter') {
    e.preventDefault();
    const val = t.value.trim();
    if (!val) return;
    const b = byId(state.sheet.id);
    const f = t.dataset.chip;
    const arr = [...(b[f] || [])];
    if (!arr.includes(val)) arr.push(val);
    state.sheet.keepScroll = true;
    updateBook(b.id, { [f]: arr });
    setTimeout(() => document.querySelector(`[data-chip="${f}"]`)?.focus(), 0);
  }
  if (t.getAttribute?.('for') === 'coverFile' && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    document.getElementById('coverFile')?.click();
  }
  if (e.key === 'Escape' && state.dd) {
    state.dd = null;
    if (state.sheet) state.sheet.keepScroll = true;
    render();
    return;
  }
  if (e.key === 'Escape' && state.sheet) { state.sheet = null; render(); }
});

/* ---------------- atualização sem cache ---------------- */
// Quando eu publico uma versão nova, o app percebe e recarrega sozinho com os arquivos novos.
const APP_VERSION = '2026.10.23-4';
async function checkVersion() {
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { v } = await res.json();
    if (!v || v === APP_VERSION) return;
    // Evita recarregar em círculo se o navegador insistir na versão antiga.
    let tried = null;
    try { tried = sessionStorage.getItem('bo.reloadedFor'); sessionStorage.setItem('bo.reloadedFor', v); } catch { /* sem armazenamento */ }
    if (tried === v) return;
    if (state.sheet && document.activeElement?.matches?.('input, textarea')) return; // não interrompe quem está digitando
    location.replace(`${location.pathname}?v=${encodeURIComponent(v)}${location.hash}`);
  } catch { /* sem internet: segue com a versão atual */ }
}
if (new URLSearchParams(location.search).has('v')) history.replaceState(null, '', location.pathname + location.hash);
checkVersion();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkVersion(); });

/* ---------------- início ---------------- */
let savedTheme = 'editorial';
try { savedTheme = localStorage.getItem(THEME_KEY) || 'editorial'; } catch { /* sem armazenamento */ }
applyTheme(savedTheme);
try { if (localStorage.getItem('bo.view') === 'shelf') state.view = 'shelf'; } catch { /* sem armazenamento */ }

sb.auth.onAuthStateChange((event, session) => {
  const was = state.session?.user?.id;
  state.session = session;
  if (event === 'PASSWORD_RECOVERY') { state.recovery = true; state.authMsg = null; renderRecovery(); return; }
  if (!session) { state.books = []; state.loaded = false; state.sheet = null; renderAuth(); return; }
  // O tema salvo na conta vale em todos os aparelhos.
  const accountTheme = session.user.user_metadata?.theme;
  if (accountTheme && accountTheme !== state.theme) applyTheme(accountTheme);
  if (was !== session.user.id) { state.authMsg = null; render(); loadBooks(); }
});
