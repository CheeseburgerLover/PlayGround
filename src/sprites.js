const BOSS_PALETTES = {
  kingslime: { K: '#0d1730', B: '#4f9fe8', D: '#2f6db8', L: '#a8e4ff', W: '#ffffff', Y: '#ffd75e' },
  eye: { K: '#210b17', W: '#f4ead4', R: '#d9364f', E: '#5e0c1c', P: '#7d4bb5' },
  eater: { K: '#1a0b2b', P: '#8a4bd6', D: '#5a2a9e', W: '#ff7bd1', E: '#2b0b4a' },
  queenbee: { K: '#1c1509', Y: '#ffd75e', B: '#221d14', W: '#e4f6ff', G: '#ffb02e' },
  skeletron: { K: '#1c1712', W: '#efe6ce', D: '#b9ae94', E: '#ff4040' },
  golem: { K: '#211b15', S: '#8c7761', D: '#5c4a3a', L: '#c2ab8e', E: '#ffb63d', G: '#6d9c52' },
  plantera: { K: '#1f0d1c', P: '#e35ec4', D: '#a3318d', L: '#ff9de6', G: '#4dbf5e', W: '#ffe7f7', Y: '#ffe066' },
  moonlord: { K: '#0b2420', P: '#b9e8d8', D: '#7fc4b4', E: '#eaff7a', W: '#f2fffb' },
}

const BOSS_ROWS = {
  kingslime: [
    '................',
    '....K.....K.....',
    '...KYK...KYK....',
    '...KYYKKKYYK....',
    '..KKYYYYYYYKK...',
    '.KBBBBBBBBBBBK..',
    'KBBLBBBBBBBBBBK.',
    'KBBBBBBBBBBBBBBK',
    'KBBBBBBBBBBBBBBK',
    'KBBWKKBBBBKKWBBK',
    'KBBWKKBBBBKKWBBK',
    'KBBBBBBBBBBBBBBK',
    'KBBBBBDDDDBBBBBK',
    '.KBBBBBBBBBBBBK.',
    '..KKBBBBBBBBKK..',
    '....KKKKKKKK....',
  ],
  eye: [
    '....KKKKKKKK....',
    '..KKWWWWWWWWKK..',
    '.KWWWWWWWWWWWWK.',
    'KWWWWWWWWWWWWWWK',
    'KWWWWKKKKKKWWWWK',
    'KWWWKRRRRRRKWWWK',
    'KWWKRWEEEEWRKWWK',
    'KWWKRWEWWEWRKWWK',
    'KWWKRWEWWEWRKWWK',
    'KWWKRWEEEEWRKWWK',
    'KWWWKRRRRRRKWWWK',
    'KWWWWKKKKKKWWWWK',
    'KWWWWWWWWWWWWWWK',
    '.KWWWWWWWWWWWWK.',
    '..KKPKK..KKPKK..',
    '...KK......KK...',
  ],
  eater: [
    '..KK........KK..',
    '.KPPK......KPPK.',
    'KPPPPKKKKKKPPPPK',
    'KPPPPPPPPPPPPPPK',
    'KPPPWWWPPWWWPPPK',
    'KPPWEEWWWWEEWPPK',
    'KPPWEKKWWKKEWPPK',
    'KPPWEEWWWWEEWPPK',
    'KPPPWWWPPWWWPPPK',
    'KPPPPPPPPPPPPPPK',
    '.KPPPPKKKKPPPPK.',
    '..KPPPPPPPPPPK..',
    '...KPPPPPPPPK...',
    '....KPPKKPPK....',
    '.....KK..KK.....',
    '................',
  ],
  queenbee: [
    '..K..........K..',
    '...KWK....KWK...',
    '..KWWWK..KWWWK..',
    '.KKWWWKKKKWWWKK.',
    '...KKYYYYYYKK...',
    '..KYYBBYYBBYYK..',
    '.KYYBBBBBBBBYYK.',
    'KYYBBBBBBBBBBYYK',
    'KYYBBYYYYYYBBYYK',
    'KYYBBBBBBBBBBYYK',
    '.KYYBBBBBBBBYYK.',
    '..KYYBBBBBBYYK..',
    '...KKYYYYYYKK...',
    '....KKYYYYKK....',
    '.....KKKKKK.....',
    '................',
  ],
  skeletron: [
    '....KKKKKKKK....',
    '..KKWWWWWWWWKK..',
    '.KWWWWWWWWWWWWK.',
    'KWWWWWWWWWWWWWWK',
    'KWKKKKWWWWKKKKWK',
    'KWKEEKWWWWKEEKWK',
    'KWKKKKWWWWKKKKWK',
    'KWWWWWWWWWWWWWWK',
    'KWWWWWKKKKWWWWWK',
    'KWWWWKWDDWKWWWWK',
    'KWWWWKWDDWKWWWWK',
    '.KWWWWWKKWWWWWK.',
    '..KWWWWWWWWWWK..',
    '...KKWWWWWWKK...',
    '....KKKKKKKK....',
    '................',
  ],
  golem: [
    '...KKKKKKKKKK...',
    '..KSSSSSSSSSSK..',
    '.KSSGGSSSSGGSSK.',
    'KSSSGSSSSSSGSSSK',
    'KSSLLSSSSSSLLSSK',
    'KSSEEESSSSEESSSK',
    'KSSEESSSSSSEESSK',
    'KSSSSSSSSSSSSSSK',
    'KSSSSKKKKKKSSSSK',
    'KSSSKDDDDDDKSSSK',
    'KSSSKDLLLLDKSSSK',
    'KSSSSKKKKKKSSSSK',
    '.KSSSSSSSSSSSSK.',
    '..KSSSSSSSSSSK..',
    '...KKSSSSSSKK...',
    '.....KKKKKK.....',
  ],
  plantera: [
    '....KKKKKKKK....',
    '..KKPPPPPPPPKK..',
    '.KPPLLPPPPLLPPK.',
    'KPPPLLPPPPLLPPPK',
    'KPPPPPPPPPPPPPPK',
    'KPPKKKPPPPKKKPPK',
    'KPKWWKPPPPKWWKPK',
    'KPPKKKPPPPKKKPPK',
    'KPPPKWWWWWWKPPPK',
    'KPPPPPPPPPPPPPPK',
    '.KPPPPPPPPPPPPK.',
    '..KKPPPPPPPPKK..',
    '....KKPPPPKK....',
    '......KGGK......',
    '.....KGGGGK.....',
    '....KGGGGGGK....',
  ],
  moonlord: [
    '..KKKKKKKKKKKK..',
    '.KPPPPPPPPPPPPK.',
    'KPPPPPPPPPPPPPPK',
    'KPPKKKPPPPKKKPPK',
    'KPKEEEPPPPKEEEPK',
    'KPPKKKPPPPKKKPPK',
    'KPPPPPPPPPPPPPPK',
    'KPPPPKKKKKKPPPPK',
    'KPPPPKKEEKKPPPPK',
    'KPPPPKKKKKKPPPPK',
    'KPPPPPPPPPPPPPPK',
    '.KPPPPPPPPPPPPK.',
    '..KKPPPPPPPPKK..',
    '...KPPKPPKPPK...',
    '....KK.KK.KK....',
    '................',
  ],
}

const ICON_PALETTE = {
  K: '#171326', W: '#f5efe2', S: '#c9bda6', G: '#6ee08a', R: '#ff5b6e',
  B: '#5fb5ff', Y: '#ffd45e', P: '#b57cff', O: '#ff9a3d', D: '#332c4b',
}

const ICON_ROWS = {
  ring: ['..SSSS..', '.SS..SS.', 'SS.RR.SS', 'SS.RR.SS', 'SS....SS', '.SS..SS.', '..SSSS..', '........'],
  boots: ['...WWW..', '..WWWWW.', '...SSS..', '...SSS..', '..SSSSS.', '.SSSSSS.', '.SSSSSS.', '..KKKK..'],
  cloud: ['...WWW..', '..WWWWW.', '.WWWWWWW', '.WWWWWWW', '..WWWWW.', '...WWW..', '........', '........'],
  band: ['..SSSS..', '.SS..SS.', 'SS.RR.SS', 'SS.RR.SS', 'SS....SS', '.SS..SS.', '..SSSS..', '........'],
  doll: ['...SS...', '..SSSS..', '.SSSSSS.', '.S.KK.S.', '.SSSSSS.', '..SSSS..', '.SS..SS.', '.KK..KK.'],
  shield: ['KKKKKKKK', 'KSSSSSSK', 'KSPPPPSK', 'KSPWWPSK', 'KSPPPPSK', 'KSSSSSSK', '.KSSSSK.', '..KKKK..'],
  mirror: ['..KKKK..', '.KWWWWK.', 'KWKKKKWK', 'KWKBBKWK', 'KWKKKKWK', '.KWWWWK.', '..KKKK..', '........'],
  armor: ['.KK..KK.', 'KGGKKGGK', 'KGGGGGGK', 'KGGGGGGK', '.KGGGGK.', '.KGGGGK.', '..KGGK..', '..KKKK..'],
  sword: ['......KK', '.....KGK', '....KGK.', '...KGK..', 'K.KGK...', 'KKGK....', '.KK.....', '..K.....'],
  star: ['...YY...', '...YY...', 'YYYYYYYY', '.YYYYYY.', '..YYYY..', '.YY..YY.', '.Y....Y.', '........'],
  necklace: ['.SSSSSS.', 'S..PP..S', '...PP...', '..PPPP..', '..PPPP..', '...KK...', '........', '........'],
  clover: ['.GG.GG..', 'GGGGGGG.', 'GGGGGGG.', '.GGGGG..', '.GGGGG..', 'GGGGGGG.', '.GG.GG..', '........'],
  horseshoe: ['.YYYYY..', 'YY...YY.', 'YY..YY..', 'YY..YY..', 'YY...YY.', '.YY.YY..', '..YYY...', '........'],
  cube: ['.KKKKKK.', 'KPPPPPPK', 'KPKPPKPK', 'KPPPPPPK', 'KPKPPKPK', 'KPPPPPPK', '.KKKKKK.', '........'],
  magnet: ['.RR..RR.', 'RBBRRBBR', 'RBBRRBBR', 'RBBRRBBR', '.RRRRRR.', '...RR...', '...RR...', '........'],
  crest: ['.KKKKK..', 'KYYYYYK.', 'KYSSSYK.', 'KYSSSYK.', 'KYYYYYK.', '.KYYYK..', '..KYK...', '...K....'],
  ankh: ['..YYYY..', '.YYYYYY.', '..YYYY..', '...YY...', '..YYYY..', '..YYYY..', '...YY...', '........'],
  charm: ['..Y..Y..', '.YY.YY..', '..YYYY..', '...PP...', '..PPPP..', '..PPPP..', '...PP...', '........'],
  table: ['..KKKK..', '.KPPPPK.', 'KPPYYPPK', 'KPPYYPPK', '.KPPPPK.', '..KKKK..', '.K....K.', 'K......K'],
}

export const BOSS_SPRITES = Object.fromEntries(
  Object.entries(BOSS_ROWS).map(([id, rows]) => [id, { rows, palette: BOSS_PALETTES[id] }]),
)

export const ICON_SPRITES = Object.fromEntries(
  Object.entries(ICON_ROWS).map(([id, rows]) => [id, { rows, palette: ICON_PALETTE }]),
)

export const MERCHANT_SPRITE = {
  palette: { K: '#1c1712', H: '#7b5230', W: '#f0d7b2', R: '#a83c47', Y: '#ffd45e' },
  rows: [
    '....KKKKKK......',
    '...KHHHHHHK.....',
    '..KHHHHHHHHK....',
    '..KHHHHHHHHK....',
    '...KKKKKKKK.....',
    '..KWWWWWWWWK....',
    '.KWWKWWWWKWWK...',
    '.KWWWWWWWWWWK...',
    '.KWWWWWWWWWWK...',
    '..KWWWWWWWWK....',
    '...KWWWWWWK.....',
    '..KRRRRRRRRK....',
    '.KRRRRRRRRRRK...',
    '.KRRRRRRRRRRK...',
    '..KRRRRRRRRK....',
    '...KKKKKKKK.....',
  ],
}

export function drawSprite(canvas, sprite, options = {}) {
  if (!canvas || !sprite) return
  const dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1)
  const rows = sprite.rows
  const width = rows[0].length
  const height = rows.length
  const target = options.size || 160
  canvas.width = Math.round(target * dpr)
  canvas.height = Math.round(target * dpr)
  if (options.applyStyle !== false) {
    canvas.style.width = `${target}px`
    canvas.style.height = `${target}px`
  }
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const scale = Math.min(canvas.width / width, canvas.height / height)
  const offsetX = (canvas.width - width * scale) / 2
  const offsetY = (canvas.height - height * scale) / 2
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ch = rows[y][x]
      if (ch === '.' || ch === ' ') continue
      const color = sprite.palette[ch]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(
        Math.floor(offsetX + x * scale),
        Math.floor(offsetY + y * scale),
        Math.ceil(scale),
        Math.ceil(scale),
      )
    }
  }
  if (options.shadow) {
    ctx.globalCompositeOperation = 'destination-over'
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.beginPath()
    ctx.ellipse(canvas.width / 2, canvas.height * 0.9, canvas.width * 0.26, canvas.height * 0.05, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }
}

export function validateSprites() {
  const problems = []
  for (const [id, sprite] of Object.entries({ ...BOSS_SPRITES, ...ICON_SPRITES, merchant: MERCHANT_SPRITE })) {
    const len = sprite.rows[0].length
    sprite.rows.forEach((row, i) => {
      if (row.length !== len) problems.push(`${id} row ${i} has ${row.length}, expected ${len}`)
      for (const ch of row) {
        if (ch !== '.' && !sprite.palette[ch]) problems.push(`${id} row ${i} uses missing color ${ch}`)
      }
    })
  }
  return problems
}
