import { useEffect, useState } from "react";

/** How far (px) from the top/bottom before each button appears. */
const EDGE = 600;
/** Both buttons hide this close to the bottom, where they would cover the footer
 *  (the form has its own "Kembali ke Atas" button there). */
const FOOTER_ZONE = 160;

/** Floating "scroll to top" / "scroll to bottom" buttons, stacked at the bottom-right. */
export function ScrollButtons() {
  const [state, setState] = useState({ up: false, down: false });
  useEffect(() => {
    const on = () => {
      const fromBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      const nearFooter = fromBottom < FOOTER_ZONE;
      setState({
        up: window.scrollY > EDGE && !nearFooter,
        down: fromBottom > EDGE,
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  if (!state.up && !state.down) return null;
  return (
    <div className="scroll-nav no-print">
      {state.up && (
        <button
          type="button"
          className="scroll-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Ke atas"
          title="Ke atas"
        >
          <Arrow dir="up" />
        </button>
      )}
      {state.down && (
        <button
          type="button"
          className="scroll-btn"
          onClick={() =>
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            })
          }
          aria-label="Ke bawah"
          title="Ke bawah"
        >
          <Arrow dir="down" />
        </button>
      )}
    </div>
  );
}

function Arrow({ dir }: { dir: "up" | "down" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={dir === "down" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M12 19V5" />
      <path d="M5.5 11.5 12 5l6.5 6.5" />
    </svg>
  );
}
