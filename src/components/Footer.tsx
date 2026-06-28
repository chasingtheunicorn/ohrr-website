import { Link } from 'react-router-dom'
import { APP_URL, STAFF_URL, OHRR } from '../lib/constants'

const NAV = [
  { to: '/adopt', label: 'Adopt' },
  { to: '/learn', label: 'Learn' },
  { to: '/volunteer', label: 'Volunteer' },
  { to: '/bunfest', label: 'Midwest BunFest' },
  { to: '/give', label: 'Ways to give' },
  { to: '/about', label: 'About' },
]

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/img/ohrr-mark.png" alt="OHRR" className="h-11 w-11 object-contain" />
            <span className="font-display text-base font-black text-brand-blue">
              Ohio House Rabbit Rescue
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{OHRR.address}</p>
          <p className="mt-2 text-sm text-slate-600">Open {OHRR.hours}</p>
          <p className="mt-2 text-sm">
            <a href={OHRR.phoneHref} className="font-semibold text-brand-blue">
              {OHRR.phone}
            </a>
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="font-semibold text-slate-600 hover:text-brand-blue">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">More</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={APP_URL} target="_blank" rel="noopener" className="font-semibold text-brand-orange hover:text-brand-orange-dark">
                Open the OHRR app
              </a>
            </li>
            <li>
              <a href={STAFF_URL} target="_blank" rel="noopener" className="font-semibold text-slate-600 hover:text-brand-blue">
                Staff &amp; owner sign-in
              </a>
            </li>
            <li>
              <a href={OHRR.facebook} target="_blank" rel="noopener" className="font-semibold text-slate-600 hover:text-brand-blue">
                Facebook
              </a>
            </li>
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-slate-400">
            501(c)(3) nonprofit · EIN {OHRR.ein}
          </p>
        </div>
      </div>
      <div className="border-t border-black/5 py-5 text-center text-xs text-slate-400">
        © Ohio House Rabbit Rescue · Columbus, Ohio · a modern preview on the same live system as the
        app
      </div>
    </footer>
  )
}
