import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { FormState, Value } from '../types'

const STORAGE_KEY = 'primaya-mcu-form:v1'

interface FormCtx {
  s: FormState
  set: (key: string, value: Value) => void
  replaceAll: (next: FormState) => void
  showErrors: boolean
  setShowErrors: (v: boolean) => void
}

const Ctx = createContext<FormCtx | null>(null)

function load(): FormState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FormState) : {}
  } catch {
    return {}
  }
}

/** Form answers live in memory and are mirrored to sessionStorage so they survive a reload during the prototype session. */
export function FormProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<FormState>(load)
  const [showErrors, setShowErrors] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s))
      } catch {
        /* storage unavailable: answers stay in memory only */
      }
    }, 250)
  }, [s])

  const set = useCallback((key: string, value: Value) => {
    setS((prev) => {
      const next = { ...prev }
      if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) delete next[key]
      else next[key] = value
      return next
    })
  }, [])

  const replaceAll = useCallback((next: FormState) => setS(next), [])

  const value = useMemo(() => ({ s, set, replaceAll, showErrors, setShowErrors }), [s, set, replaceAll, showErrors])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useForm() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useForm must be used inside FormProvider')
  return c
}

export const str = (v: Value) => (typeof v === 'string' ? v : '')
export const isEmpty = (v: Value) => v === undefined || v === '' || (Array.isArray(v) && v.length === 0)

/** True when the value at `key` is missing and errors should be shown for it. */
export function useInvalid(key: string, required?: boolean) {
  const { s, showErrors } = useForm()
  return !!required && showErrors && isEmpty(s[key])
}

/** True on wide screens, and always when printing, so the printout keeps the desktop table layout. */
export function useIsWide(minWidth = '(min-width: 768px)') {
  const query = `${minWidth}, print`
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : true)
  const [wide, setWide] = useState(get)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return wide
}
