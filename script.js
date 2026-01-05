/* Kaizen Japanese - simple vocab app (HTML/CSS/JS)
   Features:
   - search (kanji/reading/meaning)
   - filter by level (N4/N3/N2/Premium)
   - save ★ (localStorage)
   - light/dark theme (localStorage)
   - premium toggle (demo) to show/hide premium words
*/

const STORAGE_KEYS = {
  SAVED: "kaizen_saved_word_ids_v1",
  THEME: "kaizen_theme_v1",
  PREMIUM: "kaizen_premium_v1",
};

const byId = (id) => document.getElementById(id);

/** ---------- WORD DATA (236 words) ---------- **/
const WORDS = [
  // N4 (22)
  { id: 1, kanji: "出来る", reading: "できる", meaning: "to be able to, can do", level: "N4", premium: false },
  { id: 2, kanji: "勉強", reading: "べんきょう", meaning: "study, learning", level: "N4", premium: false },
  { id: 3, kanji: "多分", reading: "たぶん", meaning: "probably, perhaps", level: "N4", premium: false },
  { id: 4, kanji: "簡単", reading: "かんたん", meaning: "simple, easy", level: "N4", premium: false },
  { id: 5, kanji: "毎日", reading: "まいにち", meaning: "every day", level: "N4", premium: false },
  { id: 6, kanji: "問題", reading: "もんだい", meaning: "problem, question", level: "N4", premium: false },
  { id: 7, kanji: "気持ち", reading: "きもち", meaning: "feeling, mood", level: "N4", premium: false },
  { id: 8, kanji: "考える", reading: "かんがえる", meaning: "to think, consider", level: "N4", premium: false },
  { id: 9, kanji: "思う", reading: "おもう", meaning: "to think, feel", level: "N4", premium: false },
  { id: 10, kanji: "話す", reading: "はなす", meaning: "to speak, talk", level: "N4", premium: false },
  { id: 11, kanji: "聞く", reading: "きく", meaning: "to listen, hear", level: "N4", premium: false },
  { id: 12, kanji: "読む", reading: "よむ", meaning: "to read", level: "N4", premium: false },
  { id: 13, kanji: "書く", reading: "かく", meaning: "to write", level: "N4", premium: false },
  { id: 14, kanji: "見る", reading: "みる", meaning: "to see, watch", level: "N4", premium: false },
  { id: 15, kanji: "食べる", reading: "たべる", meaning: "to eat", level: "N4", premium: false },
  { id: 16, kanji: "飲む", reading: "のむ", meaning: "to drink", level: "N4", premium: false },
  { id: 17, kanji: "行く", reading: "いく", meaning: "to go", level: "N4", premium: false },
  { id: 18, kanji: "来る", reading: "くる", meaning: "to come", level: "N4", premium: false },
  { id: 19, kanji: "帰る", reading: "かえる", meaning: "to return, go home", level: "N4", premium: false },
  { id: 20, kanji: "教える", reading: "おしえる", meaning: "to teach, tell", level: "N4", premium: false },
  { id: 21, kanji: "学ぶ", reading: "まなぶ", meaning: "to learn, study", level: "N4", premium: false },
  { id: 22, kanji: "意味", reading: "いみ", meaning: "meaning, significance", level: "N4", premium: false },

  // N3 (23-115) 93 words (as provided list numbers)
  { id: 23, kanji: "意識", reading: "いしき", meaning: "consciousness, awareness", level: "N3", premium: false },
  { id: 24, kanji: "美しい", reading: "うつくしい", meaning: "beautiful", level: "N3", premium: false },
  { id: 25, kanji: "必要", reading: "ひつよう", meaning: "necessary, essential", level: "N3", premium: false },
  { id: 26, kanji: "素晴らしい", reading: "すばらしい", meaning: "wonderful, splendid", level: "N3", premium: false },
  { id: 27, kanji: "理解", reading: "りかい", meaning: "understanding, comprehension", level: "N3", premium: false },
  { id: 28, kanji: "例えば", reading: "たとえば", meaning: "for example", level: "N3", premium: false },
  { id: 29, kanji: "挑戦", reading: "ちょうせん", meaning: "challenge", level: "N3", premium: false },
  { id: 30, kanji: "変化", reading: "へんか", meaning: "change, transformation", level: "N3", premium: false },
  { id: 31, kanji: "経験", reading: "けいけん", meaning: "experience", level: "N3", premium: false },
  { id: 32, kanji: "実際", reading: "じっさい", meaning: "actually, in fact", level: "N3", premium: false },
  { id: 33, kanji: "成功", reading: "せいこう", meaning: "success", level: "N3", premium: false },
  { id: 34, kanji: "失敗", reading: "しっぱい", meaning: "failure, mistake", level: "N3", premium: false },
  { id: 35, kanji: "努力", reading: "どりょく", meaning: "effort, endeavor", level: "N3", premium: false },
  { id: 36, kanji: "重要", reading: "じゅうよう", meaning: "important, significant", level: "N3", premium: false },
  { id: 37, kanji: "複雑", reading: "ふくざつ", meaning: "complex, complicated", level: "N3", premium: false },
  { id: 38, kanji: "について", reading: "について", meaning: "about, regarding", level: "N3", premium: false },
  { id: 39, kanji: "解決", reading: "かいけつ", meaning: "solution, resolution", level: "N3", premium: false },
  { id: 40, kanji: "環境", reading: "かんきょう", meaning: "environment", level: "N3", premium: false },
  { id: 41, kanji: "条件", reading: "じょうけん", meaning: "condition, terms", level: "N3", premium: false },
  { id: 42, kanji: "規則", reading: "きそく", meaning: "rule, regulation", level: "N3", premium: false },
  { id: 43, kanji: "法律", reading: "ほうりつ", meaning: "law", level: "N3", premium: false },
  { id: 44, kanji: "権利", reading: "けんり", meaning: "right, privilege", level: "N3", premium: false },
  { id: 45, kanji: "責任", reading: "せきにん", meaning: "responsibility", level: "N3", premium: false },
  { id: 46, kanji: "目的", reading: "もくてき", meaning: "purpose, objective", level: "N3", premium: false },
  { id: 47, kanji: "目標", reading: "もくひょう", meaning: "goal, target", level: "N3", premium: false },
  { id: 48, kanji: "手段", reading: "しゅだん", meaning: "means, method", level: "N3", premium: false },
  { id: 49, kanji: "方法", reading: "ほうほう", meaning: "method, way", level: "N3", premium: false },
  { id: 50, kanji: "技術", reading: "ぎじゅつ", meaning: "technology, skill", level: "N3", premium: false },
  { id: 51, kanji: "能力", reading: "のうりょく", meaning: "ability, capacity", level: "N3", premium: false },
  { id: 52, kanji: "才能", reading: "さいのう", meaning: "talent, gift", level: "N3", premium: false },
  { id: 53, kanji: "資格", reading: "しかく", meaning: "qualification, license", level: "N3", premium: false },
  { id: 54, kanji: "知識", reading: "ちしき", meaning: "knowledge", level: "N3", premium: false },
  { id: 55, kanji: "情報", reading: "じょうほう", meaning: "information", level: "N3", premium: false },
  { id: 56, kanji: "資料", reading: "しりょう", meaning: "materials, data", level: "N3", premium: false },
  { id: 57, kanji: "記録", reading: "きろく", meaning: "record, documentation", level: "N3", premium: false },
  { id: 58, kanji: "事実", reading: "じじつ", meaning: "fact, truth", level: "N3", premium: false },
  { id: 59, kanji: "現実", reading: "げんじつ", meaning: "reality", level: "N3", premium: false },
  { id: 60, kanji: "真実", reading: "しんじつ", meaning: "truth", level: "N3", premium: false },
  { id: 61, kanji: "理由", reading: "りゆう", meaning: "reason, cause", level: "N3", premium: false },
  { id: 62, kanji: "原因", reading: "げんいん", meaning: "cause, origin", level: "N3", premium: false },
  { id: 63, kanji: "結果", reading: "けっか", meaning: "result, consequence", level: "N3", premium: false },
  { id: 64, kanji: "結論", reading: "けつろん", meaning: "conclusion", level: "N3", premium: false },
  { id: 65, kanji: "意見", reading: "いけん", meaning: "opinion, view", level: "N3", premium: false },
  { id: 66, kanji: "価値", reading: "かち", meaning: "value, worth", level: "N3", premium: false },
  { id: 67, kanji: "利益", reading: "りえき", meaning: "profit, benefit", level: "N3", premium: false },
  { id: 68, kanji: "危険", reading: "きけん", meaning: "danger, risk", level: "N3", premium: false },
  { id: 69, kanji: "安全", reading: "あんぜん", meaning: "safety, security", level: "N3", premium: false },
  { id: 70, kanji: "平和", reading: "へいわ", meaning: "peace", level: "N3", premium: false },
  { id: 71, kanji: "戦争", reading: "せんそう", meaning: "war", level: "N3", premium: false },
  { id: 72, kanji: "文化", reading: "ぶんか", meaning: "culture", level: "N3", premium: false },
  { id: 73, kanji: "伝統", reading: "でんとう", meaning: "tradition", level: "N3", premium: false },
  { id: 74, kanji: "習慣", reading: "しゅうかん", meaning: "custom, habit", level: "N3", premium: false },
  { id: 75, kanji: "社会", reading: "しゃかい", meaning: "society", level: "N3", premium: false },
  { id: 76, kanji: "政治", reading: "せいじ", meaning: "politics", level: "N3", premium: false },
  { id: 77, kanji: "経済", reading: "けいざい", meaning: "economy", level: "N3", premium: false },
  { id: 78, kanji: "産業", reading: "さんぎょう", meaning: "industry", level: "N3", premium: false },
  { id: 79, kanji: "増加", reading: "ぞうか", meaning: "increase", level: "N3", premium: false },
  { id: 80, kanji: "減少", reading: "げんしょう", meaning: "decrease", level: "N3", premium: false },
  { id: 81, kanji: "発展", reading: "はってん", meaning: "development, growth", level: "N3", premium: false },
  { id: 82, kanji: "進歩", reading: "しんぽ", meaning: "progress, advancement", level: "N3", premium: false },
  { id: 83, kanji: "改善", reading: "かいぜん", meaning: "improvement, reform", level: "N3", premium: false },
  { id: 84, kanji: "移動", reading: "いどう", meaning: "movement, migration", level: "N3", premium: false },
  { id: 85, kanji: "運動", reading: "うんどう", meaning: "exercise, movement", level: "N3", premium: false },
  { id: 86, kanji: "活動", reading: "かつどう", meaning: "activity, action", level: "N3", premium: false },
  { id: 87, kanji: "行動", reading: "こうどう", meaning: "action, behavior", level: "N3", premium: false },
  { id: 88, kanji: "反応", reading: "はんのう", meaning: "reaction, response", level: "N3", premium: false },
  { id: 89, kanji: "対応", reading: "たいおう", meaning: "response, correspondence", level: "N3", premium: false },
  { id: 90, kanji: "交流", reading: "こうりゅう", meaning: "exchange, interaction", level: "N3", premium: false },
  { id: 91, kanji: "関係", reading: "かんけい", meaning: "relationship, connection", level: "N3", premium: false },
  { id: 92, kanji: "連絡", reading: "れんらく", meaning: "contact, communication", level: "N3", premium: false },
  { id: 93, kanji: "協力", reading: "きょうりょく", meaning: "cooperation", level: "N3", premium: false },
  { id: 94, kanji: "競争", reading: "きょうそう", meaning: "competition", level: "N3", premium: false },
  { id: 95, kanji: "争い", reading: "あらそい", meaning: "dispute, conflict", level: "N3", premium: false },
  { id: 96, kanji: "確認", reading: "かくにん", meaning: "confirmation", level: "N3", premium: false },
  { id: 97, kanji: "決定", reading: "けってい", meaning: "decision", level: "N3", premium: false },
  { id: 98, kanji: "選択", reading: "せんたく", meaning: "choice, selection", level: "N3", premium: false },
  { id: 99, kanji: "比較", reading: "ひかく", meaning: "comparison", level: "N3", premium: false },
  { id: 100, kanji: "区別", reading: "くべつ", meaning: "distinction, discrimination", level: "N3", premium: false },
  { id: 101, kanji: "独立", reading: "どくりつ", meaning: "independence", level: "N3", premium: false },
  { id: 102, kanji: "保存", reading: "ほぞん", meaning: "preservation, conservation", level: "N3", premium: false },
  { id: 103, kanji: "生産", reading: "せいさん", meaning: "production", level: "N3", premium: false },
  { id: 104, kanji: "利用", reading: "りよう", meaning: "use, utilization", level: "N3", premium: false },
  { id: 105, kanji: "実行", reading: "じっこう", meaning: "execution, practice", level: "N3", premium: false },
  { id: 106, kanji: "完成", reading: "かんせい", meaning: "completion, perfection", level: "N3", premium: false },
  { id: 107, kanji: "終了", reading: "しゅうりょう", meaning: "end, termination", level: "N3", premium: false },
  { id: 108, kanji: "混乱", reading: "こんらん", meaning: "confusion, disorder", level: "N3", premium: false },
  { id: 109, kanji: "整理", reading: "せいり", meaning: "arrangement, organization", level: "N3", premium: false },
  { id: 110, kanji: "強化", reading: "きょうか", meaning: "strengthening, reinforcement", level: "N3", premium: false },
  { id: 111, kanji: "拡大", reading: "かくだい", meaning: "expansion, enlargement", level: "N3", premium: false },
  { id: 112, kanji: "延長", reading: "えんちょう", meaning: "extension, prolongation", level: "N3", premium: false },
  { id: 113, kanji: "上昇", reading: "じょうしょう", meaning: "rise, ascent", level: "N3", premium: false },
  { id: 114, kanji: "安定", reading: "あんてい", meaning: "stability, equilibrium", level: "N3", premium: false },
  { id: 115, kanji: "一致", reading: "いっち", meaning: "agreement, coincidence", level: "N3", premium: false },

  // N2 (116-186) 71 words (non-premium)
  { id: 116, kanji: "抽象的", reading: "ちゅうしょうてき", meaning: "abstract", level: "N2", premium: false },
  { id: 117, kanji: "具体的", reading: "ぐたいてき", meaning: "concrete, specific", level: "N2", premium: false },
  { id: 118, kanji: "適切", reading: "てきせつ", meaning: "appropriate, suitable", level: "N2", premium: false },
  { id: 119, kanji: "曖昧", reading: "あいまい", meaning: "ambiguous, vague", level: "N2", premium: false },
  { id: 120, kanji: "精神", reading: "せいしん", meaning: "spirit, mind, soul", level: "N2", premium: false },
  { id: 121, kanji: "概念", reading: "がいねん", meaning: "concept, notion", level: "N2", premium: false },
  { id: 122, kanji: "傾向", reading: "けいこう", meaning: "tendency, trend", level: "N2", premium: false },
  { id: 123, kanji: "背景", reading: "はいけい", meaning: "background, context", level: "N2", premium: false },
  { id: 124, kanji: "要素", reading: "ようそ", meaning: "element, factor", level: "N2", premium: false },
  { id: 125, kanji: "基準", reading: "きじゅん", meaning: "standard, criterion", level: "N2", premium: false },
  { id: 126, kanji: "原則", reading: "げんそく", meaning: "principle, rule", level: "N2", premium: false },
  { id: 127, kanji: "現象", reading: "げんしょう", meaning: "phenomenon", level: "N2", premium: false },
  { id: 128, kanji: "構造", reading: "こうぞう", meaning: "structure, construction", level: "N2", premium: false },
  { id: 129, kanji: "過程", reading: "かてい", meaning: "process, course", level: "N2", premium: false },
  { id: 130, kanji: "前提", reading: "ぜんてい", meaning: "premise, assumption", level: "N2", premium: false },
  { id: 131, kanji: "根拠", reading: "こんきょ", meaning: "basis, grounds", level: "N2", premium: false },
  { id: 132, kanji: "矛盾", reading: "むじゅん", meaning: "contradiction", level: "N2", premium: false },
  { id: 133, kanji: "論理", reading: "ろんり", meaning: "logic", level: "N2", premium: false },
  { id: 134, kanji: "推測", reading: "すいそく", meaning: "guess, speculation", level: "N2", premium: false },
  { id: 135, kanji: "仮定", reading: "かてい", meaning: "hypothesis, assumption", level: "N2", premium: false },
  { id: 136, kanji: "判断", reading: "はんだん", meaning: "judgment, decision", level: "N2", premium: false },
  { id: 137, kanji: "主張", reading: "しゅちょう", meaning: "assertion, claim", level: "N2", premium: false },
  { id: 138, kanji: "見解", reading: "けんかい", meaning: "view, opinion", level: "N2", premium: false },
  { id: 139, kanji: "視点", reading: "してん", meaning: "viewpoint, perspective", level: "N2", premium: false },
  { id: 140, kanji: "態度", reading: "たいど", meaning: "attitude, manner", level: "N2", premium: false },
  { id: 141, kanji: "姿勢", reading: "しせい", meaning: "posture, attitude", level: "N2", premium: false },
  { id: 142, kanji: "影響", reading: "えいきょう", meaning: "influence, effect", level: "N2", premium: false },
  { id: 143, kanji: "効果", reading: "こうか", meaning: "effect, effectiveness", level: "N2", premium: false },
  { id: 144, kanji: "役割", reading: "やくわり", meaning: "role, part", level: "N2", premium: false },
  { id: 145, kanji: "機能", reading: "きのう", meaning: "function", level: "N2", premium: false },
  { id: 146, kanji: "性質", reading: "せいしつ", meaning: "nature, property", level: "N2", premium: false },
  { id: 147, kanji: "特徴", reading: "とくちょう", meaning: "characteristic, feature", level: "N2", premium: false },
  { id: 148, kanji: "傾く", reading: "かたむく", meaning: "to lean, incline", level: "N2", premium: false },
  { id: 149, kanji: "補う", reading: "おぎなう", meaning: "to supplement, compensate", level: "N2", premium: false },
  { id: 150, kanji: "伴う", reading: "ともなう", meaning: "to accompany, involve", level: "N2", premium: false },
  { id: 151, kanji: "促す", reading: "うながす", meaning: "to urge, encourage", level: "N2", premium: false },
  { id: 152, kanji: "妨げる", reading: "さまたげる", meaning: "to hinder, obstruct", level: "N2", premium: false },
  { id: 153, kanji: "生じる", reading: "しょうじる", meaning: "to occur, arise", level: "N2", premium: false },
  { id: 154, kanji: "基づく", reading: "もとづく", meaning: "to be based on", level: "N2", premium: false },
  { id: 155, kanji: "関わる", reading: "かかわる", meaning: "to be involved, related", level: "N2", premium: false },
  { id: 156, kanji: "著しい", reading: "いちじるしい", meaning: "remarkable, striking", level: "N2", premium: false },
  { id: 157, kanji: "顕著", reading: "けんちょ", meaning: "remarkable, conspicuous", level: "N2", premium: false },
  { id: 158, kanji: "むしろ", reading: "むしろ", meaning: "rather, instead", level: "N2", premium: false },
  { id: 159, kanji: "極めて", reading: "きわめて", meaning: "extremely, exceedingly", level: "N2", premium: false },
  { id: 160, kanji: "次第に", reading: "しだいに", meaning: "gradually", level: "N2", premium: false },
  { id: 161, kanji: "一方", reading: "いっぽう", meaning: "on the other hand", level: "N2", premium: false },
  { id: 162, kanji: "に関して", reading: "にかんして", meaning: "regarding, concerning", level: "N2", premium: false },
  { id: 163, kanji: "に対して", reading: "にたいして", meaning: "towards, against", level: "N2", premium: false },
  { id: 164, kanji: "状況", reading: "じょうきょう", meaning: "situation, circumstances", level: "N2", premium: false },
  { id: 165, kanji: "制度", reading: "せいど", meaning: "system, institution", level: "N2", premium: false },
  { id: 166, kanji: "義務", reading: "ぎむ", meaning: "duty, obligation", level: "N2", premium: false },
  { id: 167, kanji: "態勢", reading: "たいせい", meaning: "readiness, posture", level: "N2", premium: false },
  { id: 168, kanji: "方針", reading: "ほうしん", meaning: "policy, course", level: "N2", premium: false },
  { id: 169, kanji: "証拠", reading: "しょうこ", meaning: "evidence, proof", level: "N2", premium: false },
  { id: 170, kanji: "損害", reading: "そんがい", meaning: "damage, loss", level: "N2", premium: false },
  { id: 171, kanji: "風習", reading: "ふうしゅう", meaning: "custom, manners", level: "N2", premium: false },
  { id: 172, kanji: "商業", reading: "しょうぎょう", meaning: "commerce, business", level: "N2", premium: false },
  { id: 173, kanji: "貿易", reading: "ぼうえき", meaning: "trade", level: "N2", premium: false },
  { id: 174, kanji: "輸出", reading: "ゆしゅつ", meaning: "export", level: "N2", premium: false },
  { id: 175, kanji: "輸入", reading: "ゆにゅう", meaning: "import", level: "N2", premium: false },
  { id: 176, kanji: "向上", reading: "こうじょう", meaning: "improvement, elevation", level: "N2", premium: false },
  { id: 177, kanji: "低下", reading: "ていか", meaning: "decline, fall", level: "N2", premium: false },
  { id: 178, kanji: "悪化", reading: "あっか", meaning: "deterioration, worsening", level: "N2", premium: false },
  { id: 179, kanji: "改革", reading: "かいかく", meaning: "reform, innovation", level: "N2", premium: false },
  { id: 180, kanji: "革命", reading: "かくめい", meaning: "revolution", level: "N2", premium: false },
  { id: 181, kanji: "接触", reading: "せっしょく", meaning: "contact, touch", level: "N2", premium: false },
  { id: 182, kanji: "対立", reading: "たいりつ", meaning: "confrontation, opposition", level: "N2", premium: false },
  { id: 183, kanji: "分類", reading: "ぶんるい", meaning: "classification", level: "N2", premium: false },
  { id: 184, kanji: "統一", reading: "とういつ", meaning: "unification, unity", level: "N2", premium: false },
  { id: 185, kanji: "依存", reading: "いぞん", meaning: "dependence, reliance", level: "N2", premium: false },
  { id: 186, kanji: "維持", reading: "いじ", meaning: "maintenance, preservation", level: "N2", premium: false },

  // Premium words (187-236) 50 words
  { id: 187, kanji: "探求", reading: "たんきゅう", meaning: "search, pursuit", level: "N2", premium: true },
  { id: 188, kanji: "洞察", reading: "どうさつ", meaning: "insight, discernment", level: "N2", premium: true },
  { id: 189, kanji: "克服", reading: "こくふく", meaning: "overcome, conquest", level: "N2", premium: true },
  { id: 190, kanji: "遂行", reading: "すいこう", meaning: "accomplishment, execution", level: "N2", premium: true },
  { id: 191, kanji: "促進", reading: "そくしん", meaning: "promotion, acceleration", level: "N2", premium: true },
  { id: 192, kanji: "抑制", reading: "よくせい", meaning: "suppression, control", level: "N2", premium: true },
  { id: 193, kanji: "蓄積", reading: "ちくせき", meaning: "accumulation, storage", level: "N2", premium: true },
  { id: 194, kanji: "継続", reading: "けいぞく", meaning: "continuation, succession", level: "N2", premium: true },
  { id: 195, kanji: "断絶", reading: "だんぜつ", meaning: "rupture, severance", level: "N2", premium: true },
  { id: 196, kanji: "融合", reading: "ゆうごう", meaning: "fusion, amalgamation", level: "N2", premium: true },
  { id: 197, kanji: "分離", reading: "ぶんり", meaning: "separation, isolation", level: "N2", premium: true },
  { id: 198, kanji: "統制", reading: "とうせい", meaning: "control, regulation", level: "N2", premium: true },
  { id: 199, kanji: "規制", reading: "きせい", meaning: "regulation, restriction", level: "N2", premium: true },
  { id: 200, kanji: "緩和", reading: "かんわ", meaning: "relaxation, mitigation", level: "N2", premium: true },
  { id: 201, kanji: "弱化", reading: "じゃっか", meaning: "weakening, enfeeblement", level: "N2", premium: true },
  { id: 202, kanji: "縮小", reading: "しゅくしょう", meaning: "reduction, curtailment", level: "N2", premium: true },
  { id: 203, kanji: "短縮", reading: "たんしゅく", meaning: "shortening, reduction", level: "N2", premium: true },
  { id: 204, kanji: "下降", reading: "かこう", meaning: "descent, fall", level: "N2", premium: true },
  { id: 205, kanji: "変動", reading: "へんどう", meaning: "fluctuation, change", level: "N2", premium: true },
  { id: 206, kanji: "不安定", reading: "ふあんてい", meaning: "instability, unsteadiness", level: "N2", premium: true },
  { id: 207, kanji: "均衡", reading: "きんこう", meaning: "balance, equilibrium", level: "N2", premium: true },
  { id: 208, kanji: "偏り", reading: "かたより", meaning: "bias, inclination", level: "N2", premium: true },
  { id: 209, kanji: "調和", reading: "ちょうわ", meaning: "harmony, balance", level: "N2", premium: true },
  { id: 210, kanji: "対照", reading: "たいしょう", meaning: "contrast, comparison", level: "N2", premium: true },
  { id: 211, kanji: "類似", reading: "るいじ", meaning: "similarity, resemblance", level: "N2", premium: true },
  { id: 212, kanji: "相違", reading: "そうい", meaning: "difference, discrepancy", level: "N2", premium: true },
  { id: 213, kanji: "適応", reading: "てきおう", meaning: "adaptation, adjustment", level: "N2", premium: true },
  { id: 214, kanji: "順応", reading: "じゅんのう", meaning: "adaptation, acclimation", level: "N2", premium: true },
  { id: 215, kanji: "抵抗", reading: "ていこう", meaning: "resistance, opposition", level: "N2", premium: true },
  { id: 216, kanji: "妥協", reading: "だきょう", meaning: "compromise", level: "N2", premium: true },
  { id: 217, kanji: "譲歩", reading: "じょうほ", meaning: "concession, compromise", level: "N2", premium: true },
  { id: 218, kanji: "主導", reading: "しゅどう", meaning: "leadership, initiative", level: "N2", premium: true },
  { id: 219, kanji: "追従", reading: "ついじゅう", meaning: "following, pursuing", level: "N2", premium: true },
  { id: 220, kanji: "先駆", reading: "せんく", meaning: "pioneer, forerunner", level: "N2", premium: true },
  { id: 221, kanji: "後退", reading: "こうたい", meaning: "retreat, regression", level: "N2", premium: true },
  { id: 222, kanji: "飛躍", reading: "ひやく", meaning: "leap, jump", level: "N2", premium: true },
  { id: 223, kanji: "停滞", reading: "ていたい", meaning: "stagnation, standstill", level: "N2", premium: true },
  { id: 224, kanji: "活性化", reading: "かっせいか", meaning: "activation, revitalization", level: "N2", premium: true },
  { id: 225, kanji: "沈滞", reading: "ちんたい", meaning: "stagnation, depression", level: "N2", premium: true },
  { id: 226, kanji: "繁栄", reading: "はんえい", meaning: "prosperity, flourishing", level: "N2", premium: true },
  { id: 227, kanji: "衰退", reading: "すいたい", meaning: "decline, decay", level: "N2", premium: true },
  { id: 228, kanji: "興隆", reading: "こうりゅう", meaning: "prosperity, rise", level: "N2", premium: true },
  { id: 229, kanji: "破壊", reading: "はかい", meaning: "destruction", level: "N2", premium: true },
  { id: 230, kanji: "創造", reading: "そうぞう", meaning: "creation", level: "N2", premium: true },
  { id: 231, kanji: "製造", reading: "せいぞう", meaning: "manufacture", level: "N2", premium: true },
  { id: 232, kanji: "加工", reading: "かこう", meaning: "processing", level: "N2", premium: true },
  { id: 233, kanji: "応用", reading: "おうよう", meaning: "application", level: "N2", premium: true },
  { id: 234, kanji: "採用", reading: "さいよう", meaning: "adoption, employment", level: "N2", premium: true },
  { id: 235, kanji: "実施", reading: "じっし", meaning: "implementation, execution", level: "N2", premium: true },
  { id: 236, kanji: "達成", reading: "たっせい", meaning: "achievement, attainment", level: "N2", premium: true },
];

/** ---------- STATE ---------- **/
const state = {
  tab: "words",
  q: "",
  level: "ALL", // ALL | N4 | N3 | N2 | PREMIUM
  sort: "LEVEL", // LEVEL | KANJI
  saved: new Set(),
  dark: true,
  premiumOn: false, // demo
};

/** ---------- STORAGE HELPERS ---------- **/
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
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

function loadBool(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "true";
  } catch {
    return fallback;
  }
}

function saveBool(key, val) {
  localStorage.setItem(key, String(Boolean(val)));
}

/** ---------- INIT ---------- **/
function init() {
  state.saved = loadSet(STORAGE_KEYS.SAVED);
  state.dark = loadBool(STORAGE_KEYS.THEME, true);
  state.premiumOn = loadBool(STORAGE_KEYS.PREMIUM, false);

  applyTheme();
  syncPremiumUI();
  wireEvents();
  render();
}

function wireEvents() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
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
    saveBool(STORAGE_KEYS.THEME, state.dark);
    applyTheme();
  });

  byId("togglePremium").addEventListener("click", () => {
    state.premiumOn = !state.premiumOn;
    saveBool(STORAGE_KEYS.PREMIUM, state.premiumOn);
    syncPremiumUI();
    render();
  });

  byId("modal").addEventListener("click", (e) => {
    if (e.target.dataset.close) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/** ---------- THEME ---------- **/
function applyTheme() {
  const root = document.documentElement;
  if (state.dark) root.classList.remove("light");
  else root.classList.add("light");
}

function syncPremiumUI() {
  byId("premiumState").textContent = state.premiumOn ? "ON" : "OFF";
}

/** ---------- TAB ---------- **/
function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  byId("list").classList.toggle("hidden", tab !== "words");
  byId("savedList").classList.toggle("hidden", tab !== "saved");
  render();
}

/** ---------- FILTER / SORT ---------- **/
function isPremiumVisible(word) {
  // premium words are visible only when premiumOn is true
  if (!word.premium) return true;
  return state.premiumOn;
}

function matchesLevel(word) {
  if (state.level === "ALL") return true;
  if (state.level === "PREMIUM") return word.premium === true && isPremiumVisible(word);
  return word.level === state.level && isPremiumVisible(word);
}

function matchesQuery(word) {
  const q = state.q.trim().toLowerCase();
  if (!q) return true;
  const hay = `${word.kanji} ${word.reading} ${word.meaning}`.toLowerCase();
  return hay.includes(q);
}

function levelRank(w) {
  // N4 -> 1, N3 -> 2, N2 -> 3, premium N2 -> 4 (so premium can float last)
  if (w.premium) return 4;
  if (w.level === "N4") return 1;
  if (w.level === "N3") return 2;
  return 3;
}

function sortWords(arr) {
  const copy = [...arr];
  if (state.sort === "KANJI") {
    copy.sort((a, b) => a.kanji.localeCompare(b.kanji, "ja"));
    return copy;
  }
  // LEVEL
  copy.sort((a, b) => {
    const r = levelRank(a) - levelRank(b);
    if (r !== 0) return r;
    return a.kanji.localeCompare(b.kanji, "ja");
  });
  return copy;
}

/** ---------- SAVE ---------- **/
function toggleSave(id) {
  if (state.saved.has(id)) state.saved.delete(id);
  else state.saved.add(id);

  saveSet(STORAGE_KEYS.SAVED, state.saved);
  render();
}

/** ---------- UI RENDER ---------- **/
function render() {
  const visibleWords = WORDS
    .filter(isPremiumVisible)
    .filter(matchesLevel)
    .filter(matchesQuery);

  const sorted = sortWords(visibleWords);

  const savedWords = WORDS
    .filter((w) => state.saved.has(w.id))
    .filter(isPremiumVisible)
    .filter(matchesQuery);

  byId("savedCount").textContent = String(state.saved.size);

  if (state.tab === "words") {
    renderList(byId("list"), sorted);
  } else {
    renderList(byId("savedList"), sortWords(savedWords));
  }
}

function renderList(container, words) {
  container.innerHTML = "";

  if (words.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.style.cursor = "default";
    empty.innerHTML = `
      <div class="kanji">No results</div>
      <div class="reading">Try another search or filter.</div>
      <div class="meaning">Premium words only show when Premium is ON.</div>
    `;
    container.appendChild(empty);
    return;
  }

  words.forEach((w) => container.appendChild(buildCard(w)));
}

function buildCard(word) {
  const card = document.createElement("div");
  card.className = "card";
  card.addEventListener("click", () => openModal(word));

  const saved = state.saved.has(word.id);

  const saveBtn = document.createElement("button");
  saveBtn.className = `saveBtn ${saved ? "saved" : ""}`;
  saveBtn.type = "button";
  saveBtn.textContent = saved ? "★ Saved" : "☆ Save";
  saveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSave(word.id);
  });

  const premiumTag = word.premium ? `<span class="tag premium">Premium</span>` : "";
  const levelTag = `<span class="tag">${word.level}</span>`;

  card.innerHTML = `
    <div class="rowTop">
      <div>
        <div class="kanji">${escapeHtml(word.kanji)}</div>
        <div class="reading">${escapeHtml(word.reading)}</div>
      </div>
      <div class="right"></div>
    </div>
    <div class="meaning">${escapeHtml(word.meaning)}</div>
    <div class="meta">
      ${levelTag}
      ${premiumTag}
    </div>
  `;

  card.querySelector(".right").appendChild(saveBtn);
  return card;
}

/** ---------- MODAL ---------- **/
function openModal(word) {
  const body = byId("modalBody");
  const saved = state.saved.has(word.id);

  body.innerHTML = `
    <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
      <div>
        <div style="font-size:34px; font-weight:900; letter-spacing:0.02em;">${escapeHtml(word.kanji)}</div>
        <div style="margin-top:6px; color:var(--muted); font-weight:800;">${escapeHtml(word.reading)}</div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <span class="tag">${escapeHtml(word.level)}</span>
        ${word.premium ? `<span class="tag premium">Premium</span>` : ""}
      </div>
    </div>

    <div style="margin-top:14px; font-size:16px; line-height:1.6;">
      <b>Meaning:</b> ${escapeHtml(word.meaning)}
    </div>

    <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn primary" id="modalSave" type="button">
        ${saved ? "★ Saved" : "☆ Save"}
      </button>
      <button class="btn ghost" id="copyWord" type="button">Copy</button>
    </div>

    <div style="margin-top:14px; color:var(--muted); font-size:12px;">
      Tip: You can search by kanji / reading / meaning.
    </div>
  `;

  byId("modal").classList.remove("hidden");

  byId("modalSave").addEventListener("click", () => {
    toggleSave(word.id);
    // update modal button label
    const nowSaved = state.saved.has(word.id);
    byId("modalSave").textContent = nowSaved ? "★ Saved" : "☆ Save";
  });

  byId("copyWord").addEventListener("click", async () => {
    const text = `${word.kanji}（${word.reading}）- ${word.meaning}`;
    try {
      await navigator.clipboard.writeText(text);
      byId("copyWord").textContent = "Copied!";
      setTimeout(() => (byId("copyWord").textContent = "Copy"), 900);
    } catch {
      byId("copyWord").textContent = "Copy failed";
      setTimeout(() => (byId("copyWord").textContent = "Copy"), 900);
    }
  });
}

function closeModal() {
  byId("modal").classList.add("hidden");
}

/** ---------- UTIL ---------- **/
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
