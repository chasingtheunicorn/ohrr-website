export interface Rabbit {
  id: string
  name: string
  status?: string | null
  sex?: string | null
  age?: string | null
  breed?: string | null
  size?: string | null
  bonded?: boolean
  description?: string | null
  photo?: string
  photos?: string[]
}

export interface Announcement {
  id: string
  title: string
  body: string
}

export interface CareArticle {
  id: string
  slug: string
  title: string
  icon: string
  summary: string
  tip?: string | null
}

export interface VolunteerOpp {
  id: string
  category: string
  title: string
  detail?: string | null
  when_text?: string | null
  where_text?: string | null
  spots?: string | null
}
