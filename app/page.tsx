import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-display',
});
const body = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
});

export default function HomePage() {

  const theme = {
    bgMain: "#0b0f1a",
    bgDeep: "#05070c",
    gold: "#c9a25b",
    goldSoft: "#e8d6ab",
    textMuted: "#cbd2e0",
    imgOpacity: "0.35"
  };

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen text-white flex flex-col antialiased`}
      style={{ backgroundColor: theme.bgMain, fontFamily: 'var(--font-body)' }}
    >

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#05070c]/70 backdrop-blur-md border-b" style={{ borderColor: 'rgba(201,162,91,0.2)' }}>
        <div className="max-w-full mx-auto px-6 md:px-16 h-20 flex items-center justify-between">

          <Link href="/home" className="flex items-center gap-3 select-none group">
            <span
              className="w-10 h-10 flex items-center justify-center rounded-full border text-sm tracking-widest"
              style={{ borderColor: theme.gold, color: theme.gold, fontFamily: 'var(--font-display)' }}
            >
              HR
            </span>
            <span
              className="text-xl md:text-2xl uppercase tracking-[0.2em] font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Hotel <span style={{ color: theme.gold }}>Royal</span>
            </span>
          </Link>

          <Link
            href="/login"
            className="px-7 py-2.5 rounded-full text-sm font-medium uppercase tracking-widest border transition-all duration-300 hover:text-[#05070c]"
            style={{ borderColor: theme.gold, color: theme.gold }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Login
          </Link>

        </div>
      </header>

      {/* Hero */}
      <main className="relative h-screen flex items-center justify-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
            opacity: theme.imgOpacity
          }}
        />

        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, ${theme.bgDeep} 95%)`
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative text-center z-10 px-6 max-w-4xl mx-auto">

          <p
            className="text-xs md:text-sm uppercase tracking-[0.4em] font-medium mb-6"
            style={{ color: theme.goldSoft }}
          >
            Welcome to
          </p>

          <h1
            className="text-5xl md:text-8xl mb-6 leading-none select-none"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Hotel <span style={{ color: theme.gold }}>Royal</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12" style={{ backgroundColor: theme.gold }} />
            <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: theme.gold }} />
            <span className="h-px w-12" style={{ backgroundColor: theme.gold }} />
          </div>

          <p
            style={{ color: theme.textMuted }}
            className="text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
          >
            Experience the pinnacle of{' '}
            <span className="italic" style={{ color: theme.goldSoft, fontFamily: 'var(--font-display)' }}>
              luxury &amp; comfort
            </span>{' '}
            tailored exclusively for your finest moments.
          </p>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: theme.gold }}>Scroll</span>
          <span className="w-px h-8" style={{ backgroundColor: theme.gold }} />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-6 text-center text-xs tracking-[0.3em] uppercase mt-auto border-t"
        style={{ backgroundColor: theme.bgDeep, borderColor: 'rgba(201,162,91,0.15)', color: '#5a6072' }}
      >
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>

    </div>
  );
}