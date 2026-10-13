/** Letterhead at the top of the sheet: hospital logo on the left, form name on the right (on phones too). */
export function SheetHeader() {
  return (
    <header className="flex items-center justify-between gap-4 pb-2 sm:gap-8">
      <img
        src="/logo.png"
        alt="Primaya Hospital"
        width={2575}
        height={650}
        className="h-8 w-auto shrink-0 sm:h-12"
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
