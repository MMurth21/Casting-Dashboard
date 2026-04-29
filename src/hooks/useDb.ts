import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Project, type Role, type Actor, type Casting } from '../db'

// ── Projects ─────────────────────────────────────────────────────────────────

export function useProjects() {
  const projects = useLiveQuery(() => db.projects.orderBy('createdAt').toArray(), [])

  async function addProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Date.now()
    return db.projects.add({ ...data, createdAt: now, updatedAt: now } as Project)
  }

  async function updateProject(id: number, changes: Partial<Omit<Project, 'id' | 'createdAt'>>) {
    return db.projects.update(id, { ...changes, updatedAt: Date.now() })
  }

  async function deleteProject(id: number) {
    await db.transaction('rw', db.projects, db.roles, db.actors, db.castings, async () => {
      const roleIds = (await db.roles.where('projectId').equals(id).toArray()).map(r => r.id)
      await db.castings.where('projectId').equals(id).delete()
      await db.actors.where('projectId').equals(id).delete()
      await db.roles.where('projectId').equals(id).delete()
      await db.projects.delete(id)
      return roleIds
    })
  }

  return { projects: projects ?? [], addProject, updateProject, deleteProject }
}

// ── Single Project ────────────────────────────────────────────────────────────

export function useProject(id: number) {
  const project = useLiveQuery(() => db.projects.get(id), [id])

  async function update(changes: Partial<Omit<Project, 'id' | 'createdAt'>>) {
    return db.projects.update(id, { ...changes, updatedAt: Date.now() })
  }

  return { project, update }
}

// ── Roles ─────────────────────────────────────────────────────────────────────

export function useRoles(projectId: number) {
  const roles = useLiveQuery(
    () => db.roles.where('projectId').equals(projectId).toArray(),
    [projectId]
  )

  async function addRole(data: Omit<Role, 'id' | 'projectId'>) {
    return db.roles.add({ ...data, projectId } as Role)
  }

  async function updateRole(id: number, changes: Partial<Omit<Role, 'id' | 'projectId'>>) {
    return db.roles.update(id, changes)
  }

  async function deleteRole(id: number) {
    await db.transaction('rw', db.roles, db.castings, async () => {
      await db.castings.where('roleId').equals(id).delete()
      await db.roles.delete(id)
    })
  }

  return { roles: roles ?? [], addRole, updateRole, deleteRole }
}

// ── Actors ────────────────────────────────────────────────────────────────────

export function useActors(projectId: number) {
  const actors = useLiveQuery(
    () => db.actors.where('projectId').equals(projectId).toArray(),
    [projectId]
  )

  async function addActor(data: Omit<Actor, 'id' | 'projectId'>) {
    return db.actors.add({ ...data, projectId } as Actor)
  }

  async function updateActor(id: number, changes: Partial<Omit<Actor, 'id' | 'projectId'>>) {
    return db.actors.update(id, changes)
  }

  async function deleteActor(id: number) {
    await db.transaction('rw', db.actors, db.castings, async () => {
      await db.castings.where('actorId').equals(id).delete()
      await db.actors.delete(id)
    })
  }

  return { actors: actors ?? [], addActor, updateActor, deleteActor }
}

// ── Castings ──────────────────────────────────────────────────────────────────

export function useCastings(roleId: number) {
  const castings = useLiveQuery(
    () => db.castings.where('roleId').equals(roleId).toArray(),
    [roleId]
  )

  async function assign(actorId: number, projectId: number) {
    const existing = await db.castings
      .where('[roleId+actorId]')
      .equals([roleId, actorId])
      .first()
    if (existing) return existing.id
    return db.castings.add({ roleId, actorId, projectId, assignedAt: Date.now() } as Casting)
  }

  async function unassign(actorId: number) {
    await db.castings
      .where('[roleId+actorId]')
      .equals([roleId, actorId])
      .delete()
  }

  async function clearRole() {
    await db.castings.where('roleId').equals(roleId).delete()
  }

  return { castings: castings ?? [], assign, unassign, clearRole }
}
