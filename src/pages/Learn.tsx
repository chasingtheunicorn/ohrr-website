import { useCareArticles } from '../lib/data'
import { PageHero, Section, LiveNote } from '../components/ui'
import { APP_URL } from '../lib/constants'

const FALLBACK = [
  { slug: 'diet', title: 'Bunny Diet', summary: 'Hay first, fresh greens daily, pellets in moderation.' },
  { slug: 'housing', title: 'Living Space', summary: 'Indoors, roomy, and bunny-proofed.' },
  { slug: 'foods-to-avoid', title: 'Foods to Avoid', summary: 'Some foods are unsafe — keep these away from your bunny.' },
  { slug: 'litter', title: 'Litter Training', summary: 'Most rabbits litter-train surprisingly easily.' },
  { slug: 'bonding', title: 'Bonding', summary: 'Rabbits are social — but introductions take patience.' },
  { slug: 'health', title: 'Health & Vets', summary: 'Rabbits hide illness — know the warning signs.' },
]

export default function Learn() {
  const live = useCareArticles()
  const isLive = !!live && live.length > 0
  const articles = isLive
    ? live!.map((a) => ({ slug: a.slug, title: a.title, summary: a.summary }))
    : FALLBACK

  return (
    <>
      <PageHero
        title="Rabbit care"
        subtitle="Good care means happier rabbits — and fewer surrenders. The essentials, straight from OHRR."
      />
      <Section>
        <LiveNote source={isLive ? 'live' : 'sample'} />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <a
              key={a.slug}
              href={`${APP_URL}/learn/${a.slug}`}
              target="_blank"
              rel="noopener"
              className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-extrabold text-brand-blue">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{a.summary}</p>
              <span className="mt-2 inline-block text-sm font-bold text-brand-orange">Read more →</span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-slate-400">
          General guidance to get you started — always consult a rabbit-savvy vet for medical
          concerns.
        </p>
      </Section>
    </>
  )
}
