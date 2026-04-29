import Dexie, { type EntityTable } from 'dexie'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: number
  name: string
  studio: string
  genre: string
  budgetLimit: number
  createdAt: number
  updatedAt: number
}

export interface Role {
  id: number
  projectId: number
  name: string
  subtitle: string
  bio: string
  isLocked: boolean
  shadow: boolean
  accentColor: 'blue' | 'red' | 'yellow' | 'navy' | string
}

export interface Article {
  headline: string
  publication: string
  url: string
}

export interface Actor {
  id: number
  projectId: number
  /** Role name this actor is a candidate for — matches Role.name */
  roleName: string
  name: string
  rtScore: number
  cost: number
  divaRating: number
  ethnicity: string
  currentEvents: 'Positive' | 'Neutral' | 'Negative'
  currentEventsReason: string
  tapeNotes: string
  type: string
  agency: string
  availability: string
  availabilityWindow: string
  strengths: string[]
  genreExperience: string[]
  articles: Article[]
  photoDataUrl?: string
  notes?: string
}

export interface Casting {
  id: number
  projectId: number
  roleId: number
  actorId: number
  assignedAt: number
}

// ── Database ─────────────────────────────────────────────────────────────────

class CastingDB extends Dexie {
  projects!: EntityTable<Project, 'id'>
  roles!:    EntityTable<Role,    'id'>
  actors!:   EntityTable<Actor,   'id'>
  castings!: EntityTable<Casting, 'id'>

  constructor() {
    super('CastingDirectorDB')

    this.version(1).stores({
      projects: '++id, name, createdAt',
      roles:    '++id, projectId, name',
      actors:   '++id, projectId, roleName',
      castings: '++id, projectId, roleId, actorId, [roleId+actorId]',
    })
  }
}

export const db = new CastingDB()
