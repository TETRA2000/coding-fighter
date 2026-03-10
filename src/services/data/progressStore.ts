import Dexie, { type EntityTable } from 'dexie'
import type { ProgressState, PlayerProfile, ScoreSubmission, LeaderboardEntry, SyncQueueItem } from '../../types/game'

interface ProgressRecord {
  id?: number
  data: ProgressState
}

interface ProfileRecord {
  id?: number
  data: PlayerProfile
}

interface ScoreRecord {
  id?: number
  score: number
  levelsCompleted: number
  submittedAt: string
  synced: boolean
}

interface LeaderboardCacheRecord {
  rank: number
  playerName: string
  score: number
  levelsCompleted: number
  cachedAt: string
}

class GameDatabase extends Dexie {
  progress!: EntityTable<ProgressRecord, 'id'>
  profile!: EntityTable<ProfileRecord, 'id'>
  scores!: EntityTable<ScoreRecord, 'id'>
  syncQueue!: EntityTable<SyncQueueItem, 'id'>
  leaderboardCache!: EntityTable<LeaderboardCacheRecord, 'rank'>

  constructor() {
    super('CodingFighterDB')
    this.version(1).stores({
      progress: '++id',
      profile: '++id',
      scores: '++id, synced',
      syncQueue: '++id',
      leaderboardCache: 'rank',
    })
  }
}

export const db = new GameDatabase()

export async function saveProgress(state: ProgressState): Promise<void> {
  const existing = await db.progress.toArray()
  if (existing.length > 0) {
    await db.progress.update(existing[0].id!, { data: state })
  } else {
    await db.progress.add({ data: state })
  }
}

export async function loadProgress(): Promise<ProgressState | null> {
  const records = await db.progress.toArray()
  return records.length > 0 ? records[0].data : null
}

export async function savePlayerProfile(profile: PlayerProfile): Promise<void> {
  const existing = await db.profile.toArray()
  if (existing.length > 0) {
    await db.profile.update(existing[0].id!, { data: profile })
  } else {
    await db.profile.add({ data: profile })
  }
}

export async function loadPlayerProfile(): Promise<PlayerProfile | null> {
  const records = await db.profile.toArray()
  return records.length > 0 ? records[0].data : null
}

export async function addToSyncQueue(payload: ScoreSubmission): Promise<void> {
  await db.syncQueue.add({
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  })
}

export async function getPendingSyncItems(): Promise<SyncQueueItem[]> {
  return db.syncQueue.toArray()
}

export async function removeSyncItem(id: number): Promise<void> {
  await db.syncQueue.delete(id)
}

export async function incrementRetryCount(id: number): Promise<void> {
  const item = await db.syncQueue.get(id)
  if (item) {
    await db.syncQueue.update(id, { retryCount: item.retryCount + 1 })
  }
}

export async function cacheLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  await db.leaderboardCache.clear()
  const now = new Date().toISOString()
  await db.leaderboardCache.bulkAdd(
    entries.map((e) => ({
      rank: e.rank,
      playerName: e.playerName,
      score: e.score,
      levelsCompleted: e.levelsCompleted,
      cachedAt: now,
    }))
  )
}

export async function getCachedLeaderboard(): Promise<LeaderboardEntry[]> {
  const records = await db.leaderboardCache.orderBy('rank').toArray()
  return records.map((r) => ({
    rank: r.rank,
    playerName: r.playerName,
    score: r.score,
    levelsCompleted: r.levelsCompleted,
    submittedAt: r.cachedAt,
  }))
}
