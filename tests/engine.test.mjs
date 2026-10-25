import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SUITS, GEMS, BOSSES, JOKERS, TARGETS, VOUCHERS,
  makeDeck, evaluateHand, scoreHand, computeTarget, createRun, startRound,
  discardSelection, drawCards, registerHand, roundReward, rollShop, buyJoker,
  rerollShop, gemCache, buyVoucher, advanceRound, bossFor, getCard, handCards,
} from '../src/engine.js'
import { validateSprites, ICON_SPRITES, BOSS_SPRITES } from '../src/sprites.js'

function deckOf(ids) {
  const deck = makeDeck(() => 0.42)
  for (const card of deck) card.gem = null
  return ids.map(id => {
    const card = deck.find(c => c.id === id)
    assert.ok(card, `missing card ${id}`)
    return card
  })
}

function freshRun(seed = 0.42) {
  const rng = () => seed
  const run = createRun(rng)
  run.jokers = []
  return run
}

test('deck contains 52 unique cards with a starter gem per class', () => {
  const deck = makeDeck(() => 0.37)
  assert.equal(deck.length, 52)
  assert.equal(new Set(deck.map(c => c.id)).size, 52)
  assert.equal(deck.filter(c => c.gem).length, 4)
  for (const suit of SUITS) assert.equal(deck.filter(c => c.suit === suit.id).length, 13)
})

test('hand evaluator recognizes the full poker ladder', () => {
  const royal = evaluateHand(deckOf(['magic-10', 'magic-J', 'magic-Q', 'magic-K', 'magic-A']))
  assert.equal(royal.type, 'royal_flush')
  assert.equal(royal.damage, 150)
  assert.equal(royal.mult, 10)

  const straightFlush = evaluateHand(deckOf(['melee-3', 'melee-4', 'melee-5', 'melee-6', 'melee-7']))
  assert.equal(straightFlush.type, 'straight_flush')

  const four = evaluateHand(deckOf(['magic-8', 'melee-8', 'ranged-8', 'summon-8']))
  assert.equal(four.type, 'four_kind')

  const full = evaluateHand(deckOf(['magic-8', 'melee-8', 'ranged-8', 'magic-3', 'melee-3']))
  assert.equal(full.type, 'full_house')

  const flush = evaluateHand(deckOf(['magic-2', 'magic-5', 'magic-8', 'magic-J', 'magic-K']))
  assert.equal(flush.type, 'flush')

  const straight = evaluateHand(deckOf(['magic-2', 'melee-3', 'ranged-4', 'summon-5', 'magic-6']))
  assert.equal(straight.type, 'straight')

  const wheel = evaluateHand(deckOf(['magic-A', 'melee-2', 'ranged-3', 'summon-4', 'magic-5']))
  assert.equal(wheel.type, 'straight')

  const trips = evaluateHand(deckOf(['magic-9', 'melee-9', 'ranged-9']))
  assert.equal(trips.type, 'three_kind')

  const twoPair = evaluateHand(deckOf(['magic-9', 'melee-9', 'ranged-4', 'summon-4']))
  assert.equal(twoPair.type, 'two_pair')

  const pair = evaluateHand(deckOf(['magic-9', 'melee-9']))
  assert.equal(pair.type, 'pair')
  assert.equal(pair.hasPair, true)

  const high = evaluateHand(deckOf(['magic-9']))
  assert.equal(high.type, 'high_card')
})

test('scoring adds card ranks to a flush and boss modifiers apply', () => {
  const run = freshRun()
  const cards = deckOf(['melee-2', 'melee-4', 'melee-6', 'melee-8', 'melee-10'])
  const plain = scoreHand(cards, run, null)
  assert.equal(plain.analysis.type, 'flush')
  assert.equal(plain.damage, 65)
  assert.equal(plain.mult, 4)
  assert.equal(plain.total, 260)

  const slime = scoreHand(cards, run, BOSSES[0])
  assert.equal(slime.damage, 45)
  assert.equal(slime.total, 180)
})

test('debuffed suits deal no card damage and Ankh Charm negates it', () => {
  const run = freshRun()
  const cards = deckOf(['magic-2', 'magic-4', 'magic-6', 'magic-8', 'magic-10'])
  const eye = BOSSES.find(b => b.id === 'eye')
  const debuffed = scoreHand(cards, run, eye)
  assert.equal(debuffed.debuffSuit, 'magic')
  assert.equal(debuffed.damage, 35)
  assert.ok(debuffed.cardSteps.every(step => step.damage === 0 && step.debuffed))

  run.jokers = [JOKERS.ankh_charm]
  const protectedScore = scoreHand(cards, run, eye)
  assert.equal(protectedScore.debuffSuit, null)
  assert.equal(protectedScore.damage, 65)
})

test('gem cards contribute damage and mult', () => {
  const run = freshRun()
  const cards = deckOf(['melee-2', 'melee-4', 'melee-6', 'melee-8', 'melee-10'])
  cards[0].gem = 'ruby'
  cards[1].gem = 'sapphire'
  const scored = scoreHand(cards, run, null)
  assert.equal(scored.damage, 65 + 20)
  assert.equal(scored.mult, 4 + 6)
  assert.equal(scored.total, (65 + 20) * (4 + 6))
})

test('accessories modify scoring and can be disabled by Golem', () => {
  const run = freshRun()
  const pair = deckOf(['magic-10', 'melee-10', 'ranged-2', 'summon-4'])
  run.jokers = [JOKERS.shackle, JOKERS.obsidian_shield]
  const scored = scoreHand(pair, run, null)
  assert.equal(scored.jokerSteps.length, 2)
  assert.equal(scored.mult, 2 + 4 + 1)
  assert.equal(scored.damage, 10 + 10 + 10 + 2 + 4 + 15)

  const golem = BOSSES.find(b => b.id === 'golem')
  const disabled = scoreHand(pair, run, golem)
  assert.equal(disabled.jokersActive, false)
  assert.equal(disabled.jokerSteps.length, 0)
})

test('Magic Mirror retriggers the leftmost card', () => {
  const run = freshRun()
  run.jokers = [JOKERS.magic_mirror]
  const cards = deckOf(['melee-2', 'melee-4', 'melee-6', 'melee-8', 'melee-10'])
  const scored = scoreHand(cards, run, null)
  assert.equal(scored.cardSteps.length, 6)
  assert.equal(scored.cardSteps[0].retrigger, false)
  assert.equal(scored.cardSteps[1].retrigger, true)
  assert.equal(scored.cardSteps[1].id, 'melee-2')
  assert.equal(scored.damage, 65 + 2)
})

test('all accessories are well-formed and have pixel icons', () => {
  assert.deepEqual(validateSprites(), [])
  for (const joker of Object.values(JOKERS)) {
    assert.ok(joker.name && joker.desc && joker.cost > 0)
    assert.ok(ICON_SPRITES[joker.icon], `missing icon ${joker.icon} for ${joker.id}`)
  }
  for (const boss of BOSSES) assert.ok(BOSS_SPRITES[boss.id], `missing sprite for ${boss.id}`)
})

test('boss targets and difficulty modifiers scale correctly', () => {
  const run = freshRun()
  run.ante = 0
  assert.equal(computeTarget(run, BOSSES[0]), 300)
  run.ante = 3
  assert.equal(computeTarget(run, BOSSES[3]), Math.round(TARGETS[3] * 1.25 / 10) * 10)
  run.ante = 7
  assert.equal(computeTarget(run, BOSSES[7]), Math.round(TARGETS[7] * 1.5 / 10) * 10)
})

test('run creation starts a legal round with a boss-sized target', () => {
  const run = freshRun()
  assert.equal(run.ante, 0)
  assert.equal(run.hand.length, 8)
  assert.equal(run.handsLeft, 4)
  assert.equal(run.discardsLeft, 3)
  assert.equal(run.target, 300)
  assert.equal(run.deck.length, 52)
  assert.equal(new Set(run.deck.map(c => c.id)).size, 52)
  assert.equal(run.gold, 10)
  assert.equal(bossFor(run).id, 'kingslime')
})

test('drawing, discarding, and deck recycling preserve hand size', () => {
  const run = freshRun()
  const original = [...run.hand]
  const result = discardSelection(run, original.slice(0, 5))
  assert.equal(result.removed.length, 5)
  assert.equal(run.hand.length, 8)
  assert.equal(run.discardsLeft, 2)
  assert.equal(run.hand.filter(id => original.slice(0, 5).includes(id)).length, 0)

  run.drawPile = []
  run.discardPile = run.deck.map(c => c.id).filter(id => !run.hand.includes(id))
  const before = run.hand.length
  drawCards(run, 2)
  assert.equal(run.hand.length, Math.min(before + 2, run.deck.length))
})

test('round rewards include unused hands, interest, and accessory bonuses', () => {
  const run = freshRun()
  run.gold = 12
  run.handsLeft = 2
  run.jokers = [JOKERS.gold_horseshoe]
  const reward = roundReward(run)
  assert.deepEqual(
    { base: reward.base, hands: reward.hands, interest: reward.interest, jokerBonus: reward.jokerBonus, total: reward.total },
    { base: 4, hands: 2, interest: 2, jokerBonus: 2, total: 10 },
  )
})

test('registerHand tracks total damage and the best hand', () => {
  const run = freshRun()
  const cards = deckOf(['melee-2', 'melee-4', 'melee-6', 'melee-8', 'melee-10'])
  const scored = scoreHand(cards, run, null)
  registerHand(run, scored)
  assert.equal(run.stats.handsPlayed, 1)
  assert.equal(run.stats.totalDamage, scored.total)
  assert.equal(run.stats.bestDamage, scored.total)
  assert.equal(run.stats.bestHand.name, 'Flush')
})

test('shop rolls exclude owned accessories and purchases spend gold', () => {
  const run = freshRun()
  run.jokers = [JOKERS.shackle]
  run.gold = 40
  const shop = rollShop(run, () => 0.21)
  assert.equal(shop.offers.length, 3)
  assert.ok(shop.offers.every(offer => offer.id !== 'shackle'))
  assert.ok(shop.offers.every(offer => JOKERS[offer.id]))

  const before = run.gold
  const offer = shop.offers[0]
  const bought = buyJoker(run, 0)
  assert.equal(bought.ok, true)
  assert.equal(run.gold, before - offer.cost)
  assert.equal(run.jokers.length, 2)
  assert.equal(run.shop.offers[0].sold, true)

  const result = rerollShop(run, () => 0.77)
  assert.equal(result.ok, true)
  assert.equal(run.shop.rerollCost, 3)
  assert.equal(run.shop.offers.length, 3)
})

test('shop respect gold, slots, gem caches, and vouchers', () => {
  const run = freshRun()
  run.gold = 3
  const shop = rollShop(run)
  const poor = buyJoker(run, 0)
  assert.equal(poor.ok, false)

  run.gold = 100
  run.maxJokers = run.jokers.length
  const full = buyJoker(run, 0)
  assert.equal(full.ok, false)

  const beforeGems = run.deck.filter(c => c.gem).length
  const cache = gemCache(run)
  assert.equal(cache.ok, true)
  assert.equal(run.deck.filter(c => c.gem).length, beforeGems + 1)
  assert.ok(GEMS[cache.gem.id])

  if (run.shop.voucher) {
    const voucher = VOUCHERS.find(v => v.id === run.shop.voucher)
    const beforeGold = run.gold
    const bought = buyVoucher(run)
    assert.equal(bought.ok, true)
    assert.equal(run.gold, beforeGold - voucher.cost)
    assert.ok(run.upgrades.bought.includes(voucher.id))
    const again = buyVoucher(run)
    assert.equal(again.ok, false)
  }
})

test('advancing rounds resets hands and applies boss constraints', () => {
  const run = freshRun()
  run.roundScore = 999
  advanceRound(run)
  assert.equal(run.ante, 1)
  assert.equal(run.status, 'playing')
  assert.equal(run.roundScore, 0)
  assert.equal(run.handsLeft, 4)
  assert.equal(run.debuffs, undefined)
  assert.equal(run.target, computeTarget(run, BOSSES[1]))
  assert.equal(run.hand.length, run.handSize)

  run.ante = 4
  startRound(run)
  assert.equal(bossFor(run).id, 'skeletron')
  assert.equal(run.handSize, 7)
  assert.equal(run.hand.length, 7)
})

test('every card id resolves and hand helpers stay in sync', () => {
  const run = freshRun()
  const cards = handCards(run)
  assert.equal(cards.length, run.hand.length)
  for (const id of run.hand) assert.ok(getCard(run, id))
  assert.equal(getCard(run, 'not-a-card'), null)
})
