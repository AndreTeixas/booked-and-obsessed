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
  { id: 'obsessed', label: 'Obsessed' },
  { id: 'destruiu', label: 'Me destruiu' },
  { id: 'amei', label: 'Amei' },
  { id: 'gostei', label: 'Gostei' },
  { id: 'bonzinho', label: 'Bonzinho' },
  { id: 'gastei', label: 'Gastei tempo' },
];
const GENRES = ['Romance', 'Romantasia', 'Sports Romance', 'Mafia Romance', 'Dark Romance', 'Cowboy', 'SMUT'];
const COLLECTIONS = [
  { id: 'favoritos', label: 'Favoritos', cls: 'c-blush', test: (b) => b.rating === 6 },
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
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/></svg>',
  sparkle: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/></svg>',
  pepper: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9c4-1 10 1 10 7 0 3-3 5-6 4S6 15 8 9z"/><path d="M8 9c-1-2 0-4 2-5"/></svg>',
  pepperFill: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 9c4-1 10 1 10 7 0 3-3 5-6 4S6 15 8 9z"/><path d="M8 9c-1-2 0-4 2-5" fill="none"/></svg>',
};

/* ---------------- estado ---------------- */
const state = {
  session: null,
  books: [],
  loaded: false,
  filter: { type: 'status', value: 'lido' },
  query: '',
  sheet: null, // { kind: 'book'|'add'|'cover', id?, ... }
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
function toast(msg, isError = false) {
  toastEl.textContent = msg;
  toastEl.classList.toggle('error', isError);
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.hidden = true), isError ? 4000 : 1800);
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
async function gbSearch(q, { lang = '', max = 20 } = {}) {
  const params = new URLSearchParams({ q, maxResults: String(max), printType: 'books' });
  if (lang) params.set('langRestrict', lang);
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
  if (!res.ok) throw new Error('google');
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
    };
  });
}

/* ---------------- dados ---------------- */
async function loadBooks() {
  const { data, error } = await sb.from('books').select('*').order('created_at', { ascending: true });
  if (error) { toast('Não consegui carregar os livros. Confira a internet e recarregue.', true); return; }
  state.books = data || [];
  state.loaded = true;
  render();
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
    else if (!quiet) toast('Salvo');
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

/* ---------------- capas em lote ---------------- */
const TRIED_KEY = 'bo.coverTried';
function triedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(TRIED_KEY) || '[]')); } catch { return new Set(); }
}
function saveTried(set) {
  try { localStorage.setItem(TRIED_KEY, JSON.stringify([...set])); } catch { /* sem armazenamento local */ }
}
function missingCovers() {
  const tried = triedSet();
  return state.books.filter((b) => !b.cover_url && !tried.has(b.id));
}
async function fetchMissingCovers() {
  const list = missingCovers();
  if (!list.length) return;
  const tried = triedSet();
  state.coverJob = { done: 0, total: list.length, found: 0 };
  render();
  for (const b of list) {
    try {
      const t = cleanTitle(b.title);
      const author = (b.author || '').split(',')[0];
      let q = `intitle:${t}`;
      if (author) q += ` inauthor:${author}`;
      let items = await gbSearch(q, { lang: b.language || '', max: 10 });
      if (!items.some((i) => i.cover) && b.language) items = await gbSearch(q, { max: 10 });
      const hit = items.find((i) => i.cover);
      if (hit) {
        b.cover_url = hit.cover;
        b.google_books_id = hit.gid;
        await sb.from('books').update({ cover_url: hit.cover, google_books_id: hit.gid }).eq('id', b.id);
        state.coverJob.found++;
      }
    } catch { /* segue para o próximo */ }
    tried.add(b.id);
    saveTried(tried);
    state.coverJob.done++;
    render();
    await new Promise((r) => setTimeout(r, 250));
  }
  const { found, total } = state.coverJob;
  state.coverJob = null;
  toast(`${found} de ${total} capas encontradas`);
  render();
}

/* ---------------- render: auth ---------------- */
function renderAuth() {
  const signup = state.authMode === 'signup';
  const msg = state.authMsg;
  app.innerHTML = `
  <main class="auth">
    <div>
      <span class="eyebrow">for readers who feel too much</span>
      <h1>Booked &amp; Obsessed</h1>
      <p class="tagline">${signup ? 'Crie sua conta para guardar suas leituras.' : 'Entre para abrir sua Library.'}</p>
    </div>
    <form id="authForm" novalidate>
      <div class="field"><label for="email">E-mail</label>
        <input class="input" id="email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="password">Senha</label>
        <input class="input" id="password" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="6" required></div>
      ${msg ? `<p class="msg ${msg.error ? 'error' : ''}">${esc(msg.text)}</p>` : ''}
      <button class="btn primary" type="submit">${signup ? 'Criar conta' : 'Entrar'}</button>
    </form>
    <button class="linkbtn" type="button" data-action="toggle-auth">${signup ? 'Já tenho conta' : 'Primeira vez aqui? Criar conta'}</button>
  </main>`;
}

async function onAuthSubmit(form) {
  const email = form.email.value.trim();
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
      options: { emailRedirectTo: location.origin + location.pathname },
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
  return 'Algo deu errado. Tente de novo.';
}

/* ---------------- render: library ---------------- */
function visibleBooks() {
  const q = norm(state.query);
  let list = state.books;
  if (state.filter.type === 'status') list = list.filter((b) => b.status === state.filter.value);
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
  if (b.rating === 6) return 'Favorito';
  return '';
}

function renderLibrary() {
  const total = state.books.length;
  const counts = Object.fromEntries(STATUSES.map((s) => [s.id, state.books.filter((b) => b.status === s.id).length]));
  const list = visibleBooks();
  const missing = missingCovers().length;
  const job = state.coverJob;
  const filterLabel = state.query
    ? `Resultados para “${esc(state.query)}”`
    : state.filter.type === 'status'
      ? STATUSES.find((s) => s.id === state.filter.value).tab
      : COLLECTIONS.find((c) => c.id === state.filter.value).label;

  const banner = job
    ? `<div class="banner"><p>Buscando capas no Google Books… ${job.done} de ${job.total}</p></div>`
    : missing && total
      ? `<div class="banner"><p>${missing} ${missing === 1 ? 'livro está' : 'livros estão'} sem capa. Posso buscar no Google Books; você troca as que vierem erradas.</p>
         <button class="btn small dark" data-action="fetch-covers">Buscar capas</button></div>`
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
  <div class="page">
    <header class="lib-head">
      <div>
        <span class="eyebrow">${total} ${total === 1 ? 'livro' : 'livros'}</span>
        <h1>Library</h1>
      </div>
      <div class="actions">
        <button class="iconbtn" data-action="logout" aria-label="Sair da conta">${ic.out}</button>
        <button class="fab" data-action="add" aria-label="Adicionar livro">${ic.plus}</button>
      </div>
    </header>

    <label class="search" for="q">${ic.search}
      <input id="q" type="search" placeholder="Buscar título, autora ou trope" value="${esc(state.query)}" autocomplete="off">
    </label>

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
    ${body}
  </div>`;
}

function renderNav() {
  return `<nav class="nav" aria-label="Navegação"><div class="nav-inner">
    <button class="nav-item" disabled>Início<span class="soon">em breve</span></button>
    <button class="nav-item" aria-current="page">Library<span class="dot"></span></button>
    <button class="nav-item" disabled>Séries<span class="soon">em breve</span></button>
    <button class="nav-item" disabled>Stats<span class="soon">em breve</span></button>
  </div></nav>`;
}

/* ---------------- render: ficha ---------------- */
function ratingHTML(b) {
  const r = b.rating || 0;
  const sparkle = r === 6;
  const btns = [1, 2, 3, 4, 5].map((i) => {
    const on = sparkle || r >= i;
    return `<button data-action="rate" data-value="${i}" class="${on ? '' : 'off'}" aria-label="${i} ${i === 1 ? 'estrela' : 'estrelas'}">${sparkle ? ic.sparkle : ic.star}</button>`;
  }).join('');
  return `<div class="rating">${btns}</div>
    <button class="sparkle-toggle" data-action="sparkle" aria-pressed="${sparkle}">${sparkle ? 'acima de 5' : '+ brilho'}</button>`;
}

function spicyHTML(b) {
  const s = b.spicy || 0;
  return `<div class="spicy">${[1, 2, 3, 4, 5].map((i) => `<button data-action="spicy" data-value="${i}" class="${s >= i ? '' : 'off'}" aria-label="Spicy ${i} de 5">${s >= i ? ic.pepperFill : ic.pepper}</button>`).join('')}</div>`;
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
      <div class="covertools">
        <button class="linkbtn" data-action="cover">${b.cover_url ? 'Trocar capa' : 'Buscar capa'}</button>
        ${b.cover_url ? '<button class="linkbtn" data-action="cover-remove">Usar capa tipográfica</button>' : ''}
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
        <select class="obs-select" data-field="obsession" aria-label="Obsession level">
          <option value="">escolher</option>
          ${OBSESSION.map((o) => `<option value="${o.id}" ${b.obsession === o.id ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select></div>
      <div><span class="label">Spicy</span>${spicyHTML(b)}</div>
    </div>

    <div class="marked">
      <label for="why">Por que isso me marcou?</label>
      <textarea id="why" data-field="why_it_marked" rows="2" placeholder="Em uma frase, o que esse livro fez com você">${esc(b.why_it_marked || '')}</textarea>
    </div>

    <div class="rows">
      <div class="row"><label for="f-status">Status</label><div class="ctrl">
        <select id="f-status" data-field="status">${STATUSES.map((s) => `<option value="${s.id}" ${b.status === s.id ? 'selected' : ''}>${s.one}</option>`).join('')}</select></div></div>
      ${b.status === 'lendo' ? `<div class="row"><label for="f-cur">Página atual</label><div class="ctrl"><input id="f-cur" class="num" type="number" inputmode="numeric" min="0" data-field="current_page" value="${b.current_page ?? ''}"></div></div>` : ''}
      <div class="row"><label for="f-pages">Páginas</label><div class="ctrl"><input id="f-pages" class="num" type="number" inputmode="numeric" min="0" data-field="pages" value="${b.pages ?? ''}"></div></div>
      ${b.status === 'lido' ? `<div class="row"><label for="f-fim">Terminei em</label><div class="ctrl"><input id="f-fim" type="date" data-field="finished_at" value="${b.finished_at || ''}"></div></div>` : ''}
      <div class="row"><label for="f-lang">Idioma</label><div class="ctrl">
        <select id="f-lang" data-field="language"><option value="">—</option><option value="pt" ${b.language === 'pt' ? 'selected' : ''}>Português</option><option value="en" ${b.language === 'en' ? 'selected' : ''}>Inglês</option></select></div></div>
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
      <span class="eyebrow">Google Books</span>
    </div>
    <h2 class="sheet-title">Adicionar livro</h2>

    ${s.manual ? `
      <form id="manualForm" class="picked" novalidate>
        <div class="field"><label for="m-title">Título</label><input class="input" id="m-title" name="title" required></div>
        <div class="field"><label for="m-author">Autora</label><input class="input" id="m-author" name="author"></div>
        <div class="field"><label for="m-pages">Páginas</label><input class="input" id="m-pages" name="pages" type="number" inputmode="numeric" min="0"></div>
        <div class="field"><label for="m-status">Status</label><select class="input" id="m-status" name="status">${STATUSES.map((x) => `<option value="${x.id}" ${x.id === 'tbr' ? 'selected' : ''}>${x.one}</option>`).join('')}</select></div>
        <button class="btn primary" type="submit">Adicionar à Library</button>
      </form>
      <button class="linkbtn" data-action="manual-off">Voltar para a busca</button>
    ` : `
    <label class="search" for="gq">${ic.search}
      <input id="gq" type="search" placeholder="Título ou autora" value="${esc(s.q || '')}" autocomplete="off" enterkeyhint="search">
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
          </div>
        </div>
        <div class="field"><label for="p-status">Entra como</label>
          <select class="input" id="p-status">${STATUSES.map((x) => `<option value="${x.id}" ${x.id === 'tbr' ? 'selected' : ''}>${x.one}</option>`).join('')}</select></div>
        <button class="btn primary" data-action="add-confirm">Adicionar à Library</button>
      </div>` : ''}

    <div class="results">
      ${s.loading ? '<p class="hint">Buscando…</p>' : ''}
      ${s.error ? '<p class="hint">Não consegui falar com o Google Books. Tente de novo em instantes.</p>' : ''}
      ${!s.loading && s.q && s.results && !results.length ? '<p class="hint">Nenhuma edição encontrada com esse filtro.</p>' : ''}
      ${results.map((r) => `
        <button class="result" data-action="pick" data-gid="${esc(r.gid)}" aria-pressed="${picked?.gid === r.gid}">
          ${coverHTML({ title: r.title, author: r.author, cover_url: r.cover }, 'sm')}
          <span class="info">
            <span class="rt">${esc(r.title)}</span>
            <span class="ra">${esc(r.author || 'Autora desconhecida')}</span>
            <span class="rm">${[r.language === 'pt' ? 'Português' : r.language === 'en' ? 'Inglês' : '', r.pages ? `${r.pages} págs.` : '', r.year].filter(Boolean).join(' · ')}</span>
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
    <label class="search" for="cq">${ic.search}
      <input id="cq" type="search" value="${esc(s.q || '')}" placeholder="Buscar outra edição" autocomplete="off" enterkeyhint="search">
    </label>
    ${s.loading ? '<p class="hint">Buscando edições…</p>' : ''}
    ${!s.loading && !opts.length ? '<p class="hint">Nenhuma capa encontrada. Tente buscar pelo título em inglês ou pelo nome da autora.</p>' : ''}
    <div class="covergrid">
      ${opts.map((r) => `<button data-action="cover-pick" data-gid="${esc(r.gid)}" aria-pressed="${b.google_books_id === r.gid}" aria-label="${esc(r.title)} ${r.year || ''}">
        <img src="${esc(r.cover)}" alt="" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}
    </div>
  </div></div>`;
}

/* ---------------- render principal ---------------- */
function render() {
  if (!state.session) { renderAuth(); return; }
  const active = document.activeElement;
  const focusId = active?.id;
  const selStart = active?.selectionStart;
  const sheetScroll = document.querySelector('.sheet')?.scrollTop;

  let sheet = '';
  if (state.sheet?.kind === 'book') { const b = byId(state.sheet.id); sheet = b ? renderBook(b) : ''; }
  else if (state.sheet?.kind === 'add') sheet = renderAdd();
  else if (state.sheet?.kind === 'cover') { const b = byId(state.sheet.id); sheet = b ? renderCover(b) : ''; }

  app.innerHTML = `<div class="shell" ${sheet ? 'aria-hidden="true"' : ''}>${renderLibrary()}</div>${renderNav()}${sheet}`;
  document.body.style.overflow = sheet ? 'hidden' : '';

  const sh = document.querySelector('.sheet');
  if (sh && sheetScroll != null && state.sheet?.keepScroll) sh.scrollTop = sheetScroll;
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); try { if (selStart != null) el.setSelectionRange(selStart, selStart); } catch { /* campos sem seleção */ } }
  }
}

/* ---------------- ações ---------------- */
let searchTimer;
async function runAddSearch(q) {
  const s = state.sheet;
  s.q = q;
  if (!q.trim()) { s.results = null; render(); return; }
  s.loading = true; s.error = false; render();
  try {
    s.results = await gbSearch(q, { max: 30 });
  } catch { s.error = true; s.results = []; }
  if (state.sheet === s) { s.loading = false; render(); }
}
async function runCoverSearch(q) {
  const s = state.sheet;
  s.q = q; s.loading = true; render();
  try { s.results = await gbSearch(q, { max: 30 }); } catch { s.results = []; }
  if (state.sheet === s) { s.loading = false; render(); }
}

document.addEventListener('click', async (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  const sheet = state.sheet;
  const b = sheet?.id ? byId(sheet.id) : null;

  switch (a) {
    case 'toggle-auth':
      state.authMode = state.authMode === 'login' ? 'signup' : 'login'; state.authMsg = null; renderAuth(); break;
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
    case 'open':
      state.sheet = { kind: 'book', id: el.dataset.id }; render(); document.querySelector('.sheet')?.scrollTo(0, 0); break;
    case 'close':
      state.sheet = null; render(); break;
    case 'add':
      state.sheet = { kind: 'add', q: '', lang: '' }; render(); document.getElementById('gq')?.focus(); break;
    case 'lang':
      sheet.lang = el.dataset.value; render(); break;
    case 'pick':
      sheet.picked = sheet.results.find((r) => r.gid === el.dataset.gid); sheet.keepScroll = true; render(); document.querySelector('.picked')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
    case 'add-confirm': {
      const p = sheet.picked;
      const status = document.getElementById('p-status').value;
      el.disabled = true;
      const row = await insertBook({ title: p.title, author: p.author || null, pages: p.pages, language: p.language, cover_url: p.cover, google_books_id: p.gid, status, current_page: status === 'lendo' ? 0 : null });
      if (row) { state.sheet = { kind: 'book', id: row.id }; toast('Adicionado à Library'); render(); }
      else el.disabled = false;
      break;
    }
    case 'manual-on': sheet.manual = true; render(); document.getElementById('m-title')?.focus(); break;
    case 'manual-off': sheet.manual = false; render(); break;
    case 'rate': {
      const v = Number(el.dataset.value);
      sheet.keepScroll = true;
      updateBook(b.id, { rating: b.rating === v ? null : v }); break;
    }
    case 'sparkle':
      sheet.keepScroll = true;
      updateBook(b.id, { rating: b.rating === 6 ? 5 : 6 }); break;
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
      state.sheet = { kind: 'cover', id: b.id, q, results: [] };
      runCoverSearch(q); break;
    }
    case 'cover-pick': {
      const r = sheet.results.find((x) => x.gid === el.dataset.gid);
      updateBook(b.id, { cover_url: r.cover, google_books_id: r.gid }, { rerender: false });
      state.sheet = { kind: 'book', id: b.id }; render(); break;
    }
    case 'cover-remove':
      sheet.keepScroll = true;
      updateBook(b.id, { cover_url: null, google_books_id: null }); break;
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
  if (e.target.id === 'manualForm') {
    const f = e.target;
    const title = f.title.value.trim();
    if (!title) { toast('Escreva pelo menos o título.', true); return; }
    const status = f.status.value;
    const row = await insertBook({ title, author: f.author.value.trim() || null, pages: f.pages.value ? Number(f.pages.value) : null, status, current_page: status === 'lendo' ? 0 : null });
    if (row) { state.sheet = { kind: 'book', id: row.id }; toast('Adicionado à Library'); render(); }
  }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'q') { state.query = t.value; render(); return; }
  if (t.id === 'gq') { clearTimeout(searchTimer); const v = t.value; state.sheet.q = v; searchTimer = setTimeout(() => runAddSearch(v), 450); return; }
  if (t.id === 'cq') { clearTimeout(searchTimer); const v = t.value; searchTimer = setTimeout(() => runCoverSearch(v), 450); return; }
  if (t.id === 'why') {
    const b = byId(state.sheet.id);
    updateBook(b.id, { why_it_marked: t.value || null }, { rerender: false, quiet: true });
  }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  const field = t.dataset.field;
  if (!field || !state.sheet?.id || field === 'why_it_marked') return;
  const b = byId(state.sheet.id);
  let v;
  if (t.type === 'checkbox') v = t.checked;
  else if (t.type === 'number') v = t.value === '' ? null : Number(t.value);
  else v = t.value === '' ? null : t.value;
  const patch = { [field]: v };
  if (field === 'status' && v === 'lido' && !b.finished_at) patch.finished_at = new Date().toISOString().slice(0, 10);
  if (field === 'status' && v === 'lido' && b.pages) patch.current_page = b.pages;
  if (field === 'status' && v === 'lendo' && b.current_page == null) patch.current_page = 0;
  state.sheet.keepScroll = true;
  updateBook(b.id, patch);
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
  if (e.key === 'Escape' && state.sheet) { state.sheet = null; render(); }
});

/* ---------------- início ---------------- */
sb.auth.onAuthStateChange((_event, session) => {
  const was = state.session?.user?.id;
  state.session = session;
  if (!session) { state.books = []; state.loaded = false; state.sheet = null; renderAuth(); return; }
  if (was !== session.user.id) { state.authMsg = null; render(); loadBooks(); }
});
