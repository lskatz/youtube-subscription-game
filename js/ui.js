// ============================================================
// SubRush — UI layer
// This file handles all DOM interaction. Game logic lives in
// the Transcrypt-compiled Python modules loaded below.
// ============================================================

const SAVE_KEY = "subrush_save";

// ---- Famous creator analogs (static, never change) ---------
// Parody names — not affiliated with any real creator.
const FAMOUS_CREATORS = [
  { name:"Linus Tech Trips",  subs:16_500_000,  icon:"💻", niche:"Technology" },
  { name:"Shinobistream",     subs:19_000_000,  icon:"🎮", niche:"Gaming" },
  { name:"Zeck Films",        subs:20_000_000,  icon:"🎭", niche:"Humor" },
  { name:"GreenSepticeye",    subs:31_000_000,  icon:"🎮", niche:"Gaming" },
  { name:"Markiplenty",       subs:36_500_000,  icon:"🎮", niche:"Gaming" },
  { name:"PewPieDee",         subs:111_000_000, icon:"🎮", niche:"Gaming" },
  { name:"CucaMelon",         subs:175_000_000, icon:"🎵", niche:"Kids" },
  { name:"D-Series",          subs:285_000_000, icon:"🎵", niche:"Music" },
  { name:"Mr. Least",         subs:345_000_000, icon:"💰", niche:"Challenge" },
];

// ---- Play button visual tier thresholds --------------------
const PLAY_BTN_TIERS = [
  { threshold:500_000_000, tier:7, title:"Legendary" },
  { threshold:50_000_000,  tier:6, title:"Holographic" },
  { threshold:10_000_000,  tier:5, title:"Diamond" },
  { threshold:1_000_000,   tier:4, title:"Crystal" },
  { threshold:100_000,     tier:3, title:"Gold" },
  { threshold:10_000,      tier:2, title:"Silver" },
  { threshold:1_000,       tier:1, title:"Polished" },
  { threshold:0,           tier:0, title:"Basic" },
];

// ---- Niche colors for video player canvas ------------------
const NICHE_COLORS = {
  gaming:      { bg:"#0d1b4b", accent:"#4a90d9" },
  science:     { bg:"#0d2b1a", accent:"#4caf50" },
  government:  { bg:"#2b0d0d", accent:"#ef5350" },
  humor:       { bg:"#2b1a0d", accent:"#ff9800" },
  theoretical: { bg:"#1a0d2b", accent:"#ab47bc" },
  cooking:     { bg:"#2b150d", accent:"#ff7043" },
  finance:     { bg:"#0d1f2b", accent:"#29b6f6" },
  fitness:     { bg:"#0d2b25", accent:"#26a69a" },
  technology:  { bg:"#0d1a2b", accent:"#42a5f5" },
  art:         { bg:"#2b0d1a", accent:"#ec407a" },
};

const VIDEO_TITLE_TEMPLATES = {
  gaming:      ["Let's Play Everything","Gaming Marathon","Epic Moments","Speed Run Challenge","Game Review"],
  science:     ["Lab Experiment","Discovery Hour","Science Breakdown","Research Update","Theory Time"],
  government:  ["Policy Analysis","Political Deep Dive","Civics 101","Breaking News","Interview Series"],
  humor:       ["Comedy Sketches","Fails Compilation","Prank Video","Stand-up Special","Reaction Reel"],
  theoretical: ["Thought Experiment","What If...","Philosophy Hour","Deep Thoughts","Mind Bending"],
  cooking:     ["Recipe Tutorial","Kitchen Disaster","Restaurant Review","Cook-Off Challenge","Taste Test"],
  finance:     ["Market Update","Investment Guide","Budget Tips","Crypto Watch","Wealth Secrets"],
  fitness:     ["Workout Routine","Diet Review","Transformation","Challenge Complete","Training Session"],
  technology:  ["Tech Review","Unboxing","Coding Tutorial","App Comparison","Future Tech"],
  art:         ["Art Tutorial","Speed Paint","Gallery Tour","Commission Reveal","Art Challenge"],
};

// ---- Avatar config (expandable later) ----------------------
const AVATAR_CONFIG = {
  skinTones:  [
    { id:"light",    color:"#FDDBB4", label:"☀" },
    { id:"medium",   color:"#D4956A", label:"🌤" },
    { id:"tan",      color:"#C8763B", label:"🌥" },
    { id:"dark",     color:"#7C4B2A", label:"🌦" },
    { id:"deep",     color:"#3B1D0E", label:"🌚" },
  ],
  hairStyles: [
    { id:"short",   label:"✂" },
    { id:"long",    label:"🌊" },
    { id:"curly",   label:"🌀" },
    { id:"bun",     label:"🎀" },
    { id:"bald",    label:"⭕" },
    { id:"mohawk",  label:"⚡" },
  ],
  hairColors: [
    { id:"brown",  color:"#6B3A2A" },
    { id:"black",  color:"#1a1a1a" },
    { id:"blonde", color:"#D4A017" },
    { id:"red",    color:"#C0392B" },
    { id:"gray",   color:"#888" },
    { id:"blue",   color:"#2980B9" },
    { id:"pink",   color:"#e84393" },
  ],
  outfits:    [
    { id:"casual",       label:"👕" },
    { id:"professional", label:"👔" },
    { id:"sporty",       label:"🏃" },
    { id:"streetwear",   label:"🧢" },
    { id:"fantasy",      label:"🧙" },
  ],
  accessories: [
    { id:"none",       label:"—" },
    { id:"glasses",    label:"👓" },
    { id:"hat",        label:"🎩" },
    { id:"headphones", label:"🎧" },
    { id:"mask",       label:"😷" },
    { id:"crown",      label:"👑" },
  ],
};

const OUTFIT_COLORS = {
  casual: "#4a90d9", professional: "#2c3e50", sporty: "#27ae60",
  streetwear: "#8e44ad", fantasy: "#c0392b",
};

const NICHE_INFO = {
  gaming:      { icon:"🎮", label:"Gaming" },
  science:     { icon:"🔬", label:"Science" },
  government:  { icon:"🏛", label:"Government" },
  humor:       { icon:"😂", label:"Humor" },
  theoretical: { icon:"💭", label:"Theoretical" },
  cooking:     { icon:"🍳", label:"Cooking" },
  finance:     { icon:"📈", label:"Finance" },
  fitness:     { icon:"💪", label:"Fitness" },
  technology:  { icon:"💻", label:"Technology" },
  art:         { icon:"🎨", label:"Art" },
};

const PERSONALITY_INFO = {
  enthusiastic: { icon:"🔥", label:"Enthusiastic", hint:"High growth, mild risk" },
  calm:         { icon:"😌", label:"Calm",         hint:"Steady, minimal risk" },
  controversial:{ icon:"💢", label:"Controversial", hint:"Very high growth, high risk" },
  educational:  { icon:"📚", label:"Educational",  hint:"Consistent, low risk" },
  funny:        { icon:"😄", label:"Funny",         hint:"Good growth, some risk" },
  mysterious:   { icon:"🕵", label:"Mysterious",   hint:"Moderate growth, low risk" },
};

const PERSONA_FIT = {
  gaming:      ["enthusiastic","funny","controversial"],
  science:     ["educational","calm","mysterious"],
  government:  ["educational","controversial","calm"],
  humor:       ["funny","enthusiastic","controversial"],
  theoretical: ["mysterious","educational","calm"],
  cooking:     ["enthusiastic","calm","funny"],
  finance:     ["educational","calm","mysterious"],
  fitness:     ["enthusiastic","calm","educational"],
  technology:  ["educational","mysterious","enthusiastic"],
  art:         ["mysterious","calm","educational"],
};

// ---- Game state --------------------------------------------
let state = null;    // populated by new game or load
let tempAvatar = {}; // used by avatar editor

let playerState = {
  playing: false,
  progress: 0,      // 0.0 – 1.0
  duration: 45,     // seconds for one full animation cycle
  lastTick: null,
  rafId: null,
};

// ---- Boot --------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    showSaveDialog(true);
  } else {
    showSaveDialog(false);
  }
  initUI();
});

function showSaveDialog(hasSave) {
  const dlg = document.getElementById("save-dialog");
  const msg = document.getElementById("save-dialog-msg");
  const btnContinue = document.getElementById("btn-continue");
  const btnDelete   = document.getElementById("btn-delete-save");

  if (hasSave) {
    msg.textContent = "Welcome back! Continue your channel?";
    btnContinue.classList.remove("hidden");
    btnDelete.classList.remove("hidden");
  } else {
    msg.textContent = "No save found. Start a new channel!";
    btnContinue.classList.add("hidden");
    btnDelete.classList.add("hidden");
  }
  dlg.classList.remove("hidden");
}

function initUI() {
  // Save dialog buttons
  document.getElementById("btn-continue").addEventListener("click", () => {
    const data = localStorage.getItem(SAVE_KEY);
    state = loadState(data);
    if (!state) { alert("Save data corrupted. Starting new game."); startNewGame(); return; }
    closeModal("save-dialog");
    showScreen("game-screen");
    renderGameScreen();
  });

  document.getElementById("btn-new-game").addEventListener("click", () => {
    closeModal("save-dialog");
    showSetupScreen();
  });

  document.getElementById("btn-delete-save").addEventListener("click", () => {
    if (confirm("Delete save? This cannot be undone.")) {
      localStorage.removeItem(SAVE_KEY);
      closeModal("save-dialog");
      showSetupScreen();
    }
  });

  // Setup screen
  buildNicheGrid();
  buildPersonalityGrid();
  buildAvatarEditor();

  document.getElementById("btn-open-avatar").addEventListener("click", () => {
    openAvatarModal(false);
  });

  document.getElementById("btn-start").addEventListener("click", () => {
    startNewGame();
  });

  // Game screen controls
  document.getElementById("freq-down").addEventListener("click", () => adjustFreq(-1));
  document.getElementById("freq-up").addEventListener("click",   () => adjustFreq(1));

  document.querySelectorAll("#length-choice .choice-btn").forEach(btn => {
    btn.addEventListener("click", () => activateChoice("length-choice", btn));
  });

  document.querySelectorAll("#quality-choice .choice-btn").forEach(btn => {
    btn.addEventListener("click", () => activateChoice("quality-choice", btn));
  });

  document.getElementById("ad-spend-slider").addEventListener("input", (e) => {
    document.getElementById("ad-spend-val").textContent = "$" + e.target.value;
  });

  document.getElementById("self-in-video").addEventListener("change", updateOnCameraHint);

  document.getElementById("btn-next-week").addEventListener("click", doNextWeek);

  // Prestige screen
  document.getElementById("btn-prestige").addEventListener("click", doPrestige);
  document.getElementById("pb-color").addEventListener("input", renderPlayButton);
  document.getElementById("pb-icon").addEventListener("change", renderPlayButton);

  // Avatar modal
  document.getElementById("btn-avatar-save").addEventListener("click", saveAvatarFromModal);
  document.getElementById("btn-avatar-cancel").addEventListener("click", () => {
    closeModal("avatar-modal");
  });

  initVideoPlayer();
}

// ---- Setup screen ------------------------------------------
function buildNicheGrid() {
  const grid = document.getElementById("niche-grid");
  Object.entries(NICHE_INFO).forEach(([id, info], i) => {
    const card = document.createElement("div");
    card.className = "choice-card" + (i === 0 ? " active" : "");
    card.dataset.val = id;
    card.innerHTML = `<span class="card-icon">${info.icon}</span><span class="card-label">${info.label}</span>`;
    card.addEventListener("click", () => {
      document.querySelectorAll("#niche-grid .choice-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateOnCameraHint();
    });
    grid.appendChild(card);
  });
}

function buildPersonalityGrid() {
  const grid = document.getElementById("personality-grid");
  Object.entries(PERSONALITY_INFO).forEach(([id, info], i) => {
    const card = document.createElement("div");
    card.className = "choice-card" + (i === 0 ? " active" : "");
    card.dataset.val = id;
    card.innerHTML = `<span class="card-icon">${info.icon}</span><span class="card-label">${info.label}</span><span class="card-label">${info.hint}</span>`;
    card.addEventListener("click", () => {
      document.querySelectorAll("#personality-grid .choice-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      updateOnCameraHint();
    });
    grid.appendChild(card);
  });
}

function showSetupScreen() {
  showScreen("setup-screen");
  tempAvatar = { skinTone:"light", hairStyle:"short", hairColor:"brown", outfit:"casual", accessory:"none" };
  renderAvatarCanvas("avatar-preview", tempAvatar, 80);
}

function startNewGame() {
  const name = document.getElementById("input-name").value.trim() || "Creator";
  const niche = getActiveChoice("niche-grid");
  const personality = getActiveChoice("personality-grid");
  const avatar = { ...tempAvatar };

  state = {
    player: { name, niche, personality, avatar, onCamera: true },
    channel: { subscribers: 0, totalViews: 0, watchTimeHours: 0, weekNumber: 1, reachedMilestones: [] },
    inventory: { owned: [], budget: 500 },
    week: 1,
    prestigeCount: 0,
    prestigeMultiplier: 1.0,
    activeEvents: [],
    monetized: false,
    surpassedCreators: [],
  };

  closeScreen("setup-screen");
  showScreen("game-screen");
  renderGameScreen();
}

// ---- Game screen rendering ---------------------------------
function renderGameScreen() {
  document.getElementById("topbar-name").textContent = state.player.name;
  document.getElementById("stat-subs").textContent   = formatNum(state.channel.subscribers);
  document.getElementById("stat-budget").textContent = "$" + state.inventory.budget.toFixed(0);
  document.getElementById("stat-week").textContent   = state.week;

  if (state.prestigeCount > 0) {
    document.getElementById("chip-prestige").classList.remove("hidden");
    document.getElementById("stat-prestige").textContent = state.prestigeCount;
  }

  if (state.monetized) {
    document.getElementById("monetization-banner").classList.remove("hidden");
  }

  renderAvatarCanvas("topbar-avatar", state.player.avatar, 40);
  renderShop();
  updateOnCameraHint();
  updateAdSpendMax();
  updatePlayButton(state.channel.subscribers);
  renderCreatorLeaderboard();
  drawPlayerCanvas();
}

function updateOnCameraHint() {
  const nicheEl = document.querySelector("#niche-grid .choice-card.active") ||
                  { dataset: { val: state?.player?.niche || "gaming" } };
  const persEl  = document.querySelector("#personality-grid .choice-card.active") ||
                  { dataset: { val: state?.player?.personality || "enthusiastic" } };
  const onCam   = document.getElementById("self-in-video");

  if (!onCam) return;
  const hint = document.getElementById("oncamera-hint");
  if (!hint) return;

  if (!onCam.checked) {
    hint.textContent = "Off camera — neutral effect.";
    return;
  }

  const niche = nicheEl.dataset.val;
  const pers  = persEl.dataset.val;
  const fits  = PERSONA_FIT[niche] || [];
  if (fits.includes(pers)) {
    hint.textContent = "Great fit! +12% subscriber bonus.";
    hint.style.color = "var(--green)";
  } else {
    hint.textContent = "Persona mismatch — risk of controversy.";
    hint.style.color = "var(--accent)";
  }
}

function updateAdSpendMax() {
  const slider = document.getElementById("ad-spend-slider");
  if (slider && state) {
    slider.max = Math.max(0, Math.floor(state.inventory.budget));
  }
}

function adjustFreq(delta) {
  const el  = document.getElementById("freq-val");
  const cur = parseInt(el.textContent);
  el.textContent = Math.max(1, Math.min(7, cur + delta));
}

function activateChoice(groupId, btn) {
  document.querySelectorAll("#" + groupId + " .choice-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function getActiveChoice(groupId) {
  const active = document.querySelector("#" + groupId + " .active");
  return active ? active.dataset.val : null;
}

// ---- Turn processing ---------------------------------------
function doNextWeek() {
  const freq     = parseInt(document.getElementById("freq-val").textContent);
  const length   = document.querySelector("#length-choice .choice-btn.active").dataset.val;
  const quality  = document.querySelector("#quality-choice .choice-btn.active").dataset.val;
  const adSpend  = parseFloat(document.getElementById("ad-spend-slider").value) || 0;
  const selfIn   = document.getElementById("self-in-video").checked;

  if (adSpend > state.inventory.budget) {
    alert("Not enough budget for that ad spend!");
    return;
  }

  // --- Simulate turn (JS reimplementation of Python logic) ---
  const result = simulateTurn(state, { freq, length, quality, adSpend, selfIn });
  const prevSubs = state.channel.subscribers;

  // Apply results to state
  state.channel.subscribers   = Math.max(0, state.channel.subscribers + result.newSubs);
  state.channel.totalViews   += result.views;
  state.channel.watchTimeHours += result.watchHours;
  state.channel.weekNumber   += 1;
  state.inventory.budget     -= adSpend;
  state.inventory.budget     += Math.max(0, result.revenue);
  state.inventory.budget      = Math.max(0, state.inventory.budget);
  state.week                 += 1;
  state.player.onCamera       = selfIn;

  // Monetization check
  if (!state.monetized && state.channel.subscribers >= 1000 && state.channel.watchTimeHours >= 4000) {
    state.monetized = true;
    document.getElementById("monetization-banner").classList.remove("hidden");
  }

  // Milestone check
  checkMilestones(result);

  // Creator surpass check
  checkCreatorSurpass(prevSubs, state.channel.subscribers);

  // Update video title for this week
  updateVideoTitle();

  // Render weekly log
  renderWeeklyLog(result);

  // Update header
  renderGameScreen();

  // Autosave
  localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState(state)));

  // Prestige check
  if (state.channel.subscribers >= 500_000_000) {
    setTimeout(() => showPrestigeScreen(), 800);
  }
}

function simulateTurn(state, decision) {
  const { freq, length, quality, adSpend, selfIn } = decision;
  const subs = state.channel.subscribers;

  // View rate based on subscriber count
  let viewRate;
  if (subs < 100)        viewRate = subs * 0.5;
  else if (subs < 10000) viewRate = subs * 0.3;
  else if (subs < 1e6)   viewRate = subs * 0.15;
  else                   viewRate = subs * 0.08;

  const qMod  = { low:0.80, medium:1.00, high:1.25 }[quality] || 1.0;
  const eqMod = 1.0 + totalEquipmentBonus(state.inventory.owned);
  const personaMod = calcPersonaMod(state.player, selfIn);
  const persMod = { enthusiastic:1.10, calm:1.00, controversial:1.20, educational:1.05, funny:1.15, mysterious:1.08 }[state.player.personality] || 1.0;
  const adViews = adSpend * 200;

  const views = Math.max(0, Math.round(viewRate * freq * qMod * eqMod * personaMod * persMod * state.prestigeMultiplier + adViews));

  // Subscriber conversion rate
  let rate;
  if (subs < 1000)       rate = 0.08;
  else if (subs < 10000) rate = 0.05;
  else if (subs < 1e5)   rate = 0.03;
  else if (subs < 1e6)   rate = 0.015;
  else if (subs < 1e7)   rate = 0.008;
  else                   rate = 0.003;

  let newSubs = Math.round(views * rate * personaMod);

  // Watch time
  const lengthMins = { short:8, medium:18, long:35 }[length] || 18;
  const watchHours = views * lengthMins * 0.5 / 60.0;

  // Revenue
  const BASE_CPM = 3.0;
  let revenue = 0;
  if (state.monetized) {
    revenue = (views / 1000.0) * BASE_CPM * state.prestigeMultiplier - adSpend;
  } else {
    revenue = -adSpend;
  }

  // Random events
  const events = generateEvents(state.player, state.channel, state.week, selfIn);
  for (const ev of events) {
    newSubs  = Math.round(newSubs  * ev.subMod);
    revenue  = revenue * ev.revMod;
  }

  return { views, newSubs, watchHours, revenue, events };
}

function calcPersonaMod(player, selfIn) {
  if (!selfIn) return 1.0;
  const fits = PERSONA_FIT[player.niche] || [];
  return fits.includes(player.personality) ? 1.12 : 0.88;
}

function totalEquipmentBonus(owned) {
  return owned.reduce((sum, item) => sum + (item.qualityBonus || 0), 0);
}

function generateEvents(player, channel, week, selfIn) {
  const seed    = week * 137 + channel.subscribers;
  const rng     = seededRng(seed);
  const events  = [];

  const persRisk = { enthusiastic:0.05, calm:0.01, controversial:0.30, educational:0.02, funny:0.08, mysterious:0.04 };
  const fits     = PERSONA_FIT[player.niche] || [];
  let contrRisk  = persRisk[player.personality] || 0.05;
  if (selfIn && !fits.includes(player.personality)) contrRisk = Math.min(0.60, contrRisk * 3);

  if (rng() < contrRisk) {
    events.push({ type:"controversy",  label:"A video sparked controversy online.",       subMod:0.5, revMod:0.7,  cssClass:"controversy" });
  }
  const viralChance = 0.04 + (persRisk[player.personality] || 0.05) * 0.05;
  if (rng() < viralChance) {
    events.push({ type:"viral",        label:"One of your videos went viral!",             subMod:3.0, revMod:2.5,  cssClass:"viral" });
  }
  if (rng() < 0.10) {
    events.push({ type:"algo_boost",   label:"The algorithm is recommending your content!", subMod:1.8, revMod:1.5, cssClass:"boost" });
  } else if (rng() < 0.08) {
    events.push({ type:"algo_penalty", label:"The algorithm deprioritized your channel.",   subMod:0.6, revMod:0.6, cssClass:"penalty" });
  }
  if (channel.subscribers >= 1000 && rng() < 0.08) {
    events.push({ type:"collab",       label:"You collaborated with another creator!",      subMod:2.0, revMod:1.3, cssClass:"collab" });
  }
  if (rng() < 0.03) {
    events.push({ type:"strike",       label:"You received a copyright strike.",            subMod:0.4, revMod:0.0, cssClass:"strike" });
  }
  if (channel.subscribers >= 100 && rng() < 0.05) {
    events.push({ type:"fan",          label:"Your fans organized a celebration!",          subMod:1.4, revMod:1.2, cssClass:"milestone" });
  }
  if (rng() < 0.04) {
    events.push({ type:"equip_fail",   label:"Your equipment failed mid-recording.",        subMod:0.7, revMod:0.8, cssClass:"equip" });
  }

  return events;
}

// Simple seeded PRNG (mulberry32)
function seededRng(seed) {
  let s = seed >>> 0;
  return function() {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function renderWeeklyLog(result) {
  document.getElementById("weekly-stats").classList.remove("hidden");
  document.getElementById("log-views").textContent = formatNum(result.views);
  document.getElementById("log-subs").textContent  = "+" + formatNum(result.newSubs);
  document.getElementById("log-wt").textContent    = result.watchHours.toFixed(1) + " hrs";
  document.getElementById("log-rev").textContent   = (result.revenue >= 0 ? "+" : "") + "$" + result.revenue.toFixed(2);

  const log = document.getElementById("event-log");
  log.innerHTML = "";

  if (result.events.length === 0) {
    log.innerHTML = "<p class='log-placeholder'>A quiet week. Keep uploading!</p>";
  } else {
    result.events.forEach(ev => {
      const div = document.createElement("div");
      div.className = "event-entry " + (ev.cssClass || "");
      div.textContent = ev.label;
      log.appendChild(div);
    });
  }
}

function checkMilestones(result) {
  const MILESTONES = [
    [100,        "First 100 Subscribers! 🎉"],
    [1000,       "Monetization Unlocked! 💰"],
    [10000,      "10K Club! Silver territory 🥈"],
    [100000,     "100K! Official Silver Play Button 🥈"],
    [1000000,    "1 Million! Gold Play Button 🥇"],
    [10000000,   "10 Million! Diamond Play Button 💎"],
    [50000000,   "50 Million! Custom Play Button ✨"],
    [500000000,  "500 MILLION! You won! 🏆"],
  ];

  const area = document.getElementById("milestone-area");
  MILESTONES.forEach(([threshold, msg]) => {
    if (state.channel.subscribers >= threshold &&
        !state.channel.reachedMilestones.includes(threshold)) {
      state.channel.reachedMilestones.push(threshold);
      const toast = document.createElement("div");
      toast.className = "milestone-toast";
      toast.textContent = msg;
      area.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }
  });
}

// ---- Equipment shop ----------------------------------------
const EQUIPMENT_CATALOG = [
  { type:"camera",   name:"Webcam",           cost:150,  sell:50,   bonus:0.05, desc:"Decent for a beginner." },
  { type:"camera",   name:"DSLR Camera",      cost:1200, sell:400,  bonus:0.15, desc:"Sharp, professional look." },
  { type:"camera",   name:"Cinema Camera",    cost:5000, sell:1800, bonus:0.30, desc:"Cinematic quality." },

  { type:"mic",      name:"USB Mic",          cost:80,   sell:25,   bonus:0.05, desc:"Clear audio on a budget." },
  { type:"mic",      name:"Condenser Mic",    cost:400,  sell:130,  bonus:0.12, desc:"Studio-quality sound." },
  { type:"mic",      name:"Boom Mic",         cost:900,  sell:300,  bonus:0.20, desc:"Pro broadcast audio." },

  { type:"lights",   name:"Ring Light",       cost:60,   sell:20,   bonus:0.04, desc:"Eliminates harsh shadows." },
  { type:"lights",   name:"Softbox Kit",      cost:300,  sell:100,  bonus:0.10, desc:"Even, diffused lighting." },
  { type:"lights",   name:"LED Panel Array",  cost:900,  sell:300,  bonus:0.18, desc:"Full studio lighting." },

  { type:"graphics", name:"Free Templates",   cost:0,    sell:0,    bonus:0.02, desc:"Basic overlays." },
  { type:"graphics", name:"Motion Pack",      cost:200,  sell:60,   bonus:0.08, desc:"Animated intros and overlays." },
  { type:"graphics", name:"Custom Branding",  cost:800,  sell:250,  bonus:0.15, desc:"Unique channel identity." },

  { type:"screen",   name:"Screen Share",     cost:0,    sell:0,    bonus:0.02, desc:"Basic screen recording." },
  { type:"screen",   name:"Capture Card",     cost:150,  sell:50,   bonus:0.08, desc:"Smooth console/PC capture." },
  { type:"screen",   name:"4K Capture",       cost:600,  sell:200,  bonus:0.15, desc:"Crystal-clear screen content." },

  { type:"bg",       name:"Blank Wall",       cost:0,    sell:0,    bonus:0.01, desc:"Simple but clean." },
  { type:"bg",       name:"Green Screen",     cost:80,   sell:25,   bonus:0.07, desc:"Virtual backgrounds." },
  { type:"bg",       name:"Custom Set",       cost:2000, sell:700,  bonus:0.20, desc:"Branded, professional studio." },

  { type:"music",    name:"Royalty-Free",     cost:0,    sell:0,    bonus:0.02, desc:"Safe, free music." },
  { type:"music",    name:"Premium Library",  cost:100,  sell:30,   bonus:0.07, desc:"High-quality licensed music." },
  { type:"music",    name:"Original Composer",cost:1500, sell:500,  bonus:0.18, desc:"Custom soundtrack." },

  { type:"editor",   name:"Free Editor",      cost:0,    sell:0,    bonus:0.03, desc:"Gets the job done." },
  { type:"editor",   name:"Pro Editor",       cost:300,  sell:100,  bonus:0.12, desc:"Fast, feature-rich editing." },
  { type:"editor",   name:"AI-Assisted Editor",cost:900, sell:300,  bonus:0.22, desc:"Smart cuts, color grading, captions." },
];

const TYPE_LABELS = {
  camera:"Camera", mic:"Microphone", lights:"Lighting", graphics:"Graphics",
  screen:"Screen", bg:"Background", music:"Music", editor:"Editor",
};

function renderShop() {
  const container = document.getElementById("shop-list");
  container.innerHTML = "";

  const types = [...new Set(EQUIPMENT_CATALOG.map(e => e.type))];
  types.forEach(type => {
    const title = document.createElement("div");
    title.className = "shop-section-title";
    title.textContent = TYPE_LABELS[type] || type;
    container.appendChild(title);

    const items = EQUIPMENT_CATALOG.filter(e => e.type === type);
    const ownedOfType = state.inventory.owned.find(o => o.type === type);

    items.forEach(item => {
      const isOwned = ownedOfType && ownedOfType.name === item.name;
      const div = document.createElement("div");
      div.className = "shop-item" + (isOwned ? " owned" : "");

      const canAfford = state.inventory.budget >= item.cost;
      const costStr   = item.cost === 0 ? "Free" : "$" + item.cost;
      const bonusPct  = Math.round(item.bonus * 100);

      div.innerHTML = `
        <div class="shop-item-header">
          <span class="shop-item-name">${item.name}</span>
          <span class="shop-item-cost">${costStr}</span>
        </div>
        <div class="shop-item-desc">${item.desc}</div>
        <div class="shop-item-bonus">+${bonusPct}% quality bonus</div>
        <div class="shop-item-actions"></div>
      `;

      const actions = div.querySelector(".shop-item-actions");

      if (isOwned) {
        if (item.sell > 0) {
          const sellBtn = document.createElement("button");
          sellBtn.className = "btn btn-secondary";
          sellBtn.textContent = `Sell ($${item.sell})`;
          sellBtn.addEventListener("click", () => {
            state.inventory.owned = state.inventory.owned.filter(o => o !== ownedOfType);
            state.inventory.budget += item.sell;
            renderGameScreen();
            renderShop();
          });
          actions.appendChild(sellBtn);
        }
      } else {
        const buyBtn = document.createElement("button");
        buyBtn.className = "btn btn-primary";
        buyBtn.textContent = item.cost === 0 ? "Get" : "Buy";
        buyBtn.disabled = !canAfford && item.cost > 0;
        if (ownedOfType) {
          buyBtn.textContent = "Replace";
        }
        buyBtn.addEventListener("click", () => {
          if (!canAfford && item.cost > 0) return;
          if (ownedOfType) {
            // sell old first
            state.inventory.budget += ownedOfType.sell;
            state.inventory.owned = state.inventory.owned.filter(o => o !== ownedOfType);
          }
          state.inventory.budget -= item.cost;
          state.inventory.owned.push({ ...item, qualityBonus: item.bonus });
          renderGameScreen();
          renderShop();
        });
        actions.appendChild(buyBtn);
      }

      container.appendChild(div);
    });
  });
}

// ---- Prestige screen ---------------------------------------
function showPrestigeScreen() {
  showScreen("prestige-screen");
  const bonus = ((state.prestigeCount + 1) * 10);
  document.getElementById("prestige-bonus-val").textContent = "+" + bonus + "% growth multiplier";
  renderPlayButton();
}

function renderPlayButton() {
  const canvas = document.getElementById("play-button-canvas");
  const ctx    = canvas.getContext("2d");
  const color  = document.getElementById("pb-color").value;
  const icon   = document.getElementById("pb-icon").value;

  ctx.clearRect(0, 0, 200, 200);

  // Button body
  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, 20, 20, 160, 160, 16);
  ctx.fill();

  // Shine
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath();
  roundRect(ctx, 20, 20, 160, 70, 16);
  ctx.fill();

  // Icon
  const icons = { play:"▶", star:"★", crown:"♛", lightning:"⚡" };
  ctx.fillStyle = "#111";
  ctx.font = "bold 60px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(icons[icon] || "▶", 100, 105);
}

function doPrestige() {
  state.prestigeCount += 1;
  state.prestigeMultiplier += 0.10;
  state.channel.subscribers   = 0;
  state.channel.weekNumber    = 1;
  state.channel.reachedMilestones = [];
  state.week = 1;
  state.activeEvents = [];
  state.monetized = false;
  state.surpassedCreators = [];

  closeScreen("prestige-screen");
  showScreen("game-screen");
  renderGameScreen();
  document.getElementById("event-log").innerHTML = "<p class='log-placeholder'>Prestige! Your growth multiplier increased. Let's go again!</p>";
  document.getElementById("weekly-stats").classList.add("hidden");
  document.getElementById("monetization-banner").classList.add("hidden");

  localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState(state)));
}

// ---- Avatar rendering (pixel art) --------------------------
function buildAvatarEditor() {
  tempAvatar = { skinTone:"light", hairStyle:"short", hairColor:"brown", outfit:"casual", accessory:"none" };

  buildSwatches("opt-skin", AVATAR_CONFIG.skinTones, "skinTone", (v) => {
    tempAvatar.skinTone = v;
    renderAvatarCanvas("avatar-preview", tempAvatar, 80);
  });
  buildSwatches("opt-hair-style", AVATAR_CONFIG.hairStyles, "hairStyle", (v) => {
    tempAvatar.hairStyle = v;
    renderAvatarCanvas("avatar-preview", tempAvatar, 80);
  });
  buildSwatches("opt-hair-color", AVATAR_CONFIG.hairColors, "hairColor", (v) => {
    tempAvatar.hairColor = v;
    renderAvatarCanvas("avatar-preview", tempAvatar, 80);
  });
  buildSwatches("opt-outfit", AVATAR_CONFIG.outfits, "outfit", (v) => {
    tempAvatar.outfit = v;
    renderAvatarCanvas("avatar-preview", tempAvatar, 80);
  });
  buildSwatches("opt-accessory", AVATAR_CONFIG.accessories, "accessory", (v) => {
    tempAvatar.accessory = v;
    renderAvatarCanvas("avatar-preview", tempAvatar, 80);
  });
}

function buildSwatches(containerId, options, key, onChange) {
  const row = document.querySelector("#" + containerId + " .swatch-row");
  if (!row) return;
  row.innerHTML = "";
  options.forEach((opt, i) => {
    const sw = document.createElement("div");
    sw.className = "swatch" + (i === 0 ? " active" : "");
    sw.title = opt.id;
    if (opt.color) sw.style.background = opt.color;
    sw.textContent = opt.label || "";
    sw.addEventListener("click", () => {
      row.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
      sw.classList.add("active");
      onChange(opt.id);
    });
    row.appendChild(sw);
  });
}

function openAvatarModal(isGameScreen) {
  tempAvatar = isGameScreen
    ? { ...state.player.avatar }
    : { ...tempAvatar };

  syncSwatchSelections();
  renderAvatarCanvas("avatar-editor-canvas", tempAvatar, 120);
  document.getElementById("avatar-modal").classList.remove("hidden");

  // Wire editor canvas updates
  const groups = [
    { id:"opt-skin",       key:"skinTone",  opts:AVATAR_CONFIG.skinTones },
    { id:"opt-hair-style", key:"hairStyle", opts:AVATAR_CONFIG.hairStyles },
    { id:"opt-hair-color", key:"hairColor", opts:AVATAR_CONFIG.hairColors },
    { id:"opt-outfit",     key:"outfit",    opts:AVATAR_CONFIG.outfits },
    { id:"opt-accessory",  key:"accessory", opts:AVATAR_CONFIG.accessories },
  ];
  groups.forEach(({ id, key, opts }) => {
    const row = document.querySelector("#" + id + " .swatch-row");
    if (!row) return;
    row.querySelectorAll(".swatch").forEach((sw, i) => {
      sw.onclick = () => {
        row.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
        sw.classList.add("active");
        tempAvatar[key] = opts[i].id;
        renderAvatarCanvas("avatar-editor-canvas", tempAvatar, 120);
      };
    });
  });
}

function syncSwatchSelections() {
  const groups = [
    { id:"opt-skin",       key:"skinTone",  opts:AVATAR_CONFIG.skinTones },
    { id:"opt-hair-style", key:"hairStyle", opts:AVATAR_CONFIG.hairStyles },
    { id:"opt-hair-color", key:"hairColor", opts:AVATAR_CONFIG.hairColors },
    { id:"opt-outfit",     key:"outfit",    opts:AVATAR_CONFIG.outfits },
    { id:"opt-accessory",  key:"accessory", opts:AVATAR_CONFIG.accessories },
  ];
  groups.forEach(({ id, key, opts }) => {
    const row = document.querySelector("#" + id + " .swatch-row");
    if (!row) return;
    const swatches = row.querySelectorAll(".swatch");
    opts.forEach((opt, i) => {
      if (opt.id === tempAvatar[key]) {
        swatches.forEach(s => s.classList.remove("active"));
        if (swatches[i]) swatches[i].classList.add("active");
      }
    });
  });
}

function saveAvatarFromModal() {
  if (state) {
    state.player.avatar = { ...tempAvatar };
    renderAvatarCanvas("topbar-avatar", state.player.avatar, 40);
  }
  renderAvatarCanvas("avatar-preview", tempAvatar, 80);
  closeModal("avatar-modal");
}

function renderAvatarCanvas(canvasId, avatar, size) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const s = size / 80;  // scale factor

  ctx.clearRect(0, 0, size, size);

  const skinColor = (AVATAR_CONFIG.skinTones.find(t => t.id === (avatar.skinTone || "light")) || AVATAR_CONFIG.skinTones[0]).color;
  const hairColor = (AVATAR_CONFIG.hairColors.find(c => c.id === (avatar.hairColor || "brown")) || AVATAR_CONFIG.hairColors[0]).color;
  const outfitColor = OUTFIT_COLORS[avatar.outfit || "casual"] || "#4a90d9";

  // Body (torso)
  ctx.fillStyle = outfitColor;
  fillPixelRect(ctx, 22, 52, 36, 26, s);

  // Head
  ctx.fillStyle = skinColor;
  fillPixelRect(ctx, 24, 20, 32, 30, s);

  // Hair
  ctx.fillStyle = hairColor;
  const hs = avatar.hairStyle || "short";
  if (hs === "short")   { fillPixelRect(ctx, 24, 16, 32, 8, s); }
  if (hs === "long")    { fillPixelRect(ctx, 24, 16, 32, 8, s); fillPixelRect(ctx, 20, 24, 8, 28, s); fillPixelRect(ctx, 52, 24, 8, 28, s); }
  if (hs === "curly")   { fillPixelRect(ctx, 20, 14, 40, 12, s); fillPixelRect(ctx, 16, 20, 8, 12, s); fillPixelRect(ctx, 56, 20, 8, 12, s); }
  if (hs === "bun")     { fillPixelRect(ctx, 24, 16, 32, 6, s); fillPixelRect(ctx, 32, 8, 16, 10, s); }
  if (hs === "bald")    { /* no hair */ }
  if (hs === "mohawk")  { fillPixelRect(ctx, 36, 8, 8, 16, s); }

  // Eyes
  ctx.fillStyle = "#222";
  fillPixelRect(ctx, 30, 30, 6, 6, s);
  fillPixelRect(ctx, 44, 30, 6, 6, s);

  // Mouth
  ctx.fillStyle = "#c0667a";
  fillPixelRect(ctx, 32, 44, 16, 4, s);

  // Accessory overlay
  const acc = avatar.accessory || "none";
  if (acc === "glasses")    { ctx.strokeStyle = "#444"; ctx.lineWidth = 2; ctx.strokeRect(28*s, 29*s, 10*s, 8*s); ctx.strokeRect(42*s, 29*s, 10*s, 8*s); }
  if (acc === "hat")        { ctx.fillStyle = "#222"; fillPixelRect(ctx, 20, 8, 40, 10, s); fillPixelRect(ctx, 16, 16, 48, 6, s); }
  if (acc === "headphones") { ctx.fillStyle = "#333"; fillPixelRect(ctx, 16, 22, 6, 16, s); fillPixelRect(ctx, 58, 22, 6, 16, s); fillPixelRect(ctx, 22, 18, 36, 6, s); }
  if (acc === "mask")       { ctx.fillStyle = "#ddd"; fillPixelRect(ctx, 24, 38, 32, 14, s); }
  if (acc === "crown")      { ctx.fillStyle = "#f5c542"; fillPixelRect(ctx, 22, 10, 36, 8, s); fillPixelRect(ctx, 22, 6, 6, 6, s); fillPixelRect(ctx, 37, 4, 6, 8, s); fillPixelRect(ctx, 52, 6, 6, 6, s); }
}

function fillPixelRect(ctx, x, y, w, h, s) {
  ctx.fillRect(Math.round(x*s), Math.round(y*s), Math.round(w*s), Math.round(h*s));
}

// ---- Save / Load -------------------------------------------
function serializeState(state) {
  return {
    version: "0.1.1",  // FUTURE AI: increment patch on every release, minor on new features, major on breaking save schema changes
    player: {
      name: state.player.name,
      niche: state.player.niche,
      personality: state.player.personality,
      onCamera: state.player.onCamera,
      avatar: state.player.avatar,
    },
    channel: {
      subscribers: state.channel.subscribers,
      totalViews: state.channel.totalViews,
      watchTimeHours: state.channel.watchTimeHours,
      weekNumber: state.channel.weekNumber,
      reachedMilestones: state.channel.reachedMilestones,
    },
    inventory: {
      budget: state.inventory.budget,
      owned: state.inventory.owned,
    },
    week: state.week,
    prestigeCount: state.prestigeCount,
    prestigeMultiplier: state.prestigeMultiplier,
    monetized: state.monetized,
    surpassedCreators: state.surpassedCreators || [],
  };
}

function loadState(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    const major = v => parseInt((v || "0").split(".")[0]);
    if (major(data.version) !== major("0.1.0")) return null;
    return {
      player: data.player,
      channel: data.channel,
      inventory: data.inventory,
      week: data.week,
      prestigeCount: data.prestigeCount,
      prestigeMultiplier: data.prestigeMultiplier,
      monetized: data.monetized || false,
      surpassedCreators: data.surpassedCreators || [],
      activeEvents: [],
    };
  } catch (e) { return null; }
}

// ---- Screen helpers ----------------------------------------
function showScreen(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeScreen(id) {
  document.getElementById(id).classList.add("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

// ---- Number formatter --------------------------------------
function formatNum(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
}

// ---- Canvas helper -----------------------------------------
function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ============================================================
// VIDEO PLAYER
// ============================================================

function initVideoPlayer() {
  const btn = document.getElementById("play-pause-btn");
  if (!btn) return;
  btn.addEventListener("click", togglePlayPause);

  document.getElementById("vol-slider")?.addEventListener("input", updateVolIcon);

  document.querySelector(".player-progress-track")?.addEventListener("click", (e) => {
    const pct = e.offsetX / e.currentTarget.clientWidth;
    playerState.progress = Math.max(0, Math.min(1, pct));
    updateProgressUI();
    drawPlayerCanvas();
  });

  drawPlayerCanvas();
}

function togglePlayPause() {
  playerState.playing = !playerState.playing;
  const btn = document.getElementById("play-pause-btn");
  if (btn) btn.textContent = playerState.playing ? "⏸" : "▶";

  if (playerState.playing) {
    playerState.lastTick = performance.now();
    playerState.rafId = requestAnimationFrame(tickPlayer);
  } else {
    cancelAnimationFrame(playerState.rafId);
  }
  drawPlayerCanvas();
}

function tickPlayer(timestamp) {
  if (!playerState.playing) return;
  const elapsed = (timestamp - playerState.lastTick) / 1000;
  playerState.lastTick = timestamp;
  playerState.progress += elapsed / playerState.duration;
  if (playerState.progress >= 1) playerState.progress = 0;
  updateProgressUI();
  drawPlayerCanvas();
  playerState.rafId = requestAnimationFrame(tickPlayer);
}

function updateProgressUI() {
  const fill = document.getElementById("player-progress");
  if (fill) fill.style.width = (playerState.progress * 100).toFixed(2) + "%";

  const cur = Math.floor(playerState.progress * playerState.duration);
  const el  = document.getElementById("player-cur");
  if (el) el.textContent = Math.floor(cur / 60) + ":" + String(cur % 60).padStart(2, "0");
}

function updateVolIcon() {
  const val  = parseInt(document.getElementById("vol-slider")?.value || 80);
  const icon = document.getElementById("vol-icon");
  if (!icon) return;
  icon.textContent = val === 0 ? "🔇" : val < 40 ? "🔉" : "🔊";
}

function updateVideoTitle() {
  const el = document.getElementById("player-video-title");
  if (!el || !state) return;
  const niche  = state.player.niche;
  const week   = state.week;
  const list   = VIDEO_TITLE_TEMPLATES[niche] || VIDEO_TITLE_TEMPLATES.gaming;
  el.textContent = list[week % list.length] + " #" + week;
}

function drawPlayerCanvas() {
  const canvas = document.getElementById("player-canvas");
  if (!canvas) return;

  // Match CSS display width
  if (canvas.clientWidth > 0) canvas.width = canvas.clientWidth;
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d");

  const niche  = state?.player?.niche || "gaming";
  const colors = NICHE_COLORS[niche] || NICHE_COLORS.gaming;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, colors.bg);
  grad.addColorStop(1, colors.bg + "cc");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Scanlines when playing (subtle movement effect)
  if (playerState.playing) {
    const offset = (playerState.progress * playerState.duration * 60 | 0) % 4;
    ctx.fillStyle = "rgba(0,0,0,0.07)";
    for (let y = offset; y < H; y += 4) ctx.fillRect(0, y, W, 1);
  }

  // Large faint niche icon (background watermark)
  const nInfo = NICHE_INFO[niche] || { icon:"📺" };
  ctx.globalAlpha = 0.12;
  ctx.font = `${H * 0.55}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = colors.accent;
  ctx.fillText(nInfo.icon, W / 2, H / 2);
  ctx.globalAlpha = 1;

  // Channel name
  const name = state?.player?.name || "Your Channel";
  ctx.font = `bold ${Math.min(17, H * 0.11)}px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 6;
  ctx.fillText(name, W / 2, H * 0.42);

  // Sub count
  const subsText = state ? formatNum(state.channel.subscribers) + " subscribers" : "0 subscribers";
  ctx.font = `${Math.min(11, H * 0.075)}px ${getComputedStyle(document.body).fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.shadowBlur = 0;
  ctx.fillText(subsText, W / 2, H * 0.58);

  // REC dot (top-right, pulsing)
  if (playerState.playing) {
    const pulse = Math.sin(performance.now() / 500) > 0;
    ctx.fillStyle = pulse ? "#ff3333" : "#991111";
    ctx.beginPath();
    ctx.arc(W - 16, 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "right";
    ctx.shadowBlur = 0;
    ctx.fillText("REC", W - 24, 18);
  }

  // Paused overlay
  if (!playerState.playing && playerState.progress > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = `${H * 0.3}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⏸", W / 2, H / 2);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.shadowBlur = 0;
}

// ============================================================
// PLAY BUTTON TIER
// ============================================================

function updatePlayButton(subs) {
  const btn = document.getElementById("play-pause-btn");
  if (!btn) return;
  const match = PLAY_BTN_TIERS.find(t => subs >= t.threshold) || PLAY_BTN_TIERS[PLAY_BTN_TIERS.length - 1];
  for (let i = 0; i <= 7; i++) btn.classList.remove("tier-" + i);
  btn.classList.add("tier-" + match.tier);
  btn.title = match.title + " Play Button";
}

// ============================================================
// CREATOR LEADERBOARD
// ============================================================

function renderCreatorLeaderboard() {
  const list = document.getElementById("rivals-list");
  if (!list) return;
  list.innerHTML = "";

  const subs = state?.channel?.subscribers || 0;

  FAMOUS_CREATORS.forEach(creator => {
    const surpassed = subs >= creator.subs;
    const pct = Math.min(100, (subs / creator.subs) * 100);

    const row = document.createElement("div");
    row.className = "rival-row" + (surpassed ? " surpassed" : "");
    row.innerHTML = `
      <div class="rival-info">
        <span class="rival-icon">${creator.icon}</span>
        <span class="rival-name">${creator.name}</span>
        <span class="rival-subs">${formatNum(creator.subs)}</span>
        ${surpassed ? '<span class="rival-check">✓</span>' : ""}
      </div>
      <div class="rival-progress">
        <div class="rival-progress-fill${surpassed ? " done" : ""}" style="width:${pct.toFixed(1)}%"></div>
      </div>
    `;
    list.appendChild(row);
  });
}

function checkCreatorSurpass(prevSubs, newSubs) {
  if (!state) return;
  state.surpassedCreators = state.surpassedCreators || [];

  FAMOUS_CREATORS.forEach(creator => {
    if (prevSubs < creator.subs && newSubs >= creator.subs &&
        !state.surpassedCreators.includes(creator.name)) {
      state.surpassedCreators.push(creator.name);
      showCreatorSurpassToast(creator);
    }
  });
}

function showCreatorSurpassToast(creator) {
  const area = document.getElementById("milestone-area");
  if (!area) return;
  const toast = document.createElement("div");
  toast.className = "milestone-toast creator-surpass-toast";
  toast.innerHTML = `${creator.icon} You just surpassed <strong>${creator.name}</strong> (${formatNum(creator.subs)} subs)!`;
  area.appendChild(toast);
  setTimeout(() => toast.remove(), 6000);
}
