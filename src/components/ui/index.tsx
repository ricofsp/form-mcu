import { Fragment, type ReactNode } from 'react'
import { str, useForm, useInvalid } from '../../state/store'
import type { BiText, Detail, LabelStyle, Opt } from '../../types'

/* ------------------------------------------------------------------ */
/* Bilingual text: _italic_, *bold*, \n line break                     */
/* ------------------------------------------------------------------ */

export function Bi({ t, className }: { t: BiText; className?: string }) {
  // keep a trailing " :" / " ?" glued to the word before it, so it never wraps onto a line by itself
  const parts = t.replace(/ ([:?])/g, ' $1').split(/(_|\*|\n)/)
  let it = false
  let b = false
  const out: ReactNode[] = []
  parts.forEach((p, i) => {
    if (p === '_') it = !it
    else if (p === '*') b = !b
    else if (p === '\n') out.push(<br key={i} />)
    else if (p) {
      let node: ReactNode = p
      if (it) node = <em className="en" lang="en">{node}</em>
      if (b) node = <strong className="font-bold">{node}</strong>
      out.push(<Fragment key={i}>{node}</Fragment>)
    }
  })
  return <span className={className}>{out}</span>
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

const WIDTH: Record<string, string> = {
  xs: 'w-24',
  sm: 'w-36',
  md: 'w-52',
  lg: 'w-full max-w-72',
  full: 'w-full',
}

export function TextInput({
  k,
  type = 'text',
  width = 'full',
  variant = 'box',
  placeholder,
  label,
  required,
  disabled,
  center,
  inputMode,
}: {
  k: string
  type?: 'text' | 'number' | 'date' | 'time' | 'tel' | 'email'
  width?: keyof typeof WIDTH
  variant?: 'box' | 'line' | 'cell'
  placeholder?: string
  label: string
  required?: boolean
  disabled?: boolean
  center?: boolean
  inputMode?: 'numeric' | 'decimal' | 'tel' | 'email' | 'text'
}) {
  const { s, set } = useForm()
  const invalid = useInvalid(k, required)
  return (
    <input
      id={`i-${k}`}
      type={type === 'number' ? 'text' : type}
      inputMode={inputMode ?? (type === 'number' ? 'numeric' : undefined)}
      aria-label={label}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      placeholder={placeholder}
      value={str(s[k])}
      onChange={(e) => set(k, type === 'number' ? e.target.value.replace(/[^0-9.,]/g, '') : e.target.value)}
      className={`inp inp-${variant} ${WIDTH[width]} ${center ? 'text-center' : ''}`}
    />
  )
}

export function TextArea({ k, label, required, rows = 3, placeholder }: { k: string; label: string; required?: boolean; rows?: number; placeholder?: string }) {
  const { s, set } = useForm()
  const invalid = useInvalid(k, required)
  return (
    <textarea
      id={`i-${k}`}
      aria-label={label}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      rows={rows}
      placeholder={placeholder}
      value={str(s[k])}
      onChange={(e) => set(k, e.target.value)}
      className="inp inp-box w-full py-2.5"
    />
  )
}

/** Dropdown for fixed lists that are typed in free text on paper (e.g. marital status). */
export function Select({ k, opts, label, required, placeholder = 'Pilih…' }: { k: string; opts: Opt[]; label: string; required?: boolean; placeholder?: string }) {
  const { s, set } = useForm()
  const invalid = useInvalid(k, required)
  const value = str(s[k])
  return (
    <select
      id={`i-${k}`}
      aria-label={label}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      value={value}
      onChange={(e) => set(k, e.target.value)}
      className={`inp inp-box inp-select w-full ${value ? '' : 'is-empty'}`}
    >
      <option value="">{placeholder}</option>
      {opts.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l.replace(/[_*]/g, '')}
        </option>
      ))}
    </select>
  )
}

export function ErrorNote({ k, required }: { k: string; required?: boolean }) {
  const invalid = useInvalid(k, required)
  if (!invalid) return null
  return (
    <p className="mt-1.5 t-small text-danger" role="alert">
      Wajib diisi (<em>Required</em>)
    </p>
  )
}

export function ReqMark() {
  return (
    <span className="ml-1 font-bold text-danger" aria-hidden="true" title="Wajib diisi">
      *
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Choices (radio / checkbox) with optional inline detail input        */
/* ------------------------------------------------------------------ */

export function DetailInput({ k, d, label }: { k: string; d: Detail; label: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      {d.prefix && <Bi t={d.prefix} />}
      <TextInput k={k} type={d.type ?? 'text'} width={d.width ?? 'md'} variant="line" placeholder={d.placeholder} label={label} />
      {d.suffix && <Bi t={d.suffix} />}
    </span>
  )
}

export function Choice({
  name,
  type,
  opt,
  checked,
  onToggle,
  detailKey,
  groupLabel,
}: {
  name: string
  type: 'radio' | 'checkbox'
  opt: Opt
  checked: boolean
  onToggle: () => void
  detailKey?: string
  groupLabel?: string
}) {
  const id = `${name}--${opt.v}`
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <label htmlFor={id} className={`choice ${checked ? 'is-checked' : ''}`}>
        <input id={id} type={type} name={name} value={opt.v} checked={checked} onChange={onToggle} className="choice-input" />
        <Bi t={opt.l.replace(/,\s*$/, checked && opt.detail ? ',' : '')} />
      </label>
      {opt.detail && checked && detailKey && (
        <DetailInput k={detailKey} d={opt.detail} label={`${groupLabel ?? ''} – keterangan`} />
      )}
    </div>
  )
}

// Columns hug their content (like tab stops in Word) instead of stretching across the page
const COLS: Record<number, string> = {
  1: '',
  2: 'md:grid-cols-[repeat(2,fit-content(50%))]',
  3: 'md:grid-cols-[repeat(3,fit-content(34%))]',
  4: 'md:grid-cols-[repeat(4,fit-content(25%))]',
}

export function OptionGrid({
  name,
  opts,
  type,
  cols = 1,
  colMajor,
  inline,
  groupLabel,
}: {
  name: string
  opts: Opt[]
  type: 'radio' | 'checkbox'
  cols?: number
  colMajor?: boolean
  inline?: boolean
  groupLabel: string
}) {
  const { s, set } = useForm()
  const val = s[name]
  const isOn = (v: string) => (type === 'radio' ? val === v : Array.isArray(val) && val.includes(v))
  const toggle = (v: string) => {
    if (type === 'radio') set(name, v)
    else {
      const arr = Array.isArray(val) ? val : []
      set(name, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
    }
  }
  const rows = Math.ceil(opts.length / cols)
  const cls = inline
    ? 'flex flex-wrap gap-x-7 gap-y-0'
    : `grid grid-cols-1 gap-x-14 gap-y-0.5 ${COLS[cols] ?? ''} ${colMajor && cols > 1 ? 'md:grid-flow-col md:grid-rows-[repeat(var(--rows),auto)]' : ''}`
  return (
    <div
      role={type === 'radio' ? 'radiogroup' : 'group'}
      aria-label={groupLabel}
      className={cls}
      style={{ ['--rows' as string]: rows }}
    >
      {opts.map((o) => (
        <Choice
          key={o.v}
          name={name}
          type={type}
          opt={o}
          checked={isOn(o.v)}
          onToggle={() => toggle(o.v)}
          detailKey={o.detail ? `${name}__${o.v}` : undefined}
          groupLabel={groupLabel}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Question label                                                      */
/* ------------------------------------------------------------------ */

export function QLabel({ l, style = 'plain', bullet, req, htmlFor }: { l: BiText; style?: LabelStyle; bullet?: boolean; req?: boolean; htmlFor?: string }) {
  const cls =
    style === 'marker' ? 't-sub text-ink' : 'text-ink'
  const Tag = htmlFor ? 'label' : 'div'
  return (
    <Tag htmlFor={htmlFor} className={`flex items-start gap-2.5 ${cls}`}>
      {style === 'marker' && <span className="mt-[1px] text-brand" aria-hidden="true">▪</span>}
      {bullet && style !== 'marker' && <span className="mt-[1px] select-none" aria-hidden="true">•</span>}
      <span>
        <Bi t={l} />
        {req && <ReqMark />}
      </span>
    </Tag>
  )
}
