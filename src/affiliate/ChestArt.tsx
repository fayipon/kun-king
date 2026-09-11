import { useId } from 'react'

// Silhouette clips split the original illustration without regenerating its pixels.
export default function ChestArt() {
  const id = useId().replace(/:/g,'')
  const source = `${import.meta.env.BASE_URL}affiliate/reference.png`
  return <svg className="chest-art" viewBox="375 455 155 150" aria-hidden="true">
    <defs>
      <clipPath id={`${id}-body`}><path d="M408 535 L491 533 L488 568 Q454 579 416 568 L411 562Z"/></clipPath>
      <clipPath id={`${id}-lid`}><path d="M405 537 L404 524 Q403 509 418 508 L478 508 Q493 506 494 522 L491 540 L414 542Z"/></clipPath>
      <clipPath id={`${id}-lock`}><ellipse cx="457" cy="546" rx="16" ry="17"/></clipPath>
      <radialGradient id={`${id}-light`}><stop stopColor="#fff8b4"/><stop offset=".35" stopColor="#8affd9" stopOpacity=".8"/><stop offset="1" stopColor="#42faca" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${id}-inside`} x2="0" y2="1"><stop stopColor="#fff7a6"/><stop offset="1" stopColor="#57f8c7"/></linearGradient>
    </defs>
    <ellipse className="chest-art-shadow" cx="450" cy="579" rx="52" ry="12" fill="#021c20" opacity=".6"/>
    <g className="chest-lid"><image href={source} width="941" height="1672" clipPath={`url(#${id}-lid)`}/><path d="M440 530 H475 V543 H440Z" fill="#efb82d" clipPath={`url(#${id}-lid)`}/></g>
    <ellipse className="chest-inner-light" cx="450" cy="539" rx="37" ry="9" fill={`url(#${id}-inside)`}/>
    <image href={source} width="941" height="1672" clipPath={`url(#${id}-body)`}/>
    <image href={source} width="941" height="1672" clipPath={`url(#${id}-lock)`}/>
    <g className="chest-light-burst"><ellipse cx="450" cy="523" rx="65" ry="66" fill={`url(#${id}-light)`}/><path d="M430 540 L408 461 L450 524 L482 462 L471 540Z" fill="#c5ffe4" opacity=".7"/></g>
  </svg>
}
