/**********************************************************
 * Kaizen Japanese (HTML/CSS/JS) - 50 words
 * - POS tags (English) + filters
 * - Modal details (better examples) + save + copy
 **********************************************************/

/**********************************************************
 * 50 WORDS (mix of N4/N3/N2) - you can replace anytime
 **********************************************************/
const RAW_WORD_LIST = `
## N4
1. 出来る (できる) - to be able to, can do
2. 勉強 (べんきょう) - study, learning
3. 多分 (たぶん) - probably, perhaps
4. 簡単 (かんたん) - simple, easy
5. 毎日 (まいにち) - every day
6. 問題 (もんだい) - problem, question
7. 気持ち (きもち) - feeling, mood
8. 考える (かんがえる) - to think, consider
9. 思う (おもう) - to think, feel
10. 話す (はなす) - to speak, talk
11. 聞く (きく) - to listen, hear
12. 読む (よむ) - to read
13. 書く (かく) - to write
14. 見る (みる) - to see, watch
15. 食べる (たべる) - to eat
16. 飲む (のむ) - to drink
17. 行く (いく) - to go
18. 来る (くる) - to come
19. 帰る (かえる) - to return, go home
20. 教える (おしえる) - to teach, tell

## N3
21. 意識 (いしき) - consciousness, awareness
22. 美しい (うつくしい) - beautiful
23. 必要 (ひつよう) - necessary, essential
24. 素晴らしい (すばらしい) - wonderful, splendid
25. 理解 (りかい) - understanding, comprehension
26. 例えば (たとえば) - for example
27. 挑戦 (ちょうせん) - challenge
28. 変化 (へんか) - change, transformation
29. 経験 (けいけん) - experience
30. 実際 (じっさい) - actually, in fact
31. 成功 (せいこう) - success
32. 失敗 (しっぱい) - failure, mistake
33. 努力 (どりょく) - effort, endeavor
34. 重要 (じゅうよう) - important, significant
35. 複雑 (ふくざつ) - complex, complicated
36. 解決 (かいけつ) - solution, resolution
37. 環境 (かんきょう) - environment
38. 条件 (じょうけん) - condition, terms
39. 規則 (きそく) - rule, regulation
40. 責任 (せきにん) - responsibility

## N2
41. 生産（せいさん） - production
42. 消費（しょうひ） - consumption
43. 需要（じゅよう） - demand
44. 供給（きょうきゅう） - supply
45. 増加（ぞうか） - increase
46. 減少（げんしょう） - decrease
47. 発展（はってん） - development
48. 進歩（しんぽ） - progress
49. 改善（かいぜん） - improvement
50. 向上（こうじょう） - improvement, enhancement

51. 低下（ていか） - decline
52. 悪化（あっか） - deterioration
53. 維持（いじ） - maintenance
54. 安定（あんてい） - stability
55. 変動（へんどう） - fluctuation
56. 混乱（こんらん） - confusion
57. 調整（ちょうせい） - adjustment
58. 管理（かんり） - management
59. 実施（じっし） - implementation
60. 達成（たっせい） - achievement

61. 実行（じっこう） - execution
62. 完成（かんせい） - completion
63. 過程（かてい） - process
64. 手段（しゅだん） - means, method
65. 方法（ほうほう） - method
66. 対応（たいおう） - response
67. 協力（きょうりょく） - cooperation
68. 対立（たいりつ） - confrontation
69. 競争（きょうそう） - competition
70. 争い（あらそい） - conflict

71. 一致（いっち） - agreement
72. 相違（そうい） - difference
73. 類似（るいじ） - similarity
74. 比較（ひかく） - comparison
75. 区別（くべつ） - distinction
76. 分類（ぶんるい） - classification
77. 統一（とういつ） - unity
78. 独立（どくりつ） - independence
79. 依存（いぞん） - dependence
80. 関連（かんれん） - relation

81. 関与（かんよ） - involvement
82. 影響力（えいきょうりょく） - influence
83. 促進（そくしん） - promotion
84. 抑制（よくせい） - suppression
85. 妥協（だきょう） - compromise
86. 譲歩（じょうほ） - concession
87. 主導（しゅどう） - leadership
88. 停滞（ていたい） - stagnation
89. 繁栄（はんえい） - prosperity
90. 衰退（すいたい） - decline

91. 創造（そうぞう） - creation
92. 革新（かくしん） - innovation
93. 改革（かいかく） - reform
94. 革命（かくめい） - revolution
95. 構造（こうぞう） - structure
96. 機能（きのう） - function
97. 性質（せいしつ） - nature, property
98. 特徴（とくちょう） - feature
99. 著しい（いちじるしい） - remarkable
100. 極めて（きわめて） - extremely

`;

/** ---------- STATE ---------- **/
const STORAGE_KEYS = {
  SAVED: "kaizen_saved_words_v1",
  THEME: "kaizen_theme_dark_v1",
  PREMIUM: "kaizen_premium_on_v1",
  POS_OVERRIDES: "kaizen_pos_overrides_v1",
};

const state = {
  tab: "words",
  q: "",
  level: "All",
  pos: "All",
  sort: "Level",
  saved: new Set(),
  dark: true,
  premiumOn: false,
  posOverrides: {},
  modalWordId: null,
};

let words = [];

/** ---------- DOM HELPERS ---------- **/
const byId = (id) => document.getElementById(id);

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** ---------- STORAGE ---------- **/
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}
function loadSet(key) {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(arr);
  } catch {
    return new Set();
  }
}
function saveBool(key, val) {
  localStorage.setItem(key, val ? "1" : "0");
}
function loadBool(key, fallback) {
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "1";
}
function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}
function saveJson(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

/** ---------- POS GUESS (English) ---------- **/
function guessPOS(kanji) {
  const s = String(kanji);

  // expressions
  if (s === "について" || s === "に関して" || s === "に対して") return "Expression";

  // common adverbs
  const adverbs = new Set(["むしろ", "極めて", "次第に", "一方", "例えば", "多分", "実際"]);
  if (adverbs.has(s)) return "Adverb";

  // i-adjective
  if (s.endsWith("い") && s.length >= 2) return "Adjective";

  // Kanji + okurigana -> likely verb
  if (/[ぁ-んー]$/.test(s)) return "Verb";

  return "Noun";
}

/** ---------- EXAMPLES (better quality) ---------- **/
function buildExamples(kanji, reading, meaning, level) {
  const m = meaning.split(",")[0].trim();

  if (level === "N4") {
    return [
      {
        jp: `今日は${kanji}？`,
        romaji: `Kyō wa "${reading}"?`,
        en: `Can you ${m} today?`,
      },
      {
        jp: `毎日${kanji}と上達が早いです。`,
        romaji: `Mainichi "${reading}" to jōtatsu ga hayai desu.`,
        en: `If you ${m} every day, you’ll improve faster.`,
      },
      {
        jp: `${kanji}のコツを教えてください。`,
        romaji: `"${reading}" no kotsu o oshiete kudasai.`,
        en: `Please tell me tips for "${m}".`,
      },
    ];
  }

  if (level === "N3") {
    return [
      {
        jp: `この${kanji}について、あなたの意見を聞かせてください。`,
        romaji: `Kono "${reading}" ni tsuite, anata no iken o kikasete kudasai.`,
        en: `Tell me your opinion about this "${m}".`,
      },
      {
        jp: `${kanji}を変えるのは簡単ではありません。`,
        romaji: `"${reading}" o kaeru no wa kantan dewa arimasen.`,
        en: `Changing "${m}" isn’t easy.`,
      },
      {
        jp: `失敗から学ぶことが${kanji}につながります。`,
        romaji: `Shippai kara manabu koto ga "${reading}" ni tsunagarimasu.`,
        en: `Learning from failure leads to "${m}".`,
      },
    ];
  }

  // N2
  return [
    {
      jp: `${kanji}を説明するには、まず前提を整理する必要があります。`,
      romaji: `"${reading}" o setsumei suru ni wa, mazu zentei o seiri suru hitsuyō ga arimasu.`,
      en: `To explain "${m}", we first need to clarify the assumptions.`,
    },
    {
      jp: `この${kanji}は、背景と根拠を示すと説得力が増します。`,
      romaji: `Kono "${reading}" wa, haikei to konkyo o shimesu to settokuryoku ga mashimasu.`,
      en: `This "${m}" becomes more convincing when you show context and evidence.`,
    },
    {
      jp: `${kanji}の違いを具体例で比較してみましょう。`,
      romaji: `"${reading}" no chigai o gutairei de hikaku shite mimashō.`,
      en: `Let’s compare the differences in "${m}" using concrete examples.`,
    },
  ];
}

/** ---------- PARSER ---------- **/
function parseWordList(raw) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  let currentLevel = null;
  let isPremium = false;

  const out = [];
  let id = 1;

  for (const line of lines) {
    if (line.startsWith("##")) {
      if (line.includes("N4")) { currentLevel = "N4"; isPremium = false; }
      else if (line.includes("N3")) { currentLevel = "N3"; isPremium = false; }
      else if (line.includes("N2")) { currentLevel = "N2"; isPremium = false; }
      continue;
    }

    const m = line.match(/^\d+\.\s*(.+?)\s*\((.+?)\)\s*-\s*(.+)$/);
    if (!m) continue;

    const kanji = m[1].trim();
    const reading = m[2].trim();
    const meaning = m[3].trim();

    const pos = guessPOS(kanji);

    out.push({
      id: id++,
      kanji,
      reading,
      meaning,
      level: currentLevel || "N3",
      premium: Boolean(isPremium),
      pos,
      examples: buildExamples(kanji, reading, meaning, currentLevel || "N3"),
      tips: [
        "Say it out loud 5 times with rhythm.",
        "Write 2 original sentences using this word.",
        "Review tomorrow + 3 days later (spaced repetition).",
      ],
    });
  }

  return out;
}

/** ---------- UI HELPERS ---------- **/
function isSaved(id) {
  return state.saved.has(id);
}

function populatePosFilter() {
  const select = byId("posFilter");
  if (!select) return;

  select.innerHTML = `<option value="All">All POS</option>`;
  const posSet = new Set(words.map(w => w.pos).filter(Boolean));
  const list = Array.from(posSet).sort((a,b)=>a.localeCompare(b));
  for (const p of list) {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  }
}

function levelRank(level) {
  if (level === "N4") return 1;
  if (level === "N3") return 2;
  if (level === "N2") return 3;
  return 99;
}

/** ---------- FILTER + SORT ---------- **/
function getFilteredWords() {
  const q = state.q.trim().toLowerCase();
  let list = words.slice();

  // premium toggle: if OFF, hide premium words (in this 50 set, none are premium—kept for compatibility)
  if (!state.premiumOn) list = list.filter(w => !w.premium);

  if (state.tab === "saved") list = list.filter(w => state.saved.has(w.id));

  if (q) {
    list = list.filter(w =>
      w.kanji.toLowerCase().includes(q) ||
      w.reading.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q) ||
      (w.pos || "").toLowerCase().includes(q)
    );
  }

  if (state.level !== "All") list = list.filter(w => w.level === state.level);
  if (state.pos !== "All") list = list.filter(w => w.pos === state.pos);

  if (state.sort === "Level") {
    list.sort((a,b) => levelRank(a.level) - levelRank(b.level) || a.kanji.localeCompare(b.kanji));
  } else if (state.sort === "A-Z") {
    list.sort((a,b) => a.kanji.localeCompare(b.kanji));
  } else if (state.sort === "Saved") {
    list.sort((a,b) => (isSaved(b.id) - isSaved(a.id)) || a.kanji.localeCompare(b.kanji));
  }

  return list;
}

/** ---------- RENDER ---------- **/
function render() {
  const grid = byId("grid");
  const empty = byId("emptyState");
  const savedCount = byId("savedCount");
  const premiumLabel = byId("premiumLabel");

  if (savedCount) savedCount.textContent = String(state.saved.size);
  if (premiumLabel) premiumLabel.textContent = state.premiumOn ? "ON" : "OFF";

  const list = getFilteredWords();

  if (!grid) return;

  grid.innerHTML = "";
  if (!list.length) {
    empty && empty.classList.remove("hidden");
    return;
  }
  empty && empty.classList.add("hidden");

  for (const w of list) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = String(w.id);

    const savedClass = isSaved(w.id) ? "savedOn" : "";
    const saveText = isSaved(w.id) ? "★ Saved" : "☆ Save";

    card.innerHTML = `
      <div class="cardTop">
        <div>
          <div class="cardKanji">${escapeHtml(w.kanji)}</div>
          <div class="cardReading">${escapeHtml(w.reading)}</div>
          <div class="cardMeaning">${escapeHtml(w.meaning)}</div>
        </div>
        <button class="saveSmall ${savedClass}" data-save="1" data-id="${w.id}">${saveText}</button>
      </div>

      <div class="tagRow">
        <span class="tag level">${escapeHtml(w.level)}</span>
        <span class="tag pos">${escapeHtml(w.pos)}</span>
      </div>
    `;

    card.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-save='1']");
      if (btn) return;
      openModal(w.id);
    });

    card.querySelector("[data-save='1']").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSave(w.id);
      render();
    });

    grid.appendChild(card);
  }
}

/** ---------- SAVE ---------- **/
function toggleSave(id) {
  if (state.saved.has(id)) state.saved.delete(id);
  else state.saved.add(id);
  saveSet(STORAGE_KEYS.SAVED, state.saved);
}

/** ---------- MODAL ---------- **/
function openModal(id) {
  const w = words.find(x => x.id === id);
  if (!w) return;

  state.modalWordId = id;

  byId("mKanji") && (byId("mKanji").textContent = w.kanji);
  byId("mReading") && (byId("mReading").textContent = w.reading);
  byId("mMeaning") && (byId("mMeaning").textContent = w.meaning);

  byId("mPosChip") && (byId("mPosChip").textContent = w.pos || "—");
  byId("mLevelChip") && (byId("mLevelChip").textContent = w.level || "—");
  byId("mPosLine") && (byId("mPosLine").textContent = w.pos || "—");

  const premiumChip = byId("mPremiumChip");
  if (premiumChip) {
    if (w.premium) premiumChip.classList.remove("hidden");
    else premiumChip.classList.add("hidden");
  }

  const ex = byId("mExamples");
  if (ex) {
    ex.innerHTML = "";
    (w.examples || []).forEach(item => {
      const box = document.createElement("div");
      box.className = "example";
      box.innerHTML = `
        <div class="jp">${escapeHtml(item.jp)}</div>
        <div class="romaji">${escapeHtml(item.romaji)}</div>
        <div class="en">${escapeHtml(item.en)}</div>
      `;
      ex.appendChild(box);
    });
  }

  const tips = byId("mTips");
  if (tips) {
    tips.innerHTML = "";
    (w.tips || []).forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      tips.appendChild(li);
    });
  }

  const saveBtn = byId("modalSave");
  if (saveBtn) {
    saveBtn.textContent = isSaved(w.id) ? "★ Saved" : "☆ Save Word";
    saveBtn.onclick = () => {
      toggleSave(w.id);
      saveBtn.textContent = isSaved(w.id) ? "★ Saved" : "☆ Save Word";
      render();
    };
  }

  const copyBtn = byId("modalCopy");
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const text = `${w.kanji} (${w.reading}) - ${w.meaning}`;
      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
        setTimeout(()=> (copyBtn.textContent="Copy"), 900);
      } catch {
        copyBtn.textContent = "Copy failed";
        setTimeout(()=> (copyBtn.textContent="Copy"), 900);
      }
    };
  }

  // POS editor (optional)
  const posSelect = byId("posSelect");
  if (posSelect) posSelect.value = w.pos || "Noun";

  const posSaveBtn = byId("posSaveBtn");
  if (posSaveBtn && posSelect) {
    posSaveBtn.onclick = () => {
      const newPos = posSelect.value;
      w.pos = newPos;

      const key = `${w.kanji}__${w.reading}`;
      state.posOverrides[key] = newPos;
      saveJson(STORAGE_KEYS.POS_OVERRIDES, state.posOverrides);

      byId("mPosLine") && (byId("mPosLine").textContent = newPos);
      byId("mPosChip") && (byId("mPosChip").textContent = newPos);

      populatePosFilter();
      render();

      posSaveBtn.textContent = "Saved!";
      setTimeout(() => (posSaveBtn.textContent = "Save POS"), 800);
    };
  }

  showModal(true);
}

function showModal(open) {
  const modal = byId("modal");
  if (!modal) return;

  if (open) {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  } else {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    state.modalWordId = null;
  }
}

/** ---------- EVENTS ---------- **/
function wireEvents() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.tab = btn.dataset.tab;
      render();
    });
  });

  const search = byId("searchInput");
  if (search) {
    search.addEventListener("input", (e) => {
      state.q = e.target.value;
      render();
    });
  }

  const level = byId("levelFilter");
  if (level) {
    level.addEventListener("change", (e) => {
      state.level = e.target.value;
      render();
    });
  }

  const pos = byId("posFilter");
  if (pos) {
    pos.addEventListener("change", (e) => {
      state.pos = e.target.value;
      render();
    });
  }

  const sort = byId("sortBy");
  if (sort) {
    sort.addEventListener("change", (e) => {
      state.sort = e.target.value;
      render();
    });
  }

  const themeBtn = byId("toggleTheme");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      state.dark = !state.dark;
      saveBool(STORAGE_KEYS.THEME, state.dark);
      applyTheme();
    });
  }

  const premBtn = byId("togglePremium");
  if (premBtn) {
    premBtn.addEventListener("click", () => {
      state.premiumOn = !state.premiumOn;
      saveBool(STORAGE_KEYS.PREMIUM, state.premiumOn);
      render();
    });
  }

  const close1 = byId("closeModal");
  if (close1) close1.addEventListener("click", () => showModal(false));

  const close2 = byId("modalClose");
  if (close2) close2.addEventListener("click", () => showModal(false));

  const modal = byId("modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close) showModal(false);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") showModal(false);
  });
}

/** ---------- THEME ---------- **/
function applyTheme() {
  const btn = byId("toggleTheme");
  if (btn) btn.textContent = state.dark ? "🌙" : "☀️";

  // if your CSS uses body.dark, keep this
  document.body.classList.toggle("dark", state.dark);
}

/** ---------- INIT ---------- **/
function init() {
  state.saved = loadSet(STORAGE_KEYS.SAVED);
  state.dark = loadBool(STORAGE_KEYS.THEME, true);
  state.premiumOn = loadBool(STORAGE_KEYS.PREMIUM, false);
  state.posOverrides = loadJson(STORAGE_KEYS.POS_OVERRIDES, {});

  words = parseWordList(RAW_WORD_LIST);

  // apply POS overrides
  for (const w of words) {
    const key = `${w.kanji}__${w.reading}`;
    if (state.posOverrides[key]) w.pos = state.posOverrides[key];
  }

  populatePosFilter();
  applyTheme();
  wireEvents();
  render();
}

init();
