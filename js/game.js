(function () {
  const R = window.DeepDeckRules;
  const audio = new window.DeepDeckAudio();
  const TILE = 24;
  const COLS = 22;
  const ROWS = 12;
  const W = COLS * TILE;
  const H = ROWS * TILE;
  const MAX_CHARMS = 6;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SPRITES = {
    miner: [
      '....hhhh....',
      '...hhhhhh...',
      '...hllllh...',
      '...hssssh...',
      '...hseesh...',
      '....ssss....',
      '...rrrrrr...',
      '..rbbbbbbr..',
      '..rbbbbbbr..',
      '..rbbbbbbr..',
      '...bbbbbb...',
      '...b....b...',
      '...b....b...',
      '..bb....bb..',
      '..bb....bb..',
      '..bb....bb..',
      '.bbb....bbb.',
      '.bbb....bbb.'
    ],
    slime: [
      '............',
      '...oooooo...',
      '..obbbbbbo..',
      '.obbbbbbbbo.',
      '.obwebbewbo.',
      'obbbbbbbbbbo',
      'obbbbbbbbbbo',
      '.obbbbbbbbo.',
      '..oobooboo..'
    ],
    bat: [
      '..............',
      '..o........o..',
      '.obo..oo..obo.',
      'obbbboooobbbbo',
      'wbbbboooobbbbw',
      '.wbbbbbbbbbbw.',
      '..obbbbbbbbo..',
      '...obbppbbo...',
      '....o.oo.o....',
      '...o......o...'
    ],
    fungus: [
      '.....oooooo.....',
      '...oobbbbbboo...',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '...oobbbbbboo...',
      '.....oobboo.....',
      '....oobbbboo....',
      '...obbbbbbbbo...',
      '...obbbbbbbbo...',
      '...obwebbewbo...',
      '...obbbbbbbbo...',
      '....obbbbbbo....',
      '.....oooooo.....'
    ],
    crawler: [
      '................',
      '..o..o....o..o..',
      '.oco.oco.oco.oco',
      '.occcocccccoccco',
      '..occccccccccco.',
      '..occcppccppcco.',
      '...occccccccco..',
      '....occcocccco..',
      '...o.oco.oco.o..',
      '..o...o...o...o.'
    ],
    wisp: [
      '.....oo.....',
      '....occo....',
      '...occcco...',
      '..occcccco..',
      '.occcccccco.',
      '.occeccecco.',
      '.occcccccco.',
      '..occcccco..',
      '...occcco...',
      '....occo....',
      '.....oo.....'
    ],
    golem: [
      '....oooooooo....',
      '...obbbbbbbbo...',
      '..obbbbbbbbbbo..',
      '..obbeebbeebbo..',
      '..obbbbbbbbbbo..',
      '..obbbbbbbbbbo..',
      '..oobbbbbbbboo..',
      '...obbbbbbbbo...',
      '...obbbbbbbbo...',
      '..oobbbbbbbboo..',
      '..obboobboobbo..',
      '..obboobboobbo..',
      '..obboobboobbo..',
      '...ooo..ooo.....',
      '................',
      '................'
    ],
    imp: [
      '..o......o..',
      '.ooo....ooo.',
      '.obbo..obbo.',
      '..obboobbo..',
      '...obbbbo...',
      '..obbbbbbo..',
      '.obbebebbo..',
      '.obbbbbbbbo.',
      '..obbbbbbo..',
      '..obboobbo..',
      '..obo..obo..',
      '..o......o..'
    ],
    hound: [
      '................',
      '..oo........oo..',
      '.obbo......obbo.',
      '.obbbboooobbbbo.',
      '..obbbbbbbbbbo..',
      '..obbebbbebbo...',
      '..obbbbbbbbbbo..',
      '...obbbbbbbbo...',
      '...obbo..obbo...',
      '...obo....obo...'
    ],
    king: [
      '......o......o......',
      '.....ooo....ooo.....',
      '....ooccooooccoo....',
      '....occcccccccco....',
      '.....oooccccooo.....',
      '......obbbbbbo......',
      '.....obbbbbbbbo.....',
      '.....obbeebbeebo....',
      '.....obbbbbbbbo.....',
      '......obbbbbbo......',
      '.....obbbbbbbbo.....',
      '....obbbbbbbbbbo....',
      '....obbrrrrrrbbo....',
      '....obbrrrrrrbbo....',
      '....obbrrrrrrbbo....',
      '....obbbbbbbbbbo....',
      '...obbbbbbbbbbbbo...',
      '...obboobbbboobbo...',
      '...obo..oooo..obo...',
      '..ooo...........ooo.'
    ]
  };

  const ENEMY_ART = {
    slime: {
      sprite: SPRITES.slime,
      palette: { o: '#183821', b: '#61b46f', w: '#e7ffe9', e: '#0b1a10' },
      eye: '#b8ffc5',
      aura: '#56b96b',
      scale: 3
    },
    bat: {
      sprite: SPRITES.bat,
      palette: { o: '#2a1e39', b: '#80699e', w: '#5e4a7a', p: '#ffd875' },
      eye: '#ffd875',
      aura: '#9b7bd1',
      scale: 2.6
    },
    fungus: {
      sprite: SPRITES.fungus,
      palette: { o: '#3a1720', b: '#b6515d', w: '#ffe08b', e: '#321016' },
      eye: '#ffd96f',
      aura: '#d06070',
      scale: 2.8
    },
    crawler: {
      sprite: SPRITES.crawler,
      palette: { o: '#1b3c48', c: '#70d6e9', p: '#e7fcff' },
      eye: '#d6fbff',
      aura: '#63d6e7',
      scale: 2.5
    },
    wisp: {
      sprite: SPRITES.wisp,
      palette: { o: '#23475f', c: '#8bd8ff', e: '#fff1a8' },
      eye: '#fff1a8',
      aura: '#80d6ff',
      scale: 3
    },
    golem: {
      sprite: SPRITES.golem,
      palette: { o: '#222c4a', b: '#7f91c9', e: '#a9fff5' },
      eye: '#a9fff5',
      aura: '#8e9fff',
      scale: 2.7
    },
    imp: {
      sprite: SPRITES.imp,
      palette: { o: '#42130f', b: '#d05a42', e: '#ffe381' },
      eye: '#ffe381',
      aura: '#ff7a54',
      scale: 3
    },
    hound: {
      sprite: SPRITES.hound,
      palette: { o: '#3b100d', b: '#b34133', e: '#ffe068' },
      eye: '#ffe068',
      aura: '#ff7c48',
      scale: 2.6
    },
    king: {
      sprite: SPRITES.king,
      palette: { o: '#231820', b: '#d8cbb2', c: '#e8bc5f', e: '#ff6b77', r: '#5f2732' },
      eye: '#ff6b77',
      aura: '#ff6b77',
      scale: 2.7
    }
  };

  const MINER_PALETTE = {
    h: '#d5a34f',
    l: '#ffe9a6',
    s: '#d9a17c',
    e: '#18201e',
    r: '#b94a41',
    b: '#3c6a79',
    o: '#14201f'
  };

  const PALETTES = [
    {
      skyTop: '#071112',
      skyBottom: '#0b2020',
      fog: 'rgba(36, 96, 78, 0.16)',
      far: '#0a1b1a',
      mid: '#102b27',
      rock: '#3b382b',
      rockDark: '#27251d',
      rockLight: '#56513d',
      moss: '#54824a',
      mossLight: '#7dae64',
      dust: '#a9c69b',
      torch: '#ffc263',
      torchCore: '#fff0ad',
      eye: '#d8ffc0'
    },
    {
      skyTop: '#060d1b',
      skyBottom: '#0b1d33',
      fog: 'rgba(80, 127, 193, 0.15)',
      far: '#091522',
      mid: '#10253a',
      rock: '#353b4d',
      rockDark: '#232733',
      rockLight: '#4e5870',
      moss: '#4c6d86',
      mossLight: '#7b9eb8',
      dust: '#a9d7ef',
      torch: '#7ddcff',
      torchCore: '#e6fdff',
      eye: '#b9f6ff'
    },
    {
      skyTop: '#130909',
      skyBottom: '#24100e',
      fog: 'rgba(183, 74, 45, 0.15)',
      far: '#1b0b0a',
      mid: '#321511',
      rock: '#43322b',
      rockDark: '#2b1f1a',
      rockLight: '#654b3d',
      moss: '#7c3b2c',
      mossLight: '#b55d3e',
      dust: '#f0b07f',
      torch: '#ff9d4f',
      torchCore: '#fff1b7',
      eye: '#ffb36b'
    }
  ];

  const els = {
    shell: document.getElementById('gameShell'),
    stratumName: document.getElementById('stratumName'),
    depthLabel: document.getElementById('depthLabel'),
    progressDots: document.getElementById('progressDots'),
    heartMeter: document.getElementById('heartMeter'),
    goldValue: document.getElementById('goldValue'),
    deckCount: document.getElementById('deckCount'),
    soundBtn: document.getElementById('soundBtn'),
    caveCanvas: document.getElementById('caveCanvas'),
    caveTag: document.getElementById('caveTag'),
    phaseLabel: document.getElementById('phaseLabel'),
    phaseSub: document.getElementById('phaseSub'),
    strikeBox: document.getElementById('strikeBox'),
    strikePips: document.getElementById('strikePips'),
    buffPills: document.getElementById('buffPills'),
    roomAction: document.getElementById('roomAction'),
    blindBadge: document.getElementById('blindBadge'),
    wardenCount: document.getElementById('wardenCount'),
    enemyCanvas: document.getElementById('enemyCanvas'),
    enemyName: document.getElementById('enemyName'),
    enemyFlavor: document.getElementById('enemyFlavor'),
    targetValue: document.getElementById('targetValue'),
    targetFill: document.getElementById('targetFill'),
    targetRemain: document.getElementById('targetRemain'),
    modifierBanner: document.getElementById('modifierBanner'),
    chipValue: document.getElementById('chipValue'),
    multValue: document.getElementById('multValue'),
    handTotal: document.getElementById('handTotal'),
    handName: document.getElementById('handName'),
    handPips: document.getElementById('handPips'),
    discardPips: document.getElementById('discardPips'),
    roundScore: document.getElementById('roundScore'),
    charmRow: document.getElementById('charmRow'),
    charmCount: document.getElementById('charmCount'),
    tableKicker: document.getElementById('tableKicker'),
    tableHint: document.getElementById('tableHint'),
    pilesLabel: document.getElementById('pilesLabel'),
    handZone: document.getElementById('handZone'),
    sortBtn: document.getElementById('sortBtn'),
    discardBtn: document.getElementById('discardBtn'),
    discardBtnCount: document.getElementById('discardBtnCount'),
    playBtn: document.getElementById('playBtn'),
    playBtnCount: document.getElementById('playBtnCount'),
    toast: document.getElementById('toast'),
    titleOverlay: document.getElementById('titleOverlay'),
    bestRun: document.getElementById('bestRun'),
    helpOverlay: document.getElementById('helpOverlay'),
    rewardOverlay: document.getElementById('rewardOverlay'),
    rewardGold: document.getElementById('rewardGold'),
    rewardOffers: document.getElementById('rewardOffers'),
    rerollBtn: document.getElementById('rerollBtn'),
    patchBtn: document.getElementById('patchBtn'),
    deckOverlay: document.getElementById('deckOverlay'),
    deckSummary: document.getElementById('deckSummary'),
    deckCharms: document.getElementById('deckCharms'),
    deckCards: document.getElementById('deckCards'),
    endOverlay: document.getElementById('endOverlay'),
    endKicker: document.getElementById('endKicker'),
    endTitle: document.getElementById('endTitle'),
    endCopy: document.getElementById('endCopy'),
    endStats: document.getElementById('endStats')
  };

  const state = {
    screen: 'title',
    phase: 'title',
    busy: false,
    run: null,
    round: null,
    world: null,
    offers: [],
    selected: new Set(),
    lastHand: null,
    toastTimer: null,
    skipArmed: false,
    muted: audio.muted,
    best: 0,
    time: 0,
    light: null,
    portraitTime: 0,
    modalStack: []
  };

  const caveCtx = els.caveCanvas.getContext('2d');
  const portraitCtx = els.enemyCanvas.getContext('2d');
  const lightCanvas = document.createElement('canvas');
  lightCanvas.width = W;
  lightCanvas.height = H;
  const lightCtx = lightCanvas.getContext('2d');
  caveCtx.imageSmoothingEnabled = false;
  portraitCtx.imageSmoothingEnabled = false;
  lightCtx.imageSmoothingEnabled = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, REDUCED ? Math.min(ms, 60) : ms));
  }

  function hash2(x, y, seed) {
    let h = Math.imul(x + 374761393, 668265263) ^ Math.imul(y + 1274126177, 2246822519) ^ Math.imul(seed + 1013904223, 3266489917);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return function () {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rng) {
    return R.shuffle(list, rng || Math.random);
  }

  function loadBest() {
    try { state.best = Number(localStorage.getItem('deepdeck.best')) || 0; } catch (error) { state.best = 0; }
    renderBest();
  }

  function saveBest(value) {
    state.best = Math.max(state.best, value);
    try { localStorage.setItem('deepdeck.best', String(state.best)); } catch (error) { }
    renderBest();
  }

  function renderBest() {
    if (state.best >= 9) els.bestRun.textContent = 'THE CROWN IS YOURS · BEST DESCENT 9';
    else if (state.best > 0) els.bestRun.textContent = `BEST DESCENT · DEPTH ${state.best}`;
    else els.bestRun.textContent = 'NO DESCENT RECORDED';
  }

  function showToast(message, bad) {
    els.toast.textContent = message;
    els.toast.classList.toggle('bad', Boolean(bad));
    els.toast.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2200);
  }

  function setMuted(muted) {
    state.muted = audio.setMuted(muted);
    document.body.classList.toggle('muted', state.muted);
    els.soundBtn.setAttribute('aria-label', state.muted ? 'Unmute sound' : 'Mute sound');
    if (!state.muted && state.screen === 'game') audio.startMusic();
  }

  function currentConfig() {
    return state.run ? R.ROOMS[state.run.roomIndex] : null;
  }

  function currentStratum() {
    const config = currentConfig();
    return config ? config.stratum : R.STRATA[0];
  }

  function charmCount(type) {
    if (!state.run) return 0;
    return state.run.charms.filter(charm => charm.type === type).reduce((sum, charm) => sum + charm.value, 0);
  }

  function cardName(card) {
    const suit = R.suitInfo(card.suit);
    const enhancement = card.enhancement ? `${R.ENHANCEMENTS[card.enhancement].name} ` : '';
    return `${enhancement}${R.rankLabel(card.rank)}${suit.glyph}`;
  }

  function cardLabel(card) {
    return `${R.rankLabel(card.rank)} of ${R.suitInfo(card.suit).name}${card.enhancement ? `, ${R.ENHANCEMENTS[card.enhancement].name}` : ''}`;
  }

  function cardMarkup(card, extraClass) {
    const suit = R.suitInfo(card.suit);
    const enhancement = card.enhancement ? R.ENHANCEMENTS[card.enhancement] : null;
    const classes = ['card', suit.color, enhancement ? 'enhanced' : '', extraClass || ''].filter(Boolean).join(' ');
    const style = enhancement ? ` style="--enh-color:${enhancement.color}"` : '';
    return `<button class="${classes}" data-card="${card.id}" aria-label="${cardLabel(card)}"${style}>
      <span class="corner top"><span class="rank">${R.rankLabel(card.rank)}</span><span class="suit">${suit.glyph}</span></span>
      <span class="suit-main">${suit.glyph}</span>
      ${enhancement ? `<span class="enh-badge" title="${enhancement.desc}">${enhancement.icon}</span>` : ''}
      <span class="corner bottom"><span class="rank">${R.rankLabel(card.rank)}</span><span class="suit">${suit.glyph}</span></span>
    </button>`;
  }

  function miniCardMarkup(card, extraClass) {
    const suit = R.suitInfo(card.suit);
    const enhancement = card.enhancement ? R.ENHANCEMENTS[card.enhancement] : null;
    const classes = ['mini-card', suit.color, enhancement ? 'enhanced' : '', extraClass || ''].filter(Boolean).join(' ');
    const style = enhancement ? ` style="--enh-color:${enhancement.color}"` : '';
    return `<div class="${classes}"${style}>
      <span class="corner"><span class="rank">${R.rankLabel(card.rank)}</span><span class="suit">${suit.glyph}</span></span>
      <span class="suit-main">${suit.glyph}</span>
      ${enhancement ? `<span class="enh-badge">${enhancement.icon}</span>` : ''}
    </div>`;
  }

  function applySelectedClasses() {
    for (const node of els.handZone.querySelectorAll('.card')) {
      node.classList.toggle('selected', state.selected.has(Number(node.dataset.card)));
    }
  }

  function fitHand() {
    const count = state.phase === 'mining' ? (state.round ? state.round.handSize : 8) : (state.round ? state.round.hand.length : 0);
    if (!count) return;
    const rect = els.handZone.getBoundingClientRect();
    const widthLimit = rect.width - (window.innerWidth <= 560 ? 28 : 12);
    const heightLimit = Math.max(60, rect.height - 16);
    const units = 1 + (count - 1) * 0.66;
    const maxWidth = window.innerWidth > 1120 ? 118 : window.innerWidth > 900 ? 104 : window.innerWidth > 700 ? 100 : window.innerWidth > 560 ? 88 : 72;
    let width = Math.min(maxWidth, widthLimit / units, heightLimit * 0.685);
    width = Math.max(42, width);
    els.handZone.style.setProperty('--card-w', `${width.toFixed(1)}px`);
  }

  function updateProgress() {
    const roomIndex = state.run ? state.run.roomIndex : 0;
    els.progressDots.innerHTML = '';
    for (let index = 0; index < R.ROOMS.length; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      if (R.ROOMS[index].boss) dot.classList.add('boss');
      if (state.run && index < roomIndex) dot.classList.add('done');
      if (state.run && index === roomIndex) dot.classList.add('current');
      els.progressDots.appendChild(dot);
    }
  }

  function renderHUD() {
    const config = currentConfig();
    const stratum = config ? config.stratum : R.STRATA[0];
    els.stratumName.textContent = stratum.name;
    els.depthLabel.textContent = state.run ? `DEPTH ${state.run.roomIndex + 1}` : 'DEPTH 1';
    els.goldValue.textContent = state.run ? state.run.gold : 0;
    els.deckCount.textContent = state.run ? state.run.deck.length : 52;
    if (state.run) {
      els.heartMeter.innerHTML = '';
      for (let index = 0; index < state.run.maxHearts; index += 1) {
        const heart = document.createElement('span');
        heart.className = `heart${index < state.run.hearts ? '' : ' empty'}`;
        heart.textContent = '♥';
        els.heartMeter.appendChild(heart);
      }
      els.heartMeter.setAttribute('aria-label', `${state.run.hearts} of ${state.run.maxHearts} hearts`);
    }
    updateProgress();
  }

  function renderPips(container, current, max, type) {
    container.innerHTML = '';
    for (let index = 0; index < Math.max(max, current, 1); index += 1) {
      const pip = document.createElement('span');
      pip.className = `pip${type ? ` ${type}` : ''}${index < current ? ' live' : ''}`;
      container.appendChild(pip);
    }
  }

  function renderStrikeBox() {
    const round = state.round;
    if (!round) return;
    const mining = state.phase === 'mining';
    const label = mining ? 'PICKS' : 'HANDS';
    const current = mining ? round.strikes : round.hands;
    const max = mining ? round.strikesMax : round.handsMax;
    els.strikeBox.querySelector('span').textContent = label;
    els.strikePips.innerHTML = '';
    for (let index = 0; index < max; index += 1) {
      const pip = document.createElement('span');
      pip.className = `strike-pip${index < current ? ' live' : ''}`;
      els.strikePips.appendChild(pip);
    }
  }

  function renderCharms() {
    if (!state.run) return;
    els.charmRow.innerHTML = '';
    for (let index = 0; index < MAX_CHARMS; index += 1) {
      const charm = state.run.charms[index];
      const node = document.createElement('span');
      if (charm) {
        node.className = 'charm';
        node.style.setProperty('--charm-color', charm.color);
        node.textContent = charm.icon;
        node.title = `${charm.name} — ${charm.desc}`;
        node.setAttribute('aria-label', `${charm.name}: ${charm.desc}`);
      } else {
        node.className = 'charm empty';
        node.textContent = '·';
      }
      els.charmRow.appendChild(node);
    }
    els.charmCount.textContent = `${state.run.charms.length} / ${MAX_CHARMS}`;
  }

  function renderBuffPills() {
    const round = state.round;
    if (!round) return;
    const pills = [];
    if (round.ore.chips) pills.push(`<span class="buff-pill chips">+${round.ore.chips} CHIPS</span>`);
    if (round.ore.mult) pills.push(`<span class="buff-pill mult">+${round.ore.mult} MULT</span>`);
    if (round.ore.hands) pills.push(`<span class="buff-pill hand">+${round.ore.hands} HAND</span>`);
    if (round.ore.discards) pills.push(`<span class="buff-pill hand">+${round.ore.discards} DISCARD</span>`);
    if (round.cardsForged) pills.push(`<span class="buff-pill gold">${round.cardsForged} CARD${round.cardsForged > 1 ? 'S' : ''} FORGED</span>`);
    if (!pills.length) pills.push('<span class="muted-pill">Mine to charge the next duel</span>');
    els.buffPills.innerHTML = pills.join('');
  }

  function renderWarden() {
    const config = currentConfig();
    const round = state.round;
    if (!config || !round) return;
    els.blindBadge.textContent = config.blind;
    els.blindBadge.classList.toggle('boss', Boolean(config.boss));
    els.wardenCount.textContent = `WARDEN ${state.run.roomIndex + 1} / ${R.ROOMS.length}`;
    els.enemyName.textContent = config.name;
    els.enemyFlavor.textContent = config.flavor;
    els.targetValue.textContent = R.formatNumber(round.target);
    const ratio = clamp(round.score / round.target, 0, 1);
    els.targetFill.style.width = `${(ratio * 100).toFixed(2)}%`;
    els.targetRemain.textContent = `${R.formatNumber(round.score)} / ${R.formatNumber(round.target)}`;
    if (config.modText) {
      els.modifierBanner.hidden = false;
      els.modifierBanner.textContent = config.modText;
    } else {
      els.modifierBanner.hidden = true;
    }
    els.roundScore.textContent = R.formatNumber(round.score);
    renderPips(els.handPips, round.hands, round.handsMax, '');
    renderPips(els.discardPips, round.discards, round.discardsMax, 'discard');
    renderCharms();
    renderStrikeBox();
    const panel = els.enemyName.closest('.warden-panel');
    panel.classList.toggle('boss-aura', Boolean(config.boss));
  }

  function renderPhase() {
    const round = state.round;
    if (!round) return;
    const mining = state.phase === 'mining';
    if (mining) {
      els.phaseLabel.textContent = 'THE CLAIM';
      els.phaseSub.textContent = round.strikes > 0 ? 'Tap a glowing vein' : 'The warden stirs';
    } else if (state.phase === 'battle') {
      els.phaseLabel.textContent = 'THE DUEL';
      els.phaseSub.textContent = 'Select up to five cards';
    } else if (state.phase === 'reward') {
      els.phaseLabel.textContent = 'THE CLAIM PAYS';
      els.phaseSub.textContent = 'The vein yields';
    } else {
      els.phaseLabel.textContent = 'THE DEEP';
      els.phaseSub.textContent = 'The cave remembers';
    }
    els.roomAction.hidden = !mining;
    if (mining) {
      els.roomAction.classList.toggle('ready', round.strikes === 0);
      const label = els.roomAction.querySelector('span');
      label.textContent = round.strikes === 0 ? 'FACE THE WARDEN' : (state.skipArmed ? 'FIGHT ANYWAY' : 'FACE THE WARDEN');
    }
    renderStrikeBox();
    renderBuffPills();
    els.tableKicker.textContent = mining ? 'THE TABLE' : 'HAND';
  }

  function renderHand(animate) {
    if (!state.round) {
      els.handZone.innerHTML = '';
      return;
    }
    const count = state.phase === 'mining' ? state.round.handSize : state.round.hand.length;
    els.handZone.innerHTML = '';
    if (state.phase === 'mining') {
      for (let index = 0; index < count; index += 1) {
        const back = document.createElement('div');
        back.className = `card-back${animate ? ' deal' : ''}`;
        back.style.setProperty('--i', index);
        const rotation = (index - (count - 1) / 2) * 2.1;
        back.style.setProperty('--rot', `${rotation.toFixed(2)}deg`);
        els.handZone.appendChild(back);
      }
      els.tableHint.textContent = 'Your hand is dealt when the fight begins';
    } else {
      const hand = state.round.hand;
      const countNow = hand.length;
      hand.forEach((card, index) => {
        const suit = R.suitInfo(card.suit);
        const enhancement = card.enhancement ? R.ENHANCEMENTS[card.enhancement] : null;
        const node = document.createElement('button');
        node.className = `card ${suit.color}${enhancement ? ' enhanced' : ''}${state.selected.has(card.id) ? ' selected' : ''}${animate ? ' deal' : ''}`;
        node.dataset.card = String(card.id);
        node.style.setProperty('--i', index);
        node.style.setProperty('--rot', `${((index - (countNow - 1) / 2) * 2.1).toFixed(2)}deg`);
        if (enhancement) node.style.setProperty('--enh-color', enhancement.color);
        node.setAttribute('aria-label', cardLabel(card));
        node.innerHTML = `
          <span class="corner top"><span class="rank">${R.rankLabel(card.rank)}</span><span class="suit">${suit.glyph}</span></span>
          <span class="suit-main">${suit.glyph}</span>
          ${enhancement ? `<span class="enh-badge" title="${enhancement.desc}">${enhancement.icon}</span>` : ''}
          <span class="corner bottom"><span class="rank">${R.rankLabel(card.rank)}</span><span class="suit">${suit.glyph}</span></span>`;
        node.addEventListener('click', () => toggleCard(card.id));
        els.handZone.appendChild(node);
      });
      if (!hand.length) {
        els.tableHint.textContent = 'The table is empty';
      } else if (!state.selected.size) {
        els.tableHint.textContent = 'Tap cards to select up to five';
      }
    }
    els.pilesLabel.textContent = state.phase === 'mining' ? `${state.run.deck.length} IN DECK` : `${state.round.drawPile.length} IN DECK · ${state.round.discardPile.length} SPENT`;
    requestAnimationFrame(fitHand);
  }

  function previewScore() {
    if (!state.round || state.phase !== 'battle') return null;
    const cards = state.round.hand.filter(card => state.selected.has(card.id));
    if (!cards.length) return null;
    return R.scorePlay(cards, {
      charms: state.run.charms,
      oreChips: state.round.ore.chips,
      oreMult: state.round.ore.mult,
      firstHand: state.round.firstHand
    });
  }

  function updateSelection() {
    applySelectedClasses();
    const result = previewScore();
    if (result) {
      els.chipValue.textContent = R.formatNumber(result.chips);
      els.multValue.textContent = R.formatNumber(result.mult);
      els.handTotal.textContent = R.formatNumber(result.total);
      els.handName.textContent = result.name;
      els.tableHint.textContent = `${result.name} · ${R.formatNumber(result.total)} damage`;
    } else {
      els.chipValue.textContent = '0';
      els.multValue.textContent = '0';
      els.handTotal.textContent = '0';
      els.handName.textContent = state.phase === 'mining' ? 'Awaiting the duel' : 'Select cards';
      if (state.phase === 'battle' && state.round && state.round.hand.length) els.tableHint.textContent = 'Tap cards to select up to five';
    }
    if (!state.round) return;
    els.playBtnCount.textContent = state.round.hands;
    els.discardBtnCount.textContent = state.round.discards;
    const canAct = state.phase === 'battle' && !state.busy;
    els.playBtn.disabled = !canAct || !state.selected.size || state.selected.size > 5 || state.round.hands <= 0;
    els.discardBtn.disabled = !canAct || !state.selected.size || state.round.discards <= 0;
    els.sortBtn.disabled = !canAct || state.round.hand.length < 2;
  }

  function renderAll(animate) {
    renderHUD();
    renderWarden();
    renderPhase();
    renderHand(animate !== false);
    updateSelection();
  }

  function updateHeartsBeat() {
    const hearts = els.heartMeter.querySelectorAll('.heart');
    const active = [...hearts].filter(heart => !heart.classList.contains('empty')).pop();
    if (active) {
      active.classList.remove('beat');
      void active.offsetWidth;
      active.classList.add('beat');
    }
  }

  function makeRun() {
    const deckData = R.createDeck();
    return {
      seed: Math.floor(Math.random() * 1000000000),
      deck: deckData.cards,
      nextId: deckData.nextId,
      gold: 0,
      hearts: 3,
      maxHearts: 3,
      charms: [],
      roomIndex: 0,
      roomsCleared: 0,
      totalScore: 0,
      bestHand: 0,
      bestHandName: 'None',
      lastWinGold: 0
    };
  }

  function startRun() {
    audio.init();
    audio.startMusic();
    state.run = makeRun();
    state.screen = 'game';
    state.phase = 'mining';
    state.busy = false;
    state.selected.clear();
    state.lastHand = null;
    state.offers = [];
    els.titleOverlay.hidden = true;
    els.endOverlay.hidden = true;
    els.helpOverlay.hidden = true;
    els.deckOverlay.hidden = true;
    els.rewardOverlay.hidden = true;
    startRoom(0);
  }

  function returnToTitle() {
    state.screen = 'title';
    state.phase = 'title';
    state.busy = false;
    state.run = null;
    state.round = null;
    state.selected.clear();
    state.lastHand = null;
    state.offers = [];
    state.skipArmed = false;
    els.titleOverlay.hidden = false;
    els.endOverlay.hidden = true;
    els.helpOverlay.hidden = true;
    els.deckOverlay.hidden = true;
    els.rewardOverlay.hidden = true;
    els.handZone.innerHTML = '';
    els.goldValue.textContent = '0';
    els.deckCount.textContent = '52';
    els.heartMeter.innerHTML = '<span class="heart">♥</span><span class="heart">♥</span><span class="heart">♥</span>';
    els.stratumName.textContent = R.STRATA[0].name;
    els.depthLabel.textContent = 'DEPTH 1';
    updateProgress();
    renderBest();
    audio.stopMusic();
    setupDemoWorld();
  }

  function startRoom(index) {
    state.run.roomIndex = index;
    const config = R.ROOMS[index];
    const handsMax = Math.max(1, 4 + charmCount('hands') + (config.mods.hands || 0));
    const discardsMax = Math.max(0, 2 + charmCount('discards') + (config.mods.discards || 0));
    const strikesMax = Math.max(1, 3 + charmCount('strikes'));
    const handSize = 8 + charmCount('handSize');
    const cave = createCave(state.run.seed + index * 7919 + state.run.roomsCleared * 31, config);
    state.round = {
      config,
      target: config.target,
      score: 0,
      hands: handsMax,
      handsMax,
      discards: discardsMax,
      discardsMax,
      handSize,
      strikes: strikesMax,
      strikesMax,
      ore: { chips: 0, mult: 0, hands: 0, discards: 0 },
      cardsForged: 0,
      firstHand: true,
      hand: [],
      drawPile: [],
      discardPile: [],
      cave
    };
    state.world = createWorld(cave, config);
    state.phase = 'mining';
    state.busy = false;
    state.selected.clear();
    state.lastHand = null;
    state.skipArmed = false;
    renderAll(true);
    renderHUD();
  }

  function createCave(seed, config) {
    const rng = mulberry32(seed);
    const stratumIndex = config.stratumIndex || 0;
    const palette = PALETTES[stratumIndex];
    const map = [];
    for (let y = 0; y < ROWS; y += 1) {
      const row = [];
      for (let x = 0; x < COLS; x += 1) {
        row.push({
          solid: true,
          ore: null,
          mined: false,
          variant: hash2(x, y, seed),
          shade: hash2(x + 11, y + 7, seed)
        });
      }
      map.push(row);
    }
    const centerX = (COLS - 1) / 2;
    const centerY = 5.45;
    for (let y = 1; y < ROWS - 1; y += 1) {
      for (let x = 1; x < COLS - 1; x += 1) {
        const nx = (x - centerX) / 9.05;
        const ny = (y - centerY) / 5.55;
        const wobble = hash2(x, y, seed) * 0.2 + Math.sin(x * 1.1 + y * 0.7) * 0.035;
        if (nx * nx + ny * ny < 0.91 + wobble) map[y][x].solid = false;
      }
    }
    const pillars = 2 + Math.floor(rng() * 2);
    for (let index = 0; index < pillars; index += 1) {
      const px = 3 + Math.floor(rng() * 15);
      const py = 6 + Math.floor(rng() * 3);
      if ((px >= 5 && px <= 8) || (px >= 15 && px <= 18)) continue;
      for (let y = py - 1; y <= py + 1; y += 1) {
        for (let x = px - 1; x <= px + 1; x += 1) {
          if (x > 0 && x < COLS - 1 && y > 0 && y < ROWS - 1) map[y][x].solid = true;
        }
      }
    }
    for (let x = 5; x <= 8; x += 1) {
      for (let y = 7; y <= 9; y += 1) map[y][x].solid = false;
      map[10][x].solid = true;
      map[11][x].solid = true;
    }
    for (let x = 15; x <= 18; x += 1) {
      for (let y = 7; y <= 9; y += 1) map[y][x].solid = false;
      map[10][x].solid = true;
      map[11][x].solid = true;
    }
    for (let x = 4; x <= 19; x += 1) {
      if (!map[10][x].solid && (x < 5 || x > 8) && (x < 15 || x > 18)) {
        if (rng() < 0.45) map[10][x].solid = true;
      }
    }
    const weights = [
      [['copper', 27], ['coal', 21], ['iron', 16], ['gold', 11], ['ruby', 9], ['sapphire', 9], ['amethyst', 7]],
      [['copper', 17], ['iron', 17], ['crystal', 17], ['gold', 13], ['sapphire', 11], ['emerald', 10], ['amethyst', 8], ['coal', 7]],
      [['gold', 22], ['iron', 14], ['ruby', 17], ['crystal', 15], ['emerald', 12], ['amethyst', 13], ['coal', 7]]
    ][stratumIndex];
    const candidates = [];
    for (let y = 1; y < 10; y += 1) {
      for (let x = 1; x < COLS - 1; x += 1) {
        if (!map[y][x].solid) continue;
        const exposed = !map[y - 1][x].solid || !map[y + 1][x].solid || !map[y][x - 1].solid || !map[y][x + 1].solid;
        if (exposed) candidates.push({ x, y });
      }
    }
    shuffle(candidates, rng);
    const total = weights.reduce((sum, entry) => sum + entry[1], 0);
    const pickOre = () => {
      let roll = rng() * total;
      for (const [ore, weight] of weights) {
        roll -= weight;
        if (roll <= 0) return ore;
      }
      return weights[0][0];
    };
    let placed = 0;
    for (const spot of candidates) {
      if (placed >= 19) break;
      const cell = map[spot.y][spot.x];
      if (cell.ore) continue;
      const ore = pickOre();
      cell.ore = ore;
      placed += 1;
      if (rng() < 0.34) {
        const neighbors = candidates.filter(neighbor => {
          const distance = Math.abs(neighbor.x - spot.x) + Math.abs(neighbor.y - spot.y);
          return distance === 1 && !map[neighbor.y][neighbor.x].ore;
        });
        if (neighbors.length) {
          const neighbor = neighbors[Math.floor(rng() * neighbors.length)];
          map[neighbor.y][neighbor.x].ore = ore;
          placed += 1;
        }
      }
    }
    const hasRich = candidates.some(spot => ['gold', 'ruby', 'crystal'].includes(map[spot.y][spot.x].ore));
    if (!hasRich) {
      for (const spot of candidates) {
        if (map[spot.y][spot.x].solid && !map[spot.y][spot.x].ore) {
          map[spot.y][spot.x].ore = stratumIndex === 1 ? 'crystal' : 'gold';
          break;
        }
      }
    }
    const player = { col: 7, x: 7 * TILE + TILE / 2, y: 10 * TILE, facing: 1 };
    const enemy = { col: 16, x: 16 * TILE + TILE / 2, y: 10 * TILE };
    const torches = [
      { x: 1 * TILE + 17, y: 5 * TILE + 10, phase: rng() * 6.28 },
      { x: 20 * TILE + 4, y: 6 * TILE + 8, phase: rng() * 6.28 }
    ];
    const bgShapes = Array.from({ length: 13 }, (_, index) => ({
      x: rng() * W,
      y: rng() * H,
      radius: 18 + rng() * 74,
      alpha: 0.08 + rng() * 0.14,
      speed: 0.06 + rng() * 0.13
    }));
    const dust = Array.from({ length: 30 }, () => ({
      x: rng() * W,
      y: rng() * H,
      size: rng() < 0.75 ? 1 : 2,
      speed: 3 + rng() * 9,
      drift: -4 + rng() * 8,
      phase: rng() * 6.28
    }));
    const decor = [];
    const mushroomColors = ['#8fd7c1', '#c59cff', '#ffb38a'];
    for (let index = 0; index < 5; index += 1) {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const x = 1 + Math.floor(rng() * (COLS - 2));
        const y = 2 + Math.floor(rng() * 8);
        if (map[y][x].solid && !map[y - 1][x].solid && !map[y][x].ore) {
          decor.push({
            type: 'mushroom',
            x: x * TILE + 5 + rng() * 12,
            y: y * TILE + 2,
            color: mushroomColors[Math.floor(rng() * mushroomColors.length)],
            phase: rng() * 6.28
          });
          break;
        }
      }
    }
    for (let index = 0; index < 6; index += 1) {
      for (let attempt = 0; attempt < 25; attempt += 1) {
        const x = 2 + Math.floor(rng() * (COLS - 4));
        const y = 1 + Math.floor(rng() * 3);
        if (map[y][x].solid && !map[y + 1][x].solid) {
          decor.push({ type: 'vine', x: x * TILE + 4 + rng() * 14, y: (y + 1) * TILE, length: 4 + Math.floor(rng() * 6), phase: rng() * 6.28 });
          break;
        }
      }
    }
    return { map, player, enemy, palette, seed, config, stratumIndex, torches, bgShapes, dust, decor, rng };
  }

  function createWorld(cave, config) {
    const art = ENEMY_ART[config.enemy] || ENEMY_ART.slime;
    return {
      ...cave,
      art,
      time: 0,
      particles: [],
      popups: [],
      shake: 0,
      flash: 0,
      hover: null,
      pick: null,
      enemyHit: 0,
      enemyDead: 0,
      battle: false,
      playerBob: 0
    };
  }

  function setupDemoWorld() {
    const config = R.ROOMS[0];
    const cave = createCave(Math.floor(Math.random() * 1000000), config);
    state.world = createWorld(cave, config);
    state.world.demo = true;
    state.world.battle = false;
  }

  function spawnParticles(x, y, color, count, power) {
    if (!state.world) return;
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.3 + Math.random() * 0.7) * (power || 40);
      state.world.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 12,
        gravity: 65 + Math.random() * 60,
        life: 0.5 + Math.random() * 0.7,
        maxLife: 1.2,
        size: 1 + Math.random() * 3,
        color
      });
    }
  }

  function spawnPopup(x, y, text, color) {
    if (!state.world) return;
    state.world.popups.push({ x, y, text, color: color || '#ffe6a0', life: 1.2, maxLife: 1.2 });
  }

  function applyOre(oreId, col, row) {
    const round = state.round;
    if (!round) return { label: '+4 CHIPS', color: '#b9c8bd' };
    const ore = oreId ? R.ORE_TYPES[oreId] : null;
    if (!ore) {
      round.ore.chips += 4;
      return { label: '+4 CHIPS', color: '#b9c8bd' };
    }
    const parts = [];
    if (ore.chips) {
      round.ore.chips += ore.chips;
      parts.push(`+${ore.chips} CHIPS`);
    }
    if (ore.mult) {
      round.ore.mult += ore.mult;
      parts.push(`+${ore.mult} MULT`);
    }
    if (ore.gold) {
      state.run.gold += ore.gold;
      parts.push(`+${ore.gold} GOLD`);
    }
    if (ore.hands) {
      round.hands += ore.hands;
      round.handsMax += ore.hands;
      round.ore.hands += ore.hands;
      parts.push(`+${ore.hands} HAND`);
    }
    if (ore.discards) {
      round.discards += ore.discards;
      round.discardsMax += ore.discards;
      round.ore.discards += ore.discards;
      parts.push(`+${ore.discards} DISCARD`);
    }
    if (ore.card) {
      const cardDef = R.randomCard(Math.random, [ore.card], 7);
      const card = R.makeCard(cardDef.rank, cardDef.suit, cardDef.enhancement, state.run.nextId);
      state.run.nextId += 1;
      state.run.deck.push(card);
      round.cardsForged += 1;
      parts.push(`${R.ENHANCEMENTS[ore.card].name.toUpperCase()} ${R.rankLabel(card.rank)}${R.suitInfo(card.suit).glyph} FORGED`);
    }
    return { label: parts.join(' · '), color: ore.glow };
  }

  function mineAt(col, row) {
    if (state.phase !== 'mining' || state.busy || !state.round || !state.world) return false;
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return false;
    const cell = state.round.cave.map[row][col];
    if (!cell.solid) return false;
    if (state.round.strikes <= 0) {
      showToast('Your pick is spent. Face the Warden.', true);
      audio.no();
      return false;
    }
    state.round.strikes -= 1;
    state.skipArmed = false;
    cell.solid = false;
    cell.mined = true;
    const world = state.world;
    const startX = world.player.x;
    const startY = world.player.y - 22;
    const targetX = col * TILE + TILE / 2;
    const targetY = row * TILE + TILE / 2;
    world.pick = { x0: startX, y0: startY, x1: targetX, y1: targetY, t: 0, duration: REDUCED ? 0.08 : 0.34 };
    const ore = cell.ore;
    const color = ore ? R.ORE_TYPES[ore].glow : '#b9c8bd';
    spawnParticles(targetX, targetY, color, 16, 50);
    spawnParticles(targetX, targetY, '#3a3025', 8, 32);
    world.shake = Math.max(world.shake, 2.2);
    audio.mine();
    const result = applyOre(ore, col, row);
    spawnPopup(targetX, targetY - 5, result.label, result.color);
    if (ore) showToast(`${R.ORE_TYPES[ore].name} — ${R.ORE_TYPES[ore].desc}`);
    else showToast('Bare stone — +4 Chips');
    world.hover = null;
    els.caveTag.hidden = true;
    renderHUD();
    renderPhase();
    renderWarden();
    updateSelection();
    return true;
  }

  function startBattle() {
    if (state.phase !== 'mining' || !state.round) return;
    if (state.round.strikes > 0 && !state.skipArmed) {
      state.skipArmed = true;
      showToast(`${state.round.strikes} pick strike${state.round.strikes === 1 ? '' : 's'} remain. Tap again to fight anyway.`);
      renderPhase();
      return;
    }
    state.phase = 'battle';
    state.busy = false;
    state.skipArmed = false;
    state.selected.clear();
    state.lastHand = null;
    state.round.firstHand = true;
    state.round.drawPile = shuffle(state.run.deck);
    state.round.discardPile = [];
    state.round.hand = [];
    drawCards(state.round.handSize);
    state.world.battle = true;
    audio.click();
    renderAll(true);
    updateSelection();
  }

  function drawCards(count) {
    const round = state.round;
    if (!round) return;
    for (let index = 0; index < count; index += 1) {
      if (!round.drawPile.length) {
        if (!round.discardPile.length) break;
        round.drawPile = shuffle(round.discardPile);
        round.discardPile = [];
      }
      const card = round.drawPile.pop();
      if (card) round.hand.push(card);
    }
  }

  function toggleCard(id) {
    if (state.phase !== 'battle' || state.busy || !state.round) return;
    if (state.selected.has(id)) {
      state.selected.delete(id);
      audio.deselect();
    } else if (state.selected.size >= 5) {
      const node = els.handZone.querySelector(`.card[data-card="${id}"]`);
      if (node) {
        node.classList.remove('denied');
        void node.offsetWidth;
        node.classList.add('denied');
      }
      showToast('Five cards only. Make them count.', true);
      audio.no();
      return;
    } else {
      state.selected.add(id);
      audio.select();
    }
    updateSelection();
  }

  function animateNumber(element, from, to, duration) {
    return new Promise(resolve => {
      const start = performance.now();
      const step = now => {
        const progress = clamp((now - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = R.formatNumber(lerp(from, to, eased));
        if (progress < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  async function tallyScore(result) {
    els.handName.textContent = result.name;
    const scoreboard = document.querySelector('.scoreboard');
    scoreboard.classList.remove('bump');
    void scoreboard.offsetWidth;
    scoreboard.classList.add('bump');
    const chips = animateNumber(els.chipValue, 0, result.chips, 330);
    await wait(90);
    const mult = animateNumber(els.multValue, 0, result.mult, 300);
    await Promise.all([chips, mult]);
    audio.score(0);
    await animateNumber(els.handTotal, 0, result.total, 420);
    audio.score(3);
  }

  async function playSelected() {
    if (state.phase !== 'battle' || state.busy || !state.round) return;
    if (!state.selected.size) {
      showToast('Choose at least one card.', true);
      audio.no();
      return;
    }
    const cards = state.round.hand.filter(card => state.selected.has(card.id));
    if (cards.length > 5) return;
    state.busy = true;
    updateSelection();
    for (const node of els.handZone.querySelectorAll('.card.selected')) node.classList.add('playing');
    const result = R.scorePlay(cards, {
      charms: state.run.charms,
      oreChips: state.round.ore.chips,
      oreMult: state.round.ore.mult,
      firstHand: state.round.firstHand
    });
    state.lastHand = result;
    audio.play();
    await tallyScore(result);
    state.round.score += result.total;
    state.run.totalScore += result.total;
    if (result.total > state.run.bestHand) {
      state.run.bestHand = result.total;
      state.run.bestHandName = result.name;
    }
    if (result.gold) {
      state.run.gold += result.gold;
      spawnPopup(state.world.enemy.x, state.world.enemy.y - 58, `+${result.gold} GOLD`, '#ffe28a');
    }
    state.world.enemyHit = 0.5;
    state.world.shake = Math.max(state.world.shake, 4.5);
    spawnPopup(state.world.enemy.x, state.world.enemy.y - 42, `-${R.formatNumber(result.total)}`, '#ffdf8f');
    spawnParticles(state.world.enemy.x, state.world.enemy.y - 26, state.world.art.aura, 18, 52);
    const panel = els.enemyName.closest('.warden-panel');
    panel.classList.remove('hit');
    void panel.offsetWidth;
    panel.classList.add('hit');
    audio.hurt();
    const playedIds = new Set(cards.map(card => card.id));
    state.round.hand = state.round.hand.filter(card => !playedIds.has(card.id));
    state.round.discardPile.push(...cards);
    state.round.hands -= 1;
    state.round.firstHand = false;
    state.selected.clear();
    renderHUD();
    renderWarden();
    updateSelection();
    await wait(340);
    if (state.round.score >= state.round.target) {
      await winRoom();
      return;
    }
    if (state.round.hands <= 0) {
      await failRound();
      return;
    }
    drawCards(state.round.handSize - state.round.hand.length);
    state.busy = false;
    renderAll(true);
    updateSelection();
  }

  function discardSelected() {
    if (state.phase !== 'battle' || state.busy || !state.round) return;
    if (!state.selected.size) {
      showToast('Choose cards to discard.', true);
      audio.no();
      return;
    }
    if (state.round.discards <= 0) {
      showToast('No discards remain.', true);
      audio.no();
      return;
    }
    const discarded = state.round.hand.filter(card => state.selected.has(card.id));
    const ids = new Set(discarded.map(card => card.id));
    state.round.hand = state.round.hand.filter(card => !ids.has(card.id));
    state.round.discardPile.push(...discarded);
    state.round.discards -= 1;
    state.selected.clear();
    state.lastHand = null;
    audio.discard();
    drawCards(state.round.handSize - state.round.hand.length);
    renderAll(true);
    updateSelection();
  }

  function sortHand() {
    if (state.phase !== 'battle' || state.busy || !state.round) return;
    const suitOrder = { spades: 0, hearts: 1, clubs: 2, diamonds: 3 };
    state.round.hand.sort((a, b) => suitOrder[a.suit] - suitOrder[b.suit] || a.rank - b.rank);
    audio.click();
    renderHand(true);
    updateSelection();
  }

  async function winRoom() {
    state.busy = true;
    state.phase = 'reward';
    state.selected.clear();
    const config = state.round.config;
    const winGold = config.gold + charmCount('winGold');
    state.run.gold += winGold;
    state.run.lastWinGold = winGold;
    state.run.roomsCleared += 1;
    saveBest(state.run.roomIndex + 1);
    state.world.enemyDead = 1;
    state.world.enemyHit = 0.8;
    state.world.shake = 8;
    state.world.flash = 0.35;
    spawnParticles(state.world.enemy.x, state.world.enemy.y - 24, state.world.art.aura, 50, 95);
    spawnParticles(state.world.enemy.x, state.world.enemy.y - 24, '#ffe6a0', 24, 70);
    spawnPopup(state.world.enemy.x, state.world.enemy.y - 58, 'WARDEN FELLED', '#ffe6a0');
    audio.win();
    renderHUD();
    renderPhase();
    renderWarden();
    updateSelection();
    await wait(950);
    if (config.final) {
      endRun(true);
      return;
    }
    showReward();
  }

  async function failRound() {
    if (!state.round) return;
    state.busy = true;
    els.phaseLabel.textContent = 'THE WARDEN STRIKES';
    els.phaseSub.textContent = 'A heart is lost';
    state.run.hearts -= 1;
    state.world.flash = 0.85;
    state.world.shake = 10;
    state.world.enemyHit = 0.7;
    spawnParticles(state.world.player.x, state.world.player.y - 22, '#e2626f', 34, 85);
    spawnPopup(state.world.player.x, state.world.player.y - 50, '-1 HEART', '#ff8f98');
    audio.hurt();
    updateHeartsBeat();
    renderHUD();
    await wait(1100);
    if (state.run.hearts <= 0) {
      endRun(false);
      return;
    }
    state.round.score = 0;
    state.round.hands = state.round.handsMax;
    state.round.discards = state.round.discardsMax;
    state.round.firstHand = true;
    state.round.hand = [];
    state.round.discardPile = [];
    state.round.drawPile = shuffle(state.run.deck);
    state.selected.clear();
    state.lastHand = null;
    state.phase = 'battle';
    drawCards(state.round.handSize);
    state.busy = false;
    renderAll(true);
    updateSelection();
    showToast('The warden resets. Your ore charge remains.');
  }

  function addCardToDeck(def) {
    const card = R.makeCard(def.rank, def.suit, def.enhancement, state.run.nextId);
    state.run.nextId += 1;
    state.run.deck.push(card);
    return card;
  }

  function generateOffers() {
    const offers = [];
    let available = R.CHARMS.filter(charm => !state.run.charms.some(owned => owned.id === charm.id));
    const addCharm = () => {
      if (!available.length || state.run.charms.length + offers.filter(offer => offer.kind === 'charm').length >= MAX_CHARMS) return false;
      const index = Math.floor(Math.random() * available.length);
      const charm = available[index];
      available = available.filter(item => item.id !== charm.id);
      offers.push({ kind: 'charm', charm });
      return true;
    };
    const addCard = () => {
      const card = R.randomCard(Math.random, ['ember', 'crystal', 'frost', 'gilded', 'ember', 'crystal'], 8);
      offers.push({ kind: 'card', card });
    };
    addCharm();
    addCard();
    if (state.run.hearts < state.run.maxHearts && Math.random() < 0.5) {
      offers.push({ kind: 'heal' });
    } else if (!addCharm()) {
      addCard();
    }
    while (offers.length < 3) {
      if (Math.random() < 0.55 && addCharm()) continue;
      addCard();
    }
    return shuffle(offers).slice(0, 3);
  }

  function showReward() {
    state.phase = 'reward';
    state.busy = false;
    state.offers = generateOffers();
    renderReward();
    els.rewardOverlay.hidden = false;
    audio.reward();
  }

  function renderReward() {
    const run = state.run;
    els.rewardGold.textContent = `+${run.lastWinGold} GOLD · PURSE ${run.gold}`;
    els.rewardOffers.innerHTML = state.offers.map((offer, index) => {
      if (offer.kind === 'charm') {
        const charm = offer.charm;
        return `<button class="offer charm-offer" data-offer="${index}" style="--offer-color:${charm.color}">
          <span class="offer-kicker">CLAIM CHARM</span>
          <span class="offer-icon">${charm.icon}</span>
          <h3>${charm.name}</h3>
          <p>${charm.desc}</p>
          <span class="offer-tag">BIND TO SATCHEL</span>
        </button>`;
      }
      if (offer.kind === 'card') {
        const enhancement = R.ENHANCEMENTS[offer.card.enhancement];
        return `<button class="offer card-offer" data-offer="${index}" style="--offer-color:${enhancement.color}">
          <span class="offer-kicker">FORGE CARD</span>
          ${miniCardMarkup(offer.card)}
          <h3>${cardName(offer.card)}</h3>
          <p>${enhancement.desc}</p>
          <span class="offer-tag">ADD TO DECK</span>
        </button>`;
      }
      return `<button class="offer heal-offer" data-offer="${index}" style="--offer-color:#e2626f">
        <span class="offer-kicker">WARM EMBER</span>
        <span class="offer-icon">♥</span>
        <h3>Patch Up</h3>
        <p>Restore one heart.</p>
        <span class="offer-tag">TAKE A BREATH</span>
      </button>`;
    }).join('');
    for (const node of els.rewardOffers.querySelectorAll('[data-offer]')) {
      node.addEventListener('click', () => chooseOffer(Number(node.dataset.offer)));
    }
    els.rerollBtn.disabled = state.run.gold < 2;
    els.patchBtn.disabled = state.run.gold < 4 || state.run.hearts >= state.run.maxHearts;
    els.patchBtn.textContent = state.run.hearts >= state.run.maxHearts ? 'HEARTS FULL' : 'PATCH UP · 4 GOLD';
  }

  function chooseOffer(index) {
    if (state.phase !== 'reward' || els.rewardOverlay.hidden) return;
    const offer = state.offers[index];
    if (!offer) return;
    if (offer.kind === 'charm') {
      if (state.run.charms.length >= MAX_CHARMS) {
        showToast('Your satchel is full.', true);
        audio.no();
        return;
      }
      state.run.charms.push(offer.charm);
      if (offer.charm.type === 'maxHeart') {
        state.run.maxHearts += offer.charm.value;
        state.run.hearts = Math.min(state.run.maxHearts, state.run.hearts + offer.charm.value);
        audio.heart();
      } else {
        audio.reward();
      }
      showToast(`${offer.charm.name} bound.`);
    } else if (offer.kind === 'card') {
      const card = addCardToDeck(offer.card);
      audio.reward();
      showToast(`${cardName(card)} added to your deck.`);
    } else {
      state.run.hearts = Math.min(state.run.maxHearts, state.run.hearts + 1);
      audio.heart();
      showToast('One heart restored.');
    }
    els.rewardOverlay.hidden = true;
    renderHUD();
    advanceRoom();
  }

  function advanceRoom() {
    const previousStratum = currentConfig().stratumIndex;
    const nextIndex = state.run.roomIndex + 1;
    if (nextIndex >= R.ROOMS.length) {
      endRun(true);
      return;
    }
    startRoom(nextIndex);
    const nextStratum = currentConfig().stratumIndex;
    if (nextStratum !== previousStratum) {
      showChapter(currentConfig().stratum, nextIndex);
    }
  }

  function showChapter(stratum, index) {
    if (REDUCED) return;
    const banner = document.createElement('div');
    banner.className = 'chapter-banner';
    banner.innerHTML = `<span>DEPTH ${index + 1}</span><h3>${stratum.name}</h3><p>${stratum.subtitle}</p>`;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 2100);
  }

  function endRun(victory) {
    state.screen = 'end';
    state.phase = 'end';
    state.busy = false;
    saveBest(victory ? 9 : state.run.roomIndex + 1);
    if (victory) {
      els.endKicker.textContent = 'THE HEART OPENS';
      els.endTitle.textContent = 'The Hollow Crown Falls';
      els.endCopy.textContent = 'You played the last hand beneath the mountain. The cave will remember your name.';
      audio.win();
    } else {
      els.endKicker.textContent = 'THE DARK TAKES YOU';
      els.endTitle.textContent = 'Buried Alive';
      els.endCopy.textContent = 'The cave keeps your cards. Somewhere deeper, a warden shuffles them back in.';
      audio.lose();
    }
    els.endStats.innerHTML = `
      <div class="end-stat"><span>DEPTH</span><strong>${state.run.roomIndex + 1}</strong></div>
      <div class="end-stat"><span>BEST HAND</span><strong>${R.formatNumber(state.run.bestHand)}</strong></div>
      <div class="end-stat"><span>TOTAL SCORE</span><strong>${R.formatNumber(state.run.totalScore)}</strong></div>`;
    els.rewardOverlay.hidden = true;
    els.endOverlay.hidden = false;
  }

  function openHelp() {
    els.helpOverlay.hidden = false;
    audio.click();
  }

  function openDeck() {
    if (!state.run) return;
    renderDeck();
    els.deckOverlay.hidden = false;
    audio.click();
  }

  function closeOverlay(id) {
    const node = document.getElementById(id);
    if (!node) return;
    node.hidden = true;
    audio.click();
  }

  function renderDeck() {
    const run = state.run;
    if (!run) return;
    const enhanced = run.deck.filter(card => card.enhancement).length;
    els.deckSummary.innerHTML = `
      <span class="summary-chip">CARDS <b>${run.deck.length}</b></span>
      <span class="summary-chip">ENHANCED <b>${enhanced}</b></span>
      <span class="summary-chip">CHARMS <b>${run.charms.length} / ${MAX_CHARMS}</b></span>
      <span class="summary-chip">HEARTS <b>${run.hearts} / ${run.maxHearts}</b></span>
      <span class="summary-chip">GOLD <b>${run.gold}</b></span>`;
    els.deckCharms.innerHTML = run.charms.length
      ? run.charms.map(charm => `<div class="deck-charm" style="--charm-color:${charm.color}"><i>${charm.icon}</i><div><strong>${charm.name}</strong><small>${charm.desc}</small></div></div>`).join('')
      : '<span class="empty-charms">No charms bound yet.</span>';
    const suitOrder = { spades: 0, hearts: 1, clubs: 2, diamonds: 3 };
    const cards = run.deck.slice().sort((a, b) => suitOrder[a.suit] - suitOrder[b.suit] || a.rank - b.rank);
    els.deckCards.innerHTML = cards.map(card => miniCardMarkup(card)).join('');
  }

  function rerollReward() {
    if (state.phase !== 'reward' || state.run.gold < 2) return;
    state.run.gold -= 2;
    state.offers = generateOffers();
    renderReward();
    renderHUD();
    audio.click();
  }

  function patchUp() {
    if (state.phase !== 'reward' || state.run.gold < 4 || state.run.hearts >= state.run.maxHearts) return;
    state.run.gold -= 4;
    state.run.hearts += 1;
    renderHUD();
    renderReward();
    audio.heart();
  }

  function paintSprite(ctx, sprite, palette, x, y, scale, flip, alpha, tint) {
    const width = Math.max(...sprite.map(row => row.length));
    const offsetX = Math.round(x - (width * scale) / 2);
    const offsetY = Math.round(y);
    ctx.save();
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    const paint = (colorFor) => {
      for (let row = 0; row < sprite.length; row += 1) {
        const line = sprite[row];
        for (let col = 0; col < line.length; col += 1) {
          const char = line[col];
          if (char === '.' || char === ' ') continue;
          const color = colorFor(char);
          if (!color) continue;
          const px = offsetX + (flip ? (width - 1 - col) : col) * scale;
          const py = offsetY + row * scale;
          ctx.fillStyle = color;
          ctx.fillRect(px, py, scale, scale);
        }
      }
    };
    if (tint) {
      paint(() => tint);
    } else {
      const outline = palette.o || '#101615';
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        ctx.save();
        ctx.translate(dx, dy);
        paint(() => outline);
        ctx.restore();
      }
      paint(char => palette[char]);
    }
    ctx.restore();
  }

  function drawBackground(ctx, world) {
    const palette = world.palette;
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, palette.skyTop);
    gradient.addColorStop(0.58, palette.skyBottom);
    gradient.addColorStop(1, '#030708');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    const halo = ctx.createRadialGradient(W * 0.5, -10, 8, W * 0.5, 20, H * 0.92);
    halo.addColorStop(0, 'rgba(241, 200, 109, 0.08)');
    halo.addColorStop(0.35, palette.fog);
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
    for (const shape of world.bgShapes) {
      const drift = Math.sin(world.time * shape.speed + shape.x) * 4;
      ctx.globalAlpha = shape.alpha;
      ctx.fillStyle = palette.far;
      ctx.beginPath();
      ctx.ellipse(shape.x + drift, shape.y, shape.radius, shape.radius * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let index = 0; index < 12; index += 1) {
      const x = (index + 0.5) * (W / 12) + (hash2(index, 2, world.seed) - 0.5) * 24;
      const length = 16 + hash2(index, 3, world.seed) * 56;
      ctx.fillStyle = palette.far;
      ctx.beginPath();
      ctx.moveTo(x - 11, 0);
      ctx.lineTo(x + 11, 0);
      ctx.lineTo(x, length);
      ctx.closePath();
      ctx.fill();
    }
    for (let index = 0; index < 10; index += 1) {
      const x = (index + 0.5) * (W / 10) + (hash2(index, 8, world.seed) - 0.5) * 28;
      const length = 10 + hash2(index, 9, world.seed) * 42;
      ctx.fillStyle = palette.far;
      ctx.beginPath();
      ctx.moveTo(x - 9, H);
      ctx.lineTo(x + 9, H);
      ctx.lineTo(x, H - length);
      ctx.closePath();
      ctx.fill();
    }
    const fog = ctx.createLinearGradient(0, H * 0.55, 0, H);
    fog.addColorStop(0, 'rgba(0, 0, 0, 0)');
    fog.addColorStop(1, palette.fog);
    ctx.fillStyle = fog;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
  }

  function drawOre(ctx, cell, x, y, time) {
    const ore = R.ORE_TYPES[cell.ore];
    if (!ore) return;
    const centerX = x + TILE / 2;
    const centerY = y + TILE / 2;
    const pulse = 0.72 + Math.sin(time * 2.1 + x * 0.2 + y * 0.17) * 0.2;
    const shards = [
      [0, -5, 4, 8],
      [-6, 1, 4, 6],
      [6, 2, 3, 5],
      [-2, 6, 3, 4]
    ];
    ctx.save();
    ctx.globalAlpha = 0.18 * pulse;
    ctx.fillStyle = ore.glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    for (const [dx, dy, width, height] of shards) {
      ctx.fillStyle = ore.color;
      ctx.beginPath();
      ctx.moveTo(centerX + dx, centerY + dy - height / 2);
      ctx.lineTo(centerX + dx + width / 2, centerY + dy);
      ctx.lineTo(centerX + dx, centerY + dy + height / 2);
      ctx.lineTo(centerX + dx - width / 2, centerY + dy);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
      ctx.fillRect(centerX + dx - 1, centerY + dy - Math.floor(height / 2) + 1, 1, 2);
    }
    ctx.restore();
  }

  function drawTiles(ctx, world) {
    const palette = world.palette;
    const map = world.map;
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = map[y][x];
        if (!cell.solid) {
          if (cell.mined) {
            ctx.fillStyle = 'rgba(5, 10, 11, 0.35)';
            ctx.fillRect(x * TILE + 3, y * TILE + TILE - 5, TILE - 6, 3);
            ctx.fillStyle = palette.rockDark;
            ctx.fillRect(x * TILE + 4, y * TILE + TILE - 4, 3, 2);
            ctx.fillRect(x * TILE + TILE - 8, y * TILE + TILE - 3, 2, 2);
          }
          continue;
        }
        const px = x * TILE;
        const py = y * TILE;
        const border = x === 0 || x === COLS - 1 || y === 0 || y === ROWS - 1;
        const base = cell.variant > 0.55 ? palette.rock : palette.rockDark;
        ctx.fillStyle = border ? palette.rockDark : base;
        ctx.fillRect(px, py, TILE, TILE);
        const texture = palette.rockLight;
        ctx.globalAlpha = 0.2 + cell.shade * 0.25;
        ctx.fillStyle = texture;
        ctx.fillRect(px + 4 + Math.floor(cell.variant * 10), py + 5 + Math.floor(cell.shade * 8), 3, 2);
        ctx.fillRect(px + 13 + Math.floor(cell.shade * 5), py + 14 + Math.floor(cell.variant * 5), 2, 3);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(px, py + TILE - 2, TILE, 2);
        const above = y > 0 ? map[y - 1][x].solid : true;
        if (!above) {
          ctx.fillStyle = palette.moss;
          ctx.fillRect(px, py, TILE, 3);
          ctx.fillStyle = palette.mossLight;
          ctx.fillRect(px, py, TILE, 1);
          if (cell.variant > 0.52) {
            ctx.fillStyle = palette.moss;
            ctx.fillRect(px + Math.floor(cell.shade * 14), py + 3, 2, 2 + Math.floor(cell.variant * 3));
          }
        }
        const left = x > 0 ? map[y][x - 1].solid : true;
        const right = x < COLS - 1 ? map[y][x + 1].solid : true;
        if (!left) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
          ctx.fillRect(px, py + 2, 2, TILE - 4);
        }
        if (!right) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(px + TILE - 2, py + 2, 2, TILE - 4);
        }
        if (cell.ore) drawOre(ctx, cell, px, py, world.time);
      }
    }
    for (const decor of world.decor || []) {
      if (decor.type === 'mushroom') {
        const glow = 0.6 + Math.sin(world.time * 1.7 + decor.phase) * 0.2;
        ctx.save();
        ctx.globalAlpha = 0.13 * glow;
        ctx.fillStyle = decor.color;
        ctx.beginPath();
        ctx.arc(decor.x, decor.y - 5, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#d8c5a1';
        ctx.fillRect(decor.x - 1, decor.y - 5, 2, 5);
        ctx.fillStyle = decor.color;
        ctx.beginPath();
        ctx.ellipse(decor.x, decor.y - 6, 4, 2.5, 0, Math.PI, 0);
        ctx.fill();
        ctx.restore();
      } else if (decor.type === 'vine') {
        ctx.strokeStyle = palette.moss;
        ctx.globalAlpha = 0.6;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(decor.x, decor.y);
        for (let segment = 1; segment <= decor.length; segment += 1) {
          ctx.lineTo(decor.x + Math.sin(world.time * 0.9 + decor.phase + segment * 0.5) * 2, decor.y + segment * 4);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  function drawTorch(ctx, torch, palette, time) {
    const flicker = Math.sin(time * 10 + torch.phase) * 1.5 + Math.sin(time * 17 + torch.phase * 2) * 0.8;
    ctx.save();
    ctx.fillStyle = '#4b2b15';
    ctx.fillRect(torch.x - 2, torch.y - 8, 4, 15);
    ctx.fillStyle = '#24140b';
    ctx.fillRect(torch.x - 3, torch.y + 4, 6, 3);
    ctx.fillStyle = palette.torch;
    ctx.beginPath();
    ctx.ellipse(torch.x, torch.y - 13 + flicker * 0.2, 4.5, 7 + flicker, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.torchCore;
    ctx.beginPath();
    ctx.ellipse(torch.x, torch.y - 12 + flicker * 0.2, 2.2, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPlayer(ctx, world) {
    const player = world.player;
    const bob = Math.sin(world.time * 2.2) * 0.7;
    const scale = 2;
    const height = SPRITES.miner.length * scale;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(player.x, player.y + 2, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    paintSprite(ctx, SPRITES.miner, MINER_PALETTE, player.x, player.y - height + bob, scale, false, 1);
    ctx.restore();
  }

  function drawEnemy(ctx, world) {
    if (!world || world.enemyDead) return;
    const art = world.art;
    const sprite = art.sprite;
    const scale = art.scale;
    const width = Math.max(...sprite.map(row => row.length)) * scale;
    const height = sprite.length * scale;
    const bob = Math.sin(world.time * (world.battle ? 2.8 : 1.7)) * (world.battle ? 1.8 : 1.1);
    const hit = world.enemyHit > 0 ? Math.sin(world.time * 75) * world.enemyHit * 7 : 0;
    const x = world.enemy.x + hit;
    const y = world.enemy.y - height + bob;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(world.enemy.x, world.enemy.y + 2, width * 0.34, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    if (world.enemyHit > 0) {
      ctx.globalAlpha = 0.35;
      paintSprite(ctx, sprite, art.palette, x, y, scale, false, 0.8, '#ffffff');
      ctx.globalAlpha = 1;
    }
    paintSprite(ctx, sprite, art.palette, x, y, scale, false, 1);
    ctx.restore();
  }

  function drawPick(ctx, world) {
    const pick = world.pick;
    if (!pick) return;
    const t = clamp(pick.t, 0, 1);
    const x = lerp(pick.x0, pick.x1, t);
    const y = lerp(pick.y0, pick.y1, t) - Math.sin(Math.PI * t) * 34;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * Math.PI * 3.4);
    ctx.fillStyle = '#5a3a1d';
    ctx.fillRect(-1, -1, 13, 2);
    ctx.fillStyle = '#d9e0df';
    ctx.beginPath();
    ctx.moveTo(10, -7);
    ctx.lineTo(16, -3);
    ctx.lineTo(13, 3);
    ctx.lineTo(8, 1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawLighting(ctx, world) {
    const player = world.player;
    lightCtx.clearRect(0, 0, W, H);
    lightCtx.globalCompositeOperation = 'source-over';
    lightCtx.fillStyle = 'rgba(2, 5, 7, 0.68)';
    lightCtx.fillRect(0, 0, W, H);
    lightCtx.globalCompositeOperation = 'destination-out';
    const punch = (x, y, radius, strength) => {
      const gradient = lightCtx.createRadialGradient(x, y, 2, x, y, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      gradient.addColorStop(0.55, `rgba(0, 0, 0, ${strength * 0.72})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lightCtx.fillStyle = gradient;
      lightCtx.beginPath();
      lightCtx.arc(x, y, radius, 0, Math.PI * 2);
      lightCtx.fill();
    };
    punch(player.x, player.y - 21, 77, 1);
    for (const torch of world.torches) {
      const flicker = 1 + Math.sin(world.time * 9 + torch.phase) * 0.05;
      punch(torch.x, torch.y - 11, 55 * flicker, 0.95);
    }
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = world.map[y][x];
        if (cell.solid && cell.ore) punch(x * TILE + TILE / 2, y * TILE + TILE / 2, 15, 0.62);
      }
    }
    if (!world.enemyDead) punch(world.enemy.x, world.enemy.y - 28, 40, 0.42);
    lightCtx.globalCompositeOperation = 'source-over';
    ctx.drawImage(lightCanvas, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = (x, y, radius, color, alpha) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalAlpha = alpha;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };
    glow(player.x, player.y - 22, 34, '#ffe9a6', 0.12);
    for (const torch of world.torches) {
      const flicker = 1 + Math.sin(world.time * 10 + torch.phase) * 0.08;
      glow(torch.x, torch.y - 11, 46 * flicker, world.palette.torch, 0.13);
    }
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = world.map[y][x];
        if (cell.solid && cell.ore) {
          const ore = R.ORE_TYPES[cell.ore];
          glow(x * TILE + TILE / 2, y * TILE + TILE / 2, 19, ore.glow, 0.12);
        }
      }
    }
    if (!world.enemyDead) glow(world.enemy.x, world.enemy.y - 28, 20, world.art.eye, 0.11);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawParticles(ctx, world) {
    for (const particle of world.particles) {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawPopups(ctx, world) {
    ctx.save();
    ctx.font = '9px Silkscreen, monospace';
    ctx.textAlign = 'center';
    for (const popup of world.popups) {
      const alpha = clamp(popup.life / popup.maxLife, 0, 1);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillText(popup.text, popup.x + 1, popup.y + 1);
      ctx.fillStyle = popup.color;
      ctx.fillText(popup.text, popup.x, popup.y);
    }
    ctx.restore();
  }

  function drawDust(ctx, world) {
    ctx.save();
    for (const mote of world.dust) {
      const alpha = 0.2 + Math.sin(world.time * 1.3 + mote.phase) * 0.16;
      ctx.globalAlpha = Math.max(0.04, alpha);
      ctx.fillStyle = world.palette.dust;
      ctx.fillRect(Math.round(mote.x), Math.round(mote.y), mote.size, mote.size);
    }
    ctx.restore();
  }

  function drawHover(ctx, world) {
    if (!world.hover) return;
    const { col, row } = world.hover;
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return;
    const cell = world.map[row][col];
    if (!cell.solid) return;
    ctx.save();
    ctx.strokeStyle = cell.ore ? 'rgba(255, 232, 160, 0.9)' : 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1;
    ctx.strokeRect(col * TILE + 1.5, row * TILE + 1.5, TILE - 3, TILE - 3);
    ctx.fillStyle = 'rgba(255, 232, 160, 0.08)';
    ctx.fillRect(col * TILE + 1, row * TILE + 1, TILE - 2, TILE - 2);
    ctx.restore();
  }

  function drawCave() {
    const world = state.world;
    if (!world) {
      caveCtx.fillStyle = '#04090c';
      caveCtx.fillRect(0, 0, W, H);
      return;
    }
    const ctx = caveCtx;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (world.shake > 0.1) {
      ctx.translate((Math.random() - 0.5) * world.shake, (Math.random() - 0.5) * world.shake);
    }
    drawBackground(ctx, world);
    drawTiles(ctx, world);
    for (const torch of world.torches) drawTorch(ctx, torch, world.palette, world.time);
    drawEnemy(ctx, world);
    drawPlayer(ctx, world);
    drawPick(ctx, world);
    drawDust(ctx, world);
    drawLighting(ctx, world);
    drawParticles(ctx, world);
    drawPopups(ctx, world);
    drawHover(ctx, world);
    ctx.restore();
    const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.22, W / 2, H / 2, H * 0.82);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(0.72, 'rgba(0, 0, 0, 0.09)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    if (world.flash > 0) {
      ctx.fillStyle = `rgba(196, 48, 58, ${clamp(world.flash, 0, 1) * 0.33})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawPortrait() {
    const config = currentConfig() || (state.screen === 'title' ? R.ROOMS[0] : null);
    if (!config) return;
    const art = ENEMY_ART[config.enemy] || ENEMY_ART.slime;
    const ctx = portraitCtx;
    const width = els.enemyCanvas.width;
    const height = els.enemyCanvas.height;
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createRadialGradient(width / 2, height * 0.4, 4, width / 2, height * 0.5, width * 0.7);
    bg.addColorStop(0, art.aura);
    bg.addColorStop(0.18, 'rgba(26, 19, 27, 0.65)');
    bg.addColorStop(1, 'rgba(4, 9, 11, 0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = 0.18 + Math.sin(state.portraitTime * 1.7) * 0.05;
    ctx.strokeStyle = art.eye;
    ctx.lineWidth = 1;
    for (let index = 0; index < 3; index += 1) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 + 4, 48 + index * 12 + Math.sin(state.portraitTime * 0.8 + index) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    const spriteWidth = Math.max(...art.sprite.map(row => row.length));
    const spriteHeight = art.sprite.length;
    const scale = Math.max(3, Math.floor(Math.min((width * 0.7) / spriteWidth, (height * 0.72) / spriteHeight)));
    const bob = Math.sin(state.portraitTime * 2.2) * 2;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.82, 42, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    paintSprite(ctx, art.sprite, art.palette, width / 2, height * 0.81 - spriteHeight * scale + bob, scale, false, 1);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const glow = ctx.createRadialGradient(width / 2, height * 0.58, 0, width / 2, height * 0.58, 64);
    glow.addColorStop(0, art.eye);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.globalAlpha = 0.13 + Math.sin(state.portraitTime * 2) * 0.03;
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#000000';
    for (let y = 0; y < height; y += 3) ctx.fillRect(0, y, width, 1);
    ctx.restore();
  }

  function updateWorld(dt) {
    const world = state.world;
    if (!world) return;
    world.time += dt;
    world.shake *= Math.pow(0.0025, dt);
    if (world.shake < 0.08) world.shake = 0;
    world.flash = Math.max(0, world.flash - dt * 1.8);
    world.enemyHit = Math.max(0, world.enemyHit - dt * 2.2);
    if (world.pick) {
      world.pick.t += dt / world.pick.duration;
      if (world.pick.t >= 1) world.pick = null;
    }
    for (const particle of world.particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += particle.gravity * dt;
    }
    world.particles = world.particles.filter(particle => particle.life > 0);
    for (const popup of world.popups) {
      popup.life -= dt;
      popup.y -= 13 * dt;
    }
    world.popups = world.popups.filter(popup => popup.life > 0);
    for (const mote of world.dust) {
      mote.x += mote.drift * dt;
      mote.y -= mote.speed * dt;
      if (mote.y < -4) {
        mote.y = H + 4;
        mote.x = Math.random() * W;
      }
      if (mote.x < -4) mote.x = W + 4;
      if (mote.x > W + 4) mote.x = -4;
    }
  }

  let lastFrame = performance.now();
  function frame(now) {
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    state.time += dt;
    state.portraitTime += dt;
    updateWorld(dt);
    drawCave();
    drawPortrait();
    requestAnimationFrame(frame);
  }

  function pointerTile(event) {
    const rect = els.caveCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = ((event.clientX - rect.left) / rect.width) * W;
    const y = ((event.clientY - rect.top) / rect.height) * H;
    const col = Math.floor(x / TILE);
    const row = Math.floor(y / TILE);
    if (col < 0 || row < 0 || col >= COLS || row >= ROWS) return null;
    return { col, row };
  }

  function updateCaveTag(tile) {
    if (!tile || !state.world || state.screen !== 'game' || state.phase !== 'mining') {
      els.caveTag.hidden = true;
      if (state.world) state.world.hover = null;
      return;
    }
    const cell = state.world.map[tile.row][tile.col];
    if (!cell.solid) {
      els.caveTag.hidden = true;
      state.world.hover = null;
      return;
    }
    state.world.hover = tile;
    const ore = cell.ore ? R.ORE_TYPES[cell.ore] : null;
    els.caveTag.textContent = ore ? `${ore.name} · ${ore.desc}` : 'STONE · +4 CHIPS';
    els.caveTag.style.left = `${((tile.col + 0.5) / COLS) * 100}%`;
    els.caveTag.style.top = `${(tile.row / ROWS) * 100}%`;
    els.caveTag.style.bottom = 'auto';
    els.caveTag.hidden = false;
  }

  function scheduleFit() {
    requestAnimationFrame(fitHand);
  }

  function bindEvents() {
    els.caveCanvas.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      updateCaveTag(pointerTile(event));
    });
    els.caveCanvas.addEventListener('pointerleave', () => updateCaveTag(null));
    els.caveCanvas.addEventListener('pointerdown', event => {
      if (state.screen !== 'game' || state.phase !== 'mining') return;
      const tile = pointerTile(event);
      if (!tile) return;
      event.preventDefault();
      updateCaveTag(tile);
      mineAt(tile.col, tile.row);
    });

    document.getElementById('playGameBtn').addEventListener('click', startRun);
    document.getElementById('howBtn').addEventListener('click', openHelp);
    document.getElementById('againBtn').addEventListener('click', startRun);
    document.getElementById('menuBtn').addEventListener('click', returnToTitle);
    document.getElementById('helpBtn').addEventListener('click', openHelp);
    document.getElementById('deckBtn').addEventListener('click', openDeck);
    els.soundBtn.addEventListener('click', () => {
      audio.init();
      setMuted(!state.muted);
      if (!state.muted) audio.click();
    });
    els.roomAction.addEventListener('click', startBattle);
    els.playBtn.addEventListener('click', playSelected);
    els.discardBtn.addEventListener('click', discardSelected);
    els.sortBtn.addEventListener('click', sortHand);
    els.rerollBtn.addEventListener('click', rerollReward);
    els.patchBtn.addEventListener('click', patchUp);

    for (const node of document.querySelectorAll('[data-close]')) {
      node.addEventListener('click', () => closeOverlay(node.dataset.close));
    }
    for (const id of ['helpOverlay', 'deckOverlay']) {
      const node = document.getElementById(id);
      node.addEventListener('pointerdown', event => {
        if (event.target === node) closeOverlay(id);
      });
    }

    window.addEventListener('resize', scheduleFit);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', scheduleFit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit);

    document.addEventListener('visibilitychange', () => {
      if (!audio.context) return;
      if (document.hidden) audio.context.suspend();
      else if (state.screen === 'game' && !state.muted) audio.context.resume();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (!els.helpOverlay.hidden) {
          closeOverlay('helpOverlay');
          return;
        }
        if (!els.deckOverlay.hidden) {
          closeOverlay('deckOverlay');
          return;
        }
      }
      if (state.screen === 'title' && event.key === 'Enter' && !els.titleOverlay.hidden) {
        if (event.target.closest('button')) return;
        startRun();
        return;
      }
      if (state.screen !== 'game' || state.phase !== 'battle' || state.busy) return;
      if (/^[1-8]$/.test(event.key)) {
        const card = state.round.hand[Number(event.key) - 1];
        if (card) toggleCard(card.id);
        event.preventDefault();
      } else if (event.key === 'Enter') {
        playSelected();
        event.preventDefault();
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        discardSelected();
        event.preventDefault();
      } else if (event.key.toLowerCase() === 's') {
        sortHand();
      }
    });
  }

  function init() {
    loadBest();
    setMuted(state.muted);
    updateProgress();
    setupDemoWorld();
    bindEvents();
    frame(performance.now());
  }

  window.DeepDeck = {
    version: '1.0',
    startRun,
    returnToTitle,
    mineAt,
    startBattle,
    selectCard: toggleCard,
    selectBest() {
      if (state.phase !== 'battle' || !state.round) return false;
      const best = R.bestPlay(state.round.hand, {
        charms: state.run.charms,
        oreChips: state.round.ore.chips,
        oreMult: state.round.ore.mult,
        firstHand: state.round.firstHand
      });
      state.selected = new Set(best.selection.map(card => card.id));
      updateSelection();
      return best.name;
    },
    play: playSelected,
    discard: discardSelected,
    sort: sortHand,
    chooseOffer,
    reroll: rerollReward,
    patch: patchUp,
    openDeck,
    openHelp,
    skipMining() {
      if (state.phase !== 'mining' || !state.round) return false;
      state.round.strikes = 0;
      state.skipArmed = false;
      startBattle();
      return true;
    },
    mineOre(index) {
      if (state.phase !== 'mining' || !state.round) return false;
      const ores = [];
      for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
          const cell = state.round.cave.map[row][col];
          if (cell.solid && cell.ore) ores.push({ col, row });
        }
      }
      const target = ores[index || 0];
      return target ? mineAt(target.col, target.row) : false;
    },
    getState() {
      const run = state.run;
      const round = state.round;
      return {
        screen: state.screen,
        phase: state.phase,
        busy: state.busy,
        roomIndex: run ? run.roomIndex : null,
        depth: run ? run.roomIndex + 1 : null,
        gold: run ? run.gold : 0,
        hearts: run ? run.hearts : 0,
        maxHearts: run ? run.maxHearts : 0,
        deckSize: run ? run.deck.length : 0,
        charms: run ? run.charms.map(charm => charm.name) : [],
        target: round ? round.target : null,
        score: round ? round.score : 0,
        hands: round ? round.hands : 0,
        discards: round ? round.discards : 0,
        strikes: round ? round.strikes : 0,
        hand: round ? round.hand.map(card => ({ id: card.id, name: cardName(card) })) : [],
        selected: Array.from(state.selected),
        bestHand: run ? run.bestHand : 0
      };
    }
  };

  init();
})();
