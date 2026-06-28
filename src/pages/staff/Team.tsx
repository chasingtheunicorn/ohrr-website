import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, errMessage } from '../../lib/supabase'
import {
  useStaff,
  staffInput,
  Spinner,
  PERMISSION_CATALOG,
  PRESETS,
  type Cap,
  type PermissionMeta,
} from '../../lib/staff'
import { btn } from '../../components/ui'

interface Member {
  id: string
  user_id: string
  email: string | null
  role: string
  status: string
}

// Capabilities grouped by area for the toggle UI.
const AREAS: { area: string; caps: PermissionMeta[] }[] = (() => {
  const order: string[] = []
  const byArea = new Map<string, PermissionMeta[]>()
  for (const p of PERMISSION_CATALOG) {
    if (!byArea.has(p.area)) {
      byArea.set(p.area, [])
      order.push(p.area)
    }
    byArea.get(p.area)!.push(p)
  }
  return order.map((area) => ({ area, caps: byArea.get(area)! }))
})()

/* ---------- Invite a worker ---------- */
function InvitePanel({ orgId }: { orgId: string }) {
  const [role, setRole] = useState<'staff' | 'admin'>('staff')
  const [preset, setPreset] = useState<string>('Adoptions Coordinator')
  const [customCaps, setCustomCaps] = useState<Set<Cap>>(new Set())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const isCustom = preset === '__custom__'

  const toggleCustom = (key: Cap) =>
    setCustomCaps((s) => {
      const n = new Set(s)
      if (n.has(key)) n.delete(key)
      else n.add(key)
      return n
    })

  const generate = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    setCode(null)
    setCopied(false)
    setBusy(true)
    try {
      const caps = isCustom ? Array.from(customCaps) : []
      const { data, error } = await supabase.rpc('create_invite_code', {
        p_org: orgId,
        p_role: role,
        p_capabilities: caps,
        p_preset: isCustom || role === 'admin' ? null : preset,
        p_max_uses: 1,
      })
      if (error) throw error
      setCode(data as string)
    } catch (err) {
      setError(errMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const copy = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be blocked; code is shown for manual copy */
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-display text-base font-extrabold text-ink">Invite a worker</h2>
      <form onSubmit={generate} className="mt-3 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Role
            <select className={staffInput} value={role} onChange={(e) => setRole(e.target.value as 'staff' | 'admin')}>
              <option value="staff">Staff (scoped access)</option>
              <option value="admin">Admin (full access)</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Access preset
            <select className={staffInput} value={preset} onChange={(e) => setPreset(e.target.value)} disabled={role === 'admin'}>
              {Object.keys(PRESETS).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="__custom__">Custom…</option>
            </select>
          </label>
        </div>

        {role === 'admin' ? (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">Admins implicitly hold every capability — no preset needed.</p>
        ) : isCustom ? (
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Pick capabilities</p>
            <div className="space-y-2">
              {AREAS.map(({ area, caps }) => (
                <div key={area}>
                  <p className="text-xs font-bold text-slate-500">{area}</p>
                  <div className="mt-1 grid grid-cols-1 gap-1">
                    {caps.map((c) => (
                      <label key={c.key} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-blue" checked={customCaps.has(c.key)} onChange={() => toggleCustom(c.key)} />
                        {c.description}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
            Grants: {PRESETS[preset]?.map((k) => k.split('.').slice(-2).join(' ')).join(', ')}
          </p>
        )}

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={busy || (role === 'staff' && isCustom && customCaps.size === 0)} className={`${btn.blue} w-full disabled:opacity-60`}>
          {busy ? 'Generating…' : 'Generate invite code'}
        </button>
      </form>

      {code && (
        <div className="mt-3 rounded-xl border border-brand-blue/30 bg-brand-blue-50/60 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-blue">Invite code — share with the worker</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <code className="font-mono text-lg font-black tracking-wider text-ink">{code}</code>
            <button type="button" onClick={copy} className="rounded-full bg-brand-blue px-3 py-1 text-xs font-bold text-white">{copied ? 'Copied!' : 'Copy'}</button>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">Single-use, expires in 14 days. The worker signs in here, then enters this code on their dashboard.</p>
        </div>
      )}
    </div>
  )
}

/* ---------- One member row ---------- */
function MemberCard({
  member,
  isSelf,
  grants,
  canManage,
  onToggleCap,
  onToggleStatus,
}: {
  member: Member
  isSelf: boolean
  grants: Set<string>
  canManage: boolean
  onToggleCap: (memId: string, key: Cap, grant: boolean) => Promise<void>
  onToggleStatus: (member: Member) => Promise<void>
}) {
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [statusBusy, setStatusBusy] = useState(false)
  const isAdminish = member.role === 'owner' || member.role === 'admin'

  const handleCap = async (key: Cap, grant: boolean) => {
    setBusyKey(key)
    await onToggleCap(member.id, key, grant)
    setBusyKey(null)
  }
  const handleStatus = async () => {
    setStatusBusy(true)
    await onToggleStatus(member)
    setStatusBusy(false)
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="break-all font-display text-[15px] font-extrabold text-ink">{member.email ?? `Member ${member.user_id.slice(0, 8)}`}</span>
          {isSelf && <span className="ml-1.5 text-xs font-bold text-slate-400">(you)</span>}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isAdminish ? 'bg-brand-blue-50 text-brand-blue' : 'bg-slate-100 text-slate-500'}`}>
            {member.role[0].toUpperCase() + member.role.slice(1)}
          </span>
          {member.status === 'disabled' && <span className="rounded-full bg-brand-orange-50 px-2 py-0.5 text-xs font-bold text-brand-orange">Disabled</span>}
        </div>
      </div>

      {isAdminish ? (
        <p className="mt-2 text-sm text-slate-500">Full access — holds every capability.</p>
      ) : canManage ? (
        <div className="mt-2 space-y-2">
          {AREAS.map(({ area, caps }) => (
            <div key={area}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{area}</p>
              <div className="mt-1 grid grid-cols-1 gap-1">
                {caps.map((c) => (
                  <label key={c.key} className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-blue disabled:opacity-50" checked={grants.has(c.key)} disabled={busyKey === c.key} onChange={(e) => handleCap(c.key, e.target.checked)} />
                    {c.description}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500">{grants.size === 0 ? 'No capabilities granted.' : `${grants.size} ${grants.size === 1 ? 'capability' : 'capabilities'} granted.`}</p>
      )}

      {canManage && !isAdminish && !isSelf && (
        <button
          type="button"
          onClick={handleStatus}
          disabled={statusBusy}
          className={`mt-3 rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 ${
            member.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          {statusBusy ? '…' : member.status === 'active' ? 'Disable access' : 'Re-enable'}
        </button>
      )}
    </div>
  )
}

export default function Team() {
  const { user, membership, can } = useStaff()
  const orgId = membership?.orgId ?? ''
  const canInvite = can('staff.invite')
  const canManage = can('staff.permissions.manage')

  const [members, setMembers] = useState<Member[]>([])
  const [grantMap, setGrantMap] = useState<Map<string, Set<string>>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!orgId) return
    setError(null)
    const [memRes, grantRes] = await Promise.all([
      supabase.rpc('list_org_members', { p_org: orgId }),
      supabase.from('membership_permissions').select('membership_id, permission_key'),
    ])

    let mem: Member[]
    if (!memRes.error && memRes.data) {
      mem = (memRes.data as Array<{ membership_id: string; user_id: string; email: string | null; role: string; status: string }>).map((r) => ({
        id: r.membership_id,
        user_id: r.user_id,
        email: r.email,
        role: r.role,
        status: r.status,
      }))
    } else {
      const fb = await supabase.from('memberships').select('id, user_id, role, status').eq('org_id', orgId).order('created_at')
      if (fb.error) {
        setError(errMessage(fb.error))
        setLoading(false)
        return
      }
      mem = (fb.data ?? []).map((r: { id: string; user_id: string; role: string; status: string }) => ({
        id: r.id,
        user_id: r.user_id,
        email: null,
        role: r.role,
        status: r.status,
      }))
    }

    if (grantRes.error) {
      setError(errMessage(grantRes.error))
      setLoading(false)
      return
    }
    const map = new Map<string, Set<string>>()
    for (const g of (grantRes.data ?? []) as Array<{ membership_id: string; permission_key: string }>) {
      if (!map.has(g.membership_id)) map.set(g.membership_id, new Set())
      map.get(g.membership_id)!.add(g.permission_key)
    }
    setMembers(mem)
    setGrantMap(map)
    setLoading(false)
  }, [orgId])

  useEffect(() => {
    load()
  }, [load])

  const toggleCap = useCallback(async (memId: string, key: Cap, grant: boolean) => {
    const { error } = await supabase.rpc('set_membership_permission', { p_membership: memId, p_key: key, p_grant: grant })
    if (error) {
      setError(errMessage(error))
      return
    }
    setGrantMap((prev) => {
      const next = new Map(prev)
      const set = new Set(next.get(memId) ?? [])
      if (grant) set.add(key)
      else set.delete(key)
      next.set(memId, set)
      return next
    })
  }, [])

  const toggleStatus = useCallback(async (member: Member) => {
    const nextStatus = member.status === 'active' ? 'disabled' : 'active'
    const { error } = await supabase.rpc('set_membership_status', { p_membership: member.id, p_status: nextStatus })
    if (error) {
      setError(errMessage(error))
      return
    }
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status: nextStatus } : m)))
  }, [])

  const sortedMembers = useMemo(() => {
    const rank: Record<string, number> = { owner: 0, admin: 1, staff: 2 }
    return [...members].sort((a, b) => (rank[a.role] ?? 9) - (rank[b.role] ?? 9))
  }, [members])

  if (!canInvite && !canManage) {
    return (
      <div>
        <h1 className="font-display text-2xl font-black text-ink">Team</h1>
        <p className="mt-3 text-sm text-slate-600">You don't have access to manage the team. Ask an owner or admin if you need it.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-ink">Team</h1>
      <p className="mt-1 text-sm text-slate-600">Invite staff and control what each person can do. Changes take effect immediately and are logged — across both the website and the app.</p>

      {canInvite && <div className="mt-5"><InvitePanel orgId={orgId} /></div>}

      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

      <p className="mt-6 px-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">Members</p>
      {loading ? (
        <Spinner label="Loading team…" />
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-3">
          {sortedMembers.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              isSelf={m.user_id === user?.id}
              grants={grantMap.get(m.id) ?? new Set()}
              canManage={canManage}
              onToggleCap={toggleCap}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}
