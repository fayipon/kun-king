export const balances = { cash: 12450, promo: 850 }
export const statistics = {
  'This month': { deposit: 12450, withdrawal: 8000, rewards: 850 },
  'Last month': { deposit: 9500, withdrawal: 6200, rewards: 500 },
  'All time': { deposit: 21950, withdrawal: 14200, rewards: 1350 },
}
export type Period = keyof typeof statistics
export type Category = 'All' | 'Deposit' | 'Withdraw' | 'Promo'
export type Transaction = { id: string; title: string; category: Exclude<Category, 'All'>; amount: number; channel: string; date: string; time: string; status: 'Completed' | 'Pending' | 'Credited' }
export const transactions: Transaction[] = [
  { id:'TX-001', title:'Deposit', category:'Deposit', amount:1000, channel:'GCash', date:'2026-09-10', time:'18:24', status:'Completed' },
  { id:'TX-002', title:'Withdrawal', category:'Withdraw', amount:-500, channel:'Bank transfer', date:'2026-09-10', time:'16:30', status:'Pending' },
  { id:'TX-003', title:'Welcome bonus', category:'Promo', amount:500, channel:'Promo wallet', date:'2026-09-10', time:'14:20', status:'Credited' },
  { id:'TX-004', title:'Daily check-in', category:'Promo', amount:25, channel:'Promo wallet', date:'2026-09-10', time:'09:12', status:'Credited' },
  { id:'TX-005', title:'Withdrawal', category:'Withdraw', amount:-2000, channel:'Bank transfer', date:'2026-09-09', time:'11:06', status:'Completed' },
  { id:'TX-006', title:'Deposit', category:'Deposit', amount:500, channel:'GCash', date:'2026-09-08', time:'10:15', status:'Completed' },
  { id:'TX-007', title:'Deposit', category:'Deposit', amount:1500, channel:'Bank transfer', date:'2026-08-22', time:'13:45', status:'Completed' },
  { id:'TX-008', title:'Withdrawal', category:'Withdraw', amount:-750, channel:'Bank transfer', date:'2026-08-15', time:'16:10', status:'Completed' },
]
export const money = (value: number) => `${value < 0 ? '−' : ''}₱${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 })}`
export const filterTransactions = (category: Category, period: Period) => transactions.filter(t =>
  (category === 'All' || t.category === category) && (period === 'All time' || t.date.startsWith(period === 'This month' ? '2026-09' : '2026-08')))
export const displayDate = (t: Transaction) => `${t.date === '2026-09-10' ? 'Today' : `${t.date.startsWith('2026-09') ? 'Sep' : 'Aug'} ${t.date.slice(8)}`} · ${t.time}`
