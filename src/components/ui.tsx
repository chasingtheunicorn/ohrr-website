import type { ReactNode } from 'react'
import type { Rabbit } from '../lib/types'
import type { Source } from '../lib/data'

export const btn = {
  orange:
    'inline-flex items-center justify-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-orange-dark',
  blue: 'inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-blue-dark',
  outline:
    'inline-flex items-center justify-center rounded-full border border-brand-orange/60 px-5 py-2.5 text-sm font-bold text-brand-orange-dark transition hover:bg-brand-orange-50',
  white:
    'inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-blue shadow-sm transition hover:bg-white/90',
}

export function Section({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-12 md:py-20 ${className}`}>
      {children}
    </section>
  )
}

export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-gradient-to-b from-brand-blue to-brand-blue-dark text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <h1 className="font-display text-3xl font-black leading-tight md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export function LiveNote({ source }: { source: Source }) {
  return (
    <p className="mt-3 flex items-start gap-1.5 text-xs font-semibold text-slate-400">
      {source === 'live' ? (
        <>
          <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          Live — synced from OHRR's system (the same data the app shows).
        </>
      ) : (
        <>
          <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-amber-400" />
          Sample data — the live list appears here automatically as staff add it in the app.
        </>
      )}
    </p>
  )
}

export function RabbitCard({ r }: { r: Rabbit }) {
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
