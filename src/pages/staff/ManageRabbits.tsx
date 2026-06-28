import { useCallback, useEffect, useState } from 'react'
import { supabase, errMessage } from '../../lib/supabase'
import { useStaff, staffInput, Spinner } from '../../lib/staff'
import { btn } from '../../components/ui'

interface RabbitRow {
  id: string
  name: string
  status: string
  sex: string | null
  age: string | null
  breed: string | null
  bonded: boolean
  description: string | null
  photos: string[] | null
  is_published: boolean
}

interface Draft {
  name: string
  status: string
  sex: string
  age: string
  breed: string
  bonded: boolean
  description: string
  photos: string[]
  is_published: boolean
}

const STATUSES = ['Available', 'Pending', 'Adopted']
const AGES = ['', 'Baby', 'Young', 'Adult', 'Senior']
const SEXES = ['', 'Male', 'Female', 'Unknown']
const empty: Draft = { name: '', status: 'Available', sex: '', age: '', breed: '', bonded: false, description: '', photos: [], is_published: true }

function fromRow(r: RabbitRow): Draft {
  return {
    name: r.name,
    status: r.status,
    sex: r.sex ?? '',
    age: r.age ?? '',
    breed: r.breed ?? '',
    bonded: r.bonded,
    description: r.description ?? '',
    photos: r.photos ?? [],
    is_published: r.is_published,
  }
}

async function uploadPhoto(file: File, userId: string): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('rabbit-photos').upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('rabbit-photos').getPublicUrl(path).data.publicUrl
}

function PhotoUploader({ photos, userId, onChange }: { photos: string[]; userId: string; onChange: (p: string[]) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setBusy(true)
    setError(null)
    try {
      const urls: string[] = []
      for (const f of Array.from(files)) urls.push(await uploadPhoto(f, userId))
      onChange([...photos, ...urls])
    } catch (e) {
      setError(errMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <div>
      <span className="text-sm font-semibold text-slate-700">Photos</span>
      {photos.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <div key={p} className="relative">
              <img src={p} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200" />
              {i === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-brand-blue px-1.5 py-0.5 text-[10px] font-bold text-white">Cover</span>
              ) : (
                <button type="button" onClick={() => onChange([p, ...photos.filter((x) => x !== p)])} className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-brand-blue shadow">
                  Cover
                </button>
              )}
              <button type="button" onClick={() => onChange(photos.filter((x) => x !== p))} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <label className={`mt-2 inline-block cursor-pointer rounded-full border border-slate-200 px-3.5 py-2 text-sm font-bold text-brand-blue hover:bg-slate-50 ${busy ? 'opacity-60' : ''}`}>
        {busy ? 'Uploading…' : photos.length ? 'Add more photos' : 'Upload photos'}
        <input type="file" accept="image/*" multiple disabled={busy} className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </label>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}

function Form({ initial, userId, submitLabel, onSubmit, onCancel }: { initial: Draft; userId: string; submitLabel: string; onSubmit: (d: Draft) => Promise<void>; onCancel: () => void }) {
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
      <div className="flex flex-wrap gap-3">
        <label className="block flex-1 text-sm font-semibold text-slate-700">
          Name
          <input className={staffInput} required value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
        </label>
        <label className="block w-32 text-sm font-semibold text-slate-700">
          Status
          <select className={staffInput} value={d.status} onChange={(e) => setD({ ...d, status: e.target.value })}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="block flex-1 text-sm font-semibold text-slate-700">
          Age
          <select className={staffInput} value={d.age} onChange={(e) => setD({ ...d, age: e.target.value })}>
            {AGES.map((a) => <option key={a} value={a}>{a || '—'}</option>)}
          </select>
        </label>
        <label className="block flex-1 text-sm font-semibold text-slate-700">
          Sex
          <select className={staffInput} value={d.sex} onChange={(e) => setD({ ...d, sex: e.target.value })}>
            {SEXES.map((s) => <option key={s} value={s}>{s || '—'}</option>)}
          </select>
        </label>
        <label className="block flex-1 text-sm font-semibold text-slate-700">
          Breed
          <input className={staffInput} value={d.breed} onChange={(e) => setD({ ...d, breed: e.target.value })} />
        </label>
      </div>
      <PhotoUploader photos={d.photos} userId={userId} onChange={(photos) => setD({ ...d, photos })} />
      <label className="block text-sm font-semibold text-slate-700">
        About this rabbit
        <textarea className={staffInput} rows={3} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
      </label>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-blue" checked={d.bonded} onChange={(e) => setD({ ...d, bonded: e.target.checked })} /> Bonded pair
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-blue" checked={d.is_published} onChange={(e) => setD({ ...d, is_published: e.target.checked })} /> Show on the site
        </label>
      </div>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy || !d.name.trim()} className={`${btn.orange} disabled:opacity-60`}>{busy ? 'Saving…' : submitLabel}</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
      </div>
    </form>
  )
}

export default function ManageRabbits() {
  const { membership, user, can } = useStaff()
  const orgId = membership?.orgId ?? ''
  const userId = user?.id ?? ''
  const canCreate = can('adoptions.listings.create')
  const canEdit = can('adoptions.listings.edit')

  const [items, setItems] = useState<RabbitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!orgId) return
    setError(null)
    const { data, error } = await supabase
      .from('rabbits')
      .select('id,name,status,sex,age,breed,bonded,description,photos,is_published')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
    if (error) setError(errMessage(error))
    else setItems((data ?? []) as RabbitRow[])
    setLoading(false)
  }, [orgId])

  useEffect(() => {
    load()
  }, [load])

  const payload = (d: Draft) => ({
    name: d.name.trim(),
    status: d.status,
    sex: d.sex || null,
    age: d.age || null,
    breed: d.breed.trim() || null,
    bonded: d.bonded,
    description: d.description.trim() || null,
    photos: d.photos,
    is_published: d.is_published,
  })

  const create = async (d: Draft) => {
    const { error } = await supabase.from('rabbits').insert({ org_id: orgId, created_by: userId, ...payload(d) })
    if (error) throw error
    setCreating(false)
    await load()
  }
  const saveEdit = (id: string) => async (d: Draft) => {
    const { error } = await supabase.from('rabbits').update(payload(d)).eq('id', id)
    if (error) throw error
    setEditingId(null)
    await load()
  }
  const remove = async (id: string) => {
    const { error } = await supabase.from('rabbits').delete().eq('id', id)
    if (error) setError(errMessage(error))
    else await load()
  }

  if (!canCreate && !canEdit && !can('adoptions.status.change'))
    return <p className="text-slate-600">You don't have access to manage adoptable rabbits.</p>

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black text-ink">Adoptable rabbits</h1>
        {canCreate && !creating && <button onClick={() => setCreating(true)} className={btn.orange}>Add a rabbit</button>}
      </div>
      <p className="mt-1 text-sm text-slate-600">These show on the website's Adopt page and the app.</p>

      {creating && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Form initial={empty} userId={userId} submitLabel="Add rabbit" onSubmit={create} onCancel={() => setCreating(false)} />
        </div>
      )}

      {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <p className="mt-6 text-slate-600">No rabbits yet. {canCreate ? 'Add the first one above.' : ''}</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((r) =>
            editingId === r.id ? (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Form initial={fromRow(r)} userId={userId} submitLabel="Save" onSubmit={saveEdit(r.id)} onCancel={() => setEditingId(null)} />
              </div>
            ) : (
              <div key={r.id} className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {r.photos?.[0] ? <img src={r.photos[0]} alt={r.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-display text-2xl font-black text-slate-300">{r.name[0]}</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-extrabold text-ink">{r.name}</h3>
                    {!r.is_published && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">Hidden</span>}
                    <span className="rounded-full bg-brand-blue-50 px-2 py-0.5 text-xs font-bold text-brand-blue">{r.status}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{[r.age, r.sex, r.breed].filter(Boolean).join(' · ')}</p>
                  {canEdit && (
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setEditingId(r.id)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Edit</button>
                      <button onClick={() => remove(r.id)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
