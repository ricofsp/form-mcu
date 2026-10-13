/**
 * Bilingual text markup used throughout the schema:
 *   _text_  -> italic (English translation, as in the source document)
 *   *text*  -> bold
 *   \n      -> line break
 */
export type BiText = string

export type Value = string | string[] | undefined
export type FormState = Record<string, Value>

/** Extra input shown next to an option once that option is selected. */
export interface Detail {
  /** text before the input, e.g. "pada tahun" */
  prefix?: BiText
  /** text after the input, e.g. "x/hari (_x/day_)" */
  suffix?: BiText
  type?: 'text' | 'number' | 'time'
  placeholder?: string
  width?: 'xs' | 'sm' | 'md' | 'lg'
}

export interface Opt {
  v: string
  l: BiText
  detail?: Detail
}

export type LabelStyle = 'plain' | 'bold' | 'marker'

export type Node =
  | { t: 'h2'; l: BiText; badge?: BiText; badgeTone?: 'muted' | 'red'; marker?: boolean }
  | { t: 'label'; l: BiText }
  | { t: 'p'; l: BiText; en: BiText }
  | {
      t: 'radio'
      key: string
      l?: BiText
      opts: Opt[]
      /** number of columns on wide screens */
      cols?: number
      /** fill column-by-column on wide screens (mirrors the source layout) */
      colMajor?: boolean
      req?: boolean
      bullet?: boolean
      labelStyle?: LabelStyle
      /** compact row: label left, options right */
      row?: boolean
    }
  | {
      t: 'check'
      key: string
      l?: BiText
      opts: Opt[]
      cols?: number
      bullet?: boolean
    }
  | {
      t: 'field'
      key: string
      l: BiText
      type: 'text' | 'number' | 'date' | 'time' | 'textarea'
      suffix?: BiText
      req?: boolean
      placeholder?: string
      bullet?: boolean
      labelStyle?: LabelStyle
      width?: 'xs' | 'sm' | 'md' | 'lg' | 'full'
    }
  | { t: 'table'; kind: TableKind }
  | { t: 'identity' }
  | { t: 'consent' }

export type TableKind = 'pmh' | 'family' | 'vaccine' | 'meals' | 'foodq' | 'drinks' | 'meds'

export interface Section {
  id: string
  /** name used in the answer summary */
  title: BiText
  /** visible heading (omitted when the source document has none) */
  heading?: { l: BiText; en?: BiText; badge?: BiText }
  /** only rendered when this returns true */
  show?: (s: FormState) => boolean
  nodes: Node[]
}

export interface RequiredField {
  key: string
  label: string
  /** element id to scroll to */
  anchor: string
}
