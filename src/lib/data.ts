import { useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabase'
import type { Rabbit, Announcement } from './types'
import { sampleRabbits } from '../data/sampleRabbits'

export type RabbitsSource = 'live' | 'sample'

interface RabbitRow {
  id: string
  name: string
  status: string | null
  sex: string | null
  age: string | null
  breed: string | null
  size: string | null
  bonded: boolean
  description: string | null
  photos: string[] | null
}

// Featured adoptable rabbits. Pulls the live list from the SAME Supabase the app
// uses; falls back to the bundled samples when none are published yet.
export function useFeaturedRabbits(limit = 6): { rabbits: Rabbit[] | null; source: RabbitsSource } {
  const [rabbits, setRabbits] = useState<Rabbit[] | null>(null)
  const [source, setSource] = useState<RabbitsSource>('sample')

  useEffect(() => {
    let active = true
    ;(async () => {
      if (isConfigured) {
        const { data } = await supabase
          .from('rabbits')
          .select('id,name,status,sex,age,breed,size,bonded,description,photos')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .limit(limit)
        const rows = (data ?? []) as RabbitRow[]
        if (active && rows.length > 0) {
          setRabbits(rows.map((r) => ({ ...r, photos: r.photos ?? [], photo: r.photos?.[0] })))
          setSource('live')
          return
        }
      }
      if (active) {
        setRabbits(sampleRabbits.slice(0, limit))
        setSource('sample')
      }
    })()
    return () => {
      active = false
    }
  }, [limit])

  return { rabbits, source }
}

// Live staff-posted announcements (hidden when there are none).
export function useAnnouncements(): Announcement[] {
  const [items, setItems] = useState<Announcement[]>([])
  useEffect(() => {
    if (!isConfigured) return
    let active = true
    supabase
      .from('announcements')
      .select('id,title,body')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (active && data) setItems(data as Announcement[])
      })
    return () => {
      active = false
    }
  }, [])
  return items
}
