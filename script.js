/** ---------- HELPERS ---------- **/
const byId = (id) => document.getElementById(id);

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function capitalize(s) {
  const str = String(s || "");
  return str ? str[0].toUpperCase() + str.slice(1) : str;
}

/** ---------- STORAGE ---------- **/
const STORAGE_KEYS = {
  SAVED: "kz_saved_ids_v1",
  THEME: "kz_theme_dark_v1",
  PREMIUM: "kz_premium_v1",
};

function loadSet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}
function loadBool(key, fallback = false) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "true";
}
function saveBool(key, v) {
  localStorage.setItem(key, v ? "true" : "false");
}

/** ---------- DATA (sample - replace with your 236 words) ---------- **/
const WORDS = [
  { id: 1, kanji: "意味", reading: "いみ", meaning: "meaning, significance", level: "N4", category: "Noun", premium: false },
  { id: 2, kanji: "飲む", reading: "のむ", meaning: "to drink", level: "N4", category: "Verb", premium: false },
  { id: 3, kanji: "競争", reading: "きょうそう", meaning: "competition", level: "N3", category: "Noun", premium: false },
  { id: 4, kanji: "改善", reading: "かいぜん", meaning: "improvement", level: "N3", category: "Noun", premium: false },
  { id: 5, kanji: "曖昧", reading: "あいまい", meaning: "ambiguous, vague", level: "N2", category: "Na-adjective", premium: false },
  { id: 6, kanji: "探求", reading: "たんきゅう", meaning: "pursuit", level: "N2", category: "Noun", premium: true },
];

/** ---------- STATE ---------- **/
const state = {
  tab: "words",      // words | saved
  q: "",
  level: "ALL",
  sort: "LEVEL",     // LEVEL | KANJI | MEANING
  dark: true,
  premiumOn: false,
  saved: new Set(),
  selected: null,
};

function levelRank(level) {
  if (level === "N4") return 1;
  if (level === "N3") return 2;
  if (level === "N2") return 3;
  return 9;
}

/** ---------- THEME / PREMIUM ---------- **/
function applyTheme() {
  // 現状はダーク固定UIだけど、トグルの見た目だけ反映
  byId("toggleTheme").textContent = state.dark ? "🌙" : "☀️";
  saveBool(STORAGE_KEYS.THEME, state.dark);
}
function syncPremiumUI() {
  byId("premiumState").textContent = state.premiumOn ? "ON" : "OFF";
  saveBool(STORAGE_KEYS.PREMIUM, state.premiumOn);
}

/** ---------- FILTER / SORT ---------- **/
function filteredWords() {
  const q = state.q.trim().toLowerCase();

  let list = WORDS.filter(w => {
    if (!state.premiumOn && w.premium) return false; // premium OFFなら隠す

    if (state.tab === "saved" && !state.saved.has(w.id)) return false;

    if (state.level !== "ALL" && w.level !== state.level) return false;

    if (!q) return true;

    const blob = `${w.kanji} ${w.reading} ${w.meaning} ${w.level} ${w.category}`.toLowerCase();
    return blob.includes(q);
  });

  if (state.sort === "LEVEL") {
    list.sort((a,b) => levelRank(a.level) - levelRank(b.level) || a.kanji.localeCompare(b.kanji));
  } else if (state.sort === "KANJI") {
    list.sort((a,b) => a.kanji.localeCompare(b.kanji));
  } else if (state.sort === "MEANING") {
    list.sort((a,b) => a.meaning.localeCompare(b.meaning));
  }
  return list;
}

/** ---------- SAVE ---------- **/
function toggleSave(id) {
  if (state.saved.has(id)) state.saved.delete(id);
  else state.saved.add(id);
  saveSet(STORAGE_KEYS.SAVED, state.saved);
  byId("savedCount").textContent = String(state.saved.size);
}

/** ---------- RENDER CARDS ---------- **/
function render() {
  const grid = byId("grid");
  const list = filteredWords();

  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<div style="opacity:.7;padding:18px;">No words found.</div>`;
    return;
  }

  list.forEach((word) => {
    const card = document.createElement("div");
    card.className = "card";

    const isSaved = state.saved.has(word.id);

    card.innerHTML = `
      <div class="card__kanji">${escapeHtml(word.kanji)}</div>
      <div class="card__reading">${escapeHtml(word.reading || "")}</div>
      <div class="card__meaning">${escapeHtml(word.meaning)}</div>

      <div class="card__row">
        <span class="pill">${escapeHtml(word.level)}</span>
        <button class="savebtn ${isSaved ? "saved" : ""}" data-save="${word.id}">
          ${isSaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    `;

    // card click => open modal
    card.addEventListener("click", () => openModal(word));

    // save button click should NOT open modal
    card.querySelector('[data-save]').addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSave(word.id);
      render();
    });

    grid.appendChild(card);
  });
}

/** ---------- MODAL UI (2nd screenshot style) ---------- **/
function jpWordTypeLabel(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("noun")) return "名詞";
  if (c.includes("verb")) return "動詞";
  if (c.includes("adverb")) return "副詞";
  if (c.includes("na")) return "形容動詞";
  if (c.includes("i-")) return "形容詞";
  if (c.includes("adj")) return "形容詞";
  return "—";
}
function enWordTypeLabel(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("noun")) return "Noun";
  if (c.includes("verb")) return "Verb";
  if (c.includes("adverb")) return "Adverb";
  if (c.includes("na")) return "Na-adjective";
  if (c.includes("i-")) return "I-adjective";
  if (c.includes("adj")) return "Adjective";
  return "—";
}

/** ---------- Better Examples (quality upgrade) ---------- **/
function buildBetterExamples(word) {
  // “とりあえず質を上げる”テンプレ版（不自然な連発を避ける）
  // ※最高品質にするなら WORDS に examples を持たせるのが最強
  if (Array.isArray(word.examples) && word.examples.length) {
    return word.examples.slice(0, 3);
  }

  const type = (word.category || "").toLowerCase();

  if (type.includes("verb")) {
    return [
      {
        jp: `毎日少しずつ「${word.kanji}」練習をしています。`,
        reading: `${word.reading}（単語）`,
        en: `I practice "${word.meaning}" a little every day.`,
      },
      {
        jp: `「${word.kanji}」前に、目的をはっきりさせましょう。`,
        reading: `${word.reading}（単語）`,
        en: `Before you ${word.meaning}, make your goal clear.`,
      },
    ];
  }

  if (type.includes("noun")) {
    return [
      {
        jp: `「${word.kanji}」について先生に質問しました。`,
        reading: `${word.reading}（単語）`,
        en: `I asked the teacher about "${word.meaning}".`,
      },
      {
        jp: `この場面では「${word.kanji}」が必要です。`,
        reading: `${word.reading}（単語）`,
        en: `"${capitalize(word.meaning)}" is necessary in this situation.`,
      },
    ];
  }

  if (type.includes("adj") || type.includes("na")) {
    return [
      {
        jp: `その説明は「${word.kanji}」なので、もう一度聞きたいです。`,
        reading: `${word.reading}（単語）`,
        en: `Because the explanation is "${word.meaning}", I want to hear it again.`,
      },
      {
        jp: `もっと「${word.kanji}」に言い換えてみましょう。`,
        reading: `${word.reading}（単語）`,
        en: `Let’s rephrase it to be more "${word.meaning}".`,
      },
    ];
  }

  return [
    {
      jp: `「${word.kanji}」の使い方を確認しましょう。`,
      reading: `${word.reading}（単語）`,
      en: `Let’s review how to use "${word.meaning}".`,
    },
    {
      jp: `この単語は会話でもよく出てきます。`,
      reading: `${word.reading}（単語）`,
      en: `This word appears often in conversation.`,
    },
  ];
}

function buildStudyTips(word) {
  const tips = [
    { icon: "💡", text: "Write this word 10 times and say it out loud." },
    { icon: "🎯", text: "Make 3 original sentences using this word." },
    { icon: "🎧", text: "Listen for it in videos/podcasts and note the context." },
  ];
  if (word.level === "N2" || word.premium) {
    tips.unshift({ icon: "🧠", text: "Compare it with similar words and write the nuance difference." });
  }
  return tips;
}

function openModal(word) {
  state.selected = word;

  byId("kzModalTitle").textContent = word.kanji;
  byId("kzModalReading").textContent = word.reading || "";
  byId("kzModalMeaning").textContent = word.meaning || "";

  byId("kzModalLevel").textContent = word.level || "—";
  byId("kzModalType").textContent = jpWordTypeLabel(word.category);
  byId("kzModalTypePill").textContent = enWordTypeLabel(word.category);

  const examples = buildBetterExamples(word);
  const exWrap = byId("kzModalExamples");
  exWrap.innerHTML = "";
  examples.forEach((ex) => {
    const div = document.createElement("div");
    div.className = "kz-example";
    div.innerHTML = `
      <div class="kz-example__jp">${escapeHtml(ex.jp)}</div>
      <div class="kz-example__reading">${escapeHtml(ex.reading || "")}</div>
      <div class="kz-example__en">${escapeHtml(ex.en)}</div>
    `;
    exWrap.appendChild(div);
  });

  const tips = buildStudyTips(word);
  const tipWrap = byId("kzModalTips");
  tipWrap.innerHTML = "";
  tips.forEach((t) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="kz-tip__icon">${t.icon}</span><span>${escapeHtml(t.text)}</span>`;
    tipWrap.appendChild(li);
  });

  // Save button
  const saveBtn = byId("kzModalSaveBtn");
  const isSaved = state.saved.has(word.id);
  saveBtn.textContent = isSaved ? "Saved" : "Save Word";
  saveBtn.onclick = () => {
    toggleSave(word.id);
    openModal(word); // refresh modal
    render();        // refresh list
  };

  // Copy
  const copyBtn = byId("kzModalCopyBtn");
  copyBtn.onclick = async () => {
    const text = `${word.kanji}（${word.reading}）: ${word.meaning}\n` +
      examples.map(e => `- ${e.jp} / ${e.en}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 900);
    } catch {
      copyBtn.textContent = "Copy failed";
      setTimeout(() => (copyBtn.textContent = "Copy"), 900);
    }
  };

  // Show modal
  const modal = byId("modal");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  // Close handlers
  modal.querySelectorAll("[data-close]").forEach((el) => (el.onclick = closeModal));
  document.addEventListener("keydown", onModalEsc);
}

function onModalEsc(e) {
  if (e.key === "Escape") closeModal();
}

function closeModal() {
  const modal = byId("modal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.removeEventListener("keydown", onModalEsc);
}

/** ---------- EVENTS ---------- **/
function wireEvents() {
  // Tabs
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.tab = btn.dataset.tab;
      render();
    });
  });

  byId("searchInput").addEventListener("input", (e) => {
    state.q = e.target.value;
    render();
  });

  byId("levelFilter").addEventListener("change", (e) => {
    state.level = e.target.value;
    render();
  });

  byId("sortBy").addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  byId("toggleTheme").addEventListener("click", () => {
    state.dark = !state.dark;
    applyTheme();
  });

  byId("togglePremium").addEventListener("click", () => {
    state.premiumOn = !state.premiumOn;
    syncPremiumUI();
    render();
  });
}

/** ---------- INIT ---------- **/
function init() {
  state.saved = loadSet(STORAGE_KEYS.SAVED);
  state.dark = loadBool(STORAGE_KEYS.THEME, true);
  state.premiumOn = loadBool(STORAGE_KEYS.PREMIUM, false);

  byId("savedCount").textContent = String(state.saved.size);

  applyTheme();
  syncPremiumUI();
  wireEvents();
  render();
}
init();
