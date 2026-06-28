import { PageHero, Section, btn } from '../components/ui'
import { APP_URL } from '../lib/constants'

const FEATURES = [
  { h: 'Vendors', p: "Bun specialty shopping — toys, treats, and handcrafted items you can't find locally." },
  { h: 'Education', p: '10–15 sessions led by nationally recognized rabbit vets and educators.' },
  { h: 'Bunny Spa', p: 'Nail trims and gentle grooming for your rabbit.' },
  { h: 'Glamour Shots', p: 'Professional photos of your bunny.' },
  { h: 'Silent Auction & Raffle', p: 'Bid and win — every dollar supports rescue.' },
  { h: 'Rescue Partners', p: 'Meet rabbit rescues from across the Midwest.' },
]

export default function BunFest() {
  return (
    <>
      <PageHero
        title="Midwest BunFest"
        subtitle="OHRR's flagship fundraiser — the largest rabbit festival and educational expo in the Eastern U.S. Every October."
      />
      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-[#1690bf] to-[#0f7197] p-6 shadow-xl">
            <div className="rounded-2xl bg-white p-5">
              <img src="/img/bunfest-2025-logo.jpg" alt="Midwest BunFest" className="mx-auto block w-full max-w-xs" />
            </div>
          </div>
          <div>
            <p className="text-base leading-relaxed text-slate-600 md:text-lg">
              A national and international draw for rabbit owners, experts, and veterinarians —
              promoted by 15–20 rescue partners across the Midwest. A full day of shopping, expert
              talks, pampering, and community, all in support of OHRR's mission.
            </p>
            <a href={`${APP_URL}/bunfest`} target="_blank" rel="noopener" className={`${btn.blue} mt-6`}>
              Explore BunFest in the app
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.h} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="font-display text-lg font-extrabold text-brand-blue">{f.h}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.p}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
