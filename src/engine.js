export const SUITS = [
  { id: 'melee', name: 'Melee', short: 'MEL', color: '#ff7a5c', dark: '#6d2016', glyph: 'sword' },
  { id: 'ranged', name: 'Ranged', short: 'RNG', color: '#8ce06c', dark: '#235221', glyph: 'bow' },
  { id: 'magic', name: 'Magic', short: 'MAG', color: '#6cb9ff', dark: '#173b72', glyph: 'star' },
  { id: 'summon', name: 'Summon', short: 'SUM', color: '#c58bff', dark: '#43206e', glyph: 'skull' },
]

export const RANKS = [
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 11 },
  { rank: 'Q', value: 12 },
  { rank: 'K', value: 13 },
  { rank: 'A', value: 14 },
]

export const GEMS = {
  amethyst: { id: 'amethyst', name: 'Amethyst', color: '#b57cff', damage: 0, mult: 2, text: '+2 Mult' },
  topaz: { id: 'topaz', name: 'Topaz', color: '#ffc94a', damage: 12, mult: 0, text: '+12 Damage' },
  sapphire: { id: 'sapphire', name: 'Sapphire', color: '#59a7ff', damage: 20, mult: 0, text: '+20 Damage' },
  emerald: { id: 'emerald', name: 'Emerald', color: '#54e08a', damage: 0, mult: 4, text: '+4 Mult' },
  ruby: { id: 'ruby', name: 'Ruby', color: '#ff5b6e', damage: 0, mult: 6, text: '+6 Mult' },
  diamond: { id: 'diamond', name: 'Diamond', color: '#d4f8ff', damage: 30, mult: 0, text: '+30 Damage' },
}

export const HAND_TYPES = {
  high_card: { id: 'high_card', name: 'High Card', damage: 5, mult: 1, blurb: 'A lone strike.' },
  pair: { id: 'pair', name: 'Pair', damage: 10, mult: 2, blurb: 'Two of a kind.' },
  two_pair: { id: 'two_pair', name: 'Two Pair', damage: 20, mult: 2, blurb: 'Double trouble.' },
  three_kind: { id: 'three_kind', name: 'Three of a Kind', damage: 30, mult: 3, blurb: 'A focused blow.' },
  straight: { id: 'straight', name: 'Straight', damage: 30, mult: 4, blurb: 'Five ranks in a row.' },
  flush: { id: 'flush', name: 'Flush', damage: 35, mult: 4, blurb: 'One class, five cards.' },
  full_house: { id: 'full_house', name: 'Full House', damage: 40, mult: 4, blurb: 'A trio with backup.' },
  four_kind: { id: 'four_kind', name: 'Four of a Kind', damage: 60, mult: 7, blurb: 'Crushing force.' },
  straight_flush: { id: 'straight_flush', name: 'Straight Flush', damage: 100, mult: 8, blurb: 'A perfect sequence.' },
  royal_flush: { id: 'royal_flush', name: 'Royal Flush', damage: 150, mult: 10, blurb: 'The blade of kings.' },
}

export const BOSSES = [
  {
    id: 'kingslime', name: 'King Slime', epithet: 'The Gelatinous Crown', biome: 'Forest', color: '#5aa9ff',
    mods: { damage: -20 }, effect: 'Gelatinous: -20 base Damage',
  },
  {
    id: 'eye', name: 'Eye of Cthulhu', epithet: 'The Watching Dark', biome: 'Night', color: '#ff5b6e',
    mods: { debuffSuit: 'magic' }, effect: 'Gaze: Magic cards deal no Damage',
  },
  {
    id: 'eater', name: 'Eater of Worlds', epithet: 'The Corruption', biome: 'Corruption', color: '#a06bff',
    mods: { mult: -2 }, effect: 'Corruption: -2 Mult',
  },
  {
    id: 'queenbee', name: 'Queen Bee', epithet: 'Hive Matriarch', biome: 'Jungle', color: '#ffd45a',
    mods: { targetMult: 1.25 }, effect: 'Swarm: Boss HP +25%',
  },
  {
    id: 'skeletron', name: 'Skeletron', epithet: 'The Cursed Guardian', biome: 'Dungeon', color: '#e8e0cf',
    mods: { handSize: -1 }, effect: 'Curse: -1 hand size',
  },
  {
    id: 'golem', name: 'Golem', epithet: 'The Ancient Idol', biome: 'Temple', color: '#ffa23e',
    mods: { jokersOff: true }, effect: 'Ancient: Accessories are disabled',
  },
  {
    id: 'plantera', name: 'Plantera', epithet: 'The Jungle Wrath', biome: 'Underground Jungle', color: '#ff6fd8',
    mods: { debuffSuit: 'summon' }, effect: 'Overgrowth: Summon cards deal no Damage',
  },
  {
    id: 'moonlord', name: 'Moon Lord', epithet: 'The Cosmic Horror', biome: 'Celestial', color: '#9dffdf',
    mods: { targetMult: 1.5, debuffSuit: 'ranged' }, effect: 'Cosmic: Boss HP +50%; Ranged cards deal no Damage',
  },
]

export const TARGETS = [300, 650, 1300, 2600, 5000, 8500, 13000, 18000]

export const VOUCHERS = [
  { id: 'handSize', name: 'Dwarven Charm', desc: '+1 hand size for the rest of the run', cost: 9, icon: 'charm' },
  { id: 'discards', name: 'Master Ninja Gear', desc: '+1 discard each boss fight', cost: 7, icon: 'boots' },
  { id: 'jokerSlot', name: 'Bewitching Table', desc: '+1 accessory slot', cost: 8, icon: 'table' },
]

const JOKER_LIST = [
  {
    id: 'shackle', name: 'Shackle', rarity: 'common', cost: 4, icon: 'ring',
    desc: '+4 Mult if the hand contains a Pair.',
    apply: c => (c.hasPair ? { mult: 4 } : {}),
  },
  {
    id: 'hermes_boots', name: 'Hermes Boots', rarity: 'uncommon', cost: 6, icon: 'boots',
    desc: '+2 Mult for each unused discard.',
    apply: c => ({ mult: c.discardsLeft * 2 }),
  },
  {
    id: 'cloud_bottle', name: 'Cloud in a Bottle', rarity: 'common', cost: 5, icon: 'cloud',
    desc: '+35 Damage when you play a full hand of 5 cards.',
    apply: c => (c.cards.length === 5 ? { damage: 35 } : {}),
  },
  {
    id: 'band_regen', name: 'Band of Regeneration', short: 'Regen Band', rarity: 'uncommon', cost: 6, icon: 'band',
    desc: '+4 Mult while your damage is below half the boss HP.',
    apply: c => (c.damage < c.target / 2 ? { mult: 4 } : {}),
  },
  {
    id: 'voodoo_doll', name: 'Guide Voodoo Doll', short: 'Voodoo Doll', rarity: 'rare', cost: 8, icon: 'doll',
    desc: '+14 Mult, but -25 Damage.',
    apply: () => ({ mult: 14, damage: -25 }),
  },
  {
    id: 'obsidian_shield', name: 'Obsidian Shield', short: 'Obsidian', rarity: 'common', cost: 5, icon: 'shield',
    desc: '+15 Damage and +1 Mult.',
    apply: () => ({ damage: 15, mult: 1 }),
  },
  {
    id: 'magic_mirror', name: 'Magic Mirror', short: 'Mirror', rarity: 'rare', cost: 8, icon: 'mirror',
    desc: 'The leftmost card in every hand triggers twice.',
    apply: () => ({}),
  },
  {
    id: 'shroomite', name: 'Shroomite Armor', short: 'Shroomite', rarity: 'uncommon', cost: 6, icon: 'armor',
    desc: '+2 Mult for each Ranged card played.',
    apply: c => ({ mult: 2 * c.suits.ranged }),
  },
  {
    id: 'terra_blade', name: 'Terra Blade', rarity: 'rare', cost: 8, icon: 'sword',
    desc: '+6 Damage and +1 Mult for each Melee card played.',
    apply: c => ({ damage: 6 * c.suits.melee, mult: c.suits.melee }),
  },
  {
    id: 'star_veil', name: 'Star Veil', rarity: 'uncommon', cost: 6, icon: 'star',
    desc: '+2 Mult for each Magic card played.',
    apply: c => ({ mult: 2 * c.suits.magic }),
  },
  {
    id: 'pygmy_necklace', name: 'Pygmy Necklace', short: 'Pygmy', rarity: 'uncommon', cost: 6, icon: 'necklace',
    desc: '+2 Mult for each Summon card played.',
    apply: c => ({ mult: 2 * c.suits.summon }),
  },
  {
    id: 'lucky_clover', name: 'Lucky Clover', rarity: 'common', cost: 4, icon: 'clover',
    desc: '+1 Mult for each card played.',
    apply: c => ({ mult: c.cards.length }),
  },
  {
    id: 'gold_horseshoe', name: 'Golden Horseshoe', short: 'Horseshoe', rarity: 'common', cost: 4, icon: 'horseshoe',
    desc: '+2 Mult. Earn $2 extra after each boss.',
    apply: () => ({ mult: 2 }),
    endOfRound: () => 2,
  },
  {
    id: 'companion_cube', name: 'Companion Cube', short: 'Cube', rarity: 'rare', cost: 7, icon: 'cube',
    desc: '+1 Mult for every $5 you hold (max +10).',
    apply: c => ({ mult: Math.min(10, Math.floor(c.gold / 5)) }),
  },
  {
    id: 'celestial_magnet', name: 'Celestial Magnet', short: 'Magnet', rarity: 'uncommon', cost: 6, icon: 'magnet',
    desc: '+35 Damage when the hand is a Flush.',
    apply: c => (c.isFlush ? { damage: 35 } : {}),
  },
  {
    id: 'warrior_emblem', name: 'Warrior Emblem', short: 'Warrior', rarity: 'uncommon', cost: 5, icon: 'crest',
    desc: '+45 Damage if the hand has 4 or more Melee cards.',
    apply: c => (c.suits.melee >= 4 ? { damage: 45 } : {}),
  },
  {
    id: 'ranger_emblem', name: 'Ranger Emblem', short: 'Ranger', rarity: 'uncommon', cost: 5, icon: 'crest',
    desc: '+4 Mult if the hand has 3 or more Ranged cards.',
    apply: c => (c.suits.ranged >= 3 ? { mult: 4 } : {}),
  },
  {
    id: 'sorcerer_emblem', name: 'Sorcerer Emblem', short: 'Sorcerer', rarity: 'uncommon', cost: 5, icon: 'crest',
    desc: '+4 Mult if the hand has 3 or more Magic cards.',
    apply: c => (c.suits.magic >= 3 ? { mult: 4 } : {}),
  },
  {
    id: 'summoner_emblem', name: 'Summoner Emblem', short: 'Summoner', rarity: 'uncommon', cost: 5, icon: 'crest',
    desc: '+4 Mult if the hand has 3 or more Summon cards.',
    apply: c => (c.suits.summon >= 3 ? { mult: 4 } : {}),
  },
  {
    id: 'ankh_charm', name: 'Ankh Charm', rarity: 'rare', cost: 8, icon: 'ankh',
    desc: 'Bosses can no longer debuff your cards.',
    apply: () => ({}),
  },
]

export const JOKERS = Object.fromEntries(JOKER_LIST.map(j => [j.id, j]))

export const RARITY = {
  common: { label: 'Common', color: '#9fb6c9' },
  uncommon: { label: 'Uncommon', color: '#69d0ff' },
  rare: { label: 'Rare', color: '#ffd45e' },
}

export function makeDeck(rng = Math.random) {
  const deck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${suit.id}-${rank.rank}`, rank: rank.rank, value: rank.value, suit: suit.id, gem: null })
    }
  }
  const gems = ['amethyst', 'topaz', 'sapphire', 'emerald']
  const suits = [...SUITS].sort(() => rng() - 0.5)
  suits.forEach((suit, i) => {
    const pool = deck.filter(c => c.suit === suit.id)
    const card = pool[Math.floor(rng() * pool.length)]
    card.gem = gems[i]
  })
  return deck
}

export function shuffle(list, rng = Math.random) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function evaluateHand(cards) {
  if (!cards.length) return { ...HAND_TYPES.high_card, counts: [], suits: {} }
  const values = cards.map(c => c.value).sort((a, b) => a - b)
  const countsByValue = new Map()
  for (const v of values) countsByValue.set(v, (countsByValue.get(v) || 0) + 1)
  const counts = [...countsByValue.values()].sort((a, b) => b - a)
  const suits = {}
  for (const s of SUITS) suits[s.id] = cards.filter(c => c.suit === s.id).length
  const sameSuit = cards.length === 5 && Object.values(suits).some(n => n === 5)
  const unique = [...new Set(values)]
  let straight = false
  if (cards.length === 5 && unique.length === 5) {
    straight = unique[4] - unique[0] === 4
    if (unique.join(',') === '2,3,4,5,14') straight = true
  }
  const royal = sameSuit && straight && values.join(',') === '10,11,12,13,14'
  let type = 'high_card'
  if (royal) type = 'royal_flush'
  else if (sameSuit && straight) type = 'straight_flush'
  else if (counts[0] === 4) type = 'four_kind'
  else if (counts[0] === 3 && counts[1] === 2) type = 'full_house'
  else if (sameSuit) type = 'flush'
  else if (straight) type = 'straight'
  else if (counts[0] === 3) type = 'three_kind'
  else if (counts[0] === 2 && counts[1] === 2) type = 'two_pair'
  else if (counts[0] === 2) type = 'pair'
  const base = HAND_TYPES[type]
  return {
    ...base,
    type,
    counts,
    suits,
    hasPair: counts[0] >= 2,
    isFlush: sameSuit,
    isStraight: straight,
    isRoyal: royal,
  }
}

function jokerContext(run, boss, hand, analysis) {
  return {
    cards: hand,
    type: analysis.type,
    suits: analysis.suits,
    counts: analysis.counts,
    hasPair: analysis.hasPair,
    isFlush: analysis.isFlush,
    isStraight: analysis.isStraight,
    handLeft: run.handsLeft,
    discardsLeft: run.discardsLeft,
    damage: run.roundScore,
    target: run.target,
    gold: run.gold,
    boss,
  }
}

export function scoreHand(cards, run, boss = BOSSES[run.ante] || null, options = {}) {
  const analysis = evaluateHand(cards)
  const ignoreDebuff = run.jokers.some(j => j.id === 'ankh_charm')
  const debuffSuit = !ignoreDebuff && boss?.mods?.debuffSuit ? boss.mods.debuffSuit : null
  const cardSteps = []
  let damage = analysis.damage
  let mult = analysis.mult

  const order = cards.map((card, index) => ({ card, index }))
  if (run.jokers.some(j => j.id === 'magic_mirror') && order.length) {
    order.splice(1, 0, { ...order[0], retrigger: true })
  }
  for (const entry of order) {
    const card = entry.card
    const gem = card.gem ? GEMS[card.gem] : null
    const debuffed = debuffSuit === card.suit
    const cardDamage = debuffed ? 0 : card.value + (gem?.damage || 0)
    const cardMult = gem?.mult || 0
    damage += cardDamage
    mult += cardMult
    cardSteps.push({
      id: card.id, rank: card.rank, suit: card.suit, gem: card.gem,
      damage: cardDamage, mult: cardMult, debuffed: !!debuffed, retrigger: !!entry.retrigger,
    })
  }

  const jokerSteps = []
  let jokersActive = !boss?.mods?.jokersOff
  if (jokersActive) {
    const ctx = jokerContext(run, boss, cards, analysis)
    for (const joker of run.jokers) {
      const result = joker.apply(ctx) || {}
      if (result.damage || result.mult) {
        damage += result.damage || 0
        mult += result.mult || 0
        jokerSteps.push({ id: joker.id, name: joker.name, damage: result.damage || 0, mult: result.mult || 0 })
      }
    }
  }
  if (boss?.mods?.damage) damage += boss.mods.damage
  if (boss?.mods?.mult) mult += boss.mods.mult
  damage = Math.max(1, Math.round(damage))
  mult = Math.max(1, Math.round(mult))
  const total = Math.round(damage * mult)
  return {
    analysis,
    cardSteps,
    jokerSteps,
    jokersActive,
    debuffSuit,
    damage,
    mult,
    total,
  }
}

export function computeTarget(run, boss = BOSSES[run.ante]) {
  const base = TARGETS[Math.min(run.ante, TARGETS.length - 1)]
  return Math.max(50, Math.round((base * (boss?.mods?.targetMult || 1)) / 10) * 10)
}

export function createRun(rng = Math.random) {
  const deck = makeDeck(rng)
  const run = {
    version: 1,
    ante: 0,
    gold: 10,
    roundScore: 0,
    target: 0,
    handsLeft: 4,
    discardsLeft: 3,
    handSize: 8,
    jokers: [],
    maxJokers: 5,
    deck,
    drawPile: [],
    discardPile: [],
    hand: [],
    upgrades: { handSize: 0, discards: 0, jokerSlots: 0, bought: [] },
    shop: { offers: [], voucher: null, rerollCost: 2, rerolled: 0 },
    stats: { handsPlayed: 0, discards: 0, roundsWon: 0, bestHand: null, bestDamage: 0, goldEarned: 0, totalDamage: 0 },
    sortMode: 'rank',
    status: 'playing',
    log: [],
  }
  startRound(run, rng)
  return run
}

export function startRound(run, rng = Math.random) {
  const boss = BOSSES[Math.min(run.ante, BOSSES.length - 1)]
  run.target = computeTarget(run, boss)
  run.roundScore = 0
  run.handsLeft = 4
  run.discardsLeft = 3 + (run.upgrades?.discards || 0) + (boss.mods.discards || 0)
  run.handSize = 8 + (run.upgrades?.handSize || 0) + (boss.mods.handSize || 0)
  run.handSize = Math.max(5, run.handSize)
  run.drawPile = shuffle(run.deck.map(c => c.id), rng)
  run.discardPile = []
  run.hand = []
  run.status = 'playing'
  drawCards(run, run.handSize, rng)
  return boss
}

export function getCard(run, id) {
  return run.deck.find(c => c.id === id) || null
}

export function handCards(run) {
  return run.hand.map(id => getCard(run, id)).filter(Boolean)
}

export function drawCards(run, count, rng = Math.random) {
  const drawn = []
  for (let i = 0; i < count; i++) {
    if (!run.drawPile.length) {
      if (!run.discardPile.length) break
      run.drawPile = shuffle(run.discardPile, rng)
      run.discardPile = []
    }
    const id = run.drawPile.pop()
    if (id) {
      run.hand.push(id)
      drawn.push(getCard(run, id))
    }
  }
  return drawn
}

export function discardSelection(run, ids, rng = Math.random) {
  const set = new Set(ids)
  const removed = run.hand.filter(id => set.has(id))
  run.hand = run.hand.filter(id => !set.has(id))
  run.discardPile.push(...removed)
  run.discardsLeft -= 1
  run.stats.discards += 1
  const drawn = drawCards(run, removed.length, rng)
  return { removed: removed.map(id => getCard(run, id)), drawn }
}

export function removePlayed(run, ids, rng = Math.random) {
  const set = new Set(ids)
  run.discardPile.push(...ids)
  run.hand = run.hand.filter(id => !set.has(id))
  drawCards(run, run.handSize - run.hand.length, rng)
}

export function registerHand(run, scored) {
  run.stats.handsPlayed += 1
  run.stats.totalDamage = (run.stats.totalDamage || 0) + scored.total
  if (scored.total > run.stats.bestDamage) {
    run.stats.bestDamage = scored.total
    run.stats.bestHand = { name: scored.analysis.name, total: scored.total, damage: scored.damage, mult: scored.mult }
  }
}

export function bossFor(run) {
  return BOSSES[Math.min(run.ante, BOSSES.length - 1)]
}

export function roundReward(run) {
  const boss = bossFor(run)
  const base = 4
  const hands = Math.max(0, run.handsLeft)
  const interest = Math.min(5, Math.floor(run.gold / 5))
  const jokerBonus = run.jokers.reduce((sum, j) => sum + (j.endOfRound ? j.endOfRound() : 0), 0)
  return { base, hands, interest, jokerBonus, total: base + hands + interest + jokerBonus, boss }
}

export function isUnenhanced(card) {
  return !card.gem
}

export function rollShop(run, rng = Math.random) {
  const owned = new Set(run.jokers.map(j => j.id))
  const pool = shuffle(Object.values(JOKERS).filter(j => !owned.has(j.id)), rng)
  const offers = pool.slice(0, 3).map(j => ({ id: j.id, cost: j.cost, sold: false }))
  const existing = run.upgrades.bought || []
  const vouchers = VOUCHERS.filter(v => !existing.includes(v.id))
  const voucher = vouchers.length ? vouchers[Math.floor(rng() * vouchers.length)].id : null
  run.shop = { offers, voucher, rerollCost: 2, rerolled: 0 }
  return run.shop
}

export function offerJoker(offer) {
  return JOKERS[offer.id] || null
}

export function buyJoker(run, index) {
  const offer = run.shop.offers[index]
  if (!offer || offer.sold) return { ok: false, reason: 'Sold out' }
  if (run.jokers.length >= run.maxJokers) return { ok: false, reason: 'No accessory slots' }
  if (run.gold < offer.cost) return { ok: false, reason: 'Not enough gold' }
  const joker = JOKERS[offer.id]
  run.gold -= offer.cost
  run.jokers.push(joker)
  offer.sold = true
  return { ok: true, joker }
}

export function rerollShop(run, rng = Math.random) {
  const cost = run.shop.rerollCost
  if (run.gold < cost) return { ok: false, reason: 'Not enough gold' }
  run.gold -= cost
  run.shop.rerolled += 1
  run.shop.rerollCost = 2 + run.shop.rerolled
  const owned = new Set(run.jokers.map(j => j.id))
  const pool = shuffle(Object.values(JOKERS).filter(j => !owned.has(j.id)), rng)
  const offers = pool.slice(0, 3).map(j => ({ id: j.id, cost: j.cost, sold: false }))
  const existing = run.upgrades.bought || []
  const vouchers = VOUCHERS.filter(v => !existing.includes(v.id))
  const voucher = run.shop.voucher && vouchers.includes(VOUCHERS.find(v => v.id === run.shop.voucher)) ? run.shop.voucher : (vouchers.length ? vouchers[Math.floor(rng() * vouchers.length)].id : null)
  run.shop.offers = offers
  run.shop.voucher = voucher
  return { ok: true, cost }
}

export function gemCache(run, rng = Math.random) {
  const cost = 4
  if (run.gold < cost) return { ok: false, reason: 'Not enough gold' }
  const pool = run.deck.filter(c => !c.gem)
  if (!pool.length) return { ok: false, reason: 'Every card is already gem-tipped' }
  const card = pool[Math.floor(rng() * pool.length)]
  const gemIds = Object.keys(GEMS)
  const gem = GEMS[gemIds[Math.floor(rng() * gemIds.length)]]
  run.gold -= cost
  card.gem = gem.id
  return { ok: true, card, gem, cost }
}

export function buyVoucher(run, rng = Math.random) {
  const voucher = VOUCHERS.find(v => v.id === run.shop.voucher)
  if (!voucher) return { ok: false, reason: 'No upgrade available' }
  if (run.upgrades.bought.includes(voucher.id)) return { ok: false, reason: 'Already owned' }
  if (run.gold < voucher.cost) return { ok: false, reason: 'Not enough gold' }
  run.gold -= voucher.cost
  run.upgrades.bought.push(voucher.id)
  if (voucher.id === 'handSize') run.upgrades.handSize += 1
  if (voucher.id === 'discards') run.upgrades.discards += 1
  if (voucher.id === 'jokerSlot') {
    run.upgrades.jokerSlots += 1
    run.maxJokers += 1
  }
  run.shop.voucher = null
  return { ok: true, voucher }
}

export function advanceRound(run, rng = Math.random) {
  run.ante += 1
  run.status = 'playing'
  startRound(run, rng)
  return bossFor(run)
}

export function endRun(run, status) {
  run.status = status
}
