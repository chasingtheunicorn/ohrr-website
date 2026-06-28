import { Link } from 'react-router-dom'
import { useAnnouncements, useFeaturedRabbits } from '../lib/data'
import { btn, RabbitCard, LiveNote, Section } from '../components/ui'
import { APP_URL, DONATE } from '../lib/constants'

function Hero() {
  return (
    <Section className="!py-10 md:!py-16">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-blue">
            Ohio's first rabbit-only adoption center
          </span>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Every bunny deserves a <span className="text-brand-blue">home</span>.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 md:text-lg">
            We rescue, rehome, and teach better care for domestic rabbits — so more bunnies find
            loving indoor homes, and fewer are ever surrendered.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/adopt" className={btn.blue}>Meet adoptable rabbits</Link>
            <a href={DONATE} target="_blank" rel="noopener" className={btn.outline}>Donate</a>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl md:border-8">
            <img src="/img/bunny-lop-caramel.jpg" alt="A caramel lop rabbit" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -left-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl">
            <p className="font-display text-xl font-black text-brand-orange">125+</p>
            <p className="text-[11px] font-semibold text-slate-500">adoptions a year</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Announcements() {
  const items = useAnnouncements()
  if (items.length === 0) return null
  return (
    <div className="mx-auto max-w-6xl space-y-2 px-5">
      {items.map((a) => (
        <div key={a.id} className="rounded-2xl border border-brand-orange/30 bg-brand-orange-50/60 px-4 py-3 sm:px-5">
          <p className="font-display text-sm font-extrabold text-ink">{a.title}</p>
          <p className="mt-0.5 whitespace-pre-line text-sm text-slate-600">{a.body}</p>
        </div>
      ))}
    </div>
  )
}

function Stats() {
  const items = [
    { n: '2009', t: 'Founded to give surrendered rabbits a place to go.' },
    { n: '2013', t: "Ohio's first rescue & adoption center just for rabbits." },
    { n: 'Fix-a-Bun', t: 'Low-cost spay/neuter help across Ohio since 2012.' },
    { n: '900+', t: 'Rabbits surrendered each year in Central Ohio.' },
  ]
  return (
    <section className="bg-brand-blue text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:gap-8 lg:grid-cols-4 lg:py-12">
        {items.map((s) => (
          <div key={s.n}>
            <p className="font-display text-2xl font-black sm:text-3xl">{s.n}</p>
            <p className="mt-1 text-sm text-white/80">{s.t}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Featured() {
  const { rabbits, source } = useFeaturedRabbits(3)
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-black text-ink sm:text-3xl md:text-4xl">
          Rabbits looking for homes
        </h2>
        <Link to="/adopt" className="text-sm font-bold text-brand-blue hover:text-brand-blue-dark">
          See all rabbits →
        </Link>
      </div>
      <LiveNote source={source} />
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(rabbits ?? []).map((r) => <RabbitCard key={r.id} r={r} />)}
      </div>
    </Section>
  )
}

function Teasers() {
  const cards = [
    { to: '/volunteer', h: 'Get involved', p: 'Socialize bunnies, drive vet runs, foster, or help at events.' },
    { to: '/learn', h: 'Learn rabbit care', p: 'Diet, housing, bonding, litter training — straight from OHRR.' },
    { to: '/bunfest', h: 'Midwest BunFest', p: 'Our flagship event — the biggest rabbit festival in the East.' },
    { to: '/give', h: 'Ways to help', p: 'Donate, workplace matching, the wish list, and more.' },
  ]
  return (
    <section className="bg-canvas">
      <Section className="!py-12 md:!py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-extrabold text-brand-blue">{c.h}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.p}</p>
              <span className="mt-2 inline-block text-sm font-bold text-brand-orange">Explore →</span>
            </Link>
          ))}
        </div>
      </Section>
    </section>
  )
}

function AppCTA() {
  return (
    <Section>
      <div className="rounded-3xl bg-ink px-6 py-10 text-center text-white sm:px-12 md:py-12">
        <h2 className="font-display text-2xl font-black sm:text-3xl">The whole rescue, in one app</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 md:text-base">
          Adoptable rabbits, care guides, volunteering, the Hop Shop, and the full Midwest BunFest
          companion — all in the OHRR app.
        </p>
        <a href={APP_URL} target="_blank" rel="noopener" className={`${btn.orange} mt-6`}>
          Open the OHRR app
        </a>
      </div>
    </Section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Announcements />
      <Stats />
      <Featured />
      <Teasers />
      <AppCTA />
    </>
  )
}
