const catalogueEl = document.getElementById('catalogue');
const watchlistEl = document.getElementById('watchlist');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const typeFilter = document.getElementById('typeFilter');
const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('appToast'), {delay: 3000});
let titles = [];
let authMode = 'login';

function notify(message) {
  document.getElementById('toastMessage').textContent = message;
  toast.show();
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
async function loadCatalogue() {
  const status = document.getElementById('loadingStatus');
  status.textContent = 'Loading catalogue…';
  try {
    const response = await fetch('./data/titles.json');
    if (!response.ok) throw new Error('Catalogue request failed');
    titles = await response.json();
    if (!Array.isArray(titles) || titles.length < 1) throw new Error('Catalogue is empty');
    status.textContent = 'Catalogue loaded successfully.';
  } catch (error) {
    // Reliable fallback keeps the catalogue usable if a host blocks local JSON fetching.
    titles = fallbackTitles;
    status.textContent = 'Using built-in catalogue fallback because the data file could not be loaded.';
    notify('Catalogue loaded.');
  }
  document.getElementById('catalogueCount').textContent = `${titles.length} titles`;
  renderCatalogue();
  renderWatchlist();
}
const fallbackTitles = [
  {id:1,title:'Mountain Kingdom',genre:'Documentary',type:'Documentary',year:2025,duration:'42 min',description:'A journey through Lesotho highlands and mountain landscapes.',poster:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700',trailer:'https://www.youtube.com/watch?v=aqz-KE-bpKQ'},
  {id:2,title:'The Last Shepherd',genre:'Drama',type:'Film',year:2024,duration:'1h 38min',description:'A young shepherd protects his family land.',poster:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700',trailer:'https://www.youtube.com/watch?v=aqz-KE-bpKQ'},
  {id:3,title:'Code Your Future',genre:'Education',type:'Educational',year:2025,duration:'28 min',description:'An introduction to digital skills and web design.',poster:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700',trailer:'https://www.youtube.com/watch?v=aqz-KE-bpKQ'}
];
function cardHTML(item, inList=false) {
 return `<div class="col-6 col-md-4 col-xl-3"><article class="video-card">
  <div class="poster-wrap"><img src="${escapeHTML(item.poster)}" alt="Poster image for ${escapeHTML(item.title)}" loading="lazy" onerror="this.src='https://placehold.co/600x800/17211d/c2df9b?text=LesothoStream'"><span class="poster-tag">${escapeHTML(item.genre)}</span></div>
  <div class="video-card-body"><h3>${escapeHTML(item.title)}</h3><div class="card-meta">${escapeHTML(item.type)} · ${item.year} · ${escapeHTML(item.duration)}</div><p>${escapeHTML(item.description)}</p>
  <div class="card-actions"><button class="btn btn-brand btn-card" data-action="details" data-id="${item.id}">Details</button>${inList?`<button class="btn btn-outline-green btn-card list-remove" data-action="remove" data-id="${item.id}">Remove</button>`:`<button class="btn btn-outline-green btn-card" data-action="add" data-id="${item.id}">+ My List</button>`}</div></div>
 </article></div>`;
}
function renderCatalogue() {
 const term = searchInput.value.trim().toLowerCase();
 const genre = genreFilter.value;
 const type = typeFilter.value;
 const filtered = titles.filter(item => {
  const matchesText = `${item.title} ${item.description}`.toLowerCase().includes(term);
  return matchesText && (genre === 'all' || item.genre === genre) && (type === 'all' || item.type === type);
 });
 catalogueEl.innerHTML = filtered.map(item => cardHTML(item)).join('');
 document.getElementById('emptySearch').classList.toggle('d-none', filtered.length !== 0);
}
function listStorageKey() { const user = getCurrentUser(); return user?.email ? `lesothostream-list-${user.email.toLowerCase()}` : 'lesothostream-list'; }
function getList() { try { return JSON.parse(localStorage.getItem(listStorageKey()) || '[]'); } catch { return []; } }
function saveList(list) { localStorage.setItem(listStorageKey(), JSON.stringify(list)); renderWatchlist(); }
function renderWatchlist() {
 const ids = getList();
 const term = (document.getElementById('listSearch')?.value || '').trim().toLowerCase();
 const sort = document.getElementById('listSort')?.value || 'recent';
 let saved = ids.map(id => titles.find(item => item.id === id)).filter(Boolean);
 if (term) saved = saved.filter(item => `${item.title} ${item.description} ${item.genre}`.toLowerCase().includes(term));
 if (sort === 'title') saved.sort((a,b) => a.title.localeCompare(b.title));
 if (sort === 'year') saved.sort((a,b) => b.year - a.year);
 watchlistEl.innerHTML = saved.map(item => cardHTML(item, true)).join('');
 document.getElementById('listCount').textContent = `${ids.length} saved`;
 document.getElementById('listEmpty').classList.toggle('d-none', ids.length > 0);
 document.getElementById('listSummary').textContent = ids.length ? `${ids.length} ${ids.length === 1 ? 'title' : 'titles'} saved · ${saved.length} shown` : 'Your personal watchlist will appear here.';
 if (ids.length && !saved.length) watchlistEl.innerHTML = '<div class="col-12"><div class="empty-state">No saved titles match that search. Try another word.</div></div>';
}
function showDetails(id) {
 const item = titles.find(entry => entry.id === Number(id));
 if (!item) return;
 document.getElementById('titleModalLabel').textContent = item.title;
 document.getElementById('titleDetails').innerHTML = `<img class="detail-poster" src="${escapeHTML(item.poster)}" alt="Poster for ${escapeHTML(item.title)}"><div class="eyebrow">${escapeHTML(item.genre)} · ${escapeHTML(item.type)}</div><p class="muted">${item.year} · ${escapeHTML(item.duration)}</p><p>${escapeHTML(item.description)}</p><a class="btn btn-brand" href="${escapeHTML(item.trailer)}" target="_blank" rel="noopener noreferrer">Watch sample trailer ↗</a><p class="small muted mt-3 mb-0">Trailer link opens on an external video platform.</p>`;
 bootstrap.Modal.getOrCreateInstance(document.getElementById('titleModal')).show();
}
document.addEventListener('click', event => {
 const button = event.target.closest('[data-action]');
 if (!button) return;
 const id = Number(button.dataset.id);
 if (button.dataset.action === 'details') showDetails(id);
 if (button.dataset.action === 'add') {
  const list = getList();
  if (list.includes(id)) notify('This title is already in My List.');
  else { list.push(id); saveList(list); notify('Title added to My List.'); }
 }
 if (button.dataset.action === 'remove') {
  saveList(getList().filter(savedId => savedId !== id));
  notify('Title removed from My List.');
 }
});
[searchInput, genreFilter, typeFilter].forEach(control => control.addEventListener(control === searchInput ? 'input' : 'change', renderCatalogue));


const AUTH_USERS_KEY = 'lesothostream-accounts';
const CURRENT_USER_KEY = 'lesothostream-current-user';
function getAccounts() { try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]'); } catch { return []; } }
function setAccounts(accounts) { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(accounts)); }
function getCurrentUser() { try { return JSON.parse(sessionStorage.getItem(CURRENT_USER_KEY) || 'null'); } catch { return null; } }
function setAuthError(message='') {
 const el = document.getElementById('authError');
 el.textContent = message;
 el.classList.toggle('d-none', !message);
}
async function hashPassword(value, salt) {
 const encoder = new TextEncoder();
 const key = await crypto.subtle.importKey('raw', encoder.encode(value), 'PBKDF2', false, ['deriveBits']);
 const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:encoder.encode(salt), iterations:120000, hash:'SHA-256'}, key, 256);
 return Array.from(new Uint8Array(bits)).map(byte => byte.toString(16).padStart(2,'0')).join('');
}
function setAuthMode(mode) {
 authMode = mode;
 const registering = mode === 'register';
 document.getElementById('loginTab').classList.toggle('active', !registering);
 document.getElementById('registerTab').classList.toggle('active', registering);
 document.getElementById('loginTab').setAttribute('aria-selected', String(!registering));
 document.getElementById('registerTab').setAttribute('aria-selected', String(registering));
 document.getElementById('authEyebrow').textContent = registering ? 'BECOME A MEMBER' : 'WELCOME BACK';
 document.getElementById('authHeading').textContent = registering ? 'Create your account' : 'Sign in to continue';
 document.getElementById('authDescription').textContent = registering ? 'A few details are all you need to get started.' : 'Your next favourite story is waiting.';
 document.getElementById('authSubmit').textContent = registering ? 'Create account' : 'Sign in';
 document.getElementById('registerNameGroup').classList.toggle('d-none', !registering);
 document.getElementById('confirmPasswordGroup').classList.toggle('d-none', !registering);
 document.getElementById('registerLanguageGroup').classList.toggle('d-none', !registering);
 document.getElementById('authName').required = registering;
 document.getElementById('authConfirmPassword').required = registering;
 document.getElementById('authPassword').autocomplete = registering ? 'new-password' : 'current-password';
 document.getElementById('authSwitchText').innerHTML = registering
  ? 'Already have an account? <button type="button" class="link-button" id="switchToLogin">Sign in</button>'
  : 'New to LesothoStream? <button type="button" class="link-button" id="switchToRegister">Create an account</button>';
 document.getElementById('authForm').classList.remove('was-validated');
 document.getElementById('authForm').querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
 document.getElementById('authForm').reset();
 setAuthError('');
}
document.getElementById('loginTab').addEventListener('click', () => setAuthMode('login'));
document.getElementById('registerTab').addEventListener('click', () => setAuthMode('register'));
document.getElementById('authSwitchText').addEventListener('click', event => {
 if (event.target.id === 'switchToRegister') setAuthMode('register');
 if (event.target.id === 'switchToLogin') setAuthMode('login');
});
document.getElementById('togglePassword').addEventListener('click', () => {
 const input = document.getElementById('authPassword');
 const showing = input.type === 'text';
 input.type = showing ? 'password' : 'text';
 document.getElementById('togglePassword').textContent = showing ? 'Show' : 'Hide';
});
document.getElementById('authForm').addEventListener('submit', async event => {
 event.preventDefault();
 const form = event.currentTarget;
 const email = document.getElementById('authEmail').value.trim().toLowerCase();
 const password = document.getElementById('authPassword').value;
 const name = document.getElementById('authName').value.trim();
 const confirm = document.getElementById('authConfirmPassword').value;
 document.getElementById('authEmail').value = email;
 document.getElementById('authName').value = name;
 document.getElementById('authEmail').setCustomValidity(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.');
 document.getElementById('authPassword').setCustomValidity(password.length >= 8 ? '' : 'Use at least 8 characters.');
 document.getElementById('authName').setCustomValidity(authMode === 'register' && name.length < 2 ? 'Enter your name.' : '');
 document.getElementById('authConfirmPassword').setCustomValidity(authMode === 'register' && confirm !== password ? 'Passwords do not match.' : '');
 if (!form.checkValidity()) {
  form.classList.add('was-validated');
  const invalid = form.querySelector(':invalid');
  if (invalid) invalid.focus();
  return;
 }
 const submit = document.getElementById('authSubmit');
 submit.disabled = true;
 submit.textContent = authMode === 'register' ? 'Creating account…' : 'Signing in…';
 try {
  const accounts = getAccounts();
  const existing = accounts.find(account => account.email === email);
  let user;
  if (authMode === 'register') {
   if (existing) { setAuthError('An account with this email already exists. Please sign in instead.'); return; }
   const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(byte => byte.toString(16).padStart(2,'0')).join('');
   const passwordHash = await hashPassword(password, salt);
   user = {name, email, salt, passwordHash, language: document.getElementById('authLanguage').value, createdAt: new Date().toISOString()};
   accounts.push(user);
   setAccounts(accounts);
   notify('Your account has been created. Welcome to LesothoStream.');
  } else {
   const passwordHash = existing ? await hashPassword(password, existing.salt) : '';
   if (!existing || existing.passwordHash !== passwordHash) { setAuthError('The email address or password is incorrect. Please try again.'); return; }
   user = existing;
   notify(`Welcome back, ${user.name}.`);
  }
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify({name:user.name,email:user.email,language:user.language || 'English'}));
  openApplication();
 } catch (error) {
  setAuthError('We could not complete that request. Please try again.');
 } finally {
  submit.disabled = false;
  submit.textContent = authMode === 'register' ? 'Create account' : 'Sign in';
 }
});
function openApplication() {
 const user = getCurrentUser();
 if (!user) return;
 document.getElementById('authGate').classList.add('d-none');
 document.getElementById('appShell').classList.remove('d-none');
 const area = document.getElementById('authArea');
 area.innerHTML = `<button class="account-menu" id="accountMenu" type="button"><span class="auth-avatar">${escapeHTML(user.name.charAt(0).toUpperCase())}</span><span class="account-menu-name">${escapeHTML(user.name)}</span><span aria-hidden="true">⌄</span></button>`;
 document.getElementById('accountMenu').addEventListener('click', showProfile);
 renderWatchlist();
}
function showProfile() {
 const user = getCurrentUser();
 if (!user) return;
 document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
 document.getElementById('profileName').textContent = user.name;
 document.getElementById('profileEmail').textContent = user.email;
 document.getElementById('profileLanguage').textContent = user.language || 'English';
 bootstrap.Modal.getOrCreateInstance(document.getElementById('profileModal')).show();
}
function signOut() {
 sessionStorage.removeItem(CURRENT_USER_KEY);
 document.getElementById('appShell').classList.add('d-none');
 document.getElementById('authGate').classList.remove('d-none');
 bootstrap.Modal.getInstance(document.getElementById('profileModal'))?.hide();
 setAuthMode('login');
 notify('You have signed out.');
}
document.getElementById('profileSignOut').addEventListener('click', signOut);
document.getElementById('listSearch').addEventListener('input', renderWatchlist);
document.getElementById('listSort').addEventListener('change', renderWatchlist);
document.getElementById('clearListBtn').addEventListener('click', () => {
 if (!getList().length) { notify('Your list is already empty.'); return; }
 if (window.confirm('Remove all saved titles from My List?')) { saveList([]); notify('My List has been cleared.'); }
});
document.getElementById('contactMessage').addEventListener('input', event => {
 document.getElementById('messageCount').textContent = `${event.target.value.length} / 1000`;
});
document.getElementById('contactForm').addEventListener('submit', event => {
 event.preventDefault();
 if (!event.target.checkValidity()) { event.target.reportValidity(); return; }
 const messages = JSON.parse(localStorage.getItem('lesothostream-messages') || '[]');
 messages.push({name:document.getElementById('contactName').value.trim(),email:document.getElementById('contactEmail').value.trim(),topic:document.getElementById('contactTopic').value,message:document.getElementById('contactMessage').value.trim(),sentAt:new Date().toISOString()});
 localStorage.setItem('lesothostream-messages', JSON.stringify(messages));
 notify('Thank you for contacting LesothoStream. Your message has been saved.');
 event.target.reset();
 document.getElementById('messageCount').textContent = '0 / 1000';
});
setAuthMode('login');
if (getCurrentUser()) openApplication();
loadCatalogue();
