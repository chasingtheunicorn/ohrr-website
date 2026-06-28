import { useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabase'
import type { Rabbit, Announcement, CareArticle, VolunteerOpp } from './types'
import { sampleRabbits } from '../data/sampleRabbits'

export type Source = 'live' | 'sample'

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

function mapRabbit(r: RabbitRow): Rabbit {
  return { ...r, photos: r.photos ?? [], photo: r.photos?.[0] }
}

// Adoptable rabbits from the SAME Supabase the app uses; falls back to samples.
export function useRabbits(limit = 60): { rabbits: Rabbit[] | null; source: Source } {
  const [rabbits, setRabbits] = useState<Rabbit[] | null>(null)
  const [source, setSource] = useState<Source>('sample')
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
          setRabbits(rows.map(mapRabbit))
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

export function useFeaturedRabbits(limit = 6) {
  return useRabbits(limit)
}

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

// Live care guides from the app's care_articles table (null while loading).
export function useCareArticles(): CareArticle[] | null {
  const [items, setItems] = useState<CareArticle[] | null>(null)
  useEffect(() => {
    if (!isConfigured) {
      setItems([])
      return
    }
    let active = true
    supabase
      .from('care_articles')
      .select('id,slug,title,icon,summary,tip')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (active) setItems((data ?? []) as CareArticle[])
      })
    return () => {
      active = false
    }
  }, [])
  return items
}

// Live volunteer opportunities (null while loading).
export function useVolunteerOpps(): VolunteerOpp[] | null {
  const [items, setItems] = useState<VolunteerOpp[] | null>(null)
  useEffect(() => {
    if (!isConfigured) {
      setItems([])
      return
    }
    let active = true
    supabase
      .from('volunteer_opportunities')
      .select('id,category,title,detail,when_text,where_text,spots')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (active) setItems((data ?? []) as VolunteerOpp[])
      })
    return () => {
      active = false
    }
  }, [])
  return items
}
