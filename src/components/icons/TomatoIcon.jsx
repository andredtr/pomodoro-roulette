import React from 'react'

export default function TomatoIcon({className}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="13" r="7" className="fill-accent-primary" />
      <path
        d="M12 4l2-2m-2 2L10 2m2 2v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-accent-success"
      />
      <path
        d="M12 13l-3-2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-white"
      />
      <path
        d="M12 13l3-2"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-white"
      />
    </svg>
  )
}
