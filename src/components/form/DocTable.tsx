import type { ReactNode } from 'react'
import {
  FAMILY_DISEASES,
  FAMILY_DISEASE_SHORT,
  FAMILY_MEMBERS,
  FAMILY_SUBROWS,
  FOOD_QUALITY,
  MEALS,
  MEAL_REGULAR,
  MED_ROWS,
  PMH_ROWS,
  VACCINES,
  WATER_OPTS,
  plain,
} from '../../data/schema'
import { useForm, useIsWide } from '../../state/store'
import type { Opt, TableKind } from '../../types'
import { Bi, Choice, OptionGrid, TextArea, TextInput } from '../ui'

/* Single radio cell bound to a key (used inside table cells). */
function RadioCell({ name, opt, detail, label }: { name: string; opt: Opt; detail?: boolean; label: string }) {
  const { s, set } = useForm()
  return (
    <Choice
      name={name}
      type="radio"
      opt={opt}
      checked={s[name] === opt.v}
      onToggle={() => set(name, opt.v)}
      detailKey={detail ? `${name}__${opt.v}` : undefined}
      groupLabel={label}
    />
  )
}

function Th({ children, className = '', colSpan, align = 'center' }: { children?: ReactNode; className?: string; colSpan?: number; align?: 'left' | 'center' }) {
  return (
    <th colSpan={colSpan} scope="col" className={`${align === 'left' ? 'text-left' : 'text-center'} ${className}`}>
      {children}
    </th>
  )
}

/** Stacked block used on narrow screens in place of a table row. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-line px-3.5 py-3.5 last:border-b-0">
      <div className="mb-2">
        <Bi t={title} />
      </div>
      {children}
    </div>
  )
}
function Stack({ head, children }: { head: string; children: ReactNode }) {
  return (
    <div className="doc-stack">
      <div className="doc-stack-head">
        <Bi t={head} />
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Riwayat penyakit dahulu (Past medical history)                      */
/* ------------------------------------------------------------------ */

const PMH_YA: Opt = { v: 'ya', l: 'Ya, pada tahun / _Yes, in_', detail: { type: 'number', width: 'xs', placeholder: 'tahun' } }
const PMH_TIDAK: Opt = { v: 'tidak', l: 'Tidak / _No_' }

function PmhOtherName({ k, show }: { k: string; show: boolean }) {
  if (!show) return null
  return (
    <div className="mt-2">
      <TextInput k={k} variant="line" placeholder="sebutkan" label="Sebutkan" />
    </div>
  )
}

function PmhTable() {
  const wide = useIsWide()
  const { s } = useForm()
  if (!wide)
    return (
      <Stack head="Penyakit (_Diseases_) — Status (_Status_)">
        {PMH_ROWS.map((r) => (
          <Block key={r.key} title={r.l}>
            <div className="flex flex-col gap-0.5">
              <RadioCell name={`pmh_${r.key}`} opt={PMH_YA} detail label={plain(r.l)} />
              <RadioCell name={`pmh_${r.key}`} opt={PMH_TIDAK} label={plain(r.l)} />
            </div>
            {r.nameField && <PmhOtherName k={`pmh_${r.key}_nama`} show={s[`pmh_${r.key}`] === 'ya'} />}
          </Block>
        ))}
      </Stack>
    )
  return (
    <table className="doc-table">
      <colgroup>
        <col className="w-[31%]" />
        <col className="w-[47%]" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <Th>
            <Bi t="Penyakit (_Diseases_)" />
          </Th>
          <Th colSpan={2}>
            <Bi t="Status (_Status_)" />
          </Th>
        </tr>
      </thead>
      <tbody>
        {PMH_ROWS.map((r) => (
          <tr key={r.key}>
            <td>
              <Bi t={r.l} />
              {r.nameField && <PmhOtherName k={`pmh_${r.key}_nama`} show={s[`pmh_${r.key}`] === 'ya'} />}
            </td>
            <td>
              <RadioCell name={`pmh_${r.key}`} opt={PMH_YA} detail label={plain(r.l)} />
            </td>
            <td>
              <RadioCell name={`pmh_${r.key}`} opt={PMH_TIDAK} label={plain(r.l)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Riwayat penyakit keluarga (Family medical history)                  */
/* ------------------------------------------------------------------ */

/** Column headers for the narrow per-member tables (the full wording breaks mid-word there) */
const FAMILY_SUBROW_SHORT: Record<string, string> = {
  dx: 'Usia diagnosis\n_Age at diagnosis_',
  death: 'Usia meninggal\n_Age of death_',
}

function FamilyTable() {
  const wide = useIsWide('(min-width: 920px)')
  if (!wide)
    return (
      <div className="flex flex-col gap-4">
        {FAMILY_MEMBERS.map((m) => (
          <div key={m.key} className="doc-stack">
            <div className="doc-stack-head">
              <Bi t={m.l.replace(/\n/g, ' / ')} />
            </div>
            {m.freeCondition ? (
              <div className="px-3.5 py-3">
                <div className="mb-1.5">
                  <Bi t="Kondisi _Condition_" />
                </div>
                <TextInput k={`fam_${m.key}_kondisi`} label="Other family member – kondisi" placeholder="Hubungan & kondisi" />
                <table className="doc-table mt-3">
                  <tbody>
                    {FAMILY_DISEASES.map((d) => (
                      <tr key={d.key}>
                        <td>
                          <Bi t={FAMILY_DISEASE_SHORT[d.key]} />
                        </td>
                        <td className="w-24 !p-1">
                          <TextInput k={`fam_${m.key}_${d.key}`} type="number" variant="cell" center label={`Other family member – ${plain(FAMILY_DISEASE_SHORT[d.key])}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <table className="doc-table doc-table-inner">
                <thead>
                  <tr>
                    <Th align="left">
                      <Bi t="Kondisi _Condition_" />
                    </Th>
                    {FAMILY_SUBROWS.map((r) => (
                      <Th key={r.key} className="w-[26%]">
                        <Bi t={FAMILY_SUBROW_SHORT[r.key]} />
                      </Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FAMILY_DISEASES.map((d) => (
                    <tr key={d.key}>
                      <td>
                        <Bi t={FAMILY_DISEASE_SHORT[d.key]} />
                      </td>
                      {FAMILY_SUBROWS.map((r) => (
                        <td key={r.key} className="!p-1">
                          <TextInput
                            k={`fam_${m.key}_${r.key}_${d.key}`}
                            type="number"
                            variant="cell"
                            center
                            label={`${plain(m.l)} – ${plain(r.l)} – ${plain(FAMILY_DISEASE_SHORT[d.key])}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    )
  return (
    <table className="doc-table doc-table-family">
      <colgroup>
        <col className="w-[15%]" />
        <col className="w-[18%]" />
        {FAMILY_DISEASES.map((d) => (
          <col key={d.key} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <Th />
          <Th align="left">
            <Bi t="_Kondisi Condition_" />
          </Th>
          {FAMILY_DISEASES.map((d) => (
            <Th key={d.key} align="left">
              <Bi t={d.l} />
            </Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {FAMILY_MEMBERS.map((m) =>
          m.freeCondition ? (
            <tr key={m.key} className="row-group">
              <td>
                <Bi t={m.l} />
              </td>
              <td className="!p-1">
                <TextInput k={`fam_${m.key}_kondisi`} variant="cell" label="Other family member – kondisi" placeholder="Hubungan" />
              </td>
              {FAMILY_DISEASES.map((d) => (
                <td key={d.key} className="!p-1">
                  <TextInput k={`fam_${m.key}_${d.key}`} type="number" variant="cell" center label={`Other family member – ${plain(d.l)}`} />
                </td>
              ))}
            </tr>
          ) : (
            FAMILY_SUBROWS.map((r, i) => (
              <tr key={`${m.key}-${r.key}`} className={i === 0 ? 'row-group' : ''}>
                {i === 0 && (
                  <td rowSpan={FAMILY_SUBROWS.length}>
                    <Bi t={m.l} />
                  </td>
                )}
                <td>
                  <Bi t={r.l} />
                </td>
                {FAMILY_DISEASES.map((d) => (
                  <td key={d.key} className="!p-1">
                    <TextInput
                      k={`fam_${m.key}_${r.key}_${d.key}`}
                      type="number"
                      variant="cell"
                      center
                      label={`${plain(m.l)} – ${plain(r.l)} – ${plain(FAMILY_DISEASE_SHORT[d.key])}`}
                    />
                  </td>
                ))}
              </tr>
            ))
          ),
        )}
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Riwayat vaksinasi                                                   */
/* ------------------------------------------------------------------ */

const VAK_YA: Opt = { v: 'ya', l: 'Ya, pada tahun (_Yes, in_)', detail: { type: 'number', width: 'xs', placeholder: 'tahun' } }
const VAK_TIDAK: Opt = { v: 'tidak', l: 'Tidak (_No_)' }
const VAK_LUPA: Opt = { v: 'tidak_ingat', l: 'Tidak ingat' }

function VaccineTable() {
  const wide = useIsWide()
  const { s } = useForm()
  if (!wide)
    return (
      <Stack head="Vaksin (_Vaccine_) — Ya/Tidak (_Yes/No_)">
        {VACCINES.map((r) => (
          <Block key={r.key} title={r.l}>
            <div className="flex flex-col gap-0.5">
              <RadioCell name={`vak_${r.key}`} opt={VAK_YA} detail label={plain(r.l)} />
              <div className="flex flex-wrap gap-x-8">
                <RadioCell name={`vak_${r.key}`} opt={VAK_TIDAK} label={plain(r.l)} />
                <RadioCell name={`vak_${r.key}`} opt={VAK_LUPA} label={plain(r.l)} />
              </div>
            </div>
            {r.nameField && <PmhOtherName k={`vak_${r.key}_nama`} show={s[`vak_${r.key}`] === 'ya'} />}
          </Block>
        ))}
      </Stack>
    )
  return (
    <table className="doc-table">
      <colgroup>
        <col className="w-[26%]" />
        <col className="w-[36%]" />
        <col className="w-[19%]" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <Th>
            <Bi t="Vaksin (_Vaccine_)" />
          </Th>
          <Th colSpan={2}>
            <Bi t="Ya/Tidak (_Yes/No_)" />
          </Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {VACCINES.map((r) => (
          <tr key={r.key}>
            <td>
              <Bi t={r.l} />
              {r.nameField && <PmhOtherName k={`vak_${r.key}_nama`} show={s[`vak_${r.key}`] === 'ya'} />}
            </td>
            <td>
              <RadioCell name={`vak_${r.key}`} opt={VAK_YA} detail label={plain(r.l)} />
            </td>
            <td>
              <RadioCell name={`vak_${r.key}`} opt={VAK_TIDAK} label={plain(r.l)} />
            </td>
            <td>
              <RadioCell name={`vak_${r.key}`} opt={VAK_LUPA} label={plain(r.l)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Waktu makan & frekuensi                                             */
/* ------------------------------------------------------------------ */

/** "Sebelum 06:00\n_Before 06:00_" → "Sebelum 06:00 (_Before 06:00_)", matching the other options on phones */
const oneLine = (l: string) => l.replace(/\n(_[^_]+_)/, ' ($1)').replace(/\n/g, ' ')

function MealsTable() {
  const wide = useIsWide()
  if (!wide)
    return (
      <div className="flex flex-col gap-4">
        {MEALS.map((m) => (
          <div key={m.key} className="doc-stack">
            <div className="doc-stack-head">
              <Bi t={m.l.replace(/\n/g, ' / ')} />
            </div>
            <div className="flex flex-col gap-3 px-3.5 py-3">
              <div>
                <div className="mb-1 text-ink-2">
                  <Bi t="Teratur _Regular_" />
                </div>
                <OptionGrid name={`meal_${m.key}_teratur`} type="radio" opts={MEAL_REGULAR} inline groupLabel={`${plain(m.l)} – Teratur`} />
              </div>
              <div>
                <div className="mb-1 text-ink-2">
                  <Bi t="Jadwal _Schedule_" />
                </div>
                <OptionGrid name={`meal_${m.key}_jadwal`} type="radio" opts={m.schedule.map((o) => ({ ...o, l: oneLine(o.l) }))} groupLabel={`${plain(m.l)} – Jadwal`} />
              </div>
              <div>
                <div className="mb-1.5 text-ink-2">
                  <Bi t="Jenis Makanan (Mohon dijelaskan) _Type of Food (Please note specifically)_" />
                </div>
                <TextArea k={`meal_${m.key}_jenis`} rows={2} label={`${plain(m.l)} – Jenis makanan`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  return (
    <table className="doc-table">
      <colgroup>
        <col className="w-[20%]" />
        <col className="w-[15%]" />
        <col className="w-[33%]" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <Th />
          <Th>
            <Bi t={"Teratur\n_Regular_"} />
          </Th>
          <Th>
            <Bi t={"Jadwal\n_Schedule_"} />
          </Th>
          <Th>
            <Bi t={"Jenis Makanan\n(Mohon dijelaskan)\n_Type of Food (Please note specifically)_"} />
          </Th>
        </tr>
      </thead>
      <tbody>
        {MEALS.map((m) => (
          <tr key={m.key}>
            <td>
              <Bi t={m.l} />
            </td>
            <td>
              <OptionGrid name={`meal_${m.key}_teratur`} type="radio" opts={MEAL_REGULAR} groupLabel={`${plain(m.l)} – Teratur`} />
            </td>
            <td>
              <OptionGrid name={`meal_${m.key}_jadwal`} type="radio" opts={m.schedule} groupLabel={`${plain(m.l)} – Jadwal`} />
            </td>
            <td>
              <TextArea k={`meal_${m.key}_jenis`} rows={5} label={`${plain(m.l)} – Jenis makanan`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Kualitas makanan dan pilihan                                        */
/* ------------------------------------------------------------------ */

function FoodQualityTable() {
  const wide = useIsWide()
  if (!wide)
    return (
      <Stack head="Jenis Makanan (_Food type_)">
        {FOOD_QUALITY.map((r) => (
          <Block key={r.key} title={r.l}>
            {/* labels kept to the same two lines and inputs pinned to the bottom, so both fields line up */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="mb-1 block t-small text-ink-2">
                  <Bi t={"Frekuensi (kali/minggu)\n_Frequency (times/week)_"} />
                </span>
                <span className="mt-auto">
                  <TextInput k={`fq_${r.key}_frek`} label={`${plain(r.l)} – Frekuensi (kali/minggu)`} />
                </span>
              </label>
              <label className="flex flex-col">
                <span className="mb-1 block t-small text-ink-2">
                  <Bi t={"Porsi/gram\n_Portion/gram_"} />
                </span>
                <span className="mt-auto">
                  <TextInput k={`fq_${r.key}_porsi`} label={`${plain(r.l)} – Porsi/gram`} />
                </span>
              </label>
            </div>
          </Block>
        ))}
      </Stack>
    )
  return (
    <table className="doc-table">
      <colgroup>
        <col className="w-[48%]" />
        <col className="w-[30%]" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <Th>
            <Bi t={"Jenis Makanan\n_Food type_"} />
          </Th>
          <Th>
            <Bi t={"Frekuensi (Mohon ditulis berapa kali/minggu)\n_Frequency (Please note how many times/week)_"} />
          </Th>
          <Th>
            <Bi t={"Porsi/gram\n_Portion/gram_"} />
          </Th>
        </tr>
      </thead>
      <tbody>
        {FOOD_QUALITY.map((r) => (
          <tr key={r.key}>
            <td>
              <Bi t={r.l} />
            </td>
            <td className="!p-1.5">
              <TextInput k={`fq_${r.key}_frek`} variant="cell" label={`${plain(r.l)} – Frekuensi`} />
            </td>
            <td className="!p-1.5">
              <TextInput k={`fq_${r.key}_porsi`} variant="cell" label={`${plain(r.l)} – Porsi/gram`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Minum                                                               */
/* ------------------------------------------------------------------ */

function DrinksTable() {
  const wide = useIsWide()
  return (
    <table className="doc-table">
      <colgroup>
        <col className={wide ? 'w-[32%]' : 'w-[38%]'} />
        <col />
      </colgroup>
      <thead>
        <tr>
          <Th>
            <Bi t={"Minuman\n_Type of drink_"} />
          </Th>
          <Th>
            <Bi t={"Jumlah / Hari (Mohon dituliskan dalam gelas/liter/mililiter)\n_Quantity per day (Please note in cups/litres/millilitres)_"} />
          </Th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Bi t="Air Putih (_Plain water_)" />
          </td>
          <td>
            <OptionGrid name="drink_air" type="radio" opts={WATER_OPTS} inline groupLabel="Air Putih" />
          </td>
        </tr>
        {(
          [
            ['kopi', 'Kopi (_Coffee_)'],
            ['teh', 'Teh (_Tea_)'],
          ] as const
        ).map(([k, l]) => (
          <tr key={k}>
            <td>
              <Bi t={l} />
            </td>
            <td>
              <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <TextInput k={`drink_${k}`} type="number" variant="line" width="xs" center label={`${plain(l)} – gelas/hari`} />
                <Bi t="Gelas/hari (_Cup/day_)" />
              </span>
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <Bi t={"Minuman ringan\n_Soft drinks_"} />
          </td>
          <td>
            <TextInput k="drink_soft" variant="line" label="Minuman ringan (Soft drinks)" placeholder="jenis dan jumlah per hari" />
          </td>
        </tr>
        <tr>
          <td>
            <Bi t="Alkohol (_Alcohol_)" />
          </td>
          <td>
            <OptionGrid
              name="drink_alkohol"
              type="radio"
              inline
              groupLabel="Alkohol"
              opts={[
                { v: 'ya', l: 'Ya (_Yes_),', detail: { suffix: 'cc', type: 'number', width: 'xs' } },
                { v: 'tidak', l: 'Tidak (_No_)' },
              ]}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

/* ------------------------------------------------------------------ */
/* Obat & Suplemen                                                     */
/* ------------------------------------------------------------------ */

function MedsList() {
  return (
    <ol className="flex flex-col gap-2.5">
      {Array.from({ length: MED_ROWS }, (_, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-2.5 select-none" aria-hidden="true">
            •
          </span>
          <div className="grid flex-1 grid-cols-1 items-center gap-x-3 gap-y-1.5 sm:grid-cols-[1fr_auto_1fr]">
            <TextInput k={`med_${i}_nama`} variant="line" placeholder="Nama obat / suplemen" label={`Obat & suplemen ${i + 1} – nama`} />
            {/* inline ", dosis" between the two fields on wide screens; a small label above the dose field on phones */}
            <span className="text-[13px] leading-[19px] whitespace-nowrap text-ink-2 sm:text-[17px] sm:leading-6 sm:text-ink">
              <span className="hidden sm:inline">, </span>
              <Bi t="Dosis (_dose_)" className="sm:hidden" />
              <Bi t="dosis (_dose_)" className="hidden sm:inline" />
            </span>
            <TextInput k={`med_${i}_dosis`} variant="line" placeholder="mis. 500 mg, 2x sehari" label={`Obat & suplemen ${i + 1} – dosis`} />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function DocTable({ kind }: { kind: TableKind }) {
  switch (kind) {
    case 'pmh':
      return <PmhTable />
    case 'family':
      return <FamilyTable />
    case 'vaccine':
      return <VaccineTable />
    case 'meals':
      return <MealsTable />
    case 'foodq':
      return <FoodQualityTable />
    case 'drinks':
      return <DrinksTable />
    case 'meds':
      return <MedsList />
  }
}
