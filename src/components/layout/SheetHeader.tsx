import type { Hospital } from "../../data/hospitals";

/** Letterhead at the top of the sheet: hospital logo on the left, form name on the right (on phones too). */
export function SheetHeader({ hospital }: { hospital: Hospital }) {
  // stacked logos (name under the group mark) need more height to stay legible
  const stacked = hospital.width / hospital.height < 3;
  return (
    <header className="flex items-center justify-between gap-4 pb-2 sm:gap-8">
      <img
        key={hospital.code}
        src={hospital.logo}
        alt={hospital.name}
        width={hospital.width}
        height={hospital.height}
        className={`w-auto max-w-[45%] shrink-0 object-contain object-left ${stacked ? "h-12 sm:h-[72px]" : "h-8 sm:h-12"}`}
      />
      <div className="min-w-0 text-right">
        <div className="text-[15px] leading-5 font-bold tracking-[0.02em] text-brand uppercase sm:text-[26px] sm:leading-8">
          Form Pengkajian MCU
        </div>
        <div className="en text-[12px] leading-4 text-ink-2 sm:text-[15px] sm:leading-[22px]">
          Medical Check Up Assessment Form
        </div>
      </div>
    </header>
  );
}
