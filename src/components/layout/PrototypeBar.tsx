import { useEffect, useRef } from "react";
import { dummyData } from "../../data/dummy";
import { useForm } from "../../state/store";

/** Sticky top bar with prototype helpers (fill sample data / clear the form). */
export function PrototypeBar() {
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
        <span className="text-ink-2">
          <strong className="text-ink">Prototype</strong>
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
