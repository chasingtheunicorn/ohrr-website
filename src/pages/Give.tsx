import { PageHero, Section } from '../components/ui'
import { APP_URL, DONATE, OHRR } from '../lib/constants'

const WAYS = [
  { h: 'Make a donation', p: 'One-time or recurring gifts directly fund rescue & vet care.', href: DONATE },
  { h: 'Workplace & matching', p: 'Many Columbus employers match gifts — double your impact.', href: 'https://www.ohiohouserabbitrescue.org/workplace-donations/' },
  { h: 'Amazon Wish List', p: 'Ship hay, supplies, and enrichment straight to the center.', href: 'https://www.ohiohouserabbitrescue.org/support-ohrr/wishlist/' },
  { h: 'OHRR Legacy Fund', p: 'Planned giving through wills, trusts, or beneficiary designations.', href: 'https://www.ohiohouserabbitrescue.org/ohrr-legacy-fund/' },
  { h: 'Kroger Community Rewards', p: 'Link your Kroger card and OHRR earns every time you shop.', href: 'https://www.ohiohouserabbitrescue.org/i-want-to-support/' },
  { h: 'Shop the Hop Shop', p: 'Rabbit supplies & OHRR merch — proceeds fund the rescue.', href: `${APP_URL}/hop-shop` },
]

export default function Give() {
  return (
    <>
      <PageHero
        title="Ways to help"
        subtitle={`Every gift is tax-deductible — OHRR is a 501(c)(3) (EIN ${OHRR.ein}). Here's every way to support the bunnies.`}
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WAYS.map((c) => (
            <a
              key={c.h}
              href={c.href}
              target="_blank"
              rel="noopener"
              className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-extrabold text-brand-blue">{c.h}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.p}</p>
              <span className="mt-2 inline-block text-sm font-bold text-brand-orange">Learn more →</span>
            </a>
          ))}
        </div>
      </Section>
    </>
  )
}
