import { useRabbits } from '../lib/data'
import { PageHero, Section, RabbitCard, LiveNote, btn } from '../components/ui'
import { APPLY, OHRR } from '../lib/constants'

const REQS = [
  'Rabbits live indoors — never outdoors.',
  'A minimum 4×4 ft space, or free-range in the home.',
  'Unlimited hay, quality pellets, and a daily salad.',
  'All OHRR rabbits are spayed/neutered & vaccinated.',
]

export default function Adopt() {
  const { rabbits, source } = useRabbits(60)
  return (
    <>
      <PageHero
        title="Adopt a rabbit"
        subtitle="Meet the rabbits looking for homes at OHRR. Every adoption is by appointment at our Columbus center."
      />
      <Section>
        <LiveNote source={source} />
        {rabbits === null ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl ring-1 ring-black/5">
                <div className="aspect-[4/3] w-full animate-pulse bg-slate-100" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : rabbits.length === 0 ? (
          <p className="mt-6 text-slate-600">No rabbits to show right now — check back soon!</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rabbits.map((r) => (
              <RabbitCard key={r.id} r={r} />
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-brand-blue-50 p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold text-brand-blue">Before you adopt</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {REQS.map((t) => (
              <li key={t} className="flex gap-2.5 text-sm text-slate-700">
                <span className="text-brand-orange">●</span> {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={APPLY} target="_blank" rel="noopener" className={btn.orange}>
              Start an adoption application
            </a>
            <a href={OHRR.phoneHref} className={btn.outline}>
              Call {OHRR.phone}
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}
