import {
  FAMILY_DISEASES,
  FAMILY_DISEASE_SHORT,
  FAMILY_MEMBERS,
  FOOD_QUALITY,
  GENDER_OPTS,
  IDENTITY,
  MEALS,
  MEAL_REGULAR,
  MED_ROWS,
  RELATION_OPTS,
  PMH_ROWS,
  REQUIRED,
  SECTIONS,
  VACCINES,
  WATER_OPTS,
  plain,
} from '../data/schema'
import { isEmpty, str } from '../state/store'
import type { FormState, Node, Opt, RequiredField, TableKind } from '../types'

export type SumRow =
  | { kind: 'sub'; label: string }
  | { kind: 'row'; label: string; value: string; answered: boolean; key?: string; image?: string }

export interface SumSection {
  id: string
  title: string
  rows: SumRow[]
  answered: number
  total: number
}

const clean = (t: string) => plain(t).replace(/\s*[:,]\s*$/, '').trim()

function fmtDate(v: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
  return m ? `${m[3]}/${m[2]}/${m[1]}` : v
}

function optValue(s: FormState, key: string, opts: Opt[]) {
  const v = s[key]
  if (typeof v !== 'string') return ''
  const o = opts.find((x) => x.v === v)
  if (!o) return v
  let out = clean(o.l)
  if (o.detail) {
    const d = str(s[`${key}__${o.v}`])
    if (d) out += `, ${[o.detail.prefix && plain(o.detail.prefix), d, o.detail.suffix && plain(o.detail.suffix)].filter(Boolean).join(' ')}`
  }
  return out
}

const row = (label: string, value: string, key?: string): SumRow => ({ kind: 'row', label, value, answered: !!value, key })

function tableRows(kind: TableKind, s: FormState): SumRow[] {
  switch (kind) {
    case 'pmh':
      return PMH_ROWS.map((r) => {
        const v = s[`pmh_${r.key}`]
        let value = ''
        if (v === 'ya') {
          const y = str(s[`pmh_${r.key}__ya`])
          const nm = str(s[`pmh_${r.key}_nama`])
          value = `Ya${y ? `, pada tahun ${y}` : ''}${nm ? ` — ${nm}` : ''}`
        } else if (v === 'tidak') value = 'Tidak'
        return row(clean(r.l), value, `pmh_${r.key}`)
      })
    case 'family':
      return FAMILY_MEMBERS.map((m) => {
        const parts: string[] = []
        if (m.freeCondition) {
          const k = str(s[`fam_${m.key}_kondisi`])
          if (k) parts.push(`Kondisi: ${k}`)
          FAMILY_DISEASES.forEach((d) => {
            const a = str(s[`fam_${m.key}_${d.key}`])
            if (a) parts.push(`${clean(FAMILY_DISEASE_SHORT[d.key])}: ${a}`)
          })
        } else {
          FAMILY_DISEASES.forEach((d) => {
            const dx = str(s[`fam_${m.key}_dx_${d.key}`])
            const death = str(s[`fam_${m.key}_death_${d.key}`])
            if (dx || death)
              parts.push(
                `${clean(FAMILY_DISEASE_SHORT[d.key])}: ${[dx && `terdiagnosis usia ${dx}`, death && `meninggal usia ${death}`].filter(Boolean).join(', ')}`,
              )
          })
        }
        return row(clean(m.l), parts.join('\n'))
      })
    case 'vaccine':
      return VACCINES.map((r) => {
        const v = s[`vak_${r.key}`]
        let value = ''
        if (v === 'ya') {
          const y = str(s[`vak_${r.key}__ya`])
          const nm = str(s[`vak_${r.key}_nama`])
          value = `Ya${y ? `, pada tahun ${y}` : ''}${nm ? ` — ${nm}` : ''}`
        } else if (v === 'tidak') value = 'Tidak'
        else if (v === 'tidak_ingat') value = 'Tidak ingat'
        return row(clean(r.l), value, `vak_${r.key}`)
      })
    case 'meals':
      return MEALS.map((m) => {
        const parts = [
          s[`meal_${m.key}_teratur`] && `Teratur: ${optValue(s, `meal_${m.key}_teratur`, MEAL_REGULAR)}`,
          s[`meal_${m.key}_jadwal`] && `Jadwal: ${optValue(s, `meal_${m.key}_jadwal`, m.schedule)}`,
          s[`meal_${m.key}_jenis`] && `Jenis makanan: ${str(s[`meal_${m.key}_jenis`])}`,
        ].filter(Boolean) as string[]
        return row(clean(m.l), parts.join('\n'))
      })
    case 'foodq':
      return FOOD_QUALITY.map((r) => {
        const f = str(s[`fq_${r.key}_frek`])
        const p = str(s[`fq_${r.key}_porsi`])
        return row(clean(r.l), [f && `Frekuensi: ${f} kali/minggu`, p && `Porsi: ${p}`].filter(Boolean).join('\n'))
      })
    case 'drinks':
      return [
        row('Air Putih (Plain water)', optValue(s, 'drink_air', WATER_OPTS)),
        row('Kopi (Coffee)', str(s.drink_kopi) && `${str(s.drink_kopi)} gelas/hari`),
        row('Teh (Tea)', str(s.drink_teh) && `${str(s.drink_teh)} gelas/hari`),
        row('Minuman ringan (Soft drinks)', str(s.drink_soft)),
        row(
          'Alkohol (Alcohol)',
          optValue(s, 'drink_alkohol', [
            { v: 'ya', l: 'Ya (Yes),', detail: { suffix: 'cc' } },
            { v: 'tidak', l: 'Tidak (No)' },
          ]),
        ),
      ]
    case 'meds': {
      const items: string[] = []
      for (let i = 0; i < MED_ROWS; i++) {
        const n = str(s[`med_${i}_nama`])
        const d = str(s[`med_${i}_dosis`])
        if (n || d) items.push(`${n || '(tanpa nama)'}${d ? ` — dosis ${d}` : ''}`)
      }
      return [row('Obat & Suplemen (Drugs and Supplements)', items.join('\n'))]
    }
  }
}

function nodeRows(n: Node, s: FormState, prevLabel: string): SumRow[] {
  switch (n.t) {
    case 'h2':
      return [{ kind: 'sub', label: clean(n.l) }]
    case 'label':
      return n.l.startsWith('Obat') ? [] : [{ kind: 'sub', label: clean(n.l) }]
    case 'p':
      return []
    case 'identity':
      return IDENTITY.map((r) => {
        let v = ''
        if (r.type === 'gender') v = optValue(s, r.key, GENDER_OPTS)
        else if (r.type === 'select') v = optValue(s, r.key, r.opts ?? [])
        else if (r.type === 'emergency')
          v = [str(s.kontak_darurat_nama), optValue(s, 'kontak_darurat_hubungan', RELATION_OPTS), str(s.kontak_darurat_telp)].filter(Boolean).join(' — ')
        else if (r.type === 'date') v = fmtDate(str(s[r.key]))
        else v = str(s[r.key])
        return row(clean(r.l), v, r.key)
      })
    case 'radio':
      return [row(n.l ? clean(n.l) : `${prevLabel} (rentang)`, optValue(s, n.key, n.opts), n.key)]
    case 'check': {
      const v = s[n.key]
      const arr = Array.isArray(v) ? v : []
      const labels = arr.map((x) => {
        const o = n.opts.find((o) => o.v === x)
        if (!o) return x
        const d = o.detail ? str(s[`${n.key}__${o.v}`]) : ''
        return `${clean(o.l)}${d ? `: ${d}` : ''}`
      })
      return [row(n.l ? clean(n.l) : n.key, labels.join(', '), n.key)]
    }
    case 'field': {
      let v = str(s[n.key])
      if (v && n.type === 'date') v = fmtDate(v)
      if (v && n.suffix) v = `${v} ${plain(n.suffix)}`
      return [row(clean(n.l), v, n.key)]
    }
    case 'table':
      return tableRows(n.kind, s)
    case 'consent':
      return [
        row('Pernyataan persetujuan medis', s.consent_setuju === 'ya' ? 'Disetujui' : '', 'consent_setuju'),
        row(
          'Tempat, tanggal, pukul',
          [str(s.consent_tempat), fmtDate(str(s.consent_tanggal)), str(s.consent_pukul) && `pukul ${str(s.consent_pukul)}`]
            .filter(Boolean)
            .join(', '),
          'consent_tempat',
        ),
        row('Yang memberikan keterangan', str(s.consent_nama), 'consent_nama'),
        { kind: 'row', label: 'Tanda tangan', value: s.consent_ttd ? 'Sudah ditandatangani' : '', answered: !!s.consent_ttd, key: 'consent_ttd', image: str(s.consent_ttd) || undefined },
      ]
  }
}

export function buildSummary(s: FormState): SumSection[] {
  return SECTIONS.filter((sec) => !sec.show || sec.show(s)).map((sec) => {
    const rows: SumRow[] = []
    let prev = ''
    for (const n of sec.nodes) {
      const r = nodeRows(n, s, prev)
      rows.push(...r)
      const lastRow = [...r].reverse().find((x) => x.kind === 'row')
      if (lastRow && lastRow.kind === 'row') prev = lastRow.label
    }
    const answerRows = rows.filter((r): r is Extract<SumRow, { kind: 'row' }> => r.kind === 'row')
    return {
      id: sec.id,
      title: plain(sec.title),
      rows,
      answered: answerRows.filter((r) => r.answered).length,
      total: answerRows.length,
    }
  })
}

export function missingRequired(s: FormState): RequiredField[] {
  return REQUIRED.filter((r) => isEmpty(s[r.key]))
}
