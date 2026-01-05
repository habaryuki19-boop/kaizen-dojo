// ---- Data (small sample; you can paste the full list) ----
const vocabularyData = [
  { id: 1, kanji: '意識', reading: 'いしき', meaning: 'consciousness, awareness', level: 'N3', category: 'Noun' },
  { id: 2, kanji: '出来る', reading: 'できる', meaning: 'to be able to, can do', level: 'N4', category: 'Verb' },
  { id: 3, kanji: '美しい', reading: 'うつくしい', meaning: 'beautiful', level: 'N3', category: 'Adjective' },
  { id: 9, kanji: '例えば', reading: 'たとえば', meaning: 'for example', level: 'N3', category: 'Expression' },
  { id: 21, kanji: 'について', reading: 'について', meaning: 'about, regarding', level: 'N3', category: 'Particle' },
];

// ---- State ----
const state = {
  dark: true,
  tab: 'words',
  q: '',
  filter: 'All',
  saved: new Set(JSON.parse(localStorage.getItem('savedWords') || '[]')),
  selected: null,
};

const categories = ['All', 'Noun', 'Verb', 'Adjective', 'Adverb', 'Particle', 'Expression'];

// ---- Helpers ----
function persistSaved(){
  localStorage.setItem('savedWords', JSON.stringify([...state.saved]));
}
function setTheme(){
  document.body.classList.toggle('light', !state.dark);
  document.body.classList.toggle('dark', state.dark);
  document.getElementById('toggleTheme').textContent = state.dark ? '🌙' : '☀️';
}
function switchTab(tab){
  state.tab = tab;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('is-active', p.id === `tab-${tab}`));
  render();
}
function filteredWords(){
  const q = state.q.trim().toLowerCase();
  return vocabularyData.filter(w => {
    const matchesSearch = !q ||
      w.kanji.includes(state.q) ||
      w.reading.includes(state.q) ||
      w.meaning.toLowerCase().includes(q);

    const matchesFilter = state.filter === 'All' || w.category === state.filter;
    return matchesSearch && matchesFilter;
  });
}

function getWordDetails(word){
  const base = word.meaning.split(',')[0];
  const ex = {
    'Noun': [
      { jp: `${word.kanji}は重要です。`, rm: `${word.reading} wa jūyō desu.`, en: `${base} is important.` },
      { jp: `この${word.kanji}について話しましょう。`, rm: `Kono ${word.reading} ni tsuite hanashimashō.`, en: `Let's talk about this ${base}.` }
    ],
    'Verb': [
      { jp: `毎日${word.kanji}。`, rm: `Mainichi ${word.reading}.`, en: `${base} every day.` },
      { jp: `私は${word.kanji}たいです。`, rm: `Watashi wa ${word.reading}tai desu.`, en: `I want to ${base}.` }
    ],
    'Adjective': [
      { jp: `とても${word.kanji}です。`, rm: `Totemo ${word.reading} desu.`, en: `It's very ${base}.` },
      { jp: `${word.kanji}人です。`, rm: `${word.reading} hito desu.`, en: `A ${base} person.` }
    ],
    'Adverb': [
      { jp: `${word.kanji}行きます。`, rm: `${word.reading} ikimasu.`, en: `Go ${base}.` },
      { jp: `${word.kanji}考えています。`, rm: `${word.reading} kangaete imasu.`, en: `Thinking ${base}.` }
    ],
    'Particle': [
      { jp: `日本語${word.kanji}勉強します。`, rm: `Nihongo ${word.reading} benkyō shimasu.`, en: `Study ${base} Japanese.` }
    ],
    'Expression': [
      { jp: `${word.kanji}、これは大切です。`, rm: `${word.reading}, kore wa taisetsu desu.`, en: `${word.meaning}, this is important.` }
    ]
  };
  return ex[word.category] || ex['Noun'];
}

function openModal(word){
  state.selected = word;
  document.getElementById('mKanji').textContent = word.kanji;
  document.getElementById('mReading').textContent = word.reading;
  document.getElementById('mMeaning').textContent = word.meaning;
  document.getElementById('mLevel').textContent = word.level;
  document.getElementById('mCat').textContent = word.category;

  const exWrap = document.getElementById('mExamples');
  exWrap.innerHTML = '';
  getWordDetails(word).forEach(e => {
    const div = document.createElement('div');
    div.className = 'example';
    div.innerHTML = `
      <div class="jp">${e.jp}</div>
      <div class="rm">${e.rm}</div>
      <div class="en">${e.en}</div>
    `;
    exWrap.appendChild(div);
  });

  const btn = document.getElementById('mSaveBtn');
  btn.textContent = state.saved.has(word.id) ? 'Saved' : 'Save Word';
  btn.classList.toggle('primary', !state.saved.has(word.id));
  btn.onclick = () => {
    toggleSave(word.id);
    btn.textContent = state.saved.has(word.id) ? 'Saved' : 'Save Word';
  };

  document.getElementById('modal').classList.remove('hidden');
}
function closeModal(){
  document.getElementById('modal').classList.add('hidden');
  state.selected = null;
}

function toggleSave(id){
  if(state.saved.has(id)) state.saved.delete(id);
  else state.saved.add(id);
  persistSaved();
  render();
}

function renderFilters(){
  const wrap = document.getElementById('filters');
  wrap.innerHTML = '';
  categories.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'filter' + (state.filter === cat ? ' is-active' : '');
    b.textContent = cat;
    b.onclick = () => { state.filter = cat; render(); };
    wrap.appendChild(b);
  });
}

function renderWords(){
  const list = document.getElementById('wordList');
  list.innerHTML = '';

  const words = filteredWords();
  words.forEach(w => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-row">
        <div class="word-main">
          <div class="word-top">
            <div class="word-kanji">${w.kanji}</div>
            <span class="pill ghost">${w.category}</span>
            <span class="pill level">${w.level}</span>
          </div>
          <div class="word-reading">${w.reading}</div>
          <div class="word-meaning">${w.meaning}</div>
        </div>
        <button class="save-btn ${state.saved.has(w.id) ? 'is-saved' : ''}" aria-label="save">🔖</button>
      </div>
    `;

    card.addEventListener('click', () => openModal(w));
    card.querySelector('.save-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSave(w.id);
    });

    list.appendChild(card);
  });

  // stats
  document.getElementById('statWords').textContent = vocabularyData.length;
  document.getElementById('statSaved').textContent = state.saved.size;
}

function renderSaved(){
  const savedList = document.getElementById('savedList');
  const empty = document.getElementById('savedEmpty');

  const savedWords = vocabularyData.filter(w => state.saved.has(w.id));
  savedList.innerHTML = '';

  if(savedWords.length === 0){
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  savedWords.forEach(w => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-row">
        <div class="word-main">
          <div class="word-top">
            <div class="word-kanji">${w.kanji}</div>
            <span class="pill ghost">${w.category}</span>
            <span class="pill level">${w.level}</span>
          </div>
          <div class="word-reading">${w.reading}</div>
          <div class="word-meaning">${w.meaning}</div>
        </div>
        <button class="save-btn is-saved" aria-label="unsave">✅</button>
      </div>
    `;
    card.addEventListener('click', () => openModal(w));
    card.querySelector('.save-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSave(w.id);
    });
    savedList.appendChild(card);
  });
}

function render(){
  renderFilters();
  renderWords();
  renderSaved();
}

// ---- Events ----
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

document.getElementById('goSaved').addEventListener('click', () => switchTab('saved'));

document.getElementById('searchInput').addEventListener('input', (e) => {
  state.q = e.target.value;
  render();
});

document.getElementById('toggleTheme').addEventListener('click', () => {
  state.dark = !state.dark;
  setTheme();
});

document.getElementById('modal').addEventListener('click', (e) => {
  if(e.target.dataset.close) closeModal();
});

// init
setTheme();
render();
