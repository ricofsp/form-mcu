import { useEffect, useRef } from "react";
import { dummyData } from "../../data/dummy";
import { HOSPITALS, type Hospital } from "../../data/hospitals";
import { useForm } from "../../state/store";

/** Sticky top bar with the hospital picker and prototype helpers (fill sample data / clear the form). */
export function PrototypeBar({
  hospital,
  onHospital,
}: {
  hospital: Hospital;
  onHospital: (code: string) => void;
}) {
  const { replaceAll, setShowErrors } = useForm();
  const ref = useRef<HTMLDivElement>(null);
  // Publish the bar's height (it wraps on narrow screens) so sticky/scroll offsets can clear it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      document.documentElement.style.setProperty(
        "--bar-h",
        `${el.offsetHeight}px`,
      ),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="no-print sticky top-0 z-40 border-b border-line bg-white"
    >
      <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 t-small">
        <span className="flex items-center gap-3 text-ink-2">
          {/* hidden on phones so the picker and links still fit on one line */}
          <strong className="hidden text-ink sm:inline">Prototype</strong>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Rumah Sakit</span>
            <select
              className="inp inp-select bar-select"
              value={hospital.code}
              onChange={(e) => onHospital(e.target.value)}
              aria-label="Pilih rumah sakit"
            >
              {HOSPITALS.map((h) => (
                <option key={h.code} value={h.code} title={h.name}>
                  {h.code}
                </option>
              ))}
            </select>
          </label>
        </span>
        <span className="flex items-center gap-4">
          <button
            type="button"
            className="btn-link"
            onClick={() => replaceAll(dummyData())}
          >
            Isi data contoh
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              replaceAll({});
              setShowErrors(false);
            }}
          >
            Kosongkan formulir
          </button>
        </span>
      </div>
    </div>
  );
}
