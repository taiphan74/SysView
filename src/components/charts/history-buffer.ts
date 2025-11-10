const HISTORY_LENGTH = 200

const roundUsage = (value: number) => Number(value.toFixed(1))

export const createEmptyHistory = () =>
  Array.from({ length: HISTORY_LENGTH }, () => null as number | null)

export const normalizeHistory = (values: number[]) => {
  const buffer = createEmptyHistory()
  if (!values.length) return buffer

  const recent = values.slice(-HISTORY_LENGTH)
  const startIndex = HISTORY_LENGTH - recent.length

  recent.forEach((value, idx) => {
    buffer[startIndex + idx] = roundUsage(value)
  })

  return buffer
}

const ensureLength = (history: Array<number | null>) => {
  if (history.length === HISTORY_LENGTH) return history
  const buffer = createEmptyHistory()
  const recent = history.slice(-HISTORY_LENGTH)
  const startIndex = HISTORY_LENGTH - recent.length
  recent.forEach((value, idx) => {
    buffer[startIndex + idx] = value
  })
  return buffer
}

export const pushHistoryValue = (
  history: Array<number | null>,
  value: number,
) => {
  const rounded = roundUsage(value)
  const safeHistory = ensureLength(history)
  return [...safeHistory.slice(1), rounded]
}

export const hasHistorySamples = (history: Array<number | null>) =>
  history.some(value => typeof value === "number")

export const HISTORY_CAP = HISTORY_LENGTH
