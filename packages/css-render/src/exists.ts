/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { MountId, SsrAdapter } from './types'
import { queryElement } from './utils'

export function exists (id: MountId, ssr?: SsrAdapter): boolean {
  if (id === undefined) return false
  if (ssr) {
    const {
      context: { ids }
    } = ssr
    return ids.has(id)
  }
  return queryElement(id) !== null
}
