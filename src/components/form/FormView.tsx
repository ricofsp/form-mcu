import { GENDER_OPTS, IDENTITY, RELATION_OPTS, SECTIONS, plain } from '../../data/schema'
import { useForm } from '../../state/store'
import type { Node, Section } from '../../types'
import { Signature } from './Signature'
import { DocTable } from './DocTable'
import { Bi, ErrorNote, OptionGrid, QLabel, ReqMark, Select, TextArea, TextInput } from '../ui'

/* ------------------------------------------------------------------ */
/* Identity table (label left, input right — like the Word table)      */
/* ------------------------------------------------------------------ */

function IdentityTable() {
  return (
    <div className="identity" role="group" aria-label="Identitas pasien">
      {IDENTITY.map((r) => {
        const label = plain(r.l)
        return (
          <div key={r.key} id={`f-${r.key}`} className="identity-row">
            <div className="identity-label">
              {r.type === 'gender' || r.type === 'emergency' ? (
                <span>
                  <Bi t={r.l} />
                  {r.req && <ReqMark />}
                </span>
              ) : (
                <label htmlFor={`i-${r.key}`}>
                  <Bi t={r.l} />
                  {r.req && <ReqMark />}
                </label>
              )}
            </div>
            <div className="identity-input">
              {r.type === 'gender' ? (
                <OptionGrid name={r.key} type="radio" opts={GENDER_OPTS} inline groupLabel={label} />
              ) : r.type === 'textarea' ? (
                <TextArea k={r.key} rows={2} label={label} required={r.req} />
              ) : r.type === 'select' ? (
                <Select k={r.key} opts={r.opts ?? []} label={label} required={r.req} />
              ) : r.type === 'emergency' ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <TextInput k="kontak_darurat_nama" label="Kontak darurat – nama" placeholder="Nama lengkap" />
                  </div>
                  <Select k="kontak_darurat_hubungan" opts={RELATION_OPTS} label="Kontak darurat – hubungan" placeholder="Hubungan…" />
                  <TextInput k="kontak_darurat_telp" type="tel" inputMode="tel" label="Kontak darurat – nomor telepon" placeholder="No. telepon" />
                </div>
              ) : (
                <TextInput
                  k={r.key}
                  type={r.type as 'text' | 'date' | 'tel' | 'email'}
                  inputMode={r.type === 'tel' ? 'tel' : r.type === 'email' ? 'email' : undefined}
                  label={label}
                  required={r.req}
                  placeholder={r.placeholder}
                  width={r.type === 'date' ? 'md' : 'full'}
                />
              )}
              <ErrorNote k={r.key} required={r.req} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Persetujuan medis                                                   */
/* ------------------------------------------------------------------ */

function Consent() {
  const { s, set } = useForm()
  const agreed = s.consent_setuju === 'ya'
  return (
    <div>
      <ol className="ml-6 list-decimal space-y-2.5 leading-relaxed">
        <li>
          Saya menyatakan bahwa pernyataan yang saya tulis/sebutkan di atas adalah benar. Saya bersedia menerima risiko apabila
          pernyataan tersebut tidak benar. (I declare that the statement I wrote/mentioned above is true. I am willing to accept the risk
          if the statement is not true.)
        </li>
        <li>
          Saya memahami bahwa dalam prosedur untuk pemeriksaan kesehatan ini memiliki <strong>risiko medis</strong> dan saya{' '}
          <strong>setuju</strong> untuk melakukan prosedur ini. (I understand that this health examination procedure has medical risks and
          I agree to undergo this procedure.)
        </li>
        <li>Dengan menandatangani, saya menyatakan setuju dengan lembar persetujuan medis ini. (By signing, I agree to this medical consent form.)</li>
      </ol>

      <div id="f-consent_setuju" className="mt-5">
        <label htmlFor="i-consent_setuju" className={`choice consent-check ${agreed ? 'is-checked' : ''}`}>
          <input
            id="i-consent_setuju"
            type="checkbox"
            className="choice-input"
            checked={agreed}
            onChange={() => set('consent_setuju', agreed ? undefined : 'ya')}
          />
          <span>
            Saya telah membaca dan menyetujui pernyataan di atas. (<em>I have read and agree to the statements above.</em>)
            <ReqMark />
          </span>
        </label>
        <ErrorNote k="consent_setuju" required />
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-3">
        <div id="f-consent_tempat" className="min-w-0 flex-1 basis-48">
          <label htmlFor="i-consent_tempat" className="mb-1 block t-small text-ink-2">
            Tempat <ReqMark />
          </label>
          <TextInput k="consent_tempat" variant="line" label="Tempat" required />
        </div>
        <span className="hidden pb-2 sm:inline">,</span>
        <div id="f-consent_tanggal" className="flex-1 basis-48">
          <label htmlFor="i-consent_tanggal" className="mb-1 block t-small text-ink-2">
            Tanggal <ReqMark />
          </label>
          <TextInput k="consent_tanggal" type="date" variant="line" label="Tanggal" required />
        </div>
        <div className="flex items-end gap-2">
          <label htmlFor="i-consent_pukul" className="whitespace-nowrap pb-2">
            Pukul (Time) :
          </label>
          <TextInput k="consent_pukul" type="time" variant="line" width="sm" label="Pukul (Time)" />
        </div>
      </div>
      <ErrorNote k="consent_tempat" required />
      <ErrorNote k="consent_tanggal" required />

      {/* Two signature columns share row tracks (subgrid) so the titles, boxes and name lines line up */}
      <div className="sig-block mt-8 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
        <div className="row-span-3 mb-6 grid grid-rows-subgrid md:mb-0">
          <div>
            <p>Yang memberikan keterangan,</p>
            <p className="en">Person who provides information</p>
          </div>
          <div id="f-consent_ttd">
            <Signature k="consent_ttd" required />
            <ErrorNote k="consent_ttd" required />
          </div>
          <div id="f-consent_nama">
            <div className="flex items-center gap-1.5">
              <span aria-hidden="true">(</span>
              <TextInput k="consent_nama" variant="line" center label="Nama yang memberikan keterangan" placeholder="Nama lengkap" required />
              <span aria-hidden="true">)</span>
            </div>
            <ErrorNote k="consent_nama" required />
          </div>
        </div>
        <div className="row-span-3 grid grid-rows-subgrid">
          <div>
            <p>Diperiksa kembali oleh petugas MCU (dokter/perawat)</p>
            <p className="en">Re-checked by MCU officer (doctor/nurse)</p>
          </div>
          <div>
            <div className="officer-box">Diisi oleh petugas MCU</div>
            <div className="mt-1 flex min-h-[29px] items-center t-small text-ink-2">Tanda tangan petugas MCU</div>
          </div>
          <div className="flex items-center gap-1.5 self-start text-ink-2">
            <span aria-hidden="true">(</span>
            <span className="officer-line">&nbsp;</span>
            <span aria-hidden="true">)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Node renderer                                                       */
/* ------------------------------------------------------------------ */

function RenderNode({ n }: { n: Node }) {
  switch (n.t) {
    case 'h2':
      return (
        <h3 className="sub-title">
          {n.marker && (
            <span className="mr-2.5 text-brand" aria-hidden="true">
              ▪
            </span>
          )}
          <Bi t={n.l} />
          {n.badge && (
            <span className={`ml-2 ${n.badgeTone === 'red' ? 'text-danger' : 'text-ink-2'}`}>
              <Bi t={n.badge} />
            </span>
          )}
        </h3>
      )
    case 'label':
      return (
        <div className="sub-title">
          <Bi t={n.l} />
        </div>
      )
    case 'p':
      return (
        <div className="mb-4 leading-relaxed text-ink-2">
          <p>{n.l}</p>
          <p className="en">{n.en}</p>
        </div>
      )
    case 'identity':
      return <IdentityTable />
    case 'consent':
      return <Consent />
    case 'table':
      return (
        <div id={`t-${n.kind}`} className="my-3">
          <DocTable kind={n.kind} />
        </div>
      )
    case 'radio':
    case 'check': {
      const label = n.l ? plain(n.l) : n.key
      const type = n.t === 'radio' ? 'radio' : 'checkbox'
      const req = n.t === 'radio' ? n.req : false
      if (n.t === 'radio' && n.row)
        return (
          <div id={`f-${n.key}`} className={`q-row ${n.bullet ? 'pl-0' : ''}`}>
            <div className="min-w-0 flex-1 basis-80">
              <QLabel l={n.l ?? ''} bullet={n.bullet} req={req} />
            </div>
            <div className={`max-w-full md:shrink-0 ${n.bullet ? 'pl-5 md:pl-0' : ''}`}>
              <OptionGrid name={n.key} type={type} opts={n.opts} inline groupLabel={label} />
            </div>
          </div>
        )
      return (
        <div id={`f-${n.key}`} className={n.l ? 'q' : 'mt-1'}>
          {n.l && <QLabel l={n.l} style={n.t === 'radio' ? n.labelStyle : 'plain'} bullet={n.bullet} req={req} />}
          <div className={`mt-1 ${n.t === 'radio' && n.labelStyle === 'bold' ? 'pl-5' : 'pl-5 md:pl-7'}`}>
            <OptionGrid
              name={n.key}
              type={type}
              opts={n.opts}
              cols={n.cols}
              colMajor={n.t === 'radio' ? n.colMajor : false}
              groupLabel={label}
            />
          </div>
          <ErrorNote k={n.key} required={req} />
        </div>
      )
    }
    case 'field': {
      const label = plain(n.l)
      if (n.type === 'textarea')
        return (
          <div id={`f-${n.key}`} className="q">
            <QLabel l={n.l} style={n.labelStyle} req={n.req} bullet={n.bullet} htmlFor={`i-${n.key}`} />
            <div className={`mt-2 ${n.labelStyle === 'marker' ? 'pl-6' : ''}`}>
              <TextArea k={n.key} label={label} required={n.req} rows={3} />
              <ErrorNote k={n.key} required={n.req} />
            </div>
          </div>
        )
      return (
        <div id={`f-${n.key}`} className="q-inline">
          <QLabel l={n.l} style={n.labelStyle} req={n.req} bullet={n.bullet} htmlFor={`i-${n.key}`} />
          <span className={`inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 ${n.bullet ? 'pl-5 sm:pl-0' : ''}`}>
            <TextInput
              k={n.key}
              type={n.type}
              variant="line"
              width={n.width ?? (n.type === 'date' ? 'md' : 'sm')}
              center={n.type === 'number'}
              label={label}
              required={n.req}
              placeholder={n.placeholder}
            />
            {n.suffix && <Bi t={n.suffix} />}
          </span>
          <ErrorNote k={n.key} required={n.req} />
        </div>
      )
    }
  }
}

function SectionView({ sec }: { sec: Section }) {
  const { s } = useForm()
  if (sec.show && !sec.show(s)) {
    if (sec.id === 'menstruasi' && !s.jenis_kelamin)
      return (
        <p className="mt-6 bg-desk px-4 py-3 t-small text-ink-2">
          Bagian <strong>Riwayat Menstruasi dan Kehamilan</strong> akan tampil di sini bila Jenis Kelamin diisi <strong>Perempuan</strong>.
        </p>
      )
    return null
  }
  return (
    <section id={`s-${sec.id}`} aria-label={plain(sec.title)}>
      {sec.heading && (
        <h2 className="sec-title">
          <span className="block">
            <Bi t={sec.heading.l} />
          </span>
          {sec.heading.en && (
            <span className="en t-sub block">
              <Bi t={sec.heading.en} />
            </span>
          )}
        </h2>
      )}
      {sec.nodes.map((n, i) => (
        <RenderNode key={i} n={n} />
      ))}
    </section>
  )
}

export function FormBody() {
  return (
    <>
      {SECTIONS.map((sec) => (
        <SectionView key={sec.id} sec={sec} />
      ))}
    </>
  )
}
