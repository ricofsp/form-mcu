import { useState } from "react";
import { FormBody } from "./components/form/FormView";
import { ScrollButtons } from "./components/layout/ScrollButtons";
import { PrototypeBar } from "./components/layout/PrototypeBar";
import { SheetHeader } from "./components/layout/SheetHeader";
import { SiteFooter } from "./components/layout/SiteFooter";
import { DEFAULT_HOSPITAL, findHospital } from "./data/hospitals";
import { Done } from "./components/review/Done";
import { Review } from "./components/review/Review";
import { FormProvider, useForm } from "./state/store";

type View = "form" | "review" | "done";

function scrollToAnchor(anchor: string) {
  requestAnimationFrame(() => {
    const el = document.getElementById(anchor);
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      block: anchor.startsWith("s-") ? "start" : "center",
    });
    const focusable = el.querySelector<HTMLElement>(
      "input:not([type=hidden]), textarea, canvas",
    );
    focusable?.focus({ preventScroll: true });
  });
}

function Shell() {
  const { setShowErrors, replaceAll } = useForm();
  const [view, setView] = useState<View>("form");
  const [done, setDone] = useState<{ ref: string; at: Date } | null>(null);
  // `?rs=PHBW` opens the form for a specific hospital; defaults to the group logo
  const [hospital, setHospital] = useState(() =>
    findHospital(new URLSearchParams(window.location.search).get("rs")),
  );

  const pickHospital = (code: string) => {
    const h = findHospital(code);
    setHospital(h);
    const url = new URL(window.location.href);
    if (h === DEFAULT_HOSPITAL) url.searchParams.delete("rs");
    else url.searchParams.set("rs", h.code);
    window.history.replaceState(null, "", url);
  };

  const go = (v: View, anchor?: string) => {
    setView(v);
    if (anchor) scrollToAnchor(anchor);
    else requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  // Print the filled-in form (with its tables) rather than the summary list,
  // then return to wherever the user was.
  const printForm = () => {
    const back = view;
    const y = window.scrollY;
    setView("form");
    // let the form render and the signature image load before the print snapshot
    window.setTimeout(() => {
      window.addEventListener(
        "afterprint",
        () => {
          setView(back);
          requestAnimationFrame(() => window.scrollTo({ top: y }));
        },
        { once: true },
      );
      window.print();
    }, 250);
  };

  return (
    <>
      <PrototypeBar hospital={hospital} onHospital={pickHospital} />
      <main className="sheet">
        <SheetHeader hospital={hospital} />

        {view === "form" && (
          <>
            {/* the visible form name lives in the letterhead */}
            <h1 className="sr-only">Form Pengkajian MCU</h1>
            <p className="no-print mt-6 mb-4 rounded-lg bg-desk px-4 py-2.5 t-small text-ink-2">
              Form ini membantu dokter MCU untuk memahami kondisi kesehatan Anda secara menyeluruh. Mohon isi
              dengan jujur dan sesuai kondisi Anda saat ini. Seluruh informasi jawaban akan bersifat rahasia dan
              hanya digunakan untuk kepentingan medis. Waktu pengisian berkisar 20–30 menit.
            </p>
            <FormBody />
            <div className="no-print mt-12 border-t-2 border-brand pt-6">
              <p className="mb-4 text-ink-2">
                Sudah selesai? Periksa kembali jawaban Anda sebelum mengirim.
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  ↑ Kembali ke Atas
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowErrors(true);
                    go("review");
                  }}
                >
                  Periksa Jawaban
                </button>
              </div>
            </div>
          </>
        )}

        {view === "review" && (
          <div className="mt-8">
            <Review
              onBack={() => go("form")}
              onJump={(a) => go("form", a)}
              onPrint={printForm}
              onSubmit={() => {
                const d = new Date();
                const p = (n: number) => String(n).padStart(2, "0");
                setDone({
                  ref: `MCU-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${String(Math.floor(1000 + Math.random() * 9000))}`,
                  at: d,
                });
                go("done");
              }}
            />
          </div>
        )}

        {view === "done" && done && (
          <Done
            refNo={done.ref}
            sentAt={done.at}
            onSummary={() => go("review")}
            onNew={() => {
              replaceAll({});
              setShowErrors(false);
              setDone(null);
              go("form");
            }}
          />
        )}
        <SiteFooter />
      </main>
      <ScrollButtons />
    </>
  );
}

export default function App() {
  return (
    <FormProvider>
      <Shell />
    </FormProvider>
  );
}
