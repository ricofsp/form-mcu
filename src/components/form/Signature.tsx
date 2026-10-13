import { useCallback, useEffect, useRef } from 'react'
import { str, useForm, useInvalid } from '../../state/store'

/** Simple signature pad. The drawing is stored as a PNG data URL in the form state. */
export function Signature({ k, required }: { k: string; required?: boolean }) {
  const { s, set } = useForm()
  const invalid = useInvalid(k, required)
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const value = str(s[k])
  const valueRef = useRef(value)
  valueRef.current = value

  const setup = useCallback(() => {
    const c = canvas.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    c.width = Math.max(1, Math.round(r.width * dpr))
    c.height = Math.max(1, Math.round(r.height * dpr))
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#13293a'
    if (valueRef.current) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height)
      img.src = valueRef.current
    }
  }, [])

  useEffect(() => {
    setup()
    const c = canvas.current
    if (!c || typeof ResizeObserver === 'undefined') return
    let w = c.getBoundingClientRect().width
    const ro = new ResizeObserver(() => {
      const nw = c.getBoundingClientRect().width
      if (Math.abs(nw - w) > 1) {
        w = nw
        setup()
      }
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [setup])

  // cleared from outside (e.g. "Kosongkan formulir")
  useEffect(() => {
    if (!value && canvas.current) {
      const c = canvas.current
      c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    }
  }, [value])

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const down = (e: React.PointerEvent) => {
    e.preventDefault()
    canvas.current!.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = pos(e)
    const ctx = canvas.current!.getContext('2d')!
    ctx.beginPath()
    ctx.arc(last.current.x, last.current.y, 1, 0, Math.PI * 2)
    ctx.fillStyle = '#13293a'
    ctx.fill()
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return
    const p = pos(e)
    const ctx = canvas.current!.getContext('2d')!
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    set(k, canvas.current!.toDataURL('image/png'))
  }
  const clear = () => {
    const c = canvas.current!
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    set(k, undefined)
  }

  return (
    <div>
      <canvas
        ref={canvas}
        id={`i-${k}`}
        tabIndex={0}
        role="img"
        aria-label="Kotak tanda tangan. Tanda tangani dengan jari, pena, atau mouse."
        className={`sig-pad ${invalid ? 'is-invalid' : ''}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />
      <div className="mt-1 flex min-h-[29px] items-center justify-between gap-2 t-small text-ink-2">
        <span>{value ? 'Tanda tangan tersimpan' : 'Tanda tangani di dalam kotak'}</span>
        <button type="button" onClick={clear} className="btn-link no-print" disabled={!value}>
          Hapus tanda tangan
        </button>
      </div>
    </div>
  )
}
