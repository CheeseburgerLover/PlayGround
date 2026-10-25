(function (root) {
  const SUITS = [
    { id: 'spades', glyph: '♠', name: 'Spades', color: 'dark' },
    { id: 'hearts', glyph: '♥', name: 'Hearts', color: 'red' },
    { id: 'diamonds', glyph: '♦', name: 'Diamonds', color: 'red' },
    { id: 'clubs', glyph: '♣', name: 'Clubs', color: 'dark' }
  ];

  const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const HAND_TYPES = {
    high: { name: 'High Card', chips: 5, mult: 1 },
    pair: { name: 'Pair', chips: 10, mult: 2 },
    twoPair: { name: 'Two Pair', chips: 20, mult: 2 },
    three: { name: 'Three of a Kind', chips: 30, mult: 3 },
    straight: { name: 'Straight', chips: 30, mult: 4 },
    flush: { name: 'Flush', chips: 35, mult: 4 },
    fullHouse: { name: 'Full House', chips: 40, mult: 4 },
    four: { name: 'Four of a Kind', chips: 60, mult: 7 },
    straightFlush: { name: 'Straight Flush', chips: 100, mult: 8 },
    royal: { name: 'Royal Flush', chips: 150, mult: 10 }
  };

  const ENHANCEMENTS = {
    ember: { name: 'Ember', icon: '✦', color: '#ff7a4d', desc: '+3 Mult' },
    crystal: { name: 'Crystal', icon: '◆', color: '#83e8ff', desc: '+20 Chips' },
    frost: { name: 'Frost', icon: '✧', color: '#b9d4ff', desc: '+5 Chips, +1 Mult' },
    gilded: { name: 'Gilded', icon: '●', color: '#ffd76b', desc: '+2 Gold' }
  };

  const CHARMS = [
    { id: 'copper-coil', name: 'Copper Coil', icon: '◎', color: '#e4a069', type: 'flatChips', value: 30, desc: '+30 Chips' },
    { id: 'ember-sigil', name: 'Ember Sigil', icon: '✹', color: '#ff875f', type: 'flatMult', value: 4, desc: '+4 Mult' },
    { id: 'iron-spurs', name: 'Iron Spurs', icon: '♠', color: '#b9c8d8', type: 'suitChips', suit: 'spades', value: 9, desc: '+9 Chips per scored Spade' },
    { id: 'rose-quartz', name: 'Rose Quartz', icon: '♥', color: '#ff8aa1', type: 'suitMult', suit: 'hearts', value: 1, desc: '+1 Mult per scored Heart' },
    { id: 'clover-idol', name: 'Clover Idol', icon: '♣', color: '#84d99f', type: 'suitChips', suit: 'clubs', value: 8, desc: '+8 Chips per scored Club' },
    { id: 'diamond-drill', name: 'Diamond Drill', icon: '♦', color: '#8fe1ff', type: 'suitGold', suit: 'diamonds', value: 2, desc: '+2 Gold per scored Diamond' },
    { id: 'miners-lantern', name: "Miner's Lantern", icon: '◐', color: '#ffd46a', type: 'hands', value: 1, desc: '+1 Hand each battle' },
    { id: 'rabbits-foot', name: "Rabbit's Foot", icon: '✦', color: '#f6b6d0', type: 'discards', value: 1, desc: '+1 Discard each battle' },
    { id: 'pick-polish', name: 'Pick Polish', icon: '⌁', color: '#d6e0e8', type: 'strikes', value: 1, desc: '+1 Pick Strike each room' },
    { id: 'deep-pockets', name: 'Deep Pockets', icon: '▣', color: '#c9a778', type: 'handSize', value: 1, desc: '+1 Card in hand' },
    { id: 'bloodstone', name: 'Bloodstone', icon: '❖', color: '#e05d6f', type: 'maxHeart', value: 1, desc: '+1 Heart, healed' },
    { id: 'flint-steel', name: 'Flint & Steel', icon: '⌁', color: '#ffb45e', type: 'firstChips', value: 60, desc: '+60 Chips on the first hand' },
    { id: 'crystal-lens', name: 'Crystal Lens', icon: '◇', color: '#93e7ff', type: 'enhChips', value: 12, desc: '+12 Chips per enhanced card' },
    { id: 'straight-shooter', name: 'Straight Shooter', icon: '➶', color: '#f4cf76', type: 'handMult', hands: ['straight', 'straightFlush', 'royal'], value: 7, desc: '+7 Mult on Straights' },
    { id: 'pair-picks', name: 'Pair of Picks', icon: '⫶', color: '#e8b06c', type: 'handMult', hands: ['pair', 'twoPair', 'fullHouse', 'four'], value: 5, desc: '+5 Mult on Pair hands' },
    { id: 'flush-rush', name: 'Flush Rush', icon: '≋', color: '#7fd9c7', type: 'handMult', hands: ['flush', 'straightFlush', 'royal'], value: 5, desc: '+5 Mult on Flushes' },
    { id: 'full-measure', name: 'Full Measure', icon: '▦', color: '#e1c18e', type: 'handMult', hands: ['fullHouse'], value: 6, desc: '+6 Mult on a Full House' },
    { id: 'geode-heart', name: 'Geode Heart', icon: '◈', color: '#c9a4ff', type: 'flatChips', value: 25, desc: '+25 Chips' },
    { id: 'royal-jelly', name: 'Royal Jelly', icon: '♛', color: '#f0cf86', type: 'faceMult', value: 1, desc: '+1 Mult per face card scored' },
    { id: 'prospectors-pact', name: "Prospector's Pact", icon: '✧', color: '#ffd46a', type: 'winGold', value: 3, desc: '+3 Gold when a Warden falls' },
    { id: 'ore-crusher', name: 'Ore Crusher', icon: '◍', color: '#d18b5c', type: 'handChips', hands: ['three', 'four', 'fullHouse'], value: 50, desc: '+50 Chips on 3+ matches' },
    { id: 'lantern-oil', name: 'Lantern Oil', icon: '◒', color: '#ffbe5c', type: 'handMult', hands: ['high'], value: 10, desc: '+10 Mult on High Card' }
  ];

  const ORE_TYPES = {
    copper: { id: 'copper', name: 'Copper Vein', color: '#e7a365', glow: '#ffbd7e', chips: 15, desc: '+15 Chips' },
    coal: { id: 'coal', name: 'Coal Seam', color: '#8b929c', glow: '#c4ccd6', chips: 8, desc: '+8 Chips' },
    iron: { id: 'iron', name: 'Iron Vein', color: '#a9b9c9', glow: '#d6e3f0', mult: 1, desc: '+1 Mult' },
    gold: { id: 'gold', name: 'Gold Vein', color: '#f4c95d', glow: '#ffe28a', gold: 4, desc: '+4 Gold' },
    amethyst: { id: 'amethyst', name: 'Amethyst Cluster', color: '#bd8cff', glow: '#dcbaff', chips: 10, mult: 1, desc: '+10 Chips, +1 Mult' },
    ruby: { id: 'ruby', name: 'Ruby Pocket', color: '#ff6878', glow: '#ff9aa6', card: 'ember', desc: 'Forge an Ember card' },
    crystal: { id: 'crystal', name: 'Crystal Pocket', color: '#75e8ff', glow: '#a6f2ff', card: 'crystal', desc: 'Forge a Crystal card' },
    sapphire: { id: 'sapphire', name: 'Sapphire Vein', color: '#6c9bff', glow: '#a5c0ff', discards: 1, desc: '+1 Discard this battle' },
    emerald: { id: 'emerald', name: 'Emerald Vein', color: '#5fe0a2', glow: '#9dffd0', hands: 1, desc: '+1 Hand this battle' }
  };

  const STRATA = [
    {
      name: 'THE MOSSDARK',
      subtitle: 'Where roots drink stone',
      accent: '#86d59a',
      rooms: [
        { enemy: 'slime', name: 'Gloop', blind: 'SMALL BLIND', target: 260, gold: 5, flavor: 'A gelatinous hoarder of lost buttons.', mods: {} },
        { enemy: 'bat', name: 'Skitter', blind: 'BIG BLIND', target: 430, gold: 7, flavor: 'It has heard every coin you ever dropped.', mods: {} },
        { enemy: 'fungus', name: 'The Rotcrown', blind: 'BOSS BLIND', target: 740, gold: 12, boss: true, flavor: 'Sporefall clings to your discards.', mods: { discards: -1 }, modText: 'SPOREFALL · 1 fewer discard' }
      ]
    },
    {
      name: 'THE GLASS HOLLOW',
      subtitle: 'Every echo has an edge',
      accent: '#8fd9ff',
      rooms: [
        { enemy: 'crawler', name: 'Shardling', blind: 'SMALL BLIND', target: 1050, gold: 7, flavor: 'It wears a coat of broken promises.', mods: {} },
        { enemy: 'wisp', name: 'Glimmer', blind: 'BIG BLIND', target: 1500, gold: 9, flavor: 'A cold light with a hungry memory.', mods: { hands: -1 }, modText: 'COLD LIGHT · 1 fewer hand' },
        { enemy: 'golem', name: 'The Prism Warden', blind: 'BOSS BLIND', target: 2100, gold: 15, boss: true, flavor: 'The cave bends to its facets.', mods: { hands: -1 }, modText: 'FACETED · 1 fewer hand' }
      ]
    },
    {
      name: 'THE EMBER THROAT',
      subtitle: 'The mountain remembers',
      accent: '#ffad72',
      rooms: [
        { enemy: 'imp', name: 'Cinder Imp', blind: 'SMALL BLIND', target: 2900, gold: 9, flavor: 'A small fire with large opinions.', mods: {} },
        { enemy: 'hound', name: 'Ashfang', blind: 'BIG BLIND', target: 3900, gold: 12, flavor: 'It breathes cinders and eats luck.', mods: { discards: -1 }, modText: 'ASHFANG · 1 fewer discard' },
        { enemy: 'king', name: 'The Hollow King', blind: 'BOSS BLIND', target: 5200, gold: 20, boss: true, final: true, flavor: 'The first miner. The last hand.', mods: { hands: -1, discards: -1 }, modText: 'HOLLOW CROWN · 1 fewer hand and discard' }
      ]
    }
  ];

  const ROOMS = STRATA.flatMap((stratum, stratumIndex) => stratum.rooms.map((room, roomIndex) => ({ ...room, stratumIndex, roomIndex, stratum, id: stratumIndex * 3 + roomIndex })));

  function shuffle(list, rng) {
    const random = rng || Math.random;
    const copy = list.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      const value = copy[index];
      copy[index] = copy[target];
      copy[target] = value;
    }
    return copy;
  }

  function makeCard(rank, suit, enhancement, id) {
    return { id, rank, suit, enhancement: enhancement || null };
  }

  function createDeck() {
    const cards = [];
    let id = 0;
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        cards.push(makeCard(rank, suit.id, null, id));
        id += 1;
      }
    }
    return { cards, nextId: id };
  }

  function cardChips(card) {
    if (card.rank === 14) return 11;
    if (card.rank >= 11) return 10;
    return card.rank;
  }

  function rankLabel(rank) {
    if (rank === 14) return 'A';
    if (rank === 13) return 'K';
    if (rank === 12) return 'Q';
    if (rank === 11) return 'J';
    return String(rank);
  }

  function suitInfo(id) {
    return SUITS.find(suit => suit.id === id) || SUITS[0];
  }

  function identifyHand(cards) {
    if (!cards.length) return { key: 'high', name: 'High Card', chips: 5, mult: 1, scoring: [] };
    const sorted = cards.slice().sort((a, b) => a.rank - b.rank);
    const ranks = sorted.map(card => card.rank);
    const uniqueRanks = [...new Set(ranks)];
    const counts = {};
    for (const rank of ranks) counts[rank] = (counts[rank] || 0) + 1;
    const groups = Object.entries(counts)
      .map(([rank, count]) => ({ rank: Number(rank), count }))
      .sort((a, b) => b.count - a.count || b.rank - a.rank);
    const isFive = cards.length === 5;
    const flush = isFive && cards.every(card => card.suit === cards[0].suit);
    const wheel = isFive && uniqueRanks.length === 5 && uniqueRanks.join(',') === '2,3,4,5,14';
    const straight = isFive && uniqueRanks.length === 5 && (ranks[4] - ranks[0] === 4 || wheel);
    let key = 'high';
    if (flush && straight && ranks[0] === 10) key = 'royal';
    else if (flush && straight) key = 'straightFlush';
    else if (groups[0].count === 4) key = 'four';
    else if (groups[0].count === 3 && groups[1] && groups[1].count === 2) key = 'fullHouse';
    else if (flush) key = 'flush';
    else if (straight) key = 'straight';
    else if (groups[0].count === 3) key = 'three';
    else if (groups[0].count === 2 && groups[1] && groups[1].count === 2) key = 'twoPair';
    else if (groups[0].count === 2) key = 'pair';
    let scoring = [];
    if (key === 'high') {
      const highest = sorted[sorted.length - 1];
      scoring = [highest];
    } else if (key === 'pair' || key === 'three' || key === 'four') {
      scoring = cards.filter(card => counts[card.rank] === groups[0].count);
    } else if (key === 'twoPair') {
      scoring = cards.filter(card => counts[card.rank] === 2);
    } else if (key === 'fullHouse') {
      scoring = cards.slice();
    } else {
      scoring = cards.slice();
    }
    const type = HAND_TYPES[key];
    return { key, name: type.name, chips: type.chips, mult: type.mult, scoring };
  }

  function scorePlay(cards, options) {
    const settings = options || {};
    const charms = settings.charms || [];
    const hand = identifyHand(cards);
    let chips = hand.chips;
    let mult = hand.mult;
    let gold = 0;
    const notes = [{ label: hand.name, chips, mult }];
    for (const card of hand.scoring) {
      const added = cardChips(card);
      chips += added;
      if (card.enhancement === 'ember') mult += 3;
      if (card.enhancement === 'crystal') chips += 20;
      if (card.enhancement === 'frost') { chips += 5; mult += 1; }
      if (card.enhancement === 'gilded') gold += 2;
    }
    for (const charm of charms) {
      if (charm.type === 'flatChips') chips += charm.value;
      else if (charm.type === 'flatMult') mult += charm.value;
      else if (charm.type === 'suitChips') chips += hand.scoring.filter(card => card.suit === charm.suit).length * charm.value;
      else if (charm.type === 'suitMult') mult += hand.scoring.filter(card => card.suit === charm.suit).length * charm.value;
      else if (charm.type === 'suitGold') gold += hand.scoring.filter(card => card.suit === charm.suit).length * charm.value;
      else if (charm.type === 'enhChips') chips += hand.scoring.filter(card => card.enhancement).length * charm.value;
      else if (charm.type === 'handMult' && charm.hands.includes(hand.key)) mult += charm.value;
      else if (charm.type === 'handChips' && charm.hands.includes(hand.key)) chips += charm.value;
      else if (charm.type === 'faceMult') mult += hand.scoring.filter(card => card.rank >= 11).length * charm.value;
      else if (charm.type === 'firstChips' && settings.firstHand) chips += charm.value;
    }
    chips += settings.oreChips || 0;
    mult += settings.oreMult || 0;
    const total = Math.max(0, Math.floor(chips * mult));
    return {
      key: hand.key,
      name: hand.name,
      scoring: hand.scoring,
      chips,
      mult,
      total,
      gold,
      notes
    };
  }

  function bestPlay(cards, options) {
    let best = null;
    const limit = Math.min(cards.length, 5);
    for (let size = 1; size <= limit; size += 1) {
      const indices = Array.from({ length: size }, (_, index) => index);
      while (true) {
        const selection = indices.map(index => cards[index]);
        const result = scorePlay(selection, options);
        if (!best || result.total > best.total) best = { ...result, selection };
        let cursor = size - 1;
        while (cursor >= 0 && indices[cursor] === cards.length - size + cursor) cursor -= 1;
        if (cursor < 0) break;
        indices[cursor] += 1;
        for (let next = cursor + 1; next < size; next += 1) indices[next] = indices[next - 1] + 1;
      }
    }
    return best;
  }

  function randomCard(rng, enhancementOptions, minRank) {
    const random = rng || Math.random;
    const rankPool = RANKS.filter(rank => rank >= (minRank || 2));
    const suit = SUITS[Math.floor(random() * SUITS.length)];
    const rank = rankPool[Math.floor(random() * rankPool.length)];
    const options = enhancementOptions || ['ember', 'crystal', 'frost', 'gilded'];
    const roll = random();
    const enhancement = options[Math.floor(roll * options.length)];
    return { rank, suit: suit.id, enhancement };
  }

  function formatNumber(value) {
    const number = Math.max(0, Math.floor(value));
    if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace('.0', '')}M`;
    if (number >= 100000) return `${(number / 1000).toFixed(0)}K`;
    return number.toLocaleString('en-US');
  }

  const api = {
    SUITS,
    RANKS,
    HAND_TYPES,
    ENHANCEMENTS,
    CHARMS,
    ORE_TYPES,
    STRATA,
    ROOMS,
    shuffle,
    makeCard,
    createDeck,
    cardChips,
    rankLabel,
    suitInfo,
    identifyHand,
    scorePlay,
    bestPlay,
    randomCard,
    formatNumber
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  root.DeepDeckRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
