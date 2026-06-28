import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isConfigured } from './supabase'

// Capability keys (mirror the app / DB seed). Owners & admins implicitly hold all.
export const CAPS = [
  'hopshop.products.create',
  'hopshop.products.edit',
  'hopshop.products.delete',
  'hopshop.inventory.update',
  'hopshop.orders.view',
  'adoptions.listings.create',
  'adoptions.listings.edit',
  'adoptions.status.change',
  'volunteers.shifts.manage',
  'volunteers.signups.approve',
  'content.education.edit',
  'events.bunfest.manage',
  'announcements.post',
  'staff.invite',
  'staff.permissions.manage',
  'audit.view',
] as const
export type Cap = (typeof CAPS)[number]

export interface Membership {
  id: string
  orgId: string
  role: string
  status: string
}

interface StaffValue {
  configured: boolean
  loading: boolean
  user: User | null
  membership: Membership | null
  capabilities: Set<string>
  can: (cap: Cap) => boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<StaffValue | null>(null)

export function StaffProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [capabilities, setCapabilities] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(isConfigured)

  useEffect(() => {
    if (!isConfigured) {
      setSessionLoaded(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setSessionLoaded(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const userId = user?.id ?? null

  const loadMembership = useCallback(async () => {
    if (!isConfigured || !userId) {
      setMembership(null)
      setCapabilities(new Set())
      return
    }
    const { data: rows } = await supabase
      .from('memberships')
      .select('id, org_id, role, status')
      .eq('status', 'active')
      .limit(1)
    const r = rows?.[0]
    if (!r) {
      setMembership(null)
      setCapabilities(new Set())
      return
    }
    const m: Membership = { id: r.id, orgId: r.org_id, role: r.role, status: r.status }
    setMembership(m)
    if (m.role === 'owner' || m.role === 'admin') {
      setCapabilities(new Set(CAPS))
      return
    }
    const { data: grants } = await supabase
      .from('membership_permissions')
      .select('permission_key')
      .eq('membership_id', m.id)
    setCapabilities(new Set((grants ?? []).map((g: { permission_key: string }) => g.permission_key)))
  }, [userId])

  useEffect(() => {
    if (!sessionLoaded) return
    let active = true
    ;(async () => {
      await loadMembership()
      if (active) setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [sessionLoaded, loadMembership])

  const can = useCallback(
    (cap: Cap) => {
      if (membership && (membership.role === 'owner' || membership.role === 'admin')) return true
      return capabilities.has(cap)
    },
    [membership, capabilities],
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setMembership(null)
    setCapabilities(new Set())
  }, [])

  return (
    <Ctx.Provider
      value={{ configured: isConfigured, loading, user, membership, capabilities, can, refresh: loadMembership, signOut }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useStaff(): StaffValue {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStaff must be used within <StaffProvider>')
  return c
}

export const staffInput =
  'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-blue" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  )
}
