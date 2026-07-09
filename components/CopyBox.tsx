'use client'
import { useState } from 'react'
export default function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  return (
    <div className="copy-box">
      <button className="copy-btn" onClick={copy}>{copied ? '✓ Copied!' : 'Copy'}</button>
      {text}
    </div>
  )
}
