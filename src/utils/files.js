export const MAX_FILES = 5
export const MAX_MB = 10

export const formatSize = (b = 0) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`

/** Colour family used for the file icon: pdf = red, image = green, everything else = yellow. */
export const kindOf = (f) =>
  f.type === 'application/pdf' || /\.pdf$/i.test(f.name) ? 'red' : f.type?.startsWith('image/') ? 'green' : 'yellow'

/** Only this is saved with a message (File objects can't live in localStorage). */
export const toMeta = (f) => ({ name: f.name, size: f.size, type: f.type })

/** Splits incoming files into accepted ones and human-readable rejection reasons. */
export function validate(current, incoming) {
  const accepted = []
  const rejected = []
  for (const f of incoming) {
    if (current.some((c) => c.name === f.name && c.size === f.size)) continue
    if (current.length + accepted.length >= MAX_FILES) rejected.push(`${f.name}: the limit is ${MAX_FILES} files`)
    else if (f.size > MAX_MB * 1048576) rejected.push(`${f.name}: larger than ${MAX_MB} MB`)
    else accepted.push(f)
  }
  return { accepted, rejected }
}