import { PageHero, Section, btn } from '../components/ui'
import { APPLY, OHRR } from '../lib/constants'

export default function About() {
  return (
    <>
      <PageHero
        title="About OHRR"
        subtitle="Columbus, Ohio's first rescue and adoption center dedicated entirely to domestic rabbits."
      />
      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-4 text-base leading-relaxed text-slate-700">
              <p>
                Ohio House Rabbit Rescue was <strong>founded in 2009</strong> by Beverly May, a
                longtime rabbit owner, after roughly <strong>900+ rabbits a year</strong> were being
                surrendered in Central Ohio with nowhere dedicated to take them in.
              </p>
              <p>
                In <strong>2013</strong> we opened the Ohio House Rabbit Adoption Center — the first
                rescue-and-adoption center in Ohio just for rabbits. Today we run a robust adoption
                program (every rabbit spayed/neutered and vaccinated), foster and volunteer programs,
                the <strong>Fix-a-Bun</strong> low-cost spay/neuter assistance program, and free
                public education on caring for rabbits as indoor companions.
              </p>
              <p>
                Our mission is simple: rescue rabbits in need, match them into qualified indoor homes,
                and teach the care that keeps them happy, healthy, and out of shelters.
              </p>
            </div>
            <a href={APPLY} target="_blank" rel="noopener" className={`${btn.orange} mt-6`}>
              Adopt a rabbit
            </a>
          </div>

          <aside className="rounded-3xl bg-brand-blue-50 p-6">
            <h2 className="font-display text-lg font-extrabold text-brand-blue">Visit us</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{OHRR.address}</p>
            <p className="mt-3 text-sm text-slate-700">
              Open <strong>{OHRR.hours}</strong>
            </p>
            <p className="mt-3 text-sm">
              <a href={OHRR.phoneHref} className="font-semibold text-brand-blue">
                {OHRR.phone}
              </a>
            </p>
            <p className="mt-3 text-sm">
              <a href={OHRR.facebook} target="_blank" rel="noopener" className="font-semibold text-brand-blue">
                Find us on Facebook
              </a>
            </p>
            <p className="mt-4 text-xs text-slate-400">501(c)(3) nonprofit · EIN {OHRR.ein}</p>
          </aside>
        </div>
      </Section>
    </>
  )
}
