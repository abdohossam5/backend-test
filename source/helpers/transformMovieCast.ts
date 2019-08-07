export const DEFAULT_GENRE_DELIMITER = ","
export const DEFAULT_GENRE_STRING = "N/A"

const transformCast = (
  rawCast?: string | string[] | null,
  delimiter = DEFAULT_GENRE_DELIMITER,
): string[] => {
  if (typeof rawCast === 'string') {
    return (rawCast || DEFAULT_GENRE_STRING).split(delimiter).filter(Boolean)
  } else if (Array.isArray(rawCast)) {
    return rawCast
  }
  return []
}

export default transformCast
