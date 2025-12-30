import { nanoid } from "nanoid"

export function generateUniqueSlug(): string {
  return nanoid(10)
}
