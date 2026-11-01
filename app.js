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
const COLLECTIONS = [
  { id: 'favoritos', label: 'Favoritos', cls: 'c-blush', test: (b) => (b.sparkles || 0) > 0 },
  { id: 'boyfriends', label: 'Book boyfriends', cls: 'c-sage', test: (b) => state.bbs.some((x) => x.book_id === b.id) },
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
  { id: 'bookish', name: 'Bookish', note: 'Creme, vermelho e clube do livro', bg: '#F6ECE2', ink: '#3B2422', accent: '#9E2A2B', meta: '#B5485A', font: "'Bagel Fat One', 'Cooper Black', serif", style: 'normal', weight: 400, caps: false, spines: ['#9E2A2B', '#F4C9CF', '#E8D3B8'] },
  { id: 'starlight', name: 'Starlight', note: 'Noite estrelada de cortes feéricas', bg: '#0F1430', ink: '#ECE9FB', accent: '#C9CCE8', meta: '#E7B7A5', font: "'Cinzel Decorative', Cinzel, Georgia, serif", style: 'normal', weight: 700, caps: false, spines: ['#3E3A6B', '#F2E6C9', '#E7B7A5'], fonts: 'Cinzel+Decorative:wght@700' },
  { id: 'dragonfire', name: 'Dragonfire', note: 'Fogo de dragão e escamas', bg: '#140E0C', ink: '#F3E6D6', accent: '#E8622C', meta: '#F07A3A', font: "'Grenze Gotisch', Georgia, serif", style: 'normal', weight: 700, caps: false, spines: ['#5A2A18', '#E8622C', '#F0B04A'], fonts: 'Grenze+Gotisch:wght@600;700' },
];
const THEME_KEY = 'bo.theme';
// Temas antigos (Editorial, Noite Estrelada…) passam a ser o Bookish.
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
  if (t.id === 'bookish') delete document.documentElement.dataset.theme;
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

// Estrelinha de quatro pontas do Bookish, ao lado dos títulos principais.
const SPARK4 = '<svg class="spark4" width="14" height="20" viewBox="0 0 16 22" aria-hidden="true"><path d="M8 0l1.4 8.6L16 11l-6.6 2.4L8 22l-1.4-8.6L0 11l6.6-2.4z" fill="currentColor"/></svg>';
const titleHTML = (text, tag = 'h1') => (state.theme === 'bookish'
  ? `<${tag} class="disp with-sparks">${SPARK4}<span>${text}</span>${SPARK4}</${tag}>`
  : `<${tag} class="disp">${text}</${tag}>`);

const DRAGON = '<path d="M0 12c3-.6 5 .2 6.6 1.6C7.6 9.8 10 6.4 14.2 5.4c-1.4 2.2-1.6 4-.8 5.6 2.6-2.6 6-3.4 9.6-2.6-2.6 1-4.2 2.6-5 5.2 1.8.1 3.4.9 4.4 2.6-2.6-.9-5-.8-6.8.8l-1.6 2.6-1.8-1.8c-2.6.8-5 .7-6.8-.8-1.8.8-4.2.9-6-.1z"/>';
// Enfeites do topo de cada tema.
function ornamentHTML() {
  switch (state.theme) {
    case 'starlight': return `<svg class="orn-sky" width="200" height="150" viewBox="0 0 200 150" aria-hidden="true">
        <path d="M128 22l2.6 9.4 9.4 2.6-9.4 2.6-2.6 9.4-2.6-9.4-9.4-2.6 9.4-2.6z" fill="#F2E6C9"/>
        <path d="M72 6l1.6 5.8 5.8 1.6-5.8 1.6-1.6 5.8-1.6-5.8-5.8-1.6 5.8-1.6z" fill="#C9CCE8"/>
        <path d="M172 78l1.4 5 5 1.4-5 1.4-1.4 5-1.4-5-5-1.4 5-1.4z" fill="#E7B7A5"/>
        <path d="M72 13 L128 32 L172 85" stroke="#C9CCE8" stroke-opacity="0.35" stroke-width="0.8" fill="none" stroke-dasharray="2 3"/>
        <circle cx="20" cy="10" r="1.2" fill="#ECE9FB"/><circle cx="190" cy="14" r="1" fill="#ECE9FB"/><circle cx="42" cy="50" r=".9" fill="#ECE9FB"/>
        <circle cx="106" cy="74" r="1.1" fill="#F2E6C9"/><circle cx="154" cy="126" r=".9" fill="#ECE9FB"/></svg>`;
    case 'dragonfire': return `<div class="orn-glow" aria-hidden="true"></div><svg class="orn-sky" width="200" height="150" viewBox="0 0 200 150" aria-hidden="true">
        <g fill="#F0B04A" transform="translate(110 14) scale(1.3)">${DRAGON}</g>
        <g fill="#E8622C" opacity=".8" transform="translate(76 64) scale(-.8 .8)">${DRAGON}</g>
        <circle cx="178" cy="86" r="1.6" fill="#F0B04A"/><circle cx="158" cy="110" r="1.1" fill="#E8622C"/>
        <circle cx="194" cy="60" r="1" fill="#F07A3A"/><circle cx="128" cy="96" r=".9" fill="#F0B04A"/><circle cx="40" cy="30" r="1.1" fill="#E8622C"/></svg>`;
    default: return '';
  }
}

/* ---------------- etiquetas ---------------- */
const TAG_ICONS = {
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  castle: 'M4 21V10h3V7h2v3h2V5l1-2 1 2v5h2V7h2v3h3v11zM10 21v-4a2 2 0 0 1 4 0v4',
  moon: 'M15 4a7 7 0 1 0 5 11 6 6 0 0 1-5-11zM19 3l.6 1.6L21 5l-1.4.4L19 7l-.6-1.6L17 5l1.4-.4z',
  skull: 'M12 3a7 7 0 0 0-7 7c0 2.5 1.3 4 3 5v3h8v-3c1.7-1 3-2.5 3-5a7 7 0 0 0-7-7zM9.5 11.5h.01M14.5 11.5h.01M10.5 18v3M13.5 18v3',
  boot: 'M8 3h6v9l5 3c1.5.9 2 2 2 3v1H5v-4l2-2zM5 21h16M8 7h6',
  stick: 'M7 3l5 13h7v3h-9L4 4zM5 21h3',
  rose: 'M12 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM12 9v12M12 14c-3 0-5-2-5-4M12 17c3 0 5-2 5-4',
  pepper: 'M8 9c4-1 10 1 10 7 0 3-3 5-6 4S6 15 8 9zM8 9c-1-2 0-4 2-5',
  swords: 'M4 4l9 9M20 4l-9 9M6 15l3 3M18 15l-3 3M12 21s-3-1.8-3-4a1.6 1.6 0 0 1 3-1 1.6 1.6 0 0 1 3 1c0 2.2-3 4-3 4z',
  cup: 'M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M8 3c0 2 2 2 2 4M12 3c0 2 2 2 2 4M5 21h10',
  night: 'M14 3a8 8 0 1 0 7 11 7 7 0 0 1-7-11zM6 14v6M4.5 20h3M6 12.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
};
const BASE_TAGS = [
  { id: 'romance', label: 'Romance', bg: '#F4C9CF', ink: '#A12F4B', icon: 'heart' },
  { id: 'romantasia', label: 'Romantasia', bg: '#DCCDF0', ink: '#5B3F8C', icon: 'castle' },
  { id: 'fantasia', label: 'Fantasia', bg: '#C8DCEF', ink: '#2E5A87', icon: 'moon' },
  { id: 'dark', label: 'Dark Romance', bg: '#E9C2CB', ink: '#6E1A33', icon: 'skull' },
  { id: 'cowboy', label: 'Cowboy', bg: '#F4D2BA', ink: '#8F4423', icon: 'boot' },
  { id: 'sports', label: 'Sports', bg: '#CFE4D2', ink: '#2F6B47', icon: 'stick' },
  { id: 'mafia', label: 'Mafia', bg: '#362C30', ink: '#E2BC6A', icon: 'rose' },
  { id: 'smut', label: 'SMUT', bg: '#E5C5EE', ink: '#7B2F8F', icon: 'pepper' },
  { id: 'enemies', label: 'Enemies to Lovers', bg: '#F2C1BD', ink: '#A12B2B', icon: 'swords' },
  { id: 'cozy', label: 'Cozy', bg: '#F0E2C6', ink: '#7E5427', icon: 'cup' },
  { id: 'madrugada', label: 'Leitura da madrugada', bg: '#2E3566', ink: '#E6E1FF', icon: 'night' },
];
// Cores para as etiquetas que ela mesma cria.
const TAG_PALETTE = [['#F4C9CF', '#A12F4B'], ['#DCCDF0', '#5B3F8C'], ['#C8DCEF', '#2E5A87'], ['#CFE4D2', '#2F6B47'], ['#F4D2BA', '#8F4423'], ['#F0E2C6', '#7E5427'], ['#E5C5EE', '#7B2F8F'], ['#362C30', '#E2BC6A'], ['#2E3566', '#E6E1FF']];
const allTags = () => [...BASE_TAGS, ...((state.session?.user?.user_metadata?.customTags) || [])];
const tagById = (id) => allTags().find((t) => t.id === id);
function ticketHTML(t, { size = 'mini', action = '', pressed = null, removable = false } = {}) {
  const path = TAG_ICONS[t.icon] || TAG_ICONS.bookmark;
  const tag = action ? 'button' : 'span';
  return `<${tag} class="ticket ${size}" style="--tk-bg:${esc(t.bg)};--tk-ink:${esc(t.ink)}" ${action ? `data-action="${action}" data-value="${esc(t.id)}"` : ''} ${pressed !== null ? `aria-pressed="${pressed}"` : ''} ${removable ? `aria-label="Remover etiqueta ${esc(t.label)}"` : ''}>
    <span class="tk-main"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg><span class="tk-label">${esc(t.label)}</span></span><span class="tk-stub" aria-hidden="true"></span></${tag}>`;
}

/* ---------------- carimbos do Obsession Level ---------------- */
// Cada nível tem um desenho inspirado no emoji e uma cor de tinta de carimbo.
const STAMP_ART = {
  obsessed: { ink: '#B3202E', art: '<path d="M32 46S18 37.6 18 28a7.5 7.5 0 0 1 14-3.6A7.5 7.5 0 0 1 46 28c0 9.6-14 18-14 18z" fill="currentColor" opacity=".18"/><path d="M32 46S18 37.6 18 28a7.5 7.5 0 0 1 14-3.6A7.5 7.5 0 0 1 46 28c0 9.6-14 18-14 18z"/><path d="M27 20c-2-3 0-6 2-7-.4 2 .8 3 2 3.4 0-3 2-5.4 4-6.4-.6 3 1.6 4.6 2 7"/>' },
  destruiu: { ink: '#4E2A52', art: '<path d="M32 16a12 12 0 0 0-12 12c0 4.2 2.2 6.8 5 8.4V42h14v-5.6c2.8-1.6 5-4.2 5-8.4a12 12 0 0 0-12-12z" fill="currentColor" opacity=".14"/><path d="M32 16a12 12 0 0 0-12 12c0 4.2 2.2 6.8 5 8.4V42h14v-5.6c2.8-1.6 5-4.2 5-8.4a12 12 0 0 0-12-12z"/><circle cx="27.5" cy="28" r="2.6"/><circle cx="36.5" cy="28" r="2.6"/><path d="M29.5 42v-4M34.5 42v-4"/><path d="M27.5 32c-1 2.4-1.6 4-.4 5.2"/>' },
  amei: { ink: '#C2456A', art: '<circle cx="32" cy="31" r="14" fill="currentColor" opacity=".14"/><circle cx="32" cy="31" r="14"/><path d="M27 29s-3.6-2.2-3.6-4.6a1.9 1.9 0 0 1 3.6-.8 1.9 1.9 0 0 1 3.6.8C30.6 26.8 27 29 27 29zM37 29s-3.6-2.2-3.6-4.6a1.9 1.9 0 0 1 3.6-.8 1.9 1.9 0 0 1 3.6.8C40.6 26.8 37 29 37 29z" fill="currentColor"/><path d="M26 35c3.6 4 8.4 4 12 0"/>' },
  gostei: { ink: '#D0697A', art: '<circle cx="32" cy="31" r="14" fill="currentColor" opacity=".14"/><circle cx="32" cy="31" r="14"/><path d="M26 28c1.2-1.4 3-1.4 4.2 0M33.8 28c1.2-1.4 3-1.4 4.2 0M27 35c2.8 2.6 7.2 2.6 10 0"/><path d="M47 19s-2.4-1.5-2.4-3.1a1.3 1.3 0 0 1 2.4-.5 1.3 1.3 0 0 1 2.4.5c0 1.6-2.4 3.1-2.4 3.1zM17 42s-2-1.2-2-2.6a1.1 1.1 0 0 1 2-.4 1.1 1.1 0 0 1 2 .4c0 1.4-2 2.6-2 2.6z" fill="currentColor"/>' },
  bonzinho: { ink: '#6E7B3E', art: '<circle cx="32" cy="31" r="14" fill="currentColor" opacity=".12"/><circle cx="32" cy="31" r="14"/><circle cx="27" cy="28" r="1.6" fill="currentColor"/><circle cx="37" cy="28" r="1.6" fill="currentColor"/><path d="M27.5 35.5c2.6 1.8 6.4 1.8 9 0"/>' },
  gastei: { ink: '#7C6F66', art: '<circle cx="32" cy="31" r="14" fill="currentColor" opacity=".1"/><circle cx="32" cy="31" r="14"/><path d="M25.5 27.5h4M34.5 27.5h4M28 36.5h8"/><path d="M44 19v-4h4M44 15l3 3"/><circle cx="46" cy="17" r="5"/>' },
};
// Carimbo redondo: nome em volta, desenho no meio.
function stampHTML(id, { size = 132 } = {}) {
  const o = OBSESSION.find((x) => x.id === id);
  const s = STAMP_ART[id];
  if (!o || !s) {
    return `<span class="stamp empty" style="width:${size}px;height:${size}px"><span>obsession<br>level<br><b>toque para carimbar</b></span></span>`;
  }
  const label = o.label.replace(/[^\p{L}\p{N} ]/gu, '').trim().toUpperCase();
  let ring = '';
  while (ring.length < 30) ring += `${label} ✦ `;
  const uid = `st-${id}-${size}`;
  return `<svg class="stamp" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="Obsession level: ${esc(o.label)}" style="color:${s.ink}">
    <defs><path id="${uid}" d="M32 32m-24 0a24 24 0 1 1 48 0a24 24 0 1 1 -48 0"/></defs>
    <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="32" cy="32" r="27.6" fill="none" stroke="currentColor" stroke-width=".6" stroke-dasharray="1 1.6"/>
    <text font-family="'Courier Prime', monospace" font-size="5" font-weight="700" fill="currentColor"><textPath href="#${uid}" textLength="148" lengthAdjust="spacing">${esc(ring.trim())}</textPath></text>
    <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 1)">${s.art}</g>
  </svg>`;
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
  theme: 'bookish',
  bbs: [], // book boyfriends, na ordem do ranking
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
  const [{ data, error }, bb] = await Promise.all([
    sb.from('books').select('*').order('created_at', { ascending: true }),
    sb.from('book_boyfriends').select('*').order('rank', { ascending: true }).order('created_at', { ascending: true }),
  ]);
  if (error) { toast('Não consegui carregar os livros. Confira a internet e recarregue.', true); return; }
  state.books = data || [];
  state.bbs = bb.error ? [] : (bb.data || []);
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
  else if (state.filter.type === 'tag') list = list.filter((b) => (b.tags || []).includes(state.filter.value));
  else {
    const c = COLLECTIONS.find((x) => x.id === state.filter.value);
    list = list.filter(c.test);
  }
  if (q) {
    list = state.books.filter((b) =>
      [b.title, b.author, b.series, ...(b.tags || []).map((t) => tagById(t)?.label || t), ...(b.characters || []), ...bbsOf(b.id).map((x) => x.name)]
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
    ${ornamentHTML()}
    <header class="lib-head">
      <div>
        <span class="eyebrow">${total} ${total === 1 ? 'livro' : 'livros'} · ${THEME_TAGLINE[state.theme] || ''}</span>
        ${titleHTML('Library')}
      </div>
      <div class="actions">
        <button class="iconbtn" data-action="themes" aria-label="Temas">${ic.palette}</button>
        <button class="iconbtn" data-action="logout" aria-label="Sair da conta">${ic.out}</button>
        <button class="fab" data-action="add" aria-label="Adicionar livro">${ic.plus}</button>
      </div>
    </header>

    <label class="search" for="q">${ic.search}
      <input id="q" type="search" placeholder="Buscar título, autora ou personagem" value="${esc(state.query)}" autocomplete="off">
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
        : state.filter.type === 'tag'
          ? esc(tagById(state.filter.value)?.label || 'Etiqueta')
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

    <div class="hs-wrap">
      <button class="hs-btn prev" data-action="hs" data-dir="-1" aria-label="Ver coleções anteriores">‹</button>
      <div class="collections hstrip" aria-label="Coleções">
        ${COLLECTIONS.map((c) => {
          const n = state.books.filter(c.test).length;
          const on = !state.query && state.filter.type === 'collection' && state.filter.value === c.id;
          const count = c.id === 'boyfriends'
            ? (state.bbs.length ? `${state.bbs.length} no ranking` : 'para preencher')
            : n ? `${n} ${n === 1 ? 'livro' : 'livros'}` : 'para preencher';
          return `<button class="coll ${c.cls}" data-action="${c.id === 'boyfriends' ? 'bbs' : 'collection'}" data-value="${c.id}" ${c.id === 'boyfriends' ? '' : `aria-pressed="${on}"`}>
            <span class="cb"><span class="t">${c.label}</span><span class="n">${count}</span></span><span class="stub" aria-hidden="true"></span></button>`;
        }).join('')}
      </div>
      <button class="hs-btn next" data-action="hs" data-dir="1" aria-label="Ver mais coleções">›</button>
    </div>

    ${tagStripHTML()}

    ${banner}

    <div class="section-line"><h2>${filterLabel}</h2><span>${list.length} ${list.length === 1 ? 'livro' : 'livros'}</span></div>
    ${body}`;
}

// Faixa de etiquetas da Library: só as que já estão em algum livro.
function tagStripHTML() {
  const used = allTags().map((t) => ({ t, n: state.books.filter((b) => (b.tags || []).includes(t.id)).length })).filter((x) => x.n);
  if (!used.length) return '';
  const cur = !state.query && state.filter.type === 'tag' ? state.filter.value : null;
  return `<div class="hs-wrap">
    <button class="hs-btn prev" data-action="hs" data-dir="-1" aria-label="Ver etiquetas anteriores">‹</button>
    <div class="tag-strip hstrip" aria-label="Filtrar por etiqueta">
      ${used.map(({ t }) => ticketHTML(t, { action: 'tag-filter', pressed: cur ? cur === t.id : true })).join('')}
    </div>
    <button class="hs-btn next" data-action="hs" data-dir="1" aria-label="Ver mais etiquetas">›</button>
  </div>`;
}
const THEME_TAGLINE = { bookish: 'clube de leitura', starlight: 'sob as estrelas', dragonfire: 'voe ou morra' };
const bbsOf = (bookId) => state.bbs.filter((x) => x.book_id === bookId);

// Ranking: o primeiro da lista é o nº 1. Guarda as novas posições no banco.
async function saveRanking(list) {
  const before = state.bbs;
  state.bbs = list.map((x, i) => ({ ...x, rank: i + 1 }));
  render();
  const changed = state.bbs.filter((x) => before.find((y) => y.id === x.id)?.rank !== x.rank);
  const res = await Promise.all(changed.map((x) => sb.from('book_boyfriends').update({ rank: x.rank }).eq('id', x.id)));
  if (res.some((r) => r.error)) { state.bbs = before; render(); toast('Não consegui salvar a nova ordem.', true); }
}
async function addBB(bookId, name) {
  if (state.bbs.some((x) => x.book_id === bookId && norm(x.name) === norm(name))) { toast(`${name} já está no ranking`); return false; }
  const rank = state.bbs.reduce((m, x) => Math.max(m, x.rank || 0), 0) + 1;
  const { data, error } = await sb.from('book_boyfriends').insert({ book_id: bookId, name, rank }).select().single();
  if (error) { toast('Não consegui adicionar ao ranking.', true); return false; }
  state.bbs.push(data);
  if (state.sheet) state.sheet.keepScroll = true;
  render();
  toast(`${name} entrou no ranking em #${state.bbs.length}`);
  return true;
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
const DARK_THEMES = ['starlight', 'dragonfire'];
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
  const dark = DARK_THEMES.includes(state.theme);
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

function tagsSectionHTML(b) {
  const mine = (b.tags || []).map(tagById).filter(Boolean);
  const open = state.sheet.tagPick;
  return `<section class="tags-sec" aria-label="Etiquetas">
    <div class="tags center">
      ${mine.map((t) => ticketHTML(t, { size: 'mid', action: 'tag-pick-open' })).join('')}
      <button class="ticket add" data-action="tag-pick-open" aria-expanded="${!!open}">${open ? 'fechar' : '+ etiqueta'}</button>
    </div>
    ${open ? `<div class="tag-picker">
      <span class="label">Toque para colar ou tirar</span>
      <div class="tags">${allTags().map((t) => ticketHTML(t, { size: 'mid', action: 'tag-toggle', pressed: (b.tags || []).includes(t.id) })).join('')}</div>
      <form id="tagForm" class="tag-form">
        <span class="label">Criar a minha etiqueta</span>
        <input class="input" name="name" maxlength="28" placeholder="nome da etiqueta" autocomplete="off" aria-label="Nome da nova etiqueta" value="${esc(state.sheet.newTag || '')}">
        <div class="swatches" role="radiogroup" aria-label="Cor da etiqueta">
          ${TAG_PALETTE.map(([bg, ink], i) => `<button type="button" class="swatch" role="radio" aria-checked="${(state.sheet.newTagColor || 0) === i}" aria-label="Cor ${i + 1}" data-action="tag-color" data-value="${i}" style="background:${bg};color:${ink}">a</button>`).join('')}
        </div>
        <button class="btn small dark" type="submit">Criar e colar</button>
      </form>
    </div>` : ''}
  </section>`;
}

function stampPickerHTML(b) {
  return `<div class="stamp-picker" role="group" aria-label="Escolher obsession level">
    ${OBSESSION.map((o) => `<button class="stamp-opt" data-action="obs-pick" data-value="${o.id}" aria-pressed="${b.obsession === o.id}">${stampHTML(o.id, { size: 76 })}<span>${esc(o.label)}</span></button>`).join('')}
    <button class="stamp-opt none" data-action="obs-pick" data-value="" aria-pressed="${!b.obsession}"><span class="stamp empty" style="width:76px;height:76px"><span>sem<br>carimbo</span></span><span>Sem nível</span></button>
  </div>`;
}

function bbSectionHTML(b) {
  const list = bbsOf(b.id);
  return `<section class="bb-sec" aria-label="Book boyfriends deste livro">
    <div class="bb-sec-head"><span class="label">Book boyfriends deste livro</span>${state.bbs.length ? '<button class="linkbtn small" data-action="bbs">ver ranking</button>' : ''}</div>
    ${list.length ? `<ul class="bb-mini">${list.map((x) => `<li><span class="bb-rank">#${state.bbs.indexOf(x) + 1}</span><span class="bb-name">${esc(x.name)}</span>
      <button class="x" data-action="bb-del" data-id="${x.id}" aria-label="Tirar ${esc(x.name)} do ranking">×</button></li>`).join('')}</ul>` : ''}
    <input class="bb-input" id="bbNew" data-bb="${b.id}" placeholder="+ adicionar book boyfriend" aria-label="Adicionar book boyfriend" enterkeyhint="done" autocomplete="off">
  </section>`;
}

function renderBook(b) {
  const pct = b.pages ? Math.min(100, Math.round(((b.current_page || 0) / b.pages) * 100)) : 0;
  const confirming = state.sheet.confirmDelete;
  const st = STATUSES.find((s) => s.id === b.status)?.one || '';
  const lang = LANGUAGES.find((l) => l.id === b.language)?.label.toLowerCase();
  return `
  <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(cleanTitle(b.title))}"><div class="sheet-inner">
    <div class="sheet-top">
      <button class="iconbtn back" data-action="close" aria-label="Voltar">${ic.back}</button>
      <span class="eyebrow">${esc(st)}${b.status === 'lido' && b.finished_at ? ' · ' + fmtDate(b.finished_at) : ''}</span>
    </div>

    <div class="hero">
      <div class="hero-cover">${coverHTML(b, 'lg')}</div>
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

    ${tagsSectionHTML(b)}

    ${b.status === 'lendo' ? `
    <div class="progress">
      <div class="nums"><span class="pct">${pct}%</span><span class="pg">${b.current_page || 0} / ${b.pages || '?'}</span></div>
      <div class="bar"><div style="width:${pct}%"></div></div>
    </div>` : ''}

    <section class="notes" aria-label="Notas">
      <div class="notes-l">
        <span class="label">Nota</span>${ratingHTML(b)}
        <span class="label sp">Spicy</span>${spicyHTML(b)}
      </div>
      <button class="stamp-btn" data-action="stamp-open" aria-expanded="${!!state.sheet.stampPick}" aria-label="Obsession level: ${esc(obsLabel(b.obsession) || 'sem nível')}. Toque para trocar">${stampHTML(b.obsession, { size: 128 })}</button>
      ${state.sheet.stampPick ? stampPickerHTML(b) : ''}
    </section>

    <section class="lcard" aria-label="Cartão de biblioteca">
      <svg class="lcard-ribbon" width="86" height="120" viewBox="0 0 86 120" aria-hidden="true">
        <circle cx="44" cy="34" r="6" fill="none" stroke="#3B2422" stroke-width="2"/>
        <path d="M44 34c-10-18-30-22-34-12s16 12 34 12c18 0 34-4 30-14s-24-6-30 14" fill="none" stroke="#C97C86" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M40 40c-6 18-14 30-22 40M46 40c-2 16-4 28-10 38" fill="none" stroke="#C97C86" stroke-width="2" stroke-linecap="round"/>
        <rect x="4" y="80" width="30" height="38" rx="3" transform="rotate(-8 19 99)" fill="#FBF2E4" stroke="#3B2422" stroke-width="1.8"/>
        <path d="M19 104s-6-3.6-6-8a3.4 3.4 0 0 1 6-2 3.4 3.4 0 0 1 6 2c0 4.4-6 8-6 8z" transform="rotate(-8 19 99)" fill="none" stroke="#C97C86" stroke-width="1.8"/>
      </svg>
      <div class="lcard-head"><span class="lcard-title">LIBRARY CARD</span>
        <svg width="20" height="18" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21s-9-5.6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-9 12-9 12z" fill="none" stroke="#C97C86" stroke-width="2"/></svg></div>
      <span class="lcard-sub">book lover</span>
      <div class="lcard-rows">
        <div class="lrow"><span>TÍTULO:</span><span class="hand ttl">${esc(cleanTitle(b.title))}</span></div>
        <div class="lrow"><label for="f-ini">COMECEI EM:</label><input id="f-ini" class="hand" type="date" data-field="started_at" value="${b.started_at || ''}"></div>
        <div class="lrow"><label for="f-fim">TERMINEI EM:</label><input id="f-fim" class="hand" type="date" data-field="finished_at" value="${b.finished_at || ''}"></div>
        <div class="lrow"><label for="f-pages">PÁGINAS · IDIOMA:</label><span class="lrow-pair">
          <input id="f-pages" class="hand num" type="number" inputmode="numeric" min="0" placeholder="—" data-field="pages" value="${b.pages ?? ''}"><span class="hand dot">·</span>
          ${ddHTML('language', b.language, LANGUAGES, { placeholder: '—', cls: 'dd-right dd-hand', label: 'Idioma' })}</span></div>
      </div>
      <div class="lcard-why">
        <label for="why">POR QUE ISSO ME MARCOU?</label>
        <textarea id="why" class="hand" data-field="why_it_marked" rows="4" placeholder="escreva aqui, do seu jeito, o que esse livro fez com você">${esc(b.why_it_marked || '')}</textarea>
      </div>
      <span class="lcard-seal" aria-hidden="true">BOOKED &amp;<br>OBSESSED<br>♥<br>${esc(st.toUpperCase())}</span>
    </section>

    ${bbSectionHTML(b)}

    <div class="rows">
      <div class="row"><label for="f-title">Título</label><div class="ctrl"><input id="f-title" type="text" data-field="title" value="${esc(b.title)}" autocomplete="off"></div></div>
      <div class="row"><label for="f-author">Autora</label><div class="ctrl"><input id="f-author" type="text" data-field="author" value="${esc(b.author || '')}" autocomplete="off"></div></div>
      <div class="row"><span class="label-plain">Status</span><div class="ctrl">
        ${ddHTML('status', b.status, STATUSES.map((s) => ({ id: s.id, label: s.one })), { cls: 'dd-right', label: 'Status' })}</div></div>
      ${b.status === 'lendo' ? `<div class="row"><label for="f-cur">Página atual</label><div class="ctrl"><input id="f-cur" class="num" type="number" inputmode="numeric" min="0" data-field="current_page" value="${b.current_page ?? ''}"></div></div>` : ''}
      <div class="row"><label for="f-series">Série</label><div class="ctrl"><input id="f-series" type="text" data-field="series" placeholder="nome da série" value="${esc(b.series || '')}"></div></div>
      <div class="row"><label for="f-pos">Livro nº</label><div class="ctrl"><input id="f-pos" class="num" type="number" inputmode="decimal" step="0.5" min="0" data-field="series_position" value="${b.series_position ?? ''}"></div></div>
      <div class="row stack"><span class="label">Personagens</span>${chipList(b, 'characters', '+ personagem')}</div>
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

/* ---------------- render: book boyfriends ---------------- */
function renderBBs() {
  const sh = state.sheet;
  const list = state.bbs;
  const books = [...state.books].sort((a, b) => cleanTitle(a.title).localeCompare(cleanTitle(b.title)));
  return `
  <div class="sheet bb-page" role="dialog" aria-modal="true" aria-label="Book boyfriends"><div class="sheet-inner">
    <div class="sheet-top">
      <button class="iconbtn back" data-action="close" aria-label="Voltar para a Library">${ic.back}</button>
      <span class="eyebrow">${list.length} no ranking</span>
    </div>
    <header class="bb-head">
      <h2 class="sheet-title">Book<br>Boyfriends</h2>
      <span class="bb-sub">meu ranking oficial ♥</span>
      <svg class="bb-heart" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 54S10 41 10 25a11 11 0 0 1 22-4 11 11 0 0 1 22 4c0 16-22 29-22 29z" fill="none" stroke="currentColor" stroke-width="2.2"/>
        <path d="M50 8l1.4 5 5 1.4-5 1.4-1.4 5-1.4-5-5-1.4 5-1.4z" fill="currentColor"/>
        <path d="M8 46l1 3.4 3.4 1-3.4 1-1 3.4-1-3.4-3.4-1 3.4-1z" fill="var(--meta)"/>
      </svg>
    </header>
    ${list.length ? `<p class="hint">No computador, segure e arraste para mudar a ordem. No celular, use as setinhas.</p>
    <ol class="bb-list">
      ${list.map((x, i) => {
        const b = byId(x.book_id);
        return `<li class="bb-row${i === 0 ? ' top' : ''}" draggable="true" data-bb-id="${x.id}">
          <span class="bb-rank" aria-hidden="true">${i + 1}</span>
          <button class="bb-info" data-action="bb-open" data-id="${x.book_id}">
            <span class="bb-name">${esc(x.name)}${i === 0 ? '<svg width="13" height="12" viewBox="0 0 24 22" role="img" aria-label="Meu número 1"><path d="M12 21s-9-5.6-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.4-9 12-9 12z" fill="currentColor"/></svg>' : ''}</span>
            <span class="bb-book">${esc(b ? cleanTitle(b.title) : '')}${b?.author ? ' · ' + esc(b.author) : ''}</span>
          </button>
          ${b ? coverHTML(b, 'xs') : ''}
          <span class="bb-arrows">
            <button data-action="bb-move" data-id="${x.id}" data-dir="-1" aria-label="Subir ${esc(x.name)}" ${i === 0 ? 'disabled' : ''}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>
            <button data-action="bb-move" data-id="${x.id}" data-dir="1" aria-label="Descer ${esc(x.name)}" ${i === list.length - 1 ? 'disabled' : ''}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          </span>
        </li>`;
      }).join('')}
    </ol>` : '<div class="empty"><span class="serif">Nenhum book boyfriend ainda.</span>Adicione o primeiro aqui ou na ficha do livro.</div>'}
    ${sh.addOpen ? `<form id="bbForm" class="bb-form">
        <input class="input" name="name" id="bbName" maxlength="120" placeholder="nome do personagem" autocomplete="off" aria-label="Nome do book boyfriend" value="${esc(sh.bbName || '')}">
        ${ddHTML('bb-book', sh.bbBook, books.map((b) => ({ id: b.id, label: cleanTitle(b.title) })), { cls: 'dd-field', label: 'Livro', placeholder: 'de qual livro?' })}
        <div class="goal-actions"><button type="button" class="btn small" data-action="bb-add-toggle">Cancelar</button><button type="submit" class="btn small dark">Adicionar</button></div>
      </form>`
      : '<button class="dashed-btn" data-action="bb-add-toggle">+ adicionar book boyfriend</button>'}
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
    <div class="quick-status">
      <span class="label">O botão + adiciona como</span>
      ${ddHTML('q-status', s.qStatus || 'tbr', STATUSES.map((x) => ({ id: x.id, label: x.one })), { cls: 'dd-right', label: 'Status do botão +' })}
    </div>

    <div class="results">
      ${s.loading && !results.length ? '<p class="hint">Buscando…</p>' : ''}
      ${s.error ? `<p class="hint">${esc(s.error)}</p>` : ''}
      ${!s.loading && s.q && s.results && !results.length ? '<p class="hint">Nenhuma edição encontrada com esse filtro.</p>' : ''}
      ${results.map((r) => {
        const owned = inLibrary(r);
        const added = s.added?.[r.gid];
        const open = picked?.gid === r.gid;
        return `
        <div class="result-row${open ? ' open' : ''}">
          <button class="result" data-action="pick" data-gid="${esc(r.gid)}" aria-expanded="${open}">
            ${coverHTML({ title: r.title, author: r.author, cover_url: r.cover }, 'sm')}
            <span class="info">
              <span class="rt">${esc(r.title)}</span>
              <span class="ra">${esc(r.author || 'Autora desconhecida')}</span>
              <span class="rm">${[r.language === 'pt' ? 'Português' : r.language === 'en' ? 'Inglês' : '', r.pages ? `${r.pages} págs.` : '', r.year].filter(Boolean).join(' · ')}</span>
              <span class="cover-src">${r.cover ? 'Capa: ' : 'Sem capa · '}${resultSource(r)}</span>
            </span>
          </button>
          ${added
            ? `<span class="quick-add done" aria-label="Adicionado">${ic.check}</span>`
            : added === false
              ? '<span class="quick-add busy" aria-label="Adicionando">…</span>'
              : `<button class="quick-add" data-action="quick-add" data-gid="${esc(r.gid)}" aria-label="Adicionar ${esc(r.title)} como ${esc(STATUSES.find((x) => x.id === (s.qStatus || 'tbr')).one)}">${ic.plus}</button>`}
          ${owned && !added ? '<span class="owned">já está na sua Library</span>' : ''}
          ${open ? `
          <div class="picked inline">
            <div class="field"><span class="label">Entra como</span>${ddHTML('p-status', s.pStatus || 'tbr', STATUSES.map((x) => ({ id: x.id, label: x.one })), { cls: 'dd-field', label: 'Entra como' })}</div>
            <button class="btn primary" data-action="add-confirm">Adicionar e abrir a ficha</button>
          </div>` : ''}
        </div>`;
      }).join('')}
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
  else if (state.sheet?.kind === 'bbs') sheet = renderBBs();

  const main = state.view === 'shelf' ? renderShelf() : renderLibrary();
  app.innerHTML = `<div class="shell" ${sheet ? 'aria-hidden="true"' : ''}>${main}</div>${renderNav()}${sheet}`;
  document.body.style.overflow = sheet ? 'hidden' : '';
  markOverflow();
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
// Cada busca ganha um número; só a mais recente pode mudar a lista.
// (Antes, uma busca antiga e lenta podia terminar depois e apagar a lista atual.)
async function runAddSearch(q) {
  const s = state.sheet;
  const seq = (s.seq = (s.seq || 0) + 1);
  s.q = q;
  if (!q.trim()) { s.results = null; s.loading = false; render(); return; }
  s.loading = true; s.error = null; render();
  let results = null; let error = null;
  try {
    results = s.mode === 'author' ? await searchByAuthor(q) : await searchBooks(q, { max: 30 });
  } catch (err) { error = searchErrorText(err); }
  if (state.sheet !== s || s.seq !== seq) return;
  s.loading = false;
  if (error) { s.error = error; if (!s.results) s.results = []; } else { s.results = results; s.error = null; }
  s.keepScroll = true;
  render();
}
async function runCoverSearch(q) {
  const s = state.sheet;
  const seq = (s.seq = (s.seq || 0) + 1);
  s.q = q; s.loading = true; s.error = null; render();
  if (s.mode === 'author') s.authorQ = q; else s.titleQ = q;
  if (!q.trim()) { s.loading = false; s.results = []; render(); return; }
  let results = null; let error = null;
  try {
    results = s.mode === 'author' ? await searchByAuthor(q) : await searchBooks(q, { max: 30 });
  } catch (err) { error = searchErrorText(err); }
  if (state.sheet !== s || s.seq !== seq) return;
  s.loading = false;
  if (error) { s.error = error; if (!s.results) s.results = []; } else { s.results = results; s.error = null; }
  render();
}

// O livro da busca já está na Library? (mesmo título e mesma autora)
function inLibrary(r) {
  const t = mainTitle(r.title);
  const a = simpleText((r.author || '').split(',')[0]).split(' ').pop() || '';
  return state.books.some((b) => mainTitle(cleanTitle(b.title)) === t && (!a || simpleText(b.author).includes(a)));
}

const bookFromResult = (p, status) => ({ title: p.title, author: p.author || null, pages: p.pages, language: p.language, cover_url: p.cover, cover_source_url: p.cover, google_books_id: p.gid, status, current_page: status === 'lendo' ? 0 : status === 'lido' ? p.pages : null, finished_at: status === 'lido' ? new Date().toISOString().slice(0, 10) : null });

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
      if (k === 'q-status') { sheet.qStatus = v; render(); break; }
      if (k === 'm-status') { sheet.mStatus = v; render(); break; }
      if (k === 'bb-book') { sheet.bbBook = v; render(); break; }
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
    case 'tag-filter': {
      const v = el.dataset.value;
      state.query = '';
      state.filter = state.filter.type === 'tag' && state.filter.value === v ? { type: 'status', value: 'lido' } : { type: 'tag', value: v };
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
      if (sheet?.from === 'bbs') { state.sheet = { kind: 'bbs' }; render(); break; }
      state.sheet = null; render(); checkVersion(); break;
    case 'bbs':
      state.sheet = { kind: 'bbs' }; render(); document.querySelector('.sheet')?.scrollTo(0, 0); break;
    case 'bb-open':
      state.sheet = { kind: 'book', id: el.dataset.id, from: 'bbs' }; render(); document.querySelector('.sheet')?.scrollTo(0, 0); break;
    case 'bb-add-toggle':
      sheet.addOpen = !sheet.addOpen; sheet.keepScroll = true; render();
      if (sheet.addOpen) document.getElementById('bbName')?.focus();
      break;
    case 'bb-move': {
      const i = state.bbs.findIndex((x) => x.id === el.dataset.id);
      const j = i + Number(el.dataset.dir);
      if (i < 0 || j < 0 || j >= state.bbs.length) break;
      const list = [...state.bbs];
      [list[i], list[j]] = [list[j], list[i]];
      sheet.keepScroll = true;
      saveRanking(list);
      // O foco segue o personagem que mudou de lugar.
      document.querySelector(`[data-bb-id="${el.dataset.id}"] [data-dir="${el.dataset.dir}"]:not(:disabled)`)?.focus();
      break;
    }
    case 'bb-del': {
      const x = state.bbs.find((y) => y.id === el.dataset.id);
      if (!x) break;
      const before = [...state.bbs];
      state.bbs = state.bbs.filter((y) => y.id !== x.id);
      if (sheet) sheet.keepScroll = true;
      render();
      const { error } = await sb.from('book_boyfriends').delete().eq('id', x.id);
      if (error) { state.bbs = before; render(); toast('Não consegui tirar do ranking.', true); }
      else toast(`${x.name} saiu do ranking`);
      break;
    }
    case 'tag-pick-open':
      sheet.tagPick = !sheet.tagPick; sheet.keepScroll = true; render(); break;
    case 'tag-color':
      sheet.newTagColor = Number(el.dataset.value); sheet.keepScroll = true; render(); break;
    case 'tag-toggle': {
      const set = new Set(b.tags || []);
      const v = el.dataset.value;
      set.has(v) ? set.delete(v) : set.add(v);
      sheet.keepScroll = true;
      // Mantém a ordem da lista de etiquetas.
      updateBook(b.id, { tags: allTags().map((t) => t.id).filter((id) => set.has(id)) }); break;
    }
    case 'stamp-open':
      sheet.stampPick = !sheet.stampPick; sheet.keepScroll = true; render(); break;
    case 'obs-pick':
      sheet.stampPick = false;
      setField(b, 'obsession', el.dataset.value || null); break;
    case 'hs': {
      // Setas das faixas que rolam para o lado (no computador).
      const strip = el.parentElement.querySelector('.hstrip');
      if (strip) strip.scrollBy({ left: Number(el.dataset.dir) * strip.clientWidth * 0.8, behavior: 'smooth' });
      break;
    }
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
    case 'pick': {
      // Abre as opções logo abaixo do livro tocado, sem mexer no resto da lista.
      const gid = el.dataset.gid;
      sheet.picked = sheet.picked?.gid === gid ? null : sheet.results.find((r) => r.gid === gid);
      sheet.keepScroll = true; render(); break;
    }
    case 'quick-add': {
      const r = sheet.results.find((x) => x.gid === el.dataset.gid);
      if (!r) break;
      const status = sheet.qStatus || 'tbr';
      sheet.added = sheet.added || {};
      sheet.added[r.gid] = false;
      sheet.keepScroll = true; render();
      const row = await insertBook(bookFromResult(r, status));
      if (row) {
        sheet.added[r.gid] = row.id;
        toast(`Adicionado: ${cleanTitle(r.title)}`);
        if (r.cover) cacheCover(row.id, r.cover);
      } else delete sheet.added[r.gid];
      if (state.sheet === sheet) { sheet.keepScroll = true; render(); }
      break;
    }
    case 'add-confirm': {
      const p = sheet.picked;
      const status = sheet.pStatus || 'tbr';
      el.disabled = true;
      const row = await insertBook(bookFromResult(p, status));
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
  if (e.target.id === 'tagForm') {
    const sheet = state.sheet;
    const b = byId(sheet.id);
    const name = e.target.name.value.trim();
    if (!name) { toast('Dê um nome para a etiqueta.', true); return; }
    const existing = allTags().find((t) => norm(t.label) === norm(name));
    let id = existing?.id;
    if (!existing) {
      const [bg, ink] = TAG_PALETTE[sheet.newTagColor || 0];
      id = 'c-' + Date.now().toString(36);
      const customTags = [...(meta().customTags || []), { id, label: name, bg, ink, icon: 'bookmark' }];
      if (!(await saveMeta({ customTags }))) return;
    }
    sheet.newTag = ''; sheet.keepScroll = true;
    if (!(b.tags || []).includes(id)) updateBook(b.id, { tags: [...(b.tags || []), id] });
    else render();
    toast(existing ? `${existing.label} já existia: colei no livro` : `Etiqueta ${name} criada`);
  }
  if (e.target.id === 'bbForm') {
    const sheet = state.sheet;
    const name = e.target.name.value.trim();
    if (!name) { toast('Escreva o nome do personagem.', true); return; }
    if (!sheet.bbBook) { toast('Escolha de qual livro ele é.', true); return; }
    if (await addBB(sheet.bbBook, name)) { sheet.bbName = ''; sheet.addOpen = false; sheet.keepScroll = true; render(); }
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
  if (t.form?.id === 'tagForm' && t.name === 'name') { state.sheet.newTag = t.value; return; }
  if (t.id === 'bbName') { state.sheet.bbName = t.value; return; }
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
  if (t.dataset?.bb && e.key === 'Enter') {
    e.preventDefault();
    const val = t.value.trim();
    if (!val) return;
    t.value = '';
    state.sheet.keepScroll = true;
    addBB(t.dataset.bb, val).then((ok) => { if (ok) setTimeout(() => document.getElementById('bbNew')?.focus(), 0); });
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

// Arrastar para reordenar o ranking (no computador).
let dragBB = null;
document.addEventListener('dragstart', (e) => {
  const row = e.target.closest?.('[data-bb-id]');
  if (!row) return;
  dragBB = row.dataset.bbId;
  row.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  try { e.dataTransfer.setData('text/plain', dragBB); } catch { /* alguns navegadores */ }
});
document.addEventListener('dragover', (e) => {
  const row = e.target.closest?.('[data-bb-id]');
  if (!row || !dragBB) return;
  e.preventDefault();
  document.querySelectorAll('.bb-row.over').forEach((r) => r !== row && r.classList.remove('over'));
  row.classList.add('over');
});
document.addEventListener('dragend', () => {
  dragBB = null;
  document.querySelectorAll('.bb-row.dragging, .bb-row.over').forEach((r) => r.classList.remove('dragging', 'over'));
});
document.addEventListener('drop', (e) => {
  const row = e.target.closest?.('[data-bb-id]');
  if (!row || !dragBB) return;
  e.preventDefault();
  const from = state.bbs.findIndex((x) => x.id === dragBB);
  const to = state.bbs.findIndex((x) => x.id === row.dataset.bbId);
  dragBB = null;
  if (from < 0 || to < 0 || from === to) { render(); return; }
  const list = [...state.bbs];
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
  if (state.sheet) state.sheet.keepScroll = true;
  saveRanking(list);
});

// Setas laterais só aparecem quando a faixa tem mais conteúdo do que cabe.
function markOverflow() {
  document.querySelectorAll('.hs-wrap').forEach((w) => {
    const s = w.querySelector('.hstrip');
    w.dataset.overflow = s && s.scrollWidth > s.clientWidth + 4 ? 'true' : 'false';
  });
}
window.addEventListener('resize', () => { clearTimeout(markOverflow.t); markOverflow.t = setTimeout(markOverflow, 150); });

// No computador, a rodinha do mouse rola as faixas laterais (coleções, abas) para o lado.
document.addEventListener('wheel', (e) => {
  const strip = e.target.closest?.('.hstrip, .tabs');
  if (!strip || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  const max = strip.scrollWidth - strip.clientWidth;
  if (max <= 0) return;
  const next = strip.scrollLeft + e.deltaY;
  if ((e.deltaY < 0 && strip.scrollLeft <= 0) || (e.deltaY > 0 && strip.scrollLeft >= max)) return; // no fim, deixa a página rolar
  strip.scrollLeft = Math.max(0, Math.min(max, next));
  e.preventDefault();
}, { passive: false });

/* ---------------- atualização sem cache ---------------- */
// Quando eu publico uma versão nova, o app percebe e recarrega sozinho com os arquivos novos.
const APP_VERSION = '2026.11.01-2';
async function checkVersion() {
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { v } = await res.json();
    if (!v || v === APP_VERSION) return;
    if (state.sheet || arrival) return; // não interrompe quem está com uma tela aberta (busca, ficha…)
    // Evita recarregar em círculo se o navegador insistir na versão antiga.
    let tried = null;
    try { tried = sessionStorage.getItem('bo.reloadedFor'); sessionStorage.setItem('bo.reloadedFor', v); } catch { /* sem armazenamento */ }
    if (tried === v) return;
    location.replace(`${location.pathname}?v=${encodeURIComponent(v)}${location.hash}`);
  } catch { /* sem internet: segue com a versão atual */ }
}
if (new URLSearchParams(location.search).has('v')) history.replaceState(null, '', location.pathname + location.hash);
checkVersion();
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkVersion(); });

/* ---------------- início ---------------- */
let savedTheme = 'bookish';
try { savedTheme = localStorage.getItem(THEME_KEY) || 'bookish'; } catch { /* sem armazenamento */ }
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
