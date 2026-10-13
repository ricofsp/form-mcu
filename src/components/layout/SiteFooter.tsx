import type { ReactNode } from "react";

const WEBSITE = "https://www.primayahospital.com";
const HANDLE = "primayahospital";
const SOCIALS: { name: string; href: string; icon: ReactNode }[] = [
  {
    name: "Facebook",
    href: `https://www.facebook.com/${HANDLE}`,
    icon: <path d="M15.5 7h-1.8A2.7 2.7 0 0 0 11 9.7v11.8M8.5 12.5h6" />,
  },
  {
    name: "Instagram",
    href: `https://www.instagram.com/${HANDLE}`,
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    name: "TikTok",
    href: `https://www.tiktok.com/@${HANDLE}`,
    icon: <path d="M13.5 6v8.5a3 3 0 1 1-3-3M13.5 6c.4 1.9 1.7 3 3.5 3.2" />,
  },
];

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Brand band along the bottom edge of the sheet with the hospital's website and social accounts. */
export function SiteFooter() {
  return (
    <footer className="site-footer no-print">
      <div className="flex items-center gap-4 py-2 sm:gap-7">
        <a
          className="site-footer-link"
          href={WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg {...ICON_PROPS}>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
          </svg>
          www.primayahospital.com
        </a>
        <div className="flex items-center gap-1.5">
          <span className="flex items-center">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                className="site-footer-icon"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name} ${HANDLE}`}
                title={s.name}
              >
                <svg {...ICON_PROPS}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  {s.icon}
                </svg>
              </a>
            ))}
          </span>
          <span className="whitespace-nowrap">{HANDLE}</span>
        </div>
      </div>
    </footer>
  );
}
