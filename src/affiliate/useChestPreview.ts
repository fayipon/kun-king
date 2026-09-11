import { useEffect, useReducer, useState } from 'react'
import { available } from './data'

export type ChestPhase = 'idle' | 'lifting' | 'shaking' | 'revealing' | 'reward' | 'claimed'
export const chestTiming = { lifting:1000, shaking:700, revealing:900 } as const
export const previewReward = 50
export type ChestState = { phase:ChestPhase; selected:number | null; claimed:number[]; lastClaimed:number | null }
type Action = { type:'start'; reduced:boolean } | { type:'advance' } | { type:'reduce' } | { type:'cancel' } | { type:'claim' } | { type:'reset' } | { type:'dismissToast' }
const initial:ChestState = { phase:'idle', selected:null, claimed:[], lastClaimed:null }
export function chestReducer(state:ChestState, action:Action):ChestState {
  switch (action.type) {
    case 'start': {
      if (state.selected !== null) return state
      const chest = available.find(m => !state.claimed.includes(m.threshold))
      return chest ? { ...state, selected:chest.threshold, phase:action.reduced ? 'reward' : 'lifting', lastClaimed:null } : state
    }
    case 'advance': {
      const next = { lifting:'shaking', shaking:'revealing', revealing:'reward' } as const
      return state.phase in next ? { ...state, phase:next[state.phase as keyof typeof next] } : state
    }
    case 'reduce': return state.selected !== null ? { ...state, phase:'reward' } : state
    case 'cancel': return { ...state, phase:'idle', selected:null }
    case 'claim': return state.phase === 'reward' && state.selected !== null && !state.claimed.includes(state.selected)
      ? { phase:'claimed', selected:null, claimed:[...state.claimed,state.selected], lastClaimed:state.selected } : state
    case 'reset': return state.selected === null ? initial : state
    case 'dismissToast': return { ...state, lastClaimed:null }
  }
}

export function useChestPreview() {
  const [state, dispatch] = useReducer(chestReducer, initial)
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change',update)
    return () => media.removeEventListener('change',update)
  }, [])
  useEffect(() => {
    if (reduced) { dispatch({type:'reduce'}); return }
    if (!(state.phase in chestTiming)) return
    const timer = window.setTimeout(() => dispatch({type:'advance'}),chestTiming[state.phase as keyof typeof chestTiming])
    return () => window.clearTimeout(timer)
  }, [state.phase,reduced])
  return { state, dispatch, reduced, remainingChests:available.filter(m=>!state.claimed.includes(m.threshold)) }
}
