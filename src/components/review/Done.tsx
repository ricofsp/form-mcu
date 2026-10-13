import { str, useForm } from '../../state/store'

/** Confirmation screen shown after the (simulated) submission. */
export function Done({ refNo, sentAt, onSummary, onNew }: { refNo: string; sentAt: Date; onSummary: () => void; onNew: () => void }) {
  const { s } = useForm()
  return (
    <div className="py-6 text-center">
      <h1 className="t-title text-brand">Formulir Berhasil Dikirim</h1>
      <p className="en t-sub">Form submitted successfully</p>
      <table className="sum-table mx-auto mt-8 max-w-md text-left">
        <tbody>
          <tr>
            <th scope="row">Nomor referensi</th>
            <td>{refNo}</td>
          </tr>
          <tr>
            <th scope="row">Nama</th>
            <td>{str(s.nama) || '—'}</td>
          </tr>
          <tr>
            <th scope="row">Waktu kirim</th>
            <td>{sentAt.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</td>
          </tr>
        </tbody>
      </table>
      <p className="mx-auto mt-6 max-w-lg">Terima kasih. Jawaban Anda akan diperiksa kembali oleh petugas MCU (dokter/perawat).</p>
      <p className="mx-auto mt-2 max-w-lg t-small text-ink-2">Ini adalah simulasi prototype — tidak ada data yang dikirim ke server.</p>
      <div className="no-print mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" className="btn btn-outline" onClick={onSummary}>
          Lihat Ringkasan Jawaban
        </button>
        <button type="button" className="btn btn-primary" onClick={onNew}>
          Isi Formulir Baru
        </button>
      </div>
    </div>
  )
}
