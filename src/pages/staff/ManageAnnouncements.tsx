import { useCallback, useEffect, useState } from 'react'
import { supabase, errMessage } from '../../lib/supabase'
import { useStaff, staffInput, Spinner } from '../../lib/staff'
import { btn } from '../../components/ui'

interface Ann {
  id: string
  title: string
  body: string
  is_published: boolean
  updated_at: string
}

interface Draft {
  title: string
  body: string
  is_published: boolean
}

const empty: Draft = { title: '', body: '', is_published: true }

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
      <label className="block text-sm font-semibold text-slate-700">
        Title
        <input className={staffInput} required value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. Closed this Saturday" />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Message
        <textarea className={staffInput} rows={3} required value={d.body} onChange={(e) => setD({ ...d, body: e.target.value })} />
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-blue" checked={d.is_published} onChange={(e) => setD({ ...d, is_published: e.target.checked })} />
        Show on the site now (uncheck for a draft)
      </label>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy || !d.title.trim() || !d.body.trim()} className={`${btn.orange} disabled:opacity-60`}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function ManageAnnouncements() {
  const { membership, user, can } = useStaff()
  const orgId = membership?.orgId ?? ''
  const userId = user?.id ?? ''
  const allowed = can('announcements.post')

  const [items, setItems] = useState<Ann[]>([])
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
      .from('announcements')
      .select('id,title,body,is_published,updated_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
    if (error) setError(errMessage(error))
    else setItems((data ?? []) as Ann[])
    setLoading(false)
  }, [orgId, allowed])

  useEffect(() => {
    load()
  }, [load])

  const create = async (d: Draft) => {
    const { error } = await supabase
      .from('announcements')
      .insert({ org_id: orgId, title: d.title.trim(), body: d.body.trim(), is_published: d.is_published, created_by: userId })
    if (error) throw error
    setCreating(false)
    await load()
  }
  const saveEdit = (id: string) => async (d: Draft) => {
    const { error } = await supabase
      .from('announcements')
      .update({ title: d.title.trim(), body: d.body.trim(), is_published: d.is_published })
      .eq('id', id)
    if (error) throw error
    setEditingId(null)
    await load()
  }
  const remove = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) setError(errMessage(error))
    else await load()
  }
  const togglePublish = async (a: Ann) => {
    const { error } = await supabase.from('announcements').update({ is_published: !a.is_published }).eq('id', a.id)
    if (error) setError(errMessage(error))
    else await load()
  }

  if (!allowed)
    return <p className="text-slate-600">You don't have access to post announcements.</p>

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black text-ink">Announcements</h1>
        {!creating && (
          <button onClick={() => setCreating(true)} className={btn.orange}>New announcement</button>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-600">These show on the website home and the app.</p>

      {creating && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Form initial={empty} submitLabel="Post" onSubmit={create} onCancel={() => setCreating(false)} />
        </div>
      )}

      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <p className="mt-6 text-slate-600">No announcements yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((a) =>
            editingId === a.id ? (
              <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Form initial={{ title: a.title, body: a.body, is_published: a.is_published }} submitLabel="Save" onSubmit={saveEdit(a.id)} onCancel={() => setEditingId(null)} />
              </div>
            ) : (
              <div key={a.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-extrabold text-ink">{a.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${a.is_published ? 'bg-brand-blue-50 text-brand-blue' : 'bg-slate-100 text-slate-500'}`}>
                    {a.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{a.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => togglePublish(a)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                    {a.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => setEditingId(a.id)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                    Edit
                  </button>
                  <button onClick={() => remove(a.id)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
