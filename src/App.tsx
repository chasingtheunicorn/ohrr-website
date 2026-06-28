import { useAnnouncements, useFeaturedRabbits } from './lib/data'
import type { Rabbit } from './lib/types'

const APP_URL = 'https://ohrr-app.netlify.app'
const DONATE = 'https://www.ohiohouserabbitrescue.org/support-ohrr/donate/'
const APPLY = 'https://www.ohiohouserabbitrescue.org/adopt/adoption-application/'

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/img/ohrr-mark.png" alt="OHRR" className="h-10 w-10 rounded-lg object-contain" />
          <span className="leading-tight">
            <span className="block font-display text-base font-extrabold text-brand-blue">
              Ohio House Rabbit Rescue
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
              Columbus, Ohio · est. 2009
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <a href="#adopt" className="hover:text-brand-blue">Adopt</a>
          <a href="#programs" className="hover:text-brand-blue">Programs</a>
          <a href="#bunfest" className="hover:text-brand-blue">BunFest</a>
          <a href="#give" className="hover:text-brand-blue">Give</a>
        </nav>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener"
          className="rounded-full bg-brand-orange px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-orange-dark"
        >
          Open the app
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue">
          Ohio's first rabbit-only adoption center
        </span>
        <h1 className="mt-4 font-display text-4xl font-black leading-tight md:text-5xl">
          Every bunny deserves a <span className="text-brand-blue">home</span>.
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600">
          We rescue, rehome, and teach better care for domestic rabbits — so more bunnies find loving
          indoor homes, and fewer are ever surrendered.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="#adopt"
            className="rounded-full bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-blue-dark"
          >
            Meet adoptable rabbits
          </a>
          <a
            href={DONATE}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-brand-orange/60 px-6 py-3 text-sm font-bold text-brand-orange-dark transition hover:bg-brand-orange-50"
          >
            Donate
          </a>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
          <img
            src="/img/bunny-lop-caramel.jpg"
            alt="A caramel lop rabbit"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-white px-5 py-3 shadow-xl sm:block">
          <p className="font-display text-2xl font-black text-brand-orange">125+</p>
          <p className="text-xs font-semibold text-slate-500">adoptions a year, and growing</p>
        </div>
      </div>
    </section>
  )
}

function Announcements() {
  const items = useAnnouncements()
  if (items.length === 0) return null
  return (
    <section className="mx-auto max-w-6xl px-5">
      <div className="space-y-2">
        {items.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-brand-orange/30 bg-brand-orange-50/60 px-5 py-3"
          >
            <p className="font-display text-sm font-extrabold text-ink">{a.title}</p>
            <p className="mt-0.5 whitespace-pre-line text-sm text-slate-600">{a.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    { n: '2009', t: 'Founded by Beverly May to give surrendered rabbits a place to go.' },
    { n: '2013', t: "Opened Ohio's first rescue & adoption center just for rabbits." },
    { n: 'Fix-a-Bun', t: 'Low-cost spay/neuter help across Ohio since 2012.' },
    { n: '900+', t: 'Rabbits surrendered each year in Central Ohio — the need we meet.' },
  ]
  return (
    <section className="mt-10 bg-brand-blue text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <div key={s.n}>
            <p className="font-display text-3xl font-black">{s.n}</p>
            <p className="mt-1 text-sm text-white/80">{s.t}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RabbitCard({ r }: { r: Rabbit }) {
  const meta = [r.age, r.sex, r.breed].filter(Boolean).join(' · ')
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/3] w-full bg-slate-100">
        {r.photo ? (
          <img src={r.photo} alt={r.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl font-black text-slate-300">
            {r.name.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-extrabold text-ink">{r.name}</h3>
          {r.bonded && (
            <span className="rounded-full bg-brand-orange-50 px-2 py-0.5 text-xs font-bold text-brand-orange-dark">
              Pair
            </span>
          )}
          {r.status && !/available|adoptable/i.test(r.status) && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
              {r.status}
            </span>
          )}
        </div>
        {meta && <p className="mt-0.5 text-sm font-semibold text-slate-400">{meta}</p>}
        {r.description && <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{r.description}</p>}
      </div>
    </div>
  )
}

function FeaturedRabbits() {
  const { rabbits, source } = useFeaturedRabbits(6)
  return (
    <section id="adopt" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
            Rabbits looking for homes
          </h2>
          <p className="mt-2 max-w-xl text-slate-600">
            Every OHRR rabbit is spayed/neutered and vaccinated. Adoptions are by appointment at our
            Columbus center.
          </p>
        </div>
        <a
          href={`${APP_URL}/adopt`}
          target="_blank"
          rel="noopener"
          className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-blue-dark"
        >
          See all in the app →
        </a>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        {source === 'live' ? (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Live — synced from
            OHRR's system (the same data the app shows).
          </>
        ) : (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> Sample rabbits — the
            live list appears here automatically as staff add rabbits in the app.
          </>
        )}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(rabbits ?? []).map((r) => (
          <RabbitCard key={r.id} r={r} />
        ))}
      </div>
      <div className="mt-8 rounded-3xl bg-brand-blue-50 p-6 sm:p-8">
        <h3 className="font-display text-xl font-extrabold text-brand-blue">Before you adopt</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            'Rabbits live indoors — never outdoors.',
            'A minimum 4×4 ft space, or free-range in the home.',
            'Unlimited hay, quality pellets, and a daily salad.',
            'All OHRR rabbits are spayed/neutered & vaccinated.',
          ].map((t) => (
            <li key={t} className="flex gap-2.5 text-sm text-slate-700">
              <span className="text-brand-orange">●</span> {t}
            </li>
          ))}
        </ul>
        <a
          href={APPLY}
          target="_blank"
          rel="noopener"
          className="mt-5 inline-block rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-orange-dark"
        >
          Start an adoption application
        </a>
      </div>
    </section>
  )
}

function Programs() {
  const items = [
    { h: 'Adoption', p: 'Thoughtful matches into qualified indoor homes — every rabbit fixed and vaccinated first.' },
    { h: 'Fostering', p: 'Foster homes let us say "yes" to more rabbits than the center can hold. We cover vet care and supplies.' },
    { h: 'Volunteering', p: 'Socialize shy bunnies, drive vet-transport runs, or help at events — a way for everyone.' },
    { h: 'Education', p: 'Free care guides on diet, housing, bonding, and litter training — informed owners surrender fewer rabbits.' },
    { h: 'Fix-a-Bun', p: 'Financial help for spay/neuter surgery for rabbits across Ohio — not just our own.' },
    { h: 'Need to surrender?', p: "If you can no longer care for your rabbit, reach out — we're here to help, not to judge." },
  ]
  return (
    <section id="programs" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-3xl font-black text-ink md:text-4xl">More than adoption</h2>
        <p className="mt-2 max-w-xl text-slate-600">A small, volunteer-powered rescue doing a lot of good.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <article key={c.h} className="rounded-2xl border border-black/5 bg-canvas p-6">
              <h3 className="font-display text-lg font-extrabold text-brand-blue">{c.h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.p}</p>
            </article>
          ))}
        </div>
        <a
          href={`${APP_URL}/volunteer`}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-block rounded-full border border-brand-blue/30 px-5 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-brand-blue-50"
        >
          Get involved in the app →
        </a>
      </div>
    </section>
  )
}

function BunFest() {
  return (
    <section
      id="bunfest"
      className="bg-gradient-to-br from-[#1690bf] to-[#0f7197] py-16 text-white md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <img src="/img/bunfest-2025-logo.jpg" alt="Midwest BunFest" className="mx-auto block w-full max-w-sm" />
        </div>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Our flagship event
          </span>
          <h2 className="mt-4 font-display text-3xl font-black md:text-4xl">Midwest BunFest</h2>
          <p className="mt-3 max-w-md text-white/90">
            The largest rabbit festival and educational expo in the Eastern U.S. — vendors, expert
            talks, the Bunny Spa, Glamour Shots, a silent auction, and rescues from across the
            Midwest. Every October.
          </p>
          <a
            href={`${APP_URL}/bunfest`}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-extrabold text-brand-blue shadow-sm transition hover:bg-white/90"
          >
            Explore BunFest in the app
          </a>
        </div>
      </div>
    </section>
  )
}

function Give() {
  const items = [
    { h: 'Make a donation', p: 'One-time or recurring gifts directly fund rescue & vet care.', href: DONATE },
    { h: 'Workplace & matching', p: 'Many Columbus employers match gifts — double your impact.', href: 'https://www.ohiohouserabbitrescue.org/workplace-donations/' },
    { h: 'Amazon Wish List', p: 'Ship hay, supplies, and enrichment straight to the center.', href: 'https://www.ohiohouserabbitrescue.org/support-ohrr/wishlist/' },
    { h: 'Legacy Fund', p: 'Planned giving through wills, trusts, or beneficiary designations.', href: 'https://www.ohiohouserabbitrescue.org/ohrr-legacy-fund/' },
    { h: 'Shop the Hop Shop', p: 'Rabbit supplies & OHRR merch — proceeds fund the rescue.', href: `${APP_URL}/hop-shop` },
    { h: 'More ways to give', p: 'Kroger Community Rewards, host a fundraiser, and more.', href: `${APP_URL}/support` },
  ]
  return (
    <section id="give" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <h2 className="font-display text-3xl font-black text-ink md:text-4xl">Ways to help</h2>
      <p className="mt-2 max-w-xl text-slate-600">
        Every gift is tax-deductible — OHRR is a 501(c)(3) (EIN 27-0830606).
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <a
            key={c.h}
            href={c.href}
            target="_blank"
            rel="noopener"
            className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="font-display font-extrabold text-brand-blue">{c.h}</h3>
            <p className="mt-1 text-sm text-slate-600">{c.p}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

function AppCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-20">
      <div className="overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12">
        <h2 className="font-display text-3xl font-black">The whole rescue, in one app</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/75">
          Adoptable rabbits, care guides, volunteering, the Hop Shop, and the full Midwest BunFest
          companion — all in the OHRR app.
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener"
          className="mt-6 inline-block rounded-full bg-brand-orange px-7 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-brand-orange-dark"
        >
          Open the OHRR app
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/img/ohrr-mark.png" alt="OHRR" className="h-9 w-9 rounded-lg object-contain" />
            <span className="font-display text-base font-extrabold text-brand-blue">
              Ohio House Rabbit Rescue
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            5485 N. High Street
            <br />
            Columbus, OH 43214
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Open <strong>Sat &amp; Sun, 12–4 PM</strong> — adoptions by appointment.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            <a href="tel:+16142638557" className="font-semibold text-brand-blue">
              614-263-8557
            </a>
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-xs leading-relaxed text-slate-400 md:ml-auto md:max-w-xs">
            Ohio House Rabbit Rescue is a 501(c)(3) nonprofit (EIN 27-0830606). Every bunny deserves a
            home.
          </p>
          <p className="mt-4 text-xs text-slate-400">
            A modern preview built on the same live system as the OHRR app.
          </p>
        </div>
      </div>
      <div className="border-t border-black/5 py-5 text-center text-xs text-slate-400">
        © Ohio House Rabbit Rescue · Columbus, Ohio
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div id="top" className="bg-white text-ink">
      <Header />
      <Hero />
      <Announcements />
      <Stats />
      <FeaturedRabbits />
      <Programs />
      <BunFest />
      <Give />
      <AppCTA />
      <Footer />
    </div>
  )
}
