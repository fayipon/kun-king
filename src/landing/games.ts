export type Game = { id: string; name: string; image: string; featured: boolean; fresh: boolean }

// Display names transcribed from supplied covers; categories are editorial demo selections.
const catalog: [string, string][] = [
  ['1999', 'Fortune Rabbit 2'], ['98', 'Fortune Ox'], ['65', 'Mahjong Ways'],
  ['3', 'Fortune Gods'], ['25', 'Plushie Frenzy'], ['29', 'Dragon Legend'],
  ['33', 'Hip Hop Panda'], ['57', 'Dragon Hatch'], ['68', 'Fortune Mouse'],
  ['7', 'Medusa'], ['20', 'Reel Love'], ['24', 'Win Win Won'],
  ['34', 'Legend of Hou Yi'], ['35', 'Mr. Hallow-Win!'], ['36', 'Prosperity Lion'],
  ['37', "Santa’s Gift Rush"], ['38', 'Gem Saviour Sword'], ['39', 'Piggy Gold'],
  ['40', 'Jungle Delight'], ['42', 'Ganesha Gold'], ['44', "Emperor’s Favour"],
  ['48', 'Double Fortune'], ['50', 'Journey to the Wealth'], ['53', 'The Great Icescape'],
  ['54', "Captain’s Bounty"], ['58', "Vampire’s Charm"], ['59', 'Ninja vs Samurai'],
  ['60', 'Leprechaun Riches'], ['61', 'Flirting Scholar'], ['62', 'Gem Saviour Conquest'],
  ['63', 'Dragon Tiger Luck'], ['64', 'Muay Thai Champion'],
]

export const games: Game[] = catalog.map(([id, name], index) => ({
  id, name, image: `${import.meta.env.BASE_URL}games/${id}.webp`,
  featured: index % 3 !== 2, fresh: index >= 16,
}))

export const favoriteKey = 'kun-king:favorites:v1'
export function readFavorites(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(favoriteKey) ?? '[]')
    return Array.isArray(data) ? [...new Set(data.filter((id): id is string => typeof id === 'string' && games.some(game => game.id === id)))] : []
  } catch { return [] }
}
