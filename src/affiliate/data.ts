// A fixed snapshot: these records never accrue real referrals or rewards.
export const snapshotDate = '2026-09-11'
export const inviteCode = 'DEMO-KUNKING12'
export const friends = ['JohnD23', 'MariaPlay', 'AlexGG', 'LunaStar', 'KaiPlay', 'PixelFox', 'NovaAce', 'SamWin', 'JadeMoon', 'LeoQuest', 'MiaSky', 'BenGo'].map((name, index) => ({
  name,
  joined: new Date(Date.parse(`${snapshotDate}T00:00:00Z`) - (index + 2) * 86400000).toISOString().slice(0, 10),
  daysAgo: index + 2,
  valid: true,
}))
export type Friend = typeof friends[number]
export const invited = friends.filter(friend => friend.valid).length
export const milestones = [
  { threshold: 5, x: 485, y: 880, labelX: 548, labelY: 891, color: '#0c2830' },
  { threshold: 10, x: 403, y: 771, labelX: 471, labelY: 781, color: '#0b2b33' },
  { threshold: 15, x: 450, y: 544, labelX: 517, labelY: 554, color: '#102f3e' },
  { threshold: 20, x: 474, y: 443, labelX: 538, labelY: 449, color: '#14374c' },
  { threshold: 25, x: 511, y: 339, labelX: 570, labelY: 339, color: '#102d42' },
]
export const available = milestones.filter(m => m.threshold <= invited)
export const next = milestones.find(m => m.threshold > invited)!
export const remaining = next.threshold - invited
export const milestoneStatus = (threshold: number) => threshold <= invited ? 'Reached' : threshold === next.threshold ? 'Next chest' : 'Locked'
