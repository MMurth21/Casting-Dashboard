import { db } from './db'
import castingData from './data/actors'

const ROLE_ACCENT: Record<string, string> = {
  'Rey Skywalker':          'navy',
  'Kaelen Sol':             'blue',
  'Vaneen Kor':             'red',
  'Jaxen Vane':             'red',
  'Chancellor Aris Thorne': 'blue',
  'T-0':                    'yellow',
}

export async function seedEchoes(): Promise<void> {
  const existing = await db.projects.where('name').equals('Project Echoes').first()
  if (existing) return

  const now = Date.now()

  await db.transaction('rw', db.projects, db.roles, db.actors, db.castings, async () => {

    // ── Project ───────────────────────────────────────────────────────────
    const projectId = (await db.projects.add({
      name:        'Project Echoes',
      studio:      'Disney / Lucasfilm',
      genre:       'Sci-Fi',
      budgetLimit: 70_000_000,
      createdAt:   now,
      updatedAt:   now,
    } as any)) as number

    // ── Roles ─────────────────────────────────────────────────────────────
    const roleIdMap: Record<string, number> = {}

    for (const [roleName, roleData] of Object.entries(castingData.roles) as [string, any][]) {
      const roleId = (await db.roles.add({
        projectId,
        name:        roleName,
        subtitle:    roleData.subtitle   ?? '',
        bio:         roleData.bio        ?? '',
        isLocked:    roleData.isLocked   ?? false,
        shadow:      roleData.shadow     ?? false,
        accentColor: ROLE_ACCENT[roleName] ?? 'blue',
      } as any)) as number
      roleIdMap[roleName] = roleId
    }

    // ── Actors ────────────────────────────────────────────────────────────
    const actorIdMap: Record<string, number> = {}

    for (const actor of castingData.actors as any[]) {
      const actorId = (await db.actors.add({
        projectId,
        roleName:            actor.role,
        name:                actor.name,
        rtScore:             actor.stats.rtScore,
        cost:                actor.stats.cost,
        divaRating:          actor.stats.divaRating,
        ethnicity:           actor.background.ethnicity,
        currentEvents:       actor.background.currentEvents,
        currentEventsReason: actor.metadata.currentEventsReason ?? '',
        tapeNotes:           actor.metadata.tapeNotes           ?? '',
        type:                actor.metadata.type                ?? '',
        agency:              actor.metadata.agency              ?? '',
        availability:        actor.metadata.availability        ?? '',
        availabilityWindow:  actor.metadata.availabilityWindow  ?? '',
        strengths:           actor.metadata.strengths           ?? [],
        genreExperience:     actor.metadata.genreExperience     ?? [],
        articles:            actor.metadata.articles            ?? [],
      } as any)) as number
      actorIdMap[actor.id] = actorId
    }

    // ── Castings (only Daisy Ridley / Rey is assigned at launch) ─────────
    for (const [roleName, roleData] of Object.entries(castingData.roles) as [string, any][]) {
      if (!roleData.assignedActorId) continue
      const roleId  = roleIdMap[roleName]
      const actorId = actorIdMap[roleData.assignedActorId]
      if (roleId && actorId) {
        await db.castings.add({
          projectId,
          roleId,
          actorId,
          assignedAt: now,
        } as any)
      }
    }
  })
}
