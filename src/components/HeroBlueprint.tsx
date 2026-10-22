export default function HeroBlueprint() {
  return <div className="absolute inset-0 overflow-hidden bg-[var(--rc-white)] pointer-events-none" aria-hidden="true">
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full text-[var(--rc-blue)] opacity-[0.12]" fill="none" stroke="currentColor">
      <path d="M0 760H1440M0 800H1440M140 760V300L220 220L300 300V760M165 760V320H275V760M195 230V170H245V230M80 760V460H140M300 760V400H370V760M1100 760V410L1270 340L1440 410M1090 560L1260 490L1440 560M1110 760V560M1270 760V490M1410 760V560" strokeWidth="2" />
      {[340, 410, 480, 550, 620, 690].map(y => <path key={y} d={`M165 ${y}H275M195 ${y}V${y+40}M245 ${y}V${y+40}`} />)}
      <path d="M1130 620H1220V710H1130ZM1300 600H1380V710H1300Z" strokeWidth="2" />
    </svg>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--rc-white)_25%,transparent_80%)]" />
  </div>;
}
