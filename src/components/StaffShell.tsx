import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { supabase, errMessage } from '../lib/supabase'
import { useStaff, staffInput, Spinner } from '../lib/staff'
import { btn } from './ui'

function SignIn() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'working'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  const onSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    setStatus('working')
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (!data.session) {
          setCheckEmail(true)
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      // onAuthStateChange reloads membership and re-renders the shell.
    } catch (err) {
      setError(errMessage(err))
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      {checkEmail ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="font-display text-xl font-extrabold text-ink">Confirm your email</h1>
          <p className="mt-2 text-sm text-slate-600">
            We sent a confirmation link to <strong>{email}</strong>. Open it, then come back and sign
            in.
          </p>
          <button onClick={() => { setCheckEmail(false); setMode('signin') }} className={`${btn.blue} mt-4`}>
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-black text-ink">Staff &amp; owner sign‑in</h1>
          <p className="mt-1 text-sm text-slate-600">Manage OHRR's content right here on the site.</p>
          <form onSubmit={onSubmit} className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input className={staffInput} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input className={staffInput} type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <button type="submit" disabled={status === 'working'} className={`${btn.orange} w-full disabled:opacity-60`}>
              {status === 'working' ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <p className="mt-3 text-center text-sm text-slate-500">
            {mode === 'signin' ? 'New here?' : 'Already have an account?'}{' '}
            <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }} className="font-bold text-brand-blue">
              {mode === 'signin' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
          <p className="mt-2 text-center">
            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to the website</Link>
          </p>
        </>
      )}
    </div>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
    isActive ? 'bg-brand-blue text-white' : 'text-slate-600 hover:bg-slate-100'
  }`

export default function StaffShell() {
  const { configured, loading, user, membership, can, signOut } = useStaff()

  if (!configured)
    return <div className="mx-auto max-w-md px-5 py-16 text-center text-slate-600">Backend not configured.</div>
  if (loading) return <Spinner />
  if (!user) return <SignIn />

  if (!membership) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <h1 className="font-display text-xl font-extrabold text-ink">No staff access yet</h1>
        <p className="mt-2 text-sm text-slate-600">
          You're signed in, but this account isn't an OHRR staff member. Ask an owner to invite you.
        </p>
        <button onClick={signOut} className={`${btn.outline} mt-4`}>Sign out</button>
      </div>
    )
  }

  const role = membership.role[0].toUpperCase() + membership.role.slice(1)

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <Link to="/staff" className="flex items-center gap-2.5">
            <img src="/img/ohrr-mark.png" alt="OHRR" className="h-9 w-9 object-contain" />
            <span className="leading-tight">
              <span className="block font-display text-sm font-extrabold text-ink">OHRR Staff</span>
              <span className="block text-[11px] font-semibold text-slate-400">{role}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1.5">
            <NavLink to="/staff" end className={navClass}>Dashboard</NavLink>
            {can('announcements.post') && <NavLink to="/staff/announcements" className={navClass}>Announcements</NavLink>}
            {(can('adoptions.listings.create') || can('adoptions.listings.edit') || can('adoptions.status.change')) && (
              <NavLink to="/staff/rabbits" className={navClass}>Rabbits</NavLink>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/" className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50">
              View site
            </Link>
            <button onClick={signOut} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
