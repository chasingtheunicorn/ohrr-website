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
