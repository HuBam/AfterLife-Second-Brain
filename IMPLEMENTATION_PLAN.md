# AfterLife — Second Brain: Evolution Roadmap
> A cybernetic personal optimization and documentation platform. 10 phases, ordered by importance.
> Each phase represents a scale-up stage — complete one before starting the next.

---

## ⚡ Cross-Cutting Requirements
*These must be addressed throughout every phase.*

- [ ] **Environment Config** — `.env` for all API keys with `.env.example` committed to repo
- [ ] **Copyright** — © AfterLife — Second Brain by HuBam. Footer credit in-app + LICENSE file in repo

---

## Phase 1: Neural Foundation
*Status: ✅ Complete*
*Stage: Build the shell. The app exists and navigates.*

- [x] Cybernetic Dashboard with hex menu navigation
- [x] Avatar Health HUD — 3D skeleton with organ diagnostics
- [x] Five Realms: Cerebra, Elysia, Empyra, Oblivion, Sanctum
- [x] User persistence via Zustand (MBTI, onboarding, settings)
- [x] Basic / Advanced mode toggle during onboarding

> 🗃️ **Data:** Local Zustand store (no external APIs needed)

---

## Phase 2: Cognitive Synthesis & Echo AI
*Status: 🔄 Active — Complete before moving forward*
*Stage: Make the app intelligent. Static logs become active intelligence.*

- [x] Echo AI interface — neural link for realm balance advice
- [x] Glassmorphism visual polish + neon glow aesthetic
- [ ] **Dynamic Balance Engine** — weighted XP scoring per realm entry type
- [ ] **Echo Understanding %** — score driven by habits, skills, achievements, and realm data
- [ ] **Neural Pulse** — real-time AI interruptions on the dashboard with action suggestions
- [ ] **Sentiment Analysis** — auto-detect mood trends from Empyra logs

> 🔌 **APIs Needed:**
> - **OpenAI API** (`gpt-4o` or `gpt-4o-mini`) — Echo AI chat, sentiment analysis, neural pulse suggestions
>   - Key: `VITE_OPENAI_API_KEY`
>   - Free alternative: **Ollama** (local LLM, no cost)
>
> 🗃️ **Data Needed:**
> - Realm entry logs (type, timestamp, content) stored in Zustand/localStorage
> - Habit completion history
> - Skill/achievement records
> - Weighting tables: entry type → XP value (define locally in `/src/data/`)

---

## Phase 3: Foundation Polish & Responsive Design
*Status: 🔲 Next*
*Stage: Make the app solid everywhere. No point stacking features on a broken foundation.*

- [ ] **Full Responsive Layout** — fluid design across all screen sizes:
  - 📱 Phones (iOS + Android)
  - 📱 Tablets + iPad
  - 💻 PC (Windows / Linux)
  - 🍎 Mac
- [ ] Touch-friendly tap targets and gesture support
- [ ] Responsive typography and spacing scale
- [ ] Test and fix layout issues on each realm and page
- [ ] Add copyright footer across the app
- [ ] Create `.env` + `.env.example` for all API keys

> 🔌 **APIs Needed:** None
>
> 🗃️ **Data Needed:** None — pure CSS/layout work

---

## Phase 4: Chronos & Temporal Mapping
*Status: 🔲 Planned*
*Stage: Add the time dimension. The past, present, and future become visible.*

- [x] Timeline (Chronos) page — vertical scroll-based feed
- [ ] **Habit completions + prayer logs injected into Timeline** — game-style display for Advanced mode
- [ ] **Life Path Visualization** — life expectancy countdown with urgency coloring (green → yellow → red)
- [ ] **Life expectancy editable in Settings** — adjustable via mood logs and medical reports
- [ ] **Deep Recap Engine** — Pulse Graphs showing how each realm grew over the week
- [ ] **Chronos Button** on Dashboard linking to Timeline

**Upgrade — "Time Dilation":**
- [ ] Rewind the dashboard to any past date
- [ ] Projected future trends — 6-month lifestyle forecast based on current patterns

> 🔌 **APIs Needed:**
> - **OpenAI API** — for generating 6-month lifestyle forecast text (reuses Phase 2 key)
>
> 🗃️ **Data Needed:**
> - Dated habit logs (timestamp per completion)
> - Dated realm entry logs (timestamp per entry)
> - Life expectancy input (user-entered DOB + expected age, stored in Zustand)
> - Medical reports (user-entered text/notes, stored locally)
> - WHO/statistical life expectancy tables (static local data file `/src/data/lifeExpectancyData.js`)

---

## Phase 5: Spiritual Intelligence & Religion Layer
*Status: 🔲 Planned*
*Stage: Deepen the soul. Spirituality becomes a living, intelligent system.*

- [x] Prayer Tracker with streak logging
- [x] Qibla Compass
- [x] Scripture Tracker
- [x] Religion Widget with quotes and calendar
- [ ] **Ramadan Calendar** — day counter, iftar times, fasting streak, Quran progress heatmap
- [ ] **Spiritual Mood Integration** — spiritual state feeds into Echo AI balance scoring
- [ ] **Hijri ↔ Gregorian date awareness** across the app
- [ ] Sanctum Overhaul — guided meditation/reflection interface

> 🔌 **APIs Needed:**
> - **Aladhan API** ✅ Already integrated — prayer times, Qibla, Hijri calendar
>   - Docs: `https://aladhan.com/prayer-times-api` — Free, no key required
> - **Quran.com API** (or Al-Quran Cloud) — Quran verse data, surah progress
>   - Free, no key required
> - **Browser Geolocation API** ✅ Already used for Qibla
>
> 🗃️ **Data Needed:**
> - Ramadan start/end dates per year (local static data or Aladhan API)
> - Quran surah list + ayah counts (local static file `/src/data/quranData.js`)
> - Sin/commandment definitions per religion (local static files already partially exist)
> - Islamic calendar Hijri months (Aladhan returns this)

---

## Phase 6: Biometric & Health Intelligence
*Status: 🔲 Planned*
*Stage: The body speaks. Health data becomes dynamic, advisory, and beautiful.*

- [x] BioSync Widget — manual health data input
- [x] Breathing Exercise module
- [ ] **Monthly Gym & Health Advisor** — adapts to season and Ramadan
- [ ] **Recovery recommendations** + health check-in prompts from logged symptoms
- [ ] **Monthly Cooking Ideas** — seasonal ingredients + meal planning tied to health goals
- [ ] **Simulated Wearable Sync** — heart rate and sleep feeding the Avatar HUD
- [ ] Enhanced Avatar diagnostics — organs glow/pulse based on logged health data

> 🔌 **APIs Needed:**
> - **OpenAI API** — smart gym/health/cooking advice generation (reuses Phase 2 key)
> - **Nutritionix API** — food nutrition data for meal planning (free tier available)
>   - Key: `VITE_NUTRITIONIX_APP_ID` + `VITE_NUTRITIONIX_API_KEY`
> - **Open Food Facts API** — free alternative for food/ingredient data, no key required
> - **Future:** Apple HealthKit / Google Fit / Fitbit API for real wearable sync (Phase 10 territory)
>
> 🗃️ **Data Needed:**
> - Health metric history: weight, heart rate, sleep, water (logged by user, stored in Zustand)
> - Symptom log (user-entered, with timestamps)
> - Seasonal ingredient lists (local static data `/src/data/seasonalFoodData.js`)
> - Workout intensity tables by month/season/Ramadan (local static data)

---

## Phase 7: Skills, XP, Talents & The Shadow System
*Status: 🔲 Planned*
*Stage: The self becomes a game. Growth is rewarded. Failure has consequences.*

- [x] Achievements & Talents system
- [x] Rank badges (C → SSS)
- [x] Skill XP cards
- [ ] **Full RPG Skill Tree** — visual tree with level gates and unlock requirements
- [ ] **Dynamic XP** — awarded from habit streaks, realm entries, prayer logs, and health goals
- [ ] **Talent unlock animations** and milestone celebration effects

**🌑 Shadow System — The Dark Realm:**
- [ ] **Bad Habits Tracker** — log destructive habits that drain XP and visually corrupt the skill tree
- [ ] **Downgrade Mechanic** — skills regress when bad habits accumulate; glitch/decay/corruption effect
- [ ] **Religion-Specific Underworlds** (adapts to user's religion setting):
  - ☩ Christianity → 7 Deadly Sins + 10 Commandments violation tracker
  - ☽ Islam → Major Sins (Al-Kabair) tracker + Tawbah (repentance) mechanic
  - ✡ Judaism → Noahide Laws + 613 Mitzvot awareness
  - ☸ Buddhism → Five Precepts violations + Karmic debt balance
  - 🌙 Other / Spiritual → "Moon Dimension" — shadow energy and negative karma scale
- [ ] **Visual Contrast** — Shadow Realm uses dark purples, deep reds, glitch particles
- [ ] **Redemption Arc** — positive habits and prayers cleanse shadow points

> 🔌 **APIs Needed:** None — fully local
>
> 🗃️ **Data Needed:**
> - Skill tree structure: nodes, edges, unlock conditions (local `/src/data/skillTreeData.js`)
> - XP tables: action type → XP earned/lost (local `/src/data/xpData.js`)
> - 7 Deadly Sins definitions (local `/src/data/shadowData.js`)
> - 10 Commandments text (local)
> - Al-Kabair (Major Sins in Islam) list (local)
> - Buddhist Five Precepts (local)
> - Tawbah/repentance mechanic logic (local)
> - Bad habit categories + XP drain values (local)

---

## Phase 8: Constellation & Knowledge Graph
*Status: 🔲 Planned*
*Stage: The mind maps itself. Ideas connect across realms.*

- [ ] **Constellation View** — Force-Directed Graph linking Elysia ideas to Cerebra knowledge
- [ ] **Cross-Realm Tagging** — one entry can ripple across multiple realms
- [ ] Animated node graph with interactive connections
- [ ] Visual clustering of related thoughts over time

**Upgrade — "Synapse Mesh":**
- [ ] Echo AI identifies hidden patterns across realm entries
- [ ] Auto-creates "Neural Bridges" between related notes

> 🔌 **APIs Needed:**
> - **OpenAI API** — Synapse Mesh: finding hidden connections between entries (reuses Phase 2 key)
>
> 🗃️ **Data Needed:**
> - All realm entries with tags and timestamps (Zustand/localStorage)
> - Graph schema: nodes (entries) + edges (connections/tags) stored locally
> - D3.js or React Force Graph library for rendering (npm package, no API)

---

## Phase 9: Personalization, Themes & Social Layer
*Status: 🔲 Planned*
*Stage: The app feels like yours. Others can see your journey.*

- [x] 8 themes implemented
- [ ] **Theme Overhaul:**
  - Basic Mode: Dark, Light, Night Blue, System (4 options)
  - Advanced Mode: 16 curated themes + custom palette builder
- [ ] **Adaptive UI** — interface shifts based on current mood log
- [ ] **SFX Layer** — optional audio cues for interactions and achievements
- [ ] **Shareable Achievement Cards** — image export of personal milestones
- [ ] **Exportable Recap** — weekly/monthly recap as a styled PDF
- [ ] **Accountability Partner Mode** — share habit streaks with a trusted contact

> 🔌 **APIs Needed:**
> - **Firebase / Supabase** — for accountability partner data sync (optional, if sharing features go online)
>   - Key: `VITE_FIREBASE_API_KEY` or `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
> - **html2canvas + jsPDF** — for PDF/image export (npm packages, no API key)
>
> 🗃️ **Data Needed:**
> - Theme token definitions (CSS variables, local)
> - User audio preferences (stored in Zustand)
> - Achievement snapshot data for card export

---

## Phase 10: The Infinite AfterLife — Digital Legacy
*Status: 🔲 Final Form*
*Stage: The self is preserved. A living digital twin that outlasts the moment.*

- [ ] **Full Digital Twin** — all realms, health, skills, and spiritual data unified
- [ ] **Interactive Life Report** — exportable as styled HTML or PDF
- [ ] **Echo AI Predictive Modeling** — trajectory in 1, 3, and 5 years
- [ ] **Digital Legacy Mode** — read-only archival snapshot at any point in time
- [ ] **"Infinite AfterLife" Export** — full second brain as a standalone permanent file

> 🔌 **APIs Needed:**
> - **OpenAI API** — predictive modeling, life trajectory generation (reuses Phase 2 key)
> - **Apple HealthKit / Google Fit / Fitbit API** — real wearable data (optional, advanced)
> - **html2canvas + jsPDF** — for Interactive Life Report export (reuses Phase 9 packages)
>
> 🗃️ **Data Needed:**
> - Entire Zustand store snapshot (all realms, habits, health, skills, spiritual data)
> - Historical snapshots (timestamped exports stored locally or in cloud)
> - Life expectancy + trajectory statistical models (local or AI-generated)

---

## 🔌 Master API Reference

| API | Used In | Cost | Key Required |
| :--- | :--- | :--- | :--- |
| **OpenAI** (`gpt-4o-mini`) | Ph 2, 4, 8, 10 | Pay-per-use (~free tier) | `VITE_OPENAI_API_KEY` |
| **Aladhan** | Ph 5 ✅ | Free | ❌ No key needed |
| **Quran.com / Al-Quran Cloud** | Ph 5 | Free | ❌ No key needed |
| **Browser Geolocation** | Ph 5 ✅ | Free | ❌ Built-in browser |
| **Nutritionix** | Ph 6 | Free tier | `VITE_NUTRITIONIX_APP_ID` + `VITE_NUTRITIONIX_API_KEY` |
| **Open Food Facts** | Ph 6 (alt) | Free | ❌ No key needed |
| **Firebase / Supabase** | Ph 9 (optional) | Free tier | `VITE_FIREBASE_API_KEY` or Supabase keys |
| **Apple HealthKit / Google Fit** | Ph 10 (future) | Free | Platform-specific |

---

## 🗃️ Master Data Requirements

| Data | Source | Where Stored |
| :--- | :--- | :--- |
| Realm entries (all 5 realms) | User input | Zustand / localStorage |
| Habit logs + streaks | User input | Zustand / localStorage |
| Health metrics (weight, HR, sleep) | User input | Zustand / localStorage |
| Prayer logs + streak | User input | Zustand / localStorage |
| Skill XP + rank | Calculated | Zustand |
| MBTI / personality | Onboarding | Zustand |
| Life expectancy + DOB | User input | Zustand |
| XP weight tables | Static | `/src/data/xpData.js` |
| Skill tree structure | Static | `/src/data/skillTreeData.js` |
| Shadow system (sins/precepts) | Static | `/src/data/shadowData.js` |
| Quran surah list | Static | `/src/data/quranData.js` |
| Seasonal food data | Static | `/src/data/seasonalFoodData.js` |
| Life expectancy tables | Static | `/src/data/lifeExpectancyData.js` |
| Prayer times | Aladhan API | Fetched live |

---

## Scale-Up Summary

| Phase | Stage Goal | APIs | Status |
| :---: | :--- | :--- | :---: |
| 1 | Build the shell | None | ✅ |
| 2 | Make it intelligent | OpenAI | 🔄 |
| 3 | Make it solid everywhere | None | 🔲 |
| 4 | Add the time dimension | OpenAI | 🔲 |
| 5 | Deepen the soul | Aladhan, Quran.com | 🔲 |
| 6 | The body speaks | OpenAI, Nutritionix | 🔲 |
| 7 | The self becomes a game | None | 🔲 |
| 8 | The mind maps itself | OpenAI | 🔲 |
| 9 | Make it yours | Firebase/Supabase | 🔲 |
| 10 | Preserve the self | OpenAI, HealthKit | 🔲 |
