import { describe, expect, it } from 'vitest'
import type { GatewaySession } from '@/lib/gateway-api'
import { isRecentConductorSession } from './use-conductor-gateway'

function buildSession(overrides: Partial<GatewaySession>): GatewaySession {
  return {
    key: 'session-1',
    label: 'general-session',
    title: 'General session',
    updatedAt: '2026-05-25T18:33:38.000Z',
    ...overrides,
  }
}

describe('isRecentConductorSession', () => {
  const cutoffMs = new Date('2026-05-24T18:33:38.000Z').getTime()

  it('includes worker lanes in the recent missions fallback', () => {
    expect(
      isRecentConductorSession(
        buildSession({
          label: 'worker-builder',
          updatedAt: '2026-05-25T18:33:38.000Z',
        }),
        cutoffMs,
      ),
    ).toBe(true)
  })

  it('excludes unrelated cron sessions from the conductor recent list', () => {
    expect(
      isRecentConductorSession(
        buildSession({
          key: 'cron:job:123',
          label: 'Cron B7e91afb51a9 20260525 183338',
          title: 'Hermes updated',
          preview: 'What changed in this update.',
          updatedAt: '2026-05-25T18:33:38.000Z',
        }),
        cutoffMs,
      ),
    ).toBe(false)
  })

  it('keeps conductor-tagged subagent sessions', () => {
    expect(
      isRecentConductorSession(
        buildSession({
          key: 'mission:subagent:42',
          label: 'assistant',
          title: 'Mission orchestrator',
          preview: 'Conductor mission for landing page polish',
          updatedAt: '2026-05-25T18:33:38.000Z',
        }),
        cutoffMs,
      ),
    ).toBe(true)
  })

  it('drops stale sessions outside the 24 hour window', () => {
    expect(
      isRecentConductorSession(
        buildSession({
          label: 'worker-builder',
          updatedAt: '2026-05-23T18:33:38.000Z',
        }),
        cutoffMs,
      ),
    ).toBe(false)
  })
})
