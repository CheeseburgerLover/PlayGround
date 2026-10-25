import {
  SUITS, GEMS, BOSSES, JOKERS, VOUCHERS, RARITY,
  evaluateHand, scoreHand, createRun, advanceRound, bossFor, roundReward,
  handCards, getCard, drawCards, discardSelection, registerHand,
  rollShop, buyJoker, rerollShop, gemCache, buyVoucher, computeTarget,
} from './engine.js'
import { drawSprite, BOSS_SPRITES, ICON_SPRITES, MERCHANT_SPRITE } from './sprites.js'
import { sfx, setSoundEnabled, unlockAudio } from './audio.js'

const SAVE_KEY = 'terraratro.run.v1'
const STATS_KEY = 'terraratro.stats.v1'
const SOUND_KEY = 'terraratro.sound.v1'
const MAX_SELECTED = 5
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

const SUIT_BY_ID = Object.fromEntries(SUITS.map(s => [s.id, s]))
const GEM_IDS = Object.keys(GEMS)
const FACE_NAMES = { A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack' }

const BOSS_FLAVOR = {
  kingslime: 'The forest is safe. The crown rolls away.',
  eye: 'The night blinks first.',
  eater: 'The corruption recedes. The ground breathes again.',
  queenbee: 'The hive falls silent.',
  skeletron: 'The dungeon\'s curse finally breaks.',
  golem: 'The ancient idol crumbles to dust.',
  plantera: 'The jungle roars its approval.',
  moonlord: 'The cosmos goes quiet. Terraria is saved.',
}

const MERCHANT_LINES = [
  '"Gold buys steel. Steel buys survival. What will it be?"',
  '"You look like someone who has stared down a giant eye. I have just the trinket."',
  '"Gems are forever. Bosses are not. Buy a gem."',
  '"That Moon Lord fellow seems grumpy. Perhaps a nicer hat would help."',
  '"I have traveled far, and I have exactly what you need. Probably."',
  '"No refunds. The dungeon is very strict about that."',
]

const TIPS = [
  'Mult multiplies Damage. A little Mult goes a long way.',
  'Gem-tipped cards keep their gems for the whole run.',
  'Unused hands pay gold. Finishing a boss quickly is profitable.',
  'Interest pays $1 per $5 held, up to $5.',
  'A boss\'s effect applies every hand. Build around it.',
  'Discards are scarce. Use them to hunt for straights and flushes.',
  'Accessory slots are gold. So are accessories.',
]

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
const fmt = n => Math.round(n).toLocaleString('en-US')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

let run = null
let selected = new Set()
let busy = false
let currentScreen = 'title'
let soundOn = true
let abandonArmed = false
let tooltipEl = null
let activeTipTarget = null
let shopLine = ''

const dom = {}
const screens = {}

function cacheDom() {
  dom.title = $('#title-screen')
  dom.game = $('#game-screen')
  dom.shop = $('#shop-screen')
  dom.hand = $('#hand')
  dom.playedRow = $('#played-row')
  dom.idleHint = $('#idle-hint')
  dom.handBanner = $('#hand-banner')
  dom.bannerKicker = $('#banner-kicker')
  dom.bannerMath = $('#banner-math')
  dom.scorePopups = $('#score-popups')
  dom.scoreTotal = $('#score-total')
  dom.scoreTotalLabel = $('#score-total .st-label')
  dom.scoreTotalValue = $('#st-value')
  dom.battlefield = $('#battlefield')
  dom.roundScore = $('#round-score')
  dom.hpFill = $('#hp-fill')
  dom.targetValue = $('#target-value')
  dom.bossPanel = $('.boss-panel')
  dom.bossCanvas = $('#boss-sprite')
  dom.bossName = $('#boss-name')
  dom.bossEpithet = $('#boss-epithet')
  dom.bossBiome = $('#boss-biome')
  dom.bossEffect = $('#boss-effect')
  dom.handsLeft = $('#hands-left')
  dom.discardsLeft = $('#discards-left')
  dom.jokerSlots = $('#joker-slots')
  dom.accCount = $('#acc-count')
  dom.accHint = $('#acc-hint')
  dom.goldValue = $('#gold-value')
  dom.trail = $('#trail')
  dom.handName = $('#hand-name')
  dom.handMath = $('#hand-math')
  dom.selectedCount = $('#selected-count')
  dom.btnPlay = $('#btn-play')
  dom.btnDiscard = $('#btn-discard')
  dom.btnSort = $('#btn-sort')
  dom.sortLabel = $('#btn-sort span')
  dom.reward = $('#reward-overlay')
  dom.bossIntro = $('#boss-intro')
  dom.result = $('#result-overlay')
  dom.menu = $('#menu-overlay')
  dom.help = $('#help-overlay')
  dom.toasts = $('#toast-stack')
  dom.fx = $('#fx-canvas')
  dom.scoreFlash = $('#score-flash')
  dom.shopGold = $('#shop-gold')
  dom.shopJokers = $('#shop-jokers')
  dom.shopWares = $('#shop-wares')
  dom.ownedJokers = $('#owned-jokers')
  dom.ownedCount = $('#owned-count')
  dom.shopAnte = $('#shop-ante')
  dom.nextBoss = $('#next-boss-label')
  dom.merchantCanvas = $('#merchant-sprite')
  dom.merchantLine = $('#merchant-line')
  dom.shopTip = $('#shop-tip')
  dom.nextBossPanel = $('#next-boss-panel')
  dom.nextBossSprite = $('#next-boss-sprite')
  dom.nextBossName = $('#next-boss-name')
  dom.nextBossEffect = $('#next-boss-effect')
  dom.nextBossHp = $('#next-boss-hp')
  dom.titleBest = $('#title-best')
  dom.btnContinue = $('#btn-continue-run')
  screens.title = dom.title
  screens.game = dom.game
  screens.shop = dom.shop
}

function init() {
  cacheDom()
  loadSound()
  setupTooltip()
  bindEvents()
  setupFx()
  updateSoundButtons()
  updateTitleMeta()
  drawSprite(dom.merchantCanvas, MERCHANT_SPRITE, { size: 90, applyStyle: false })
  requestAnimationFrame(fxLoop)
}

/* ---------- persistence ---------- */
function loadStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY) || '{}')
    return {
      runs: raw.runs || 0,
      wins: raw.wins || 0,
      bestAnte: raw.bestAnte || 0,
      bestDamage: raw.bestDamage || 0,
      bestHand: raw.bestHand || null,
    }
  } catch {
    return { runs: 0, wins: 0, bestAnte: 0, bestDamage: 0, bestHand: null }
  }
}

function saveStats(stats) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)) } catch {}
}

function hydrate(saved) {
  if (!saved || !saved.deck || !saved.hand) return null
  const hydrated = {
    ...saved,
    jokers: (saved.jokers || []).map(j => (typeof j === 'string' ? JOKERS[j] : j)).filter(Boolean),
  }
  if (!hydrated.upgrades) hydrated.upgrades = { handSize: 0, discards: 0, jokerSlots: 0, bought: [] }
  if (!hydrated.stats) hydrated.stats = { handsPlayed: 0, discards: 0, roundsWon: 0, bestHand: null, bestDamage: 0, goldEarned: 0, totalDamage: 0 }
  if (!hydrated.shop) hydrated.shop = { offers: [], voucher: null, rerollCost: 2, rerolled: 0 }
  if (!hydrated.sortMode) hydrated.sortMode = 'rank'
  if (!['playing', 'shop', 'reward'].includes(hydrated.status)) return null
  return hydrated
}

function readSave() {
  try { return hydrate(JSON.parse(localStorage.getItem(SAVE_KEY) || 'null')) } catch { return null }
}

function writeSave() {
  if (!run || !run.deck) return
  try {
    const payload = { ...run, jokers: run.jokers.map(j => j.id) }
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload))
  } catch {}
}

function clearSave() {
  try { localStorage.removeItem(SAVE_KEY) } catch {}
}

function loadSound() {
  try { soundOn = localStorage.getItem(SOUND_KEY) !== '0' } catch { soundOn = true }
  setSoundEnabled(soundOn)
}

function updateSoundButtons() {
  for (const id of ['#btn-sound-game', '#btn-sound-shop']) {
    const btn = $(id)
    if (!btn) continue
    btn.innerHTML = `<svg><use href="#icon-${soundOn ? 'sound' : 'mute'}"/></svg>`
    btn.setAttribute('aria-label', soundOn ? 'Mute sound' : 'Enable sound')
  }
}

function toggleSound() {
  soundOn = !soundOn
  setSoundEnabled(soundOn)
  try { localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0') } catch {}
  updateSoundButtons()
  if (soundOn) { unlockAudio(); sfx.select() }
}

/* ---------- screens ---------- */
function showScreen(name) {
  currentScreen = name
  for (const [key, el] of Object.entries(screens)) el.classList.toggle('hidden', key !== name)
  if (name === 'title') updateTitleMeta()
}

function updateTitleMeta() {
  const stats = loadStats()
  if (!stats.runs) {
    dom.titleBest.textContent = 'No runs yet.'
  } else if (!stats.bestAnte && !stats.bestDamage) {
    dom.titleBest.textContent = `${stats.runs} run${stats.runs === 1 ? '' : 's'} attempted · no records yet`
  } else {
    const anteLabel = stats.bestAnte ? `Ante ${ROMAN[Math.min(7, stats.bestAnte - 1)]}` : 'Ante —'
    dom.titleBest.textContent = `Best: ${anteLabel} · ${fmt(stats.bestDamage)} best hand`
  }
  const saved = readSave()
  dom.btnContinue.classList.toggle('hidden', !saved)
  if (saved && saved.status === 'shop') dom.btnContinue.textContent = 'Continue · Shop'
  else if (saved && saved.status === 'reward') dom.btnContinue.textContent = 'Continue Run'
  else dom.btnContinue.textContent = 'Continue Run'
}

function goTitle() {
  run = null
  selected.clear()
  busy = false
  hideAllOverlays()
  showScreen('title')
  updateTitleMeta()
}

function hideAllOverlays() {
  for (const el of [dom.reward, dom.bossIntro, dom.result, dom.menu, dom.help]) el.classList.add('hidden')
}

/* ---------- run lifecycle ---------- */
function startNewRun() {
  unlockAudio()
  sfx.shuffle()
  run = createRun()
  selected.clear()
  busy = false
  shopLine = ''
  const stats = loadStats()
  stats.runs += 1
  saveStats(stats)
  writeSave()
  hideAllOverlays()
  showScreen('game')
  renderAll()
  showBossIntro()
  toast('A new run begins. The Guide left you a gem-tipped deck.', 'gold')
  updateTitleMeta()
}

function continueRun() {
  const saved = readSave()
  if (!saved) {
    toast('No saved run found.', 'bad')
    updateTitleMeta()
    return
  }
  unlockAudio()
  run = saved
  selected.clear()
  busy = false
  hideAllOverlays()
  if (run.status === 'shop') {
    showScreen('shop')
    renderShop()
    toast('Back at the merchant.', 'good')
  } else if (run.status === 'reward') {
    if (run.reward) {
      showScreen('game')
      renderAll()
      showReward(run.reward)
    } else {
      run.status = 'shop'
      rollShop(run)
      writeSave()
      showScreen('shop')
      renderShop()
    }
  } else {
    showScreen('game')
    renderAll()
    toast('Run resumed.', 'good')
  }
}

function bossIntro() {
  const boss = bossFor(run)
  dom.bossIntro.style.setProperty('--boss-color', boss.color)
  $('#intro-ante').textContent = `ANTE ${ROMAN[run.ante]} · ${boss.biome.toUpperCase()}`
  $('#intro-name').textContent = boss.name
  $('#intro-epithet').textContent = boss.epithet
  $('#intro-effect').textContent = boss.effect
  $('#intro-target').textContent = fmt(run.target)
  drawSprite($('#intro-sprite'), BOSS_SPRITES[boss.id], { size: 190 })
  dom.bossIntro.classList.remove('hidden')
  sfx.boss()
}

function showBossIntro() {
  bossIntro()
}

function beginFight() {
  dom.bossIntro.classList.add('hidden')
  renderAll()
  sfx.click()
}

/* ---------- rendering: game ---------- */
function renderAll() {
  if (!run) return
  selected = new Set([...selected].filter(id => run.hand.includes(id)))
  renderTrail()
  renderBoss()
  renderResources()
  renderJokers()
  sortHand()
  renderHand(false)
  renderReadout()
  updateActions()
  renderGold()
  updateIdle()
  if (dom.btnSort) dom.sortLabel.textContent = run.sortMode === 'rank' ? 'Rank' : 'Class'
}

function renderGold() {
  dom.goldValue.textContent = fmt(run?.gold || 0)
}

function renderTrail() {
  dom.trail.innerHTML = ''
  const clearedThrough = run.status === 'playing' ? run.ante - 1 : run.ante
  const active = run.status === 'playing' ? run.ante : Math.min(run.ante + 1, BOSSES.length - 1)
  BOSSES.forEach((boss, i) => {
    const step = document.createElement('div')
    step.className = 'trail-step'
    if (i > 0) {
      const line = document.createElement('span')
      line.className = 'trail-line' + (i <= clearedThrough ? ' done' : '')
      step.appendChild(line)
    }
    const dot = document.createElement('span')
    dot.className = 'trail-dot' + (i <= clearedThrough ? ' done' : '') + (i === active ? ' current' : '')
    dot.textContent = ROMAN[i]
    dot.title = boss.name
    step.appendChild(dot)
    dom.trail.appendChild(step)
  })
}

function renderBoss() {
  const boss = bossFor(run)
  dom.bossPanel.style.setProperty('--boss-color', boss.color)
  dom.bossBiome.textContent = boss.biome.toUpperCase()
  dom.bossName.textContent = boss.name
  dom.bossEpithet.textContent = boss.epithet
  dom.bossEffect.textContent = boss.effect
  dom.targetValue.textContent = fmt(run.target)
  dom.roundScore.textContent = fmt(run.roundScore)
  dom.hpFill.style.width = `${clamp((run.roundScore / run.target) * 100, 0, 100)}%`
  drawSprite(dom.bossCanvas, BOSS_SPRITES[boss.id], { size: 220, applyStyle: false })
}

function renderResources() {
  dom.handsLeft.textContent = run.handsLeft
  dom.discardsLeft.textContent = run.discardsLeft
  dom.handsLeft.classList.toggle('warn', run.handsLeft <= 1)
  dom.discardsLeft.classList.toggle('warn', run.discardsLeft <= 0)
  dom.accCount.textContent = `${run.jokers.length} / ${run.maxJokers}`
  const disabled = bossFor(run)?.mods?.jokersOff && run.status === 'playing'
  dom.accHint.textContent = disabled
    ? 'Accessories are disabled by this boss.'
    : run.jokers.length
      ? 'Hover an accessory to read it.'
      : 'Buy accessories in the shop between bosses.'
}

function renderJokers() {
  if (!run) return
  const disabled = bossFor(run)?.mods?.jokersOff && run.status === 'playing'
  dom.jokerSlots.innerHTML = ''
  for (let i = 0; i < run.maxJokers; i++) {
    const joker = run.jokers[i]
    const slot = document.createElement('div')
    if (!joker) {
      slot.className = 'joker-slot empty'
      dom.jokerSlots.appendChild(slot)
      continue
    }
    const rarity = RARITY[joker.rarity]?.color || '#9fb6c9'
    slot.className = 'joker-slot filled' + (disabled ? ' disabled' : '')
    slot.style.setProperty('--rarity', rarity)
    slot.dataset.joker = joker.id
    slot.tabIndex = 0
    slot.setAttribute('aria-label', `${joker.name}: ${joker.desc}`)
    const canvas = document.createElement('canvas')
    slot.appendChild(canvas)
    drawSprite(canvas, ICON_SPRITES[joker.icon], { size: 48, applyStyle: false })
    const name = document.createElement('span')
    name.className = 'js-name'
    name.textContent = joker.short || joker.name
    slot.appendChild(name)
    dom.jokerSlots.appendChild(slot)
  }
}

function sortHand() {
  if (!run) return
  const mode = run.sortMode
  const suitOrder = Object.fromEntries(SUITS.map((s, i) => [s.id, i]))
  run.hand.sort((aId, bId) => {
    const a = getCard(run, aId)
    const b = getCard(run, bId)
    if (!a || !b) return 0
    if (mode === 'suit') {
      return (suitOrder[a.suit] - suitOrder[b.suit]) || (b.value - a.value)
    }
    return (b.value - a.value) || (suitOrder[a.suit] - suitOrder[b.suit])
  })
}

function renderHand(animate = true) {
  if (!run) return
  dom.hand.innerHTML = ''
  const cards = handCards(run)
  if (!cards.length) {
    const empty = document.createElement('div')
    empty.className = 'empty-hand'
    empty.textContent = 'No cards in hand.'
    dom.hand.appendChild(empty)
    return
  }
  const n = cards.length
  const center = (n - 1) / 2
  const rotStep = n > 7 ? 1.7 : n > 5 ? 2.4 : 3
  const ignoresDebuff = run.jokers.some(j => j.id === 'ankh_charm')
  const debuffSuit = !ignoresDebuff && bossFor(run)?.mods?.debuffSuit ? bossFor(run).mods.debuffSuit : null
  cards.forEach((card, i) => {
    const suit = SUIT_BY_ID[card.suit]
    const gem = card.gem ? GEMS[card.gem] : null
    const debuffed = debuffSuit === card.suit
    const wrap = document.createElement('div')
    wrap.className = 'hand-card'
    const offset = i - center
    wrap.style.setProperty('--rot', `${(offset * rotStep).toFixed(2)}deg`)
    wrap.style.setProperty('--dy', `${Math.abs(offset) ** 1.35 * 1.15}px`)
    wrap.style.setProperty('--z', `${10 + i}`)
    const btn = document.createElement('button')
    btn.className = 'card' + (gem ? ' has-gem' : '') + (debuffed ? ' debuffed' : '') + (selected.has(card.id) ? ' selected' : '') + (animate ? '' : ' no-anim')
    btn.dataset.id = card.id
    btn.type = 'button'
    btn.setAttribute('aria-pressed', selected.has(card.id) ? 'true' : 'false')
    btn.setAttribute('aria-label', cardLabel(card))
    btn.style.setProperty('--suit', suit.color)
    btn.style.setProperty('--gem', gem ? gem.color : 'transparent')
    btn.style.setProperty('--deal', `${animate ? i * 34 : 0}ms`)
    btn.innerHTML = `
      <span class="card-corner">
        <span class="card-rank">${card.rank}</span>
        <svg class="card-suit"><use href="#suit-${suit.id}"/></svg>
      </span>
      <span class="card-art"><svg class="big-suit"><use href="#suit-${suit.id}"/></svg></span>
      ${debuffed ? '<span class="card-debuff" title="Debuffed: deals no Damage">×</span>' : ''}
      ${gem ? `<span class="card-gem" title="${gem.name}: ${gem.text}"></span>` : ''}
      <span class="card-corner bottom">
        <span class="card-rank">${card.rank}</span>
        <svg class="card-suit"><use href="#suit-${suit.id}"/></svg>
      </span>
    `
    btn.addEventListener('click', () => toggleCard(card.id))
    wrap.appendChild(btn)
    dom.hand.appendChild(wrap)
  })
}

function cardLabel(card) {
  const suit = SUIT_BY_ID[card.suit]
  const rank = FACE_NAMES[card.rank] || card.rank
  const gem = card.gem ? `, ${GEMS[card.gem].name} tipped` : ''
  return `${rank} of ${suit.name}${gem}`
}

function playedCardMarkup(card, index, total) {
  const suit = SUIT_BY_ID[card.suit]
  const gem = card.gem ? GEMS[card.gem] : null
  const center = (total - 1) / 2
  const rot = ((index - center) * 2.6).toFixed(2)
  return `
    <div class="played-card${gem ? ' has-gem' : ''}" data-id="${card.id}" style="--rot:${rot}deg;--suit:${suit.color};--gem:${gem ? gem.color : 'transparent'}">
      <span class="pc-rank">${card.rank}</span>
      ${gem ? '<span class="pc-gem"></span>' : ''}
      <svg class="pc-suit" style="color:${suit.color}"><use href="#suit-${suit.id}"/></svg>
      <svg class="pc-suit-mini" style="color:${suit.color}"><use href="#suit-${suit.id}"/></svg>
    </div>`
}

function renderReadout() {
  if (!run) return
  const cards = [...selected].map(id => getCard(run, id)).filter(Boolean)
  if (!cards.length) {
    dom.handName.textContent = 'Select up to 5 cards'
    dom.handName.classList.remove('active')
    dom.handMath.textContent = ''
    dom.handMath.classList.remove('show')
    return
  }
  if (!cards.length) return
  const analysis = evaluateHand(cards)
  dom.handName.textContent = analysis.name
  dom.handName.classList.add('active')
  dom.handMath.textContent = `${analysis.damage} × ${analysis.mult}`
  dom.handMath.classList.add('show')
}

function updateActions() {
  dom.selectedCount.textContent = selected.size
  const canPlay = !busy && run && run.status === 'playing' && selected.size > 0 && run.handsLeft > 0
  const canDiscard = !busy && run && run.status === 'playing' && selected.size > 0 && run.discardsLeft > 0
  dom.btnPlay.disabled = !canPlay
  dom.btnDiscard.disabled = !canDiscard
}

function updateIdle() {
  const showIdle = !dom.playedRow.children.length && !busy
  dom.idleHint.classList.toggle('hidden', !showIdle)
}

/* ---------- selection ---------- */
function toggleCard(id) {
  if (!run || busy || run.status !== 'playing') return
  if (selected.has(id)) {
    selected.delete(id)
    sfx.deselect()
  } else {
    if (selected.size >= MAX_SELECTED) {
      toast('You can only play five cards at a time.', 'bad')
      sfx.error()
      return
    }
    selected.add(id)
    sfx.select()
  }
  const btn = dom.hand.querySelector(`.card[data-id="${cssEscape(id)}"]`)
  if (btn) {
    btn.classList.toggle('selected', selected.has(id))
    btn.setAttribute('aria-pressed', selected.has(id) ? 'true' : 'false')
  }
  renderReadout()
  updateActions()
}

function clearSelection() {
  selected.clear()
  $$('.card.selected', dom.hand).forEach(el => {
    el.classList.remove('selected')
    el.setAttribute('aria-pressed', 'false')
  })
  renderReadout()
  updateActions()
}

function cssEscape(value) {
  return window.CSS?.escape ? CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, '\\$&')
}

/* ---------- actions ---------- */
async function playSelected() {
  if (busy || !run || run.status !== 'playing') return
  const ids = [...selected]
  if (!ids.length) {
    sfx.error()
    return
  }
  if (run.handsLeft <= 0) {
    toast('No hands left. The boss is still standing.', 'bad')
    return
  }
  const cards = ids.map(id => getCard(run, id)).filter(Boolean)
  const boss = bossFor(run)
  const scored = scoreHand(cards, run, boss)
  busy = true
  selected.clear()
  run.handsLeft -= 1
  registerHand(run, scored)
  const stats = loadStats()
  if (scored.total > stats.bestDamage) {
    stats.bestDamage = scored.total
    stats.bestHand = { name: scored.analysis.name, total: scored.total }
    saveStats(stats)
  }
  run.hand = run.hand.filter(id => !ids.includes(id))
  run.discardPile.push(...ids)

  updateActions()
  renderResources()
  renderBoss()
  renderHand(false)
  renderReadout()

  dom.idleHint.classList.add('hidden')
  dom.playedRow.innerHTML = cards.map((card, i) => playedCardMarkup(card, i, cards.length)).join('')
  dom.bannerKicker.textContent = scored.analysis.name.toUpperCase()
  dom.bannerMath.textContent = `${scored.analysis.damage} × ${scored.analysis.mult}`
  dom.handBanner.classList.remove('hidden')
  dom.scoreTotal.classList.remove('hidden')
  dom.scoreTotalLabel.textContent = 'DAMAGE × MULT'
  dom.scoreTotalValue.textContent = `${scored.analysis.damage} × ${scored.analysis.mult}`
  sfx.play()
  await delay(230)

  let shownDamage = scored.analysis.damage
  let shownMult = scored.analysis.mult
  const tally = () => {
    dom.scoreTotalValue.textContent = `${fmt(shownDamage)} × ${fmt(shownMult)}`
  }

  for (let i = 0; i < scored.cardSteps.length; i++) {
    const step = scored.cardSteps[i]
    const el = dom.playedRow.querySelector(`.played-card[data-id="${cssEscape(step.id)}"]`)
    if (step.debuffed) {
      if (el) popupAt(el, 'DEBUFFED', 'debuff')
      sfx.chip(i)
      await delay(130)
      continue
    }
    if (el) {
      el.classList.add('scoring')
      setTimeout(() => el.classList.remove('scoring'), 320)
      if (step.damage) popupAt(el, `+${step.damage} DMG`, 'dmg')
      if (step.mult) popupAt(el, `+${step.mult} MULT`, 'mult')
    }
    shownDamage += step.damage
    shownMult += step.mult
    tally()
    sfx.chip(i)
    if (step.mult) sfx.mult(i)
    await delay(step.retrigger ? 170 : 135)
  }

  if (scored.jokerSteps.length) {
    renderJokers()
    for (const step of scored.jokerSteps) {
      const slot = dom.jokerSlots.querySelector(`[data-joker="${step.id}"]`)
      if (slot) {
        slot.classList.add('triggered')
        popupAt(dom.battlefield, `+${step.damage ? `${step.damage} DMG ` : ''}${step.mult ? `+${step.mult} MULT` : ''}`.trim(), step.mult ? 'mult' : 'dmg')
        setTimeout(() => slot.classList.remove('triggered'), 480)
      }
      shownDamage += step.damage
      shownMult += step.mult
      tally()
      sfx.mult(2)
      await delay(245)
    }
  }

  shownDamage = scored.damage
  shownMult = scored.mult
  tally()
  await delay(150)

  const total = scored.total
  const from = run.roundScore
  run.roundScore += total
  dom.scoreTotalLabel.textContent = 'TOTAL DAMAGE'
  dom.scoreTotalValue.textContent = fmt(total)
  tweenNumber(dom.roundScore, from, run.roundScore, 380)
  dom.hpFill.style.width = `${clamp((run.roundScore / run.target) * 100, 0, 100)}%`
  dom.roundScore.classList.add('pop')
  setTimeout(() => dom.roundScore.classList.remove('pop'), 260)
  sfx.score(total >= run.target / 2)
  flashScreen()
  shakeBattlefield()
  const rect = dom.battlefield.getBoundingClientRect()
  burst(rect.left + rect.width / 2, rect.top + rect.height * 0.56, '#ffd45e', total >= run.target / 2 ? 28 : 16)

  await delay(950)

  if (run.roundScore >= run.target) {
    winRound(scored)
    return
  }
  if (run.handsLeft <= 0) {
    loseRun()
    return
  }

  await delay(380)
  dom.playedRow.innerHTML = ''
  dom.handBanner.classList.add('hidden')
  dom.scoreTotal.classList.add('hidden')
  drawCards(run, run.handSize - run.hand.length)
  renderHand(true)
  renderResources()
  renderReadout()
  renderBoss()
  renderGold()
  busy = false
  updateActions()
  updateIdle()
  writeSave()
}

async function discardSelected() {
  if (busy || !run || run.status !== 'playing') return
  const ids = [...selected]
  if (!ids.length) return
  if (run.discardsLeft <= 0) {
    toast('No discards left.', 'bad')
    sfx.error()
    return
  }
  busy = true
  updateActions()
  sfx.shuffle()
  const result = discardSelection(run, ids)
  selected.clear()
  renderResources()
  renderReadout()
  renderHand(true)
  const rect = dom.battlefield.getBoundingClientRect()
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#8ca0d1', 10)
  if (result.removed.length) toast(`Discarded ${result.removed.length} card${result.removed.length > 1 ? 's' : ''}.`, '')
  await delay(380)
  busy = false
  updateActions()
  updateIdle()
  writeSave()
}

function toggleSort() {
  if (!run) return
  run.sortMode = run.sortMode === 'rank' ? 'suit' : 'rank'
  dom.sortLabel.textContent = run.sortMode === 'rank' ? 'Rank' : 'Class'
  sortHand()
  renderHand(false)
  sfx.click()
  writeSave()
}

/* ---------- round resolution ---------- */
function winRound(scored) {
  const boss = bossFor(run)
  const reward = roundReward(run)
  run.gold += reward.total
  run.stats.goldEarned = (run.stats.goldEarned || 0) + reward.total
  run.stats.roundsWon += 1
  const stats = loadStats()
  stats.bestAnte = Math.max(stats.bestAnte, run.ante + 1)
  if (scored && scored.total > stats.bestDamage) {
    stats.bestDamage = scored.total
    stats.bestHand = { name: scored.analysis.name, total: scored.total }
  }
  saveStats(stats)
  sfx.win()
  const rect = dom.battlefield.getBoundingClientRect()
  for (let i = 0; i < 3; i++) burst(rect.left + rect.width * (0.3 + i * 0.2), rect.top + rect.height * 0.5, pick(['#ffd45e', '#6fe08a', '#66b9ff', '#c58bff']), 18)

  if (run.ante >= BOSSES.length - 1) {
    run.status = 'won'
    clearSave()
    const finalStats = loadStats()
    finalStats.wins += 1
    finalStats.bestAnte = BOSSES.length
    saveStats(finalStats)
    setTimeout(() => showResult(true), 900)
    return
  }

  run.reward = {
    bossId: boss.id,
    bossName: boss.name,
    flavor: BOSS_FLAVOR[boss.id] || 'The path opens.',
    base: reward.base,
    hands: reward.hands,
    interest: reward.interest,
    jokerBonus: reward.jokerBonus,
    total: reward.total,
  }
  run.status = 'reward'
  writeSave()
  renderGold()
  setTimeout(() => showReward(run.reward), 650)
}

function loseRun() {
  const boss = bossFor(run)
  run.status = 'lost'
  clearSave()
  const stats = loadStats()
  stats.bestAnte = Math.max(stats.bestAnte, run.ante)
  saveStats(stats)
  sfx.lose()
  setTimeout(() => showResult(false, boss), 450)
}

function showReward(reward) {
  if (!reward) return
  $('#reward-title').textContent = `${reward.bossName} Defeated`
  $('#reward-sub').textContent = reward.flavor || 'The path opens.'
  const lines = [
    ['Boss bounty', reward.base],
    ['Unused hands', reward.hands],
    ['Interest', reward.interest],
  ]
  if (reward.jokerBonus) lines.push(['Accessory bonus', reward.jokerBonus])
  $('#reward-lines').innerHTML = lines
    .map(([label, value]) => `<div class="reward-line"><span>${label}</span><b>+$${fmt(value)}</b></div>`)
    .join('')
  $('#reward-total').textContent = fmt(reward.total)
  dom.reward.classList.remove('hidden')
}

function enterShop() {
  dom.reward.classList.add('hidden')
  run.status = 'shop'
  rollShop(run)
  shopLine = MERCHANT_LINES[run.ante % MERCHANT_LINES.length]
  writeSave()
  showScreen('shop')
  renderShop()
  sfx.coin()
}

/* ---------- shop ---------- */
function renderShop() {
  if (!run) return
  dom.shopGold.textContent = fmt(run.gold)
  dom.shopAnte.textContent = ROMAN[Math.min(7, run.ante)]
  dom.merchantLine.textContent = shopLine || MERCHANT_LINES[run.ante % MERCHANT_LINES.length]
  const next = BOSSES[run.ante + 1]
  dom.nextBoss.textContent = next ? next.name : 'the Moon Lord'
  if (next) {
    dom.nextBossPanel.classList.remove('hidden')
    dom.nextBossPanel.style.setProperty('--boss-color', next.color)
    dom.nextBossName.textContent = next.name
    dom.nextBossEffect.textContent = next.effect
    dom.nextBossHp.textContent = fmt(computeTarget({ ante: run.ante + 1 }, next))
    drawSprite(dom.nextBossSprite, BOSS_SPRITES[next.id], { size: 96, applyStyle: false })
  } else {
    dom.nextBossPanel.classList.add('hidden')
  }
  dom.shopTip.textContent = TIPS[(run.ante + run.shop.rerolled) % TIPS.length]
  drawSprite(dom.merchantCanvas, MERCHANT_SPRITE, { size: 90, applyStyle: false })
  renderShopJokers()
  renderShopWares()
  renderOwnedJokers()
}

function renderShopJokers() {
  const offers = run.shop.offers || []
  if (!offers.length) {
    dom.shopJokers.innerHTML = '<p class="sold-note">The merchant has no accessories left.</p>'
    return
  }
  dom.shopJokers.innerHTML = offers.map((offer, i) => {
    const joker = JOKERS[offer.id]
    if (!joker) return ''
    const rarity = RARITY[joker.rarity]?.color || '#9fb6c9'
    const sellable = !offer.sold
    const tooPoor = run.gold < offer.cost
    const noSlot = run.jokers.length >= run.maxJokers
    const disabled = offer.sold || tooPoor || noSlot
    return `
      <article class="shop-card${offer.sold ? ' sold' : ''}" style="--rarity:${rarity}">
        <span class="sc-rarity">${RARITY[joker.rarity]?.label || 'Accessory'}</span>
        <canvas class="sc-icon" data-icon="${joker.icon}" aria-hidden="true"></canvas>
        <h4>${joker.name}</h4>
        <p>${joker.desc}</p>
        <button class="shop-buy" data-buy="${i}" ${disabled ? 'disabled' : ''}>
          <span>${offer.sold ? 'SOLD' : noSlot ? 'SLOTS FULL' : tooPoor ? 'NEED GOLD' : 'BUY'}</span>
          <span class="cost"><svg><use href="#icon-coin"/></svg>${offer.cost}</span>
        </button>
      </article>`
  }).join('')
  $$('canvas[data-icon]', dom.shopJokers).forEach(canvas => {
    drawSprite(canvas, ICON_SPRITES[canvas.dataset.icon], { size: 54, applyStyle: false })
  })
}

function renderShopWares() {
  const wares = []
  const allEnhanced = run.deck.every(c => c.gem)
  const canGem = run.gold >= 4 && !allEnhanced
  wares.push(`
    <div class="ware${allEnhanced ? ' sold' : ''}">
      <div class="w-icon gem-ware"><svg><use href="#icon-gem"/></svg></div>
      <div class="ware-info"><h4>Gem Cache</h4><p>${allEnhanced ? 'Every card is already gem-tipped.' : 'Tip a random card with a permanent gem.'}</p></div>
      <button class="ware-buy" data-ware="gem" ${canGem ? '' : 'disabled'}><svg><use href="#icon-coin"/></svg>4</button>
    </div>`)

  if (run.shop.voucher) {
    const voucher = VOUCHERS.find(v => v.id === run.shop.voucher)
    if (voucher) {
      const affordable = run.gold >= voucher.cost
      wares.push(`
        <div class="ware">
          <canvas class="w-icon" data-icon="${voucher.icon}" aria-hidden="true"></canvas>
          <div class="ware-info"><h4>${voucher.name}</h4><p>${voucher.desc}</p></div>
          <button class="ware-buy" data-ware="voucher" ${affordable ? '' : 'disabled'}><svg><use href="#icon-coin"/></svg>${voucher.cost}</button>
        </div>`)
    }
  } else {
    wares.push(`
      <div class="ware sold">
        <div class="w-icon gem-ware"><svg><use href="#icon-gem"/></svg></div>
        <div class="ware-info"><h4>Upgrades Claimed</h4><p>You have bought all the merchant's permanent upgrades.</p></div>
        <button class="ware-buy" disabled><svg><use href="#icon-coin"/></svg>—</button>
      </div>`)
  }

  const rerollCost = run.shop.rerollCost
  const canReroll = run.gold >= rerollCost
  wares.push(`
    <div class="ware">
      <div class="w-icon gem-ware" style="color:#ffd45e"><svg><use href="#icon-sort"/></svg></div>
      <div class="ware-info"><h4>Refresh Stock</h4><p>Roll a fresh set of accessories. Cost rises each time.</p></div>
      <button class="ware-buy" data-ware="reroll" ${canReroll ? '' : 'disabled'}><svg><use href="#icon-coin"/></svg>${rerollCost}</button>
    </div>`)

  dom.shopWares.innerHTML = wares.join('')
  $$('canvas[data-icon]', dom.shopWares).forEach(canvas => {
    drawSprite(canvas, ICON_SPRITES[canvas.dataset.icon], { size: 54, applyStyle: false })
  })
}

function renderOwnedJokers() {
  dom.ownedCount.textContent = `${run.jokers.length} / ${run.maxJokers}`
  if (!run.jokers.length) {
    dom.ownedJokers.innerHTML = '<p class="owned-empty">No accessories yet. Your build starts here.</p>'
    return
  }
  dom.ownedJokers.innerHTML = run.jokers.map(j => `
    <span class="owned-chip" style="--rarity:${RARITY[j.rarity]?.color || '#9fb6c9'}" title="${j.name}: ${j.desc}">
      <canvas data-icon="${j.icon}" aria-hidden="true"></canvas>${j.name}
    </span>`).join('')
  $$('canvas[data-icon]', dom.ownedJokers).forEach(canvas => {
    drawSprite(canvas, ICON_SPRITES[canvas.dataset.icon], { size: 32, applyStyle: false })
  })
}

function handleShopClick(event) {
  if (!run) return
  const buy = event.target.closest('[data-buy]')
  if (buy) {
    const index = Number(buy.dataset.buy)
    const result = buyJoker(run, index)
    if (!result.ok) {
      toast(result.reason, 'bad')
      sfx.error()
      return
    }
    sfx.buy()
    toast(`${result.joker.name} acquired. ${result.joker.desc}`, 'good')
    renderShop()
    writeSave()
    return
  }
  const ware = event.target.closest('[data-ware]')
  if (ware) {
    const action = ware.dataset.ware
    if (action === 'gem') {
      const result = gemCache(run)
      if (!result.ok) {
        toast(result.reason, 'bad')
        sfx.error()
        return
      }
      sfx.buy()
      toast(`${result.gem.name} now tips the ${result.card.rank} of ${SUIT_BY_ID[result.card.suit].name}. ${result.gem.text}.`, 'good')
      renderShop()
      writeSave()
    } else if (action === 'voucher') {
      const result = buyVoucher(run)
      if (!result.ok) {
        toast(result.reason, 'bad')
        sfx.error()
        return
      }
      sfx.buy()
      toast(`${result.voucher.name}: ${result.voucher.desc}.`, 'good')
      renderShop()
      writeSave()
    } else if (action === 'reroll') {
      const result = rerollShop(run)
      if (!result.ok) {
        toast(result.reason, 'bad')
        sfx.error()
        return
      }
      sfx.shuffle()
      toast(`Stock refreshed for $${result.cost}.`, '')
      shopLine = pick(MERCHANT_LINES)
      renderShop()
      writeSave()
    }
  }
}

function leaveShop() {
  if (!run) return
  const next = advanceRound(run)
  selected.clear()
  busy = false
  dom.reward.classList.add('hidden')
  shopLine = ''
  writeSave()
  showScreen('game')
  renderAll()
  showBossIntro()
  sfx.click()
}

/* ---------- results ---------- */
function showResult(win, boss = bossFor(run)) {
  const stats = run?.stats || {}
  const totalDamage = stats.totalDamage || 0
  const bestHand = stats.bestHand
  const gems = run ? run.deck.filter(c => c.gem).length : 0
  $('#result-kicker').textContent = win ? 'RUN COMPLETE' : 'RUN ENDED'
  $('#result-title').textContent = win ? 'The Moon Lord Falls' : `Felled by ${boss.name}`
  $('#result-sub').textContent = win
    ? 'Terraria is safe. Your deck is legend.'
    : 'The deck reshuffles. The dungeon remembers.'
  const rows = [
    [win ? 'Bosses felled' : 'Bosses felled', win ? `${BOSSES.length} / ${BOSSES.length}` : `${stats.roundsWon || 0} / ${BOSSES.length}`],
    ['Total damage', fmt(totalDamage)],
    ['Best hand', bestHand ? `${bestHand.name} · ${fmt(bestHand.total)}` : '—'],
    ['Hands played', fmt(stats.handsPlayed || 0)],
    ['Gold earned', `$${fmt(stats.goldEarned || 0)}`],
    ['Gem-tipped cards', `${gems}`],
  ]
  $('#result-stats').innerHTML = rows.map(([label, value]) => `
    <div class="result-stat"><span>${label.toUpperCase()}</span><b>${value}</b></div>`).join('')
  dom.result.classList.remove('hidden')
  if (win) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => burst(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.2 + Math.random() * 0.4), pick(['#ffd45e', '#6fe08a', '#66b9ff', '#c58bff']), 20), i * 160)
    }
  }
}

function backToTitleFromResult() {
  dom.result.classList.add('hidden')
  goTitle()
}

/* ---------- overlays ---------- */
function openMenu() {
  if (!run || currentScreen !== 'game') return
  abandonArmed = false
  $('#btn-abandon').textContent = 'Abandon Run'
  $('#btn-abandon').classList.remove('btn-primary')
  dom.menu.classList.remove('hidden')
  sfx.click()
}

function closeMenu() {
  dom.menu.classList.add('hidden')
  abandonArmed = false
}

function abandonRun() {
  if (!abandonArmed) {
    abandonArmed = true
    const btn = $('#btn-abandon')
    btn.textContent = 'Click Again to Abandon'
    btn.classList.add('btn-primary')
    setTimeout(() => {
      if (!abandonArmed) return
      abandonArmed = false
      btn.textContent = 'Abandon Run'
      btn.classList.remove('btn-primary')
    }, 3200)
    return
  }
  clearSave()
  dom.menu.classList.add('hidden')
  goTitle()
  toast('Run abandoned.', 'bad')
}

function quitToTitle() {
  writeSave()
  closeMenu()
  goTitle()
  toast('Run saved. Continue when you are ready.', 'good')
}

function openHelp() {
  dom.help.classList.remove('hidden')
  sfx.click()
}

function closeHelp() {
  dom.help.classList.add('hidden')
}

function anyOverlayOpen() {
  return [dom.reward, dom.bossIntro, dom.result, dom.menu, dom.help].some(el => !el.classList.contains('hidden'))
}

/* ---------- tooltip ---------- */
function setupTooltip() {
  tooltipEl = document.createElement('div')
  tooltipEl.className = 'joker-tip'
  document.body.appendChild(tooltipEl)
  document.addEventListener('mouseover', event => {
    const slot = event.target.closest('.joker-slot.filled')
    if (slot && slot.dataset.joker) showTip(slot)
  })
  document.addEventListener('mouseout', event => {
    const slot = event.target.closest('.joker-slot.filled')
    if (!slot) return
    if (event.relatedTarget && slot.contains(event.relatedTarget)) return
    hideTip()
  })
  document.addEventListener('focusin', event => {
    const slot = event.target.closest('.joker-slot.filled')
    if (slot && slot.dataset.joker) showTip(slot)
  })
  document.addEventListener('focusout', event => {
    if (event.target.closest('.joker-slot.filled')) hideTip()
  })
  window.addEventListener('scroll', hideTip, true)
}

function showTip(target) {
  const joker = JOKERS[target.dataset.joker]
  if (!joker) return
  activeTipTarget = target
  const rarity = RARITY[joker.rarity] || { label: 'Accessory', color: '#9fb6c9' }
  tooltipEl.style.setProperty('--rarity', rarity.color)
  tooltipEl.innerHTML = `
    <div class="jt-rarity">${rarity.label.toUpperCase()}</div>
    <div class="jt-name">${joker.name}</div>
    <div class="jt-desc">${joker.desc}</div>`
  tooltipEl.classList.add('show')
  const rect = target.getBoundingClientRect()
  const tipRect = tooltipEl.getBoundingClientRect()
  let left = rect.right + 10
  if (left + tipRect.width > innerWidth - 8) left = rect.left - tipRect.width - 10
  let top = rect.top + rect.height / 2 - tipRect.height / 2
  top = clamp(top, 8, innerHeight - tipRect.height - 8)
  tooltipEl.style.left = `${clamp(left, 8, innerWidth - tipRect.width - 8)}px`
  tooltipEl.style.top = `${top}px`
}

function hideTip() {
  tooltipEl.classList.remove('show')
  activeTipTarget = null
}

/* ---------- UI helpers ---------- */
function popupAt(el, text, kind = '') {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const field = dom.battlefield.getBoundingClientRect()
  const pop = document.createElement('div')
  pop.className = `score-pop ${kind}`
  pop.textContent = text
  pop.style.left = `${rect.left + rect.width / 2 - field.left}px`
  pop.style.top = `${rect.top + rect.height * 0.35 - field.top}px`
  dom.scorePopups.appendChild(pop)
  setTimeout(() => pop.remove(), 1100)
}

function toast(message, kind = '') {
  const el = document.createElement('div')
  el.className = `toast ${kind}`
  el.textContent = message
  dom.toasts.appendChild(el)
  while (dom.toasts.children.length > 3) dom.toasts.firstElementChild.remove()
  setTimeout(() => el.remove(), 2700)
}

function tweenNumber(el, from, to, duration = 400) {
  const start = performance.now()
  const step = now => {
    const t = clamp((now - start) / duration, 0, 1)
    const eased = 1 - (1 - t) ** 3
    el.textContent = fmt(from + (to - from) * eased)
    if (t < 1) requestAnimationFrame(step)
    else el.textContent = fmt(to)
  }
  requestAnimationFrame(step)
}

function flashScreen() {
  dom.scoreFlash.classList.remove('on')
  void dom.scoreFlash.offsetWidth
  dom.scoreFlash.classList.add('on')
}

function shakeBattlefield() {
  dom.battlefield.classList.remove('shake')
  void dom.battlefield.offsetWidth
  dom.battlefield.classList.add('shake')
  setTimeout(() => dom.battlefield.classList.remove('shake'), 460)
}

/* ---------- FX ---------- */
let fxWidth = 0
let fxHeight = 0
let particles = []
let lastSpawn = 0

function setupFx() {
  resizeFx()
  addEventListener('resize', resizeFx)
}

function resizeFx() {
  const dpr = Math.min(2, devicePixelRatio || 1)
  fxWidth = innerWidth
  fxHeight = innerHeight
  dom.fx.width = Math.floor(fxWidth * dpr)
  dom.fx.height = Math.floor(fxHeight * dpr)
  dom.fx.style.width = `${fxWidth}px`
  dom.fx.style.height = `${fxHeight}px`
  const ctx = dom.fx.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function makeParticle(initial = false) {
  const colors = currentScreen === 'shop'
    ? ['#ffd45e', '#ffb03a', '#ffe6a4']
    : ['#ffd45e', '#8ce06c', '#66b9ff', '#c58bff', '#ffe6a4']
  return {
    x: Math.random() * fxWidth,
    y: initial ? Math.random() * fxHeight : fxHeight + 12,
    vx: (Math.random() - 0.5) * 0.14,
    vy: -(0.08 + Math.random() * 0.28),
    size: Math.random() < 0.3 ? 2 : 1.4,
    life: 0,
    maxLife: 300 + Math.random() * 420,
    color: pick(colors),
    phase: Math.random() * Math.PI * 2,
  }
}

function fxLoop(now) {
  const ctx = dom.fx.getContext('2d')
  ctx.clearRect(0, 0, fxWidth, fxHeight)
  if (particles.length < 42 && now - lastSpawn > 380) {
    particles.push(makeParticle())
    if (particles.length < 22) particles.push(makeParticle(true))
    lastSpawn = now
  }
  for (const p of particles) {
    p.life += 1
    p.x += p.vx + Math.sin((p.life + p.phase) / 90) * 0.08
    p.y += p.vy
    const t = p.life / p.maxLife
    const alpha = Math.sin(Math.min(1, t) * Math.PI) * 0.55
    if (alpha <= 0.01) continue
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.fillRect(p.x, p.y, p.size, p.size)
  }
  ctx.globalAlpha = 1
  particles = particles.filter(p => p.life < p.maxLife && p.y > -20)
  requestAnimationFrame(fxLoop)
}

function burst(x, y, color, count = 16) {
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div')
    spark.className = 'spark'
    spark.style.left = `${x}px`
    spark.style.top = `${y}px`
    spark.style.background = color
    spark.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}`
    spark.style.width = `${2 + Math.random() * 4}px`
    spark.style.height = spark.style.width
    document.body.appendChild(spark)
    const angle = Math.random() * Math.PI * 2
    const distance = 30 + Math.random() * 150
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance - 30
    const dur = 450 + Math.random() * 550
    spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(${Math.random() * 0.6 + 0.2})`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(.15,.75,.3,1)' }).onfinish = () => spark.remove()
  }
}

/* ---------- keyboard / events ---------- */
function setupKeyboard() {
  document.addEventListener('keydown', event => {
    const key = event.key
    if (key === 'Escape') {
      if (!dom.help.classList.contains('hidden')) { closeHelp(); return }
      if (!dom.menu.classList.contains('hidden')) { closeMenu(); return }
      if (!dom.reward.classList.contains('hidden') || !dom.result.classList.contains('hidden') || !dom.bossIntro.classList.contains('hidden')) return
      if (currentScreen === 'game' && run?.status === 'playing') {
        if (selected.size) { clearSelection(); sfx.deselect() }
        else openMenu()
      }
      return
    }
    if (key === 'h' || key === 'H') {
      if (anyOverlayOpen() && dom.help.classList.contains('hidden')) return
      if (dom.help.classList.contains('hidden')) openHelp(); else closeHelp()
      return
    }
    if (!dom.help.classList.contains('hidden')) return
    if (!dom.bossIntro.classList.contains('hidden')) {
      if (key === 'Enter' || key === ' ') { event.preventDefault(); beginFight() }
      return
    }
    if (!dom.reward.classList.contains('hidden')) {
      if (key === 'Enter' || key === ' ') { event.preventDefault(); enterShop() }
      return
    }
    if (!dom.result.classList.contains('hidden')) return
    if (!dom.menu.classList.contains('hidden')) return
    if (currentScreen !== 'game' || !run || run.status !== 'playing') return
    if (/^[1-9]$/.test(key)) {
      const idx = Number(key) - 1
      if (run.hand[idx]) { event.preventDefault(); toggleCard(run.hand[idx]) }
      return
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (!dom.btnPlay.disabled) playSelected()
      return
    }
    if (key === 'd' || key === 'D' || key === 'Backspace') {
      event.preventDefault()
      if (!dom.btnDiscard.disabled) discardSelected()
      return
    }
    if (key === 's' || key === 'S') { toggleSort(); return }
    if (key === 'm' || key === 'M') { openMenu(); return }
  })
}

function bindEvents() {
  $('#btn-new-run').addEventListener('click', startNewRun)
  $('#btn-continue-run').addEventListener('click', continueRun)
  $('#btn-help-title').addEventListener('click', openHelp)
  $('#btn-help-game').addEventListener('click', openHelp)
  $('#btn-help-board').addEventListener('click', openHelp)
  $('#btn-help-close').addEventListener('click', closeHelp)
  $('#btn-sound-game').addEventListener('click', toggleSound)
  $('#btn-sound-shop').addEventListener('click', toggleSound)
  $('#btn-menu').addEventListener('click', openMenu)
  $('#btn-resume').addEventListener('click', closeMenu)
  $('#btn-menu-help').addEventListener('click', openHelp)
  $('#btn-abandon').addEventListener('click', abandonRun)
  $('#btn-menu-title').addEventListener('click', quitToTitle)
  $('#btn-play').addEventListener('click', playSelected)
  $('#btn-discard').addEventListener('click', discardSelected)
  $('#btn-sort').addEventListener('click', toggleSort)
  $('#btn-intro-begin').addEventListener('click', beginFight)
  $('#btn-reward-continue').addEventListener('click', enterShop)
  $('#btn-leave-shop').addEventListener('click', leaveShop)
  $('#btn-result-new').addEventListener('click', () => { dom.result.classList.add('hidden'); startNewRun() })
  $('#btn-result-title').addEventListener('click', backToTitleFromResult)
  dom.shopJokers.addEventListener('click', handleShopClick)
  dom.shopWares.addEventListener('click', handleShopClick)
  dom.help.addEventListener('click', event => { if (event.target === dom.help) closeHelp() })
  dom.menu.addEventListener('click', event => { if (event.target === dom.menu) closeMenu() })
  dom.reward.addEventListener('click', event => { if (event.target === dom.reward) enterShop() })
  dom.title.addEventListener('click', event => {
    if (event.target.closest('button')) unlockAudio()
  })
  setupKeyboard()
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && run && ['playing', 'shop', 'reward'].includes(run.status)) writeSave()
  })
  // Keep keyboard focus state tidy for screen readers.
  document.addEventListener('pointerdown', () => unlockAudio(), { once: true })
}

init()
