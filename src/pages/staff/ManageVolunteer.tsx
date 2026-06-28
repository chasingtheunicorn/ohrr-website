import { useCallback, useEffect, useState } from 'react'
import { supabase, errMessage } from '../../lib/supabase'
import { useStaff, staffInput, Spinner } from '../../lib/staff'
import { btn } from '../../components/ui'

interface Opp {
  id: string
  category: string
  title: string
  detail: string | null
  when_text: string | null
  where_text: string | null
  spots: string | null
  is_published: boolean
  sort_order: number
}

interface Draft {
  category: string
  title: string
  detail: string
  when_text: string
  where_text: string
  spots: string
  is_published: boolean
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'socialization', label: 'Socialization shift' },
  { value: 'vet-transport', label: 'Vet-transport run' },
  { value: 'events', label: 'Event help' },
]
const catLabel = (v: string) => CATEGORIES.find((c) => c.value === v)?.label ?? v

const empty: Draft = {
  category: 'socialization',
  title: '',
  detail: '',
  when_text: '',
  where_text: '',
  spots: '',
  is_published: true,
}

function Form({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Draft
  submitLabel: string
  onSubmit: (d: Draft) => Promise<void>
  onCancel: () => void
}) {
  const [d, setD] = useState<Draft>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await onSubmit(d)
    } catch (err) {
      setError(errMessage(err))
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Type
          <select className={staffInput} value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Title
          <input className={staffInput} required value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. Saturday morning socializing" />
        </label>
      </div>
      <label className="block text-sm font-semibold text-slate-700">
        Details
        <textarea className={staffInput} rows={2} value={d.detail} onChange={(e) => setD({ ...d, detail: e.target.value })} placeholder="What the volunteer will do" />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-semibold text-slate-700">
          When
          <input className={staffInput} value={d.when_text} onChange={(e) => setD({ ...d, when_text: e.target.value })} placeholder="Sat 10am–12pm" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Where
          <input className={staffInput} value={d.where_text} onChange={(e) => setD({ ...d, where_text: e.target.value })} placeholder="Shelter / Columbus → vet" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Spots
          <input className={staffInput} value={d.spots} onChange={(e) => setD({ ...d, spots: e.target.value })} placeholder="2 open" />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-blue" checked={d.is_published} onChange={(e) => setD({ ...d, is_published: e.target.checked })} />
        Show on the site now (uncheck for a draft)
      </label>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy || !d.title.trim()} className={`${btn.orange} disabled:opacity-60`}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ManageVolunteer() {
  const { membership, user, can } = useStaff()
  const orgId = membership?.orgId ?? ''
  const userId = user?.id ?? ''
  const allowed = can('volunteers.shifts.manage')

  const [items, setItems] = useState<Opp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!orgId || !allowed) {
      setLoading(false)
      return
    }
    setError(null)
    const { data, error } = await supabase
      .from('volunteer_opportunities')
      .select('id,category,title,detail,when_text,where_text,spots,is_published,sort_order')
      .eq('org_id', orgId)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
    if (error) setError(errMessage(error))
    else setItems((data ?? []) as Opp[])
    setLoading(false)
  }, [orgId, allowed])

  useEffect(() => {
    load()
  }, [load])

  const toRow = (d: Draft) => ({
    category: d.category,
    title: d.title.trim(),
    detail: d.detail.trim() || null,
    when_text: d.when_text.trim() || null,
    where_text: d.where_text.trim() || null,
    spots: d.spots.trim() || null,
    is_published: d.is_published,
  })

  const create = async (d: Draft) => {
    const { error } = await supabase
      .from('volunteer_opportunities')
      .insert({ org_id: orgId, created_by: userId, ...toRow(d) })
    if (error) throw error
    setCreating(false)
    await load()
  }
  const saveEdit = (id: string) => async (d: Draft) => {
    const { error } = await supabase.from('volunteer_opportunities').update(toRow(d)).eq('id', id)
    if (error) throw error
    setEditingId(null)
    await load()
  }
  const remove = async (id: string) => {
    const { error } = await supabase.from('volunteer_opportunities').delete().eq('id', id)
    if (error) setError(errMessage(error))
    else await load()
  }
  const togglePublish = async (o: Opp) => {
    const { error } = await supabase.from('volunteer_opportunities').update({ is_published: !o.is_published }).eq('id', o.id)
    if (error) setError(errMessage(error))
    else await load()
  }

  if (!allowed) return <p className="text-slate-600">You don't have access to manage volunteer opportunities.</p>

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black text-ink">Volunteer opportunities</h1>
        {!creating && <button onClick={() => setCreating(true)} className={btn.orange}>New opportunity</button>}
      </div>
      <p className="mt-1 text-sm text-slate-600">Socialization shifts, vet-transport runs, and event help — these show on the website Volunteer page and the app.</p>

      {creating && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Form initial={empty} submitLabel="Add" onSubmit={create} onCancel={() => setCreating(false)} />
        </div>
      )}

      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <p className="mt-6 text-slate-600">No volunteer opportunities yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((o) =>
            editingId === o.id ? (
              <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Form
                  initial={{
                    category: o.category,
                    title: o.title,
                    detail: o.detail ?? '',
                    when_text: o.when_text ?? '',
                    where_text: o.where_text ?? '',
                    spots: o.spots ?? '',
                    is_published: o.is_published,
                  }}
                  submitLabel="Save"
                  onSubmit={saveEdit(o.id)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div key={o.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-brand-orange-50 px-2 py-0.5 text-xs font-bold text-brand-orange">{catLabel(o.category)}</span>
                    <h3 className="mt-1 font-display text-base font-extrabold text-ink">{o.title}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${o.is_published ? 'bg-brand-blue-50 text-brand-blue' : 'bg-slate-100 text-slate-500'}`}>
                    {o.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
                {o.detail && <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{o.detail}</p>}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {o.when_text && <span><strong className="text-slate-600">When:</strong> {o.when_text}</span>}
                  {o.where_text && <span><strong className="text-slate-600">Where:</strong> {o.where_text}</span>}
                  {o.spots && <span><strong className="text-slate-600">Spots:</strong> {o.spots}</span>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => togglePublish(o)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                    {o.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => setEditingId(o.id)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Edit</button>
                  <button onClick={() => remove(o.id)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
