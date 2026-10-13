import { useMemo, useState } from 'react'
import { useForm, str } from '../../state/store'
import { buildSummary, missingRequired } from '../../lib/summary'

export function Review({
  onBack,
  onJump,
  onSubmit,
  onPrint,
}: {
  onBack: () => void
  onJump: (anchor: string) => void
  onSubmit: () => void
  /** prints the filled-in form (tables included), not this summary */
  onPrint: () => void
}) {
  const { s } = useForm()
  const sections = useMemo(() => buildSummary(s), [s])
  const missing = useMemo(() => missingRequired(s), [s])
  const [onlyFilled, setOnlyFilled] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [sending, setSending] = useState(false)
  const answered = sections.reduce((a, x) => a + x.answered, 0)
  const total = sections.reduce((a, x) => a + x.total, 0)

  const send = () => {
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setConfirm(false)
      onSubmit()
    }, 900)
  }

  return (
    <div>
      <h1 className="t-title text-center">Ringkasan Jawaban</h1>
      <p className="en t-sub text-center">Answer Summary</p>
      <p className="mt-4 text-center text-ink-2">
        {str(s.nama) || 'Nama belum diisi'} · Tanggal MCU: {str(s.tgl_mcu) ? str(s.tgl_mcu).split('-').reverse().join('/') : '—'}
      </p>

      {missing.length > 0 ? (
        <div className="status-box is-error mt-6" role="alert">
          <p className="t-sub">Masih ada {missing.length} isian wajib yang belum diisi:</p>
          <ul className="mt-2 space-y-1">
            {missing.map((m) => (
              <li key={m.key} className="flex flex-wrap items-baseline gap-x-3">
                <span>• {m.label}</span>
                <button type="button" className="btn-link" onClick={() => onJump(m.anchor)}>
                  Isi sekarang
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="status-box is-ok mt-6">
          <p className="t-sub">Semua isian wajib sudah terisi.</p>
          <p className="mt-1">Periksa kembali jawaban di bawah ini sebelum mengirim.</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <p className="text-ink-2">
          {answered} dari {total} pertanyaan terisi
        </p>
        <label className="choice !min-h-0 !py-1.5">
          <input type="checkbox" className="choice-input" checked={onlyFilled} onChange={() => setOnlyFilled(!onlyFilled)} />
          <span>Tampilkan hanya yang sudah diisi</span>
        </label>
      </div>

      {sections.map((sec) => {
        const rows = onlyFilled ? sec.rows.filter((r) => r.kind === 'sub' || r.answered) : sec.rows
        return (
          <section key={sec.id} className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-brand pb-1.5">
              <h2 className="t-section text-brand">{sec.title}</h2>
              <div className="flex items-center gap-4 t-small">
                <span className="text-ink-2">
                  {sec.answered}/{sec.total} terisi
                </span>
                <button type="button" className="btn-link no-print" onClick={() => onJump(`s-${sec.id}`)}>
                  Ubah
                </button>
              </div>
            </div>
            <table className="sum-table">
              <tbody>
                {rows.map((r, i) =>
                  r.kind === 'sub' ? (
                    <tr key={i} className="sum-sub">
                      <td colSpan={2}>{r.label}</td>
                    </tr>
                  ) : (
                    <tr key={i}>
                      <th scope="row">{r.label}</th>
                      <td>
                        {r.image ? (
                          <img src={r.image} alt="Tanda tangan" className="h-16 rounded-md border border-line bg-white" />
                        ) : r.answered ? (
                          <span className="whitespace-pre-line">{r.value}</span>
                        ) : (
                          <span className="text-ink-2">— belum diisi</span>
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </section>
        )
      })}

      <div className="no-print mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <button type="button" className="btn btn-outline" onClick={onBack}>
          ← Ubah Jawaban
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-outline" onClick={onPrint}>
            Cetak Formulir
          </button>
          <button type="button" className="btn btn-primary" disabled={missing.length > 0} onClick={() => setConfirm(true)}>
            Konfirmasi &amp; Kirim
          </button>
        </div>
      </div>
      {missing.length > 0 && <p className="no-print mt-3 text-right t-small text-danger">Lengkapi isian wajib untuk dapat mengirim.</p>}

      {confirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="modal">
            <h2 id="confirm-title" className="t-section text-brand">
              Kirim formulir?
            </h2>
            <p className="mt-3">Pastikan semua jawaban sudah benar. Setelah dikirim, petugas MCU akan memeriksa kembali jawaban Anda.</p>
            <p className="mt-2 t-small text-ink-2">Prototype: tidak ada data yang benar-benar dikirim atau disimpan.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" className="btn btn-outline" onClick={() => setConfirm(false)} disabled={sending}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={send} disabled={sending} autoFocus>
                {sending ? 'Mengirim…' : 'Ya, Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
