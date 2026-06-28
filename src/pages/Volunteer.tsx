import { useVolunteerOpps } from '../lib/data'
import { PageHero, Section, LiveNote, btn } from '../components/ui'
import { APP_URL } from '../lib/constants'

const WAYS = [
  { h: 'Bunny socialization', p: 'Sit with rabbits to help them get comfortable with people and ready for adoption.' },
  { h: 'Vet transport', p: 'Drive bunnies to and from spay/neuter surgeries and vet appointments.' },
  { h: 'Events & awareness', p: 'Help at tabling events, from Midwest BunFest to library talks.' },
  { h: 'Foster a rabbit', p: 'Open your home and let OHRR say "yes" to more rabbits. We cover vet care.' },
]

const CAT: Record<string, string> = {
  socialization: 'Socialization',
  'vet-transport': 'Vet transport',
  events: 'Events',
}

export default function Volunteer() {
  const opps = useVolunteerOpps()
  const isLive = !!opps && opps.length > 0

  return (
    <>
      <PageHero
        title="Volunteer"
        subtitle="A small, volunteer-powered rescue doing a lot of good. There's a way for everyone to help."
      />
      <Section>
        <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">Ways to help</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {WAYS.map((w) => (
            <div key={w.h} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="font-display text-lg font-extrabold text-brand-blue">{w.h}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{w.p}</p>
            </div>
          ))}
        </div>

        {isLive && (
          <div className="mt-10">
            <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">Open opportunities</h2>
            <LiveNote source="live" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {opps!.map((o) => (
                <div key={o.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-extrabold text-ink">{o.title}</h3>
                    <span className="rounded-full bg-brand-blue-50 px-2 py-0.5 text-xs font-bold text-brand-blue">
                      {CAT[o.category] ?? o.category}
                    </span>
                    {o.spots && (
                      <span className="text-xs font-bold text-brand-orange-dark">{o.spots}</span>
                    )}
                  </div>
                  {o.when_text && <p className="mt-1 text-sm text-slate-600">{o.when_text}</p>}
                  {o.where_text && <p className="text-sm text-slate-500">{o.where_text}</p>}
                  {o.detail && <p className="mt-1.5 text-sm text-slate-600">{o.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-brand-blue-50 p-6 text-center sm:p-8">
          <p className="text-slate-700">Ready to lend a hand? Sign up and pick a role in the app.</p>
          <a href={`${APP_URL}/volunteer`} target="_blank" rel="noopener" className={`${btn.blue} mt-4`}>
            Become a volunteer
          </a>
        </div>
      </Section>
    </>
  )
}
